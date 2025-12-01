import { Link2, Mail, Lock } from "lucide-react";
import React, { useState, useEffect } from "react";
import InputField from "../components/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../utils/schemaLogin";
import GoogleIcon from "../assets/images/google.svg";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState({
    type: "success",
    message: "",
  });

  const closeAlert = () => setAlert({ ...alert, message: "" });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8082/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setAlert({
          type: "error",
          message: result.message || "Login gagal",
        });
        return;
      }

      setAlert({
        type: "success",
        message: "Login berhasil!",
      });

      localStorage.setItem("token", result.data.token);

      setTimeout(() => {
        navigate("/settings"); 
      }, 800);

      reset();

    } catch (error) {
      setAlert({
        type: "error",
        message: "Terjadi kesalahan server",
      });
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center my-6 px-4 sm:px-6">
      <Alert
        type={alert.type}
        message={alert.message}
        duration={3000}
        onClose={closeAlert}
      />

      <section className="flex flex-col items-center w-full max-w-md">
        <div className="flex items-center justify-center gap-2">
          <Link2 className="text-blue-400" />
          <h3 className="font-normal text-xl">Koda Shortlink</h3>
        </div>

        <div className="text-center">
          <h3 className="font-normal text-xl sm:text-2xl mt-6">Welcome Back</h3>
        </div>

        <div className="text-center">
          <p className="font-normal text-sm text-[#4A5565]">
            Sign in to your account to continue
          </p>
        </div>

        <div className="w-full bg-white mt-5 max-h-full sm:max-h-[679px] px-4 sm:px-6 border border-gray-300 rounded-2xl">
          <form className="flex flex-col gap-4 my-7" onSubmit={handleSubmit(onSubmit)}>

            <InputField
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter Your Email"
              register={register}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
            />

            <InputField
              type="password"
              name="password"
              label="Password"
              placeholder="Enter Your Password"
              register={register}
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              icon={<Lock className="w-5 h-5" />}
            />

            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer flex shrink-0"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                  and
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <div className="relative flex items-center">
                <div className="grow border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">Or</span>
                <div className="grow border-t border-gray-300"></div>
              </div>

              <button
                type="button"
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <img src={GoogleIcon} alt="google-icon" className="w-5 h-5" />
                Continue with Google
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm text-gray-500 text-center mt-3">
          Don't have an account?
          <Link
            to={"/register"}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
