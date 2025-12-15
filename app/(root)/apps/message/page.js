'use client';
import { useContext, useEffect, useState, useRef } from 'react';
import { SettingsContext } from "../../../../contexts/useSettingsContext";
import { UserAuth } from "../../../../contexts/useAuthContext";
import Spinner from '../../../../components/spinner';
import Toast from '../../../../components/toast.js';
import { getTtl } from '../../../../utils/languages';
import { IoSend, IoSearch, IoCall, IoVideocam, IoEllipsisVertical } from "react-icons/io5";
import { BsEmojiSmile, BsThreeDotsVertical, BsPaperclip } from "react-icons/bs";
import { FiSearch, FiMoreVertical, FiPhone, FiVideo } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdDone, MdDoneAll } from "react-icons/md";
import dateFormat from "dateformat";

// Sample clients data - this would come from your database
const sampleClients = [
    { id: '1', name: 'John Doe', avatar: '', lastMessage: 'Thanks for the update!', time: '10:30 AM', unread: 2, online: true },
    { id: '2', name: 'Sarah Wilson', avatar: '', lastMessage: 'When can we expect delivery?', time: '9:15 AM', unread: 0, online: false },
    { id: '3', name: 'Mike Johnson', avatar: '', lastMessage: 'Invoice received, processing payment', time: 'Yesterday', unread: 1, online: true },
    { id: '4', name: 'Emily Brown', avatar: '', lastMessage: 'Please send the contract details', time: 'Yesterday', unread: 0, online: false },
    { id: '5', name: 'David Lee', avatar: '', lastMessage: 'Great working with you!', time: '2 days ago', unread: 0, online: false },
];

// Sample messages - this would come from your database
const sampleMessages = {
    '1': [
        { id: 'm1', sender: 'them', text: 'Hello! I wanted to check on the order status.', time: '10:00 AM', status: 'read' },
        { id: 'm2', sender: 'me', text: 'Hi John! The order is being processed and will ship tomorrow.', time: '10:15 AM', status: 'read' },
        { id: 'm3', sender: 'them', text: 'Thanks for the update!', time: '10:30 AM', status: 'read' },
    ],
    '2': [
        { id: 'm1', sender: 'them', text: 'Hi, I placed an order last week.', time: '8:45 AM', status: 'read' },
        { id: 'm2', sender: 'them', text: 'When can we expect delivery?', time: '9:15 AM', status: 'read' },
    ],
    '3': [
        { id: 'm1', sender: 'me', text: 'Good morning! Here is the invoice for your recent order.', time: '11:00 AM', status: 'delivered' },
        { id: 'm2', sender: 'them', text: 'Invoice received, processing payment', time: '2:30 PM', status: 'read' },
    ],
    '4': [
        { id: 'm1', sender: 'them', text: 'Hello, I am interested in your services.', time: '3:00 PM', status: 'read' },
        { id: 'm2', sender: 'me', text: 'Thank you for your interest! What would you like to know?', time: '3:30 PM', status: 'read' },
        { id: 'm3', sender: 'them', text: 'Please send the contract details', time: '4:00 PM', status: 'read' },
    ],
    '5': [
        { id: 'm1', sender: 'them', text: 'Great working with you!', time: '9:00 AM', status: 'read' },
    ],
};


const AssistantChat = () => {
    const { settings, ln } = useContext(SettingsContext);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'assistant', text: getTtl('Hello! How can I assist you today?', ln), time: dateFormat(new Date(), 'h:MM TT') }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const userMsg = {
                id: Date.now(),
                sender: 'user',
                text: newMessage,
                time: dateFormat(new Date(), 'h:MM TT')
            };
            setMessages(prev => [...prev, userMsg]);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'assistant',
                    text: getTtl('I am your assistant. This is a demo chatbot UI. (No backend connected)', ln),
                    time: dateFormat(new Date(), 'h:MM TT')
                }]);
            }, 800);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="container mx-auto px-2 md:px-4 xl:px-6 mt-16 md:mt-0 h-[calc(100vh-80px)]">
            {Object.keys(settings).length === 0 ? <Spinner /> :
                <>
                    <Toast />
                    <div className="border border-[var(--selago)] rounded-xl shadow-lg bg-white h-full mt-4 flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--selago)] bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]">
                            <h2 className="text-xl font-semibold text-white">{getTtl('Assistant', ln)}</h2>
                        </div>
                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-[var(--selago)]/20">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                            message.sender === 'user'
                                                ? 'bg-gradient-to-r from-[var(--endeavour)] to-[var(--chathams-blue)] text-white rounded-br-md'
                                                : 'bg-white text-[var(--port-gore)] shadow-sm rounded-bl-md'
                                        }`}
                                    >
                                        <p className="break-words">{message.text}</p>
                                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                                            message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                                        }`}>
                                            <span className="text-xs">{message.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Message Input */}
                        <div className="p-4 border-t border-[var(--selago)] bg-white">
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-[var(--selago)] rounded-full transition-colors">
                                    <BsEmojiSmile className="w-5 h-5 text-gray-500" />
                                </button>
                                <button className="p-2 hover:bg-[var(--selago)] rounded-full transition-colors">
                                    <BsPaperclip className="w-5 h-5 text-gray-500" />
                                </button>
                                <input
                                    type="text"
                                    placeholder={getTtl('Type a message...', ln)}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-4 py-2 border border-[var(--selago)] rounded-full focus:outline-none focus:border-[var(--endeavour)] bg-[var(--selago)]/30"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-gradient-to-r from-[var(--endeavour)] to-[var(--chathams-blue)] text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <IoSend className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default AssistantChat;
