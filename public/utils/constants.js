// Discord Embed Schema for validation
export const embedSchema = {
	type: 'object',
	properties: {
		title: { type: 'string', maxLength: 256 },
		description: { type: 'string', maxLength: 4096 },
		url: { type: 'string', format: 'uri' },
		color: { type: 'integer', minimum: 0, maximum: 16777215 },
		timestamp: { type: 'string' },
		footer: {
			type: 'object',
			properties: {
				text: { type: 'string', maxLength: 2048 },
				icon_url: { type: 'string', format: 'uri' },
			},
		},
		author: {
			type: 'object',
			properties: {
				name: { type: 'string', maxLength: 256 },
				url: { type: 'string', format: 'uri' },
				icon_url: { type: 'string', format: 'uri' },
			},
		},
		fields: {
			type: 'array',
			maxItems: 25,
			items: {
				type: 'object',
				properties: {
					name: { type: 'string', maxLength: 256 },
					value: { type: 'string', maxLength: 1024 },
					inline: { type: 'boolean' },
				},
				required: ['name', 'value'],
			},
		},
	},
};

// Default embed data for v1
export const defaultEmbedData = {
	content: 'Check out this awesome embed!',
	title: 'Sample Embed',
	description: `This is an example description. Markdown works too!\n\nhttps://hoshimikan6490.com\n> Block Quotes\n\`\`\`\nCode Blocks\n\`\`\`\n*Emphasis* or _emphasis_\n\`Inline code\` or \`\`inline code\`\`\n[Links](https://example.com)\n<@123>, <@!123>, <#123>, <@&123>, @here, @everyone mentions\n||Spoilers||\n~~Strikethrough~~\n**Strong**\n__Underline__\n- list1\n  - option1\n  - option2\n- list2\n# Title size\n## subtitle size\n### topic size\n-# subtext size`,
	color: 5814783,
	fields: [
		{ name: 'Field 1', value: 'Value 1', inline: true },
		{ name: 'Field 2', value: 'Value 2', inline: true },
	],
	footer: { text: 'Footer text' },
	timestamp: new Date().toISOString(),
	buttons: [
		{ label: 'Primary', style: 1, disabled: false },
		{
			label: 'Visit Website',
			style: 5,
			url: 'https://example.com',
			disabled: false,
		},
	],
};
