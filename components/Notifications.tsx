"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = "success" | "error" | "info";

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
};

// Store global pour les notifications
let notificationStore: Notification[] = [];
let listeners: Array<(notifications: Notification[]) => void> = [];

function notifyListeners() {
  listeners.forEach((listener) => listener([...notificationStore]));
}

export function showNotification(message: string, type: NotificationType = "info", duration = 5000) {
  const id = Math.random().toString(36).substring(7);
  const notification: Notification = { id, message, type, duration };
  
  notificationStore.push(notification);
  notifyListeners();

  // Auto-remove après la durée spécifiée
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  return id;
}

export function removeNotification(id: string) {
  notificationStore = notificationStore.filter((n) => n.id !== id);
  notifyListeners();
}

export function clearNotifications() {
  notificationStore = [];
  notifyListeners();
}

export default function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const listener = (newNotifications: Notification[]) => {
      setNotifications(newNotifications);
    };

    listeners.push(listener);
    listener([...notificationStore]);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const Icon = icons[notification.type];

  return (
    <div
      className={cn(
        "bg-white rounded-lg border shadow-lg p-4 flex items-start gap-3 transition-all duration-300",
        styles[notification.type],
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

