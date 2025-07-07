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
			localStorage.setItem("userId", response.data.userId); // Assuming server returns userId
			navigate("/");
		} catch (err) {
			setError("Invalid credentials");
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold text-blue-600 mb-6">Login</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					onClick={handleLogin}
					className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
				>
					Login
				</button>
			</div>
		</div>
	);
};

export default Login;
