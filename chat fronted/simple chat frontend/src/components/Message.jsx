import { formatDistanceToNow } from "date-fns"
import "../styles/Message.css"

function Message({ message, isOwnMessage }) {
  // Format the timestamp to a relative time (e.g., "5 minutes ago")
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      // Fallback if date parsing fails
      return "just now"
    }
  }

  // Special rendering for system messages (user joined/left notifications)
  if (message.isSystem) {
    return (
      <div className="message-system">
        <p>{message.text}</p>
      </div>
    )
  }

  // Regular message rendering with different styles for own vs. other messages
  return (
    <div className={`message ${isOwnMessage ? "message-own" : "message-other"}`}>
      <div className="message-header">
        <span className="message-username">{message.username}</span>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
      <div className="message-body">
        <p>{message.text}</p>
      </div>
    </div>
  )
}

export default Message
