import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';
import { DEAL_STAGES, DEAL_STAGE_LABELS } from '../../../../lib/crm/constants';
import { updateDealStage, addNote, addTask, toggleTask } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function AdminDealDetailPage({ params }) {
  const supabase = createClient();

  const [{ data: deal }, { data: notes }, { data: tasks }] = await Promise.all([
    supabase
      .from('deals')
      .select('id, title, stage, budget_range, brief, value, created_at, companies(id, name), contacts(id, name, email)')
      .eq('id', params.id)
      .single(),
    supabase
      .from('notes')
      .select('id, body, client_visible, created_at, profiles(full_name)')
      .eq('deal_id', params.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('tasks')
      .select('id, title, due_date, completed, created_at')
      .eq('deal_id', params.id)
      .order('created_at', { ascending: true }),
  ]);

  if (!deal) notFound();

  const noteList = notes || [];
  const taskList = tasks || [];

  const setStage = updateDealStage.bind(null, deal.id);
  const createNote = addNote.bind(null, deal.id);
  const createTask = addTask.bind(null, deal.id);

  return (
    <div className="admin-page">
      <p className="admin-back"><Link href="/admin">&larr; Pipeline</Link></p>
      <header className="admin-page-header">
        <h1>{deal.title}</h1>
        <p>
          {deal.companies?.name || 'No company'}
          {deal.contacts?.name ? ` · ${deal.contacts.name} (${deal.contacts.email})` : ''}
          {deal.budget_range ? ` · ${deal.budget_range}` : ''}
        </p>
      </header>

      {deal.brief ? (
        <section className="admin-section">
          <h2>Brief</h2>
          <p className="admin-brief">{deal.brief}</p>
        </section>
      ) : null}

      <section className="admin-section">
        <h2>Stage</h2>
        <form action={setStage} className="admin-inline-form">
          <select name="stage" defaultValue={deal.stage}>
            {DEAL_STAGES.map((stage) => (
              <option key={stage} value={stage}>{DEAL_STAGE_LABELS[stage]}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-solid">Update stage</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Tasks</h2>
        <ul className="admin-task-list">
          {taskList.map((task) => (
            <li key={task.id} className={task.completed ? 'is-done' : ''}>
              <span>{task.title}{task.due_date ? ` — due ${task.due_date}` : ''}</span>
              <form action={toggleTask.bind(null, task.id, !task.completed)}>
                <button type="submit" className="admin-task-toggle">
                  {task.completed ? 'Mark open' : 'Mark done'}
                </button>
              </form>
            </li>
          ))}
          {taskList.length === 0 ? <li>No tasks yet.</li> : null}
        </ul>
        <form action={createTask} className="admin-inline-form">
          <input name="title" placeholder="New task" required />
          <input name="due_date" type="date" />
          <button type="submit" className="btn btn-solid">Add task</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Notes</h2>
        <ul className="admin-note-list">
          {noteList.map((note) => (
            <li key={note.id}>
              <p className="admin-note-meta">
                {note.profiles?.full_name || 'Team'} · {new Date(note.created_at).toLocaleDateString()}
                {note.client_visible ? ' · visible to client' : ''}
              </p>
              <p>{note.body}</p>
            </li>
          ))}
          {noteList.length === 0 ? <li>No notes yet.</li> : null}
        </ul>
        <form action={createNote} className="admin-note-form">
          <textarea name="body" placeholder="Add a note…" rows={3} required />
          <label className="admin-checkbox">
            <input type="checkbox" name="client_visible" /> Visible to client
          </label>
          <button type="submit" className="btn btn-solid">Add note</button>
        </form>
      </section>
    </div>
  );
}
