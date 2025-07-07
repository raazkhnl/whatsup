import React from "react";
import "../App.css";

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="layout guest-layout">
			<div className="layout-content guest-content">{children}</div>
		</div>
	);
};

export default GuestLayout;
