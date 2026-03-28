import { useState, useEffect, useRef } from 'react';
import ComponentV1 from './ComponentV1.jsx';
import ComponentV2 from './ComponentV2.jsx';
import EmbedPreview from './EmbedPreview.jsx';
import { defaultEmbedData } from '../utils/constants.js';
import { copyJSON, exportJSON } from '../utils/exportUtils.js';

/**
 * Main App Component
 * Handles tab switching between v1 and v2 interfaces
 */
export default function App() {
	const [activeTab, setActiveTab] = useState('v1');

	// v1 用のデータ
	const [embedData, setEmbedData] = useState(defaultEmbedData);

	// v2 用のデータ（独立）
	const [v2Data, setV2Data] = useState({
		containers: [],
	});

	const [jsonText, setJsonText] = useState('');
	const [jsonError, setJsonError] = useState('');
	const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
	const jsonTextareaRef = useRef(null);
	const jsonLineNumbersRef = useRef(null);

	// Update jsonText when embedData changes
	useEffect(() => {
		setJsonText(JSON.stringify(embedData, null, 2));
	}, [embedData]);

	const lineCount = Math.max(1, jsonText.split('\n').length);

	const updateCursorPosition = (text, cursorIndex) => {
		const beforeCursor = text.slice(0, cursorIndex);
		const parts = beforeCursor.split('\n');
		setCursorPosition({
			line: parts.length,
			column: parts[parts.length - 1].length + 1,
		});
	};

	const handleJsonChange = (e) => {
		const value = e.target.value;
		setJsonText(value);
		updateCursorPosition(value, e.target.selectionStart || 0);
		try {
			const parsed = JSON.parse(value);
			setEmbedData(parsed);
			setJsonError('');
		} catch (err) {
			setJsonError(err.message);
		}
	};

	const handleJsonKeyDown = (e) => {
		if (e.key !== 'Tab') return;
		e.preventDefault();

		const target = e.target;
		const start = target.selectionStart;
		const end = target.selectionEnd;
		const nextValue = `${jsonText.slice(0, start)}  ${jsonText.slice(end)}`;

		setJsonText(nextValue);
		setTimeout(() => {
			if (jsonTextareaRef.current) {
				jsonTextareaRef.current.selectionStart = start + 2;
				jsonTextareaRef.current.selectionEnd = start + 2;
			}
		}, 0);

		updateCursorPosition(nextValue, start + 2);

		try {
			const parsed = JSON.parse(nextValue);
			setEmbedData(parsed);
			setJsonError('');
		} catch (err) {
			setJsonError(err.message);
		}
	};

	const handleJsonScroll = (e) => {
		if (jsonLineNumbersRef.current) {
			jsonLineNumbersRef.current.scrollTop = e.target.scrollTop;
		}
	};

	const handleJsonCursorMove = (e) => {
		updateCursorPosition(e.target.value, e.target.selectionStart || 0);
	};

	const handleCopyJSON = () => {
		const data = activeTab === 'v1' ? embedData : v2Data;
		copyJSON(data);
	};

	const handleExportJSON = () => {
		const data = activeTab === 'v1' ? embedData : v2Data;
		exportJSON(data, `discord-embed-${activeTab}.json`);
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
			<div className="ph2 pt2" style={{ backgroundColor: '#202225' }}>
				<div
					className="flex"
					role="tablist"
					aria-label="Component version tabs"
					style={{
						borderRadius: 0,
						padding: '4px 4px 0 4px',
						gap: '4px',
					}}
				>
					<button
						role="tab"
						aria-selected={activeTab === 'v1'}
						className="pointer bn white tab-button"
						onClick={() => setActiveTab('v1')}
						style={{
							padding: '12px 15px 10px',
							fontSize: '14px',
							fontWeight: 700,
							borderRadius: '8px 8px 0 0',
							backgroundColor:
								activeTab === 'v1' ? 'rgb(43, 45, 49)' : 'transparent',
							opacity: activeTab === 'v1' ? 1 : 0.75,
							boxShadow:
								activeTab === 'v1'
									? '0 2px 8px rgba(43, 45, 49, 0.35)'
									: 'none',
							transition: 'all 0.2s ease',
						}}
					>
						Component v1
					</button>
					<button
						role="tab"
						aria-selected={activeTab === 'v2'}
						className="pointer bn white tab-button"
						onClick={() => setActiveTab('v2')}
						style={{
							padding: '12px 15px 10px',
							fontSize: '14px',
							fontWeight: 700,
							borderRadius: '8px 8px 0 0',
							backgroundColor:
								activeTab === 'v2' ? 'rgb(43, 45, 49)' : 'transparent',
							opacity: activeTab === 'v2' ? 1 : 0.75,
							boxShadow:
								activeTab === 'v2'
									? '0 2px 8px rgba(43, 45, 49, 0.35)'
									: 'none',
							transition: 'all 0.2s ease',
						}}
					>
						Component v2
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-wrap" style={{ marginTop: 0 }}>
				{activeTab === 'v1' ? (
					<>
						<div
							className="w-100 w-50-l"
							style={{ backgroundColor: '#36393f' }}
						>
							<ComponentV1 embedData={embedData} setEmbedData={setEmbedData} />
						</div>
						<div className="w-100 w-50-l">
							<EmbedPreview embedData={embedData} />
							<div
								className="pa3 flex gap2"
								style={{ backgroundColor: '#36393f' }}
							>
								<button
									className="button-reset bg-blue white pa2 br2 pointer bn mr2"
									onClick={handleCopyJSON}
								>
									📋 JSONコピー
								</button>
								<button
									className="button-reset bg-green white pa2 br2 pointer bn"
									onClick={handleExportJSON}
								>
									💾 JSONエクスポート
								</button>
							</div>
							<div className="pa3" style={{ backgroundColor: '#36393f' }}>
								<div className="flex items-center justify-between mb2">
									<h3 className="fw6 white">JSONエディター</h3>
									<div className="white-60 f7">
										Ln {cursorPosition.line}, Col {cursorPosition.column}
									</div>
								</div>
								<div
									className="json-editor-shell ba b--black-20 br2 overflow-hidden"
									style={{ height: '400px' }}
								>
									<div
										ref={jsonLineNumbersRef}
										className="json-editor-gutter"
										aria-hidden="true"
									>
										{Array.from({ length: lineCount }, (_, i) => (
											<div key={i + 1} className="json-editor-line-number">
												{i + 1}
											</div>
										))}
									</div>
									<textarea
										ref={jsonTextareaRef}
										className="json-editor-textarea"
										value={jsonText}
										onChange={handleJsonChange}
										onKeyDown={handleJsonKeyDown}
										onScroll={handleJsonScroll}
										onClick={handleJsonCursorMove}
										onKeyUp={handleJsonCursorMove}
										onSelect={handleJsonCursorMove}
										spellCheck={false}
									/>
								</div>
								{jsonError && (
									<div
										className="bg-red pa2 mt2 br2 white b"
										style={{ fontSize: '12px' }}
									>
										エラー：{jsonError}
									</div>
								)}
							</div>
						</div>
					</>
				) : (
					<>
						<div
							className="w-100 w-50-l"
							style={{ backgroundColor: '#36393f' }}
						>
							<ComponentV2 v2Data={v2Data} setV2Data={setV2Data} />
						</div>
						<div className="w-100 w-50-l">
							<EmbedPreview embedData={embedData} v2Data={v2Data} />
							<div
								className="pa3 flex gap2"
								style={{ backgroundColor: '#36393f' }}
							>
								<button
									className="button-reset bg-blue white pa2 br2 pointer bn mr2"
									onClick={handleCopyJSON}
								>
									📋 JSONコピー
								</button>
								<button
									className="button-reset bg-green white pa2 br2 pointer bn"
									onClick={handleExportJSON}
								>
									💾 JSONエクスポート
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
