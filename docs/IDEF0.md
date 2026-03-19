## IDEF0 Description – Duty Shift Management System

The following Mermaid diagram approximates an IDEF0 A-0 and A0 level decomposition of the Duty Shift Management System business process.

```mermaid
flowchart TD
  A0["A0: Manage Duty Shifts"]

  I1["Manager requirements & schedule policy"]
  I2["Employee availability & registration requests"]
  I3["External Google services (Calendar, Forms/Sheets, Docs)"]

  C1["Company rules & regulations"]
  C2["Security & access rules (roles, auth)"]

  M1["Duty Shift Management System"]
  O1["Approved employees, assigned shifts"]
  O2["Shift results & performance data"]
  O3["Generated duty reports (Google Docs)"]

  I1 --> A0
  I2 --> A0
  I3 --> A0
  C1 -.-> A0
  C2 -.-> A0
  M1 --- A0
  A0 --> O1
  A0 --> O2
  A0 --> O3
```

### A0 Decomposition (First-Level)

```mermaid
flowchart TD
  A0["A0: Manage Duty Shifts"]

  A1["A1: Register & Confirm Users"]
  A2["A2: Manage Places & Zones"]
  A3["A3: Schedule Shifts"]
  A4["A4: Capture Shift Results"]
  A5["A5: Generate Period Reports"]

  A0 --> A1
  A0 --> A2
  A0 --> A3
  A0 --> A4
  A0 --> A5

  %% Main flows
  R1["Registration data & Google Calendar tokens"]
  R2["Confirmed employees with roles"]
  P1["Places & geo-zones"]
  S1["Planned shifts (with places)"]
  RSLT["Shift result responses (Google Forms/Sheets)"]
  REP["Google Docs duty reports"]

  R1 --> A1
  A1 --> R2

  P1 --> A2
  A2 --> P1

  R2 --> A3
  P1 --> A3
  A3 --> S1

  S1 --> A4
  RSLT --> A4
  A4 --> RSLT

  S1 --> A5
  RSLT --> A5
  A5 --> REP
```

#### A1: Register & Confirm Users
- Inputs: registration forms, Google Calendar OAuth token JSON, manager confirmation actions.
- Controls: access rules, role definitions (PENDING, EMPLOYEE, MANAGER).
- Mechanisms: Next.js UI, NextAuth, Prisma, PostgreSQL.
- Outputs: stored users, confirmed employees with roles.

#### A2: Manage Places & Zones
- Inputs: place definitions, map polygons and coordinates.
- Controls: geography constraints and company zoning rules.
- Mechanisms: React Leaflet map, polygon drawing tools, Prisma.
- Outputs: persistent `Place` records with polygons and coordinates.

#### A3: Schedule Shifts
- Inputs: confirmed employees, places, desired dates and times.
- Controls: schedule policies, working-hours constraints.
- Mechanisms: manager UI, Prisma, Google Calendar API using stored tokens.
- Outputs: `Shift` records, Google Calendar events with notifications.

#### A4: Capture Shift Results
- Inputs: employee submissions via Google Form.
- Controls: result form schema, validation rules.
- Mechanisms: Google Forms & Sheets, backend reader using service account.
- Outputs: `ShiftResult` entries tied to shifts.

#### A5: Generate Period Reports
- Inputs: reporting period, shifts and results.
- Controls: report template, company KPIs.
- Mechanisms: Prisma queries, Google Docs API using service account.
- Outputs: Google Docs report URL shared with manager.

