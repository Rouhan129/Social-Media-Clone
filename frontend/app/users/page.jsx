"use client";

import React, { useEffect, useState } from "react";
import { getUsers } from "@/lib/user";
import { useRouter } from "next/navigation";
import { FaUserGroup } from "react-icons/fa6";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center justify-center gap-3 text-blue-600">
          <FaUserGroup size={30} />
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        </div>
        <div className="w-24 h-[3px] bg-blue-500 mt-3 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => router.push(`/user/${user._id}`)}
            className="cursor-pointer rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-blue-400"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-semibold mb-3">
                {user.email[0].toUpperCase()}
              </div>
              <div className="text-lg font-medium text-gray-800">
                {user.email}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Role: <span className="font-semibold text-blue-600">{user.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
