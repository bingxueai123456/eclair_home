# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eclair Collection (LIVE) - A personal content aggregation platform built with React 19 + Vite 6. Features include website bookmark management (7-star rating system), YouTube subscription aggregation, RSS feed reading, and blog article management with a Material Design-inspired UI.

## Commands

```bash
npm run dev          # Start development server at http://localhost:5173
npm run build        # Build production bundle
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

## Architecture

### Entry Point
- `src/main.jsx` - React app entry point
- `src/App.jsx` - Main application component containing all feature components (ThemeToggle, SearchComponent, Sidebar, ContentArea, etc.)
- `src/App.css` - Global styles including theme system and component styles

### Data Management (Custom Hooks)
- `src/useGlobalSearch.jsx` - Cross-platform search across websites, blogs, YouTube videos, and RSS articles
- `src/useYoutubeRssFeed.js` - YouTube RSS feed fetching and caching (5-minute cache)
- `src/useRssManager.js` - RSS/Atom feed parsing and caching (30-minute cache)

### Static Content
- `public/html/` - Static HTML blog articles
- Blog articles referenced in `src/App.jsx` `initialBlogs` array

### Theme System
CSS variables defined in `src/App.css` with `data-theme` attribute on documentElement. Supports light, dark, and 6 gradient themes. All components use `var(--primary-color)`, `var(--card-bg)`, `var(--border-color)`, etc.

### Data Configuration
- Website bookmarks: `src/App.jsx` `initialLinks` array (mainCategory, subCategory, rating 1-7, FontAwesome icon)
- RSS sources: `src/useRssManager.js` `RSS_SOURCES` array
- YouTube channels: `src/useYoutubeRssFeed.js` `YOUTUBE_CHANNELS` array (channel IDs)

### Caching & APIs
- localStorage-based caching for RSS and YouTube data
- Cross-origin requests use `corsproxy.io` proxy
- RSS parsing uses `fast-xml-parser` supporting RSS 2.0 and Atom formats

## Code Conventions

- Chinese comments, English variables/functions
- Component names: PascalCase
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Components use CSS variables for theme compatibility
- Glassmorphism effect: `backdrop-filter: blur(10px)` + semi-transparent backgrounds

## Additional Guides (Cursor Rules)

Detailed development guides available in `.cursor/rules/`:
- `eclair-collection.mdc` - Component patterns and development best practices
- `data-management.mdc` - RSS/YouTube data handling, caching strategies, and error handling
- `styling-guide.mdc` - Theme system implementation, responsive design, and CSS patterns
