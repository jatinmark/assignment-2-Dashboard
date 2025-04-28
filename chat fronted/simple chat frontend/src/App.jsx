import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Chat from "./components/Chat"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    // Wrap the entire app with AuthProvider to make authentication state available globally
    <AuthProvider>
      {/* Set up React Router for navigation between pages */}
      <Router>
        <div className="app-container">
          <Routes>
            {/* Define our application routes */}
            <Route path="/" element={<Login />} /> {/* Login page at root URL */}
            <Route path="/chat" element={<Chat />} /> {/* Chat page */}
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect any unknown routes to login */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
