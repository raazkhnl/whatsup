import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Register: React.FC = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleRegister = async () => {
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
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
				<span style={{ color: "#00e1ff" }}>Create </span>{" "}
				<span style={{ color: "#ffb300" }}>Account</span>{" "}
			</h2>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				className="w-full p-3 mt-2 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
			/>
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				className="w-full p-3 mt-2 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				className="w-full p-3 mt-2 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
			/>
			<input
				type="password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				placeholder="Confirm Password"
				className="w-full p-3 mt-2 rounded-lg border border-gray-700 bg-gray-700 text-gray-200 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 outline-none transition"
			/>
			{error && <p className="text-red-500 text-center mt-4">{error}</p>}

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
			<p className="text-center text-sm  font-medium">
				<span style={{ color: "#00e1ff" }}>Copyright &copy; 2025</span>{" "}
				<span style={{ color: "#ffb300" }}>RaaZ Khanal</span>{" "}
			</p>
		</div>
	);
};

export default Register;
