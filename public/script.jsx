/**
 * Discord Embed Builder - Main Entry Point
 * This file imports and renders the main App component
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
