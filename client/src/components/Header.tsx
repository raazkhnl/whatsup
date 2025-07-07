import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC<{ username?: string }> = ({ username }) => {
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};
	return (
		<header
			className="header"
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				width: "100%",
				background: "var(--color-header)",
				color: "var(--color-primary)",
				fontWeight: 700,
				fontSize: "1.3rem",
				padding: "1.2rem 2rem 1.2rem 2rem",
				borderBottom: "1px solid var(--color-border)",
				letterSpacing: "0.04em",
				boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
				zIndex: 10,
				position: "sticky",
				top: 0,
			}}
		>
			<div
				className="header-title"
				style={{
					cursor: "pointer",
					fontWeight: 700,
					fontSize: "1.4rem",
					letterSpacing: "0.04em",
					display: "flex",
					alignItems: "center",
				}}
				onClick={() => navigate("/")}
			>
				<span style={{ color: "#00e1ff" }}>Whats</span>
				<span style={{ color: "#ffb300" }}>Up</span>
				{username && (
					<span
						style={{
							color: "#b0b0b0",
							fontWeight: 400,
							fontSize: "1rem",
							marginLeft: 8,
						}}
					>
						({username})
					</span>
				)}
			</div>
			<button
				onClick={handleLogout}
				style={{
					background: "#ff4d4f",
					color: "#fff",
					border: "none",
					borderRadius: 8,
					padding: "0.5rem 1.2rem",
					fontWeight: 700,
					fontSize: "1rem",
					boxShadow: "0 2px 8px 0 rgba(255,77,79,0.08)",
					transition: "background 0.2s, color 0.2s",
					cursor: "pointer",
				}}
				onMouseOver={(e) => (e.currentTarget.style.background = "#d9363e")}
				onMouseOut={(e) => (e.currentTarget.style.background = "#ff4d4f")}
			>
				Logout
			</button>
		</header>
	);
};

export default Header;
