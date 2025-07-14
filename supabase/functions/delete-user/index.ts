import { createClient } from '@supabase/supabase-js'

// Cabeçalhos de CORS
const corsHeaders = {
  // 'Access-Control-Allow-Origin': '*',  Para desenvolvimento. Em produção, considere restringir para seu domínio: 'https://veo3.pt'
  'Access-Control-Allow-Origin': 'https://veo3.pt', // Para desenvolvimento. Em produção, considere restringir para seu domínio: 'https://veo3.pt'
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

Deno.serve(async (req) => {

  // Tratamento da requisição OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {

// Validação de segurança
  const { data: { user: callingUser } } = await supabaseAdmin.auth.getUser(
    req.headers.get('Authorization')?.replace('Bearer ', '')
  );
  if (!callingUser) {
    return new Response(JSON.stringify({ error: 'Not authorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { userId } = await req.json();

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

  