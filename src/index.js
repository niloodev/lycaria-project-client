////// Código responsável por carregar a aplicação.
import React from 'react';
import ReactDOM from 'react-dom';

// Stylesheets
import './index.css';

// Aplicação
import App from './components/App';

let root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.render(<App/>, document.getElementById('root'));
