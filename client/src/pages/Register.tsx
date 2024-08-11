import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // TypeScript type for ToastOptions
  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY || "")) {
      // navigate to the page
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = (): boolean => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be the same.", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be 8 characters or longer.", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        if (!data.status) {
          toast.error(data.msg, toastOptions);
        } else {
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
      <div className="flex flex-col items-center justify-center h-screen bg-[#131324]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-[#00000076] p-12 rounded-2xl">
          <div className="flex items-center gap-4 justify-center">
            <img src={Logo} alt="logo" className="h-20" />
            <h1 className="text-white text-2xl uppercase">snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="bg-transparent p-4 border border-[#4e0eff] rounded-md text-white focus:border-[#997af0] outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            className="bg-transparent p-4 border border-[#4e0eff] rounded-md text-white focus:border-[#997af0] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            className="bg-transparent p-4 border border-[#4e0eff] rounded-md text-white focus:border-[#997af0] outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            className="bg-transparent p-4 border border-[#4e0eff] rounded-md text-white focus:border-[#997af0] outline-none"
          />
          <button type="submit" className="bg-[#4e0eff] text-white p-4 rounded-md font-bold uppercase hover:bg-[#4e0eff]">
            Create User
          </button>
          <span className="text-white text-uppercase">
            Already have an account? <Link to="/login" className="text-[#4e0eff] font-bold">Login.</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
