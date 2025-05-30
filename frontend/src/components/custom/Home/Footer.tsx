"use client";
import Link from "next/link";

import { Icons } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className=" py-12 px-4 md:px-6 z-50 w-full">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="icon-class w-2" />
              <h2 className="text-lg font-bold">Confidant</h2>
            </Link>

            <h1 className="dark:text-gray-300 mt-4">
              Build by{" "}
              <span className="dark:text-[#039ee4]">
                <Link href="https://x.com/MrVaiBH0">@mrvaibh</Link>
              </span>
            </h1>
            <div className="mt-2">
            <Link  href="https://x.com/compose/tweet?text=I've been using Confidant. My thoughts are..." target="_blank" rel="noopener noreferrer">
              <Button variant='secondary'>
                Share Your Thoughts On
                <Icons.twitter className="icon-class ml-1 w-3.5 " />
              </Button>
            </Link>
            </div>
            <p className="text-sm dark:text-gray-400 mt-5">
              © {new Date().getFullYear()} Confidant. All rights reserved.
            </p>
            <p className="text-sm dark:text-gray-400 mt-5">
              Thanks for the lovely template ❤️ -- by <Link href="https://ui.spectrumhq.in">Spectrum UI</Link> - <Link href="https://x.com/arihantCodes">Arihant Jain</Link>.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    Docs
                  </Link>
                </li>
                <li>
                  <Link href="/blocks" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    Blocks
                  </Link>
                </li>
                <li>
                  <Link href="/colors" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    Colors
                  </Link>
                </li>
               
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="https://github.com/mr-vaibh/confidant" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    Github
                  </Link>
                </li>
                <li>
                  <Link href="https://www.linkedin.com/in/mrvaibh" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="https://x.com/MrVaiBH0" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    X
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/tos" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              
              </ul>
            </div>
          </div>
        </div>      
      </div>
    </footer>
  );
}
