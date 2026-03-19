## UML Use Case Diagram – Duty Shift Management System

```mermaid
%% Mermaid UML-style use case diagram using flowchart syntax
flowchart TD

  subgraph Actors
    MGR["Actor: Manager"]
    EMP["Actor: Employee"]
  end

  subgraph System["Duty Shift Management System"]
    UC1["(Register as employee)"]
    UC2["(Login via Google / credentials)"]
    UC3["(Confirm employees & assign roles)"]
    UC4["(Manage places & zones)"]
    UC5["(Schedule shifts for employees)"]
    UC6["(View assigned shifts)"]
    UC7["(Submit shift result via Google Form)"]
    UC8["(View shift results)"]
    UC9["(Generate period report)"]
  end

  EMP --> UC1
  EMP --> UC2
  EMP --> UC6
  EMP --> UC7
  EMP --> UC8

  MGR --> UC2
  MGR --> UC3
  MGR --> UC4
  MGR --> UC5
  MGR --> UC8
  MGR --> UC9

  UC7 -. "writes responses" .- UC8
  UC5 -. "creates calendar events" .- UC6
  UC9 -. "uses shifts & results" .- UC8
```

### Main Use Cases

- **Register as employee** – self‑registration with email, name, and Google Calendar token JSON.
- **Login via Google / credentials** – authentication either via Google OAuth (employees) or credentials (default manager).
- **Confirm employees & assign roles** – manager approves `PENDING` users and assigns them the `EMPLOYEE` role.
- **Manage places & zones** – manager defines locations on a map using polygons with coordinates.
- **Schedule shifts for employees** – manager assigns a date/time/place and writes to employee Google Calendar.
- **View assigned shifts** – employees see their upcoming duties pulled from the app DB (and optionally from Calendar).
- **Submit shift result via Google Form** – employees open a Google Form to log duty outcomes.
- **View shift results** – managers/employees view parsed responses from the Google Sheet.
- **Generate period report** – manager requests a report that becomes a Google Doc summarizing shifts and results.

