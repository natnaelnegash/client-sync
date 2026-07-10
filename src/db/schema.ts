import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  company: text("company"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const projectStatusEnum = pgEnum("project_status", [
  "AWAITING_SIGNATURE",
  "COLLECTING_ASSETS",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DELIVERY",
  "COMPLETED"
])

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId").references(() => users.id).notNull(),
  clientId: uuid("client_id").references(() => clients.id).notNull(),
  projectName: text("project_name").notNull(),
  slug: text("slug").notNull().unique(),
  scopeOfWork: text("scope_of_work").notNull(),
  status: projectStatusEnum("status").default("AWAITING_SIGNATURE").notNull(),
  clientSignature: text("client_signature"),
  portalPin: text("portal_pin"), // 4-digit PIN
  createdAt: timestamp("created_at").defaultNow(),
})

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
})

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  title: text("title").default("Project Invoice").notNull(),
  amount: integer("amount").notNull(), // in cents
  status: text("status").default("UNPAID").notNull(), // UNPAID, PAID
  checkoutSessionId: text("checkout_session_id"), // Chapa tx_ref
  dueDate: timestamp("due_date", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const deliverables = pgTable("deliverables", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  invoiceId: uuid("invoice_id").references(() => invoices.id), // Link to invoice
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("Pending").notNull(), // Pending, In progress..., Complete
  previewUrl: text("preview_url"), // Low-quality preview (watermarked video/image)
  fileUrl: text("file_url"), // High-quality final deliverable
  requiresPayment: boolean("requires_payment").default(false).notNull(),
  clientStatus: text("client_status").default("PENDING").notNull(), // PENDING, APPROVED, REVISIONS_REQUESTED
  clientFeedback: text("client_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  sender: text("sender").notNull(), // "AGENCY" | "CLIENT"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const workspaceSettings = pgTable("workspace_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId").references(() => users.id).notNull().unique(),
  
  // White-labeling
  agencyLogoUrl: text("agency_logo_url"),
  agencyName: text("agency_name").default("My Agency").notNull(),
  agencyTagline: text("agency_tagline"),
  brandAccentColor: text("brand_accent_color").default("#10B981").notNull(),
  
  // Client Portal
  customSubdomain: text("custom_subdomain").unique(),
  showAgencyBranding: boolean("show_agency_branding").default(true).notNull(),
  allowDownloads: boolean("allow_downloads").default(true).notNull(),
  require2fa: boolean("require_2fa").default(true).notNull(),
  emailNotifications: boolean("email_notifications").default(false).notNull(),
  
  // Payments
  invoicePrefix: text("invoice_prefix").default("INV-").notNull(),
  defaultPaymentTerms: text("default_payment_terms").default("Net 30").notNull(),
  defaultInvoiceNotes: text("default_invoice_notes"),
})

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceOwnerId: text("workspace_owner_id").references(() => users.id).notNull(), // The user who owns the workspace
  email: text("email").notNull(), // Email of the invited member
  role: text("role").default("Member").notNull(), // Owner, Admin, Member
  status: text("status").default("Pending").notNull(), // Pending, Active
  createdAt: timestamp("created_at").defaultNow(),
})
