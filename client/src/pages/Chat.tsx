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
	chatType?: "user" | "group";
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
	const { id } = useParams<{ id: string }>();
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

		socket.on("newMessage", (message: Message) => {
			if (
				(chatType === "user" && (message.sender === id || message.to === id)) ||
				(chatType === "group" && message.group === id)
			) {
				setMessages((prev) => [...prev, message]);
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
		<div
			style={{
				display: "flex",
				height: "100vh",
				minHeight: 0,
				background: "var(--color-bg-secondary)",
			}}
		>
			{/* Sidebar */}
			<aside
				style={{
					width: "40%",
					background: "var(--color-sidebar)",
					borderRight: "1px solid var(--color-border)",
					padding: "2rem 1.2rem 1.2rem 1.2rem",
					height: "100vh",
				}}
			>
				<h2
					style={{
						color: "#00e1ff",
						fontWeight: 700,
						fontSize: 18,
						marginBottom: 12,
					}}
				>
					All Users
				</h2>
				<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
					{allUsers.map((user) => (
						<li
							key={user._id}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "0.5rem 0.7rem",
								borderRadius: 8,
								marginBottom: 6,
								background:
									activeUser === user._id
										? "#00e1ff33"
										: onlineUsers.includes(user._id)
										? "rgba(0,225,255,0.08)"
										: "var(--color-surface)",
								fontWeight:
									activeUser === user._id || onlineUsers.includes(user._id)
										? 700
										: 400,
								color:
									activeUser === user._id
										? "#00e1ff"
										: onlineUsers.includes(user._id)
										? "#00e1ff"
										: "#e0e0e0",
								cursor: "pointer",
								border:
									activeUser === user._id
										? "1.5px solid #00e1ff"
										: "1.5px solid transparent",
								boxShadow:
									activeUser === user._id
										? "0 2px 8px 0 rgba(0,225,255,0.12)"
										: undefined,
								transition: "background 0.2s, border 0.2s, color 0.2s",
							}}
							onClick={() => {
								setActiveUser(user._id);
								window.location.href = `/chat/${user._id}`;
							}}
						>
							<span>{user.username}</span>
							{onlineUsers.includes(user._id) && (
								<span style={{ color: "#00e1ff", fontSize: 12, marginLeft: 8 }}>
									●
								</span>
							)}
						</li>
					))}
				</ul>
				<h2
					style={{
						color: "#ffb300",
						fontWeight: 700,
						fontSize: 16,
						margin: "2rem 0 0.5rem 0",
					}}
				>
					Active Users
				</h2>
				<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
					{allUsers
						.filter((u) => onlineUsers.includes(u._id))
						.map((user) => (
							<li
								key={user._id}
								style={{
									color: "#00e1ff",
									fontWeight: 600,
									padding: "0.3rem 0",
								}}
							>
								{user.username}
							</li>
						))}
				</ul>
			</aside>
			{/* Chat Area */}
			<main
				style={{
					width: "60%",
					flex: 1,
					display: "flex",
					flexDirection: "column",
					minHeight: 0,
					height: "100vh",
				}}
			>
				<div
					style={{
						flex: 1,
						padding: "2rem 2.5rem 1rem 2.5rem",
						display: "flex",
						flexDirection: "column",
						gap: 12,
						minHeight: 0,
						maxHeight: "calc(100vh - 90px)",
					}}
				>
					{messages
						.filter((msg, idx, arr) =>
							msg.sender === userId && msg.to === id
								? arr.findIndex(
										(m) =>
											m.sender === userId &&
											m.to === id &&
											m.timestamp === msg.timestamp
								  ) === idx
								: true
						)
						.map((msg, idx) => {
							const isMe = msg.sender === userId;
							return (
								<div
									key={idx}
									style={{
										alignSelf: isMe ? "flex-end" : "flex-start",
										background: isMe ? "#00e1ff22" : "#23272f",
										color: isMe ? "#00e1ff" : "#e0e0e0",
										borderRadius: isMe
											? "18px 18px 4px 18px"
											: "18px 18px 18px 4px",
										padding: "0.7rem 1.2rem",
										marginBottom: 2,
										maxWidth: 420,
										boxShadow: isMe
											? "0 2px 8px 0 rgba(0,225,255,0.08)"
											: "0 2px 8px 0 rgba(0,0,0,0.08)",
										marginLeft: isMe ? 60 : 0,
										marginRight: isMe ? 0 : 60,
									}}
								>
									<div style={{ fontWeight: 500, fontSize: 15 }}>
										{msg.content}
									</div>
									<div
										style={{
											fontSize: 12,
											color: "#b0b0b0",
											marginTop: 4,
											textAlign: isMe ? "right" : "left",
										}}
									>
										{new Date(msg.timestamp).toLocaleTimeString()}
									</div>
								</div>
							);
						})}
				</div>
				<div
					style={{
						padding: "1.2rem 2.5rem",
						borderTop: "1px solid var(--color-border)",
						background: "var(--color-surface-alt)",
					}}
				>
					<div style={{ display: "flex", gap: 12 }}>
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && sendMessage()}
							placeholder="Type a message..."
							style={{
								flex: 1,
								padding: "0.8rem 1.2rem",
								borderRadius: 8,
								border: "1.5px solid var(--color-border)",
								background: "var(--color-surface)",
								color: "#e0e0e0",
								fontSize: 16,
								outline: "none",
							}}
						/>
						<button
							onClick={sendMessage}
							style={{
								background: "#00e1ff",
								color: "#181a20",
								fontWeight: 700,
								border: "none",
								borderRadius: 8,
								padding: "0.8rem 2.2rem",
								fontSize: 16,
								boxShadow: "0 2px 8px 0 rgba(0,225,255,0.08)",
								cursor: "pointer",
								transition: "background 0.2s, color 0.2s",
							}}
							onMouseOver={(e) =>
								(e.currentTarget.style.background = "#00b3c6")
							}
							onMouseOut={(e) => (e.currentTarget.style.background = "#00e1ff")}
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
