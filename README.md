# IDT Inventory Management

Internship technical task — **Present Connection UAB / IDT Team**

A web application for managing users and their assigned inventory items, with PDF export in two distinct templates.

## Stack

| Layer     | Technology                              |
|-----------|----------------------------------------|
| Backend   | ASP.NET Core 8, EF Core (InMemory), AutoMapper, QuestPDF |
| Frontend  | React 18, TypeScript, Vite, Axios      |

## Features

- **Users page** — view, add, delete team members
- **Inventory page** — view all assets with type badges (Laptop, Phone, SIM Card, Tablet)
- **Filtering** — by type, comment, assigned user; toggle deleted items
- **Soft delete** — items are marked inactive, not removed; shown greyed-out in UI
- **PDF Export** with two templates:
  - **Template 1** — corporate landscape table, blue header, alternating rows + type summary
  - **Template 2** — portrait cards grouped by user, warm orange style, color-coded type borders
- **Database seeder** — pre-populated with 4 users and 10 inventory items
- **Dependency Injection** throughout backend
- **AutoMapper** for DTO mapping

## Getting Started

### Backend

```bash
cd backend/InventoryApi
dotnet restore
dotnet run
# API runs at http://localhost:5000
```

### Frontend

```bash
cd frontend/inventory-app
npm install
npm run dev
# App runs at http://localhost:5173
```

## API Endpoints

| Method | Route                      | Description                |
|--------|---------------------------|----------------------------|
| GET    | /api/users                | List all users             |
| POST   | /api/users                | Create user                |
| DELETE | /api/users/{id}           | Delete user                |
| GET    | /api/inventory            | List items (with filters)  |
| POST   | /api/inventory            | Create item                |
| PUT    | /api/inventory/{id}       | Update item                |
| DELETE | /api/inventory/{id}       | Soft delete item           |
| POST   | /api/inventory/export     | Export to PDF              |

### Inventory query params
- `type` — Laptop | Phone | SimCard | Tablet
- `comment` — substring search
- `userId` — filter by assigned user GUID
- `includeDeleted` — true/false (default: true)

### Export body
```json
{
  "template": "template1",
  "type": "Laptop",
  "comment": null,
  "userId": null
}
```

## Project Structure

```
idt-inventory/
├── backend/
│   └── InventoryApi/
│       ├── Controllers/       UsersController, InventoryController
│       ├── Data/              AppDbContext, DbSeeder
│       ├── DTOs/              All DTOs and records
│       ├── Mappings/          AutoMapper profile
│       ├── Models/            User, InventoryItem
│       ├── PDF/               PdfService (QuestPDF, 2 templates)
│       ├── Services/          IUserService, UserService, IInventoryService, InventoryService
│       └── Program.cs
└── frontend/
    └── inventory-app/
        └── src/
            ├── api/           client.ts (axios)
            ├── components/    Sidebar, TypeBadge, ItemModal, ExportModal
            ├── pages/         UsersPage, InventoryPage
            └── types/         TypeScript interfaces
```

## Architecture Decisions

- **In-Memory EF Core** — no DB setup needed, seeded on startup
- **Soft delete** — `IsDeleted` flag on `InventoryItem`; excluded from exports and counts
- **Service layer** — controllers delegate to services, keeping them thin
- **AutoMapper** — clean separation between domain models and DTOs
- **QuestPDF** — two visually distinct templates; all PDF logic on the backend
- **React state** — no external state library needed at this scale; local state + direct API calls
