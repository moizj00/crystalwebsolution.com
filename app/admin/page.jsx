import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';
import { DEAL_STAGES, DEAL_STAGE_LABELS } from '../../lib/crm/constants';
import { createDeal } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPipelinePage() {
  const supabase = createClient();
  const [{ data: deals }, { data: companies }, { data: contacts }] = await Promise.all([
    supabase
      .from('deals')
      .select('id, title, stage, value, budget_range, created_at, companies(name), contacts(name, email)')
      .order('created_at', { ascending: false }),
    supabase.from('companies').select('id, name').order('name'),
    supabase.from('contacts').select('id, name').order('name'),
  ]);

  const dealList = deals || [];
  const companyList = companies || [];
  const contactList = contacts || [];
  const byStage = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage] = dealList.filter((deal) => deal.stage === stage);
    return acc;
  }, {});

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Pipeline</h1>
        <p>{dealList.length} total {dealList.length === 1 ? 'deal' : 'deals'}</p>
      </header>

      <form action={createDeal} className="admin-inline-form">
        <input name="title" placeholder="Deal title" required />
        <select name="company_id" defaultValue="">
          <option value="">No company</option>
          {companyList.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
        </select>
        <select name="contact_id" defaultValue="">
          <option value="">No contact</option>
          {contactList.map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}
        </select>
        <input name="budget_range" placeholder="Budget (optional)" />
        <button type="submit" className="btn btn-solid">Add deal</button>
      </form>

      <div className="pipeline-board">
        {DEAL_STAGES.map((stage) => (
          <section className="pipeline-column" key={stage}>
            <h2>
              {DEAL_STAGE_LABELS[stage]}
              <span className="pipeline-column-count">{byStage[stage].length}</span>
            </h2>
            <div className="pipeline-column-cards">
              {byStage[stage].map((deal) => (
                <Link href={`/admin/deals/${deal.id}`} key={deal.id} className="deal-card">
                  <p className="deal-card-title">{deal.title}</p>
                  {deal.companies?.name ? <p className="deal-card-meta">{deal.companies.name}</p> : null}
                  {deal.contacts?.name ? <p className="deal-card-meta">{deal.contacts.name}</p> : null}
                  {deal.budget_range ? <p className="deal-card-budget">{deal.budget_range}</p> : null}
                </Link>
              ))}
              {byStage[stage].length === 0 ? <p className="pipeline-empty">No deals</p> : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
