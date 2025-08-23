import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../lib/axiosClient";
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react';

function HintAi() {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hi,I am here to help you out" }] },
        { role: 'user', parts: [{ text: "Hello" }] },
    ])
    const [isTyping, setIsTyping] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        setMessages(prev => [...prev, { role: 'user', parts: [{ text: data.message }] }]);
        reset();
        setIsTyping(true);

        try {
            const response = await axiosClient.post("/student/chat", {
                messages: messages,
            });

            // Simulate typing delay for better UX
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'model',
                    parts: [{ text: response.data.message }]
                }]);
                setIsTyping(false);
            }, 1000);
        } catch (error) {
            console.error("API Error:", error);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'model',
                    parts: [{ text: "Error from AI Chatbot\n" + error }]
                }]);
                setIsTyping(false);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[45vh] min-h-[350px] bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 relative">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Floating Particles */}
                {[...Array(10)].map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
                
                {/* Neural Network Lines */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full">
                        {[...Array(5)].map((_, i) => (
                            <line
                                key={`line-${i}`}
                                x1={`${Math.random() * 100}%`}
                                y1={`${Math.random() * 100}%`}
                                x2={`${Math.random() * 100}%`}
                                y2={`${Math.random() * 100}%`}
                                stroke="rgb(34, 211, 238)"
                                strokeWidth="1"
                                className="animate-pulse"
                                style={{ animationDelay: `${i * 0.5}s` }}
                            />
                        ))}
                    </svg>
                </div>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800/80 to-gray-800/80 backdrop-blur-sm p-3 border-b border-gray-700/50 relative z-10 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base">AI Assistant</h3>
                        <p className="text-gray-400 text-xs flex items-center">
                            <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                            Ready to help
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 relative z-10 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slideIn`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className={`flex items-start space-x-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                            {/* Avatar */}
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.role === "user" 
                                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                                    : "bg-gradient-to-br from-cyan-500 to-blue-600"
                            } shadow-lg`}>
                                {msg.role === "user" ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className={`relative px-3 py-2 rounded-xl shadow-lg backdrop-blur-sm border text-sm ${
                                msg.role === "user"
                                    ? "bg-gradient-to-br from-green-600/80 to-emerald-700/80 text-white border-green-500/30 rounded-br-md"
                                    : "bg-gradient-to-br from-slate-700/80 to-gray-700/80 text-gray-100 border-gray-600/30 rounded-bl-md"
                            } transform hover:scale-105 transition-all duration-300 group`}>
                                {/* Message Content */}
                                <p className="leading-relaxed whitespace-pre-wrap">
                                    {msg.parts[0].text}
                                </p>

                                {/* Glow Effect */}
                                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                                    msg.role === "user" ? "bg-green-400" : "bg-cyan-400"
                                } blur-xl -z-10`}></div>

                                {/* Message Tail */}
                                <div className={`absolute top-3 w-2 h-2 transform rotate-45 ${
                                    msg.role === "user"
                                        ? "bg-gradient-to-br from-green-600/80 to-emerald-700/80 -right-1"
                                        : "bg-gradient-to-br from-slate-700/80 to-gray-700/80 -left-1"
                                }`}></div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start animate-slideIn">
                        <div className="flex items-start space-x-2 max-w-[85%]">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg animate-pulse">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gradient-to-br from-slate-700/80 to-gray-700/80 px-3 py-2 rounded-xl rounded-bl-md border border-gray-600/30 backdrop-blur-sm">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="sticky bottom-0 p-3 bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-sm border-t border-gray-700/50 relative z-10 flex-shrink-0"
            >
                <div className="flex items-center space-x-2 relative">
                    {/* Input Field */}
                    <div className="flex-1 relative">
                        <input
                            placeholder="Ask anything regarding question..."
                            className={`w-full px-3 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 backdrop-blur-sm transition-all duration-300 pr-10 text-sm ${
                                inputFocused ? 'shadow-lg shadow-cyan-500/20 border-cyan-500/50' : 'border-gray-600/50'
                            }`}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                            {...register("message", { required: true, minLength: 2 })}
                        />
                        
                        {/* Input Glow Effect */}
                        {inputFocused && (
                            <div className="absolute inset-0 bg-cyan-500/10 rounded-xl blur-xl -z-10 animate-pulse"></div>
                        )}

                        {/* AI Sparkle Icon */}
                        <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-pulse" />
                    </div>

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={errors.message}
                        className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-cyan-500/30 transform hover:scale-110 active:scale-95 transition-all duration-300 group relative overflow-hidden"
                    >
                        {/* Button Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 -skew-x-12 group-hover:animate-shimmer"></div>
                        
                        <Send className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                </div>

                {/* Error Message */}
                {errors.message && (
                    <p className="text-red-400 text-xs mt-2 animate-shake">
                        Please enter a valid message (at least 2 characters)
                    </p>
                )}
            </form>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float-particle {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                        opacity: 0.8;
                    }
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%) skewX(-12deg);
                    }
                    100% {
                        transform: translateX(200%) skewX(-12deg);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .animate-slideIn {
                    animation: slideIn 0.5s ease-out forwards;
                }

                .animate-float-particle {
                    animation: float-particle 4s ease-in-out infinite;
                }

                .animate-shimmer {
                    animation: shimmer 0.8s ease-out;
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }

                /* Custom Scrollbar */
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }

                .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
                    background-color: rgb(75, 85, 99);
                    border-radius: 2px;
                }

                .scrollbar-track-transparent::-webkit-scrollbar-track {
                    background: transparent;
                }
            `}</style>
        </div>
    );
}

export default HintAi;