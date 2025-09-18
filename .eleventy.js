import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import * as cheerio from "cheerio";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItToc from "markdown-it-table-of-contents";
import { DateTime } from "luxon";

export default function(eleventyConfig) {
	// Add syntax highlighting plugin
	eleventyConfig.addPlugin(syntaxHighlight);

	// Configure markdown-it with anchor and TOC plugins
	const markdownItOptions = {
		html: true,
		breaks: false,
	};

	const markdownLib = markdownIt(markdownItOptions)
		.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.headerLink({
				safariReaderFix: true,
			}),
		})
		.use(markdownItToc, {
			includeLevel: [2, 3], // Include h2 and h3 headings to show patterns
			containerClass: "table-of-contents",
			listType: "ul", // Unordered list
		});

	eleventyConfig.setLibrary("md", markdownLib);

	// Copy images to output
	eleventyConfig.addPassthroughCopy("src/assets/images");
	
	// Copy favicon
	eleventyConfig.addPassthroughCopy("src/favicon.png");
	
	// Copy CNAME for GitHub Pages custom domain
	eleventyConfig.addPassthroughCopy("src/CNAME");

	// Add date filters
	eleventyConfig.addFilter("date", function(date, format) {
		// Convert JS Date via UTC then to Los Angeles timezone, preserving date values
		const dt = DateTime.fromJSDate(date, { zone: 'UTC' })
			.setZone('America/Los_Angeles', { keepLocalTime: true });
		
		if (format === "Y") {
			return dt.toFormat('yyyy');
		}
		
		if (format === "Y-m-d") {
			return dt.toFormat('yyyy-MM-dd');
		}
		
		if (format === "F j, Y") {
			return dt.toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' });
		}
		
		return dt.toISO();
	});

	// Add truncate filter
	eleventyConfig.addFilter("truncate", function(str, length = 150) {
		if (str.length <= length) {
			return str;
		}
		return str.substring(0, length).trim() + "...";
	});

	// Add sentence-based truncate filter
	eleventyConfig.addFilter("truncateSentence", function(str, maxLength = 350) {
		if (str.length <= maxLength) {
			return str;
		}
		
		// First truncate to max length
		let truncated = str.substring(0, maxLength);
		
		// Find the last sentence ending (., !, or ?)
		const sentenceEndings = ['.', '!', '?'];
		let lastSentenceEnd = -1;
		
		for (let ending of sentenceEndings) {
			const pos = truncated.lastIndexOf(ending);
			if (pos > lastSentenceEnd) {
				lastSentenceEnd = pos;
			}
		}
		
		// If we found a sentence ending and it's not too early (at least 100 chars)
		if (lastSentenceEnd > 100) {
			return truncated.substring(0, lastSentenceEnd + 1);
		}
		
		// Otherwise, truncate at word boundary
		const lastSpace = truncated.lastIndexOf(' ');
		if (lastSpace > 100) {
			return truncated.substring(0, lastSpace) + "...";
		}
		
		// Fallback to character truncation
		return truncated + "...";
	});

	// Add striptags filter
	eleventyConfig.addFilter("striptags", function(str) {
		return str.replace(/<[^>]*>/g, '');
	});

	// Add current year filter
	eleventyConfig.addFilter("currentYear", function() {
		return new Date().getFullYear().toString();
	});

	// Create tag collections
	eleventyConfig.addCollection("tagList", function(collectionApi) {
		const tagSet = new Set();
		collectionApi.getAll().forEach(function(item) {
			if ("tags" in item.data) {
				let tags = item.data.tags;
				if (typeof tags === "string") {
					tags = [tags];
				}
				for (const tag of tags) {
					if (tag !== "post") { // Exclude the "post" tag
						tagSet.add(tag);
					}
				}
			}
		});
		return Array.from(tagSet).sort();
	});

	// Add transform to wrap tables for mobile scrolling
	eleventyConfig.addTransform("wrap-tables", function(content) {
		if ((this.page.outputPath || "").endsWith(".html")) {
			const $ = cheerio.load(content);
			$('table').each(function() {
				$(this).wrap('<div style="overflow-x: auto;"></div>');
			});
			return $.html();
		}
		return content;
	});


	// Set input and output directories
	return {
		dir: {
			input: "src",
			output: "docs"
		},
		// Use Nunjucks for templating
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		templateFormats: ["md", "njk", "html"]
	};
};