import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password };
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);

      if (data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_role", data.role);
        toast.success(`Welcome back, ${data.user.full_name}!`);
        navigate("/");
      } else {
        toast.error(
          "Invalid credentials. Please check your email and password."
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <div className="flex md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)] bg-custom-gradient items-center justify-center text-gray-600">
        <div className="relative">
          <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-indigo-200 shadow-lg px-4">
            <div className="flex-auto p-6">
              <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                <a
                  href="#"
                  className="flex cursor-pointer items-center gap-2 text-indigo-500 no-underline hover:text-indigo-500"
                >
                  <span className="flex-shrink-0 text-3xl font-black tracking-tight opacity-100">
                    Login
                  </span>
                </a>
              </div>
              <h4 className="mb-2 font-medium text-gray-800 xl:text-xl">
                Welcome!
              </h4>
              <p className="mb-6 text-gray-500">
                Please sign-in to access your account
              </p>
              <form className="mb-4" onSubmit={onSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                  >
                    Email{" "}
                  </label>
                  <div className="flex items-center border border-gray-400 rounded-md p-2 bg-gray-50">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      className="w-full bg-transparent outline-none text-gray-700"
                      id="email"
                      name="email-username"
                      placeholder="Enter your email"
                      autoFocus=""
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <label
                      className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                      htmlFor="password"
                    >
                      Password
                    </label>
                  </div>
                  <div className="flex items-center border border-gray-400 rounded-md p-2 bg-gray-50">
                    <FaLock className="text-gray-500 mr-2" />
                    <input
                      type="password"
                      id="password"
                      className="w-full bg-transparent outline-none text-gray-700"
                      name="password"
                      placeholder="············"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <button
                    className="grid w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <p className="mb-4 text-center">
                Don't have an account yet?
                <Link
                  to="/signup"
                  className="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500"
                >
                  {" "}
                  Create an account{" "}
                </Link>
              </p>
              <p className="text-center mt-2">
                <Link
                  to="/forgot-password"
                  className="text-indigo-500 hover:text-indigo-500"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
