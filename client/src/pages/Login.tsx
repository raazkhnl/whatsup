import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			const response = await axios.post(`${API_URL}/api/auth/login`, {
				email,
				password,
			});
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("userId", response.data.user.id);
			navigate("/");
		} catch (err) {
			setError("Invalid credentials");
		}
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center space-y-6">
			<h2 className="text-3xl font-boldtext-center tracking-tight">
				<span style={{ color: "#00e1ff" }}>Log</span>{" "}
				<span style={{ color: "#ffb300" }}>In</span>
			</h2>
			{error && <p className="text-red-500 text-center mt-4">{error}</p>}
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				className="w-full p-3 mt-6 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				className="w-full p-3 mt-4 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
			/>
			<button
				onClick={handleLogin}
				className="w-full p-3 mt-6 bg-cyan-500 text-gray-900 font-bold rounded-lg shadow hover:bg-cyan-600 transition"
			>
				Login
			</button>
			<div className="mt-4 text-center text-gray-400 text-sm">
				Don't have an account?{" "}
				<span
					className="text-cyan-500 cursor-pointer underline"
					onClick={() => navigate("/register")}
				>
					Register
				</span>
			</div>
			<p className="text-center text-sm  font-medium">
				<span style={{ color: "#00e1ff" }}>Copyright &copy; 2025</span>{" "}
				<span style={{ color: "#ffb300" }}>RaaZ Khanal</span>{" "}
			</p>
		</div>
	);
};

export default Login;
