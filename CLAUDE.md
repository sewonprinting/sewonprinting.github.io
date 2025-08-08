# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for 세원프린팅 (Sewon Printing), a Korean printing business located in Yeongdeungpo, Seoul. The site showcases their services including printing, copying, binding, and scanning services.

## Development Commands

This is a static HTML/CSS/JavaScript website hosted on GitHub Pages. No build process is required.

**Local Development:**
- Open `index.html` directly in a browser
- Use a local server like `python -m http.server` or `npx serve` for better local development
- No package manager or build tools are configured

**Deployment:**
- Changes are automatically deployed to GitHub Pages when pushed to the main branch
- Site URL: https://sewonprinting.github.io

## Architecture

**File Structure:**
- `index.html` - Main homepage
- `pages/` - Individual page files (services.html, portfolio.html, location.html, contact.html)
- `css/styles.css` - Main stylesheet with custom Paperlogy font integration
- `js/main.js` - Interactive features and animations
- `images/` - All site images including portfolio items and icons
- `fonts/` - Custom Paperlogy font family (9 weights)

**Key Features:**
- Responsive design with mobile navigation
- Aurora background animation effects that respond to mouse movement and scroll
- Portfolio gallery with category filtering and modal image viewing
- Contact form with client-side validation
- Visitor counter integration with Google Apps Script
- Korean language content throughout

**JavaScript Functionality:**
- Aurora background animations (mouse tracking, scroll effects)
- Mobile navigation toggle
- Scroll-based header styling changes
- Portfolio image gallery modals
- Form validation for contact page
- Smooth scroll animations for page elements

**Styling Approach:**
- Custom CSS with extensive use of CSS custom properties
- Paperlogy font family with 9 different weights
- Aurora gradient animations and effects
- Responsive grid layouts for services and portfolio
- Korean typography optimized styling