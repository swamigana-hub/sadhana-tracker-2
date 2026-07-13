import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppDataProvider } from './context/AppDataContext';
import { tryGetSupabase } from './lib/supabase/client';
import { initMonitoring } from './lib/monitoring/sentry';
import { registerPwa } from './registerPwa';
import './styles/global.css';

const supabaseClient = tryGetSupabase();

initMonitoring();
registerPwa();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppDataProvider supabaseClient={supabaseClient}>
        <App />
      </AppDataProvider>
    </BrowserRouter>
  </StrictMode>
);
