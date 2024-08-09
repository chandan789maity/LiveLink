import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import { recieveMessageRoute, sendMessageRoute } from "../utils/APIRoutes";

interface ChatContainerProps {
  currentChat: {
    _id: string;
    username: string;
    avatarImage: string;
  };
  socket: React.MutableRefObject<any>;
}

interface Message {
  fromSelf: boolean;
  message: string;
}

export default function ChatContainer({ currentChat, socket }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [arrivalMessage, setArrivalMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "") || "{}");
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };

    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "") || "{}")._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg: string) => {
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "") || "{}");
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg: string) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid grid-rows-[10%,80%,10%] gap-[0.1rem] overflow-hidden md:grid-rows-[15%,70%,15%]">
      <div className="flex justify-between items-center px-8">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
              className="h-12"
            />
          </div>
          <div className="username">
            <h3 className="text-white">{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages p-4 flex flex-col gap-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-thumb-rounded">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()} className={`message flex items-center ${message.fromSelf ? "justify-end" : "justify-start"}`}>
            <div className={`content max-w-[40%] break-words p-4 text-lg rounded-lg text-gray-300 ${message.fromSelf ? "bg-indigo-900 bg-opacity-30" : "bg-purple-700 bg-opacity-30"}`}>
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
