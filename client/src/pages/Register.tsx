import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Register: React.FC = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleRegister = async () => {
		try {
			await axios.post(`${API_URL}/api/auth/register`, {
				username,
				email,
				password,
			});
			navigate("/login");
		} catch (err) {
			setError("Registration failed");
		}
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center space-y-6">
			<h2 className="text-3xl font-bold text-amber-500 text-center tracking-tight">
				Create Account
			</h2>
			{error && <p className="text-red-500 text-center mt-4">{error}</p>}
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				className="w-full p-3 mt-6 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
			/>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				className="w-full p-3 mt-4 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				className="w-full p-3 mt-4 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
			/>
			<button
				onClick={handleRegister}
				className="w-full p-3 mt-6 bg-cyan-500 text-gray-900 font-bold rounded-lg shadow hover:bg-cyan-600 transition"
			>
				Register
			</button>
			<div className="mt-4 text-center text-gray-400 text-sm">
				Already have an account?{" "}
				<span
					className="text-cyan-500 cursor-pointer underline"
					onClick={() => navigate("/login")}
				>
					Login
				</span>
			</div>
		</div>
	);
};

export default Register;
