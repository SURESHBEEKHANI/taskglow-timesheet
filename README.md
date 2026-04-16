# TaskGlow Timesheet

A modern task management and timesheet application built with React, TypeScript, and Vite. Track your daily activities, manage priorities using the Eisenhower Matrix, and visualize your productivity with built-in analytics.

## ✨ Features

- **Task Management**: Create, organize, and track tasks with detailed information
- **Multi-Category Organization**: Organize tasks by Work, Study, or Personal categories
- **Priority Matrix**: Utilize the Eisenhower Matrix to categorize tasks by importance and urgency
- **Pomodoro Timer**: Built-in timer for focused work sessions
- **Multiple Views**:
  - Daily View: Focused day-to-day task management
  - Monthly View: Overview of monthly activities
  - Yearly View: Long-term planning perspective
  - Analytics Dashboard: Detailed metrics and insights
- **AI Insights**: Get intelligent suggestions and analysis of your productivity patterns
- **Time Tracking**: Track planned vs. actual time for better estimation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Form Handling**: React Hook Form
- **Data Fetching**: TanStack React Query
- **Testing**: Vitest
- **Date Handling**: date-fns
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or Bun package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskglow-timesheet
```

2. Install dependencies:
```bash
npm install
# or with Bun
bun install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Supabase Data Store

1. Copy `.env.example` to `.env` and fill:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - optional `VITE_SUPABASE_TASKS_TABLE` (default `tasks`)
2. Create a `tasks` table in Supabase with these columns:
   - `id` (text, primary key)
   - `date` (text)
   - `name` (text)
   - `category` (text)
   - `priority` (text)
   - `urgency` (text)
   - `plannedStart` (text)
   - `plannedEnd` (text)
   - `actualStart` (text)
   - `actualEnd` (text)
   - `completed` (boolean)
   - `timerStatus` (text)
   - `timerElapsed` (int8)
   - `timerStartedAt` (int8, nullable)
   - `createdAt` (text)
3. Enable Row Level Security and add policies for your use case.
4. Start the frontend:
```bash
npm run dev
```

The app reads/writes tasks directly to Supabase and falls back to localStorage if connection is unavailable.

### Building

Build for production:
```bash
npm run build
```

Build with development mode:
```bash
npm run build:dev
```

Preview the production build locally:
```bash
npm run preview
```

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📝 Linting

Check code quality:
```bash
npm run lint
```

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── AIInsights.tsx
│   ├── AnalyticsView.tsx
│   ├── DailyView.tsx
│   ├── DashboardHeader.tsx
│   ├── EisenhowerMatrix.tsx
│   ├── MetricsPanel.tsx
│   ├── MonthlyView.tsx
│   ├── PomodoroTimer.tsx
│   └── ...
├── contexts/           # React Context for state management
│   └── TaskContext.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── types/              # TypeScript type definitions
│   └── task.ts
└── test/               # Test files
```

## 🎯 Task Categories & Priorities

### Categories
- **Work**: Professional and work-related tasks
- **Study**: Learning and educational tasks
- **Personal**: Personal and lifestyle tasks

### Priority Levels (Eisenhower Matrix)
- **Important & Urgent**: Top priority tasks that need immediate attention
- **Important & Not Urgent**: Strategic tasks for long-term goals
- **Not Important & Urgent**: Delegable tasks
- **Not Important & Not Urgent**: Time fillers and distractions to minimize

## ⏱️ Pomodoro Timer

The integrated Pomodoro Timer helps you:
- Focus on tasks for dedicated time intervals
- Track time spent on each task
- Accumulate timer data for analytics
- Compare planned vs. actual time spent

## 📊 Analytics & Insights

- View productivity metrics across different time periods
- Track completion rates by category
- Analyze time allocation
- Get AI-powered suggestions based on your patterns
- Visualize productivity trends

## 🔧 Configuration

- **Tailwind CSS**: `tailwind.config.ts`
- **TypeScript**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **Vite**: `vite.config.ts`
- **ESLint**: `eslint.config.js`
- **PostCSS**: `postcss.config.js`

## 📦 Key Dependencies

- `@hookform/resolvers`: Form validation
- `@radix-ui/*`: Low-level UI primitives
- `@tanstack/react-query`: Data fetching and caching
- `class-variance-authority`: Component styling
- `clsx`: Conditional CSS classes
- `date-fns`: Date manipulation
- `react-router-dom`: Routing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎓 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Eisenhower Matrix](https://www.eisenhower.me/eisenhower-matrix/)

---

**TaskGlow** - Your productivity companion for organized task management and time tracking.
