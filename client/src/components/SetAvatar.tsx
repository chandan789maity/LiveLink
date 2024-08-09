import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

// Define types for user and avatar state
interface User {
  _id: string;
  isAvatarImageSet: boolean;
  avatarImage: string;
}

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>(undefined);

  // Define toast options with type ToastOptions
  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkLogin = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "")) {
        navigate("/login");
      }
    };
    checkLogin();
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      try {
        const storedData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "");
        if (storedData) {
          const user: User = JSON.parse(storedData);
          const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar],
          });

          if (data.isSet) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY || "", JSON.stringify(user));
            navigate("/");
          } else {
            toast.error("Error setting avatar. Please try again.", toastOptions);
          }
        }
      } catch (error) {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const data: string[] = [];
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          const buffer = Buffer.from(image.data);
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error loading avatars.", toastOptions);
      }
    };
    fetchAvatars();
  }, [api]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#131324] gap-12">
      {isLoading ? (
        <img src={loader} alt="loader" className="max-w-full" />
      ) : (
        <>
          <div className="text-center text-white text-2xl">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="flex gap-8">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`border-4 border-transparent p-2 rounded-full flex items-center justify-center transition-all ease-in-out ${
                  selectedAvatar === index ? "border-[#4e0eff]" : ""
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  className="h-24 transition-all ease-in-out"
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="bg-[#4e0eff] text-white py-4 px-8 rounded-md font-bold uppercase text-lg hover:bg-[#4e0eff]"
          >
            Set as Profile Picture
          </button>
          <ToastContainer />
        </>
      )}
    </div>
  );
}
