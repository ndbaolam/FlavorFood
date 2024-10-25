import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { ReactNode, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface CardProps {
  children?: ReactNode;
}

const CardSignIn: React.FC<CardProps> = ({ children }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add sign-in logic here
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center overflow-hidden inset-0 h-screen">
      <Card className="bg-gray-100 w-fit max-w-[48rem] flex-row justify-center z-20">
        <CardHeader
          shadow={false}
          floated={false}
          className="m-0 shrink-0 rounded-r-none w-fit"
        >
          <img
            src="https://www.elle.vn/wp-content/uploads/2017/09/21/JW-Marriott-Hanoi4.jpg"
            alt="signin-image"
            className="sm:block hidden rounded-l-2xl h-full w-full"
          />
        </CardHeader>
        {children}
        <CardBody className="flex justify-center items-center">
          <Card className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg">
            <Typography
              variant="h4"
              color="blue-gray"
              className="text-center mb-6"
            >
              Sign In
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input type="text" label="Name" size="lg" required />
              </div>
              <div className="relative mb-6">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  size="lg"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="gray"
                    className="bi bi-eye cursor-pointer"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                  </svg>
                </button>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400" />
              <p className="text-center text-sm">OR</p>
              <hr className="border-gray-400" />
            </div>
            <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm">
              <img
                className="w-6 h-6 mr-2"
                src="./google.png"
                alt="Google logo"
              />
              Sign in with Google
            </button>
            <Typography className="text-black">
              Don't have an account?{" "}
              <Link className="text-blue-500 hover:underline" to="/sign-up">
                Sign Up
              </Link>
            </Typography>
          </Card>
        </CardBody>
      </Card>
      <div className="absolute inset-0 w-screen h-screen overflow-hidden">
        <img
          src="./bg.jpg"
          className="object-cover w-full h-full blur-sm"
          alt="Background"
        />
      </div>
    </div>
  );
};

export default CardSignIn;
