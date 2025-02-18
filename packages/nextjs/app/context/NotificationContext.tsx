"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Notification = {
  id: number;
  title: string;
  status: "live" | "won" | "lost";
  countdown: number;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "status">) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "status">) => {
    setNotifications(prev => [...prev, { ...notification, status: "live" }]);
  };

  // Timer to update countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev =>
        prev.map(notification =>
          notification.status === "live" && notification.countdown > 0
            ? { ...notification, countdown: notification.countdown - 1 }
            : notification,
        ),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>{children}</NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
