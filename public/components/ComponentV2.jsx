import { useState } from 'react';

/**
 * Component v2 - Advanced Builder with Components (IS_COMPONENTS_V2=true)
 * Provides an advanced interface for creating Discord message components v2
 */
export default function ComponentV2({ v2Data, setV2Data }) {
	const [draggedTextDisplay, setDraggedTextDisplay] = useState(null);
	const [draggedOverTextDisplay, setDraggedOverTextDisplay] = useState(null);
	const [draggedComponent, setDraggedComponent] = useState(null);
	const [draggedOverComponent, setDraggedOverComponent] = useState(null);
	const [draggedMediaItem, setDraggedMediaItem] = useState(null);
	const [draggedOverMediaItem, setDraggedOverMediaItem] = useState(null);

	const addContainer = () => {
		setV2Data((prev) => ({
			...prev,
			containers: [
				...(prev.containers || []),
				{
					components: [],
					color: '#5865f2',
					spoiler: false,
				},
			],
		}));
	};

	const removeContainer = (containerIndex) => {
		setV2Data((prev) => ({
			...prev,
			containers: prev.containers.filter((_, i) => i !== containerIndex),
		}));
	};

	const updateContainer = (containerIndex, field, value) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			newContainers[containerIndex] = {
				...newContainers[containerIndex],
				[field]: value,
			};
			return {
				...prev,
				containers: newContainers,
			};
		});
	};

	const addComponentToContainer = (containerIndex, componentType) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };

			let newComponent;
			switch (componentType) {
				case 'section': // SectionComponents
					newComponent = {
						type: 'section',
						components: [],
						accessory: null,
					};
					break;
				case 'media_gallery': // MediaGalleryComponents
					newComponent = {
						type: 'media_gallery',
						items: [],
					};
					break;
				case 'separator': // SeparatorComponents
					newComponent = {
						type: 'separator',
						spacing: 1,
					};
					break;
				case 'text_display': // TextDisplayComponents
					newComponent = {
						type: 'text_display',
						content: 'Text content',
					};
					break;
				case 'file': // FileComponents
					newComponent = {
						type: 'file',
						filename: 'file.txt',
					};
					break;
				case 'action_row': // ActionRowComponents
					newComponent = {
						type: 'action_row',
						components: [],
					};
					break;
				default:
					return prev;
			}

			container.components = [...container.components, newComponent];
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const updateComponent = (containerIndex, componentIndex, field, value) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const components = [...container.components];
			components[componentIndex] = {
				...components[componentIndex],
				[field]: value,
			};
			container.components = components;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const removeComponent = (containerIndex, componentIndex) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			container.components = container.components.filter(
				(_, i) => i !== componentIndex,
			);
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const reorderComponents = (containerIndex, fromIndex, toIndex) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const components = [...(container.components || [])];
			const [movedComponent] = components.splice(fromIndex, 1);
			components.splice(toIndex, 0, movedComponent);
			container.components = components;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	// MediaGallery管理関数
	const addMediaGalleryItem = (containerIndex, componentIndex) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			const currentItems = component.items || [];

			if (currentItems.length >= 10) {
				return prev;
			}

			component.items = [
				...currentItems,
				{
					media: {
						url: '',
					},
					description: '',
					spoiler: false,
				},
			];

			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const updateMediaGalleryItem = (
		containerIndex,
		componentIndex,
		itemIndex,
		field,
		value,
	) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			const items = [...(component.items || [])];
			const item = { ...items[itemIndex] };

			if (field === 'media_url') {
				item.media = {
					...(item.media || {}),
					url: value,
				};
			} else {
				item[field] = value;
			}

			items[itemIndex] = item;
			component.items = items;
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const removeMediaGalleryItem = (
		containerIndex,
		componentIndex,
		itemIndex,
	) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			component.items = (component.items || []).filter(
				(_, i) => i !== itemIndex,
			);
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const reorderMediaGalleryItems = (
		containerIndex,
		componentIndex,
		fromIndex,
		toIndex,
	) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			const items = [...(component.items || [])];
			const [movedItem] = items.splice(fromIndex, 1);
			items.splice(toIndex, 0, movedItem);
			component.items = items;
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const addSelectOption = (containerIndex, componentIndex) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			component.options = [
				...(component.options || []),
				{
					label: `Option ${(component.options?.length || 0) + 1}`,
					value: `option${(component.options?.length || 0) + 1}`,
					description: '',
				},
			];
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const updateSelectOption = (
		containerIndex,
		componentIndex,
		optionIndex,
		field,
		value,
	) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			const options = [...component.options];
			options[optionIndex] = { ...options[optionIndex], [field]: value };
			component.options = options;
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const removeSelectOption = (containerIndex, componentIndex, optionIndex) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			component.options = component.options.filter((_, i) => i !== optionIndex);
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	// TextDisplay管理関数（Section用）
	const addTextDisplay = (containerIndex, componentIndex) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			component.components = [
				...(component.components || []),
				{ type: 'TextDisplay', content: 'Text content' },
			];
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const removeTextDisplay = (containerIndex, componentIndex, textIndex) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			component.components = component.components.filter(
				(_, i) => i !== textIndex,
			);
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const updateTextDisplay = (
		containerIndex,
		componentIndex,
		textIndex,
		value,
	) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			const textDisplays = [...component.components];
			textDisplays[textIndex] = { type: 'TextDisplay', content: value };
			component.components = textDisplays;
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const reorderTextDisplays = (
		containerIndex,
		componentIndex,
		fromIndex,
		toIndex,
	) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			const textDisplays = [...component.components];
			const [movedItem] = textDisplays.splice(fromIndex, 1);
			textDisplays.splice(toIndex, 0, movedItem);
			component.components = textDisplays;
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	// Accessory管理関数（Section用）
	const addAccessory = (containerIndex, componentIndex, accessoryType) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };

			if (accessoryType === 'button') {
				component.accessory = {
					type: 'button',
					label: 'Button',
					style: 1,
					custom_id: `btn_${Date.now()}`,
				};
			} else if (accessoryType === 'thumbnail') {
				component.accessory = {
					type: 'thumbnail',
					media: {
						url: '',
					},
				};
			}

			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const removeAccessory = (containerIndex, componentIndex) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };
			component.accessory = null;
			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const updateAccessory = (containerIndex, componentIndex, field, value) => {
		setV2Data((prev) => {
			const newContainers = [...prev.containers];
			const container = { ...newContainers[containerIndex] };
			const component = { ...container.components[componentIndex] };

			if (field === 'media_url') {
				// thumbnail accessoryのmedia.url更新
				component.accessory = {
					...component.accessory,
					media: {
						...component.accessory.media,
						url: value,
					},
				};
			} else {
				component.accessory = {
					...component.accessory,
					[field]: value,
				};
			}

			container.components[componentIndex] = component;
			newContainers[containerIndex] = container;
			return { ...prev, containers: newContainers };
		});
	};

	const renderComponentEditor = (
		container,
		containerIndex,
		component,
		componentIndex,
	) => {
		const typeNames = {
			section: 'SectionComponents',
			media_gallery: 'MediaGalleryComponents',
			separator: 'SeparatorComponents',
			text_display: 'TextDisplayComponents',
			file: 'FileComponents',
			action_row: 'ActionRowComponents',
		};

		return (
			<div
				key={componentIndex}
				className="ba b--black-10 pa2 mb2 br2 bg-black-05"
				draggable
				onDragStart={(e) => {
					setDraggedComponent({ containerIndex, componentIndex });
					e.dataTransfer.effectAllowed = 'move';
				}}
				onDragOver={(e) => {
					e.preventDefault();
					e.dataTransfer.dropEffect = 'move';
					setDraggedOverComponent({ containerIndex, componentIndex });
				}}
				onDragLeave={(e) => {
					e.preventDefault();
					setDraggedOverComponent(null);
				}}
				onDrop={(e) => {
					e.preventDefault();
					setDraggedOverComponent(null);
					if (
						draggedComponent &&
						draggedComponent.containerIndex === containerIndex &&
						draggedComponent.componentIndex !== componentIndex
					) {
						reorderComponents(
							containerIndex,
							draggedComponent.componentIndex,
							componentIndex,
						);
					}
				}}
				onDragEnd={() => {
					setDraggedComponent(null);
					setDraggedOverComponent(null);
				}}
				style={{
					cursor: 'move',
					opacity:
						draggedComponent?.containerIndex === containerIndex &&
						draggedComponent?.componentIndex === componentIndex
							? 0.5
							: 1,
					borderTop:
						draggedOverComponent?.containerIndex === containerIndex &&
						draggedOverComponent?.componentIndex === componentIndex &&
						draggedComponent &&
						draggedComponent.componentIndex > componentIndex
							? '3px solid #357edd'
							: undefined,
					borderBottom:
						draggedOverComponent?.containerIndex === containerIndex &&
						draggedOverComponent?.componentIndex === componentIndex &&
						draggedComponent &&
						draggedComponent.componentIndex < componentIndex
							? '3px solid #357edd'
							: undefined,
				}}
			>
				<div className="flex items-center justify-between mb2">
					<span className="white-80 f6">
						<span
							style={{
								display: 'inline-block',
								marginRight: '8px',
								cursor: 'grab',
							}}
						>
							⋮⋮
						</span>
						{typeNames[component.type] || 'Unknown'}
					</span>
					<button
						className="button-reset bg-red white pa1 br2 pointer bn f7"
						onClick={() => removeComponent(containerIndex, componentIndex)}
					>
						削除
					</button>
				</div>

				{/* Section Components */}
				{component.type === 'section' && (
					<>
						{/* Components (TextDisplays) */}
						<div className="mb2">
							<div className="flex items-center justify-between mb1">
								<label className="db fw6 white f6">文字列</label>
								<button
									className="button-reset bg-blue white pa1 br2 pointer bn f7"
									onClick={() => addTextDisplay(containerIndex, componentIndex)}
								>
									+ 文字列を追加
								</button>
							</div>
							{component.components?.map((textDisplay, textIndex) => (
								<div
									key={textIndex}
									className="ba b--black-10 pa2 mb2 br2"
									draggable
									onDragStart={(e) => {
										e.stopPropagation();
										setDraggedTextDisplay({
											containerIndex,
											componentIndex,
											textIndex,
										});
										e.dataTransfer.effectAllowed = 'move';
									}}
									onDragOver={(e) => {
										e.preventDefault();
										e.stopPropagation();
										e.dataTransfer.dropEffect = 'move';
										setDraggedOverTextDisplay({
											containerIndex,
											componentIndex,
											textIndex,
										});
									}}
									onDragLeave={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setDraggedOverTextDisplay(null);
									}}
									onDrop={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setDraggedOverTextDisplay(null);
										if (
											draggedTextDisplay &&
											draggedTextDisplay.containerIndex === containerIndex &&
											draggedTextDisplay.componentIndex === componentIndex &&
											draggedTextDisplay.textIndex !== textIndex
										) {
											reorderTextDisplays(
												containerIndex,
												componentIndex,
												draggedTextDisplay.textIndex,
												textIndex,
											);
										}
									}}
									onDragEnd={() => {
										setDraggedTextDisplay(null);
										setDraggedOverTextDisplay(null);
									}}
									style={{
										cursor: 'move',
										opacity:
											draggedTextDisplay?.containerIndex === containerIndex &&
											draggedTextDisplay?.componentIndex === componentIndex &&
											draggedTextDisplay?.textIndex === textIndex
												? 0.5
												: 1,
										borderTop:
											draggedOverTextDisplay?.containerIndex ===
												containerIndex &&
											draggedOverTextDisplay?.componentIndex ===
												componentIndex &&
											draggedOverTextDisplay?.textIndex === textIndex &&
											draggedTextDisplay &&
											draggedTextDisplay.textIndex > textIndex
												? '3px solid #357edd'
												: undefined,
										borderBottom:
											draggedOverTextDisplay?.containerIndex ===
												containerIndex &&
											draggedOverTextDisplay?.componentIndex ===
												componentIndex &&
											draggedOverTextDisplay?.textIndex === textIndex &&
											draggedTextDisplay &&
											draggedTextDisplay.textIndex < textIndex
												? '3px solid #357edd'
												: undefined,
									}}
								>
									<div className="flex items-center justify-between mb1">
										<span className="white-70 f7">
											<span
												style={{
													display: 'inline-block',
													marginRight: '8px',
													cursor: 'grab',
												}}
											>
												⋮⋮
											</span>
											TextDisplay {textIndex + 1}
										</span>
										<button
											className="button-reset bg-red white pa1 br2 pointer bn f7"
											onClick={() =>
												removeTextDisplay(
													containerIndex,
													componentIndex,
													textIndex,
												)
											}
										>
											削除
										</button>
									</div>
									<textarea
										className="input-reset ba b--black-20 pa2 w-100 br2 f6"
										value={textDisplay.content || ''}
										onChange={(e) =>
											updateTextDisplay(
												containerIndex,
												componentIndex,
												textIndex,
												e.target.value,
											)
										}
										rows="3"
										placeholder="Text content"
									/>
								</div>
							))}
						</div>

						{/* Accessory */}
						<div className="mb2">
							<div className="flex items-center justify-between mb1">
								<label className="db fw6 white f6">アクセサリー</label>
								{!component.accessory && (
									<div className="flex items-center" style={{ gap: '8px' }}>
										<button
											className="button-reset bg-blue white pa1 br2 pointer bn f7"
											onClick={() =>
												addAccessory(containerIndex, componentIndex, 'button')
											}
										>
											+ ボタンを追加
										</button>
										<button
											className="button-reset bg-blue white pa1 br2 pointer bn f7"
											onClick={() =>
												addAccessory(
													containerIndex,
													componentIndex,
													'thumbnail',
												)
											}
										>
											+ 画像を追加
										</button>
									</div>
								)}
							</div>
							{!component.accessory ? null : (
								<div className="ba b--black-10 pa2 br2">
									<div className="flex items-center justify-between mb2">
										<span className="white-80 f6">
											{component.accessory.type === 'button'
												? 'Button Accessory'
												: 'Thumbnail Accessory'}
										</span>
										<button
											className="button-reset bg-red white pa1 br2 pointer bn f7"
											onClick={() =>
												removeAccessory(containerIndex, componentIndex)
											}
										>
											削除
										</button>
									</div>

									{component.accessory.type === 'button' && (
										<>
											<div className="mb2">
												<label className="db fw6 mb1 white f6">Label</label>
												<input
													type="text"
													className="input-reset ba b--black-20 pa2 w-100 br2 f6"
													value={component.accessory.label || ''}
													onChange={(e) =>
														updateAccessory(
															containerIndex,
															componentIndex,
															'label',
															e.target.value,
														)
													}
												/>
											</div>
											<div className="mb2">
												<label className="db fw6 mb1 white f6">Style</label>
												<div style={{ position: 'relative' }}>
													<select
														className="input-reset ba b--black-20 pa2 w-100 br2 f6"
														style={{ paddingRight: '32px', appearance: 'none' }}
														value={component.accessory.style || 1}
														onChange={(e) =>
															updateAccessory(
																containerIndex,
																componentIndex,
																'style',
																parseInt(e.target.value),
															)
														}
													>
														<option value="1">Primary</option>
														<option value="2">Secondary</option>
														<option value="3">Success</option>
														<option value="4">Danger</option>
														<option value="5">Link</option>
													</select>
													<span
														aria-hidden="true"
														style={{
															position: 'absolute',
															right: '10px',
															top: '50%',
															transform: 'translateY(-50%) rotate(90deg)',
															color: '#1f2328',
															pointerEvents: 'none',
															fontSize: '16px',
															fontWeight: 700,
															lineHeight: 1,
														}}
													>
														❯
													</span>
												</div>
											</div>
											<div className="mb2">
												<label className="db fw6 mb1 white f6">Custom ID</label>
												<input
													type="text"
													className="input-reset ba b--black-20 pa2 w-100 br2 f6"
													value={component.accessory.custom_id || ''}
													onChange={(e) =>
														updateAccessory(
															containerIndex,
															componentIndex,
															'custom_id',
															e.target.value,
														)
													}
												/>
											</div>
										</>
									)}

									{component.accessory.type === 'thumbnail' && (
										<div className="mb2">
											<label className="db fw6 mb1 white f6">Image URL</label>
											<input
												type="url"
												className="input-reset ba b--black-20 pa2 w-100 br2 f6"
												value={component.accessory.media?.url || ''}
												onChange={(e) =>
													updateAccessory(
														containerIndex,
														componentIndex,
														'media_url',
														e.target.value,
													)
												}
												placeholder="https://example.com/image.png"
											/>
										</div>
									)}
								</div>
							)}
						</div>
					</>
				)}

				{/* Media Gallery Components */}
				{component.type === 'media_gallery' && (
					<div className="mb2">
						<div className="flex items-center justify-between mb2">
							<label className="db fw6 white f6">
								メディア ({component.items?.length || 0}/10)
							</label>
							<button
								className={`button-reset pa1 br2 bn f7 ${
									(component.items?.length || 0) >= 10
										? 'bg-gray white o-50'
										: 'bg-blue white pointer'
								}`}
								onClick={() =>
									addMediaGalleryItem(containerIndex, componentIndex)
								}
								disabled={(component.items?.length || 0) >= 10}
							>
								+ メディアを追加
							</button>
						</div>

						{(component.items?.length || 0) >= 10 && (
							<div className="pa2 mb2 br2 bg-red white f7">
								メディアは最大10個まで追加できます。
							</div>
						)}

						{component.items && component.items.length > 0 ? (
							component.items.map((item, itemIndex) => (
								<div
									key={itemIndex}
									className="ba b--black-10 pa2 mb2 br2"
									draggable
									onDragStart={(e) => {
										e.stopPropagation();
										setDraggedMediaItem({
											containerIndex,
											componentIndex,
											itemIndex,
										});
										e.dataTransfer.effectAllowed = 'move';
									}}
									onDragOver={(e) => {
										e.preventDefault();
										e.stopPropagation();
										e.dataTransfer.dropEffect = 'move';
										setDraggedOverMediaItem({
											containerIndex,
											componentIndex,
											itemIndex,
										});
									}}
									onDragLeave={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setDraggedOverMediaItem(null);
									}}
									onDrop={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setDraggedOverMediaItem(null);
										if (
											draggedMediaItem &&
											draggedMediaItem.containerIndex === containerIndex &&
											draggedMediaItem.componentIndex === componentIndex &&
											draggedMediaItem.itemIndex !== itemIndex
										) {
											reorderMediaGalleryItems(
												containerIndex,
												componentIndex,
												draggedMediaItem.itemIndex,
												itemIndex,
											);
										}
									}}
									onDragEnd={() => {
										setDraggedMediaItem(null);
										setDraggedOverMediaItem(null);
									}}
									style={{
										cursor: 'move',
										opacity:
											draggedMediaItem?.containerIndex === containerIndex &&
											draggedMediaItem?.componentIndex === componentIndex &&
											draggedMediaItem?.itemIndex === itemIndex
												? 0.5
												: 1,
										borderTop:
											draggedOverMediaItem?.containerIndex === containerIndex &&
											draggedOverMediaItem?.componentIndex === componentIndex &&
											draggedOverMediaItem?.itemIndex === itemIndex &&
											draggedMediaItem &&
											draggedMediaItem.itemIndex > itemIndex
												? '3px solid #357edd'
												: undefined,
										borderBottom:
											draggedOverMediaItem?.containerIndex === containerIndex &&
											draggedOverMediaItem?.componentIndex === componentIndex &&
											draggedOverMediaItem?.itemIndex === itemIndex &&
											draggedMediaItem &&
											draggedMediaItem.itemIndex < itemIndex
												? '3px solid #357edd'
												: undefined,
									}}
								>
									<div className="flex items-center justify-between mb2">
										<span className="white-80 f7">Media {itemIndex + 1}</span>
										<button
											className="button-reset bg-red white pa1 br2 pointer bn f7"
											onClick={() =>
												removeMediaGalleryItem(
													containerIndex,
													componentIndex,
													itemIndex,
												)
											}
										>
											削除
										</button>
									</div>

									<div className="mb2">
										<label className="db fw6 mb1 white f6">メディアのURL</label>
										<input
											type="url"
											className="input-reset ba b--black-20 pa2 w-100 br2 f6"
											value={item.media?.url || ''}
											onChange={(e) =>
												updateMediaGalleryItem(
													containerIndex,
													componentIndex,
													itemIndex,
													'media_url',
													e.target.value,
												)
											}
											placeholder="https://example.com/image.png"
										/>
									</div>

									<div className="mb2">
										<label className="db fw6 mb1 white f6">ALT属性</label>
										<textarea
											className="input-reset ba b--black-20 pa2 w-100 br2 f6"
											value={item.description || ''}
											onChange={(e) =>
												updateMediaGalleryItem(
													containerIndex,
													componentIndex,
													itemIndex,
													'description',
													e.target.value,
												)
											}
											rows="3"
											maxLength="1024"
											placeholder="例: 夕焼けの海辺で白い犬が走っている写真"
										/>
										<div className="white-60 f7 mt1 tr">
											{(item.description || '').length}/1024
										</div>
									</div>

									<label className="flex items-center white f6">
										<input
											type="checkbox"
											className="mr2"
											checked={item.spoiler || false}
											onChange={(e) =>
												updateMediaGalleryItem(
													containerIndex,
													componentIndex,
													itemIndex,
													'spoiler',
													e.target.checked,
												)
											}
										/>
										スポイラーとしてマーク
									</label>
								</div>
							))
						) : (
							<div className="white-60 f7">メディアがありません</div>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="flex flex-column">
			{/* GUI Editor - Top Half */}
			<div className="pa3">
				<div className="flex items-center justify-between mb3">
					<h3 className="fw6 white ma0">GUIエディター</h3>
					<button
						className="button-reset bg-blue white pa2 br2 pointer bn"
						onClick={addContainer}
					>
						+ containerを追加
					</button>
				</div>

				{v2Data.containers && v2Data.containers.length > 0 ? (
					v2Data.containers.map((container, containerIndex) => (
						<div key={containerIndex} className="ba b--black-20 pa3 mb3 br2">
							<div className="flex items-center justify-between mb2">
								<h4 className="fw6 white ma0">
									Container {containerIndex + 1}
								</h4>
								<button
									className="button-reset bg-red white pa2 br2 pointer bn"
									onClick={() => removeContainer(containerIndex)}
								>
									削除
								</button>
							</div>

							<div className="mb3 flex" style={{ height: '32px', gap: '16px' }}>
								<div
									style={{
										flex: '1',
										display: 'flex',
										alignItems: 'center',
										gap: '12px',
									}}
								>
									<label
										className="flex items-center white f6"
										style={{ whiteSpace: 'nowrap' }}
									>
										<input
											type="checkbox"
											className="mr2"
											checked={
												container.color !== null &&
												container.color !== undefined
											}
											onChange={(e) =>
												updateContainer(
													containerIndex,
													'color',
													e.target.checked ? '#5865f2' : null,
												)
											}
										/>
										色を設定
									</label>
									{container.color && (
										<input
											type="color"
											className="input-reset ba b--black-20 br2 pointer"
											style={{ width: '60px', height: '32px' }}
											value={container.color || '#5865f2'}
											onChange={(e) =>
												updateContainer(containerIndex, 'color', e.target.value)
											}
										/>
									)}
								</div>
								<div
									style={{
										flex: '0 0 auto',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<label className="flex items-center white f6">
										<input
											type="checkbox"
											className="mr2"
											checked={container.spoiler || false}
											onChange={(e) =>
												updateContainer(
													containerIndex,
													'spoiler',
													e.target.checked,
												)
											}
										/>
										スポイラーとしてマーク
									</label>
								</div>
							</div>

							<div className="mb3">
								<label className="db fw6 mb2 white">コンポーネントを追加</label>
								<div className="flex flex-wrap" style={{ gap: '8px' }}>
									<button
										className="button-reset bg-blue white pa2 br2 pointer bn f6"
										onClick={() =>
											addComponentToContainer(containerIndex, 'section')
										}
									>
										+ セクションを追加
									</button>
									<button
										className="button-reset bg-blue white pa2 br2 pointer bn f6"
										onClick={() =>
											addComponentToContainer(containerIndex, 'media_gallery')
										}
									>
										+ 画像ギャラリーを追加
									</button>
									<button
										className="button-reset bg-blue white pa2 br2 pointer bn f6"
										onClick={() =>
											addComponentToContainer(containerIndex, 'separator')
										}
									>
										+ 仕切り線を追加
									</button>
									<button
										className="button-reset bg-blue white pa2 br2 pointer bn f6"
										onClick={() =>
											addComponentToContainer(containerIndex, 'text_display')
										}
									>
										+ 文字列を追加
									</button>
									<button
										className="button-reset bg-blue white pa2 br2 pointer bn f6"
										onClick={() =>
											addComponentToContainer(containerIndex, 'file')
										}
									>
										+ ファイルを追加
									</button>
									<button
										className="button-reset bg-blue white pa2 br2 pointer bn f6"
										onClick={() =>
											addComponentToContainer(containerIndex, 'action_row')
										}
									>
										+ ボタンやセレクトメニューを追加
									</button>
								</div>
							</div>

							{container.components && container.components.length > 0 ? (
								container.components.map((component, componentIndex) =>
									renderComponentEditor(
										container,
										containerIndex,
										component,
										componentIndex,
									),
								)
							) : (
								<div className="white-60 tc pa3 f6">
									このコンテナにはまだコンポーネントがありません
								</div>
							)}
						</div>
					))
				) : (
					<div className="white-60 tc pa4">
						「+ containerを追加」ボタンをクリックして開始
					</div>
				)}
			</div>
		</div>
	);
}
