import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";

const Messages = ({ socket, username }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);

  const messagesColumnRef = useRef(null);

  // Runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  // Scroll to the most recent message
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesReceived]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", {
      month: "short",
      day: "2-digit",
      year: "2-digit",
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
      {messagesReceived.map((msg, i) => (
        <div
          className={
            msg.username === username ? styles.userMessage : styles.message
          }
          key={i}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={styles.msgMetaUser}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
