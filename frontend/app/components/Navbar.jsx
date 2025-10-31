"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoLogOut } from "react-icons/io5";
import { AiFillPicture } from "react-icons/ai";
import { FaUserGroup } from "react-icons/fa6";
import { RiMessage2Fill } from "react-icons/ri";
import { MdHome } from "react-icons/md";
import { IoMenuOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: <MdHome size={18} />, href: "/" },
    { name: "Posts", icon: <AiFillPicture size={18} />, href: "/user" },
    { name: "Users", icon: <FaUserGroup size={18} />, href: "/users" },
    { name: "Messages", icon: <RiMessage2Fill size={18} />, href: "/messages" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-100 to-blue-500 border-b border-blue-300 px-6 md:px-20">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/Logo.png" alt="Logo" width={80} height={80} />
        </div>

        <div className="hidden md:flex gap-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-lg"
                    : "bg-blue-600/60 text-white hover:bg-blue-700"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition"
          >
            <IoLogOut size={18} />
            Logout
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-800 hover:text-blue-900 transition"
          >
            {isOpen ? <IoCloseOutline size={28} /> : <IoMenuOutline size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-gray-100 to-blue-500 border-t border-blue-300 py-3 space-y-3 animate-slide-down rounded-b-2xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  setIsOpen(false);
                }}
                className={`w-full text-left flex items-center gap-2 px-6 py-2 font-medium ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-white hover:bg-blue-600/70"
                } rounded-lg transition`}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center gap-2 px-6 py-2 font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            <IoLogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
