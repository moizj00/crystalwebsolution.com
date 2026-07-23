import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';
import { createClientLogin } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function AdminCompanyDetailPage({ params }) {
  const supabase = createClient();

  const [{ data: company }, { data: contacts }, { data: deals }, { data: clientProfiles }] = await Promise.all([
    supabase.from('companies').select('id, name, domain, industry, notes').eq('id', params.id).single(),
    supabase.from('contacts').select('id, name, email, phone').eq('company_id', params.id).order('name'),
    supabase
      .from('deals')
      .select('id, title, stage, budget_range')
      .eq('company_id', params.id)
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, full_name').eq('company_id', params.id).eq('role', 'client'),
  ]);

  if (!company) notFound();

  const contactList = contacts || [];
  const dealList = deals || [];
  const clientList = clientProfiles || [];
  const createLogin = createClientLogin.bind(null, params.id);

  return (
    <div className="admin-page">
      <p className="admin-back"><Link href="/admin/companies">&larr; Companies</Link></p>
      <header className="admin-page-header">
        <h1>{company.name}</h1>
        <p>{company.domain || 'No domain on file'}{company.industry ? ` · ${company.industry}` : ''}</p>
      </header>

      <section className="admin-section">
        <h2>Contacts</h2>
        <ul className="admin-list">
          {contactList.map((contact) => <li key={contact.id}>{contact.name} — {contact.email}</li>)}
          {contactList.length === 0 ? <li>No contacts yet.</li> : null}
        </ul>
      </section>

      <section className="admin-section">
        <h2>Deals</h2>
        <ul className="admin-list">
          {dealList.map((deal) => (
            <li key={deal.id}><Link href={`/admin/deals/${deal.id}`}>{deal.title}</Link> — {deal.stage}</li>
          ))}
          {dealList.length === 0 ? <li>No deals yet.</li> : null}
        </ul>
      </section>

      <section className="admin-section">
        <h2>Client portal access</h2>
        {clientList.length > 0 ? (
          <ul className="admin-list">
            {clientList.map((profile) => <li key={profile.id}>{profile.full_name || 'Client'} has portal access</li>)}
          </ul>
        ) : (
          <p className="admin-muted">No client login yet — create one so this company can view its project status.</p>
        )}
        <form action={createLogin} className="admin-inline-form">
          <input name="full_name" placeholder="Full name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Temporary password" required minLength={8} />
          <button type="submit" className="btn btn-solid">Create client login</button>
        </form>
      </section>
    </div>
  );
}
