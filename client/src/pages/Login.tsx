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
		<div>
			<h2
				style={{
					fontSize: "2rem",
					fontWeight: 700,
					color: "#00e1ff",
					marginBottom: 24,
					letterSpacing: "0.04em",
					textAlign: "center",
				}}
			>
				Sign In
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
				onClick={handleLogin}
				style={{
					width: "100%",
					fontWeight: 700,
					fontSize: "1.1rem",
				}}
			>
				Login
			</button>
			<div
				style={{
					marginTop: 18,
					textAlign: "center",
					color: "#b0b0b0",
					fontSize: 14,
				}}
			>
				Don&apos;t have an account?{" "}
				<span
					style={{
						color: "#00e1ff",
						cursor: "pointer",
						textDecoration: "underline",
					}}
					onClick={() => navigate("/register")}
				>
					Register
				</span>
			</div>
		</div>
	);
};

export default Login;
