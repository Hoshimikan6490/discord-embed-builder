/**
 * Component v1 - Form-based editor
 * Provides a comprehensive form interface for editing Discord embeds
 */
export default function ComponentV1({ embedData, setEmbedData }) {
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
