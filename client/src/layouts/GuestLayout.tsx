import React from "react";

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
			<div className="w-full max-w-md p-6 sm:p-8 bg-gray-800 rounded-xl shadow-lg">
				{children}
			</div>
		</div>
	);
};

export default GuestLayout;
