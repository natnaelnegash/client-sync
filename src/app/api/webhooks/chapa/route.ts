import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-chapa-signature") || req.headers.get("chapa-signature");

    // Optional webhook signature verification
    const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(bodyText)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    let payload;
    try {
      payload = JSON.parse(bodyText);
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const event = payload.event;
    const tx_ref = payload.tx_ref;

    // Chapa sends event = 'charge.success' or status = 'success'
    if ((event === "charge.success" || payload.status === "success") && tx_ref) {
      // First verify the transaction directly with Chapa to be completely secure
      // (This prevents someone from spoofing the webhook payload without a signature)
      const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      });

      const verifyData = await verifyRes.json();

      if (verifyData.status === "success" && verifyData.data.status === "success") {
        // Find the invoice with this tx_ref and mark it as PAID
        await db
          .update(invoices)
          .set({ status: "PAID" })
          .where(eq(invoices.checkoutSessionId, tx_ref));

        console.log(`Successfully marked invoice for tx_ref ${tx_ref} as PAID`);
      } else {
        console.error("Transaction verification failed:", verifyData);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
