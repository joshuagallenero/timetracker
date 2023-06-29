import { BaseProvider } from 'baseui';
import { LightTheme } from 'baseui/themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';

import App from './App.jsx';

import './index.css';

const engine = new Styletron();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyletronProvider value={engine}>
      <BaseProvider
        theme={LightTheme}
        overrides={{
          AppContainer: {
            props: {
              className: 'font-sans',
            },
          },
        }}
      >
        <App />
      </BaseProvider>
    </StyletronProvider>
  </React.StrictMode>,
);
