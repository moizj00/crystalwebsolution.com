import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '../../lib/supabase/profile';
import LogoutButton from '../../components/dashboard/LogoutButton';

const NAV = [
  { href: '/admin', label: 'Pipeline' },
  { href: '/admin/contacts', label: 'Contacts' },
  { href: '/admin/companies', label: 'Companies' },
  { href: '/admin/tasks', label: 'Tasks' },
];

export default async function AdminLayout({ children }) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect('/login?next=/admin');
  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) redirect('/dashboard');

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-brand">Crystal Web Solution</p>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-link">{item.label}</Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <p className="admin-user">{profile.full_name || user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
