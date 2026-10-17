"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { generateSlug } from "@/utils/helper";

import {
  MdArrowBack,
  MdMeetingRoom,
  MdLink,
  MdCloudUpload,
  MdSave,
} from "react-icons/md";

import { useRouter } from "next/navigation";


// =====================================================
// API URL
// =====================================================

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/room`;


// =====================================================
// ADD ROOM PAGE
// =====================================================

export default function AddRoomPage() {

  const router = useRouter();


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: null,
    status: true,
  });


  // =====================================================
  // SAVING STATE
  // =====================================================

  const [saving, setSaving] = useState(false);


  // =====================================================
  // IMAGE NAME - ONLY UI
  // =====================================================

  const [imageName, setImageName] = useState("");


  // =====================================================
  // ROOM NAME CHANGE
  // =====================================================

  const handleNameChange = (e) => {

    const name = e.target.value;

    setFormData((prev) => ({
      ...prev,
      name: name,
      slug: generateSlug(name),
    }));

  };


  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }


    // =================================================
    // FILE TYPE VALIDATION
    // =================================================

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];


    if (!allowedTypes.includes(file.type)) {

      toast.error(
        "Only PNG, JPG and WEBP images are allowed."
      );

      e.target.value = "";

      return;
    }


    // =================================================
    // FILE SIZE VALIDATION - 1MB
    // =================================================

    if (file.size > 1 * 1024 * 1024) {

      toast.error(
        "Image size must be less than 1MB."
      );

      e.target.value = "";

      return;
    }


    // =================================================
    // SAVE IMAGE
    // =================================================

    setImageName(file.name);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

  };


  // =====================================================
  // SAVE ROOM
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // =================================================
    // VALIDATION
    // =================================================

    if (!formData.name.trim()) {

      toast.error(
        "Please enter room name"
      );

      return;
    }


    if (!formData.slug.trim()) {

      toast.error(
        "Room slug could not be generated"
      );

      return;
    }


    try {

      setSaving(true);


      // =================================================
      // FORM DATA
      // =================================================

      const data = new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "slug",
        formData.slug
      );

      data.append(
        "status",
        "true"
      );


      // =================================================
      // IMAGE
      // =================================================

      if (formData.image) {

        data.append(
          "image",
          formData.image
        );

      }


      // =================================================
      // ROOM API REQUEST
      // =================================================

      const response = await axios.post(
        `${API_URL}/create`,
        data
      );


      console.log(
        "Create Room Response:",
        response.data
      );


      // =================================================
      // SUCCESS
      // =================================================

      if (response.data.success) {

        toast.success(
          "Room created successfully"
        );


        // Room listing page

        router.push(
          "/admin/rooms"
        );

        return;
      }


      // =================================================
      // API ERROR
      // =================================================

      toast.error(
        response.data.message ||
        "Room create failed"
      );


    } catch (error) {

      console.error(
        "Create room error:",
        error
      );


      // =================================================
      // BACKEND ERROR MESSAGE
      // =================================================

      if (error.response?.data?.message) {

        toast.error(
          error.response.data.message
        );

      } else {

        toast.error(
          "Unable to create room. Please check whether backend API is running."
        );

      }


    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // PAGE UI
  // =====================================================

  return (

    <div className="min-h-screen bg-[#f8fafc]">


      {/* =====================================================
          PAGE CONTAINER
      ====================================================== */}

      <div className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">


        {/* =====================================================
            BACK BUTTON
        ====================================================== */}

        <Link
          href="/admin/rooms"
          className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-[#667085] transition hover:text-[#00a99d]"
        >

          <MdArrowBack className="text-[19px]" />

          <span>
            Back to Rooms
          </span>

        </Link>


        {/* =====================================================
            PAGE HEADING
        ====================================================== */}

        <div className="mb-6">

          <h1 className="text-[25px] font-bold leading-tight tracking-[-0.3px] text-[#101828] sm:text-[28px]">

            Add New Room

          </h1>


          <p className="mt-1.5 text-[14px] text-[#667085]">

            Create a new room for your store

          </p>

        </div>


        {/* =====================================================
            FORM CARD
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#e4e7ec] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.04)]"
        >


          {/* ===================================================
              FORM CONTENT
          ==================================================== */}

          <div className="p-5 sm:p-7">


            {/* =================================================
                ROOM NAME
            ================================================== */}

            <div className="mb-6">

              <label className="mb-2 block text-[13px] font-semibold text-[#344054]">

                Room Name{" "}

                <span className="text-[#ef4444]">
                  *
                </span>

              </label>


              <div className="relative">

                <MdMeetingRoom
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[21px] text-[#98a2b3]"
                />


                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Bedroom, Living Room, Kitchen"
                  maxLength={30}
                  className="h-[48px] w-full rounded-xl border border-[#d0d5dd] bg-white pl-11 pr-4 text-[14px] text-[#101828] outline-none transition placeholder:text-[#98a2b3] hover:border-[#b8bec8] focus:border-[#00a99d] focus:ring-4 focus:ring-[#00a99d]/10"
                />

              </div>


              <p className="mt-1.5 text-[12px] text-[#98a2b3]">

                This is how the room will appear in your system.

              </p>

            </div>


            {/* =================================================
                SLUG
            ================================================== */}

            <div className="mb-6">

              <label className="mb-2 block text-[13px] font-semibold text-[#344054]">

                Slug

              </label>


              <div className="relative">

                <MdLink
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-[#98a2b3]"
                />


                <input
                  type="text"
                  value={formData.slug}
                  readOnly
                  placeholder="auto-generated-slug"
                  className="h-[48px] w-full cursor-not-allowed rounded-xl border border-[#d0d5dd] bg-[#f9fafb] pl-11 pr-4 text-[14px] text-[#667085] outline-none placeholder:text-[#98a2b3]"
                />

              </div>


              <p className="mt-1.5 text-[12px] text-[#98a2b3]">

                URL-friendly name. This will be generated automatically.

              </p>

            </div>


            {/* =================================================
                ROOM IMAGE
            ================================================== */}

            <div>

              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                <label className="block text-[13px] font-semibold text-[#344054]">

                  Room Image

                </label>


                <span className="text-[11px] font-medium text-[#98a2b3]">

                  Recommended: 800 × 800px

                </span>

              </div>


              {/* =================================================
                  HIDDEN FILE INPUT
              ================================================== */}

              <input
                id="room-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />


              {/* =================================================
                  UPLOAD AREA
              ================================================== */}

              <label
                htmlFor="room-image"
                className="group flex min-h-[205px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d0d5dd] bg-[#fcfcfd] px-6 text-center transition-all duration-200 hover:border-[#00a99d] hover:bg-[#f8fffe]"
              >


                {/* Upload Icon */}

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f4f7] transition-all duration-200 group-hover:bg-[#e6fffc]">

                  <MdCloudUpload
                    className="text-[30px] text-[#98a2b3] transition group-hover:text-[#00a99d]"
                  />

                </div>


                {/* Selected File */}

                {imageName ? (

                  <>

                    <p className="max-w-full truncate px-4 text-[14px] font-semibold text-[#344054]">

                      {imageName}

                    </p>


                    <p className="mt-1 text-[13px] text-[#00a99d]">

                      Click to choose another image

                    </p>

                  </>

                ) : (

                  <>

                    <p className="text-[14px] font-semibold text-[#344054]">

                      Drag & drop your room image here

                    </p>


                    <p className="mt-1 text-[13px] text-[#667085]">

                      or{" "}

                      <span className="font-semibold text-[#00a99d]">

                        browse files

                      </span>

                    </p>

                  </>

                )}


                {/* File Types */}

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">

                  <span className="rounded-md bg-[#f2f4f7] px-2 py-1 text-[10px] font-medium text-[#667085]">

                    PNG

                  </span>


                  <span className="rounded-md bg-[#f2f4f7] px-2 py-1 text-[10px] font-medium text-[#667085]">

                    JPG

                  </span>


                  <span className="rounded-md bg-[#f2f4f7] px-2 py-1 text-[10px] font-medium text-[#667085]">

                    WEBP

                  </span>


                  <span className="text-[11px] text-[#98a2b3]">

                    Max 1MB

                  </span>

                </div>

              </label>


              {/* Image Info */}

              <p className="mt-2 text-[11px] text-[#98a2b3]">

                Room image will be uploaded to Cloudinary and saved in the Room API.

              </p>

            </div>


          </div>


          {/* ===================================================
              CARD FOOTER
          ==================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-[#eaecf0] bg-[#fcfcfd] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">


            {/* Cancel */}

            <Link
              href="/admin/rooms"
              className="flex h-[42px] w-full items-center justify-center rounded-lg border border-[#d0d5dd] bg-white px-5 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f9fafb] sm:w-auto sm:min-w-[100px]"
            >

              Cancel

            </Link>


            {/* Save */}

            <button
              type="submit"
              disabled={saving}
              className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#00a99d] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#008f85] focus:outline-none focus:ring-4 focus:ring-[#00a99d]/15 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[145px]"
            >

              <MdSave className="text-[19px]" />


              {saving
                ? "Saving..."
                : "Save Room"
              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}