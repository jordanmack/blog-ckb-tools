import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function(eleventyConfig) {
	// Add syntax highlighting plugin
	eleventyConfig.addPlugin(syntaxHighlight);

	// Copy CSS files to output
	eleventyConfig.addPassthroughCopy("src/assets/css/**/*.css");
	
	// Copy favicon
	eleventyConfig.addPassthroughCopy("src/favicon.png");

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

	// Set input and output directories
	return {
		dir: {
			input: "src",
			output: "_site"
		},
		// Use Nunjucks for templating
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		templateFormats: ["md", "njk", "html"]
	};
};