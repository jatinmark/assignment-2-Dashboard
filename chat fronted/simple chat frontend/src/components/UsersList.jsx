import "../styles/UsersList.css"

function UsersList({ users }) {
  return (
    <div className="users-list">
      {/* Header showing the number of users */}
      <h3>Users in Room ({users.length})</h3>

      {/* List of users */}
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-item">
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersList
