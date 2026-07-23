import { createClient } from '../../../lib/supabase/server';
import { createContact } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminContactsPage() {
  const supabase = createClient();
  const [{ data: contacts }, { data: companies }] = await Promise.all([
    supabase
      .from('contacts')
      .select('id, name, email, phone, created_at, companies(name)')
      .order('created_at', { ascending: false }),
    supabase.from('companies').select('id, name').order('name'),
  ]);

  const contactList = contacts || [];
  const companyList = companies || [];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Contacts</h1>
        <p>{contactList.length} {contactList.length === 1 ? 'contact' : 'contacts'}</p>
      </header>

      <form action={createContact} className="admin-inline-form">
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="phone" placeholder="Phone (optional)" />
        <select name="company_id" defaultValue="">
          <option value="">No company</option>
          {companyList.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-solid">Add contact</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th></tr>
        </thead>
        <tbody>
          {contactList.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone || '—'}</td>
              <td>{contact.companies?.name || '—'}</td>
            </tr>
          ))}
          {contactList.length === 0 ? <tr><td colSpan={4}>No contacts yet.</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}
