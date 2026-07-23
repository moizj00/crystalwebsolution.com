import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { createCompany } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminCompaniesPage() {
  const supabase = createClient();
  const { data: companies } = await supabase
    .from('companies')
    .select('id, name, domain, industry, created_at')
    .order('created_at', { ascending: false });

  const companyList = companies || [];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Companies</h1>
        <p>{companyList.length} {companyList.length === 1 ? 'company' : 'companies'}</p>
      </header>

      <form action={createCompany} className="admin-inline-form">
        <input name="name" placeholder="Company name" required />
        <input name="domain" placeholder="Domain (optional)" />
        <input name="industry" placeholder="Industry (optional)" />
        <button type="submit" className="btn btn-solid">Add company</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Domain</th><th>Industry</th><th /></tr>
        </thead>
        <tbody>
          {companyList.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.domain || '—'}</td>
              <td>{company.industry || '—'}</td>
              <td><Link href={`/admin/companies/${company.id}`}>View</Link></td>
            </tr>
          ))}
          {companyList.length === 0 ? <tr><td colSpan={4}>No companies yet.</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}
