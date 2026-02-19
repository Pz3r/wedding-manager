import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  invitationId: string;
  rsvpUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's JWT to verify they're authenticated
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { invitationId, rsvpUrl }: InvitationRequest = await req.json();

    // Get invitation with guest details
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select(`
        *,
        guests (name, email, user_id)
      `)
      .eq('id', invitationId)
      .single();

    if (fetchError || !invitation) {
      throw new Error('Invitation not found');
    }

    // Verify the user owns this guest
    if (invitation.guests.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const guestName = invitation.guests.name;
    const guestEmail = invitation.guests.email;

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Lili y José <invitaciones@bodaliliyjose.com>',
        reply_to: 'liliyjose@bodaliliyjose.com',
        to: [guestEmail],
        subject: "Invitación a nuestra boda - Lili y José",
        text: `Querido/a ${guestName},

¡Estamos muy emocionados de invitarte a celebrar nuestra boda!

Por favor, confirma tu asistencia haciendo clic en el siguiente enlace:
${rsvpUrl}

¡Esperamos verte pronto!

Con cariño,
Lili y José

---
Este correo fue enviado desde bodaliliyjose.com
Si tienes preguntas, responde a este correo.`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 40px 0;
      background: linear-gradient(135deg, #f5b3a9 0%, #e15d4c 100%);
      border-radius: 12px;
      color: white;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
    }
    .button {
      display: inline-block;
      background: #e15d4c;
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>¡Estás Invitado/a!</h1>
  </div>

  <div class="content">
    <p>Querido/a <strong>${guestName}</strong>,</p>

    <p>¡Estamos muy emocionados de invitarte a celebrar nuestro día especial!</p>

    <p>Por favor, haz clic en el botón de abajo para confirmar tu asistencia y hacernos saber tus preferencias.</p>

    <a href="${rsvpUrl}" class="button">Confirmar Asistencia</a>

    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
      <a href="${rsvpUrl}">${rsvpUrl}</a>
    </p>
  </div>

  <div class="footer">
    <p>¡No podemos esperar para celebrar contigo!</p>
  </div>
</body>
</html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
