import React from 'react'
import Image from "next/image";
import { Label, DarkThemeToggle, useThemeMode } from "flowbite-react";
import {
    ConnectWallet,
  } from "@thirdweb-dev/react";

function NavBar() {

    const {mode } = useThemeMode();


  return (
    <nav className="bg-slate-100 shadow-lg dark:bg-slate-800 text-dark px-4 py-2 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
    {/* Left section: Title and Logo */}
    <div className="flex items-center space-x-4">
      <Image
        src={mode != "dark" ? "/images/logo.png" : "/images/logo-nosi-white.svg"}
        alt="Logo"
        className=""
        width={80}
        height={40}
      />
      <Label className="font-semibold text-lg">Digital Certificate Manager</Label>
    </div>

    <div className="flex flex-1 justify-end items-center">
      <div className="mr-8">
        <DarkThemeToggle />
      </div>

      <div>
        <ConnectWallet className="px-4 py-2" />
      </div>
    </div>
  </nav>
  )
}

export default NavBar