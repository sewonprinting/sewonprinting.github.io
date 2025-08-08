# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for 세원프린팅 (Sewon Printing), a Korean printing and binding service company. The site is built with vanilla HTML, CSS, and JavaScript, and is hosted on GitHub Pages.

## Architecture

### File Structure
- `index.html` - Main homepage
- `pages/` - Additional pages (portfolio, services, contact, location)
- `css/styles.css` - Main stylesheet
- `js/main.js` - Main JavaScript functionality
- `js/portfolio.js` - Portfolio management system
- `data/portfolio.json` - Portfolio data
- `admin/` - Portfolio administration interface
- `images/` - Static assets and portfolio images

### Key Components

**Portfolio Management System**
- Dynamic portfolio loading from JSON data with localStorage caching
- Category-based filtering system
- Modal gallery for image viewing
- Admin interface for content management (`admin/portfolio-manager.html`)

**Data Flow**
- Portfolio data loads from `data/portfolio.json`
- Falls back to localStorage if JSON fails
- Includes backup data system for reliability
- Admin interface can modify portfolio data

**JavaScript Architecture**
- `main.js`: Core functionality (navigation, animations, form validation)
- `portfolio.js`: Portfolio management class with full CRUD operations
- Event-driven architecture with scroll animations and modal systems

## Development

### Testing the Site
- Open `index.html` in a browser to view the site
- Use live server extension in VS Code for development
- All functionality is client-side - no build process required

### Working with Portfolio Data
- Portfolio items are stored in `data/portfolio.json`
- Categories: 메뉴판, 스프링제본, 무선제본, 책자제작, 결산서.세무조정계산서, 제안서, 도면출력제본, 카드.초대장, 팜플렛.전단지, 포토폴리오, 탁상달력
- Each item requires: id, title, description, category, image path, alt text
- Images should be placed in `images/portfolio/` directory

### Admin Interface
- Access via `admin/portfolio-manager.html`
- Password-protected (check `admin/portfolio-admin.js` for authentication)
- Allows adding, editing, and deleting portfolio items
- Includes category management functionality

### Styling
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Aurora animated background effect
- Consistent color scheme using CSS variables

### Key Features
- Responsive navigation with mobile toggle
- Scroll-triggered animations
- Image gallery with modal lightbox
- Contact form with validation
- FAQ section with accordion functionality
- Embedded Google Maps integration
- Visitor counter integration with Google Apps Script

## File Conventions

### Images
- Portfolio images use Korean filenames
- Standard format: `category-number.jpg` (e.g., `메뉴판-1.jpg`)
- Maintain consistent image dimensions for best results

### CSS
- Uses CSS custom properties for theming
- Mobile-first responsive design
- Modular component-based classes

### JavaScript
- Class-based portfolio management
- Async/await for data loading
- Local storage for data persistence
- Error handling with fallback mechanisms

## Common Tasks

### Adding New Portfolio Items
1. Use admin interface at `admin/portfolio-manager.html`
2. Or manually edit `data/portfolio.json`
3. Add corresponding image to `images/portfolio/`
4. Clear localStorage to refresh data

### Updating Styles
- Modify `css/styles.css`
- Use existing CSS custom properties when possible
- Test responsive behavior across devices

### Modifying Content
- Update HTML files directly for static content
- Use portfolio management system for dynamic content
- Ensure Korean text encoding is preserved (UTF-8)
