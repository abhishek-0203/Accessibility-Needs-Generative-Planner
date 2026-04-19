# Project Structure — Accessibility Needs Generative Planner

This document defines the folder and file structure for implementation.

---

## Full Project Tree

```
accessibility-planner/
│
├── frontend/                        # React Frontend Application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/                  # Images, icons, fonts
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Buttons, inputs, modals, loaders
│   │   │   ├── layout/              # Header, Footer, Sidebar, Layout
│   │   │   ├── auth/                # LoginForm, RegisterForm
│   │   │   ├── profile/             # ProfileWizard, DisabilityCard
│   │   │   ├── plans/               # PlanGenerator, PlanCard, PlanViewer
│   │   │   └── feedback/            # FeedbackForm, RatingStars
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProfileSetup.jsx
│   │   │   ├── PlanGenerator.jsx
│   │   │   ├── PlanView.jsx
│   │   │   ├── PlanHistory.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useProfile.js
│   │   │   └── usePlans.js
│   │   ├── context/                 # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── services/                # API call functions
│   │   │   ├── api.js               # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── profileService.js
│   │   │   ├── planService.js
│   │   │   └── feedbackService.js
│   │   ├── utils/                   # Helper functions
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── accessibility.js
│   │   ├── styles/                  # Global styles
│   │   │   └── globals.css
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env
│
├── backend/                         # Flask Backend Application
│   ├── app/
│   │   ├── __init__.py              # Flask app factory
│   │   ├── config.py                # Configuration (dev, prod, test)
│   │   ├── extensions.py            # Flask extensions (db, jwt, cors)
│   │   ├── models/                  # Database models / schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── profile.py
│   │   │   ├── plan.py
│   │   │   └── feedback.py
│   │   ├── routes/                  # API route blueprints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── plans.py
│   │   │   ├── feedback.py
│   │   │   └── admin.py
│   │   ├── services/                # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── profile_service.py
│   │   │   ├── plan_service.py
│   │   │   └── feedback_service.py
│   │   ├── ai/                      # AI/ML engine
│   │   │   ├── __init__.py
│   │   │   ├── engine.py            # Main AI orchestrator
│   │   │   ├── prompt_builder.py    # Prompt construction
│   │   │   ├── context_builder.py   # Context assembly
│   │   │   ├── response_parser.py   # Parse AI response to structured plan
│   │   │   └── plan_enricher.py     # Enrich with maps/weather data
│   │   ├── utils/                   # Utility functions
│   │   │   ├── __init__.py
│   │   │   ├── validators.py
│   │   │   ├── helpers.py
│   │   │   └── decorators.py        # Auth decorators, rate limiting
│   │   └── external/                # External API integrations
│   │       ├── __init__.py
│   │       ├── maps_api.py
│   │       ├── weather_api.py
│   │       └── speech_api.py
│   ├── tests/                       # Backend tests
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_profile.py
│   │   ├── test_plans.py
│   │   └── test_ai_engine.py
│   ├── requirements.txt             # Python dependencies
│   ├── run.py                       # Application entry point
│   ├── .env                         # Environment variables
│   └── .flaskenv                    # Flask-specific env vars
│
├── docker-compose.yml               # Multi-service orchestration
├── .gitignore
├── DOCUMENTATION.md                 # Project documentation (this exists)
└── PROJECT_STRUCTURE.md             # This file
```

---

## Quick-Start Commands (for implementation phase)

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py

# Frontend setup
cd frontend
npm install
npm run dev
```

---

*This structure will be created during implementation Phase 1.*
