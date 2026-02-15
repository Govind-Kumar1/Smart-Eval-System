import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Redux Imports (Ye add karo)
import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* App ko Provider ke andar daal do */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);