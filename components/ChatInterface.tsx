"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<string>;
  placeholder?: string;
  className?: string;
}

export default function ChatInterface({
  onSendMessage,
  placeholder = "Écrivez votre question...",
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis là pour répondre à vos questions sur l'investissement. Comment puis-je vous aider ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let response = "";
      if (onSendMessage) {
        response = await onSendMessage(userMessage.content);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        response = "Je comprends votre question. Cette fonctionnalité nécessite une configuration backend.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-slate-50 rounded-lg overflow-hidden", className)}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((message, index) => (
            <MessageThread
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
          
          {isLoading && (
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200" />
              <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-slate-400 -translate-x-1.5" />
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Réflexion en cours</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-3.5 pointer-events-none">
                <MessageSquare className="w-4 h-4 text-slate-400" />
              </div>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                rows={1}
                className="w-full pl-11 pr-4 py-3 text-base text-slate-900 bg-slate-50 border-0 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-colors placeholder:text-slate-400"
                style={{
                  minHeight: "52px",
                  maxHeight: "150px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex-shrink-0 flex items-center gap-2",
                input.trim() && !isLoading
                  ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-sm"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
              aria-label="Envoyer"
            >
              <span>Envoyer</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageThread({ message, isLast }: { message: Message; isLast: boolean }) {
  const isUser = message.role === "user";

  return (
    <div className="relative pl-12">
      {/* Timeline line */}
      <div className={cn(
        "absolute left-0 top-0 w-0.5",
        isLast ? "h-full" : "h-[calc(100%+2rem)]",
        isUser ? "bg-slate-300" : "bg-slate-200"
      )} />
      
      {/* Timeline dot */}
      <div className={cn(
        "absolute left-0 top-0 w-3 h-3 rounded-full -translate-x-1.5 border-2 border-white",
        isUser ? "bg-slate-900" : "bg-slate-400"
      )} />

      {/* Message card */}
      <div className={cn(
        "bg-white border rounded-lg shadow-sm transition-all hover:shadow-md",
        isUser ? "border-slate-300" : "border-slate-200"
      )}>
        {/* Header */}
        <div className={cn(
          "px-6 py-3 border-b flex items-center justify-between",
          isUser ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide",
              isUser 
                ? "bg-slate-900 text-white" 
                : "bg-slate-100 text-slate-700"
            )}>
              {isUser ? "Vous" : "Assistant"}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className={cn(
            "prose prose-sm max-w-none",
            isUser ? "prose-slate" : "prose-slate"
          )}>
            <p className="text-slate-900 leading-relaxed whitespace-pre-wrap break-words m-0">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
