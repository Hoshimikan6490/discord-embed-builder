/**
 * Copy JSON data to clipboard
 * @param {Object} data - The data to copy
 */
export function copyJSON(data) {
	navigator.clipboard.writeText(JSON.stringify(data, null, 2));
	alert('JSONをクリップボードにコピーしました！');
}

/**
 * Export JSON data as a file
 * @param {Object} data - The data to export
 * @param {string} filename - The filename for the exported file
 */
export function exportJSON(data, filename) {
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
