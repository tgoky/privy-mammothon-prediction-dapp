"use client";

import React, { useState } from "react";
import Link from "next/link";

const BirdyTask = () => {
  const image = { src: "/hmm.PNG", alt: "Birdy Tasks" };

  // Initialize tasks with default state (not completed)
  const initialTasks = [
    {
      id: "twitter",
      title: "Follow us on Twitter",
      description: "Stay updated with our latest announcements and updates.",
      link: "https://x.com/muffledbird",
      buttonText: "Follow on X",
      completed: false,
    },
    {
      id: "telegram",
      title: "Join our Telegram",
      description: "Be part of the discussion and get real-time updates.",
      link: "https://t.me/yourtelegram",
      buttonText: "Join Telegram",
      completed: false,
    },
    {
      id: "discord",
      title: "Join our Discord",
      description: "Engage with the community, get roles and find helpful resources.",
      link: "https://discord.gg/yourdiscord",
      buttonText: "Join Discord",
      completed: false,
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  // Simulate verification logic
  const handleVerify = (id: string) => {
    // Simulate an API call or check for task completion
    setTimeout(() => {
      setTasks(prevTasks => prevTasks.map(task => (task.id === id ? { ...task, completed: true } : task)));
    }, 1000); // Simulate delay for verification
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-white mb-8">Be a Muffled Bird!</h1>
      <p className="text-2xl font-bold text-white mb-8">
        This is mandatory to verify your social eligiblity as a muffled bird{" "}
      </p>

      {/* Single Rectangle Card */}
      <div className="bg-gray-800 shadow-lg hover:shadow-xl transition rounded-lg overflow-hidden w-full max-w-5xl">
        {/* Single Image */}
        <img src={image.src} alt={image.alt} className="object-cover w-full h-64" />

        {/* Tasks Section */}
        <div className="p-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-700 pb-4 last:border-b-0"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg text-white font-semibold">{task.title}</h3>
                <p className="text-gray-400">{task.description}</p>
              </div>

              {!task.completed ? (
                <div className="flex gap-2">
                  <Link href={task.link} target="_blank" rel="noopener noreferrer" passHref>
                    <button className="bg-pink-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg">
                      {task.buttonText}
                    </button>
                  </Link>
                  <button
                    onClick={() => handleVerify(task.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Verify
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-semibold">✔ Done</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirdyTask;
