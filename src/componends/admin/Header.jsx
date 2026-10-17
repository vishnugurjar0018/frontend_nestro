"use client";

import {
  MdSearch,
  MdNotificationsNone,
  MdKeyboardArrowDown,
} from "react-icons/md";

export default function Header() {
  return (
    <header className="fixed left-[330px] right-0 top-0 z-40 h-[82px] border-b border-gray-200 bg-white">
      
      <div className="flex h-full items-center justify-between px-8">

        {/* ================= LEFT ================= */}
        <div className="min-w-[200px]">
          <h1 className="text-[17px] font-bold leading-tight text-[#101828]">
            Dashboard
          </h1>

          <p className="mt-1 text-[13px] text-[#667085]">
            Welcome back 👋
          </p>
        </div>


        {/* ================= SEARCH ================= */}
        <div className="mx-8 flex w-full max-w-[500px] items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">

          <MdSearch className="mr-3 text-[25px] text-[#98A2B3]" />

          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent text-[15px] text-gray-700 outline-none placeholder:text-[#D0D5DD]"
          />

        </div>


        {/* ================= RIGHT ================= */}
        <div className="flex min-w-[270px] items-center justify-end">

          {/* Notification */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#475467] transition hover:bg-gray-100"
          >
            <MdNotificationsNone className="text-[29px]" />

            {/* Notification Dot */}
            <span className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full bg-[#00A99D]" />
          </button>


          {/* Divider */}
          <div className="mx-5 h-9 w-px bg-gray-200" />


          {/* Profile */}
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
          >

            {/* Avatar */}
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#00A99D] text-[18px] font-semibold text-white ring-4 ring-[#E6F7F5]">
              A
            </div>


            {/* Name */}
            <div className="text-left">
              <p className="text-[13px] font-semibold leading-tight text-[#101828]">
                Admin
              </p>

              <p className="mt-1 text-[10px] text-[#667085]">
                Super Admin
              </p>
            </div>


            {/* Arrow */}
            <MdKeyboardArrowDown className="ml-1 text-[22px] text-[#98A2B3]" />

          </button>

        </div>

      </div>

    </header>
  );
}