import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { API_URL } from "./config";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ProtectedRoute from "./ProtectedRoute";
import GuestLayout from "./layouts/GuestLayout";
import UserLayout from "./layouts/UserLayout";

const socket: Socket = io(API_URL, {
	auth: { token: localStorage.getItem("token") },
});

function App() {
	return (
		<div className="w-screen h-screen">
			<Router>
				<Routes>
					<Route
						path="/login"
						element={
							<GuestLayout>
								<Login />
							</GuestLayout>
						}
					/>
					<Route
						path="/register"
						element={
							<GuestLayout>
								<Register />
							</GuestLayout>
						}
					/>
					<Route
						path="/chat/:id"
						element={
							<ProtectedRoute>
								<UserLayout>
									<Chat socket={socket} />
								</UserLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/group/:id"
						element={
							<ProtectedRoute>
								<UserLayout>
									<Chat socket={socket} />
								</UserLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<UserLayout>
									<Chat socket={socket} />
								</UserLayout>
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
