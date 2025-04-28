"use client"

// Chat.jsx - Main chat interface component
// This component handles the socket connection and chat functionality

import { useState, useEffect, useRef } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { io } from "socket.io-client" // Import Socket.io client
import { useAuth } from "../context/AuthContext"
import Message from "./Message"
import UsersList from "./UsersList"
import "../styles/Chat.css"

function Chat() {
  // State for chat messages
  const [messages, setMessages] = useState([])
  // State for message input
  const [messageText, setMessageText] = useState("")
  // State for users in the room
  const [roomUsers, setRoomUsers] = useState([])
  // State for current room
  const [room, setRoom] = useState("")
  // State for socket connection
  const [socket, setSocket] = useState(null)
  // State for connection status
  const [connected, setConnected] = useState(false)
  // State for error messages
  const [error, setError] = useState("")

  // Ref for auto-scrolling to bottom of messages
  const messagesEndRef = useRef(null)
  // Get user data and logout function from auth context
  const { user, logout } = useAuth()
  // Hook for programmatic navigation
  const navigate = useNavigate()

  // Initialize socket connection when component mounts
  useEffect(() => {
    // Redirect to login if no user is authenticated
    if (!user) {
      navigate("/")
      return
    }

    // Get room from session storage
    const storedRoom = sessionStorage.getItem("chatRoom")
    // Redirect to login if no room is selected
    if (!storedRoom) {
      navigate("/")
      return
    }

    // Set room state
    setRoom(storedRoom)

    // Connect to the socket server
    // Note: This should match your backend server URL
    const newSocket = io("https://expo-react-native-chat-app.onrender.com/")
    setSocket(newSocket)

    // Socket event listeners for connection management
    newSocket.on("connect", () => {
      console.log("Connected to server")
      setConnected(true)

      // Join the room once connected
      newSocket.emit("joinRoom", { username: user.username, room: storedRoom })
    })

    // Handle connection errors
    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err)
      setError("Failed to connect to the server. Please try again later.")
      setConnected(false)
    })

    // Handle disconnection
    newSocket.on("disconnect", () => {
      console.log("Disconnected from server")
      setConnected(false)
    })

    // Clean up socket connection on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect()
      }
    }
  }, [user, navigate]) // Re-run if user or navigate changes

  // Set up message and room event listeners
  useEffect(() => {
    // Skip if socket is not initialized
    if (!socket) return

    // Room joined confirmation
    socket.on("roomJoined", (data) => {
      console.log(`Joined room: ${data.room} as ${data.username}`)
    })

    // Load previous messages from the server
    socket.on("previousMessages", (prevMessages) => {
      setMessages(prevMessages)
    })

    // Handle new incoming messages
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    // Update room users list
    socket.on("roomUsers", (users) => {
      setRoomUsers(users)
    })

    // Handle user joined notification
    socket.on("userJoined", (data) => {
      // Create a system message for user joining
      const systemMessage = {
        id: Date.now().toString(),
        text: `${data.username} has joined the chat`,
        username: "System",
        timestamp: new Date(),
        isSystem: true,
      }
      setMessages((prevMessages) => [...prevMessages, systemMessage])
    })

    // Handle user left notification
    socket.on("userLeft", (data) => {
      // Create a system message for user leaving
      const systemMessage = {
        id: Date.now().toString(),
        text: `${data.username} has left the chat`,
        username: "System",
        timestamp: new Date(),
        isSystem: true,
      }
      setMessages((prevMessages) => [...prevMessages, systemMessage])
    })

    // Handle message errors
    socket.on("messageError", (data) => {
      setError(data.error)
      // Clear error after 5 seconds
      setTimeout(() => setError(""), 5000)
    })

    // Clean up event listeners when component unmounts or socket changes
    return () => {
      socket.off("roomJoined")
      socket.off("previousMessages")
      socket.off("message")
      socket.off("roomUsers")
      socket.off("userJoined")
      socket.off("userLeft")
      socket.off("messageError")
    }
  }, [socket]) // Re-run if socket changes

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]) // Re-run when messages change

  // Handle sending a new message
  const sendMessage = (e) => {
    e.preventDefault() // Prevent form submission default behavior

    // Don't send if message is empty, not connected, or socket not initialized
    if (!messageText.trim() || !connected || !socket) return

    // Send message to server
    socket.emit("message", { text: messageText })
    // Clear input field after sending
    setMessageText("")
  }

  // Handle user logout
  const handleLogout = () => {
    // Disconnect socket if it exists
    if (socket) {
      socket.disconnect()
    }
    // Clear room from session storage
    sessionStorage.removeItem("chatRoom")
    // Call logout function from auth context
    logout()
    // Navigate back to login page
    navigate("/")
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" />
  }

  return (
    <div className="chat-container">
      {/* Chat header with room name and connection status */}
      <div className="chat-header">
        <h2>Room: {room}</h2>
        <div className="connection-status">
          <span className={connected ? "status-connected" : "status-disconnected"}>
            {connected ? "Connected" : "Disconnected"}
          </span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {/* Main chat area with users list and messages */}
      <div className="chat-main">
        {/* Users list sidebar */}
        <UsersList users={roomUsers} />

        {/* Chat messages area */}
        <div className="chat-messages">
          {/* Display error message if any */}
          {error && <div className="error-message">{error}</div>}

          {/* Messages container with auto-scroll */}
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="no-messages">No messages yet. Start the conversation!</div>
            ) : (
              // Map through messages and render each one
              messages.map((message) => (
                <Message key={message.id} message={message} isOwnMessage={message.username === user.username} />
              ))
            )}
            {/* Invisible element for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input form */}
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              disabled={!connected} // Disable if not connected
            />
            <button
              type="submit"
              disabled={!connected || !messageText.trim()} // Disable if not connected or message is empty
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
