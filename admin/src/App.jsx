import React from 'react';
import AppProvider from './packages/core/providers/AppProvider';
import { router } from './routes';

function App() {
  return (
    <AppProvider config={{ router }} />
  );
}

export default App;
