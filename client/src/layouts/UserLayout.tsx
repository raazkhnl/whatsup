import React from "react";
import "../App.css";

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="layout user-layout">
			<aside className="sidebar">
				{/* Add sidebar content or navigation here if needed */}
			</aside>
			<main className="layout-content user-content">{children}</main>
		</div>
	);
};

export default UserLayout;
