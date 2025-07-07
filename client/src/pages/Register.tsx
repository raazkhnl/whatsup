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
		<div>
			<h2
				style={{
					fontSize: "2rem",
					fontWeight: 700,
					color: "#ffb300",
					marginBottom: 24,
					letterSpacing: "0.04em",
					textAlign: "center",
				}}
			>
				Create Account
			</h2>
			{error && (
				<p
					style={{
						color: "#ff4d4f",
						marginBottom: 16,
						textAlign: "center",
					}}
				>
					{error}
				</p>
			)}
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				style={{ width: "100%", marginBottom: 18 }}
			/>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				style={{ width: "100%", marginBottom: 18 }}
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				style={{ width: "100%", marginBottom: 24 }}
			/>
			<button
				onClick={handleRegister}
				style={{
					width: "100%",
					fontWeight: 700,
					fontSize: "1.1rem",
				}}
			>
				Register
			</button>
			<div
				style={{
					marginTop: 18,
					textAlign: "center",
					color: "#b0b0b0",
					fontSize: 14,
				}}
			>
				Already have an account?{" "}
				<span
					style={{
						color: "#00e1ff",
						cursor: "pointer",
						textDecoration: "underline",
					}}
					onClick={() => navigate("/login")}
				>
					Login
				</span>
			</div>
		</div>
	);
};

export default Register;
