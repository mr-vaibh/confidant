"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToggleLink from "./ToggleLink";
import NavMenu from "./NavMenu";
import { UserProvider } from "@/context/UserContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <nav className="flex flex-col nav:flex-row justify-between items-center p-4 mb-0 sm:mb-5 bg-white dark:bg-gray-900 shadow-md w-full">
      <div className="flex justify-between items-center w-full nav:w-auto">
        <Link href="/dashboard" className="font-bold text-lg text-gray-900 dark:text-gray-100">
          Confidant
        </Link>

        {/* Responsive Toggle Button */}
        <ToggleLink isOpen={isOpen} handleToggle={handleToggle} />
      </div>

      <div
        className={`nav:flex flex-col nav:flex-row items-center w-full nav:w-auto ${
          isOpen ? "block" : "hidden"
          }`}
      >
        <div className="flex flex-col nav:flex-row items-center w-full nav:w-auto">
          <UserProvider>
            <NavMenu />
          </UserProvider>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
