import { RiCloseFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../firebase.config";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

interface SignupProps {
  show: boolean;
  onClose: () => void;
  switchToLogin : () => void;
}

const Signup: React.FC<SignupProps> = ({ show, onClose, switchToLogin  }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
      router.push("/homepage");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again later."); // Fallback message
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      onClose();
      router.push("/homepage");
      console.log("user signed in with Google: ", result.user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleTwitterLogin = async () => {
    const provider = new TwitterAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      onClose();
      router.push("/homepage");
      console.log("user signed in with Twitter: ", result.user);
    } catch (error) {
      console.error("Error signing in with Twitter: ", error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-50 z-50 ">
      <div className="relative sm:w-3/4 md:w-7/12 lg:w-4/12 h-auto py-6 md:py-8 lg:py-10 rounded-lg bg-background border border-text flex items-center justify-center">
        <div className="flex justify-center items-center  w-full">
          <div className="flex flex-col w-full px-9 md:px-12 lg:px-16">
            <h1 className="text-text font-semibold text-2xl md:text-3xl mb-3">
              Sign Up
            </h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col justify-center items-center gap-2">
              <form className="flex flex-col w-full" onSubmit={handleSignup}>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-text text-md mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-gray-500 text-sm mb-2 px-5 p-2 rounded-md border"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-text text-md mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-gray-500 text-sm mb-2 px-5 p-2 rounded-md border"
                    required
                  />
                </div>
                
                <div className="flex justify-center">
                  <button
                    className="bg-secondary text-lg hover:bg-primary mt-3 p-2 px-6 rounded-md text-white w-full"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <div className="flex justify-center items-center w-full">
                <hr className="border border-text border-t-0 w-1/4 mr-1" />
                <p className="text-xs md:text-sm text-text">Or continue with</p>
                <hr className="border border-text border-t-0 w-1/4 ml-1" />
              </div>

              <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-1 border border-background w-full text-lg p-2 rounded-md text-background bg-white">
                Sign in with Google<FcGoogle size={20} className="hover:cursor-pointer" />
              </button>
              <p className="text-sm text-text">Already have an account? <a onClick={switchToLogin} className="text-accent underline hover:cursor-pointer">Login</a></p>
            </div>
          </div>
          <div className="">
            {/* <Image
              src={"/loginPic.png"}
              alt={"anime image"}
              width={200}
              height={400}
            /> */}
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

export default Signup;