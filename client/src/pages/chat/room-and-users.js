import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  const capFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    socket.on("chatroom_users", (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off("chatroom_users");
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", { username, room, __createdtime__ });
    // Redirect to home page
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.roomAndUsersColumn}>
      <div className={styles.roomTitleContainer}>
        <h2 className={styles.roomTitle}>{capFirstLetter(room)}</h2>
      </div>

      <div>
        {roomUsers.length > 0 && (
          <h5 className={styles.usersTitle}>Users in the room</h5>
        )}
        <ul className={styles.usersList}>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${user.username === username ? "bold" : "light"}`,
              }}
              key={user.id}
            >
              <div className={styles.userContainer}>
                <div
                  className={
                    user.username === username
                      ? styles.currentUserBubble
                      : styles.userBubble
                  }
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <p>{user.username}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button className="btn btn-outline" onClick={leaveRoom}>
        Leave room
      </button>
    </div>
  );
};

export default RoomAndUsers;
