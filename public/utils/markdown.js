/**
 * Parse Discord markdown text to HTML
 * @param {string} text - The markdown text to parse
 * @returns {string} The parsed HTML
 */
export function parseMarkdown(text) {
	if (!text) return '';

	// Store code blocks temporarily
	const codeBlocks = [];
	let parsed = text;

	// Process code blocks first (```)
	parsed = parsed.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
		const placeholder = `§§§CODEBLOCK${codeBlocks.length}§§§`;
		let highlightedCode;

		if (lang && typeof hljs !== 'undefined' && hljs.getLanguage(lang)) {
			try {
				highlightedCode = hljs.highlight(code.trim(), {
					language: lang,
				}).value;
			} catch (e) {
				highlightedCode = code
					.trim()
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;');
			}
		} else {
			highlightedCode = code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}

		codeBlocks.push(
			`<pre style="background-color: #3f4146; padding: 8px; border-radius: 4px; margin: 8px 0; overflow-x: auto;"><code class="hljs" style="background: transparent; padding: 0;">${highlightedCode}</code></pre>`,
		);
		return placeholder;
	});

	// Process inline markdown (before newline conversion)
	parsed = parsed
		.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/__(.+?)__/g, '<u>$1</u>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/_(.+?)_/g, '<em>$1</em>')
		.replace(/~~(.+?)~~/g, '<del>$1</del>')
		.replace(
			/\|\|(.+?)\|\|/g,
			'<span class="spoiler" style="background-color: #202225; color: #202225; padding: 0 2px; border-radius: 3px; cursor: pointer;" onclick="this.style.color=\'#dcddde\'; this.style.backgroundColor=\'rgb(54, 57, 63)\';">$1</span>',
		)
		.replace(
			/<@!?(\d+)>/g,
			'<span style="background-color: rgba(88, 101, 242, 0.3); color: #dee0fc; padding: 0 2px; border-radius: 3px; font-weight: 500; cursor: pointer;">@User</span>',
		)
		.replace(
			/<#(\d+)>/g,
			'<span style="background-color: rgba(88, 101, 242, 0.3); color: #dee0fc; padding: 0 2px; border-radius: 3px; font-weight: 500; cursor: pointer;">#channel</span>',
		)
		.replace(
			/<@&(\d+)>/g,
			'<span style="background-color: rgba(88, 101, 242, 0.3); color: #dee0fc; padding: 0 2px; border-radius: 3px; font-weight: 500; cursor: pointer;">@role</span>',
		)
		.replace(
			/ (@here|@everyone)/g,
			' <span style="background-color: rgba(88, 101, 242, 0.3); color: #dee0fc; padding: 0 2px; border-radius: 3px; font-weight: 500; cursor: pointer;">$1</span>',
		)
		.replace(
			/``(.+?)``/g,
			'<code style="background-color: #2f3136; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 85%;">$1</code>',
		)
		.replace(
			/`(.+?)`/g,
			'<code style="background-color: #2f3136; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 85%;">$1</code>',
		)
		.replace(
			/\[(.+?)\]\((.+?)\)/g,
			'<a href="$2" target="_blank" style="color: #00b0f4; text-decoration: none;">$1</a>',
		)
		.replace(
			/(^|[^"'>])(https?:\/\/[^\s<]+)/g,
			'$1<a href="$2" target="_blank" style="color: #00b0f4; text-decoration: none;">$2</a>',
		);

	// Restore code blocks before newline conversion
	codeBlocks.forEach((block, index) => {
		parsed = parsed.replace(`§§§CODEBLOCK${index}§§§`, block);
	});

	// Process lists, quotes, headings, and subtext (must be done before newline conversion)
	const lines = parsed.split('\n');
	const processedLines = [];
	let listDepth = -1;
	let inQuote = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Check for quote first
		const quoteMatch = line.match(/^>\s?(.*)$/);
		if (quoteMatch) {
			// Close any open lists
			if (listDepth >= 0) {
				for (let d = listDepth; d >= 0; d--) {
					processedLines.push('</ul>');
				}
				listDepth = -1;
			}

			if (!inQuote) {
				processedLines.push(
					'<div style="border-left: 4px solid #4e5058; padding-left: 12px; margin: 4px 0;">',
				);
				inQuote = true;
			}
			processedLines.push(quoteMatch[1]);
			continue;
		} else if (inQuote) {
			// End quote block
			processedLines.push('</div>');
			inQuote = false;
		}

		// Check for headings
		const h3Match = line.match(/^### (.+)$/);
		const h2Match = line.match(/^## (.+)$/);
		const h1Match = line.match(/^# (.+)$/);

		if (h3Match) {
			// Close any open lists
			if (listDepth >= 0) {
				for (let d = listDepth; d >= 0; d--) {
					processedLines.push('</ul>');
				}
				listDepth = -1;
			}
			processedLines.push(
				`<h3 style="font-size: 16px; font-weight: 600; margin: 8px 0 4px 0;">${h3Match[1]}</h3>`,
			);
			continue;
		} else if (h2Match) {
			// Close any open lists
			if (listDepth >= 0) {
				for (let d = listDepth; d >= 0; d--) {
					processedLines.push('</ul>');
				}
				listDepth = -1;
			}
			processedLines.push(
				`<h2 style="font-size: 20px; font-weight: 600; margin: 8px 0 4px 0;">${h2Match[1]}</h2>`,
			);
			continue;
		} else if (h1Match) {
			// Close any open lists
			if (listDepth >= 0) {
				for (let d = listDepth; d >= 0; d--) {
					processedLines.push('</ul>');
				}
				listDepth = -1;
			}
			processedLines.push(
				`<h1 style="font-size: 24px; font-weight: 600; margin: 8px 0 4px 0;">${h1Match[1]}</h1>`,
			);
			continue;
		}

		// Check for subtext
		const subtextMatch = line.match(/^-# (.+)$/);
		if (subtextMatch) {
			// Close any open lists
			if (listDepth >= 0) {
				for (let d = listDepth; d >= 0; d--) {
					processedLines.push('</ul>');
				}
				listDepth = -1;
			}
			processedLines.push(
				`<div style="font-size: 12px; color: #b9bbbe; margin: 4px 0;">${subtextMatch[1]}</div>`,
			);
			continue;
		}

		// Check for list
		const listMatch = line.match(/^(\s*)- (.+)$/);

		if (listMatch) {
			const spaces = listMatch[1].length;
			const indent = Math.floor(spaces / 2);
			const content = listMatch[2];

			if (indent > listDepth) {
				// Open new list(s)
				for (let d = listDepth + 1; d <= indent; d++) {
					processedLines.push(
						'<ul style="margin: 4px 0; padding-left: 20px; list-style-type: disc;">',
					);
				}
			} else if (indent < listDepth) {
				// Close list(s)
				for (let d = listDepth; d > indent; d--) {
					processedLines.push('</ul>');
				}
			}

			listDepth = indent;
			processedLines.push(`<li style="margin: 2px 0;">${content}</li>`);
		} else {
			// Not a list item
			if (listDepth >= 0) {
				// Close all open lists
				for (let d = listDepth; d >= 0; d--) {
					processedLines.push('</ul>');
				}
				listDepth = -1;
			}
			processedLines.push(line);
		}
	}

	// Close any remaining open lists or quotes
	if (listDepth >= 0) {
		for (let d = listDepth; d >= 0; d--) {
			processedLines.push('</ul>');
		}
	}
	if (inQuote) {
		processedLines.push('</div>');
	}

	parsed = processedLines.join('\n');

	// Convert newlines to <br> last
	parsed = parsed.replace(/\n/g, '<br>');

	// Remove unnecessary <br> tags around list elements, code blocks, and quotes
	parsed = parsed
		.replace(/<br><ul/g, '<ul')
		.replace(/<\/ul><br>/g, '</ul>')
		.replace(/<br><\/ul>/g, '</ul>')
		.replace(/<br><li/g, '<li')
		.replace(/<\/li><br>/g, '</li>')
		.replace(/<br><pre/g, '<pre')
		.replace(/<\/pre><br>/g, '</pre>')
		.replace(
			/<br><div style="border-left: 4px/g,
			'<div style="border-left: 4px',
		)
		.replace(
			/<div style="border-left: 4px solid #4e5058; padding-left: 12px; margin: 4px 0;"><br>/g,
			'<div style="border-left: 4px solid #4e5058; padding-left: 12px; margin: 4px 0;">',
		)
		.replace(/<\/div><br>/g, '</div>')
		.replace(/<br><h([123])/g, '<h$1')
		.replace(/<\/h([123])><br>/g, '</h$1>')
		.replace(/<br><div style="font-size: 12px/g, '<div style="font-size: 12px');

	return parsed;
}
