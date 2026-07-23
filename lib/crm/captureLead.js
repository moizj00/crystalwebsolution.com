import { createAdminClient } from '../supabase/admin';

function escapeLike(value) {
  return value.replace(/[%_\\]/g, (match) => `\\${match}`);
}

// Turns a validated contact-form submission into CRM records: a company
// (if one was named), a contact matched or created by email, and a new
// 'new'-stage deal so it shows up in the admin pipeline. Best-effort by
// design — the contact form's user-facing success/failure is driven by the
// webhook forward in app/api/contact/route.js, not by this.
export async function captureLead({ name, email, company, budget, brief }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { captured: false, reason: 'not_configured' };
  }

  const supabase = createAdminClient();

  try {
    let companyId = null;

    if (company) {
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .ilike('name', escapeLike(company))
        .limit(1)
        .maybeSingle();

      companyId = existingCompany?.id ?? null;

      if (!companyId) {
        const { data: newCompany, error } = await supabase
          .from('companies')
          .insert({ name: company })
          .select('id')
          .single();
        if (error) throw error;
        companyId = newCompany.id;
      }
    }

    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id, company_id')
      .ilike('email', escapeLike(email))
      .limit(1)
      .maybeSingle();

    let contactId = existingContact?.id ?? null;

    if (!contactId) {
      const { data: newContact, error } = await supabase
        .from('contacts')
        .insert({ name, email, company_id: companyId, source: 'website_contact_form' })
        .select('id')
        .single();
      if (error) throw error;
      contactId = newContact.id;
    } else if (companyId && !existingContact.company_id) {
      await supabase.from('contacts').update({ company_id: companyId }).eq('id', contactId);
    }

    const { error: dealError } = await supabase.from('deals').insert({
      title: `${company || name} — website inquiry`,
      company_id: companyId,
      contact_id: contactId,
      stage: 'new',
      budget_range: budget,
      brief,
      source: 'website_contact_form',
    });
    if (dealError) throw dealError;

    return { captured: true };
  } catch (error) {
    console.error('[crm] failed to capture website lead', error);
    return { captured: false, reason: 'error' };
  }
}
