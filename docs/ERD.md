## ER Diagram – Duty Shift Management System

```mermaid
erDiagram
  User {
    string id PK
    string email UK
    string name
    string passwordHash
    string role "MANAGER | EMPLOYEE | PENDING"
    string googleId
    string calendarToken "JSON string with OAuth tokens"
    datetime createdAt
    datetime updatedAt
  }

  Place {
    string id PK
    string name
    float latitude
    float longitude
    json polygon "GeoJSON polygon"
    datetime createdAt
    datetime updatedAt
  }

  Shift {
    string id PK
    datetime date
    datetime startTime
    datetime endTime
    string employeeId FK
    string placeId FK
    string externalEventId "Google Calendar event id"
    datetime createdAt
    datetime updatedAt
  }

  ShiftResult {
    string id PK
    string shiftId FK
    string formRowId "Row ID / index in Google Sheet"
    json data "Full form response JSON"
    datetime createdAt
  }

  User ||--o{ Shift : "employeeShifts"
  Place ||--o{ Shift : "scheduledAt"
  Shift ||--o{ ShiftResult : "hasResults"
```

### Notes

- `User.role` is an enum with values `MANAGER`, `EMPLOYEE`, `PENDING`.
- `User.calendarToken` stores the raw OAuth tokens JSON used to access the employee's Google Calendar.
- `Shift.externalEventId` stores the ID of the corresponding Google Calendar event.
- `ShiftResult.data` mirrors the row values from the Google Sheet associated with the Google Form.

