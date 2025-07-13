
# Copilot Instructions for VueCalculator

## Project Overview
This is a Vue 3 project scaffolded with Vite. It uses the Vue 3 Composition API and `<script setup>` SFCs. The entry point is `src/main.js`, which mounts the root `App.vue` component.

## Key Files & Structure
- `src/main.js`: App entry point, mounts `App.vue`.
- `src/App.vue`: Root component, imports and renders child components.
- `vite.config.js`: Vite configuration, includes Vue plugin.
- `.vscode/tasks.json`: VS Code tasks for running and building the project.

## Developer Workflows
- **Start dev server:** `npm run dev` or use the VS Code task "Run Vite Dev Server".
- **Build for production:** `npm run build` or use the "Build Vite Project" task.
- **Preview production build:** `npm run preview`.
- **Hot Module Replacement (HMR):** Supported out of the box; edit `.vue` files to see live updates.

## Patterns & Conventions
- Use the `<script setup>` syntax for all new Vue SFCs.
- Use the Composition API (`ref`, `reactive`, etc.) for state management within components.
- Place reusable components in `src/components/`.
- Static assets (e.g., images) go in `src/assets/`.
- Static css files go in `src/assets/css/`.
- Static images files go in `src/assets/images/`.
- Use relative imports for local files.

## Integration Points
- No backend or API integration is present by default.
- External dependencies: Only `vue` and Vite's official Vue plugin are used.

## Example: Creating a New Component
1. Add a `.vue` file in `src/components/` using `<script setup>`.
2. Import and use it in `App.vue` or another parent component.

## Tips for AI Agents
- Reference `vite.config.js` for build customization.
- Use the provided VS Code tasks for common workflows.

---
If you add new architectural patterns, workflows, or integrations, update this file with clear, actionable guidance and examples.
