import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

// Define types for the state
interface User {
  _id: string;
  username: string;
  isAvatarImageSet: boolean;
  avatarImage: string;
}

interface Contact {
  _id: string;
  username: string;
  avatarImage: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef<Socket | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentChat, setCurrentChat] = useState<Contact | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "");
      if (!userData) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get<Contact[]>(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat: Contact) => {
    setCurrentChat(chat);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#131324]">
      <div className="h-[85vh] w-[85vw] bg-[#00000076] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </div>
  );
}
