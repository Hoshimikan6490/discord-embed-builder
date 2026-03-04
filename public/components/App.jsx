import React, { useState, useEffect } from 'react';
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
								<h3 className="fw6 mb2 white">JSONエディター</h3>
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
