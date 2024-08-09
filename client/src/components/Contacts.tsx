import { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";

// Define types for props
interface Contact {
  _id: string;
  avatarImage: string;
  username: string;
}

interface ContactsProps {
  contacts: Contact[];
  changeChat: (contact: Contact) => void;
}

export default function Contacts({ contacts, changeChat }: ContactsProps) {
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);
  const [currentUserImage, setCurrentUserImage] = useState<string | undefined>(undefined);
  const [currentSelected, setCurrentSelected] = useState<number | undefined>(undefined);

  useEffect(() => {
    const data = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "");
    if (data) {
      const parsedData = JSON.parse(data);
      setCurrentUserName(parsedData.username);
      setCurrentUserImage(parsedData.avatarImage);
    }
  }, []);

  const changeCurrentChat = (index: number, contact: Contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && (
        <div className="grid grid-rows-[10%,75%,15%] overflow-hidden bg-[#080420] h-full">
          <div className="flex items-center justify-center gap-4 bg-[#080420] py-2">
            <img src={Logo} alt="logo" className="h-8" />
            <h3 className="text-white uppercase">snappy</h3>
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2 p-4">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-colors duration-300 ${
                  index === currentSelected ? "bg-[#9a86f3]" : "bg-[#ffffff34]"
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <img
                  src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                  alt={contact.username}
                  className="h-12 w-12 rounded-full"
                />
                <h3 className="text-white">{contact.username}</h3>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-8 bg-[#0d0d30] p-4">
            <img
              src={`data:image/svg+xml;base64,${currentUserImage}`}
              alt="avatar"
              className="h-16 w-16 rounded-full"
            />
            <h2 className="text-white text-xl">{currentUserName}</h2>
          </div>
        </div>
      )}
    </>
  );
}
