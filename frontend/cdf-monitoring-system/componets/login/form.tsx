"use client";
import React, { useState } from "react";
import { loginUser } from "../../api/login/login";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setErrorMsg("");  

    try {
      const data = await loginUser(email, password);
      console.log("Login successful:", data);
      router.push("/");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-400 flex justify-center items-center h-screen">
      <div className="w-2/3 h-screen hidden lg:block relative">
        <img
      src="https://images.squarespace-cdn.com/content/v1/539712a6e4b06a6c9b892bc1/1602606346823-O1E85ROA1WY8GUA1KZEJ/5164447705_8b60b18201_o.jpg"
      alt="People living in poverty"
      className="object-cover w-full h-full"
    />

      </div>

      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/3">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">CDF Portal</h1>
          <p className="text-white">
            Login to access Constituency Development Fund resources
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border rounded-md py-2 px-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-white mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded-md py-2 px-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 px-4 rounded-md transition duration-200 ${
              loading
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login to CDF Portal"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/1200px-Flag_of_Zambia.svg.png"
            alt="Zambia Flag"
            className="h-8 mx-auto mb-2"
          />
          <p className="text-xs text-white">
            Ministry of Local Government and Rural Development
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
