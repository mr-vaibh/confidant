"use client";

import React, { useState } from "react";
import Link from "next/link";
import ThemeLink from "./ThemeLink";
import ToggleLink from "./ToggleLink";
import NavMenu from "./NavMenu";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <nav className="flex flex-col nav:flex-row justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md w-full">
      <div className="flex justify-between items-center w-full nav:w-auto">
        <Link href="/" className="font-bold text-lg text-gray-900 dark:text-gray-100">
          Confidant
        </Link>

        {/* Responsive Toggle Button */}
        <ToggleLink isOpen={isOpen} handleToggle={handleToggle} />

        {/* Theme Toggle Button */}
        <ThemeLink />
      </div>

      <div
        className={`nav:flex flex-col nav:flex-row items-center w-full nav:w-auto ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col nav:flex-row items-center w-full nav:w-auto">
          <NavMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
