import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker, { EmojiClickData } from "emoji-picker-react";

// Define the props type
interface ChatInputProps {
  handleSendMsg: (msg: string) => void;
}

export default function ChatInput({ handleSendMsg }: ChatInputProps) {
  const [msg, setMsg] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="grid grid-cols-[5%,95%] items-center bg-[#080420] px-8 py-2 md:px-4 md:gap-4">
      <div className="flex items-center text-white gap-4">
        <div className="relative">
          <BsEmojiSmileFill
            onClick={handleEmojiPickerhideShow}
            className="text-yellow-300 text-2xl cursor-pointer"
          />
          {showEmojiPicker && (
            <div className="absolute top-[-350px] bg-[#080420] shadow-lg border border-[#9a86f3] z-10">
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form
        className="flex items-center gap-8 bg-[#ffffff34] rounded-full p-2"
        onSubmit={sendChat}
      >
        <input
          type="text"
          placeholder="type your message here"
          className="w-full bg-transparent text-white border-none outline-none pl-4 text-lg placeholder-gray-400"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[#9a86f3] p-3 rounded-full flex justify-center items-center text-white text-2xl"
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}
