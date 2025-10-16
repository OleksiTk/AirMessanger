import React, { useEffect, useState, useRef } from "react";
import "../style/pages/chat.css";
import { useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";

interface Message {
  id: number;
  text: string;
  from: string | null;
  time: string;
  isRead?: boolean;
}

let socket: Socket;

const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    console.log("🔌 Socket created");
  }
  return socket;
};

function ChatPage() {
  const currentSocket = getSocket();
  const navigate = useNavigate();
  const [addNewMessage, setAddNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState<string | null>("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоскрол до нових повідомлень
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessage = async () => {
    try {
      const response = await fetch("http://localhost:3000/create/chat/1", {
        method: "GET",
      });

      if (!response.ok) {
        console.error("❌ Failed to fetch messages");
        return;
      }

      const result = await response.json();

      const messagingFetch = result.map((element: any) => ({
        id: element.id_chat,
        from: element.username,
        text: element.content,
        time: new Date(element.createdAt).toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isRead: true,
      }));

      setMessages(messagingFetch);
      console.log("📥 Messages loaded:", messagingFetch.length);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };

  useEffect(() => {
    // Завантажуємо username
    const userAccount = localStorage.getItem("user");
    setUserName(userAccount);
    console.log("👤 Username:", userAccount);

    // Завантажуємо повідомлення
    fetchMessage();

    // ✅ Socket.IO listeners
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("❌ Disconnected from server:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setIsConnected(false);
    });

    // ✅ Отримуємо нові повідомлення
    socket.on("receive_message", (message: Message) => {
      console.log("📨 New message received:", message);
      setMessages((prev) => {
        // Перевіряємо чи повідомлення вже є
        if (prev.some((msg) => msg.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    // ✅ Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("receive_message");
    };
  }, []);

  const CreateNewMessage = async () => {
    if (addNewMessage.trim() === "" || !userName) {
      console.warn("⚠️ Message or username is empty");
      return;
    }

    const data = {
      content: addNewMessage,
      username: userName,
    };

    try {
      console.log("📤 Sending message:", data);

      // ✅ Відправляємо через Socket.IO
      currentSocket.emit("send_message", data);

      // Очищуємо інпут одразу
      setAddNewMessage("");

      // ❌ НЕ додаємо повідомлення в стейт тут!
      // Воно прийде через socket.on("receive_message")
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      CreateNewMessage();
    }
  };

  return (
    <div className="chat">
      <div className="container">
        <header className="header-chat">
          <div className="header-chat__arrow" onClick={() => navigate(-1)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.28809 12L14.2981 18.01L15.7121 16.596L11.1121 11.996L15.7121 7.39599L14.2981 5.98999L8.28809 12Z"
                fill="#F7F7FC"
              />
            </svg>
          </div>
          <div className="header-chat__name">
            Athalia Putri
            {/* Індикатор підключення */}
            <span
              style={{
                marginLeft: "10px",
                fontSize: "10px",
                color: isConnected ? "#25d366" : "#e74c3c",
              }}
            >
              {isConnected ? "🟢 Online" : "🔴 Offline"}
            </span>
          </div>
          <div className="header-chat__settings">
            <div className="header__settings-search">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.677 19.607L12.962 13.891C10.4196 15.6984 6.91642 15.2563 4.90285 12.8739C2.88929 10.4915 3.03714 6.96358 5.24298 4.75799C7.44824 2.55144 10.9765 2.40295 13.3594 4.4164C15.7422 6.42986 16.1846 9.93344 14.377 12.476L20.092 18.192L18.678 19.606L18.677 19.607ZM9.48498 4.99997C7.58868 4.99955 5.95267 6.33066 5.56745 8.18742C5.18224 10.0442 6.15369 11.9163 7.89366 12.6702C9.63362 13.4242 11.6639 12.8528 12.7552 11.302C13.8466 9.75126 13.699 7.64731 12.402 6.26399L13.007 6.86399L12.325 6.18399L12.313 6.17199C11.5648 5.41917 10.5464 4.99712 9.48498 4.99997Z"
                  fill="#F7F7FC"
                />
              </svg>
            </div>
            <div className="header__settings-menu">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 18H3V16H21V18ZM21 13H3V11H21V13ZM21 8H3V6H21V8Z"
                  fill="#F7F7FC"
                />
              </svg>
            </div>
          </div>
        </header>
        <main className="main-chats">
          <div className="main-chats__chat">
            {messages.map((message) =>
              message.from === userName ? (
                <div className="main-chats__chat-you" key={message.id}>
                  <div className="chat-you">
                    <div className="chat-you__message">{message.text}</div>
                    <div className="chat-you__message-time">
                      {message.time} · {message.isRead ? "Read" : "Sent"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="main-chats__chat-friends" key={message.id}>
                  <div className="chat-friends">
                    <div className="chat-friends__message">{message.text}</div>
                    <div className="chat-friends__message-time">
                      {message.time} · {message.isRead ? "Read" : "Sent"}
                    </div>
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        <footer className="footer">
          <div className="footer__container">
            <div className="footer__plus-add-file">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 8V14H6V8H0V6H6V0H8V6H14V8H8Z" fill="#ADB5BD" />
              </svg>
            </div>
            <div className="footer__input">
              <input
                type="text"
                className="footer__input-text"
                value={addNewMessage}
                onChange={(e) => setAddNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={!isConnected}
              />
            </div>
            <div
              className="footer__send"
              onClick={CreateNewMessage}
              style={{ opacity: isConnected ? 1 : 0.5 }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.7825 0.21751C17.6813 0.116765 17.5534 0.0470131 17.4139 0.0164552C17.2744 -0.0141027 17.1291 -0.0041961 16.995 0.0450103L0.495001 6.04501C0.352702 6.09898 0.230191 6.19497 0.143739 6.32023C0.0572872 6.44548 0.0109863 6.59407 0.0109863 6.74626C0.0109863 6.89845 0.0572872 7.04704 0.143739 7.17229C0.230191 7.29755 0.352702 7.39354 0.495001 7.44751L6.9375 10.02L11.6925 5.25001L12.75 6.30751L7.9725 11.085L10.5525 17.5275C10.6081 17.6671 10.7043 17.7867 10.8286 17.8709C10.953 17.9552 11.0998 18.0002 11.25 18C11.4016 17.9969 11.5486 17.9479 11.6718 17.8596C11.795 17.7712 11.8885 17.6476 11.94 17.505L17.94 1.00501C17.9911 0.872318 18.0034 0.727833 17.9755 0.588403C17.9477 0.448973 17.8807 0.320343 17.7825 0.21751Z"
                  fill="#375FFF"
                />
              </svg>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ChatPage;
