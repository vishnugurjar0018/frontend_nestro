"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  MdDashboard,
  MdCategory,
  MdInventory2,
  MdMeetingRoom,
  MdPalette,
  MdSettings,
  MdLogout,
  MdMenuOpen,
  MdMenu,
} from "react-icons/md";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: MdDashboard,
  },
  {
    name: "Category",
    href: "/admin/category",
    icon: MdCategory,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: MdInventory2,
  },
  {
    name: "Rooms",
    href: "/admin/rooms",
    icon: MdMeetingRoom,
  },
  {
    name: "Website Content",
    href: "/admin/website-content",
    icon: MdPalette,
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-[#0d1b2a] text-white transition-all duration-300 ${
        collapsed ? "w-[80px]" : "w-[330px]"
      }`}
    >

      {/* =====================================================
          LOGO
      ====================================================== */}
      <div
        className={`flex h-[82px] shrink-0 items-center border-b border-white/10 ${
          collapsed
            ? "justify-center px-2"
            : "justify-between px-5"
        }`}
      >

        {/* Logo */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >

          {/* Logo Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00b8a9]">
            <MdDashboard className="text-[30px] text-white" />
          </div>


          {/* Logo Text */}
          {!collapsed && (
            <div>
              <h1 className="text-[16px] font-bold leading-tight">
                AdminPanel
              </h1>

              <p className="mt-1 text-[12px] font-medium text-[#00c8b8]">
                Pro Dashboard
              </p>
            </div>
          )}

        </div>


        {/* Collapse Button */}
        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[22px] text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <MdMenuOpen />
          </button>
        )}

        {/* Open Button */}
        {collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute -right-10 top-6 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d1b2a] text-[22px] text-slate-400 shadow-md transition hover:text-white"
          >
            <MdMenu />
          </button>
        )}

      </div>


      {/* =====================================================
          MIDDLE MENU AREA
      ====================================================== */}
      <div className="flex-1 px-3 py-6">

        {/* Main Menu Heading */}
        {!collapsed && (
          <p className="mb-4 px-2 text-[12px] font-semibold tracking-[2px] text-slate-500">
            MAIN MENU
          </p>
        )}


        {/* Main Menu */}
        <nav className="space-y-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : ""}
                className={`group relative flex h-[44px] items-center rounded-2xl transition-all duration-200 ${
                  collapsed
                    ? "justify-center px-2"
                    : "gap-4 px-4"
                } ${
                  isActive
                    ? "bg-[#063f49] text-[#00d4c4]"
                    : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
                }`}
              >

                {/* Active Line */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-9 w-[3px] -translate-y-1/2 rounded-r-full bg-[#00d4c4]" />
                )}


                {/* Icon */}
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                    isActive
                      ? "bg-[#07545e]"
                      : "group-hover:bg-white/5"
                  }`}
                >
                  <Icon className="text-[23px]" />
                </span>


                {/* Name */}
                {!collapsed && (
                  <span className="text-[16px] font-medium">
                    {item.name}
                  </span>
                )}

              </Link>
            );
          })}

        </nav>


        {/* =====================================================
            SYSTEM
        ====================================================== */}
        <div className="mt-5 border-t border-white/10 pt-5">

          {/* System Heading */}
          {!collapsed && (
            <p className="mb-3 px-2 text-[12px] font-semibold tracking-[2px] text-slate-500">
              SYSTEM
            </p>
          )}


          {/* Settings */}
          <Link
            href="/settings"
            title={collapsed ? "Settings" : ""}
            className={`group relative flex h-[44px] items-center rounded-2xl transition-all duration-200 ${
              collapsed
                ? "justify-center px-2"
                : "gap-4 px-4"
            } ${
              pathname === "/settings"
                ? "bg-[#063f49] text-[#00d4c4]"
                : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
            }`}
          >

            {/* Active Line */}
            {pathname === "/settings" && (
              <span className="absolute left-0 top-1/2 h-9 w-[3px] -translate-y-1/2 rounded-r-full bg-[#00d4c4]" />
            )}


            {/* Settings Icon */}
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                pathname === "/settings"
                  ? "bg-[#07545e]"
                  : "group-hover:bg-white/5"
              }`}
            >
              <MdSettings className="text-[20px]" />
            </span>


            {/* Settings Text */}
            {!collapsed && (
              <span className="text-[16px] font-medium">
                Settings
              </span>
            )}

          </Link>

        </div>

      </div>


      {/* =====================================================
          ADMIN PROFILE
      ====================================================== */}
      <div
        className={`shrink-0 border-t border-white/10 bg-[#0d1b2a] py-5 ${
          collapsed ? "px-2" : "px-5"
        }`}
      >

        <div
          className={`flex items-center ${
            collapsed
              ? "justify-center"
              : "justify-between"
          }`}
        >

          {/* Profile */}
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >

            {/* Avatar */}
            <div className="relative">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00a99d] text-[18px] font-semibold text-white">
                A
              </div>

              {/* Online Dot */}
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0d1b2a] bg-[#00d4a8]" />

            </div>


            {/* User Details */}
            {!collapsed && (
              <div>
                <p className="text-[16px] font-semibold leading-tight text-white">
                  Admin
                </p>

                <p className="mt-1 text-[13px] text-slate-500">
                  Super Admin
                </p>
              </div>
            )}

          </div>


          {/* Logout */}
          {!collapsed && (
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[21px] text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <MdLogout />
            </button>
          )}

        </div>

      </div>

    </aside>
  );
}