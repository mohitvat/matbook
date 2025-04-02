// app/components/Login.jsx
"use client";
import React, { useState , useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVtYJwSs2PfrX7MsfjCyPno8fcLgj5sk0",
  authDomain: "matbook-ba238.firebaseapp.com",
  projectId: "matbook-ba238",
  storageBucket: "matbook-ba238.firebasestorage.app",
  messagingSenderId: "760749411223",
  appId: "1:760749411223:web:83f83f7dee7e76d41252d2",
  measurementId: "G-F40Z9HC6P0",
};


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [googleProvider, setGoogleProvider] = useState(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const authInstance = getAuth(app);
    const provider = new GoogleAuthProvider();
    setAuth(authInstance);
    setGoogleProvider(provider);
  }, []);
  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!auth) return; // Wait for auth to initialize
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully:", userCredential.user);
      router.push("/firstpage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful:", result.user);
      router.push("/firstpage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Section */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center text-white p-10 flex-col justify-between"
        style={{
          backgroundImage: `url('https://s3-alpha-sig.figma.com/img/b804/7ad2/f19dea4052bb2512b256ab9abe070b0b?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=CDCK-oHjlKjRsLQFe6dwshNabrnF04VDiRXzcePwKU-Gywbk-VakJ1LzW2OLhkUNyOG8bD~nu3emMBSzfLN-DVqEQBfxz5ElMHl-oI9zTUm0Z967BETBWSWgwm60eCzD4W1WWi0GZF9AXPSQgMXawH1TXsNr7~zl-OLyzqc-~u8Zz5Yn~a0fiVqWNDsbQiffnUYpcenUvbShQaO36UaLhPqAxAiYkbuQA7l05PHj6EyBKYfKysNxhbHI2ky6-QK46rkVOr2IpjJzaVRxii-uPaCio8v1cEMloBUovGrviy-NBUnyLjcQTkuKsyg8RKwaO7aC642tiVmEKMeuMBU3KA__')`,
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="text-3xl font-bold">HighBridge</div>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">BUILDING THE FUTURE...</h1>
          <p className="text-sm opacity-75">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      {/* Right Section with Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-center">Welcome Back! Log In to Your Account</h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {/* Form */}
          <form onSubmit={handleEmailLogin}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Type here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Type here..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-1" />
                <label htmlFor="remember" className="text-xs text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-xs text-red-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300 disabled:bg-red-300"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">Or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="space-y-2">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center p-2 border rounded hover:bg-gray-50 transition duration-300 disabled:bg-gray-100"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-4 h-4 mr-2"
              />
              <span className="text-sm">Log in with Google</span>
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-700">
              New user?{" "}
              <a href="#" className="text-red-500 hover:underline">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;