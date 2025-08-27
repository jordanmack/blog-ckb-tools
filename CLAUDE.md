# Blog.CKB.tools Project Configuration

## Project Overview
This is a blog site built with 11ty (Eleventy) static site generator, using Markdown for content and Tailwind CSS for styling.

## Branding Convention
- Always use lowercase "tools" in domain references: "Blog.CKB.tools" or "CKB.tools"
- Never capitalize as "Tools" in any context (titles, headers, text, etc.)

## Technology Stack
- **Static Site Generator**: 11ty v3.
- **Content Format**: Markdown.
- **Styling**: Tailwind CSS with PostCSS.
- **Package Manager**: Bun.
- **Font**: Open Sans (Google Fonts).
- **Theme**: System preference aware (light/dark mode).
- **Syntax Highlighting**: @11ty/eleventy-plugin-syntaxhighlight.

## Project Structure
```
blog.ckb.tools/
├── src/                    # All source files.
│   ├── _includes/         # Templates and partials.
│   │   ├── layouts/       # Page layouts.
│   │   └── partials/      # Reusable components.
│   ├── assets/            
│   │   └── css/          # Stylesheets.
│   ├── posts/            # Blog post markdown files.
│   └── index.njk         # Homepage.
├── docs/                 # Build output directory.
├── .eleventy.js          # 11ty configuration.
├── tailwind.config.js    # Tailwind configuration.
├── postcss.config.js     # PostCSS configuration.
└── package.json          # Dependencies and scripts.
```

## URL Structure
Blog posts use a slug-based permalink structure: `/posts/[slug]/`.

The slug field in frontmatter allows for permanent URLs even if titles change:
```markdown
---
title: "Post Title Can Change"
slug: "001-permanent-url-slug"
date: 2024-01-15
---
```

## Design Requirements
1. **Navigation**: Separate navigation bar with placeholder items.
2. **Homepage**: List of blog posts showing title, date, and preview excerpt.
3. **Footer**: Minimal, copyright only.
4. **Mobile**: Responsive design with stacked navigation on small screens.
5. **Typography**: Clean and readable with Open Sans font.

## Development Commands
```bash
# Install dependencies.
bun install

# Development server with hot reload.
bun run dev

# Production build.
bun run build
```

## Development Environment
- **Dev Server**: Always assume the development server is running in a separate window.
- **Port**: Default 11ty port (usually 8080).
- **Never**: Do not start the dev server - notify if it appears to not be running.
- **Testing**: Use Playwright MCP tools for testing the website functionality.

## Testing Instructions
When testing the website:
1. Use Playwright MCP browser tools to navigate to `http://localhost:8080`.
2. Test responsive design at different viewport sizes.
3. Verify light/dark mode switching.
4. Check navigation functionality.
5. Validate blog post rendering.

## Content Guidelines
- All content lives in the `src/` directory.
- Blog posts go in `src/posts/` as Markdown files.
- Each post must have frontmatter with: title, slug, date.
- Code blocks in Markdown will have syntax highlighting.

## Styling Approach
- Use Tailwind utility classes for all styling.
- Avoid custom CSS unless absolutely necessary.
- Support both light and dark modes based on system preference.
- Keep design minimal and focused on readability.

## Build Configuration
- Input directory: `src/`.
- Output directory: `docs/`.
- CSS processing: PostCSS with Tailwind and Autoprefixer.
- Markdown processing: 11ty with syntax highlighting plugin.

## Important Notes
- The development server should be running at all times during development.
- If changes don't appear, check that the dev server is running.
- Use Playwright MCP for all browser testing and verification.
- For RFC documents, prefer those found in the Nervos Network RFCs repo on GitHub to those found on Nervos Talk forums.