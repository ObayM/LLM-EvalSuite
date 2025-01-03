import React from 'react';
import { BarChart2, Settings, Bell, User } from 'lucide-react';
import Link from 'next/link';
const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-semibold text-gray-800">LLM Evaluation Platform</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link href="/projects" className="text-gray-600 hover:text-blue-600 transition-colors">
            Projects
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;