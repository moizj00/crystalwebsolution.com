import { createClient } from '../../lib/supabase/server';
import { getCurrentProfile } from '../../lib/supabase/profile';
import { DEAL_STAGE_LABELS } from '../../lib/crm/constants';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const { profile } = await getCurrentProfile();

  if (!profile?.company_id) {
    return (
      <div className="dash-page">
        <h1>Welcome</h1>
        <p className="dash-muted">
          Your account isn&apos;t linked to a company yet. Reach out to your Crystal Web Solution
          contact to get this set up.
        </p>
      </div>
    );
  }

  const supabase = createClient();
  const [{ data: deals }, { data: updates }] = await Promise.all([
    supabase
      .from('deals')
      .select('id, title, stage, budget_range, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('notes')
      .select('id, body, created_at, deals(title)')
      .eq('client_visible', true)
      .order('created_at', { ascending: false }),
  ]);

  const dealList = deals || [];
  const updateList = updates || [];

  return (
    <div className="dash-page">
      <header className="dash-page-header">
        <h1>Your projects</h1>
        <p>Status of everything on file with Crystal Web Solution.</p>
      </header>

      <section className="dash-section">
        {dealList.length === 0 ? (
          <p className="dash-muted">Nothing on file yet.</p>
        ) : (
          <ul className="dash-project-list">
            {dealList.map((deal) => (
              <li key={deal.id} className="dash-project-card">
                <p className="dash-project-title">{deal.title}</p>
                <p className={`dash-project-stage dash-project-stage--${deal.stage}`}>
                  {DEAL_STAGE_LABELS[deal.stage]}
                </p>
                {deal.budget_range ? <p className="dash-project-meta">{deal.budget_range}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dash-section">
        <h2>Updates</h2>
        {updateList.length === 0 ? (
          <p className="dash-muted">No updates yet — check back soon.</p>
        ) : (
          <ul className="dash-update-list">
            {updateList.map((update) => (
              <li key={update.id}>
                <p className="dash-update-meta">
                  {update.deals?.title ? `${update.deals.title} · ` : ''}
                  {new Date(update.created_at).toLocaleDateString()}
                </p>
                <p>{update.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
