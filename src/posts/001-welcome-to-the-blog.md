---
title: "Welcome to the Blog"
slug: "001-welcome-to-the-blog"
date: 2024-08-23
layout: layouts/post.njk
tags: ["post", "welcome", "getting-started"]
---

Welcome to Blog.CKB.tools! This is your first blog post demonstrating the capabilities of this 11ty-powered static site.

## Features

This blog template includes:

- **Responsive design** with Tailwind CSS
- **Dark/light mode** based on system preferences
- **Syntax highlighting** for code blocks
- **Clean typography** with Open Sans font
- **SEO-friendly** URLs with slug-based permalinks

## Code Example

Here's a simple JavaScript function to demonstrate syntax highlighting:

```javascript
function greetBlogVisitors(name) {
	console.log(`Welcome to the blog, ${name}!`);
	
	if (name === "developer") {
		return "Happy coding! 🚀";
	}
	
	return "Enjoy reading! 📚";
}

// Usage
const message = greetBlogVisitors("developer");
console.log(message);
```

## Writing Posts

To create new posts, simply:

1. Create a new `.md` file in the `src/posts/` directory
2. Add frontmatter with title, slug, date, and layout
3. Write your content in Markdown
4. The site will automatically generate the post page

## What's Next?

You can customize this template by:

- Modifying the color scheme in `tailwind.config.js`
- Adding new layouts in `src/_includes/layouts/`
- Creating additional components in `src/_includes/partials/`
- Customizing the CSS in `src/assets/css/main.css`

Happy blogging!