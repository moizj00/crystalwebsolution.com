'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import { getCurrentProfile } from '../../lib/supabase/profile';
import { DEAL_STAGES } from '../../lib/crm/constants';

async function requireStaff() {
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    throw new Error('Not authorized.');
  }
  return { user, profile };
}

export async function updateDealStage(dealId, formData) {
  await requireStaff();
  const stage = formData.get('stage')?.toString();
  if (!DEAL_STAGES.includes(stage)) return;

  const supabase = createClient();
  const { error } = await supabase.from('deals').update({ stage }).eq('id', dealId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  revalidatePath(`/admin/deals/${dealId}`);
}

export async function addNote(dealId, formData) {
  const { user } = await requireStaff();
  const body = formData.get('body')?.toString().trim();
  if (!body) return;
  const clientVisible = formData.get('client_visible') === 'on';

  const supabase = createClient();
  const { error } = await supabase.from('notes').insert({
    deal_id: dealId,
    author_id: user.id,
    body,
    client_visible: clientVisible,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/deals/${dealId}`);
}

export async function addTask(dealId, formData) {
  await requireStaff();
  const title = formData.get('title')?.toString().trim();
  if (!title) return;
  const dueDate = formData.get('due_date')?.toString() || null;

  const supabase = createClient();
  const { error } = await supabase.from('tasks').insert({ deal_id: dealId, title, due_date: dueDate });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/deals/${dealId}`);
  revalidatePath('/admin/tasks');
}

export async function toggleTask(taskId, nextCompleted) {
  await requireStaff();
  const supabase = createClient();
  const { error } = await supabase.from('tasks').update({ completed: nextCompleted }).eq('id', taskId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/tasks');
}

export async function createCompany(formData) {
  await requireStaff();
  const name = formData.get('name')?.toString().trim();
  if (!name) return;

  const supabase = createClient();
  const { error } = await supabase.from('companies').insert({
    name,
    domain: formData.get('domain')?.toString().trim() || null,
    industry: formData.get('industry')?.toString().trim() || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/companies');
}

export async function createContact(formData) {
  await requireStaff();
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  if (!name || !email) return;

  const supabase = createClient();
  const { error } = await supabase.from('contacts').insert({
    name,
    email,
    phone: formData.get('phone')?.toString().trim() || null,
    company_id: formData.get('company_id')?.toString() || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/contacts');
}

export async function createDeal(formData) {
  await requireStaff();
  const title = formData.get('title')?.toString().trim();
  if (!title) return;

  const supabase = createClient();
  const { error } = await supabase.from('deals').insert({
    title,
    company_id: formData.get('company_id')?.toString() || null,
    contact_id: formData.get('contact_id')?.toString() || null,
    budget_range: formData.get('budget_range')?.toString().trim() || null,
    brief: formData.get('brief')?.toString().trim() || null,
    source: 'manual',
  });
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}

// Creates a Supabase auth user + (via the handle_new_user trigger) a
// 'client'-role profile scoped to this company, so someone at the company
// can sign in and see their own deals/notes at /dashboard.
export async function createClientLogin(companyId, formData) {
  await requireStaff();
  const email = formData.get('email')?.toString().trim();
  const fullName = formData.get('full_name')?.toString().trim();
  const password = formData.get('password')?.toString();
  if (!email || !password) throw new Error('Email and a temporary password are required.');

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'client', full_name: fullName, company_id: companyId },
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/companies/${companyId}`);
}
