import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

interface FormValues {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({ username: "", password: "" });
  
  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = (): boolean => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, { username, password });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        } else if (data.status === true) {
          localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY || "", JSON.stringify(data.user));
          navigate("/");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.", toastOptions);
      }
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#131324]">
        <div className="flex flex-col items-center bg-[#00000076] p-10 rounded-3xl shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <img src={Logo} alt="logo" className="h-20" />
            <h1 className="text-white text-2xl font-semibold uppercase">Snappy</h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              className="bg-transparent p-3 border border-[#4e0eff] rounded-lg text-white"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              className="bg-transparent p-3 border border-[#4e0eff] rounded-lg text-white"
            />
            <button
              type="submit"
              className="bg-[#4e0eff] text-white py-3 rounded-lg font-semibold uppercase hover:bg-[#3a3f9a]"
            >
              Log In
            </button>
            <span className="text-white text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#4e0eff] font-bold">
                Create One.
              </Link>
            </span>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
