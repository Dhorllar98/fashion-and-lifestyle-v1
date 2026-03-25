# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-03-24

### Added
- Initial project structure with React (Vite + TypeScript + Tailwind CSS) frontend
- ASP.NET Core 9 Web API backend in C#
- **Design Catalogue** — browsable collection of clothing styles with category filtering
- **Measurement System** — client measurement input form with all key body measurements
- **Order Flow** — full order creation from design selection through to confirmation
- **Order Tracking** — real-time order status page with visual progress tracker (In Production → Ready → Dispatched → In Transit → Delivered)
- In-memory data store for V1 (no database required to run)
- CORS configured for local React dev server
- Swagger UI enabled in development mode
- Versioning files: `VERSION`, `CHANGELOG.md`

### Notes
- Payment integration (Paystack / Flutterwave) is scaffolded but not wired — planned for v1.1
- Database persistence (PostgreSQL / SQL Server) planned for v2.0
