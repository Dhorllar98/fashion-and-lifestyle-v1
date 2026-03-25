# Fashion & Lifestyle — v1.0.0

A custom clothing website where clients can browse designs, place orders, and track their production in real time.

## Features

| Feature | Status |
|---|---|
| Design Catalogue | ✅ v1 |
| Measurement System | ✅ v1 |
| Order Placement | ✅ v1 |
| Order Tracking | ✅ v1 |
| Payment Integration | 🔜 v1.1 |
| Database Persistence | 🔜 v2.0 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | ASP.NET Core 9, C# |
| Data (v1) | In-memory (no database required) |

---

## Project Structure

```
fashion-and-lifestyle-v1/
├── frontend/               # React app
│   └── src/
│       ├── components/     # Navbar, Footer, and feature components
│       ├── pages/          # Home, Catalogue, Measurements, Checkout, Tracking
│       ├── services/       # Axios API client
│       └── types/          # Shared TypeScript types
├── backend/                # ASP.NET Core Web API
│   ├── Controllers/        # CatalogueController, MeasurementsController, OrdersController
│   ├── Models/             # Design, Measurement, Order
│   └── Services/           # Business logic (in-memory for v1)
├── CHANGELOG.md
└── VERSION
```

---

## Getting Started

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [.NET 9 SDK](https://dotnet.microsoft.com/)

### Backend

```bash
cd backend
dotnet run
# API runs on https://localhost:7000 / http://localhost:5000
# Swagger UI: http://localhost:5000/swagger
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/catalogue` | Get all designs |
| GET | `/api/catalogue/{id}` | Get design by ID |
| GET | `/api/catalogue/category/{cat}` | Filter by category |
| POST | `/api/measurements` | Submit measurements |
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/track/{orderNumber}` | Track an order |
| PATCH | `/api/orders/{id}/status` | Update order status |

---

## Versioning

This project uses [Semantic Versioning](https://semver.org/). See [CHANGELOG.md](CHANGELOG.md) for release history.
