import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${API_URL}/api/auth/login`, {
				email,
				password,
			});
			localStorage.setItem("token", response.data.token);
			navigate("/");
		} catch (err) {
			setError("Invalid credentials");
		}
	};

	return (
		<div className="flex items-center justify-center h-screen">
			<form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
				<h2 className="text-2xl mb-4">Login</h2>
				{error && <p className="text-red-500">{error}</p>}
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="w-full p-2 mb-4 border rounded"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="w-full p-2 mb-4 border rounded"
				/>
				<button
					type="submit"
					className="w-full p-2 bg-blue-500 text-white rounded"
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
