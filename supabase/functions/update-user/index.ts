import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

Deno.serve(async (req) => {
  // Validação de segurança
  const { data: { user: callingUser } } = await supabaseAdmin.auth.getUser(
    req.headers.get('Authorization')?.replace('Bearer ', '')
  );
  if (!callingUser) {
    return new Response(JSON.stringify({ error: 'Not authorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { userId, email, password } = await req.json();

  const attributesToUpdate: { email?: string; password?: string } = {};
  if (email) attributesToUpdate.email = email;
  if (password) attributesToUpdate.password = password;

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    attributesToUpdate
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
});