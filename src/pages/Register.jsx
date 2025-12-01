import { Link2, Mail, User, Lock} from "lucide-react";
import React, { useState } from "react";
import InputField from "../components/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../utils/schemaRegister";
import GoogleIcon from "../assets/images/google.svg"

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

  return (
    <main className="min-h-screen flex justify-center items-center my-6">
      <section className="flex flex-col items-center">
        <div className="flex items-center justify-center gap-2">
          <Link2 className="text-blue-400" />
          <h3 className="font-normal text-xl">Koda Shortlink</h3>
        </div>
        <div className="text-center">
          <h3 className="font-normal text-2xl mt-6">Create Account</h3>
        </div>
        <div className="text-center">
          <p className="font-normal text-sm text-[#4A5565]">
            Start shortening links and tracking analytics
          </p>
        </div>

        <div className="w-md bg-white mt-5 max-h-[679px] px-6 border border-gray-300 rounded-2xl">
          <form className="flex flex-col gap-4 my-7">
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
                  className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
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
                <img src={GoogleIcon} alt="google-icon" />
                Continue with Google
              </button>
            </div>
          </form>
        </div>
        <p className="text-sm text-gray-500 text-center mt-3">Already have an account? <span className="text-blue-600">Sign in</span></p>
      </section>
    </main>
  );
};

export default Register;
