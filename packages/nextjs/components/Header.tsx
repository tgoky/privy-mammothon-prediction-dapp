"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BirdyTask from "../app/BirdyTask";
import { usePrivy } from "@privy-io/react-auth";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useNotification } from "~~/app/context/NotificationContext";
import PrivyConnectButton from "~~/components/PrivyConnectButton";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

// Import BirdyTask component

type HeaderMenuLink = {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  href?: string; // Optional href property for external links
  external?: boolean; // Optional flag to indicate it's an external link
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const { login, logout, authenticated, user } = usePrivy();

  const { notifications } = useNotification();

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const handleModalToggle = () => {
    setIsModalOpen(prev => !prev);
  };

  const menuLinks: HeaderMenuLink[] = [
   
    {
      label: "MuffledBird Documentation", // Label for the new menu item
      onClick: () => {}, // No click behavior needed, since it's an anchor link
      icon: <Bars3Icon className="w-4 h-4" />, // You can customize the icon if desired
      href: "https://muffledbirds.netlify.app/", // External website link
      external: true, // Add a flag to indicate it's an external link
    },
  ];

  const HeaderMenuLinks = () => {
    const pathname = usePathname();

    return (
      <>
        {menuLinks.map(({ label, onClick, icon, href, external }) => (
          <li key={label}>
            {external ? (
              <a
                href={href}
                target="_blank" // Opens the link in a new tab
                rel="noopener noreferrer" // Security feature to prevent vulnerabilities
                className="hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 bg-black text-sm rounded-full gap-2 grid grid-flow-col"
              >
                {icon}
                <span>{label}</span>
              </a>
            ) : (
              <button
                onClick={onClick}
                className="hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 bg-black text-sm rounded-full gap-2 grid grid-flow-col"
              >
                {icon}
                <span>{label}</span>
              </button>
            )}
          </li>
        ))}
      </>
    );
  };

  return (
    <div className="sticky lg:static bg-black top-0 navbar bg-base-200 min-h-0 flex-shrink-0 justify-between z-20 border-b-2 border-base-100 px-0 sm:px-2 py-4">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-6 h-6">
       
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">muffled mamo</span>
            <span className="text-xs">be a muffled mamo</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4 flex items-center space-x-4">
        <div className="relative">
          <button className="text-white font-bold" onClick={() => setIsNotificationOpen(prev => !prev)}>
            Notifications
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`flex items-center gap-4 p-4 mb-2 rounded-lg shadow ${
                      notification.status === "won"
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : notification.status === "lost"
                          ? "bg-gradient-to-r from-red-400 to-red-600"
                          : "bg-gradient-to-r from-gray-700 to-gray-800"
                    }`}
                  >
                    <div className="flex flex-col flex-grow">
                      <p className="text-lg font-bold text-white">{notification.title}</p>
                      <p className="text-sm text-gray-200">
                        Status: <span className="font-semibold">{notification.status}</span>
                        {notification.status === "live" && (
                          <span className="ml-2">({notification.countdown}s left)</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-white text-lg bg-gray-900 rounded-lg">No active notifications</div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={authenticated ? logout : login}
          className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600"
        >
          {authenticated ? "Disconnect" : "Login with Email"}
        </button>
      </div>

      {/* Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
          <div className="relative bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
            <button
              onClick={handleModalToggle}
              className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full px-4 py-2"
            >
              Close
            </button>
            <BirdyTask /> {/* Render the BirdyTask component */}
          </div>
        </div>
      )}
    </div>
  );
};
