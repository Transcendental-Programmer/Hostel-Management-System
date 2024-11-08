import { useNavigate, Link } from "react-router-dom";
import { Roles } from "../constants";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaBuilding,
  FaDoorClosed,
  FaLock,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(Roles.STUDENT);
  const [hostel_number, setHostelNumber] = useState("");
  const [roll_number, setRoll_number] = useState("");
  const [room, setRoom] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ROLE_PATHS = {
    STAFF: "/staff-dashboard",
    STUDENT: "/student-home",
    WARDEN: "/warden-dashboard",
    ADMIN: "/warden-dashboard"
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const userRole = localStorage.getItem("user_role");

    if (token && userRole) {
      const roleKey = userRole.toUpperCase();
      const path = ROLE_PATHS[roleKey];
      if (path) {
        navigate(path);
      }
      else {
        // Default path if role does not match
        navigate("/");
      }
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const iiitmEmailRegex = /^[^\s@]+@iiitm\.ac\.in$/;
    return iiitmEmailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Updated password validation function
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value)
          ? ""
          : "Please enter a valid @iiitm.ac.in email address",
      }));
    } else if (field === "phone") {
      setPhone(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: validatePhone(value)
          ? ""
          : "Please enter a valid 10-digit phone number",
      }));
    } else if (field === "password") {
      setPassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters, with uppercase, lowercase, a digit, and a special character",
      }));
    } else if (field === "username") {
      setUsername(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "",
      }));
    }
  };

  const allowedEmails = ['imt_2022089@iiitm.ac.in', 'imt_2022014@iiittm.ac.in',"anjali@iiitm.ac.in","pinkuranjan@iiitm.ac.in","kapil@iiitm.ac.in"];
  

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Use state values directly
    // const role = role;    // Already stored in state
    // const email = email;  // Already stored in state
  
    if (role === Roles.WARDEN && !allowedEmails.includes(email)) {
      toast.error("Only specific emails are allowed for the warden role.");
      return;
    }
  
    try {
      if (!validateEmail(email)) {
        toast.error("Email must be a valid @iiitm.ac.in address");
        return;
      }
  
      if (!validatePhone(phone)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }
  
      if (!validatePassword(password)) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
  
      if (!fullname.trim()) {
        toast.error("Full name is required");
        return;
      }
  
      if (!hostel_number.trim()) {
        toast.error("Hostel field is required");
        return;
      }
  
      if (role === Roles.STUDENT) {
        if (!roll_number.trim()) {
          toast.error("Roll number is required for students");
          return;
        }
        if (!room.trim()) {
          toast.error("Room number is required for students");
          return;
        }
      }
  
      let body;
      if (role === Roles.WARDEN) {
        body = {
          full_name: fullname,
          email,
          username,
          password,
          phone_number: phone,
          role: role,
          hostel_number,
        };
      } else {
        body = {
          full_name: fullname,
          email,
          username,
          password,
          phone_number: phone,
          role: role,
          hostel_number,
          roll_number,
          room_number: room,
        };
      }
  
      const response = await fetch("https://hostelmate-backend-5zcj.onrender.com/users/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (response && response.ok) {
        toast.success("OTP sent successfully! Please verify your email.");
        navigate("/verify-otp", {
          state: { email: email, password: password },
        });
      } else {
        console.log(response);
        toast.error(data);
        console.error(data);
      }
    } catch (err) {
      toast.error("Registration failed. Please try again.");
      console.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  


  return (
    <>
      <div className="flex md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)] bg-custom-gradient items-center justify-center text-gray-600">
        <div className="relative my-5">
          <div className="h-full relative flex flex-col sm:w-full md:w-[30rem] lg:w-[30rem] xl:w-[30rem] 2xl:w-[30rem] rounded-lg border-gray-400 bg-indigo-200 shadow-lg px-4">
            <div className="flex-auto h-full p-4">
              <div className="mb-3 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                <a
                  href="#"
                  className="flex cursor-pointer items-center gap-2 text-indigo-500 no-underline hover:text-indigo-500"
                >
                  <span className="flex-shrink-0 text-3xl font-black tracking-tight opacity-100">
                    Signup
                  </span>
                </a>
              </div>

              <h4 className="mb-1 font-medium text-gray-700 xl:text-xl">
                Welcome!
              </h4>
              <p className="mb-3 text-gray-500">
                Please fill in your details to create an account
              </p>

              <form className="mb-4" action="#" method="POST">
                <div className="mb-1">
                  <div className="flex justify-between">
                    <label
                      className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                      htmlFor="fullname"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative flex w-full flex-wrap items-stretch">
                    <FaUser className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="text"
                      className="relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 pl-10 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                      name="full-name"
                      placeholder="Enter your full name"
                      onChange={(e) => setFullname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="email"
                      className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                    >
                      Email
                    </label>
                    <div className="relative flex w-full items-stretch">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                      <input
                        type="text"
                        className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 pl-10 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                        id="email"
                        name="email-username"
                        placeholder="Enter your email"
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="phone"
                      className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="relative flex w-full items-stretch">
                      <FaPhone className="absolute left-3 top-3 text-gray-500" />
                      <input
                        type="text"
                        className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 pl-10 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                        name="phone"
                        placeholder="Enter your phone number"
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    {errors.phone && (
                      <span className="text-xs text-red-500">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional fields with icons for Username, Roll No, Hostel Number, Room, Password */}
                <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className={role === Roles.STUDENT ? "flex-1" : "w-full"}>
                    <label
                      htmlFor="username"
                      className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                    >
                      Username
                    </label>
                    <div className="relative flex w-full items-stretch">
                      <FaUserTie className="absolute left-3 top-3 text-gray-500" />
                      <input
                        type="text"
                        className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 pl-10 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                      />
                    </div>
                    {errors.username && (
                      <span className="text-xs text-red-500">
                        {errors.username}
                      </span>
                    )}
                  </div>

                  {role === Roles.STUDENT && (
                    <div className="flex-1">
                      <label
                        htmlFor="roll_number"
                        className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                      >
                        Roll no.
                      </label>
                      <div className="relative flex w-full items-stretch">
                        <FaBuilding className="absolute left-3 top-3 text-gray-500" />
                        <input
                          type="text"
                          className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 pl-10 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                          name="roll_number"
                          placeholder="Enter your roll no."
                          onChange={(e) => setRoll_number(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Hostel number and Room */}
                <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="hostel_number"
                      className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                    >
                      Hostel Number
                    </label>
                    <div className="relative flex w-full items-stretch">
                      <FaBuilding className="absolute left-3 top-3 text-gray-500" />
                      <input
                        type="text"
                        className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 pl-10 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                        id="hostel_number"
                        name="hostel_number"
                        placeholder="Enter your hostel"
                        onChange={(e) => setHostelNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  {role !== Roles.WARDEN && (
                    <div className="flex-1">
                      <label
                        htmlFor="room"
                        className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                      >
                        Room
                      </label>
                      <div className="relative flex w-full items-stretch">
                        <FaDoorClosed className="absolute left-3 top-3 text-gray-500" />
                        <input
                          type="text"
                          className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 pl-10 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                          name="room"
                          placeholder="Enter your Room"
                          onChange={(e) => setRoom(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Password field */}
                <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="password"
                      className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative flex w-full items-stretch">
                      <FaLock className="absolute left-3 top-3 text-gray-500" />
                      <input
                        type="password"
                        id="password"
                        className="relative block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 pl-10 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                        name="password"
                        placeholder="············"
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                    </div>
                    {errors.password && (
                      <span className="text-xs text-red-500">
                        {errors.password}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="role"
                      className="mb-1 inline-block text-xs font-medium uppercase text-gray-700"
                    >
                      Role
                    </label>
                    <div className="flex gap-x-3 w-fit pl-2 pr-2 bg-slate-100 rounded-md text-sm">
                      <button
                        type="button"
                        onClick={() => setRole(Roles.WARDEN)}
                        className={`rounded-md p-2 my-1 transition-all text-black ${role === Roles.WARDEN && " bg-indigo-500 text-white"
                          }`}
                      >
                        Warden
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole(Roles.STUDENT)}
                        className={`rounded-md p-2 my-1 transition-all text-black ${role === Roles.STUDENT && "bg-indigo-500 text-white"
                          }`}
                      >
                        Student
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <button
                    className="grid w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none"
                    type="submit"
                    onClick={onSubmit}
                  >
                    Sign up
                  </button>
                </div>
              </form>

              <p className="mb-4 text-center">
                Already have an account?
                <Link
                  to="/login"
                  className="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500"
                >
                  {" "}
                  Login{" "}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
