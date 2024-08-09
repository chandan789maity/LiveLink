
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

// Define the type for the local storage data
interface UserData {
  _id: string;
}

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const storedData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "");
      if (storedData) {
        const { _id }: UserData = JSON.parse(storedData);
        const response = await axios.get(`${logoutRoute}/${_id}`);
        if (response.status === 200) {
          localStorage.clear();
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex justify-center items-center p-2 rounded-md bg-[#9a86f3] border-none cursor-pointer"
    >
      <BiPowerOff className="text-[#ebe7ff] text-xl" />
    </button>
  );
}
