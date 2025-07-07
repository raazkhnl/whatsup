// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { API_URL } from "./config";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ProtectedRoute from "./ProtectedRoute";

const socket: Socket = io(API_URL, {
	auth: { token: localStorage.getItem("token") },
});

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/chat/:id"
					element={
						<ProtectedRoute>
							<Chat socket={socket} />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/group/:id"
					element={
						<ProtectedRoute>
							<Chat socket={socket} />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Chat socket={socket} />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
