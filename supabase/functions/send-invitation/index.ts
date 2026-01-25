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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { invitationId, rsvpUrl }: InvitationRequest = await req.json();

    // Get invitation with guest details
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select(`
        *,
        guests (name, email)
      `)
      .eq('id', invitationId)
      .single();

    if (fetchError || !invitation) {
      throw new Error('Invitation not found');
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
        from: 'Wedding Invitation <onboarding@resend.dev>',
        to: [guestEmail],
        subject: "You're Invited! 💒",
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
    <h1>You're Invited!</h1>
  </div>

  <div class="content">
    <p>Dear <strong>${guestName}</strong>,</p>

    <p>We are thrilled to invite you to celebrate our special day with us!</p>

    <p>Please click the button below to confirm your attendance and let us know your preferences.</p>

    <a href="${rsvpUrl}" class="button">RSVP Now</a>

    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${rsvpUrl}">${rsvpUrl}</a>
    </p>
  </div>

  <div class="footer">
    <p>We can't wait to celebrate with you!</p>
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
