// Supabase Edge Function: admin-users
// Lets an ADMIN create / delete users and update a student's validity.
// The service_role key stays here (server side) and is never exposed to the website.
//
// Deploy: see SUPABASE_SETUP.md (Step 6).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const LOGIN_EMAIL_DOMAIN = 'vidyaneuron.local';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Identify the caller from their JWT and confirm they are an admin.
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const { data: userData } = await admin.auth.getUser(token);
    const callerId = userData.user?.id;
    if (!callerId) return json({ error: 'Not authenticated.' }, 401);

    const { data: caller } = await admin
      .from('profiles')
      .select('role')
      .eq('id', callerId)
      .single();
    if (!caller || caller.role !== 'admin') return json({ error: 'Admin access required.' }, 403);

    const body = await req.json();
    const action = body.action as string;

    if (action === 'create') {
      const { full_name, login_id, password, role, valid_until } = body;
      if (!full_name || !login_id || !password || !role) return json({ error: 'Missing fields.' }, 400);

      const email = `${String(login_id).trim().toLowerCase()}@${LOGIN_EMAIL_DOMAIN}`;
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      if (createErr || !created.user) return json({ error: createErr?.message || 'Could not create user.' }, 400);

      const { error: profErr } = await admin.from('profiles').insert({
        id: created.user.id,
        login_id: String(login_id).trim(),
        full_name,
        role,
        valid_until: valid_until || null
      });
      if (profErr) {
        // roll back the auth user if the profile insert fails (e.g. duplicate login_id)
        await admin.auth.admin.deleteUser(created.user.id);
        return json({ error: 'Login ID already exists or is invalid.' }, 400);
      }
      return json({ ok: true });
    }

    if (action === 'delete') {
      if (!body.id) return json({ error: 'Missing id.' }, 400);
      await admin.auth.admin.deleteUser(body.id);
      return json({ ok: true });
    }

    if (action === 'update_validity') {
      if (!body.id) return json({ error: 'Missing id.' }, 400);
      const { error } = await admin
        .from('profiles')
        .update({ valid_until: body.valid_until || null })
        .eq('id', body.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === 'reset_password') {
      if (!body.id || !body.password) return json({ error: 'Missing fields.' }, 400);
      const { error } = await admin.auth.admin.updateUserById(body.id, { password: body.password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
