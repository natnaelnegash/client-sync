import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  pgEnum,
  boolean,
  jsonb,
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

export const projectTypeEnum = pgEnum("project_type", [
  "WEB",
  "BRANDING",
  "VIDEO",
  "MARKETING",
  "CUSTOM"
])

export const deliverableTypeEnum = pgEnum("deliverable_type", [
  "DESIGN",
  "CODE",
  "VIDEO",
  "DOCUMENT",
  "PRESENTATION"
])

export const projectTemplates = pgTable("project_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId").references(() => users.id).notNull(),
  type: projectTypeEnum("type").default("CUSTOM").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const templateMilestones = pgTable("template_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id").references(() => projectTemplates.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
})

export const templateDeliverables = pgTable("template_deliverables", {
  id: uuid("id").primaryKey().defaultRandom(),
  milestoneId: uuid("milestone_id").references(() => templateMilestones.id, { onDelete: "cascade" }).notNull(),
  type: deliverableTypeEnum("type").default("DOCUMENT").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
})

export const templateTasks = pgTable("template_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  milestoneId: uuid("milestone_id").references(() => templateMilestones.id, { onDelete: "cascade" }),
  deliverableId: uuid("deliverable_id").references(() => templateDeliverables.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
})

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId").references(() => users.id).notNull(),
  clientId: uuid("client_id").references(() => clients.id).notNull(),
  type: projectTypeEnum("type").default("CUSTOM").notNull(),
  sourceTemplateId: uuid("source_template_id").references(() => projectTemplates.id),
  config: jsonb("config"),
  projectName: text("project_name").notNull(),
  slug: text("slug").notNull().unique(),
  scopeOfWork: text("scope_of_work").notNull(),
  status: projectStatusEnum("status").default("AWAITING_SIGNATURE").notNull(),
  clientSignature: text("client_signature"),
  portalPin: text("portal_pin"), // 4-digit PIN
  createdAt: timestamp("created_at").defaultNow(),
})

export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  status: text("status").default("PENDING").notNull(),
  order: integer("order").notNull().default(0),
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
  milestoneId: uuid("milestone_id").references(() => milestones.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").references(() => invoices.id), // Link to invoice
  type: deliverableTypeEnum("type").default("DOCUMENT").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  status: text("status").default("Pending").notNull(), // Pending, In progress..., Complete
  previewUrl: text("preview_url"), // Low-quality preview (watermarked video/image)
  fileUrl: text("file_url"), // High-quality final deliverable
  requiresPayment: boolean("requires_payment").default(false).notNull(),
  clientStatus: text("client_status").default("PENDING").notNull(), // PENDING, APPROVED, REVISIONS_REQUESTED
  clientFeedback: text("client_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  milestoneId: uuid("milestone_id").references(() => milestones.id, { onDelete: "cascade" }),
  deliverableId: uuid("deliverable_id").references(() => deliverables.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  order: integer("order").notNull().default(0),
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

export const deliverableDependencies = pgTable("deliverable_dependencies", {
  dependentId: uuid("dependent_id").references(() => deliverables.id, { onDelete: "cascade" }).notNull(),
  prerequisiteId: uuid("prerequisite_id").references(() => deliverables.id, { onDelete: "cascade" }).notNull(),
})

export const taskDependencies = pgTable("task_dependencies", {
  dependentId: uuid("dependent_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  prerequisiteId: uuid("prerequisite_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
})
