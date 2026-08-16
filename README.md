# TCC RAPTOR — AI-Powered Retail Virtual Try-On Platform

> An AI-powered retail platform built on Google Gemini. Customers can visualise blazers and formal wear on their own photo using Gemini 3.1 Flash Lite Image, search with natural language, receive personalized recommendations, and build complete outfits — while sellers manage their business through an AI-powered dashboard.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Cloud_Run-1a7f37?logo=googlecloud&logoColor=white)](https://tcc-raptor-retail-ru2czwsr6a-el.a.run.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Gemini_3.1_Flash-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev)

**🔗 Live:** <https://tcc-raptor-retail-ru2czwsr6a-el.a.run.app>

**Created by** Deepan Raj — Senior Solution Architect (Azure, AWS & GCP) · **TCC RAPTOR** · [deepanrey@gmail.com](mailto:deepanrey@gmail.com)

---

## At a Glance

| | |
|---|---|
| **What** | AI retail storefront + seller dashboard with virtual try-on |
| **AI** | Google Gemini 3.1 Flash Lite Image |
| **Frontend** | React 18 · TypeScript · Vite · Tailwind CSS · React Router |
| **Backend** | Firebase (Firestore · Auth · FCM · Storage) |
| **Hosting** | Google Cloud Run — Nginx, scale-to-zero |
| **CI/CD** | GitHub → Cloud Build → Cloud Run |
| **Docs** | [ARCHITECTURE.md](./ARCHITECTURE.md) · [DEPLOYMENT.md](./DEPLOYMENT.md) |

---

## Table of Contents

**Product**
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [User Experience Flow](#user-experience-flow)
- [Seller Dashboard Flow](#seller-dashboard-flow)

**AI Capabilities**
- [AI-Powered Search](#ai-powered-search)
- [Product Recommendations](#product-recommendations)
- [AI Virtual Try-On](#ai-virtual-try-on)
- [Multi-Agent Architecture](#multi-agent-architecture)

**Engineering**
- [Services & Infrastructure](#services--infrastructure)
- [Middleware & APIs](#middleware--apis)
- [Frontend Framework](#frontend-framework)
- [Architecture Diagram](#architecture-diagram)
- [Tech Stack](#tech-stack)

**Operate**
- [Getting Started](#getting-started)
- [Deployment & CI/CD](#deployment--cicd)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [License](#license)

---

## Project Overview

### What It Is

An AI-powered retail platform built on Google Gemini. Customers can visualise blazers and formal wear on their own photo using Gemini 3.1 Flash Lite Image, search with natural language, receive personalized recommendations, and build complete outfits — while sellers manage their business through an AI-powered dashboard.

### Why It Matters

Retail return rates are driven by fit uncertainty. By letting shoppers "wear" items before purchasing, this platform reduces decision friction, increases conversion confidence, and demonstrates TCC RAPTOR's Gemini AI capabilities in a production-grade retail context — for both customers and sellers.

### Scope

- Customer storefront: browse, search, try-on, cart
- Seller dashboard: analytics, forecasting, pricing, copilot
- AI search with natural-language outfit recommendations
- Personalized product recommendations with discounts
- FCM push notifications for cart abandonment & new arrivals

---

## Key Features

| Feature | Description |
|---|---|
| **AI-Powered Natural-Language Search** | Users type conversational queries and receive complete outfit recommendations, not just keyword matches. |
| **Personalized Recommendations** | Purchase history and customer segments drive tailored product suggestions with individualized discounts. |
| **AI Virtual Try-On** | Gemini 3.1 Flash Lite Image renders photorealistic outfit composites from a single user photo — no green screen required. |
| **Outfit Builder** | AI-suggested accessories (vest, trousers, shoes, bag) can be toggled individually to compose and visualise a full look. |
| **AI Seller Dashboard** | A complete command center with sales analytics, AI forecasting, dynamic pricing, and an AI copilot assistant. |
| **Smart Notifications** | FCM-powered push notifications for abandoned cart reminders and personalized product suggestions. |
| **Responsive Product Catalog** | Filterable, paginated catalog across Men and Women categories with Quick View modals. |
| **Gemini Safety Filters** | Every generation request passes through Gemini built-in safety filters for responsible AI output. |
| **Full-Size Image Viewer** | Generated try-on results can be viewed at full resolution in an immersive lightbox. |

---

## User Experience Flow

| Step | Title | Description |
|---|---|---|
| 01 | **Land & Browse** | Customer visits the TCC RAPTOR Try On Store. They browse the product catalog — blazers, formal wear, and accessories — filtered by gender and category. |
| 02 | **AI-Powered Search** | User types a natural-language query like "I want a conference meeting outfit with the best blazer suit." The AI search engine parses intent, occasion, gender, and color to recommend complete outfits rather than just keyword matches. |
| 03 | **Select Product** | User opens a product page. High-res imagery, size options, colour variants and pricing are displayed. A Quick View modal allows rapid evaluation without leaving the listing. |
| 04 | **Virtual Try-On (Blazers)** | User taps "AI Try-On". They upload a photo or capture one with the webcam. The frontend sends the image alongside the garment image to Gemini 3.1 Flash Lite Image, which renders a photorealistic composite of the person wearing the blazer. |
| 05 | **Curate Outfit** | The AI try-on surface suggests complementary items (trousers, vest, shoes, accessories). Users can toggle each suggestion to build a complete outfit before generating. |
| 06 | **Personalized Recommendations** | Based on purchase history, the system surfaces personalized product recommendations with tailored discounts. Logged-in users like Tessa see curated complementary items from previous purchases. |
| 07 | **Add to Cart** | Satisfied with the try-on, the user adds products to the shopping cart. Cart state persists across page navigation via React Context. |
| 08 | **Capture & Share** | Users can download the AI-generated outfit photo to share with friends or compare looks before purchasing. |

---

## Seller Dashboard Flow

| Step | Title | Description |
|---|---|---|
| 01 | **Seller Login** | Authorized seller personnel sign in through a dedicated seller login page. Access is restricted to authorized accounts only — the general public cannot reach the dashboard. |
| 02 | **Seller Home Dashboard** | The command center provides an at-a-glance view of key metrics: revenue, orders, conversion rate, and AI-generated insights for the seller's product portfolio. |
| 03 | **Sales Performance** | Detailed analytics on sales trends, top-performing products, revenue breakdowns by category, and customer segments — all visualized with interactive charts. |
| 04 | **AI Forecast** | Machine learning models predict future demand, seasonal trends, and inventory needs, helping sellers make proactive stocking decisions. |
| 05 | **Dynamic Pricing** | AI-driven pricing engine recommends optimal price points based on demand, competition, inventory levels, and historical sales data. |
| 06 | **AI Copilot** | A conversational AI assistant that helps sellers with product descriptions, marketing copy, customer queries, and strategic recommendations. |
| 07 | **Actions** | A task management surface where AI-generated action items — restock alerts, price adjustments, campaign suggestions — can be reviewed and executed. |

---

## AI-Powered Search

The AI search engine lets users type natural-language prompts and receive intelligent recommendations. Instead of matching individual keywords, the AI understands the user's intent and recommends complete, coordinated outfits.

### Example Query

> "I want a conference meeting outfit with the best blazer suit."

### AI Response — Complete Outfit

| Product |
|---|
| Navy Heritage Blazer |
| Navy Suit Blazer & Trouser |
| Blue Vest Ensemble |
| Brown Oxford Shoes |

### How It Works

| Component | Description |
|---|---|
| **Intent Parsing** | Extracts occasion, gender, category, color, and outfit-completeness from the query. |
| **Product Scoring** | Scores every product against the parsed intent using weighted relevance signals. |
| **Outfit Assembly** | Curates complementary products into a complete, coordinated look. |

---

## Product Recommendations

The recommendation engine analyzes a customer's purchase history, product preferences, and customer segment to surface complementary items with personalized offers. When a user like Tessa logs in, the homepage displays curated recommendations based on her previous purchase of the Heritage Brown Blazer Coat.

### Personalized Example

> Hi Tessa! Based on your previous purchase, Heritage Brown Blazer Coat, we think you might like:
>
> - Luxe Structured Handbag — with an additional 3% discount
> - Sandals & Blazer Set — complete your look with 3% discount

### How It Works

| Component | Description |
|---|---|
| **Purchase History** | Firestore stores each customer's past purchases for recommendation grounding. |
| **Segment Matching** | Customer segments (e.g., "blazer enthusiast") drive which product pools are searched. |
| **Discount Logic** | Personalized discounts are calculated and applied per user, per recommendation. |

---

## AI Virtual Try-On

The virtual try-on feature uses Gemini 3.1 Flash Lite Image to generate photorealistic composites. A user uploads or captures a photo, selects a garment, and the AI renders the person wearing that item — no green screen, no 3D modeling, just a single API call.

| Feature | Description |
|---|---|
| **Photo Capture** | Upload an existing photo or capture live with the device webcam. |
| **Garment Selection** | Choose any blazer or outfit piece from the product catalog. |
| **Gemini Generation** | Gemini 3.1 Flash Lite Image composites the person + garment into one image. |
| **Safety Validation** | Built-in safety filters validate inputs and outputs before display. |
| **Full-Size Viewer** | Results open in an immersive lightbox with keyboard support. |
| **Outfit Builder** | Toggle complementary items to build and visualize a complete look. |

---

## Multi-Agent Architecture

The platform is powered by multiple specialized AI agents that work together. Each agent handles a specific domain, and they communicate through the middleware layer to deliver a cohesive experience.

### Agent Overview

| Agent | Description | Connects To |
|---|---|---|
| **Search Agent** | Parses natural-language queries to extract intent — occasion, gender, category, color, and whether the user wants a complete outfit or individual items. | Recommendation Agent, Outfit Builder Agent |
| **Recommendation Agent** | Reads customer segments and purchase history from Firestore, scores products for relevance, and applies personalized discount logic (e.g., 3% for Tessa). | Notification Agent, Search Agent |
| **Try-On Agent** | Handles the Gemini image generation pipeline — validates uploads, sends user photo + garment to Gemini 3.1 Flash Lite Image, and returns the composite result. | Outfit Builder Agent, Image Storage |
| **Outfit Builder Agent** | Assembles complementary products into complete looks. Receives product matches from the Search and Recommendation agents and curates coordinated sets. | Search Agent, Recommendation Agent, Try-On Agent |
| **Notification Agent** | Monitors Firestore for cart abandonment and new-arrival events. Composes and dispatches FCM push notifications to the appropriate customer segments. | Recommendation Agent, FCM Service |
| **Seller Copilot Agent** | Assists sellers with AI-generated insights — sales forecasts, dynamic pricing recommendations, marketing copy, and actionable task suggestions. | Forecast Agent, Pricing Agent, Seller Dashboard |

### Agent Communication Flow

```
Search Agent → Recommendation Agent → Outfit Builder → Try-On Agent
                                    ↓
Notification Agent → Seller Copilot Agent → Firebase & Gemini Services
```

---

## Services & Infrastructure

### Google Cloud Run Deployment

The application is containerized and deployed on Google Cloud Run, providing auto-scaling, serverless execution, and zero-downtime deployments. Cloud Run handles traffic spikes automatically and scales to zero when idle, optimizing cost.

### Firebase Authentication & Authorization

Firebase Auth manages user identity with email/password authentication. JWT tokens are issued and validated on every request. Role-based access control (RBAC) separates customer and seller permissions — sellers gain dashboard access only through authorized accounts.

### Firestore — Customer Segment Tracking

Firestore NoSQL database stores customer profiles, purchase history, browsing behavior, and segment assignments. Each user is tagged with segments (e.g., "frequent buyer", "blazer enthusiast") that drive personalized recommendations and targeted notifications.

### Firebase Cloud Messaging (FCM)

FCM delivers push notifications for two key scenarios:

1. **Product suggestions** — personalized recommendations sent when new arrivals match a customer's segment
2. **Abandoned cart reminders** — gentle nudges when a user leaves items in their cart without completing checkout

### Firebase Backend Database

Firebase serves as the primary backend database layer:

- **Firestore** — structured data (users, products, orders, cart, segments)
- **Firebase Storage** — media (product images, user uploads, AI-generated try-on results)
- **Real-time listeners** — live cart and inventory updates

### AI Image Generation — Gemini 3.1 Flash Lite Image

Google Gemini 3.1 Flash Lite Image powers the virtual try-on feature. It takes a user photo and a garment image, then generates a photorealistic composite of the person wearing the item. Built-in safety filters validate all inputs and outputs for responsible AI use.

---

## Middleware & APIs

The middleware layer sits between the React frontend and the Firebase/Gemini backend services. It handles authentication, request orchestration, business logic, and data transformation before anything reaches the database or AI models.

| Service | Description |
|---|---|
| **Auth Middleware** | Validates Firebase JWT tokens on every API request, injects the authenticated user into the request context, and rejects unauthorized calls. |
| **Search Orchestration** | Receives natural-language queries, calls the AI intent parser, routes to the recommendation engine, and assembles complete outfit responses. |
| **Recommendation Engine** | Reads customer segments and purchase history from Firestore, matches against product metadata, and returns scored complementary items with discount logic. |
| **Image Generation Pipeline** | Manages the try-on workflow: accepts user photo uploads, validates content safety, calls Gemini 3.1 Flash Lite Image, stores results in Firebase Storage, and returns signed URLs. |
| **Notification Dispatcher** | Listens to Firestore triggers for cart abandonment and new arrivals, composes notification payloads, and sends via FCM to the right customer segments. |
| **Cart & Order Service** | Manages cart state, validates inventory, processes checkout, writes order records to Firestore, and triggers downstream events (confirmation, segment update, recommendation refresh). |

---

## Frontend Framework

### Core Framework

- **React 18** — component-based UI with hooks
- **TypeScript** — type-safe development
- **Vite** — fast HMR dev server & build tool
- **Tailwind CSS** — utility-first styling
- **React Router** — client-side routing

### State & Context

- **AuthContext** — Firebase auth state management
- **CartContext** — shopping cart state
- **SellerAuthContext** — seller session management
- **React hooks** — useState, useEffect, useCallback

### UI Libraries

- **Lucide React** — icon system
- **Tailwind** — custom color ramps & 8px spacing system
- Responsive breakpoints (mobile → desktop)
- Micro-interactions & hover states

### AI Integration

- **Gemini API** — image generation calls
- **aiSearch.ts** — intent parsing & scoring engine
- Client-side recommendation logic
- MediaPipe Hands (WASM) for AR tracking

---

## Architecture Diagram

The platform follows a layered architecture:

1. **Customer Channels → Edge** — Requests arrive from Web, Mobile, or Tablet through a global CDN/load balancer and WAF for threat filtering. DDoS Protection guards against volumetric attacks.
2. **Identity & Application Layer** — Identity provider handles Authentication, SSO and RBAC. The web app hosts the React frontend with modules for Product Catalog, Shopping Cart, User Profile, Order Management, and the Virtual Try-On Portal.
3. **API & Business Processing** — API Management enforces rate limiting, API security and versioning. Serverless functions execute tasks — image upload processing, outfit recommendation workflows, image generation pipelines, cart processing and background jobs. Message queues decouple image generation, recommendation and notification workloads.
4. **AI & Intelligence Layer** — Google Gemini orchestrates Gemini 3.1 Flash Lite Image for Virtual Try-On rendering, outfit visualisation, and product preview generation. Gemini built-in safety filters validate every prompt and image before and after generation.
5. **Data & Storage Layer** — Object storage holds uploaded user images, generated results, product images and avatars. SQL Database stores Users, Orders, Cart, Products and Transactions. Cache accelerates user sessions, recommendation caching and product data.
6. **Observability, Security & DevOps** — Monitoring tracks API performance, token usage and security events. Secret Manager secures API keys and certificates. Cloud security provides threat detection, compliance and vulnerability management. A GitHub-triggered Cloud Build pipeline drives CI/CD through automated build → deploy pipelines targeting Cloud Run.

> 📐 For the **as-built** deployment architecture — the actual Cloud Run + Cloud Build + Secret Manager pipeline, with diagrams — see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript, Vite, Tailwind CSS, React Router, Lucide React |
| **AI Generation** | Google Gemini 3.1 Flash Lite Image |
| **Backend** | Firebase (Firestore, Auth, FCM, Storage) |
| **Deployment** | Google Cloud Run |
| **CI/CD** | GitHub → Cloud Build → Artifact Registry → Cloud Run |
| **Secrets** | Google Secret Manager |
| **AR Tracking** | MediaPipe Hands (WASM, browser-native) |
| **Safety** | Gemini built-in safety filters |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

This key powers the Virtual Try-On feature. It is a **build-time** variable — in production it is injected from Google Secret Manager during the Cloud Build step (see [DEPLOYMENT.md](./DEPLOYMENT.md)). Never commit `.env`; it is git-ignored.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

---

## Deployment & CI/CD

The app is containerized with a multi-stage Docker build (Node build → Nginx serve) and runs on **Google Cloud Run**. Every push to `main` automatically builds and deploys through **Cloud Build**, with the Gemini key injected at build time from **Secret Manager**.

```bash
git push origin main   # → Cloud Build → new Cloud Run revision (~4 min)
```

| | |
|---|---|
| **Live URL** | <https://tcc-raptor-retail-ru2czwsr6a-el.a.run.app> |
| **Region** | `asia-south1` |
| **Trigger** | `deploy-tcc-raptor` (push to `main`) |
| **Pipeline** | [`cloudbuild.yaml`](./cloudbuild.yaml) |

- **Step-by-step runbook:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **How the pipeline & runtime work (with diagrams):** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Project Structure

```
.
├── src/                     # Application source (detailed below)
├── Dockerfile               # Multi-stage build → Nginx (port 8080)
├── nginx.conf               # Static serving, gzip, SPA fallback, security headers
├── cloudbuild.yaml          # CI/CD pipeline: build → push → deploy
├── DEPLOYMENT.md            # Deployment runbook (GCP → Secret Manager → Cloud Run)
├── ARCHITECTURE.md          # As-built architecture & pipeline docs (diagrams)
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind theme & tokens
└── tsconfig*.json           # TypeScript configuration
```

```
src/
├── components/
│   ├── AboutModal.tsx              # About this project — detailed architecture
│   ├── AISearchModal.tsx           # AI-powered natural-language search modal
│   ├── AuthModal.tsx               # Login / signup modal
│   ├── Footer.tsx                  # Site footer
│   ├── Header.tsx                  # Navigation header with search, cart, auth
│   ├── PersonalizedRecommendations.tsx  # Tessa's personalized recommendations
│   ├── ProductCard.tsx             # Product display card
│   ├── QuickViewModal.tsx          # Quick product preview modal
│   └── VirtualTryOnModal.tsx       # AI virtual try-on with Gemini
├── context/
│   ├── AuthContext.tsx             # Firebase auth state management
│   ├── CartContext.tsx             # Shopping cart state
│   └── SellerAuthContext.tsx       # Seller session management
├── data/
│   ├── products.ts                 # Product catalog (Men & Women)
│   └── sellerData.ts               # Seller dashboard mock data
├── lib/
│   ├── aiSearch.ts                 # AI intent parsing & outfit recommendation engine
│   └── firebase.ts                 # Firebase initialization
├── pages/
│   ├── CategoryLandingPage.tsx     # Category landing page
│   ├── CategoryPage.tsx            # Category browse page
│   ├── HomePage.tsx                # Homepage with hero, collections, recommendations
│   ├── ProductDetailPage.tsx       # Individual product detail page
│   ├── ProductListingPage.tsx      # Product listing with filters
│   └── seller/
│       ├── Actions.tsx             # AI-generated action items
│       ├── AICopilot.tsx           # Conversational AI seller assistant
│       ├── AIForecast.tsx          # Demand & trend forecasting
│       ├── DynamicPricing.tsx      # AI-driven pricing recommendations
│       ├── SalesPerformance.tsx    # Sales analytics dashboard
│       ├── SellerHome.tsx          # Seller dashboard home
│       ├── SellerLayout.tsx        # Seller dashboard layout shell
│       └── SellerLoginPage.tsx     # Seller login page
├── public/                         # Static assets (product images, model photos)
├── App.tsx                         # Root app component with routing
├── main.tsx                        # App entry point
└── index.css                       # Global styles & Tailwind config
```

---

## Documentation

| Document | What's inside |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | As-built architecture — the deploy pipeline & runtime with diagrams, build-time secret handling, and the IAM model. |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Step-by-step deploy runbook — GCP setup, Secret Manager, Artifact Registry, Cloud Build trigger, and Cloud Run. |

---

## License

This project is proprietary to TCC RAPTOR. All rights reserved.

---

## About

**Deepan Raj** — Senior Solution Architect (Azure, AWS & GCP)
TCC RAPTOR
[deepanraj.vellingiri@tccraptor.com](mailto:deepanraj.vellingiri@tccraptor.com)
