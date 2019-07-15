import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import ErrorBoundary from '../src/components/ErrorBoundary.jsx';
import Resize from './components/Resize.jsx';
// ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('app'));

ReactDOM.render(<Resize />, document.getElementById('app'));
