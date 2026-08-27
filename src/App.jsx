import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SidebarProvider } from './context/SidebarContext'
import { ToastProvider } from './context/ToastContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
