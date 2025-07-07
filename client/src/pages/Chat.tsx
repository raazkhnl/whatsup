import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import axios from "axios";
import { API_URL } from "../config";

interface Message {
	_id?: string;
	sender: { _id: string; username: string };
	content: string;
	timestamp: string;
	to?: string;
	group?: string;
}

interface ChatProps {
	socket: Socket;
	chatType?: "user" | "group";
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
	let { id } = useParams<{ id: string }>();
	const chatType = window.location.pathname.startsWith("/group")
		? "group"
		: "user";
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [allUsers, setAllUsers] = useState<
		{ _id: string; username: string; email: string }[]
	>([]);
	const [activeUser, setActiveUser] = useState<string | null>(id || null);
	const userId = localStorage.getItem("userId");
	if (!id) {
		id = userId || "";
	}
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${API_URL}/api/auth/users`, {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				});
				setAllUsers(response.data);
			} catch (err) {
				console.error("Failed to fetch users");
			}
		};
		fetchUsers();
	}, []);

	useEffect(() => {
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

		socket.on("newMessage", (message: Message & { _id: string }) => {
			if (
				(chatType === "user" &&
					(message.sender._id === id || message.to === id)) ||
				(chatType === "group" && message.group === id)
			) {
				setMessages((prev) => {
					const exists = prev.find(
						(msg) => (msg as any)._id === (message as any)._id
					);
					if (exists) return prev;
					return [...prev, message];
				});
			}
		});

		socket.on("onlineUsers", (users: string[]) => {
			setOnlineUsers(users);
		});

		return () => {
			socket.off("newMessage");
			socket.off("onlineUsers");
		};
	}, [socket, id, chatType]);

	useEffect(() => {
		setActiveUser(id || null);
	}, [id]);

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

	return (
		<div className="flex flex-row w-full h-[calc(100vh-4rem)]">
			<aside className="w-50 sm:w-80 bg-gray-800 border-r border-gray-700 p-4 sm:p-6 flex flex-col h-full">
				{/* All Users Section */}
				<div className="max-h-1/2 flex flex-col overflow-hidden">
					<h2 className="text-lg font-bold text-amber-500 mb-3">All Users</h2>
					<ul className="flex-1 overflow-y-auto space-y-2">
						{allUsers.map((user) => (
							<li
								key={user._id}
								className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
									activeUser === user._id
										? "bg-cyan-500/20 border border-cyan-500"
										: onlineUsers.includes(user._id)
										? "bg-cyan-500/10"
										: "bg-gray-700"
								}`}
								onClick={() => {
									setActiveUser(user._id);
									window.location.href = `/chat/${user._id}`;
								}}
							>
								<span
									className={`font-medium ${
										activeUser === user._id || onlineUsers.includes(user._id)
											? "text-cyan-500"
											: "text-gray-200"
									}`}
								>
									{user.username}
									{user._id === userId ? " (Me)" : ""}
								</span>
								{onlineUsers.includes(user._id) && (
									<span className="text-cyan-500 text-xs">●</span>
								)}
							</li>
						))}
					</ul>
				</div>

				{/* Active Users Section */}
				{/* <div className="max-h-1/2 flex flex-col overflow-hidden mt-4 sm:mt-6">
					<h2 className="text-base font-bold text-amber-500 mb-2">
						Active Users
					</h2>
					<ul className="flex-1 overflow-y-auto space-y-1">
						{allUsers
							.filter((u) => onlineUsers.includes(u._id))
							.map((user) => (
								<li key={user._id} className="text-cyan-500 font-medium p-1">
									{user.username}
								</li>
							))}
					</ul>
				</div> */}
			</aside>
			<main className="flex-1 flex flex-col w-full h-full">
				<div className="flex-1 p-4 sm:p-6 flex flex-col gap-3 overflow-y-auto">
					{messages.map((msg, idx) => {
						const notMe = msg.sender._id !== userId && msg.sender._id;
						console.log(userId, notMe);
						console.log("Message:", msg);

						return (
							<div
								key={idx}
								className={`p-3 rounded-2xl max-w-[80%] sm:max-w-[60%] shadow ${
									notMe
										? "self-start bg-cyan-500/20 text-cyan-500 rounded-br-sm"
										: "self-end bg-gray-700 text-gray-200 rounded-bl-sm"
								}`}
							>
								<div className="font-medium text-sm sm:text-base">
									{msg.content}
								</div>
								<div
									className={`text-xs text-gray-400 mt-1 ${
										notMe ? "text-left" : "text-right"
									}`}
								>
									{new Date(msg.timestamp).toLocaleTimeString()}
								</div>
							</div>
						);
					})}
				</div>
				<div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-700">
					<div className="flex gap-3">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && sendMessage()}
							placeholder="Type a message..."
							className="flex-1 p-3 rounded-lg border border-gray-600 bg-gray-600 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition text-sm sm:text-base"
						/>
						<button
							onClick={sendMessage}
							className="p-3 bg-cyan-500 text-gray-900 font-bold rounded-lg shadow hover:bg-cyan-600 transition text-sm sm:text-base"
						>
							Send
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Chat;
