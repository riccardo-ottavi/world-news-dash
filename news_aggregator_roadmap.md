# News Aggregator Project Roadmap

## Overview
Project: RSS News Aggregator Dashboard  
Stack: React + TypeScript, Node.js + Express, PostgreSQL, Worker (Node.js)

---

## Phase 0 — Project Setup
- [x] Initialize monorepo structure (/frontend, /backend, /worker)
- [x] Setup TypeScript across all packages
- [x] Setup Git repository
- [x] Create environment variable strategy (.env per service)

---

## Phase 1 — Data Sources (RSS)
- [x] Select initial RSS sources (BBC, Reuters, AP, ANSA, Il Post, TechCrunch)
- [x] Store sources in database schema
- [ ] Verify RSS accessibility for each source
- [ ] Build RSS fetch proof-of-concept script

---

## Phase 2 — Database Design
- [ ] Setup PostgreSQL instance
- [ ] Setup Prisma ORM
- [ ] Design schema:
    - [ ] articles
    - [ ] sources
    - [ ] categories
- [ ] Run initial migrations

---

## Phase 3 — Worker (Core Ingestion System)
- [ ] Implement RSS fetcher module
- [ ] Implement XML parser
- [ ] Normalize article structure
- [ ] Implement deduplication (hash-based)
- [ ] Implement basic categorization
- [ ] Save articles to DB
- [ ] Add cron scheduler (every 10–15 min)
- [ ] Add error handling per source

---

## Phase 4 — Backend API (Express)
- [ ] Setup Express server structure
- [ ] Implement routes:
    - [ ] GET /news
    - [ ] GET /news/:id
    - [ ] GET /categories
    - [ ] GET /sources
- [ ] Implement pagination
- [ ] Add filtering (category, source, date)
- [ ] Add basic caching layer (optional)

---

## Phase 5 — Frontend (React + TS)
- [ ] Setup Vite + React + TypeScript
- [ ] Setup routing
- [ ] Build layout (header + categories + feed)
- [ ] Implement news feed page
- [ ] Implement article detail page
- [ ] Connect API via TanStack Query
- [ ] Add loading and error states

---

## Phase 6 — Improvements (Quality Layer)
- [ ] Improve deduplication (fuzzy matching)
- [ ] Improve categorization logic
- [ ] Add trending algorithm
- [ ] Add source weighting system

---

## Phase 7 — Advanced Features (Optional)
- [ ] AI summaries for articles
- [ ] Keyword extraction
- [ ] Sentiment analysis
- [ ] User accounts
- [ ] Saved articles

---

## Definition of Done (MVP)
- [ ] Worker collects news from 6 sources
- [ ] Articles stored in DB without duplicates
- [ ] Express API serves articles correctly
- [ ] React dashboard displays categorized news
