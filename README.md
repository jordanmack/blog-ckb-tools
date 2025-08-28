# Blog.CKB.tools

A simple, elegant blog built with 11ty (Eleventy) and Tailwind CSS. Features responsive design, automatic dark/light mode switching based on system preferences, and syntax highlighting for code blocks.

## Technology Stack

- **Static Site Generator**: [11ty v3](https://www.11ty.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Package Manager**: [Bun](https://bun.sh/)
- **Typography**: Open Sans (Google Fonts)
- **Templating**: Nunjucks + Markdown
- **Syntax Highlighting**: Prism.js via 11ty plugin

## Features

- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🌓 **System Theme Detection** - Automatic light/dark mode switching
- 🎨 **Syntax Highlighting** - Beautiful code blocks with Prism.js
- ⚡ **Fast Performance** - Static site generation with optimized CSS
- 🔗 **SEO-Friendly URLs** - Clean slug-based permalinks
- 📝 **Markdown Content** - Easy content authoring

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blog.ckb.tools
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

   The site will be available at http://localhost:8080

## Development

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run clean` - Remove build directory

### Project Structure

```
src/
├── _includes/          # Layouts and partials
│   ├── layouts/        # Page layouts (base, post)
│   └── partials/       # Reusable components (header, footer, nav)
├── assets/
│   └── css/           # Tailwind CSS source
├── posts/             # Blog posts (Markdown)
└── index.njk          # Homepage

docs/                 # Build output (committed for GitHub Pages)
```

### Writing Posts

Create new blog posts in the `src/posts/` directory as Markdown files:

```markdown
---
title: "Your Post Title"
slug: "unique-post-slug"
date: 2024-01-01
layout: layouts/post.njk
tags: ["post", "category"]
---

Your content here...
```

## Deployment

### GitHub Pages

1. Build the site:
   ```bash
   bun run build
   ```

2. Add and commit the built files:
   ```bash
   git add .
   git commit -m "Build and deploy site"
   git push origin main
   ```

3. Configure GitHub Pages:
   - Go to your repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `docs/` 
   - The site will be available at `https://username.github.io/repository-name`

### Other Hosting Providers

Deploy the `docs/` directory to your hosting provider after running `bun run build`.

## Branding Convention

Always use lowercase "tools" in domain references:
- ✅ "Blog.ckb.tools" 
- ✅ "BLOG.ckb.tools" 
- ✅ "CKB.tools"
- ❌ "Blog.CKB.Tools" or "CKB.Tools"

## License

Proprietary - see LICENSE file for details.