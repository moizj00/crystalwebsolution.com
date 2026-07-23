import { redirect } from 'next/navigation';
import { getCurrentProfile } from '../../lib/supabase/profile';
import LogoutButton from '../../components/dashboard/LogoutButton';

export default async function DashboardLayout({ children }) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect('/login?next=/dashboard');
  if (profile && (profile.role === 'admin' || profile.role === 'staff')) redirect('/admin');

  return (
    <div className="dash-shell">
      <header className="dash-header">
        <p className="dash-brand">Crystal Web Solution</p>
        <div className="dash-header-right">
          <p className="dash-user">{profile?.full_name || user.email}</p>
          <LogoutButton />
        </div>
      </header>
      <main className="dash-main">{children}</main>
    </div>
  );
}
