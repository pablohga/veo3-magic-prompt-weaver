// supabase/functions/list-users/index.ts
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
    // Validação de segurança (simplificada)
    const { data: { user } } = await supabaseAdmin.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '')
    )
    if (!user) {
      throw new Error('User not authenticated.');
    }
    
    // Lógica para listar usuários
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})