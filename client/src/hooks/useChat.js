
import { useCallback, useState } from "react";

export const useChat = (roomId, user) => {

    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Send message (Frontend only)
    const sendMessage = useCallback((text) => {

        if (!text.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: text.trim(),

            senderName:
                user?.fullName ||
                user?.name ||
                "You",

            senderId: user?.id || null,

            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        };

        // Add message to frontend state
        setMessages((prev) => [...prev, newMessage]);

        // Increase unread count when chat is closed
        if (!isChatOpen) {
            setUnreadCount((prev) => prev + 1);
        }

    }, [user, isChatOpen]);


    // Toggle chat panel
    const toggleChat = useCallback(() => {

        setIsChatOpen((prev) => {
            if (!prev) {
                setUnreadCount(0);
            }

            return !prev;
        });

    }, []);


    // Return chat functionality
    return {
        messages,
        sendMessage,
        unreadCount,
        isChatOpen,
        toggleChat
    };
};
