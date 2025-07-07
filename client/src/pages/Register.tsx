// src/pages/Register.tsx
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
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
		<div className="flex items-center justify-center h-screen">
			<form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
				<h2 className="text-2xl mb-4">Register</h2>
				{error && <p className="text-red-500">{error}</p>}
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Username"
					className="w-full p-2 mb-4 border rounded"
				/>
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
					className="w-full p-2 bg-green-500 text-white rounded"
				>
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;
