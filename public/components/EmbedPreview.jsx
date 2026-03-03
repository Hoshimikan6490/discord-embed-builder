import React, { useState, useEffect, useRef } from 'react';
import { parseMarkdown } from '../utils/markdown.js';

/**
 * Discord Embed Preview Component
 * Displays a preview of the Discord embed
 */
export default function EmbedPreview({ embedData }) {
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
