import { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { sendPasswordResetEmail } from "firebase/auth"; // Import Firebase password reset function
import { auth } from "../../../firebase.config";

interface ForgotPasswordProps {
  show: boolean;
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email); // Firebase function to send password reset email
      setMessage("Password reset email sent. Check your inbox.");
      // Close the component after sending email successfully
      onClose();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-background bg-opacity-50 z-50 ${show ? "" : "hidden"}`}>
      <div className="relative w-3/4 md:w-5/12 lg:w-4/12 h-auto py-10 rounded-lg bg-background border border-text flex items-center justify-center">
      <div className="flex flex-col justify-center items-center px-9 md:px-12 lg:px-16">
            <h1 className="text-text font-semibold text-2xl lg:text-3xl pb-3">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center text-gray-500">
              <label htmlFor="email" className="text-text  text-sm">
                Please enter your registered email to recover your password. A mail will be sent to your email with a link to reset your password.
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="text-gray-500 text-sm mb-2 mt-3 px-5 p-2 rounded-md border border-gray-300 w-full"
                required
              />
              <button
                  className="bg-secondary hover:bg-primary mt-1 p-2 text-lg px-6 rounded-md text-white w-44"
                  type="submit"
                >
                  Submit
                </button>
              {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
            </form>
          </div>
          <div className="absolute top-1 right-2 rounded-full">
            <button className="p-1 text-text" onClick={onClose} type="button">
              <RiCloseFill size={24} />
            </button>
          </div>
      </div>
    </div>
  );
};

export default ForgotPassword;