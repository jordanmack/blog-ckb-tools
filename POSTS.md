# Blog.CKB.tools - Post Guidelines

## Post Template Location

New post template: `/src/posts/000-template.md`.

To create a new post:
1. Copy the template file.
2. Rename it with appropriate numbering (e.g., `004-my-new-post.md`).
3. Remove the `eleventyExcludeFromCollections: true` line.
4. Fill in all metadata fields.
5. Write your content.

## Metadata Standards & Usage Rules

### Required Fields (MUST have)
1. **`title`** - Post title.
   - **Required**: Yes, absolutely required.
   - **Format**: String.
   - **Example**: `title: "Understanding 11ty Static Site Generation"`.

2. **`slug`** - URL identifier.
   - **Required**: Yes, absolutely required.
   - **Format**: URL-friendly string.
   - **Guideline**: Should be representative of the content.
   - **IMPORTANT**: Do NOT include numerical prefixes in slugs.
   - **Example**: `slug: "understanding-eleventy"` (not `slug: "002-understanding-eleventy"`).

3. **`date`** - Original authoring date.
   - **Required**: Yes.
   - **Format**: YYYY-MM-DD.
   - **Rule**: Use the date the post was originally authored, not published.
   - **Example**: `date: 2024-08-22`.

4. **`layout`** - Template.
   - **Required**: Yes.
   - **Value**: Always `layouts/post.njk` for blog posts.
   - **Example**: `layout: layouts/post.njk`.

### Standard Fields (Should have)
5. **`tags`** - Category tags.
   - **Required**: Should be created even though not currently displayed.
   - **Format**: Array, always include "post" as first tag.
   - **Example**: `tags: ["post", "tutorial", "web-development"]`.

6. **`author`** - Post author.
   - **Required**: Recommended.
   - **Format**: String.
   - **Example**: `author: "John Doe"`.

7. **`id`** - Unique identifier.
   - **Required**: Recommended.
   - **Format**: Short reference string for tracking.
   - **Purpose**: 
     - Post tracking/reference.
     - **Determines image folder path**: `/assets/images/posts/[id]/`.
   - **Example**: `id: "ckb-001"` → Images go in `/assets/images/posts/ckb-001/`.

### Optional Fields
8. **`updated`** - Last modification date.
   - **Required**: No.
   - **Format**: YYYY-MM-DD.
   - **Rule**: Only add when updates actually exist to a published post.
   - **Example**: `updated: 2024-08-25`.

9. **`pinned`** - Featured status.
   - **Required**: No (optional).
   - **Format**: Boolean.
   - **Default**: false if not specified.
   - **Example**: `pinned: true`.

## Image Storage Convention

- **Path Structure**: `/assets/images/posts/[id]/`.
- **Example**: Post with `id: "ckb-001"` stores images in:
  - `/assets/images/posts/ckb-001/diagram.png`.
  - `/assets/images/posts/ckb-001/screenshot.jpg`.

## Key Rules Summary

- ✅ **title** and **slug** are absolutely required.
- ✅ **slug** should meaningfully represent the content.
- ✅ **date** = original authoring date (not publication date).
- ✅ **tags** should be created even if hidden on frontend.
- ✅ **id** determines the image folder: `/assets/images/posts/[id]/`.
- ✅ **updated** only when actual updates exist.
- ✅ **pinned** is completely optional.

## Standard Template Example

```yaml
---
# REQUIRED FIELDS
title: "Your Post Title Here"
slug: "representative-url-slug"
date: 2024-08-24
layout: layouts/post.njk

# STANDARD FIELDS
tags: ["post", "relevant", "tags"]
author: "Author Name"
id: "ckb-xxx"

# OPTIONAL FIELDS
# pinned: true  # Uncomment to pin post
# updated: 2024-08-25  # Only add when post is actually updated
---
```

## Content Guidelines

- Use clear, descriptive headings.
- Include code examples with explanations.
- Add alt text for all images.
- Keep paragraphs concise and readable.
- End with actionable conclusions.
- Place images in `/assets/images/posts/[id]/` folder.