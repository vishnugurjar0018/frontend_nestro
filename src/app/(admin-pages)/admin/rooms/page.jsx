"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";

import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdMoreVert,
  MdMeetingRoom,
  MdRefresh,
  MdClose,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";

// =====================================================
// API URL
// =====================================================

const API_URL = "http://localhost:5000/api/room";

// =====================================================
// ROOM PAGE
// =====================================================

export default function RoomPage() {

  // ===================================================
  // STATES
  // ===================================================

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const [error, setError] = useState("");


  // ===================================================
  // FETCH ALL ROOMS
  // ===================================================

  const fetchRooms = async () => {
    try {

      setLoading(true);
      setError("");

      console.log("GET ROOM API:", API_URL);

      const response = await axios.get(API_URL);

      console.log("ROOM API RESPONSE:", response.data);

      // Backend response:
      //
      // {
      //   success: true,
      //   message: "...",
      //   data: [...]
      // }

      if (response.data?.success) {

        setRooms(response.data.data || []);

      } else {

        setRooms([]);

        setError(
          response.data?.message ||
            "Unable to fetch rooms."
        );

      }

    } catch (err) {

      console.error("FETCH ROOM ERROR:", err);

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setRooms([]);

      setError(
        err.response?.data?.message ||
          "Unable to connect with backend API."
      );

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // LOAD DATA
  // ===================================================

  useEffect(() => {
    fetchRooms();
  }, []);


  // ===================================================
  // UPDATE STATUS
  // ===================================================

  const handleStatusChange = async (
    id,
    currentStatus
  ) => {

    try {

      setStatusUpdatingId(id);

      const newStatus = !currentStatus;

      console.log(
        "UPDATING ROOM STATUS:",
        id,
        newStatus
      );

      const response = await axios.patch(
        `${API_URL}/status/${id}`,
        {
          status: newStatus,
        }
      );

      console.log(
        "STATUS RESPONSE:",
        response.data
      );

      if (response.data?.success) {

        // Update UI immediately

        setRooms((prev) =>
          prev.map((room) =>
            room._id === id
              ? {
                  ...room,
                  status: newStatus,
                }
              : room
          )
        );

      } else {

        alert(
          response.data?.message ||
            "Status update failed."
        );

      }

    } catch (err) {

      console.error(
        "STATUS UPDATE ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update room status."
      );

    } finally {

      setStatusUpdatingId(null);

    }
  };


  // ===================================================
  // DELETE ROOM
  // ===================================================

  const handleDelete = async (id) => {

    const room = rooms.find(
      (item) => item._id === id
    );

    const roomName =
      room?.name || "this room";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${roomName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(id);

      console.log(
        "DELETE ROOM:",
        `${API_URL}/${id}`
      );

      const response = await axios.delete(
        `${API_URL}/${id}`
      );

      console.log(
        "DELETE RESPONSE:",
        response.data
      );

      if (response.data?.success) {

        setRooms((prev) =>
          prev.filter(
            (room) =>
              room._id !== id
          )
        );

        setOpenMenu(null);

        alert(
          response.data.message ||
            "Room deleted successfully."
        );

      } else {

        alert(
          response.data?.message ||
            "Room delete failed."
        );

      }

    } catch (err) {

      console.error(
        "DELETE ROOM ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to delete room."
      );

    } finally {

      setDeletingId(null);

    }
  };


  // ===================================================
  // SEARCH
  // ===================================================

  const filteredRooms = useMemo(() => {

    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return rooms;
    }

    return rooms.filter((room) => {

      const name =
        room.name?.toLowerCase() || "";

      const slug =
        room.slug?.toLowerCase() || "";

      return (
        name.includes(searchText) ||
        slug.includes(searchText)
      );

    });

  }, [rooms, search]);


  // ===================================================
  // STATS
  // ===================================================

  const totalRooms = rooms.length;

  const activeRooms = rooms.filter(
    (room) => room.status === true
  ).length;

  const inactiveRooms =
    rooms.filter(
      (room) => room.status !== true
    ).length;


  // ===================================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // ===================================================

  useEffect(() => {

    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    if (openMenu) {

      document.addEventListener(
        "click",
        handleClickOutside
      );

    }

    return () => {

      document.removeEventListener(
        "click",
        handleClickOutside
      );

    };

  }, [openMenu]);


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="min-h-screen bg-[#f6f8fb]">

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="w-full px-5 py-6 sm:px-7 lg:px-10">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00a99d] text-white shadow-sm">

                <MdMeetingRoom className="text-[24px]" />

              </div>


              <div>

                <h1 className="text-[25px] font-bold tracking-[-0.4px] text-[#101828]">
                  Room Management
                </h1>

                <p className="mt-0.5 text-[13px] text-[#667085]">
                  Manage and organize your rooms
                </p>

              </div>

            </div>

          </div>


          {/* ADD BUTTON */}

          <Link
            href="/admin/rooms/add"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#00a99d] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(0,169,157,0.18)] transition hover:bg-[#008f85] hover:shadow-[0_6px_16px_rgba(0,169,157,0.25)]"
          >

            <MdAdd className="text-[21px]" />

            <span>
              Add Room
            </span>

          </Link>

        </div>


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">


          {/* TOTAL */}

          <div className="rounded-2xl border border-[#e7eaf0] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.04)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[12px] font-medium text-[#667085]">
                  Total Rooms
                </p>

                <h2 className="mt-1 text-[26px] font-bold text-[#101828]">
                  {totalRooms}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6fffc] text-[#00a99d]">

                <MdMeetingRoom className="text-[23px]" />

              </div>

            </div>

          </div>


          {/* ACTIVE */}

          <div className="rounded-2xl border border-[#e7eaf0] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.04)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[12px] font-medium text-[#667085]">
                  Active Rooms
                </p>

                <h2 className="mt-1 text-[26px] font-bold text-[#101828]">
                  {activeRooms}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecfdf3] text-[#12b76a]">

                <MdCheckCircle className="text-[23px]" />

              </div>

            </div>

          </div>


          {/* INACTIVE */}

          <div className="rounded-2xl border border-[#e7eaf0] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.04)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[12px] font-medium text-[#667085]">
                  Inactive Rooms
                </p>

                <h2 className="mt-1 text-[26px] font-bold text-[#101828]">
                  {inactiveRooms}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f2] text-[#f04438]">

                <MdCancel className="text-[23px]" />

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            SEARCH + REFRESH
        ================================================= */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-[420px]">

            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[21px] text-[#98a2b3]" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by room name or slug..."
              className="h-12 w-full rounded-xl border border-[#e4e7ec] bg-white pl-11 pr-10 text-[13px] text-[#101828] outline-none shadow-sm transition focus:border-[#00a99d] focus:ring-4 focus:ring-[#00a99d]/10 placeholder:text-[#98a2b3]"
            />

            {search && (

              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-[#98a2b3] transition hover:bg-[#f2f4f7] hover:text-[#344054]"
              >

                <MdClose className="text-[18px]" />

              </button>

            )}

          </div>


          <button
            type="button"
            onClick={fetchRooms}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e4e7ec] bg-white px-4 text-[13px] font-semibold text-[#344054] shadow-sm transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
          >

            <MdRefresh
              className={`text-[20px] ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            <span>
              Refresh
            </span>

          </button>

        </div>


        {/* =================================================
            API ERROR
        ================================================= */}

        {error && (

          <div className="mb-5 rounded-xl border border-[#fecdca] bg-[#fff6f5] px-4 py-3">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-[13px] font-semibold text-[#b42318]">
                  Unable to load rooms
                </p>

                <p className="mt-1 text-[12px] text-[#d92d20]">
                  {error}
                </p>

              </div>

              <button
                type="button"
                onClick={fetchRooms}
                className="rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-[#b42318] shadow-sm transition hover:bg-[#fef3f2]"
              >
                Retry
              </button>

            </div>

          </div>

        )}


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-[#e4e7ec] bg-white shadow-[0_3px_12px_rgba(16,24,40,0.05)]">


          {/* TABLE HEADER */}

          <div className="border-b border-[#eaecf0] bg-[#fcfcfd] px-5 py-4 sm:px-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-[14px] font-semibold text-[#101828]">
                  All Rooms
                </h3>

                <p className="mt-0.5 text-[11px] text-[#98a2b3]">

                  {filteredRooms.length} rooms

                  {search
                    ? " matching your search"
                    : ""}

                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-x-auto md:block">

            <div className="min-w-[850px]">


              {/* HEADER */}

              <div className="grid grid-cols-[90px_minmax(200px,1.2fr)_minmax(180px,1fr)_130px_80px] items-center border-b border-[#eaecf0] px-6 py-3.5">

                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#667085]">
                  Image
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#667085]">
                  Room
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#667085]">
                  Slug
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#667085]">
                  Status
                </div>

                <div className="text-right text-[10px] font-bold uppercase tracking-[0.08em] text-[#667085]">
                  Action
                </div>

              </div>


              {/* LOADING */}

              {loading && (

                <div className="px-6 py-20 text-center">

                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#e4e7ec] border-t-[#00a99d]" />

                  <p className="text-[13px] font-medium text-[#667085]">
                    Loading rooms...
                  </p>

                </div>

              )}


              {/* EMPTY */}

              {!loading &&
                !error &&
                filteredRooms.length === 0 && (

                  <div className="px-6 py-20 text-center">

                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2f4f7] text-[#98a2b3]">

                      <MdMeetingRoom className="text-[28px]" />

                    </div>

                    <p className="text-[14px] font-semibold text-[#344054]">

                      {search
                        ? "No rooms found"
                        : "No rooms available"}

                    </p>

                    <p className="mt-1 text-[12px] text-[#98a2b3]">

                      {search
                        ? "Try searching with another name or slug."
                        : "Create your first room to get started."}

                    </p>

                  </div>

                )}


              {/* ROWS */}

              {!loading &&
                filteredRooms.map(
                  (room) => (

                    <div
                      key={room._id}
                      className="group grid min-h-[88px] grid-cols-[90px_minmax(200px,1.2fr)_minmax(180px,1fr)_130px_80px] items-center border-b border-[#f2f4f7] px-6 transition hover:bg-[#fcfefd]"
                    >


                      {/* IMAGE */}

                      <div>

                        {room.image ? (

                          <img
                            src={room.image}
                            alt={
                              room.name ||
                              "Room"
                            }
                            className="h-12 w-12 rounded-xl border border-[#eaecf0] object-cover shadow-sm"
                            onError={(e) => {

                              e.currentTarget.style.display =
                                "none";

                              e.currentTarget.nextElementSibling.style.display =
                                "flex";

                            }}
                          />

                        ) : null}


                        <div
                          className={`${
                            room.image
                              ? "hidden"
                              : "flex"
                          } h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#e6fffc] to-[#f2f4f7] text-[#00a99d]`}
                        >

                          <MdMeetingRoom className="text-[23px]" />

                        </div>

                      </div>


                      {/* NAME */}

                      <div className="pr-6">

                        <p className="truncate text-[14px] font-semibold text-[#101828]">

                          {room.name ||
                            "Unnamed Room"}

                        </p>

                        <p className="mt-1 text-[11px] text-[#98a2b3]">

                          Room ID:{" "}

                          {room._id
                            ? room._id.slice(
                                -6
                              )
                            : "N/A"}

                        </p>

                      </div>


                      {/* SLUG */}

                      <div className="pr-6">

                        <span className="inline-flex max-w-full items-center rounded-lg bg-[#f8fafc] px-2.5 py-1.5 text-[12px] text-[#667085]">

                          <span className="truncate">

                            {room.slug ||
                              "-"}

                          </span>

                        </span>

                      </div>


                      {/* STATUS */}

                      <div>

                        <button
                          type="button"
                          disabled={
                            statusUpdatingId ===
                            room._id
                          }
                          onClick={() =>
                            handleStatusChange(
                              room._id,
                              room.status
                            )
                          }
                          className={`inline-flex min-w-[78px] items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            room.status
                              ? "bg-[#ecfdf3] text-[#027a48] hover:bg-[#d1fadf]"
                              : "bg-[#f2f4f7] text-[#667085] hover:bg-[#e4e7ec]"
                          }`}
                        >

                          {statusUpdatingId ===
                          room._id
                            ? "Updating..."
                            : room.status
                            ? "● Active"
                            : "○ Inactive"}

                        </button>

                      </div>


                      {/* ACTION */}

                      <div className="relative flex justify-end">

                        <button
                          type="button"
                          onClick={(e) => {

                            e.stopPropagation();

                            setOpenMenu(
                              openMenu ===
                                room._id
                                ? null
                                : room._id
                            );

                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#101828]"
                        >

                          <MdMoreVert className="text-[21px]" />

                        </button>


                        {openMenu ===
                          room._id && (

                          <div
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="absolute right-0 top-10 z-50 w-[145px] rounded-xl border border-[#e4e7ec] bg-white p-1.5 shadow-[0_10px_30px_rgba(16,24,40,0.14)]"
                          >


                            {/* EDIT */}

                            <Link
                              href={`/admin/rooms/edit/${room._id}`}
                              onClick={() =>
                                setOpenMenu(
                                  null
                                )
                              }
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] font-medium text-[#344054] transition hover:bg-[#f2f4f7]"
                            >

                              <MdEdit className="text-[18px]" />

                              <span>
                                Edit
                              </span>

                            </Link>


                            {/* DELETE */}

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                room._id
                              }
                              onClick={() =>
                                handleDelete(
                                  room._id
                                )
                              }
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-[#d92d20] transition hover:bg-[#fef3f2] disabled:opacity-50"
                            >

                              <MdDelete className="text-[18px]" />

                              <span>

                                {deletingId ===
                                room._id
                                  ? "Deleting..."
                                  : "Delete"}

                              </span>

                            </button>

                          </div>

                        )}

                      </div>

                    </div>

                  )
                )}

            </div>

          </div>


          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="md:hidden">

            {loading && (

              <div className="px-5 py-16 text-center">

                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#e4e7ec] border-t-[#00a99d]" />

                <p className="text-[13px] text-[#667085]">
                  Loading rooms...
                </p>

              </div>

            )}


            {!loading &&
              !error &&
              filteredRooms.length === 0 && (

                <div className="px-5 py-16 text-center">

                  <MdMeetingRoom className="mx-auto mb-3 text-[40px] text-[#d0d5dd]" />

                  <p className="text-[14px] font-semibold text-[#344054]">
                    No rooms found
                  </p>

                </div>

              )}


            {!loading &&
              filteredRooms.map(
                (room) => (

                  <div
                    key={room._id}
                    className="relative border-b border-[#f2f4f7] p-5"
                  >

                    <div className="flex items-start gap-4">


                      {/* IMAGE */}

                      <div className="shrink-0">

                        {room.image ? (

                          <img
                            src={room.image}
                            alt={
                              room.name ||
                              "Room"
                            }
                            className="h-14 w-14 rounded-xl border border-[#eaecf0] object-cover"
                          />

                        ) : (

                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e6fffc] text-[#00a99d]">

                            <MdMeetingRoom className="text-[25px]" />

                          </div>

                        )}

                      </div>


                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">

                            <p className="truncate text-[14px] font-semibold text-[#101828]">

                              {room.name ||
                                "Unnamed Room"}

                            </p>

                            <p className="mt-1 truncate text-[12px] text-[#667085]">

                              {room.slug ||
                                "-"}

                            </p>

                          </div>


                          {/* MENU */}

                          <div className="relative shrink-0">

                            <button
                              type="button"
                              onClick={(e) => {

                                e.stopPropagation();

                                setOpenMenu(
                                  openMenu ===
                                    room._id
                                    ? null
                                    : room._id
                                );

                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#667085] hover:bg-[#f2f4f7]"
                            >

                              <MdMoreVert className="text-[20px]" />

                            </button>


                            {openMenu ===
                              room._id && (

                              <div
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                                className="absolute right-0 top-9 z-50 w-[135px] rounded-xl border border-[#e4e7ec] bg-white p-1.5 shadow-lg"
                              >

                                <Link
                                  href={`/admin/room/edit/${room._id}`}
                                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[12px] text-[#344054] hover:bg-[#f2f4f7]"
                                >

                                  <MdEdit />

                                  Edit

                                </Link>


                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      room._id
                                    )
                                  }
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] text-[#d92d20] hover:bg-[#fef3f2]"
                                >

                                  <MdDelete />

                                  Delete

                                </button>

                              </div>

                            )}

                          </div>

                        </div>


                        <div className="mt-3">

                          <button
                            type="button"
                            disabled={
                              statusUpdatingId ===
                              room._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                room._id,
                                room.status
                              )
                            }
                            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                              room.status
                                ? "bg-[#ecfdf3] text-[#027a48]"
                                : "bg-[#f2f4f7] text-[#667085]"
                            }`}
                          >

                            {statusUpdatingId ===
                            room._id
                              ? "Updating..."
                              : room.status
                              ? "● Active"
                              : "○ Inactive"}

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

          </div>

        </div>


        {/* =================================================
            FOOTER COUNT
        ================================================= */}

        <div className="mt-4 flex flex-col gap-2 text-[12px] text-[#667085] sm:flex-row sm:items-center sm:justify-between">

          <p>

            Showing{" "}

            <span className="font-semibold text-[#344054]">
              {filteredRooms.length}
            </span>{" "}

            of{" "}

            <span className="font-semibold text-[#344054]">
              {rooms.length}
            </span>{" "}

            rooms

          </p>


          {search && (

            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="font-medium text-[#00a99d] hover:underline"
            >

              Clear search

            </button>

          )}

        </div>


      </div>

    </div>

  );
}