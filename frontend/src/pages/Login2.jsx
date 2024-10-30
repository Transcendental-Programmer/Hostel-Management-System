import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login2() {
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
      const data = await response.json();
      if (data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken);
        navigate("/");
      } else {
        toast.error("Invalid credentials. Please check your email and password.");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-screen items-center justify-center text-gray-600 bg-gray-50">
        <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white shadow-lg px-4">
          <div className="flex-auto p-6">
            <div className="mb-10 flex items-center justify-center">
              <a href="#" className="text-indigo-500 no-underline hover:text-indigo-500">
                <span className="text-3xl font-black">Login.</span>
              </a>
            </div>
            <h4 className="mb-2 font-medium text-gray-700 xl:text-xl">Welcome!</h4>
            <p className="mb-6 text-gray-500">Please sign-in to access your account</p>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="text-xs font-medium uppercase text-gray-700">Email</label>
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-400 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                  id="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="text-xs font-medium uppercase text-gray-700" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="block w-full rounded-md border-gray-400 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                  placeholder="············"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <button type="submit" className="w-full rounded-md bg-indigo-500 py-2 px-5 text-sm text-white shadow hover:bg-indigo-600 focus:bg-indigo-600">
                  Sign in
                </button>
              </div>
            </form>
            <p className="text-center">
              Don't have an account yet?
              <Link to="/signup" className="text-indigo-500 hover:text-indigo-500"> Create an account </Link>
            </p>
            <p className="text-center mt-2">
              <Link to="/forgot-password" className="text-indigo-500 hover:text-indigo-500">Forgot Password?</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login2;
