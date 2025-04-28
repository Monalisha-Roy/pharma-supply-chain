import { RiCloseFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../firebase.config";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

interface LoginProps {
  show: boolean;
  onClose: () => void;
  switchToSignUp: () => void; // Define the prop for switching to signup
  switchToForgotPassword: () => void; // Define the prop for switching to forgot password
}

const Login: React.FC<LoginProps> = ({
  show,
  onClose,
  switchToSignUp,
  switchToForgotPassword,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
      router.push("/verify");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again later."); // Fallback message
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      onClose();
      router.push("/verify");
      console.log("user signed in with Google: ", result.user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-50 z-50 ">
      <div className="relative w-11/12 sm:w-3/4 md:w-7/12 lg:w-4/12 h-auto py-10 rounded-lg bg-background border border-text flex items-center justify-center">
        <div className="flex justify-center items-center  w-full">
          <div className="flex flex-col w-full px-9 md:px-12 lg:px-16">
            <h1 className="text-white font-semibold text-2xl md:text-3xl mb-3">
              Login
            </h1>
            <div className="flex flex-col justify-center items-center gap-2">
              <form onSubmit={handleLogin} className="flex flex-col w-full">
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-text text-md mb-1"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-gray-200 text-sm mb-2 px-5 p-2 rounded-md border"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-text text-md mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-gray-200 text-sm mb-2 px-5 p-2 rounded-md border"
                    required
                  />
                  <div className="flex justify-end">
                    <a
                      onClick={switchToForgotPassword}
                      className="text-[#36defc] text-sm right-1 hover:cursor-pointer mb-1"
                    >
                      forgot password
                    </a>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    className="bg-[#82e3f2] hover:bg-[#2ebfd6] text-lg mt-1 p-2 px-6 rounded-md text-white w-full font-bold"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
              <div className="flex justify-center items-center w-full">
                <hr className="border border-text border-t-0 w-1/4 mr-1" />
                <p className="text-xs md:text-sm text-text">Or continue with</p>
                <hr className="border border-text border-t-0 w-1/4 ml-1" />
              </div>

              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-1 border border-background w-full p-2 text-lg rounded-md text-background bg-white"
              >
                Sign in with Google
                <FcGoogle
                  onClick={handleGoogleLogin}
                  size={20}
                  className="hover:cursor-pointer"
                />
              </button>

              <p className="text-sm text-text">
                Don&apos;t have an account?{" "}
                <a
                  onClick={switchToSignUp}
                  className="text-[#36defc] underline cursor-pointer"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
          <div className="absolute top-1 right-2 rounded-full">
            <button className="p-1 text-text" onClick={onClose} type="button">
              <RiCloseFill size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;