"use client";

import Link from "next/link";

import { Search, Home, ShoppingBag, Bell, User } from "lucide-react";
import shortLogo from "@/assets/short-logo.svg"
import Image from "next/image"

export function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            <Image 
            src={shortLogo} 
            alt="Logo da Plataforma" 
            width={80} 
            height={40}
            className="h-14 w-auto"
          />
          </Link>

          {/* Ícones da direita */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Home className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <ShoppingBag className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <Link href="/login">
              <button className="p-2 hover:bg-gray-100 rounded">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}