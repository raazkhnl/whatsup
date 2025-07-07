// src/pages/Chat.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import axios from "axios";
import { API_URL } from "../config";

interface Message {
	sender: string;
	content: string;
	timestamp: string;
	to?: string;
	group?: string;
}

interface ChatProps {
	socket: Socket;
	chatType?: "user" | "group"; // Optional prop, determined by route
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
	const { id } = useParams<{ id: string }>(); // Get chat ID from URL
	const chatType = window.location.pathname.startsWith("/group")
		? "group"
		: "user"; // Determine chat type from path
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [allUsers, setAllUsers] = useState<
		{ _id: string; username: string; email: string }[]
	>([]);

	// Fetch all users for dashboard
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${API_URL}/api/auth/users`, {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				});
				console.log("response", response);
				setAllUsers(response.data);
			} catch (err) {
				console.error("Failed to fetch users");
			}
		};
		fetchUsers();
	}, []);

	useEffect(() => {
		// Fetch initial message history
		const fetchMessages = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/api/messages/${chatType}/${id}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				setMessages(response.data);
			} catch (err) {
				console.error("Failed to fetch messages");
			}
		};
		fetchMessages();

		// Listen for new messages
		socket.on("newMessage", (message: Message) => {
			if (
				(chatType === "user" && (message.sender === id || message.to === id)) ||
				(chatType === "group" && message.group === id)
			) {
				setMessages((prev) => [...prev, message]);
			}
		});

		// Listen for online users
		socket.on("onlineUsers", (users: string[]) => {
			setOnlineUsers(users);
		});

		return () => {
			socket.off("newMessage");
			socket.off("onlineUsers");
		};
	}, [socket, id, chatType]);

	const sendMessage = () => {
		if (input.trim()) {
			const message = { content: input, timestamp: new Date().toISOString() };
			if (chatType === "user") {
				socket.emit("sendMessage", { to: id, ...message });
			} else {
				socket.emit("sendMessage", { groupId: id, ...message });
			}
			setInput("");
		}
	};
	// Guard: If id is undefined, show a message and do not fetch
	// if (!id) {
	// 	return (
	// 		<div className="flex items-center justify-center h-screen">
	// 			<p className="text-lg text-gray-600">
	// 				No chat selected. Please select a user or group to start chatting.
	// 			</p>
	// 		</div>
	// 	);
	// }

	return (
		<div className="flex h-screen">
			<div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
				<h2 className="text-lg font-bold mb-2">All Users</h2>
				<ul>
					{allUsers.map((user) => (
						<li
							key={user._id}
							className={`flex items-center justify-between p-2 rounded cursor-pointer mb-1 ${
								onlineUsers.includes(user._id)
									? "bg-green-100 font-bold"
									: "bg-white"
							}`}
							onClick={() => {
								window.location.href = `/chat/${user._id}`;
							}}
						>
							<span>{user.username}</span>
							{onlineUsers.includes(user._id) && (
								<span className="text-xs text-green-600 ml-2">Online</span>
							)}
						</li>
					))}
				</ul>
				<h2 className="text-lg font-bold mt-6 mb-2">Active Users</h2>
				<ul>
					{allUsers
						.filter((u) => onlineUsers.includes(u._id))
						.map((user) => (
							<li key={user._id} className="p-2 text-green-700 font-semibold">
								{user.username}
							</li>
						))}
				</ul>
			</div>
			<div className="flex-1 flex flex-col">
				<div className="flex-1 overflow-y-auto p-4">
					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`my-2 p-2 rounded ${
								msg.sender === "me" ? "bg-green-200 ml-auto" : "bg-gray-200"
							}`}
						>
							<p>{msg.content}</p>
							<span className="text-xs text-gray-500">
								{new Date(msg.timestamp).toLocaleTimeString()}
							</span>
						</div>
					))}
				</div>
				<div className="p-4 border-t">
					<div className="flex space-x-2">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && sendMessage()}
							className="flex-1 p-2 border rounded"
							placeholder="Type a message..."
						/>
						<button
							onClick={sendMessage}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chat;
