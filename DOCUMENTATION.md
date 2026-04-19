# Accessibility Needs Generative Planner

## Complete Project Documentation

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Objectives & Scope](#2-objectives--scope)
3. [Literature Survey & Existing System Study](#3-literature-survey--existing-system-study)
4. [Requirements Specification](#4-requirements-specification)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Database Design](#7-database-design)
8. [Module Descriptions](#8-module-descriptions)
9. [API Design](#9-api-design)
10. [ML/AI Pipeline](#10-mlai-pipeline)
11. [UI/UX Design Guidelines](#11-uiux-design-guidelines)
12. [Implementation Plan & Timeline](#12-implementation-plan--timeline)
13. [Testing Strategy](#13-testing-strategy)
14. [Future Enhancements](#14-future-enhancements)

---

## 1. Problem Statement

### Background

Over 1.3 billion people worldwide — roughly 16% of the global population — experience some form of significant disability (WHO, 2023). These individuals face daily challenges in planning activities such as commuting, scheduling appointments, accessing public spaces, and managing routines. Existing planning tools (calendars, map applications, to-do apps) are designed for the general population and fail to account for the specific, personalized accessibility needs of individuals with disabilities.

### Problem

**"People with disabilities face significant difficulty in planning daily activities due to the lack of personalized, context-aware accessibility support in existing planning tools."**

Key pain points include:

- **Mobility impairments**: Difficulty finding wheelchair-accessible routes, ramp-equipped venues, and barrier-free transportation options.
- **Visual impairments**: Lack of audio-guided navigation, screen-reader-friendly planning interfaces, and high-contrast visual outputs.
- **Hearing impairments**: Absence of visual/vibration-based alerts, captioned content in recommendations, and sign-language-friendly resources.
- **Cognitive impairments**: Complex interfaces that overwhelm users; no simplified, step-by-step planning support.
- **Multiple/combined disabilities**: Almost no existing tool handles overlapping accessibility needs in a unified manner.

### Need for the System

There is a clear need for an intelligent, generative planning system that:
- Takes individual accessibility needs as input
- Understands the context of the planned activity (travel, daily routine, event attendance, etc.)
- Generates a **personalized, actionable plan** with accessibility-aware recommendations
- Adapts dynamically based on feedback and changing needs

---

## 2. Objectives & Scope

### Objectives

| # | Objective | Description |
|---|-----------|-------------|
| O1 | Personalized Accessibility Plans | Generate customized daily/activity plans based on user-specific disability profiles |
| O2 | Multi-Disability Support | Handle mobility, visual, hearing, cognitive, and combined disability types |
| O3 | Generative AI Integration | Use generative AI models to produce natural-language plans, recommendations, and alternatives |
| O4 | Accessible Interface | Build a UI that itself follows WCAG 2.1 AA accessibility standards |
| O5 | Improve Independence | Reduce dependence on caregivers for daily planning tasks |
| O6 | Context-Aware Recommendations | Factor in location, time, weather, and venue accessibility data |
| O7 | Feedback Loop | Allow users to rate and refine recommendations, improving future suggestions |

### Scope

#### In Scope (Version 1.0)

- Web-based application accessible via modern browsers
- User registration, authentication, and profile management
- Disability profile creation (selecting disability types, severity, specific needs)
- Activity/plan input (what the user wants to do — commute, attend an event, daily routine)
- AI-generated personalized plans with step-by-step recommendations
- Accessibility-aware recommendations (routes, tools, schedules, venues)
- Basic feedback mechanism (thumbs up/down, comments on suggestions)
- Support for 4 primary disability categories: Mobility, Visual, Hearing, Cognitive
- Responsive web design with accessibility compliance

#### Out of Scope (Version 1.0)

- Native mobile applications (iOS/Android) — deferred to v2
- Real-time GPS-based navigation — deferred to v2
- Integration with wearable devices
- Multi-language support beyond English
- Third-party calendar sync (Google Calendar, Outlook)
- Community/social features

---

## 3. Literature Survey & Existing System Study

### 3.1 Existing Systems

| System | Type | Strengths | Limitations |
|--------|------|-----------|-------------|
| **Google Maps Accessibility** | Navigation | Wheelchair-accessible routes, transit info | Limited to navigation only; no holistic daily planning |
| **Be My Eyes** | Visual assistance | Connects blind users with volunteers via video | Reactive, not proactive planning; requires human help |
| **Ava** | Hearing assistance | Real-time captioning for deaf users | Single-purpose; no planning capability |
| **AccessNow** | Crowdsourced data | Rates accessibility of venues worldwide | Data-only; no plan generation or recommendations |
| **Microsoft Soundscape** | Audio navigation | 3D audio cues for visually impaired users | Navigation-focused; discontinued in 2023 |
| **Wheelmap** | Venue accessibility | Crowdsourced wheelchair accessibility data | Static data; no personalized planning |
| **Assistive Touch / VoiceOver** | OS-level tools | Device-level accessibility | Platform-bound; not application-specific planning |

### 3.2 AI-Based Recommendation Systems Studied

| System/Approach | Technique | Relevance |
|-----------------|-----------|-----------|
| **Content-based filtering** | Matches user profile with item features | Useful for matching disability needs to venue/route features |
| **Collaborative filtering** | Recommends based on similar users' preferences | Can suggest plans that worked for users with similar disabilities |
| **GPT-based generative models** | Natural language generation | Core technology for generating readable, personalized plans |
| **Knowledge graph recommendations** | Structured relationship-based reasoning | Useful for connecting disability types → needs → solutions |

### 3.3 Identified Gaps in Existing Systems

| Gap | Description |
|-----|-------------|
| **Lack of Personalization** | Most tools offer one-size-fits-all solutions; they don't adapt to individual disability profiles |
| **Siloed Solutions** | Each tool addresses one disability type or one activity; no unified planner exists |
| **No Generative Planning** | Existing tools provide data or navigation but don't *generate* complete activity plans |
| **Poor Multi-Disability Handling** | Users with overlapping disabilities (e.g., mobility + visual) find no integrated support |
| **No Feedback Integration** | Recommendations are static; they don't improve based on user feedback |
| **Accessibility of the Tools Themselves** | Ironically, many accessibility tools have poor UI accessibility |

### 3.4 How This Project Addresses the Gaps

- **Unified platform** covering multiple disability types in a single planner
- **Generative AI** produces complete, readable, actionable plans (not just data points)
- **Profile-driven personalization** adapts every recommendation to the individual
- **Feedback loop** continuously improves plan quality
- **WCAG-compliant UI** ensures the tool itself is accessible

---

## 4. Requirements Specification

### 4.1 Functional Requirements

| ID | Requirement | Description | Priority |
|----|-------------|-------------|----------|
| FR-01 | User Registration | Users can create an account with email/password or OAuth | High |
| FR-02 | User Login/Logout | Secure authentication with session management | High |
| FR-03 | Disability Profile Setup | Users select disability types, severity levels, and specific needs | High |
| FR-04 | Activity Input | Users describe what they want to plan (free-text or structured form) | High |
| FR-05 | Plan Generation | System generates a personalized, step-by-step accessibility plan using AI | High |
| FR-06 | Plan Display | Plans are displayed in an accessible, easy-to-read format with sections | High |
| FR-07 | Alternative Suggestions | System provides 2–3 alternative approaches for each plan | Medium |
| FR-08 | Accessibility Recommendations | Suggest tools, routes, venues, and schedules based on user's disability profile | High |
| FR-09 | Plan History | Users can view, revisit, and reuse previously generated plans | Medium |
| FR-10 | Feedback Mechanism | Users can rate plans (thumbs up/down) and leave comments | Medium |
| FR-11 | Profile Editing | Users can update their disability profile and preferences at any time | Medium |
| FR-12 | Search & Filter | Users can search through past plans and filter by activity type | Low |
| FR-13 | Admin Dashboard | Admin can view system stats, user counts, and flagged content | Low |

### 4.2 Non-Functional Requirements

| ID | Requirement | Description | Target |
|----|-------------|-------------|--------|
| NFR-01 | Usability | Simple, intuitive UI with minimal learning curve | < 5 min onboarding |
| NFR-02 | Accessibility Compliance | UI follows WCAG 2.1 Level AA standards | Full compliance |
| NFR-03 | Performance | Plan generation completes within acceptable time | < 10 seconds |
| NFR-04 | Scalability | System handles growing user base | Up to 10,000 concurrent users |
| NFR-05 | Security | User data encrypted at rest and in transit | AES-256 + TLS 1.3 |
| NFR-06 | Availability | System uptime target | 99.5% |
| NFR-07 | Responsiveness | Works across devices and screen sizes | Mobile, tablet, desktop |
| NFR-08 | Data Privacy | GDPR-compliant data handling | Full compliance |
| NFR-09 | Maintainability | Clean, modular codebase with documentation | Documented APIs |
| NFR-10 | Browser Support | Supports modern browsers | Chrome, Firefox, Safari, Edge |

### 4.3 User Roles

| Role | Permissions |
|------|-------------|
| **Guest** | View landing page, register |
| **Registered User** | Full access to profile, plan generation, history, feedback |
| **Admin** | User management, system monitoring, content moderation |

---

## 5. Technology Stack

### 5.1 Stack Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  React.js + Tailwind CSS + Accessibility Libraries  │
├─────────────────────────────────────────────────────┤
│                   BACKEND API                       │
│           Python (Flask) + REST API                 │
├─────────────────────────────────────────────────────┤
│                  AI/ML ENGINE                       │
│     OpenAI GPT API / Hugging Face Transformers      │
├─────────────────────────────────────────────────────┤
│                   DATABASE                          │
│            MongoDB (NoSQL) + Redis Cache             │
├─────────────────────────────────────────────────────┤
│              EXTERNAL SERVICES                      │
│   Maps API · Speech-to-Text · Weather API           │
└─────────────────────────────────────────────────────┘
```

### 5.2 Detailed Stack Justification

| Layer | Technology | Why This Choice |
|-------|-----------|-----------------|
| **Frontend** | React.js | Component-based architecture; strong ecosystem for accessibility (react-aria, reach-ui) |
| **Styling** | Tailwind CSS | Utility-first approach enables rapid, consistent, responsive design |
| **Accessibility** | react-aria / @reach/ui | Purpose-built accessible component libraries |
| **Backend** | Python Flask | Lightweight, flexible; excellent ML/AI library ecosystem in Python |
| **API Format** | REST (JSON) | Simple, well-understood; sufficient for v1 requirements |
| **AI/ML** | OpenAI GPT API | State-of-the-art generative text; produces natural-language plans |
| **ML Fallback** | Hugging Face Transformers | Open-source alternative; can run locally without API dependency |
| **Database** | MongoDB | Schema-flexible; ideal for varied disability profiles and plan structures |
| **Caching** | Redis | Fast in-memory caching for frequently accessed data and session management |
| **Authentication** | JWT + bcrypt | Stateless auth tokens; industry-standard password hashing |
| **Maps** | Google Maps API / OpenStreetMap | Accessibility-aware routing data |
| **Speech-to-Text** | Web Speech API / Google STT | Enables voice input for users who can't type |
| **Deployment** | Docker + cloud hosting | Containerized, reproducible deployment |

### 5.3 Development Tools

| Tool | Purpose |
|------|---------|
| Git + GitHub | Version control and collaboration |
| VS Code / Cursor | Primary IDE |
| Postman | API testing |
| MongoDB Compass | Database GUI |
| Figma | UI/UX mockup design |
| Jest + Pytest | Frontend + Backend testing |
| ESLint + Prettier | Code quality and formatting |

---

## 6. System Architecture

### 6.1 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   React Frontend                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │  │
│  │  │  Auth    │ │ Profile  │ │  Plan    │ │   History    │ │  │
│  │  │  Pages   │ │  Setup   │ │ Generator│ │   & Review   │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │  │
│  └───────────────────────┬────────────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────────────┘
                           │ HTTP/HTTPS (REST API)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Flask Backend Server                        │
│                                                                  │
│  ┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐  │
│  │  Auth    │ │   Profile    │ │    Plan      │ │  Feedback  │  │
│  │  Module  │ │   Module     │ │  Generation  │ │  Module    │  │
│  │          │ │              │ │   Module     │ │            │  │
│  └────┬─────┘ └──────┬───────┘ └──────┬───────┘ └─────┬─────┘  │
│       │              │                │               │          │
│  ┌────┴──────────────┴────────────────┴───────────────┴──────┐  │
│  │                    Service Layer                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │  │
│  │  │ User Service │  │ Plan Service │  │ AI/ML Service  │  │  │
│  │  └──────────────┘  └──────────────┘  └───────┬────────┘  │  │
│  └──────────────────────────────────────────────┼────────────┘  │
│                                                  │               │
└──────────────────────┬───────────────────────────┼───────────────┘
                       │                           │
              ┌────────┴────────┐         ┌────────┴────────┐
              │                 │         │                 │
              ▼                 ▼         ▼                 ▼
     ┌──────────────┐  ┌────────────┐  ┌──────────────────────┐
     │   MongoDB    │  │   Redis    │  │   External APIs      │
     │              │  │   Cache    │  │  ┌─────────────────┐ │
     │ • Users      │  │            │  │  │ OpenAI GPT API  │ │
     │ • Profiles   │  │ • Sessions │  │  ├─────────────────┤ │
     │ • Plans      │  │ • Cache    │  │  │ Google Maps API │ │
     │ • Feedback   │  │            │  │  ├─────────────────┤ │
     │              │  │            │  │  │ Weather API     │ │
     │              │  │            │  │  ├─────────────────┤ │
     │              │  │            │  │  │ Speech-to-Text  │ │
     └──────────────┘  └────────────┘  │  └─────────────────┘ │
                                       └──────────────────────┘
```

### 6.2 Data Flow Diagram

```
User Input                    Processing                     Output
─────────                    ──────────                     ──────

┌─────────────┐         ┌──────────────────┐         ┌──────────────┐
│ 1. User     │         │ 3. Profile       │         │ 6. Generated │
│    Login /  │────────▶│    Loaded from   │────────▶│    Plan      │
│    Register │         │    Database      │         │    Displayed │
└─────────────┘         └──────────────────┘         └──────────────┘
                                │                           │
┌─────────────┐                 ▼                           ▼
│ 2. User     │         ┌──────────────────┐         ┌──────────────┐
│    Inputs   │────────▶│ 4. Context       │         │ 7. User      │
│    Activity │         │    Builder       │         │    Feedback  │
│    Details  │         │    (profile +    │         │    Collected │
└─────────────┘         │     activity +   │         └──────┬───────┘
                        │     location)    │                │
                        └────────┬─────────┘                ▼
                                 │                   ┌──────────────┐
                                 ▼                   │ 8. Model     │
                        ┌──────────────────┐         │    Fine-     │
                        │ 5. AI Engine     │         │    Tuning    │
                        │    Generates     │         │    (Future)  │
                        │    Plan via GPT  │         └──────────────┘
                        └──────────────────┘
```

### 6.3 Component Interaction Flow

```
[User] ──▶ [React Frontend] ──▶ [Flask API Gateway]
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
             [Auth Service]     [Plan Service]      [Profile Service]
                    │                   │                   │
                    │                   ▼                   │
                    │          [AI/ML Engine]               │
                    │           │         │                 │
                    │           ▼         ▼                 │
                    │     [GPT API]  [Context              │
                    │                 Builder]              │
                    │                   │                   │
                    └───────────┬───────┴───────────────────┘
                                ▼
                    [MongoDB] ◀──▶ [Redis Cache]
```

---

## 7. Database Design

### 7.1 Collections (MongoDB)

#### Users Collection

```json
{
  "_id": "ObjectId",
  "email": "string (unique, indexed)",
  "password_hash": "string (bcrypt)",
  "full_name": "string",
  "role": "string (user | admin)",
  "created_at": "datetime",
  "updated_at": "datetime",
  "last_login": "datetime",
  "is_active": "boolean"
}
```

#### Accessibility Profiles Collection

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: Users)",
  "disabilities": [
    {
      "type": "string (mobility | visual | hearing | cognitive)",
      "severity": "string (mild | moderate | severe)",
      "specific_needs": ["string"],
      "assistive_devices": ["string"]
    }
  ],
  "preferences": {
    "preferred_transport": ["string"],
    "max_walking_distance": "number (meters)",
    "requires_companion": "boolean",
    "preferred_plan_format": "string (detailed | summary | step-by-step)",
    "voice_input_preferred": "boolean",
    "high_contrast_mode": "boolean",
    "font_size_preference": "string (normal | large | extra-large)"
  },
  "location": {
    "city": "string",
    "default_address": "string",
    "coordinates": { "lat": "number", "lng": "number" }
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Plans Collection

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: Users)",
  "activity_input": {
    "description": "string",
    "activity_type": "string (commute | event | daily_routine | shopping | medical | custom)",
    "date": "date",
    "time_range": { "start": "time", "end": "time" },
    "destination": "string (optional)",
    "special_requirements": "string (optional)"
  },
  "generated_plan": {
    "title": "string",
    "summary": "string",
    "steps": [
      {
        "step_number": "number",
        "title": "string",
        "description": "string",
        "time_estimate": "string",
        "accessibility_notes": ["string"],
        "tools_needed": ["string"]
      }
    ],
    "alternative_options": [
      {
        "title": "string",
        "description": "string",
        "trade_offs": "string"
      }
    ],
    "recommended_tools": ["string"],
    "emergency_contacts": ["string"],
    "weather_advisory": "string (optional)"
  },
  "ai_model_used": "string",
  "generation_time_ms": "number",
  "status": "string (generated | saved | archived)",
  "created_at": "datetime"
}
```

#### Feedback Collection

```json
{
  "_id": "ObjectId",
  "plan_id": "ObjectId (ref: Plans)",
  "user_id": "ObjectId (ref: Users)",
  "rating": "number (1-5)",
  "thumbs": "string (up | down)",
  "comment": "string (optional)",
  "useful_steps": ["number (step indices)"],
  "problematic_steps": ["number (step indices)"],
  "created_at": "datetime"
}
```

### 7.2 Entity-Relationship Overview

```
┌──────────┐       1:1       ┌─────────────────────┐
│  Users   │────────────────▶│ Accessibility        │
│          │                 │ Profiles             │
└────┬─────┘                 └─────────────────────┘
     │
     │ 1:N
     ▼
┌──────────┐       1:N       ┌─────────────────────┐
│  Plans   │────────────────▶│ Feedback             │
│          │                 │                      │
└──────────┘                 └─────────────────────┘
```

---

## 8. Module Descriptions

### Module 1: Authentication Module

| Aspect | Detail |
|--------|--------|
| **Purpose** | Handle user registration, login, logout, and session management |
| **Key Functions** | `register()`, `login()`, `logout()`, `verify_token()`, `reset_password()` |
| **Security** | bcrypt password hashing, JWT tokens (15-min access + 7-day refresh), rate limiting |
| **Endpoints** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/refresh` |

### Module 2: Profile Management Module

| Aspect | Detail |
|--------|--------|
| **Purpose** | Create and manage user disability profiles and preferences |
| **Key Functions** | `create_profile()`, `update_profile()`, `get_profile()`, `validate_profile()` |
| **Features** | Multi-disability support, severity levels, assistive device tracking, preference management |
| **Endpoints** | `POST /api/profile`, `GET /api/profile`, `PUT /api/profile`, `PATCH /api/profile/preferences` |

### Module 3: Plan Generation Module (Core)

| Aspect | Detail |
|--------|--------|
| **Purpose** | Generate personalized accessibility plans using AI |
| **Key Functions** | `generate_plan()`, `build_context()`, `call_ai_engine()`, `format_plan()`, `generate_alternatives()` |
| **AI Flow** | 1) Build context from profile + activity input → 2) Construct prompt → 3) Call GPT API → 4) Parse and structure response → 5) Enrich with external data (maps, weather) → 6) Return formatted plan |
| **Endpoints** | `POST /api/plans/generate`, `GET /api/plans/:id`, `GET /api/plans/history` |

### Module 4: Feedback Module

| Aspect | Detail |
|--------|--------|
| **Purpose** | Collect user feedback on generated plans for quality improvement |
| **Key Functions** | `submit_feedback()`, `get_feedback_stats()`, `aggregate_ratings()` |
| **Endpoints** | `POST /api/feedback`, `GET /api/feedback/plan/:plan_id` |

### Module 5: Admin Module

| Aspect | Detail |
|--------|--------|
| **Purpose** | System monitoring, user management, and analytics |
| **Key Functions** | `get_dashboard_stats()`, `list_users()`, `manage_user()`, `view_system_health()` |
| **Endpoints** | `GET /api/admin/stats`, `GET /api/admin/users`, `PUT /api/admin/users/:id` |

---

## 9. API Design

### 9.1 API Endpoints Summary

```
BASE URL: /api/v1

Authentication
├── POST   /auth/register          Register new user
├── POST   /auth/login             Login and get tokens
├── POST   /auth/logout            Invalidate session
└── POST   /auth/refresh           Refresh access token

Profile
├── POST   /profile                Create accessibility profile
├── GET    /profile                Get current user's profile
├── PUT    /profile                Update full profile
└── PATCH  /profile/preferences    Update preferences only

Plans
├── POST   /plans/generate         Generate a new plan
├── GET    /plans/:id              Get a specific plan
├── GET    /plans/history          Get all plans for current user
└── DELETE /plans/:id              Delete a plan

Feedback
├── POST   /feedback               Submit feedback for a plan
└── GET    /feedback/plan/:id      Get feedback for a plan

Admin
├── GET    /admin/stats            Dashboard statistics
├── GET    /admin/users            List all users
└── PUT    /admin/users/:id        Update user status
```

### 9.2 Example API Request/Response

**Generate Plan Request:**

```json
POST /api/v1/plans/generate
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "activity": {
    "description": "I need to visit the city hospital for a checkup tomorrow morning",
    "activity_type": "medical",
    "date": "2026-04-20",
    "time_range": { "start": "09:00", "end": "12:00" },
    "destination": "City General Hospital, Main Street"
  }
}
```

**Generate Plan Response:**

```json
{
  "success": true,
  "plan": {
    "id": "plan_abc123",
    "title": "Hospital Visit Plan — Accessibility Optimized",
    "summary": "A step-by-step plan for your hospital visit, accounting for wheelchair accessibility and visual impairment support.",
    "steps": [
      {
        "step_number": 1,
        "title": "Prepare for departure",
        "description": "Pack your mobility aids and ensure your phone is charged for navigation assistance. Carry hospital documents in an easy-access folder.",
        "time_estimate": "15 minutes",
        "accessibility_notes": [
          "Use a tactile-labeled folder for documents",
          "Ensure wheelchair is charged if electric"
        ],
        "tools_needed": ["Wheelchair", "Phone with screen reader"]
      },
      {
        "step_number": 2,
        "title": "Travel to hospital",
        "description": "Take the accessible Route 7 bus from your nearest stop (200m, paved sidewalk). The bus has a wheelchair ramp. Estimated travel time: 25 minutes.",
        "time_estimate": "30 minutes",
        "accessibility_notes": [
          "Bus stop has tactile paving",
          "Request ramp deployment from driver",
          "Audio announcements available on Route 7"
        ],
        "tools_needed": ["Transit pass", "Headphones for audio nav"]
      }
    ],
    "alternative_options": [
      {
        "title": "Taxi with wheelchair accessibility",
        "description": "Book an accessible taxi via AccessRide app, door-to-door service.",
        "trade_offs": "More expensive but eliminates transit navigation"
      }
    ],
    "recommended_tools": ["AccessRide App", "Google Maps (accessibility mode)", "Hospital accessibility guide"],
    "weather_advisory": "Clear skies expected, 22°C. No weather-related adjustments needed."
  }
}
```

---

## 10. ML/AI Pipeline

### 10.1 Overview

The AI engine is the heart of the system. It takes structured context (user profile + activity details) and generates a comprehensive, personalized accessibility plan.

### 10.2 Pipeline Architecture

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│  User Profile  │     │  Activity      │     │  External      │
│  (disabilities,│     │  Input         │     │  Data          │
│   preferences, │     │  (what, when,  │     │  (weather,     │
│   devices)     │     │   where)       │     │   map data)    │
└───────┬────────┘     └───────┬────────┘     └───────┬────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ▼
                  ┌──────────────────────┐
                  │   Context Builder    │
                  │   (Merges all data   │
                  │    into structured   │
                  │    prompt context)   │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   Prompt Engineer    │
                  │   (Constructs        │
                  │    system + user     │
                  │    prompts)          │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   GPT API Call       │
                  │   (Temperature: 0.7, │
                  │    structured output)│
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   Response Parser    │
                  │   (JSON extraction,  │
                  │    validation,       │
                  │    formatting)       │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   Plan Enricher      │
                  │   (Add map links,    │
                  │    tool suggestions, │
                  │    weather info)     │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   Final Plan Output  │
                  └──────────────────────┘
```

### 10.3 Prompt Engineering Strategy

The system uses a **multi-layered prompt** approach:

**System Prompt (Fixed):**
> You are an accessibility planning assistant. You generate detailed, step-by-step plans for people with disabilities. Your plans must be practical, safe, and sensitive to the user's specific needs. Always provide alternatives and note accessibility features of recommended locations, routes, and tools.

**Context Prompt (Dynamic — per request):**
> User Profile: [disability types, severity, devices, preferences]
> Activity: [description, type, date, time, destination]
> Location Data: [accessible routes, venue accessibility info]
> Weather: [current/forecast conditions]

**Instruction Prompt (Structured output):**
> Generate a plan with: title, summary, numbered steps (each with description, time estimate, accessibility notes, tools needed), 2 alternative approaches, recommended tools list, and any weather advisories. Return as structured JSON.

### 10.4 Future ML Enhancements

| Enhancement | Description | Timeline |
|-------------|-------------|----------|
| **Feedback-based fine-tuning** | Use collected feedback to fine-tune the model on high-rated plans | v2.0 |
| **Collaborative filtering** | Recommend plans that worked for similar users | v2.0 |
| **Reinforcement learning** | Optimize plan generation based on user satisfaction signals | v3.0 |
| **Local model deployment** | Run a fine-tuned open-source model (LLaMA/Mistral) for privacy | v3.0 |

---

## 11. UI/UX Design Guidelines

### 11.1 Accessibility-First Design Principles

| Principle | Implementation |
|-----------|----------------|
| **WCAG 2.1 AA Compliance** | All components meet AA contrast ratios (4.5:1 normal text, 3:1 large text) |
| **Keyboard Navigation** | Every interactive element reachable and operable via keyboard |
| **Screen Reader Support** | Proper ARIA labels, roles, and live regions throughout |
| **Focus Management** | Visible focus indicators; logical focus order on all pages |
| **Resizable Text** | UI supports up to 200% zoom without horizontal scrolling |
| **Error Handling** | Clear, descriptive error messages associated with form fields |
| **Color Independence** | Information never conveyed by color alone |
| **Motion Control** | Reduced motion option; no auto-playing animations |

### 11.2 Key Screens

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| **Landing Page** | Introduce the system, prompt registration | Hero section, feature highlights, CTA buttons |
| **Registration/Login** | Account creation and authentication | Accessible forms, OAuth options, password strength indicator |
| **Profile Setup** | Disability profile creation (wizard-style) | Step-by-step form, disability type cards, severity sliders |
| **Dashboard** | Main hub after login | Quick plan button, recent plans, profile summary |
| **Plan Generator** | Input activity details and generate plan | Activity form, voice input option, generate button |
| **Plan View** | Display generated plan | Step-by-step layout, print option, save/share buttons |
| **Plan History** | Browse past plans | Searchable list, filters, date sorting |
| **Settings** | Manage account and accessibility preferences | Profile editor, theme toggle, font size control |

### 11.3 Theme & Visual Design

| Aspect | Specification |
|--------|---------------|
| **Primary Color** | #2563EB (Blue — trust, accessibility, calm) |
| **Secondary Color** | #059669 (Green — positive actions, success) |
| **Background** | #FFFFFF (Light) / #1E1E2E (Dark mode) |
| **Text** | #1F2937 (Light mode) / #E5E7EB (Dark mode) |
| **Font** | Inter (clean, highly legible, variable weight) |
| **Border Radius** | 8px (friendly, modern feel) |
| **Spacing System** | 4px base grid (4, 8, 12, 16, 24, 32, 48, 64) |

---

## 12. Implementation Plan & Timeline

### 12.1 Development Phases

#### Phase 1: Foundation (Week 1–2)

| Task | Details |
|------|---------|
| Project setup | Initialize React app, Flask backend, MongoDB connection |
| Authentication | Registration, login, JWT-based auth system |
| Basic UI shell | Layout, navigation, routing, theme setup |
| Database schema | Create all collections with validation |

#### Phase 2: Core Features (Week 3–4)

| Task | Details |
|------|---------|
| Profile management | Disability profile CRUD with wizard UI |
| AI engine integration | Connect OpenAI API, build prompt pipeline, response parser |
| Plan generation | Full flow from input → AI → formatted output |
| Plan display | Accessible plan viewer with step-by-step layout |

#### Phase 3: Enhancement (Week 5–6)

| Task | Details |
|------|---------|
| Plan history | Save, list, search, and revisit past plans |
| Feedback system | Rating, comments, and feedback collection |
| Alternative suggestions | Multiple plan options per request |
| External API integration | Maps, weather data enrichment |

#### Phase 4: Polish & Deploy (Week 7–8)

| Task | Details |
|------|---------|
| Admin dashboard | Basic stats and user management |
| Accessibility audit | Full WCAG 2.1 AA compliance testing |
| Performance optimization | Caching, lazy loading, API optimization |
| Testing | Unit, integration, and accessibility tests |
| Deployment | Docker containerization, cloud deployment |

### 12.2 Milestone Summary

```
Week 1-2  ████████░░░░░░░░  Foundation (Auth + Setup)
Week 3-4  ████████████████  Core (AI + Plans) ← Major milestone
Week 5-6  ████████████░░░░  Enhancement (History + Feedback)
Week 7-8  ████████████████  Polish & Deploy ← Release
```

---

## 13. Testing Strategy

### 13.1 Testing Levels

| Level | Tools | Scope |
|-------|-------|-------|
| **Unit Tests** | Pytest (backend), Jest (frontend) | Individual functions, components |
| **Integration Tests** | Pytest + requests | API endpoints, database operations |
| **E2E Tests** | Cypress / Playwright | Full user flows (register → generate plan → view) |
| **Accessibility Tests** | axe-core, Lighthouse, NVDA/VoiceOver manual testing | WCAG compliance |
| **Performance Tests** | Locust / k6 | API response times under load |
| **Security Tests** | OWASP ZAP, manual review | Authentication, data protection |

### 13.2 Key Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| User registers with valid data | Account created, JWT returned |
| User creates disability profile | Profile saved, linked to user |
| User generates plan with mobility + visual impairment | Plan addresses both disabilities, includes wheelchair routes and audio-based guidance |
| User submits feedback | Feedback saved, linked to plan |
| Unauthorized access attempt | 401 response, no data leaked |
| Plan generation with invalid input | Descriptive error message returned |
| Concurrent plan generation (100 users) | All complete within 15 seconds |

---

## 14. Future Enhancements

| Version | Feature | Description |
|---------|---------|-------------|
| **v2.0** | Mobile apps | Native iOS/Android applications |
| **v2.0** | Real-time navigation | GPS-based accessible turn-by-turn navigation |
| **v2.0** | Calendar sync | Google Calendar / Outlook integration |
| **v2.0** | Multi-language | Support for Hindi, Spanish, French, etc. |
| **v2.5** | Community features | Users share and rate plans with each other |
| **v2.5** | Caregiver mode | Shared access for caregivers/family members |
| **v3.0** | Wearable integration | Smartwatch alerts and simplified plan view |
| **v3.0** | Offline mode | Pre-downloaded plans work without internet |
| **v3.0** | Voice assistant | Full voice-controlled planning experience |
| **v3.0** | Custom ML model | Fine-tuned model replacing GPT dependency |

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **WCAG** | Web Content Accessibility Guidelines — international standard for web accessibility |
| **ARIA** | Accessible Rich Internet Applications — HTML attributes for screen reader support |
| **JWT** | JSON Web Token — compact, URL-safe token for authentication |
| **GPT** | Generative Pre-trained Transformer — large language model by OpenAI |
| **CRUD** | Create, Read, Update, Delete — basic data operations |
| **REST** | Representational State Transfer — architectural style for APIs |

## Appendix B: References

1. World Health Organization (2023). *Global Report on Health Equity for Persons with Disabilities.*
2. W3C (2018). *Web Content Accessibility Guidelines (WCAG) 2.1.* https://www.w3.org/TR/WCAG21/
3. OpenAI (2024). *GPT-4 API Documentation.* https://platform.openai.com/docs
4. MongoDB Documentation. https://docs.mongodb.com/
5. Flask Documentation. https://flask.palletsprojects.com/
6. React Accessibility Guide. https://reactjs.org/docs/accessibility.html

---

*Document Version: 1.0*
*Last Updated: April 19, 2026*
*Project: Accessibility Needs Generative Planner*
