import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import { ThemeProvider } from '@material-tailwind/react'

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Function to persist data in localStorage
const persistQueryClient = () => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    queryClient.setQueryData(['auth'], JSON.parse(auth));
  }
};

persistQueryClient(); // Initialize persistence

createRoot(document.getElementById('root')).render(

  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </ThemeProvider>

  </QueryClientProvider>

)
