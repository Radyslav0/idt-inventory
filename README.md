# IDT Inventory Management

Internship technical task - **Present Connection UAB / IDT Team**

## Stack

| Layer    | Technology                                                        |
|----------|-------------------------------------------------------------------|
| Backend  | ASP.NET Core 8, EF Core InMemory, AutoMapper, QuestPDF, FluentValidation |
| Frontend | React 19, TypeScript, Vite, Axios, TanStack Query, React Router   |

## Project structure

```text
idt-inventory/
|-- backend/
|   |-- InventoryManagement.sln
|   |-- InventoryManagement.Core/          Models, DTOs, Interfaces, Constants, Validators
|   |-- InventoryManagement.Infrastructure/ DbContext, Repositories, Seeder
|   `-- InventoryManagement.API/           Controllers, Services, Mappings, PDF
`-- frontend/
    `-- inventory-app/
        `-- src/
            |-- api/         Axios client
            |-- constants/   Endpoints, item types, query keys
            |-- components/  Sidebar, TypeBadge, FilterBar, InventoryStats, InventoryTable, ItemModal, ExportModal
            |-- pages/       UsersPage, InventoryPage
            `-- types/       TypeScript interfaces
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+ LTS](https://nodejs.org/)

## Getting Started

Backend and frontend must run **simultaneously** in two terminals.

### Backend

```bash
cd backend/InventoryManagement.API
dotnet restore
dotnet run
# API -> http://localhost:5179
```

### Frontend

Create `frontend/inventory-app/.env`:

```bash
VITE_API_URL=http://localhost:5179/api
```

Then start the app:

```bash
cd frontend/inventory-app
npm install
npm run dev
# App -> http://localhost:5173
```

### In Rider + WebStorm

**Backend (Rider):**
1. Open `backend/InventoryManagement.sln`
2. Select **InventoryManagement.API** in run config (not IIS Express)
3. Click Run

**Frontend (WebStorm):**
1. Open `frontend/inventory-app`
2. Create `.env` with `VITE_API_URL=http://localhost:5179/api`
3. Terminal -> `npm install` -> `npm run dev`
4. Open http://localhost:5173

## API Endpoints

| Method | Route                 | Description             |
|--------|-----------------------|-------------------------|
| GET    | /api/users            | List all users          |
| POST   | /api/users            | Create user             |
| DELETE | /api/users/{id}       | Delete user             |
| GET    | /api/inventory        | List items (filterable) |
| POST   | /api/inventory        | Create item             |
| PUT    | /api/inventory/{id}   | Update item             |
| DELETE | /api/inventory/{id}   | Soft delete item        |
| POST   | /api/inventory/export | Export PDF              |

## Architecture

- **Multi-project solution** - Core / Infrastructure / API separation
- **Repository pattern** - `IUserRepository`, `IInventoryRepository`
- **Service layer** - business logic isolated from controllers
- **FluentValidation** - all incoming DTOs validated
- **AutoMapper** - clean Model <-> DTO mapping
- **Primary constructors** (C# 12) throughout
- **TanStack Query** - data fetching, caching, cache invalidation
- **React Router** - real URL routing (`/users`, `/inventory`)
- **Constants** - no magic strings anywhere; endpoints, types, templates in dedicated files
- **Soft delete** - `IsDeleted` flag; excluded from exports, greyed-out in UI
