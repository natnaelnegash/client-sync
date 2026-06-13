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
  amount: integer("amount").notNull(), // in cents
  status: text("status").default("UNPAID").notNull(), // UNPAID, PAID
  dueDate: timestamp("due_date", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const deliverables = pgTable("deliverables", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("Pending").notNull(), // Pending, In progress..., Complete
  fileUrl: text("file_url"), // Link to download
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
