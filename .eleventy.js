import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function(eleventyConfig) {
	// Add syntax highlighting plugin
	eleventyConfig.addPlugin(syntaxHighlight);

	// Copy images to output
	eleventyConfig.addPassthroughCopy("src/assets/images");
	
	// Copy favicon
	eleventyConfig.addPassthroughCopy("src/favicon.png");
	
	// Copy CNAME for GitHub Pages custom domain
	eleventyConfig.addPassthroughCopy("src/CNAME");

	// Add date filters
	eleventyConfig.addFilter("date", function(date, format) {
		const d = new Date(date);
		
		if (format === "Y") {
			return d.getFullYear().toString();
		}
		
		if (format === "Y-m-d") {
			return d.toISOString().split('T')[0];
		}
		
		if (format === "F j, Y") {
			return d.toLocaleDateString('en-US', { 
				year: 'numeric', 
				month: 'long', 
				day: 'numeric' 
			});
		}
		
		return d.toISOString();
	});

	// Add truncate filter
	eleventyConfig.addFilter("truncate", function(str, length = 150) {
		if (str.length <= length) {
			return str;
		}
		return str.substring(0, length).trim() + "...";
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