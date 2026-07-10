# ClientSync OS: Project Flow & Architecture Analysis

Here is a bird's-eye view of how the system currently flows, who the actors are, what they can do, and the critical missing pieces we should tackle next to make this a production-ready SaaS.

---

## 🎭 The Actors

### 1. The Admin (You / Agency)
The person operating the OS. Responsible for managing clients, creating projects, defining scope, and doing the actual work.
### 2. The Client
The end-user who receives services. They interact *only* with the secure Client Portal to review proposals, sign contracts, upload assets, track progress, and pay invoices.

---

## 🌊 The Current Flow

### Stage 1: Setup & Onboarding (Admin)
1. **Login:** Admin logs in to the dashboard.
2. **Settings:** Admin configures Workspace Settings (White-labeling, Portal details, Payment preferences). *This data is saved to the DB.*

### Stage 2: Project Creation (Admin)
1. **Create:** Admin clicks "New Project".
2. **Configure:** Admin selects an existing Client (or types a new one), enters Project Name, Scope of Work, and Project Value.
3. **Execute:** The system generates the project, creates a mock invoice, generates mock deliverables, and creates the magic link.
4. **Notify:** The system automatically sends a beautifully styled **Welcome Email** to the Client with their magic link.

### Stage 3: Client Onboarding (Client)
1. **Access:** Client clicks the magic link and lands on **Step 1: Signature** of the Portal.
2. **Review:** Client reviews the scope and timeline.
3. **Sign:** Client types their signature. The system advances the project to `COLLECTING_ASSETS`.

### Stage 4: Asset Collection (Client)
1. **Upload:** Client lands on **Step 2: Upload**. They use the UploadDropzone to drag-and-drop their brand assets.
2. **Store:** Files are securely stored in UploadThing and mapped to the DB.
3. **Complete:** Client clicks "Done Uploading". The project advances to `IN_PROGRESS` and an **Admin Notification Email** is dispatched.

### Stage 5: Project Execution (Admin & Client)
1. **Admin Tracking:** Admin views the Project Details page to review the Signed Contract, Scope of Work, and download the Uploaded Assets.
2. **Client Tracking:** Client views **Step 3: Tracker** to see the timeline of the project, their deliverables list, and the invoice.
3. **Reminders:** If a client is stalling, the Admin clicks "Send Reminder", dispatching an **Action Required Email**.

### Stage 6: Payment (Client)
1. **Checkout:** Client clicks "Pay balance now" in the portal.
2. **Processing:** System generates a secure Chapa checkout link for the exact invoice amount.
3. **Completion:** Client pays. The Chapa webhook automatically marks the invoice as `PAID` in the DB, and the portal updates to reflect the payment.

---

## 🔍 What's Missing? (Enhancement Opportunities)

While the happy-path flow is completely functional end-to-end, here are the critical gaps needed to make this a fully mature product:

### 1. Admin Deliverables & Status Management (High Priority)
- **The Gap:** The Admin currently has no UI to add/edit Deliverables or advance the project status (e.g., from `IN_PROGRESS` to `IN_REVIEW` to `COMPLETED`). The portal just shows mock deliverables right now.
- **The Fix:** Build a "Deliverables Manager" component on the Admin Project Details page to add items, upload the final files, and check them off. Add a "Advance Stage" button to update the overall project status.

### 2. Real Invoice Builder (High Priority)
- **The Gap:** The Create Project modal asks for "Project Value" and auto-generates a single invoice for that amount.
- **The Fix:** Add a dedicated "Invoices" tab on the Admin Project Details page where you can generate multiple invoices (e.g., Deposit, Final Balance), edit line items, and adjust due dates.

### 3. Client Portal Security (Medium Priority)
- **The Gap:** The magic link (`/p/[slug]`) is currently publicly accessible to anyone who has the URL. 
- **The Fix:** Implement an Email OTP (One-Time Password) or a simple PIN code gate on the portal so only the actual client can view their invoices and assets.

### 4. Contract Generation (Medium Priority)
- **The Gap:** The "Signature" just saves text to the database.
- **The Fix:** Use a library to generate an actual PDF contract with the Scope of Work, Dates, and the Client's Signature, then save it to the "Files" database for both parties to download.

### 5. Team Management (Low Priority)
- **The Gap:** The "Team & Security" settings tab is currently just a static UI placeholder.
- **The Fix:** Build out RBAC (Role-Based Access Control) to invite other agency members (designers, developers) to access projects.
