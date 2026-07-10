import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, projects, clients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
    }

    // Fetch invoice details
    const [invoice] = await db
      .select({
        id: invoices.id,
        amount: invoices.amount,
        status: invoices.status,
        projectId: invoices.projectId,
      })
      .from(invoices)
      .where(eq(invoices.id, invoiceId));

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "PAID") {
      return NextResponse.json({ error: "Invoice is already paid" }, { status: 400 });
    }

    // Fetch project and client details for the payment metadata
    const [project] = await db
      .select({
        projectName: projects.projectName,
        slug: projects.slug,
        clientName: clients.name,
        clientEmail: clients.email,
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.id, invoice.projectId));

    // Generate a unique transaction reference
    // const tx_ref = `tx-${invoice.id}-${Date.now()}`;
    const tx_ref = `tx-${Date.now()}`;

    // Update the invoice with the tx_ref so we can verify it later
    await db
      .update(invoices)
      .set({ checkoutSessionId: tx_ref })
      .where(eq(invoices.id, invoice.id));

    // Prepare Chapa payload
    const amountInETB = (invoice.amount / 100).toString(); // Assuming amount is stored in cents
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const payload = {
      amount: amountInETB,
      currency: "ETB",
      email: project?.clientEmail || "natnaelnegash95@gmail.com",
      first_name: project?.clientName?.split(" ")[0] || "Client",
      last_name: project?.clientName?.split(" ")[1] || "Name",
      tx_ref: tx_ref,
      callback_url: `${appUrl}/api/webhooks/chapa`,
      return_url: `${appUrl}/p/${project?.slug}?payment=success`,
      customization: {
        title: "Invoice Payment",
        description: `Payment for project ${project?.projectName || 'Services'}`,
      },
    };

    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status !== "success") {
      console.error("Chapa error:", data);
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: data.data.checkout_url });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
