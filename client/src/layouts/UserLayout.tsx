import React from "react";
import Header from "../components/Header";

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="w-screen h-screen flex flex-row bg-gray-900 items-center justify-center">
			{/* <aside className="w-20  bg-gray-800 border-r border-gray-700 flex flex-col items-center pt-8">
			</aside> */}
			<div className="h-full w-full md:w-4/5 sm:px-6 ">
				<Header />

				<main className="flex-1 flex flex-col bg-gray-800 h-[90vh]">
					{children}
				</main>
			</div>
		</div>
	);
};

export default UserLayout;
