import './App.css';
import AppRouter from './router';
import { AlertProvider } from './context/AlertContext';

function App() {
  return (
    <AlertProvider>
      <AppRouter />
    </AlertProvider>
  );
}

export default App;
