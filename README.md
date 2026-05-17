# IDT Inventory Management

A web application for managing users and their assigned inventory items, with PDF export in two distinct templates.

## Stack

| Layer    | Technology                                               |
|----------|----------------------------------------------------------|
| Backend  | ASP.NET Core 8, EF Core (InMemory), AutoMapper, QuestPDF |
| Frontend | React 18, TypeScript, Vite, Axios                        |

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

---

## Prerequisites

Before running the project, make sure you have installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+ LTS](https://nodejs.org/)

Verify in terminal:
```bash
dotnet --version   # should show 8.x.x
node --version     # should show 20.x or higher
```

---

## Getting Started

The backend and frontend must run **at the same time** in two separate terminals.

### Step 1 — Backend

```bash
cd backend/InventoryApi
dotnet restore
dotnet run
```

The API will start at:
```
http://localhost:5023
```

You can verify the API works by opening:
- http://localhost:5023/api/users
- http://localhost:5023/api/inventory

### Step 2 — Frontend

Open a **second terminal**:

```bash
cd frontend/inventory-app
npm install
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

Open that address in your browser — the full application will load with seeded data.

---

### Running in Rider + WebStorm

**Backend (Rider):**
1. Open `backend/InventoryApi/InventoryApi.csproj` in Rider
2. In the run configuration dropdown at the top, select **"InventoryApi"** (not "InventoryApi: IIS Express")
3. Click ▶ Run

**Frontend (WebStorm):**
1. Open the `frontend/inventory-app` folder in WebStorm
2. Open the built-in terminal (`Alt+F12`)
3. Run `npm install` (first time only)
4. Run `npm run dev`
5. Open http://localhost:5173 in your browser

---

## API Endpoints

| Method | Route                  | Description               |
|--------|------------------------|---------------------------|
| GET    | /api/users             | List all users            |
| POST   | /api/users             | Create user               |
| DELETE | /api/users/{id}        | Delete user               |
| GET    | /api/inventory         | List items (with filters) |
| POST   | /api/inventory         | Create item               |
| PUT    | /api/inventory/{id}    | Update item               |
| DELETE | /api/inventory/{id}    | Soft delete item          |
| POST   | /api/inventory/export  | Export filtered items to PDF |

### Inventory query params
- `type` — `Laptop` | `Phone` | `SimCard` | `Tablet`
- `comment` — substring search
- `userId` — filter by assigned user GUID
- `includeDeleted` — `true` / `false` (default: `true`)

### Export request body
```json
{
  "template": "template1",
  "type": "Laptop",
  "comment": null,
  "userId": null
}
```

---

## Project Structure

```
idt-inventory/
├── backend/
│   └── InventoryApi/
│       ├── Controllers/    UsersController, InventoryController
│       ├── Data/           AppDbContext, DbSeeder
│       ├── DTOs/           All DTO records
│       ├── Mappings/       AutoMapper profile
│       ├── Models/         User, InventoryItem
│       ├── PDF/            PdfService — 2 QuestPDF templates
│       ├── Services/       IUserService, UserService, IInventoryService, InventoryService
│       └── Program.cs
└── frontend/
    └── inventory-app/
        └── src/
            ├── api/        client.ts (axios, baseURL → localhost:5023)
            ├── components/ Sidebar, TypeBadge, ItemModal, ExportModal
            ├── pages/      UsersPage, InventoryPage
            └── types/      TypeScript interfaces
```

---

## Architecture Decisions

- **In-Memory EF Core** — no database setup needed; data is seeded automatically on startup
- **Soft delete** — `IsDeleted` flag on `InventoryItem`; excluded from exports, shown greyed-out in UI
- **Service layer** — controllers stay thin, all business logic lives in services
- **AutoMapper with ConstructUsing** — record DTOs are mapped explicitly to avoid constructor resolution issues
- **QuestPDF** — two visually distinct PDF templates; all export logic stays on the backend
- **React local state** — no external state library needed at this scale; direct API calls via Axios
