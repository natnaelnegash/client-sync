import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, invoices, clients } from '@/db/schema';
import { eq, and, lt, ne } from 'drizzle-orm';
import { sendSignatureReminderEmail, sendOverdueInvoiceEmail } from '@/lib/mail';

export async function GET(request: Request) {
  try {
    // 1. Verify Authorization (Vercel Cron standard)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 2. Process Overdue Invoices
    const now = new Date();
    // Invoices that are NOT PAID and their dueDate is before now
    const overdueInvoices = await db.select({
      id: invoices.id,
      amount: invoices.amount,
      dueDate: invoices.dueDate,
      projectName: projects.projectName,
      projectSlug: projects.slug,
      clientName: clients.name,
      clientEmail: clients.email
    })
    .from(invoices)
    .innerJoin(projects, eq(invoices.projectId, projects.id))
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(
      and(
        ne(invoices.status, 'PAID'),
        lt(invoices.dueDate, now.toISOString().split('T')[0]) // Simplified comparison
      )
    );

    let sentCount = 0;

    for (const inv of overdueInvoices) {
      const magicLink = `${appUrl}/p/${inv.projectSlug}?tab=invoices`;
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(inv.amount / 100);

      await sendOverdueInvoiceEmail(
        inv.clientEmail,
        inv.clientName,
        inv.projectName,
        formattedAmount,
        magicLink
      );
      sentCount++;
    }

    // 3. Process Stalled Projects (AWAITING_SIGNATURE for > 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const stalledProjects = await db.select({
      id: projects.id,
      projectName: projects.projectName,
      slug: projects.slug,
      clientName: clients.name,
      clientEmail: clients?.email
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(
      and(
        eq(projects.status, 'AWAITING_SIGNATURE'),
        lt(projects.createdAt, threeDaysAgo)
      )
    );

    for (const proj of stalledProjects) {
      const magicLink = `${appUrl}/p/${proj.slug}`;
      await sendSignatureReminderEmail(
        proj.clientEmail,
        proj.clientName,
        proj.projectName,
        magicLink
      );
      sentCount++;
    }

    return NextResponse.json({ success: true, message: `Dispatched ${sentCount} automated emails.` });
  } catch (error) {
    console.error('Cron job error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
