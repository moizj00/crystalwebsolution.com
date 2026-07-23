import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { toggleTask } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminTasksPage() {
  const supabase = createClient();
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, due_date, completed, deals(id, title)')
    .order('completed', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false });

  const taskList = tasks || [];
  const openCount = taskList.filter((task) => !task.completed).length;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Tasks</h1>
        <p>{openCount} open</p>
      </header>

      <ul className="admin-task-list">
        {taskList.map((task) => (
          <li key={task.id} className={task.completed ? 'is-done' : ''}>
            <span>
              {task.title}
              {task.due_date ? ` — due ${task.due_date}` : ''}
              {task.deals?.title ? (
                <> · <Link href={`/admin/deals/${task.deals.id}`}>{task.deals.title}</Link></>
              ) : null}
            </span>
            <form action={toggleTask.bind(null, task.id, !task.completed)}>
              <button type="submit" className="admin-task-toggle">
                {task.completed ? 'Mark open' : 'Mark done'}
              </button>
            </form>
          </li>
        ))}
        {taskList.length === 0 ? <li>No tasks yet.</li> : null}
      </ul>
    </div>
  );
}
