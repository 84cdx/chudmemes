# Chudmemes

**Technical case study: Canvas-based meme generation with AI-assisted development workflows.**

## Project Overview

Chudmemes is a portfolio project focused on implementing a Canvas-based meme generator in **Next.js** with strongly typed frontend logic and reproducible AI-supported development workflows.

Live deployment: [https://chudmemes.vercel.app](https://chudmemes.vercel.app)

## Core Technical Challenges

### Canvas Rendering & Sync

The main implementation challenge is synchronizing asynchronous image loading with deterministic text rendering on **HTML5 Canvas**.  
The render pipeline waits for the selected image to load before applying multi-line text overlays, preventing race conditions and avoiding blocked UI interactions during generation.

### Asset Management

The project manages a large set of local static image assets (150+ files) with centralized URL mapping.  
Image selection uses indexed/randomized lookup strategies to keep runtime logic simple while supporting scalable asset growth.

### State Management

In **React/Next.js**, generation is controlled through explicit state transitions (`isLoading`, current image URL, current quote, previous selection refs).  
The "Generate" trigger starts a full re-render cycle for image + text, while guarding against repeated selections and preserving predictable UI behavior.

## AI-Driven Development Workflow

This repository is also an experiment in **AI pair-programming** using Cursor and LLM tooling in day-to-day engineering tasks.

- Rapid prototyping of Canvas rendering logic and text layout behavior.
- AI-assisted TypeScript refactoring to keep component/data boundaries explicit.
- Automated filesystem scripting support for bulk asset renaming and normalization.

## Key Technical Features

- Client-rendered architecture via `use client` for interactive generation and canvas operations.
- Dynamic canvas scaling and export flow for consistent on-screen preview and downloadable output.
- Typed data modules for quotes and image path sources to separate content from UI logic.
- Responsive UI structure using Tailwind utility composition across desktop and mobile layouts.

## Tech Stack

- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **Canvas API**

## Deployment & CI/CD

Deployment follows a GitHub-to-Vercel workflow: commits are pushed to GitHub, and Vercel handles automated build/deploy for preview and production environments.

## Installation

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.
