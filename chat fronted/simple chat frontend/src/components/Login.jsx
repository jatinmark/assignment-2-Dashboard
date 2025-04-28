"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Login.css"

function Login() {
  // State for form inputs
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  // State for error messages
  const [error, setError] = useState("")

  // Hook for programmatic navigation
  const navigate = useNavigate()
  // Get login function from auth context
  const { login } = useAuth()

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent default form submission behavior

    // Validate username
    if (!username.trim()) {
      setError("Username is required")
      return
    }

    // Validate room name
    if (!room.trim()) {
      setError("Room name is required")
      return
    }

    // Login the user with the provided username
    login(username)

    // Store selected room in session storage
    // We use sessionStorage instead of localStorage because room selection
    // should not persist across browser sessions
    sessionStorage.setItem("chatRoom", room)

    // Navigate to chat page after successful login
    navigate("/chat")
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Join Chat</h1>
        {/* Display error message if any */}
        {error && <div className="error-message">{error}</div>}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="room">Room</label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room name"
            />
          </div>
          <button type="submit" className="login-button">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
