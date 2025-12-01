import { Link2, Mail, User, Lock} from "lucide-react";
import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../utils/schemaRegister";
import GoogleIcon from "../assets/images/google.svg"
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8082/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAlertType("error");
        setAlertMessage(result.message || "Registration failed");
        return;
      }

      setAlertType("success");
      setAlertMessage("Account created successfully!");
      reset();
       setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Server error, try again later.");
    }
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);


  return (
    <main className="min-h-screen flex justify-center items-center my-6 px-4 sm:px-6">
       <Alert
        type={alertType}
        message={alertMessage}
        duration={4000}
        onClose={() => setAlertMessage("")}
      />
      <section className="flex flex-col items-center w-full max-w-md">
        <div className="flex items-center justify-center gap-2">
          <Link2 className="text-blue-400" />
          <h3 className="font-normal text-xl">Koda Shortlink</h3>
        </div>
        <div className="text-center">
          <h3 className="font-normal text-xl sm:text-2xl mt-6">Create Account</h3>
        </div>
        <div className="text-center">
          <p className="font-normal text-sm text-[#4A5565]">
            Start shortening links and tracking analytics
          </p>
        </div>

        <div className="w-full bg-white mt-5 max-h-full sm:max-h-[679px] px-4 sm:px-6 border border-gray-300 rounded-2xl">
          <form className="flex flex-col gap-4 my-7" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              type="text"
              name="fullName"
              label="Full Name"
              placeholder="Enter Your Full Name"
              register={register}
              error={errors.fullName}
              icon={<User className="w-5 h-5" />}
            />

            <InputField
              type="email"
              name="email"
              label="Email"
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

            <InputField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Enter Your Password Again"
              register={register}
              error={errors.confirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
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
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Create Account
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
        <p className="text-sm text-gray-500 text-center mt-3">Already have an account? <Link to={"/login"} className="text-blue-600 cursor-pointer hover:underline">Sign in</Link></p>
      </section>
    </main>
  );
};

export default Register;