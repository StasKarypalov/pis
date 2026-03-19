## UML Deployment Diagram – Duty Shift Management System

```mermaid
flowchart TD

  subgraph Client["Browser / Frontend"]
    B1["React components (RSC + client)"]
  end

  subgraph NextServer["Next.js App Router Server"]
    NS1["Route handlers / API"]
    NS2["NextAuth (Auth.js)"]
    NS3["Prisma ORM"]
    NS4["Google API clients (Calendar, Sheets, Docs)"]
  end

  subgraph DBServer["Database Server"]
    DB["PostgreSQL + Prisma schema"]
  end

  subgraph GoogleCloud["Google APIs"]
    GCAL["Google Calendar API"]
    GSHEETS["Google Sheets API"]
    GFORMS["Google Forms (UI, linked to Sheets)"]
    GDOCS["Google Docs API"]
    GDRIVE["Google Drive API (sharing)"]
  end

  subgraph Maps["OpenStreetMap / Tile Server"]
    OSM["OSM tiles"]
  end

  B1 -- HTTP/HTTPS --> NS1
  B1 -- OAuth redirects --> NS2

  NS1 -- Prisma queries --> DB
  NS2 -- User/session storage --> DB

  NS4 -- service account auth --> GCAL
  NS4 -- service account auth --> GSHEETS
  NS4 -- service account auth --> GDOCS
  NS4 -- service account auth --> GDRIVE

  B1 -- loads tiles --> OSM

  EMP["Employee"] --- B1
  MGR["Manager"] --- B1
```

### Node Responsibilities

- **Browser / Frontend**
  - Renders Next.js pages and React components.
  - Hosts React Leaflet map for place/zone drawing.
  - Initiates auth via NextAuth, interacts with API routes.

- **Next.js Server**
  - App Router server rendering.
  - Route handlers for registration, user confirmation, shift CRUD, report generation.
  - NextAuth for Google OAuth and credentials authentication.
  - Uses Prisma client to access PostgreSQL.
  - Hosts Google API integration utilities (Calendar for shift events, Sheets for results, Docs for reports).

- **Database Server (PostgreSQL)**
  - Stores users, roles, places, shifts, and shift result metadata.
  - Enforces relational integrity as per ERD.

- **Google APIs**
  - **Calendar API** – stores employee shift events with reminders.
  - **Forms + Sheets** – collects and stores shift result submissions.
  - **Docs API** – generates duty reports for manager‑selected periods.
  - **Drive API** – manages sharing / permissions for created Docs.

- **OpenStreetMap / Tile Server**
  - Provides map tiles and geographic background used in React Leaflet for defining zones.

