import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  referralCode: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security: This endpoint is protected by database verification
    // Only valid email + referralCode combinations that exist in the leads table can trigger emails

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { email, referralCode }: WelcomeEmailRequest = await req.json();

    // Validate email format
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate referral code
    if (!referralCode || typeof referralCode !== "string") {
      return new Response(
        JSON.stringify({ error: "Referral code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the lead exists in the database to prevent abuse
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("email, referral_code")
      .eq("email", email)
      .eq("referral_code", referralCode)
      .maybeSingle();

    if (leadError) {
      console.error("Database error:", leadError);
      return new Response(
        JSON.stringify({ error: "Failed to verify lead" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!lead) {
      console.error("Lead not found for email:", email);
      return new Response(
        JSON.stringify({ error: "Lead not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // TODO: Replace with your verified domain email, e.g., "Global Gains League <hello@yourdomain.com>"
        // Using resend.dev only works for sending to the account owner's email
        from: "Global Gains League <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Global Gains League! 🏆",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 16px; border: 1px solid #333;">
                    <tr>
                      <td style="padding: 40px 40px 20px;">
                        <div style="text-align: center;">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 12px; margin: 0 auto 24px; display: inline-block;">
                            <span style="color: #ffffff; font-size: 28px; font-weight: bold; line-height: 60px;">G</span>
                          </div>
                        </div>
                        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 8px;">Welcome to the League! 🏆</h1>
                        <p style="color: #888888; font-size: 16px; text-align: center; margin: 0;">You're now on the waitlist for Global Gains League</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px;">
                        <div style="background: #1f1f1f; border-radius: 12px; padding: 24px; border: 1px solid #333;">
                          <p style="color: #06b6d4; font-size: 14px; font-weight: 600; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Your Referral Code</p>
                          <p style="color: #ffffff; font-size: 32px; font-weight: 700; font-family: monospace; margin: 0; letter-spacing: 2px;">${referralCode}</p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px;">
                        <p style="color: #aaaaaa; font-size: 15px; line-height: 1.6; margin: 0;">
                          <strong style="color: #ffffff;">Skip the waitlist!</strong><br>
                          Invite 5 friends using your unique referral code and get immediate access to exclusive trading strategies, institutional reports, and our global trading competition.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px 40px;">
                        <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 12px; padding: 20px;">
                          <p style="color: #06b6d4; font-size: 14px; margin: 0; text-align: center;">
                            🎯 Share your code with friends to unlock early access
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 30px;">
                        <p style="color: #666666; font-size: 13px; text-align: center; margin: 0;">
                          Trade Smarter. Win Together.<br>
                          <span style="color: #888888;">Global Gains League</span>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("Welcome email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
