---
# TEMPLATE - DO NOT PUBLISH
# Copy this file and remove eleventyExcludeFromCollections

# REQUIRED FIELDS
title: "POST TITLE HERE"
slug: "representative-url-slug"
date: 2024-01-01
layout: layouts/post.njk

# STANDARD FIELDS  
tags: ["post", "tag1", "tag2"]
author: "Author Name"
id: "ckb-xxx"  # Used for image folder: /assets/images/posts/ckb-xxx/

# OPTIONAL FIELDS
# pinned: true  # Uncomment to pin post
# updated: 2024-01-02  # Only add when post is actually updated

# EXCLUDE FROM SITE - REMOVE THIS LINE IN ACTUAL POSTS
permalink: false
eleventyExcludeFromCollections: true
---

# Post Title

Introduction paragraph goes here. This should hook the reader and explain what they'll learn from this post.

## Main Heading

Content goes here. Use clear, concise language and break up text with headings and paragraphs.

### Subsection

More detailed content or examples.

## Code Example

When including code, provide context and explain what it does:

```javascript
// Example JavaScript function
function greetReader(name) {
	console.log(`Welcome to the blog, ${name}!`);
	
	if (name === "developer") {
		return "Happy coding! 🚀";
	}
	
	return "Enjoy reading! 📚";
}

// Usage
const message = greetReader("developer");
console.log(message);
```

## Lists

Use lists to organize information clearly:

### Bullet Points
- Important point number one
- Another key concept
- Final takeaway

### Numbered Steps
1. First step in the process
2. Second step to follow
3. Final step to complete

## Images

Images for this post should be placed in: `/assets/images/posts/[id]/`

For example, if your post ID is "ckb-005", put images in `/assets/images/posts/ckb-005/`

```markdown
![Descriptive alt text](/assets/images/posts/ckb-xxx/screenshot.png)
```

## Best Practices

- Write clear, descriptive headings
- Use code blocks for technical examples
- Include alt text for all images
- Keep paragraphs concise
- End with actionable conclusions

## Conclusion

Summarize the key points and provide next steps or further reading suggestions.

This template includes all standard metadata fields and follows the Blog.CKB.tools content guidelines.