## Duty Shift Management System (Next.js 14 + PostgreSQL)

This is a full‑stack demo implementation of a Duty Shift Management System built with **Next.js 14 App Router**, **TypeScript**, **Prisma**, **PostgreSQL**, **NextAuth (Auth.js)**, **React Query**, **Tailwind CSS**, and **React Leaflet**.

It focuses on:

- **Roles**: manager vs employee
- **Registration** with stored Google Calendar tokens
- **Default manager** `manager` / `12345`
- **Shift scheduling** and places with coordinates/polygons
- **Shift results** via Google Forms / Sheets
- **Reporting** via Google Docs

The Google integrations are wired with clear placeholders so you can plug in your own credentials.

### 1. Installation

```bash
npm install
```

Create a `.env` file based on `.env.example` and fill the values.

### 2. PostgreSQL & Prisma

1. Start Postgres locally (for example, via Docker):

```bash
docker run --name dutyshift-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=dutyshift -p 5432:5432 -d postgres:16
```

2. Set `DATABASE_URL` in `.env` (see `.env.example`).
3. Run Prisma migrations and seed the default manager:

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

The seed guarantees a manager with:

- **email**: `manager`
- **password**: `12345`

### 3. NextAuth configuration

In `.env`:

- **NEXTAUTH_URL** – usually `http://localhost:3000` in dev.
- **NEXTAUTH_SECRET** – generate via:

```bash
openssl rand -hex 32
```

### 4. Google OAuth (NextAuth Google Provider)

1. Go to Google Cloud Console → APIs & Services → Credentials.
2. Create **OAuth 2.0 Client ID** (type: Web application).
3. Add an **authorized redirect URI**:

- `http://localhost:3000/api/auth/callback/google`

4. Copy the **Client ID** and **Client Secret** into:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Employees can then sign‑in/register with Google; the app uses these accounts alongside the manual registration form.

### 5. Getting Google Calendar tokens for employees

There are two common approaches:

- **A. Out-of-band CLI/Script for demo**  
  1. Build a small Node/CLI script using `googleapis` that:
     - Opens the OAuth consent URL in a browser for scope `https://www.googleapis.com/auth/calendar`.
     - After consent, exchanges the code for tokens and prints the JSON.  
  2. The employee copies this JSON and pastes it into the **"Google Calendar OAuth tokens (JSON)"** field in the registration form.

- **B. In‑app OAuth flow (recommended for production)**  
  Extend this app with a dedicated page for the Calendar OAuth flow and store the resulting token JSON automatically into `User.calendarToken`.

For this assignment, option A is sufficient and is reflected in the registration UI.

### 6. Google Service Account (Sheets + Docs)

Shift results are stored via a **Google Form** into a **Google Sheet**, and reporting uses **Google Docs**.

1. In Google Cloud Console, create a **service account**.
2. Create a **JSON key**, then copy:

- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_SERVICE_ACCOUNT_KEY` (multiline string; keep the `-----BEGIN PRIVATE KEY-----` / `END` wrapper, with `\n` newlines).

3. Enable APIs:

- Google Sheets API
- Google Docs API
- Google Drive API

4. Share the **Google Sheet** (which is the responses sheet of your form) with the service account email (as Editor). Use that sheet's ID as `GOOGLE_FORMS_RESULT_SHEET_ID`.
5. (Optional) Create a Google Docs template for reports; share it with the service account. Put its ID in `GOOGLE_DOCS_REPORT_TEMPLATE_ID`, or leave blank to create a doc from scratch.

### 7. Creating the Google Form and Sheet

1. Create a **Google Form** named e.g. `Shift Result`.
2. Add fields you want employees to answer, for example:

- `Shift ID` (short answer, required) – must match the app's `Shift.id`.
- `Summary` (paragraph)
- `Issues` (paragraph)
- `Hours Worked` (number)

3. In the Form's "Responses" tab, click the Sheets icon to create a new response spreadsheet.
4. Copy the **Spreadsheet ID** from its URL and put it into `.env` as `GOOGLE_FORMS_RESULT_SHEET_ID`.
5. Ensure your service account has access to this sheet.

Employees will submit shift results by opening that form (the app can show a link like `https://docs.google.com/forms/d/<FORM_ID>/viewform?usp=pp_url&entry.<shiftIdField>=<shift.id>`; wiring this link is left as an exercise and can be added in the shift details UI).

### 8. Google Docs reporting

When a manager requests a report for a date period:

1. The backend collects the relevant shifts and their results from the DB and from Sheets.
2. A new Google Doc is created (optionally from template) using Docs API.
3. The app returns a **shareable link** to that doc.

You will need to implement the actual Docs API calls in a utility using the service account credentials and set Drive sharing appropriately (e.g. `anyone with link` can view, or restricted to specific emails).

### 9. Running the app

```bash
npm run dev
```

Then open `http://localhost:3000`.

- **Manager login**:  
  - Email: `manager`  
  - Password: `12345`
- **Employee flow**:
  1. Go to `/auth/register`, fill e‑mail/name and paste Calendar token JSON.
  2. Wait for manager to confirm and assign `EMPLOYEE` role.
  3. Manager assigns shifts; shifts are then pushed to employee Google Calendar (once you plug in the Calendar API utility using `User.calendarToken`).

### 10. Where to plug Google & map integrations

The starter code leaves clear extension points:

- **Google Calendar**:  
  Implement a helper (e.g. `src/lib/google/calendar.ts`) that:
  - Builds an OAuth client from `User.calendarToken` JSON.
  - Inserts events with 2 reminders (1 day before, 1 hour before) in the employee's primary calendar on shift creation / update.

- **Sheets (ShiftResult reading)**:  
  Implement `src/lib/google/sheets.ts` that:
  - Uses the service account credentials.
  - Reads the responses sheet (`GOOGLE_FORMS_RESULT_SHEET_ID`).
  - Maps rows to `ShiftResult` entries and stores them or returns them for display.

- **Docs (Reporting)**:  
  Implement `src/lib/google/docs.ts` that:
  - Uses the service account credentials.
  - Creates and populates a document for a period.
  - Returns its URL to the manager.

- **React Leaflet places**:  
  Create client routes/components under `src/app/manager/places` using `react-leaflet` and polygon draw tools (e.g. `react-leaflet-draw`), saving polygons to the `Place.polygon` JSON field and coordinates to `latitude` / `longitude`.

This repository provides the schema, auth, basic layout, and endpoints to build on all of these features for your assignment.

