const { useState, useEffect, useRef } = React;

// Discord Embed Schema for validation
const embedSchema = {
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

// Component v1 - Form-based editor
function ComponentV1({ embedData, setEmbedData }) {
	const handleChange = (field, value) => {
		setEmbedData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleNestedChange = (parent, field, value) => {
		setEmbedData((prev) => ({
			...prev,
			[parent]: {
				...prev[parent],
				[field]: value,
			},
		}));
	};

	const addField = () => {
		setEmbedData((prev) => {
			if ((prev.fields || []).length >= 25) {
				alert(
					'フィールドは最大25個までです。不要なフィールドを削除するか、別メッセージでの送信を検討してください。',
				);
				return prev;
			}
			return {
				...prev,
				fields: [
					...(prev.fields || []),
					{ name: '', value: '', inline: false },
				],
			};
		});
	};

	const updateField = (index, field, value) => {
		setEmbedData((prev) => ({
			...prev,
			fields: prev.fields.map((f, i) =>
				i === index ? { ...f, [field]: value } : f,
			),
		}));
	};

	const removeField = (index) => {
		setEmbedData((prev) => ({
			...prev,
			fields: prev.fields.filter((_, i) => i !== index),
		}));
	};

	const addButton = () => {
		setEmbedData((prev) => {
			if ((prev.buttons || []).length >= 25) {
				alert(
					'ボタンは最大25個までです。不要なボタンを削除するか、別メッセージでの送信を検討してください。',
				);
				return prev;
			}
			return {
				...prev,
				buttons: [
					...(prev.buttons || []),
					{ label: '', style: 1, url: '', disabled: false },
				],
			};
		});
	};

	const updateButton = (index, field, value) => {
		setEmbedData((prev) => ({
			...prev,
			buttons: prev.buttons.map((b, i) =>
				i === index ? { ...b, [field]: value } : b,
			),
		}));
	};

	const removeButton = (index) => {
		setEmbedData((prev) => ({
			...prev,
			buttons: prev.buttons.filter((_, i) => i !== index),
		}));
	};

	// Calculate total character count
	const calculateTotalCharacters = () => {
		let total = 0;
		if (embedData.title) total += embedData.title.length;
		if (embedData.description) total += embedData.description.length;
		if (embedData.author?.name) total += embedData.author.name.length;
		if (embedData.footer?.text) total += embedData.footer.text.length;
		if (embedData.fields) {
			embedData.fields.forEach((field) => {
				if (field.name) total += field.name.length;
				if (field.value) total += field.value.length;
			});
		}
		return total;
	};

	const totalChars = calculateTotalCharacters();
	const isOverLimit = totalChars > 6000;

	return (
		<div className="pa3">
			{/* Character Count Warning */}
			<div
				className={`mb3 pa2 br2 ${isOverLimit ? 'bg-red white' : 'bg-black-10 white-70'}`}
			>
				<div className="fw6 mb1">
					埋め込み内の合計文字数：{totalChars} / 6000
				</div>
				{isOverLimit && (
					<div>
						⚠️
						文字数制限を超えています！タイトル、説明、author名、footer、またはフィールドの内容を減らしてください。
					</div>
				)}
			</div>

			<div className="mb3">
				<label className="db fw6 mb2 white">Content</label>
				<textarea
					className="input-reset ba b--black-20 pa2 w-100 br2"
					value={embedData.content || ''}
					onChange={(e) => handleChange('content', e.target.value)}
					placeholder="メッセージ本文（Embedの前のテキスト）"
					rows="3"
					maxLength="2000"
				/>
			</div>

			<div className="mb3">
				<label className="db fw6 mb2 white">Title</label>
				<input
					type="text"
					className="input-reset ba b--black-20 pa2 w-100 br2"
					value={embedData.title || ''}
					onChange={(e) => handleChange('title', e.target.value)}
					placeholder="埋め込みのタイトル"
					maxLength="256"
				/>
			</div>

			<div className="mb3">
				<label className="db fw6 mb2 white">Description</label>
				<textarea
					className="input-reset ba b--black-20 pa2 w-100 br2"
					value={embedData.description || ''}
					onChange={(e) => handleChange('description', e.target.value)}
					placeholder="埋め込みの説明"
					rows="4"
					maxLength="4096"
				/>
			</div>

			<div className="mb3">
				<label className="db fw6 mb2 white">URL</label>
				<input
					type="url"
					className="input-reset ba b--black-20 pa2 w-100 br2"
					value={embedData.url || ''}
					onChange={(e) => handleChange('url', e.target.value)}
					placeholder="https://example.com"
				/>
			</div>

			<div className="mb3">
				<label className="db fw6 mb2 white">Color (Hex)</label>
				<div className="flex items-center">
					<input
						type="color"
						className="mr2"
						value={
							embedData.color
								? `#${embedData.color.toString(16).padStart(6, '0')}`
								: '#000000'
						}
						onChange={(e) =>
							handleChange('color', parseInt(e.target.value.slice(1), 16))
						}
					/>
					<input
						type="text"
						className="input-reset ba b--black-20 pa2 flex-auto br2"
						value={
							embedData.color
								? `#${embedData.color.toString(16).padStart(6, '0')}`
								: '#000000'
						}
						onChange={(e) => {
							const hex = e.target.value.replace('#', '');
							if (/^[0-9A-Fa-f]{0,6}$/.test(hex)) {
								handleChange('color', parseInt(hex || '0', 16));
							}
						}}
						placeholder="#000000"
					/>
				</div>
			</div>

			<div className="mb3">
				<label className="db fw6 mb2 white">Timestamp</label>
				<input
					type="datetime-local"
					className="input-reset ba b--black-20 pa2 w-100 br2"
					value={
						embedData.timestamp
							? moment(embedData.timestamp).format('YYYY-MM-DDTHH:mm')
							: ''
					}
					onChange={(e) =>
						handleChange(
							'timestamp',
							e.target.value ? new Date(e.target.value).toISOString() : '',
						)
					}
				/>
			</div>

			<div className="mb3">
				<h3 className="fw6 mb2 white">Author</h3>
				<div className="mb2">
					<input
						type="text"
						className="input-reset ba b--black-20 pa2 w-100 br2"
						value={embedData.author?.name || ''}
						onChange={(e) =>
							handleNestedChange('author', 'name', e.target.value)
						}
						placeholder="Author名"
						maxLength="256"
					/>
				</div>
				<div className="mb2">
					<input
						type="url"
						className="input-reset ba b--black-20 pa2 w-100 br2"
						value={embedData.author?.url || ''}
						onChange={(e) =>
							handleNestedChange('author', 'url', e.target.value)
						}
						placeholder="Author Icon URL"
					/>
				</div>
				<div>
					<input
						type="url"
						className="input-reset ba b--black-20 pa2 w-100 br2"
						value={embedData.author?.icon_url || ''}
						onChange={(e) =>
							handleNestedChange('author', 'icon_url', e.target.value)
						}
						placeholder="Author Icon URL"
					/>
				</div>
			</div>

			<div className="mb3">
				<h3 className="fw6 mb2 white">footer</h3>
				<div className="mb2">
					<input
						type="text"
						className="input-reset ba b--black-20 pa2 w-100 br2"
						value={embedData.footer?.text || ''}
						onChange={(e) =>
							handleNestedChange('footer', 'text', e.target.value)
						}
						placeholder="footerの内容"
						maxLength="2048"
					/>
				</div>
				<div>
					<input
						type="url"
						className="input-reset ba b--black-20 pa2 w-100 br2"
						value={embedData.footer?.icon_url || ''}
						onChange={(e) =>
							handleNestedChange('footer', 'icon_url', e.target.value)
						}
						placeholder="Footer Icon URL"
					/>
				</div>
			</div>

			<div className="mb3">
				<h3 className="fw6 mb2 white">Image</h3>
				<input
					type="url"
					className="input-reset ba b--black-20 pa2 w-100 br2"
					value={embedData.image?.url || ''}
					onChange={(e) => handleNestedChange('image', 'url', e.target.value)}
					placeholder="画像URL"
				/>
			</div>

			<div className="mb3">
				<h3 className="fw6 mb2 white">Thumbnail</h3>
				<input
					type="url"
					className="input-reset ba b--black-20 pa2 w-100 br2"
					value={embedData.thumbnail?.url || ''}
					onChange={(e) =>
						handleNestedChange('thumbnail', 'url', e.target.value)
					}
					placeholder="サムネイルURL"
				/>
			</div>

			<div className="mb3">
				<div className="flex items-center justify-between mb2">
					<h3 className="fw6 white">Fields</h3>
					<button
						className={`button-reset pa2 br2 bn ${(embedData.fields || []).length >= 25 ? 'bg-gray white o-50' : 'bg-blue white pointer'}`}
						onClick={addField}
						disabled={(embedData.fields || []).length >= 25}
					>
						+ フィールド追加
					</button>
				</div>
				{(embedData.fields || []).length >= 25 && (
					<div className="pa2 mb2 br2 bg-red white">
						フィールド数が上限（25個）に達しました。これ以上追加したい場合は、不要なフィールドを削除するか、別メッセージでの送信を検討してください。
					</div>
				)}
				{embedData.fields?.map((field, index) => (
					<div key={index} className="ba b--black-20 pa2 mb2 br2">
						<div className="mb2">
							<input
								type="text"
								className="input-reset ba b--black-20 pa2 w-100 br2"
								value={field.name}
								onChange={(e) => updateField(index, 'name', e.target.value)}
								placeholder="フィールド名"
								maxLength="256"
							/>
						</div>
						<div className="mb2">
							<textarea
								className="input-reset ba b--black-20 pa2 w-100 br2"
								value={field.value}
								onChange={(e) => updateField(index, 'value', e.target.value)}
								placeholder="フィールドの内容"
								rows="2"
								maxLength="1024"
							/>
						</div>
						<div className="flex items-center justify-between">
							<label className="flex items-center white">
								<input
									type="checkbox"
									className="mr2"
									checked={field.inline}
									onChange={(e) =>
										updateField(index, 'inline', e.target.checked)
									}
								/>
								Inline
							</label>
							<button
								className="button-reset bg-red white pa2 br2 pointer bn"
								onClick={() => removeField(index)}
							>
								削除
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Buttons Section */}
			<div className="mb3">
				<div className="flex items-center justify-between mb2">
					<label className="db fw6 white">Buttons</label>
					<button
						className={`button-reset pa2 br2 bn ${(embedData.buttons || []).length >= 25 ? 'bg-gray white o-50' : 'bg-blue white pointer'}`}
						onClick={addButton}
						disabled={(embedData.buttons || []).length >= 25}
					>
						+ ボタン追加
					</button>
				</div>
				{(embedData.buttons || []).length >= 25 && (
					<div className="pa2 mb2 br2 bg-red white">
						これ以上ボタンは追加できません。不要なボタンを削除するか、別メッセージでの送信を検討してください。
					</div>
				)}
				{embedData.buttons?.map((button, index) => (
					<div key={index} className="ba b--black-20 pa2 mb2 br2">
						<div className="mb2">
							<label className="db fw6 mb1 white">Label</label>
							<input
								type="text"
								className="input-reset ba b--black-20 pa2 w-100 br2"
								value={button.label}
								onChange={(e) => updateButton(index, 'label', e.target.value)}
								placeholder="ボタンのラベル"
								maxLength="80"
							/>
						</div>
						<div className="mb2">
							<label className="db fw6 mb1 white">ボタンのスタイル</label>
							<select
								className="input-reset ba b--black-20 pa2 w-100 br2"
								value={button.style}
								onChange={(e) =>
									updateButton(index, 'style', parseInt(e.target.value))
								}
							>
								<option value="1">Primary（青）</option>
								<option value="2">Secondary（グレー）</option>
								<option value="3">Success（緑）</option>
								<option value="4">Danger（赤）</option>
								<option value="5">Link</option>
							</select>
						</div>
						{button.style === 5 && (
							<div className="mb2">
								<label className="db fw6 mb1 white">URL</label>
								<input
									type="url"
									className="input-reset ba b--black-20 pa2 w-100 br2"
									value={button.url}
									onChange={(e) => updateButton(index, 'url', e.target.value)}
									placeholder="https://example.com"
								/>
							</div>
						)}
						<div className="flex items-center justify-between">
							<label className="flex items-center white">
								<input
									type="checkbox"
									className="mr2"
									checked={button.disabled}
									onChange={(e) =>
										updateButton(index, 'disabled', e.target.checked)
									}
								/>
								Disabled
							</label>
							<button
								className="button-reset bg-red white pa2 br2 pointer bn"
								onClick={() => removeButton(index)}
							>
								削除
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Component v2 - JSON editor with CodeMirror
function ComponentV2({ embedData, setEmbedData }) {
	const editorRef = useRef(null);
	const codeMirrorRef = useRef(null);
	const [jsonError, setJsonError] = useState('');

	useEffect(() => {
		if (editorRef.current && !codeMirrorRef.current) {
			codeMirrorRef.current = CodeMirror(editorRef.current, {
				value: JSON.stringify(embedData, null, 2),
				mode: 'javascript',
				theme: 'monokai',
				lineNumbers: true,
				tabSize: 2,
				lineWrapping: true,
			});

			codeMirrorRef.current.on('change', (instance) => {
				try {
					const value = instance.getValue();
					const parsed = JSON.parse(value);
					setEmbedData(parsed);
					setJsonError('');
				} catch (e) {
					setJsonError(e.message);
				}
			});
		}
	}, []);

	useEffect(() => {
		if (codeMirrorRef.current) {
			const current = codeMirrorRef.current.getValue();
			const newValue = JSON.stringify(embedData, null, 2);
			if (current !== newValue) {
				try {
					JSON.parse(current);
				} catch {
					codeMirrorRef.current.setValue(newValue);
				}
			}
		}
	}, [embedData]);

	return (
		<div className="pa3">
			<div className="mb3">
				<h3 className="fw6 mb2">JSON Editor</h3>
				<div
					ref={editorRef}
					className="ba b--black-20 br2"
					style={{ height: '400px' }}
				></div>
				{jsonError && (
					<div className="bg-light-red pa2 mt2 br2 dark-red">
						エラー：{jsonError}
					</div>
				)}
			</div>
		</div>
	);
}

// Discord Embed Preview Component
function EmbedPreview({ embedData }) {
	const parseMarkdown = (text) => {
		if (!text) return '';

		// Store code blocks temporarily
		const codeBlocks = [];
		let parsed = text;

		// Process code blocks first (```)
		parsed = parsed.replace(
			/```(\w+)?\n([\s\S]+?)```/g,
			(match, lang, code) => {
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
					highlightedCode = code
						.trim()
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;');
				}

				codeBlocks.push(
					`<pre style="background-color: #3f4146; padding: 8px; border-radius: 4px; margin: 8px 0; overflow-x: auto;"><code class="hljs" style="background: transparent; padding: 0;">${highlightedCode}</code></pre>`,
				);
				return placeholder;
			},
		);

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
			.replace(
				/<br><div style="font-size: 12px/g,
				'<div style="font-size: 12px',
			);

		return parsed;
	};

	const borderColor = embedData.color
		? `#${embedData.color.toString(16).padStart(6, '0')}`
		: '#202225';

	return (
		<div
			className="pa3 bg-dark-gray"
			style={{ backgroundColor: '#36393f', minHeight: '300px' }}
		>
			{/* Message Container */}
			<div className="flex items-start" style={{ maxWidth: '576px' }}>
				<img
					src="/images/discord_logo.png"
					alt="Bot Avatar"
					style={{
						width: '40px',
						height: '40px',
						borderRadius: '50%',
						marginRight: '16px',
						backgroundColor: '#5865f2',
						padding: '8px',
						flexShrink: 0,
					}}
					onError={(e) => {
						// Fallback to SVG if PNG is not available
						e.target.src = '/images/discord_logo.svg';
						e.target.onerror = null;
					}}
				/>
				<div style={{ flex: 1, minWidth: 0 }}>
					{/* Username and timestamp */}
					<div className="flex items-center" style={{ marginBottom: '2px' }}>
						<span
							style={{
								color: '#ffffff',
								fontWeight: 500,
								fontSize: '16px',
								marginRight: '6px',
							}}
						>
							Discord Bot
						</span>
						<span
							style={{
								backgroundColor: '#5865f2',
								color: '#ffffff',
								fontSize: '10px',
								fontWeight: 500,
								padding: '2px 4px',
								borderRadius: '3px',
								textTransform: 'uppercase',
							}}
						>
							BOT
						</span>
						<span
							style={{
								color: '#a3a6aa',
								fontSize: '12px',
								marginLeft: '6px',
							}}
						>
							{moment().format('LT')}
						</span>
					</div>

					{/* Message Content */}
					{embedData.content && (
						<div
							style={{
								color: '#dcddde',
								fontSize: '16px',
								lineHeight: '1.375',
								marginBottom: '4px',
								wordWrap: 'break-word',
							}}
							dangerouslySetInnerHTML={{
								__html: parseMarkdown(embedData.content),
							}}
						/>
					)}

					{/* Embed */}
					<div
						className="embed-preview"
						style={{
							backgroundColor: '#2f3136',
							borderLeft: `4px solid ${borderColor}`,
							borderRadius: '4px',
							padding: '16px',
							color: '#dcddde',
							fontFamily:
								'Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif',
							position: 'relative',
						}}
					>
						{/* Thumbnail */}
						{embedData.thumbnail?.url && (
							<img
								src={embedData.thumbnail.url}
								alt="thumbnail"
								style={{
									position: 'absolute',
									top: '16px',
									right: '16px',
									width: '80px',
									height: '80px',
									objectFit: 'cover',
									borderRadius: '8px',
								}}
								onError={(e) => (e.target.style.display = 'none')}
							/>
						)}

						{embedData.author?.name && (
							<div
								className="mb2 flex items-center"
								style={{ fontSize: '12px', fontWeight: 600 }}
							>
								{embedData.author.icon_url && (
									<img
										src={embedData.author.icon_url}
										alt="author"
										style={{
											width: '24px',
											height: '24px',
											borderRadius: '50%',
											marginRight: '8px',
										}}
										onError={(e) => (e.target.style.display = 'none')}
									/>
								)}
								{embedData.author.url ? (
									<a
										href={embedData.author.url}
										target="_blank"
										style={{ color: '#00b0f4', textDecoration: 'none' }}
									>
										{embedData.author.name}
									</a>
								) : (
									<span>{embedData.author.name}</span>
								)}
							</div>
						)}

						{embedData.title && (
							<div
								className="mb2"
								style={{ fontSize: '16px', fontWeight: 600 }}
							>
								{embedData.url ? (
									<a
										href={embedData.url}
										target="_blank"
										style={{ color: '#00b0f4', textDecoration: 'none' }}
									>
										{embedData.title}
									</a>
								) : (
									embedData.title
								)}
							</div>
						)}

						{embedData.description && (
							<div
								className="mb2"
								style={{ fontSize: '14px', lineHeight: '1.375' }}
								dangerouslySetInnerHTML={{
									__html: parseMarkdown(embedData.description),
								}}
							/>
						)}

						{embedData.fields && embedData.fields.length > 0 && (
							<div
								className="fields"
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
									gap: '8px',
									marginBottom: '8px',
								}}
							>
								{embedData.fields.map((field, index) => (
									<div
										key={index}
										style={{
											gridColumn: field.inline ? 'auto' : '1 / -1',
											fontSize: '14px',
										}}
									>
										<div style={{ fontWeight: 600, marginBottom: '4px' }}>
											{field.name}
										</div>
										<div
											style={{ lineHeight: '1.375' }}
											dangerouslySetInnerHTML={{
												__html: parseMarkdown(field.value),
											}}
										/>
									</div>
								))}
							</div>
						)}

						{/* Image */}
						{embedData.image?.url && (
							<img
								src={embedData.image.url}
								alt="embed image"
								style={{
									marginTop: '16px',
									maxWidth: '400px',
									width: '100%',
									borderRadius: '4px',
									display: 'block',
								}}
								onError={(e) => (e.target.style.display = 'none')}
							/>
						)}

						{(embedData.footer?.text || embedData.timestamp) && (
							<div
								className="flex items-center"
								style={{ fontSize: '12px', marginTop: '8px', color: '#b9bbbe' }}
							>
								{embedData.footer?.icon_url && (
									<img
										src={embedData.footer.icon_url}
										alt="footer"
										style={{
											width: '20px',
											height: '20px',
											borderRadius: '50%',
											marginRight: '8px',
										}}
										onError={(e) => (e.target.style.display = 'none')}
									/>
								)}
								<span>
									{embedData.footer?.text}
									{embedData.footer?.text && embedData.timestamp && ' • '}
									{embedData.timestamp &&
										moment(embedData.timestamp).format('lll')}
								</span>
							</div>
						)}
					</div>

					{/* Buttons */}
					{embedData.buttons && embedData.buttons.length > 0 && (
						<div style={{ marginTop: '8px' }}>
							{(() => {
								const rows = [];
								for (let i = 0; i < embedData.buttons.length; i += 5) {
									rows.push(embedData.buttons.slice(i, i + 5));
								}
								return rows.map((row, rowIndex) => (
									<div
										key={rowIndex}
										style={{
											display: 'flex',
											gap: '8px',
											marginBottom: rowIndex < rows.length - 1 ? '8px' : '0',
										}}
									>
										{row.map((button, buttonIndex) => {
											const index = rowIndex * 5 + buttonIndex;
											const getButtonStyle = (style, disabled) => {
												const baseStyle = {
													padding: '2px 16px',
													minHeight: '32px',
													borderRadius: '3px',
													fontWeight: 500,
													fontSize: '14px',
													border: 'none',
													cursor: disabled ? 'not-allowed' : 'pointer',
													opacity: disabled ? 0.5 : 1,
													textDecoration: 'none',
													display: 'inline-flex',
													alignItems: 'center',
													justifyContent: 'center',
												};

												switch (style) {
													case 1: // Primary
														return {
															...baseStyle,
															backgroundColor: '#5865f2',
															color: '#ffffff',
														};
													case 2: // Secondary
														return {
															...baseStyle,
															backgroundColor: '#4e5058',
															color: '#ffffff',
														};
													case 3: // Success
														return {
															...baseStyle,
															backgroundColor: '#248046',
															color: '#ffffff',
														};
													case 4: // Danger
														return {
															...baseStyle,
															backgroundColor: '#da373c',
															color: '#ffffff',
														};
													case 5: // Link
														return {
															...baseStyle,
															backgroundColor: '#4e5058',
															color: '#ffffff',
														};
													default:
														return baseStyle;
												}
											};

											const ExternalLinkIcon = () => (
												<svg
													width="16"
													height="16"
													viewBox="0 0 16 16"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													style={{ marginInlineStart: '8px' }}
												>
													<path d="M11 2H14V5M14 2L9 7" />
													<path d="M14 9V13C14 13.5 13.5 14 13 14H3C2.5 14 2 13.5 2 13V3C2 2.5 2.5 2 3 2H7" />
												</svg>
											);

											const buttonStyle = getButtonStyle(
												button.style,
												button.disabled,
											);

											return button.style === 5 && button.url ? (
												<a
													key={index}
													href={button.url}
													target="_blank"
													rel="noopener noreferrer"
													style={buttonStyle}
												>
													{button.label || 'Link'}
													<ExternalLinkIcon />
												</a>
											) : (
												<button
													key={index}
													style={buttonStyle}
													disabled={button.disabled}
												>
													{button.label || 'Button'}
												</button>
											);
										})}
									</div>
								));
							})()}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Main App Component
function App() {
	const [activeTab, setActiveTab] = useState('v1');
	const [embedData, setEmbedData] = useState({
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
	});
	const [jsonText, setJsonText] = useState('');
	const [jsonError, setJsonError] = useState('');

	// Update jsonText when embedData changes
	useEffect(() => {
		setJsonText(JSON.stringify(embedData, null, 2));
	}, [embedData]);

	const handleJsonChange = (e) => {
		const value = e.target.value;
		setJsonText(value);
		try {
			const parsed = JSON.parse(value);
			setEmbedData(parsed);
			setJsonError('');
		} catch (err) {
			setJsonError(err.message);
		}
	};

	const copyJSON = () => {
		navigator.clipboard.writeText(JSON.stringify(embedData, null, 2));
		alert('JSONをクリップボードにコピーしました！');
	};

	const exportJSON = () => {
		const blob = new Blob([JSON.stringify(embedData, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'discord-embed.json';
		a.click();
	};

	return (
		<div className="min-vh-100" style={{ backgroundColor: '#202225' }}>
			<div
				className="bg-dark-gray white pa3"
				style={{ backgroundColor: '#2f3136' }}
			>
				<h1 className="ma0 f3 fw6">Discord Embed Builder</h1>
			</div>

			{/* Tabs */}
			<div
				className="flex bg-near-black"
				style={{ backgroundColor: '#202225', borderBottom: '1px solid #000' }}
			>
				<button
					className={`pa3 pointer bn bg-transparent white ${activeTab === 'v1' ? 'bb bw2 b--blue' : ''}`}
					onClick={() => setActiveTab('v1')}
					style={{
						fontSize: '14px',
						fontWeight: 600,
						opacity: activeTab === 'v1' ? 1 : 0.6,
						transition: 'opacity 0.2s',
					}}
				>
					Component v1
				</button>
				<button
					className={`pa3 pointer bn bg-transparent white ${activeTab === 'v2' ? 'bb bw2 b--blue' : ''}`}
					onClick={() => setActiveTab('v2')}
					style={{
						fontSize: '14px',
						fontWeight: 600,
						opacity: activeTab === 'v2' ? 1 : 0.6,
						transition: 'opacity 0.2s',
					}}
				>
					Component v2
				</button>
			</div>

			{/* Content */}
			<div className="flex flex-wrap">
				<div className="w-100 w-50-l" style={{ backgroundColor: '#36393f' }}>
					{activeTab === 'v1' ? (
						<ComponentV1 embedData={embedData} setEmbedData={setEmbedData} />
					) : (
						<ComponentV2 embedData={embedData} setEmbedData={setEmbedData} />
					)}
				</div>
				<div className="w-100 w-50-l">
					<EmbedPreview embedData={embedData} />
					<div className="pa3 flex gap2" style={{ backgroundColor: '#36393f' }}>
						<button
							className="button-reset bg-blue white pa2 br2 pointer bn mr2"
							onClick={copyJSON}
						>
							📋 JSONをコピー
						</button>
						<button
							className="button-reset bg-green white pa2 br2 pointer bn"
							onClick={exportJSON}
						>
							💾 JSONファイルをエクスポート
						</button>
					</div>
					{activeTab === 'v1' && (
						<div className="pa3" style={{ backgroundColor: '#36393f' }}>
							<h3 className="fw6 mb2 white">JSON Editor</h3>
							<textarea
								className="input-reset ba b--black-20 pa2 w-100 br2 white bg-near-black code"
								style={{
									height: '400px',
									fontFamily: 'monospace',
									fontSize: '14px',
									lineHeight: '1.5',
									resize: 'vertical',
								}}
								value={jsonText}
								onChange={handleJsonChange}
							/>
							{jsonError && (
								<div
									className="bg-light-red pa2 mt2 br2 dark-red"
									style={{ fontSize: '12px' }}
								>
									エラー：{jsonError}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
