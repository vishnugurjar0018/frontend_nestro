"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  MdArrowBack,
  MdMeetingRoom,
  MdLink,
  MdCloudUpload,
  MdSave,
} from "react-icons/md";


// =====================================================
// API URL
// =====================================================

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/room`;


// =====================================================
// SLUG GENERATOR
// =====================================================

const generateSlug = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};


// =====================================================
// EDIT ROOM PAGE
// =====================================================

export default function EditRoomPage() {

  const params = useParams();
  const router = useRouter();


  // =====================================================
  // ROOM ID
  // =====================================================

  const roomId = params.rooms_id;


  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: true,
    image: null,
  });

  const [imageName, setImageName] = useState("");

  const [oldImage, setOldImage] = useState("");


// =====================================================
// GET ROOM
// =====================================================

  useEffect(() => {

    if (!roomId) {
      return;
    }


    const fetchRoom = async () => {

      try {

        setLoading(true);


        // =================================================
        // GET ROOM API
        // =================================================

        const response = await axios.get(
          `${API_URL}/${roomId}`
        );


        console.log(
          "Get Room Response:",
          response.data
        );


        const room = response.data.data;


        if (!room) {

          toast.error(
            "Room not found"
          );

          router.push("/admin/rooms");

          return;
        }


        // =================================================
        // SET ROOM DATA
        // =================================================

        setFormData({
          name: room.name || "",
          slug: room.slug || "",
          status: room.status ?? true,
          image: null,
        });


        // Existing Cloudinary image

        setOldImage(
          room.image || ""
        );


      } catch (error) {

        console.error(
          "FETCH ROOM ERROR:",
          error
        );


        toast.error(
          error.response?.data?.message ||
          "Room fetch nahi ho payi"
        );


        router.push(
          "/admin/rooms"
        );


      } finally {

        setLoading(false);

      }

    };


    fetchRoom();

  }, [roomId, router]);


// =====================================================
// INPUT CHANGE
// =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


// =====================================================
// ROOM NAME CHANGE
// =====================================================

  const handleNameChange = (e) => {

    const name = e.target.value;


    setFormData((prev) => ({
      ...prev,
      name,
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
    // FILE TYPE
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
    // FILE SIZE - 1MB
    // =================================================

    if (file.size > 1 * 1024 * 1024) {

      toast.error(
        "Image size 1 MB se kam honi chahiye"
      );

      e.target.value = "";

      return;
    }


    // =================================================
    // SET NEW IMAGE
    // =================================================

    setImageName(
      file.name
    );


    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

  };


// =====================================================
// SUBMIT / UPDATE ROOM
// =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // =================================================
    // VALIDATION
    // =================================================

    if (!formData.name.trim()) {

      toast.error(
        "Room name required hai"
      );

      return;
    }


    if (!formData.slug.trim()) {

      toast.error(
        "Room slug required hai"
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
        formData.slug.trim()
      );


      data.append(
        "status",
        formData.status
      );


      // =================================================
      // NEW IMAGE
      // =================================================

      if (formData.image) {

        data.append(
          "image",
          formData.image
        );

      }


      // =================================================
      // ROOM UPDATE API
      // =================================================

      const response = await axios.patch(
        `${API_URL}/${roomId}`,
        data
      );


      console.log(
        "Update Room Response:",
        response.data
      );


      // =================================================
      // SUCCESS
      // =================================================

      if (response.data.success) {

        toast.success(
          response.data.message ||
          "Room updated successfully"
        );


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
        "Room update failed"
      );


    } catch (error) {

      console.error(
        "UPDATE ROOM ERROR:",
        error
      );


      toast.error(
        error.response?.data?.message ||
        "Room update nahi ho payi"
      );


    } finally {

      setSaving(false);

    }

  };


// =====================================================
// LOADING
// =====================================================

  if (loading) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-gray-500">

          Loading room...

        </div>

      </div>

    );

  }


// =====================================================
// PAGE UI
// =====================================================

  return (

    <div className="min-h-screen bg-[#f8fafc] p-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3">


            {/* BACK */}

            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
            >

              <MdArrowBack className="text-xl" />

            </button>


            <div>

              <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">

                <MdMeetingRoom className="text-[#00a99d]" />

                Edit Room

              </h1>


              <p className="mt-1 text-sm text-gray-500">

                Update your room details

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          FORM CARD
      ================================================= */}

      <div className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <form onSubmit={handleSubmit}>


          {/* =================================================
              ROOM NAME
          ================================================= */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Room Name

            </label>


            <div className="relative">

              <MdMeetingRoom
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400"
              />


              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Enter room name"
                maxLength={30}
                className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#00a99d] focus:ring-2 focus:ring-[#00a99d]/10"
              />

            </div>

          </div>


          {/* =================================================
              SLUG
          ================================================= */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Slug

            </label>


            <div className="relative">

              <MdLink
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400"
              />


              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="room-slug"
                className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#00a99d] focus:ring-2 focus:ring-[#00a99d]/10"
              />

            </div>


            <p className="mt-1 text-xs text-gray-400">

              Room name change karne par slug automatically update hoga.

            </p>

          </div>


          {/* =================================================
              ROOM IMAGE
          ================================================= */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Room Image

            </label>


            {/* =================================================
                OLD IMAGE
            ================================================= */}

            {oldImage && (

              <div className="mb-4">

                <p className="mb-2 text-xs text-gray-500">

                  Current Image

                </p>


                <img
                  src={oldImage}
                  alt="Current room"
                  className="h-24 w-24 rounded-xl border border-gray-200 object-cover"
                />

              </div>

            )}


            {/* =================================================
                NEW IMAGE UPLOAD
            ================================================= */}

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition hover:border-[#00a99d] hover:bg-[#f0fffd]">


              <MdCloudUpload className="mb-2 text-4xl text-[#00a99d]" />


              <p className="text-sm font-medium text-gray-700">

                {imageName
                  ? imageName
                  : "Click to upload new room image"
                }

              </p>


              <p className="mt-1 text-xs text-gray-400">

                JPG, JPEG, PNG or WEBP • Max 1 MB

              </p>


              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
                className="hidden"
              />

            </label>


            <p className="mt-2 text-xs text-gray-400">

              New image select nahi karne par current image same rahegi.

            </p>

          </div>


          {/* =================================================
              STATUS
          ================================================= */}

          <div className="mb-7">

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Status

            </label>


            <select
              name="status"
              value={
                formData.status
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status:
                    e.target.value === "true",
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00a99d] focus:ring-2 focus:ring-[#00a99d]/10"
            >

              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>

            </select>

          </div>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">


            {/* CANCEL */}

            <button
              type="button"
              onClick={() =>
                router.push("/admin/rooms")
              }
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >

              Cancel

            </button>


            {/* UPDATE */}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#00a99d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#008f85] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <MdSave className="text-xl" />


              {saving
                ? "Updating..."
                : "Update Room"
              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}