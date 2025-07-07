import React from "react";

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="w-screen h-screen flex flex-row bg-gray-900">
			<aside className="w-20  bg-gray-800 border-r border-gray-700 flex flex-col items-center pt-8">
				{/* Sidebar content or navigation can be added here if needed */}
			</aside>
			<main className="flex-1 flex flex-col bg-gray-800 h-full">
				{children}
			</main>
		</div>
	);
};

export default UserLayout;
