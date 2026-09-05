# Project Architecture Guide

## 1. Executive Summary
This document serves as the architectural source of truth for both human developers and AI agents (Cursor, Windsurf, Devin). All code generated or modified MUST adhere strictly to the constraints and patterns outlined below.

---

## 2. Tech Stack & Infrastructure
- **Language**: TypeScript (Strict mode enabled)
- **Frontend Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management & Data Fetching**: TanStack Query (React Query)
- **Form Management**: React Hook Form + Zod (Validation)
- **Testing**: Vitest + React Testing Library

---

## 3. Directory Layout & Boundaries

```text
src/
├── features/         # Feature Modules (Encapsulated)
├── shared/           # Reusable UI, Utils, Global Types
└── core/             # Infrastructure, Config, DB/API Clients