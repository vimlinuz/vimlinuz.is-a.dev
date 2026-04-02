# Agent Instructions for santoshxshrestha.tech

This document provides guidelines and instructions for agents working on this codebase.

## Project Overview

- **Type**: Next.js portfolio website (App Router)
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4 with custom CSS variables and animations

## Build/Lint/Test Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server

# Linting
pnpm lint             # Run ESLint on all files
```

### Running a Single Test

This project does not currently have a test framework installed. If adding tests:

```bash
# Install a testing framework (recommended: Vitest for React)
pnpm add -D vitest @testing-library/react @testing-library/dom jsdom

# Run tests
pnpm vitest            # Run all tests
pnpm vitest run        # Run once (CI mode)
pnpm vitest --watch   # Watch mode
pnpm vitest src/specific/file.test.tsx  # Single file
```

## Code Style Guidelines

### TypeScript

- **Strict Mode**: Enabled in `tsconfig.json` - all strict checks are active
- Use explicit types for function parameters and return types
- Use `interface` for object shapes, `type` for unions/intersections
- Avoid `any` - use `unknown` when type is truly unknown

```typescript
// Good
interface ProjectCardProps {
  repo: GitHubRepo;
}
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]>

// Avoid
const handleClick = (e: any) => { ... }
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard.tsx`, `NixWebring.tsx`)
- **Functions/Hooks**: camelCase (e.g., `fetchGitHubRepos`, `getRandomContentPair`)
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `GitHubRepo`, `HistoryEntry`)
- **Files**: kebab-case for utilities (e.g., `randomContent.ts`), PascalCase for components
- **CSS Classes**: kebab-case (e.g., `project-card`, `terminal-content`)

### Imports

- Group imports in this order:
  1. React / Next.js built-ins
  2. External libraries
  3. Internal components/utilities
  4. CSS/styles

```typescript
import type { Metadata } from "next";           // 1. Built-ins
import { useEffect, useState, useRef } from "react";  // 2. External
import { fetchGitHubRepos } from "../lib/github";      // 3. Internal
import ProjectCard from "../components/ProjectCard";  // 3. Internal
import "./globals.css";                             // 4. Styles
```

- Use path aliases: `@/*` maps to project root
- Import types with `import type` when only using types (tree-shaking)

### React Patterns

- Use functional components exclusively
- Client components: add `"use client"` directive at top of file
- Server components: default (no directive needed)
- Use `useRef` for DOM access, `useState` for local state
- Prefer `useEffect` for side effects; cleanup functions are required

```typescript
"use client";

import { useEffect, useRef, useState } from "react";

export default function Component() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Always return cleanup function
    return () => {
      // cleanup
    };
  }, [dependency]);

  return <div ref={inputRef}>...</div>;
}
```

### Error Handling

- Use try/catch for async operations
- Return sensible defaults on error (e.g., empty arrays)
- Log errors to console with descriptive messages
- Never expose sensitive information in error messages

```typescript
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const repos: GitHubRepo[] = await response.json();
    return repos;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];  // Sensible default
  }
}
```

### JSX/HTML

- Use semantic HTML elements
- Add `aria-*` attributes for accessibility when needed
- External links must include `rel="noopener noreferrer"`
- Use `className` instead of `class`
- Use `htmlFor` instead of `for` on labels

```tsx
<a href={repo.html_url} target="_blank" rel="noopener noreferrer">
  <i className="fa-brands fa-github"></i>
  {repo.name}
</a>

<label htmlFor="username">Username</label>
<input id="username" type="text" />
```

### CSS/Styling

- Use Tailwind CSS utility classes first
- Add custom CSS in `app/globals.css` for complex styles
- Use CSS custom properties (variables) for theme values
- Follow kebab-case for class names

```css
:root {
  --font-inter: var(--font-inter);
  --font-jetbrains-mono: var(--font-jetbrains-mono);
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Async/Server Components

- Server components can be `async`
- Use `Suspense` with `fallback` for async content
- Fetch data at the component level when possible

```tsx
import { Suspense } from "react";

async function ProjectsList() {
  const repos = await fetchGitHubRepos("vimlinuz");
  return <div>{repos.map(repo => <ProjectCard key={repo.id} repo={repo} />)}</div>;
}

export default function Projects() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProjectsList />
    </Suspense>
  );
}
```

## File Structure

```
app/
├── page.tsx              # Home page (client component - terminal interface)
├── layout.tsx            # Root layout with fonts and global providers
├── globals.css           # Global styles and Tailwind imports
├── fonts.ts              # Google Font configuration
├── about/
│   └── page.tsx          # About page
├── projects/
│   └── page.tsx          # Projects page (server component)
├── components/
│   ├── Oneko.tsx         # Cat animation (client)
│   ├── NixWebring.tsx    # Nix webring (server)
│   └── ProjectCard.tsx   # GitHub project card
└── lib/
    ├── github.ts         # GitHub API utilities
    └── randomContent.ts  # Terminal content pairs
```

## Common Patterns

### Type Definitions

```typescript
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
}
```

### Keyboard Event Handling

```typescript
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    // Handle enter key
  }
};
```

### React Event Handlers

```typescript
// For div/span clicks
const handleClick = () => { ... }

// For form inputs
<input
  onChange={(e) => setValue(e.target.value)}
  onKeyDown={handleKeyDown}
/>
```

## ESLint Configuration

The project uses `eslint-config-next` with:
- `core-web-vitals`: Ensures Next.js core web vitals compliance
- `typescript`: TypeScript-specific linting rules

Run `pnpm lint` before committing. Address all warnings and errors.

## Git Conventions

- Commit messages should be concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")
- Keep commits focused on a single change

## Getting Help

- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
