import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import StoreProvider from "./components/Providers/StoreProvider";
import DialogProvider from "./components/Providers/DialogProvider";
import ErrorBoundary from "./components/Boundaries/ErrorBoundary";
import SocketProvider from "./components/Providers/SocketProvider";
import SocketReactor from "./components/Reactors/SocketReactor";
import App from "./App";
import theme from "./theme";
import "./index.css";

export const muiCache = createCache({
  "key": "mui",
  "prepend": true,
});

ReactDOM.render(
  <React.StrictMode>
    <CacheProvider value={muiCache}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <DialogProvider>
            <ErrorBoundary>
              <SocketProvider>
                <SocketReactor />
                <App />
              </SocketProvider>
            </ErrorBoundary>
          </DialogProvider>
        </StoreProvider>
      </ThemeProvider>
    </CacheProvider>,
  </React.StrictMode>,
  document.getElementById('root')
);
