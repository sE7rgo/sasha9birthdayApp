import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Chat.scss";
import randomColor from "randomcolor";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [drone, setDrone] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [userColor, setUserColor] = useState("");
  const scaledroneChannel = process.env.REACT_APP_SCALEDRONE_CHANNEL;
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const popAudioRef = useRef(null);

  useEffect(() => {
    popAudioRef.current = new window.Audio(
      require("../../assets/sounds/Pop 2.mp3"),
    );
  }, []);

  useEffect(() => {
    if (!user) return;
    const droneInstance = new window.Scaledrone(scaledroneChannel, {
      data: user,
    });

    setDrone(droneInstance);

    droneInstance.on("open", () => {
      console.log("Connected to Scaledrone!");
      setIsConnected(true);
    });

    // Subscribe to room with history
    const room = droneInstance.subscribe("observable-room", {
      historyCount: 20, // ask for the 20 most recent messages from the room's history
    });
    console.log("room", room);

    // Listen for historical messages
    room.on("history_message", (message) => {
      console.log("History message:", message);
      // Only add messages of type 'message' to state
      if (message.data && message.data.type === "message" && message.data.text && message.data.sender) {
        setMessages((prev) => [...prev, {
          ...message.data,
          color: message.data.color || "#888",
          timestamp: message.data.timestamp || new Date(message.timestamp * 1000).toLocaleString(),
        }]);
      }
    });

    // Listen for new messages
    room.on("data", (data) => {
      console.log("Received data:", data);
      if (!data || typeof data !== "object" || !data.type) {
        console.error("Received invalid data:", data);
        return;
      }
      if (data.type === "message" && data.sender && data.text) {
        setMessages((prev) => {
          const updatedMessages = [...prev, data];
          if (hasInteracted && popAudioRef.current) {
            popAudioRef.current.play().catch((error) => {
              console.error("Audio playback failed:", error);
            });
          }
          return updatedMessages;
        });
      } else if (data.type === "typing") {
        const { sender, isTyping } = data;
        if (isTyping) {
          setTypingUsers((prev) => {
            if (!prev.includes(sender)) {
              return [...prev, sender];
            }
            return prev;
          });
        } else {
          setTypingUsers((prev) => prev.filter((user) => user !== sender));
        }
      } else {
        console.warn("Unknown data type received:", data);
      }
    });

    droneInstance.on("close", () => {
      console.log("WebSocket connection closed.");
      setIsConnected(false);
    });

    return () => {
      droneInstance.close();
    };
  }, [user]);

  // Preload message history from Scaledrone REST API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!scaledroneChannel) return;
        const response = await fetch(
          `https://api.scaledrone.com/v3/${scaledroneChannel}/rooms/observable-room/messages?limit=20`,
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched history:", data); // Debug log
          const historyMessages = data.map((msg) => ({
            type: (msg.data && msg.data.type) || "message",
            text: (msg.data && msg.data.text) || JSON.stringify(msg.data),
            sender: (msg.data && msg.data.sender) || "Unknown",
            color: (msg.data && msg.data.color) || "#888",
            timestamp:
              (msg.data && msg.data.timestamp) ||
              new Date(msg.timestamp * 1000).toLocaleString(),
          }));
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error("Failed to fetch message history:", error);
      }
    };
    fetchHistory();
  }, [scaledroneChannel]);

  // Handler for username submit
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    const color = randomColor();
    setUser({
      id: uuidv4(),
      name: usernameInput.trim(),
      color,
    });
    setUserColor(color); // userColor now matches user.color
  };

  // Format time as "Today at HH:MM"
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `Today at ${hours}:${minutes}`;
  };

  // Restore missing handlers
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setEmojiPickerVisible(false);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    setIsTyping(true);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    if (drone && isConnected) {
      drone.publish({
        room: "observable-room",
        message: { type: "typing", sender: user?.name, isTyping: true },
      });
    }
    // Clear typing after 2 seconds of inactivity
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
      if (drone && isConnected) {
        drone.publish({
          room: "observable-room",
          message: { type: "typing", sender: user?.name, isTyping: false },
        });
      }
    }, 2000);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (drone && isConnected) {
      const currentTime = new Date();
      const messageToSend = {
        type: "message",
        text: message,
        sender: user.name,
        color: user.color,
        timestamp: formatTime(currentTime),
      };

      drone.publish({
        room: "observable-room",
        message: messageToSend,
      });

      setMessage("");
    }
  };

  if (!user) {
    return (
      <Paper
        elevation={4}
        className="chat-window"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Enter your username to join the chat:
        </Typography>
        <form
          onSubmit={handleUsernameSubmit}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <TextField
            label="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            variant="outlined"
            required
            autoFocus
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>
      </Paper>
    );
  }

  return (
    <Paper elevation={4} className="chat-window">
      <Box className="messages">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            if (!msg || !msg.sender || !msg.text) return null;
            return (
              <Box
                key={index}
                className={`message ${msg.sender === user?.name ? "own" : "other"}`}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  className="message-header"
                >
                  <Avatar
                    className="avatar"
                    style={{ backgroundColor: msg.color }}
                  >
                    {msg.sender[0]}
                  </Avatar>
                  <Typography
                    className="username"
                    variant="subtitle2"
                    style={{ color: msg.color }}
                  >
                    {msg.sender}
                  </Typography>
                  <Typography className="timestamp" variant="caption">
                    {msg.timestamp}
                  </Typography>
                </Stack>
                <Typography className="message-text" variant="body1">
                  {msg.text}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No messages yet
          </Typography>
        )}
        {typingUsers.filter((username) => username !== user?.name).length >
          0 && (
          <Typography variant="caption" className="typing-indicator">
            {typingUsers.slice(0, 3).join(", ")}{" "}
            {typingUsers.length <= 3
              ? typingUsers.length === 1
                ? "is typing..."
                : "are typing..."
              : "and more are typing..."}
          </Typography>
        )}
        {isTyping && (
          <Typography
            variant="caption"
            color="primary"
            style={{ marginLeft: 8 }}
          >
            You are typing...
          </Typography>
        )}
      </Box>
      <div style={{ position: "relative" }}>
        {isEmojiPickerVisible && (
          <Box
            className="emoji-picker"
            style={{
              position: "absolute",
              left: 0,
              bottom: "100%",
              zIndex: 20,
            }}
          >
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </Box>
        )}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          className="input-area"
        >
          <TextField
            fullWidth
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            size="small"
            onFocus={() => setHasInteracted(true)}
          />
          <Button
            variant="outlined"
            onClick={toggleEmojiPicker}
            className="emoji-button"
          >
            😊
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            className="send-button"
          >
            Send
          </Button>
        </Stack>
      </div>
    </Paper>
  );
};
export default Chat;
