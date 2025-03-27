import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './services/store';
import App from './components/app/app';
import AppInitializer from './AppInitializer';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <App />
      </AppInitializer>
    </Provider>
  </React.StrictMode>
);
