import { useState, useEffect } from "react";
import Robot from "../assets/robot.gif";

// Define a type for the user data stored in local storage
interface User {
  username: string;
}

export default function Welcome() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserName = async () => {
      const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "");
      if (userData) {
        const user: User = JSON.parse(userData);
        setUserName(user.username);
      }
    };
    fetchUserName();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-white text-center">
      <img src={Robot} alt="Robot" className="h-80" />
      <h1 className="text-2xl mt-4">
        Welcome, <span className="text-[#4e0eff]">{userName}!</span>
      </h1>
      <h3 className="text-lg mt-2">Please select a chat to Start messaging.</h3>
    </div>
  );
}
