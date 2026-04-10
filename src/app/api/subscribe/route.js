import { NextResponse } from "next/server";
import { siteConfig } from "../../../lib/site-config";

export async function POST(req) {
  try {
    const { email, honey_pot } = await req.json();

    // 1. Honey Pot Check (Highly Secure)
    // If the hidden 'honey_pot' field is filled, it's a bot.
    if (honey_pot) {
      console.warn("Bot detected via honey pot.");
      return NextResponse.json({ message: "Subscription successful!" }, { status: 200 }); // Silent fail for bots
    }

    // 2. Email Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    // 3. Email Delivery Logic (using Resend API)
    // Note: User needs to add RESEND_API_KEY to .env.local
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (RESEND_API_KEY) {
      // Send Welcome Email to Subscriber
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: siteConfig.contact.newsletterFrom,
          to: [email],
          subject: `Welcome to ${siteConfig.identity.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div style="background-color: var(--brand-primary, #1A1464); padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Welcome to the Inner Circle</h1>
              </div>
              <div style="padding: 40px; color: #333; line-height: 1.6;">
                <p>Hello there,</p>
                <p>Thank you for subscribing to <strong>${siteConfig.identity.name}</strong>. You're now officially in the loop for the most exclusive journalism and high-impact investigative reports from Nigeria and beyond.</p>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
                  <p style="margin: 0; font-weight: bold; color: #1A1464;">What's Next?</p>
                  <p style="margin: 5px 0 0 0;">Stay tuned for our weekly digests, breaking news alerts, and exclusive interviews delivered straight to your inbox.</p>
                </div>
                <p>Visit us anytime at <a href="${siteConfig.seo.baseUrl}" style="color: #1A1464; font-weight: bold; text-decoration: none;">${siteConfig.seo.baseUrl.replace("https://", "")}</a>.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} ${siteConfig.identity.name}. All rights reserved.</p>
              </div>
            </div>
          `,
        }),
      });

      // Send Notification to Azuh Arinze
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${siteConfig.identity.name} Notifications <newsletter@${siteConfig.seo.baseUrl.replace("https://", "")}>`,
          to: [siteConfig.contact.notificationEmail],
          subject: "New Newsletter Subscriber!",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #1A1464;">New Subscription Alert</h2>
              <p>Someone just joined the ${siteConfig.identity.name} newsletter list.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #eee; background: #f9f9f9; font-weight: bold;">Email Address:</td>
                  <td style="padding: 10px; border: 1px solid #eee;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #eee; background: #f9f9f9; font-weight: bold;">Timestamp:</td>
                  <td style="padding: 10px; border: 1px solid #eee;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
            </div>
          `,
        }),
      });
    } else {
      console.warn("RESEND_API_KEY is not set. Skipping email delivery.");
    }

    return NextResponse.json({ message: "Subscription successful!" }, { status: 200 });

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
