

"use client";



import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {

  UserRound,

  Package,

  MapPin,

  ShieldCheck,

  LogOut,

  ChevronRight,

  Mail,

  Phone,

  CalendarDays,

  ShoppingBag,

  ArrowRight,

  Pencil,

  LoaderCircle,

  AlertCircle,

  Plus,

  Trash2,

  Star,

  X,

  Eye,

  EyeOff,

} from "lucide-react";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");



const EMPTY_ADDRESS = {

  fullName: "",

  phone: "",

  addressLine1: "",

  addressLine2: "",

  landmark: "",

  city: "",

  state: "",

  pincode: "",

  addressType: "Home",

  isDefault: false,

};



const menuItems = [

  { id: "profile", label: "Personal Information", icon: UserRound },

  { id: "orders", label: "My Orders", icon: Package },

  { id: "addresses", label: "Saved Addresses", icon: MapPin },

  { id: "security", label: "Account Settings", icon: ShieldCheck },

];



const inputClass =

  "w-full rounded-xl border border-[#d8c5b4] bg-white px-4 py-3 text-sm text-[#38261e] placeholder:text-[#75665b] outline-none focus:border-[#a66e43] focus:ring-2 focus:ring-[#a66e43]/20";



const selectClass =

  "w-full rounded-xl border border-[#d8c5b4] bg-white px-4 py-3 text-sm text-[#38261e] outline-none focus:border-[#a66e43] focus:ring-2 focus:ring-[#a66e43]/20";



function SectionHeading({ eyebrow, title, description }) {

  return (

    <div className="mb-7">

      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a66e43]">

        {eyebrow}

      </p>

      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#38261e] sm:text-3xl">

        {title}

      </h2>

      <p className="mt-2 text-sm leading-6 text-[#81766d]">

        {description}

      </p>

    </div>

  );

}



function DetailCard({ icon: Icon, label, value }) {

  return (

    <div className="rounded-xl border border-[#eee5dc] bg-white p-4 sm:p-5">

      <div className="flex items-center gap-2 text-[#a66e43]">

        <Icon size={17} />

        <span className="text-xs font-medium uppercase tracking-wider">

          {label}

        </span>

      </div>

      <p className="mt-3 break-words text-sm font-medium text-[#38261e]">

        {value || "Not provided"}

      </p>

    </div>

  );

}



export default function ProfilePage() {

  const router = useRouter();



  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loggingOut, setLoggingOut] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");



  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [nameDraft, setNameDraft] = useState("");

  const [phoneDraft, setPhoneDraft] = useState("");



  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const [addressLoading, setAddressLoading] = useState(false);

  const [addressSaving, setAddressSaving] = useState(false);

  const [addressActionId, setAddressActionId] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({ ...EMPTY_ADDRESS });



  // Account security state

  const [securityBusy, setSecurityBusy] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");



  const [newEmail, setNewEmail] = useState("");

  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");

  const [emailOtp, setEmailOtp] = useState("");

  const [emailOtpSent, setEmailOtpSent] = useState(false);



  // Password visibility

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const handleUnauthorized = useCallback(() => {

    router.replace(`/sign-in?redirect=${encodeURIComponent("/profile")}`);

  }, [router]);



  // GET PROFILE API

  useEffect(() => {

    let cancelled = false;



    async function loadProfile() {

      try {

        if (!API_BASE_URL) {

          throw new Error(

            "API URL configured nahi hai. .env.local check karein."

          );

        }



        const response = await fetch(`${API_BASE_URL}/profile`, {

          method: "GET",

          credentials: "include",

          cache: "no-store",

          headers: { Accept: "application/json" },

        });



        const data = await response.json().catch(() => ({}));



        if (response.status === 401 || response.status === 403) {

          handleUnauthorized();

          return;

        }



        if (!response.ok || !data.success || !data.user) {

          throw new Error(data.message || "Unable to load your profile.");

        }



        if (!cancelled) {

          setUser(data.user);

          setNameDraft(data.user.name || "");

          setPhoneDraft(data.user.phone || "");

          setError("");

        }

      } catch (err) {

        if (!cancelled) setError(err.message || "Something went wrong.");

      } finally {

        if (!cancelled) setLoading(false);

      }

    }



    loadProfile();



    return () => {

      cancelled = true;

    };

  }, [handleUnauthorized]);



  // GET MY ORDERS API
  const loadOrders = useCallback(async () => {
    if (!API_BASE_URL) {
      setError("API URL configured nahi hai. .env.local check karein.");
      return;
    }

    setOrdersLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Orders load nahi ho paye.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setOrdersLoaded(true);
    } catch (err) {
      setError(err.message || "Orders load karne mein error aaya.");
    } finally {
      setOrdersLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    if (activeTab === "orders" && user && !ordersLoaded) {
      loadOrders();
    }
  }, [activeTab, user, ordersLoaded, loadOrders]);


  // GET ADDRESSES API

  const loadAddresses = useCallback(async () => {

    if (!API_BASE_URL) {

      setError("API URL configured nahi hai.");

      return;

    }



    setAddressLoading(true);

    setError("");



    try {

      const response = await fetch(`${API_BASE_URL}/addresses`, {

        method: "GET",

        credentials: "include",

        cache: "no-store",

        headers: { Accept: "application/json" },

      });



      const data = await response.json().catch(() => ({}));



      if (response.status === 401 || response.status === 403) {

        handleUnauthorized();

        return;

      }



      if (!response.ok || !data.success) {

        throw new Error(data.message || "Addresses load nahi ho paye.");

      }



      setAddresses(Array.isArray(data.addresses) ? data.addresses : []);

    } catch (err) {

      setError(err.message || "Address load karne mein error aaya.");

    } finally {

      setAddressLoading(false);

    }

  }, [handleUnauthorized]);



  useEffect(() => {

    if (activeTab === "addresses" && user) loadAddresses();

  }, [activeTab, user, loadAddresses]);



  // UPDATE PROFILE API

  const handleSaveProfile = async (e) => {

    e.preventDefault();

    if (saving) return;



    setSaving(true);

    setError("");

    setSuccess("");



    try {

      const response = await fetch(`${API_BASE_URL}/profile`, {

        method: "PUT",

        credentials: "include",

        headers: {

          "Content-Type": "application/json",

          Accept: "application/json",

        },

        body: JSON.stringify({

          name: nameDraft.trim(),

          phone: phoneDraft.trim(),

        }),

      });



      const data = await response.json().catch(() => ({}));



      if (response.status === 401 || response.status === 403) {

        handleUnauthorized();

        return;

      }



      if (!response.ok || !data.success || !data.user) {

        throw new Error(data.message || "Profile update nahi ho paya.");

      }



      setUser(data.user);

      setNameDraft(data.user.name || "");

      setPhoneDraft(data.user.phone || "");

      setEditing(false);

      setSuccess("Profile successfully update ho gaya.");

    } catch (err) {

      setError(err.message || "Profile update failed.");

    } finally {

      setSaving(false);

    }

  };



  // ADD / UPDATE ADDRESS API

  const handleSaveAddress = async (e) => {

    e.preventDefault();

    if (addressSaving) return;



    setAddressSaving(true);

    setError("");

    setSuccess("");



    try {

      const isEditing = Boolean(editingAddressId);

      const url = isEditing

        ? `${API_BASE_URL}/addresses/${editingAddressId}`

        : `${API_BASE_URL}/addresses`;



      const response = await fetch(url, {

        method: isEditing ? "PUT" : "POST",

        credentials: "include",

        headers: {

          "Content-Type": "application/json",

          Accept: "application/json",

        },

        body: JSON.stringify({

          ...addressForm,

          fullName: addressForm.fullName.trim(),

          phone: addressForm.phone.trim(),

          addressLine1: addressForm.addressLine1.trim(),

          addressLine2: addressForm.addressLine2.trim(),

          landmark: addressForm.landmark.trim(),

          city: addressForm.city.trim(),

          state: addressForm.state.trim(),

          pincode: addressForm.pincode.trim(),

        }),

      });



      const data = await response.json().catch(() => ({}));



      if (response.status === 401 || response.status === 403) {

        handleUnauthorized();

        return;

      }



      if (!response.ok || !data.success) {

        throw new Error(data.message || "Address save nahi ho paya.");

      }



      setShowAddressForm(false);

      setEditingAddressId(null);

      setAddressForm({ ...EMPTY_ADDRESS });

      setSuccess(

        isEditing

          ? "Address successfully update ho gaya."

          : "Address successfully save ho gaya."

      );



      await loadAddresses();

    } catch (err) {

      setError(err.message || "Address save karne mein error aaya.");

    } finally {

      setAddressSaving(false);

    }

  };



  const handleEditAddress = (address) => {

    setEditingAddressId(address._id);

    setAddressForm({

      fullName: address.fullName || "",

      phone: address.phone || "",

      addressLine1: address.addressLine1 || "",

      addressLine2: address.addressLine2 || "",

      landmark: address.landmark || "",

      city: address.city || "",

      state: address.state || "",

      pincode: address.pincode || "",

      addressType: address.addressType || "Home",

      isDefault: Boolean(address.isDefault),

    });



    setShowAddressForm(true);

    setError("");

    setSuccess("");

  };



  // DELETE ADDRESS API

  const handleDeleteAddress = async (id) => {

    if (!window.confirm("Kya aap is address ko delete karna chahte hain?")) {

      return;

    }



    setAddressActionId(id);

    setError("");

    setSuccess("");



    try {

      const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {

        method: "DELETE",

        credentials: "include",

        headers: { Accept: "application/json" },

      });



      const data = await response.json().catch(() => ({}));



      if (response.status === 401 || response.status === 403) {

        handleUnauthorized();

        return;

      }



      if (!response.ok || !data.success) {

        throw new Error(data.message || "Address delete nahi hua.");

      }



      setSuccess("Address successfully delete ho gaya.");

      await loadAddresses();

    } catch (err) {

      setError(err.message || "Address delete karne mein error aaya.");

    } finally {

      setAddressActionId(null);

    }

  };



  // SET DEFAULT ADDRESS API

  const handleSetDefaultAddress = async (address) => {

    setAddressActionId(address._id);

    setError("");

    setSuccess("");



    try {

      const response = await fetch(

        `${API_BASE_URL}/addresses/${address._id}`,

        {

          method: "PUT",

          credentials: "include",

          headers: {

            "Content-Type": "application/json",

            Accept: "application/json",

          },

          body: JSON.stringify({ isDefault: true }),

        }

      );



      const data = await response.json().catch(() => ({}));



      if (response.status === 401 || response.status === 403) {

        handleUnauthorized();

        return;

      }



      if (!response.ok || !data.success) {

        throw new Error(data.message || "Default address update nahi hua.");

      }



      setSuccess("Default address update ho gaya.");

      await loadAddresses();

    } catch (err) {

      setError(err.message || "Default address update nahi hua.");

    } finally {

      setAddressActionId(null);

    }

  };



  // LOGOUT API

  const handleLogout = async () => {

    if (loggingOut) return;



    setLoggingOut(true);

    setError("");



    try {

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {

        method: "POST",

        credentials: "include",

        headers: { Accept: "application/json" },

      });



      const data = await response.json().catch(() => ({}));



      if (!response.ok || !data.success) {

        throw new Error(data.message || "Unable to log out.");

      }



      router.replace("/");

      router.refresh();

    } catch (err) {

      setError(err.message || "Logout failed. Please try again.");

    } finally {

      setLoggingOut(false);

    }

  };



  // CHANGE PASSWORD API

  const handleChangePassword = async (e) => {

    e.preventDefault();

    if (securityBusy) return;



    setSecurityBusy(true);

    setError("");

    setSuccess("");



    try {

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {

        method: "PUT",

        credentials: "include",

        headers: {

          "Content-Type": "application/json",

          Accept: "application/json",

        },

        body: JSON.stringify({

          currentPassword,

          newPassword,

          confirmPassword,

        }),

      });



      const data = await response.json().catch(() => ({}));



      if (response.status === 401 || response.status === 403) {

        handleUnauthorized();

        return;

      }



      if (!response.ok || !data.success) {

        throw new Error(data.message || "Password change nahi ho paya.");

      }



      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");

      setShowCurrentPassword(false);

      setShowNewPassword(false);

      setShowConfirmPassword(false);

      setSuccess("Password successfully change ho gaya.");

    } catch (err) {

      setError(err.message || "Password change karne mein error aaya.");

    } finally {

      setSecurityBusy(false);

    }

  };



  // SEND EMAIL CHANGE OTP API

  const handleSendEmailOtp = async (e) => {

    e.preventDefault();

    if (securityBusy) return;



    setSecurityBusy(true);

    setError("");

    setSuccess("");



    try {

      const response = await fetch(

        `${API_BASE_URL}/auth/email-change/send-otp`,

        {

          method: "POST",

          credentials: "include",

          headers: {

            "Content-Type": "application/json",

            Accept: "application/json",

          },

          body: JSON.stringify({

            newEmail: newEmail.trim(),

            currentPassword: emailCurrentPassword,

          }),

        }

      );



      const data = await response.json().catch(() => ({}));



      if (response.status === 401 || response.status === 403) {

        handleUnauthorized();

        return;

      }



      if (!response.ok || !data.success) {

        throw new Error(data.message || "OTP send nahi ho paya.");

      }



      setEmailOtpSent(true);

      setSuccess("OTP naye email address par bhej diya gaya hai.");

    } catch (err) {

      setError(err.message || "OTP send karne mein error aaya.");

    } finally {

      setSecurityBusy(false);

    }

  };



  // VERIFY EMAIL CHANGE OTP API

  const handleVerifyEmailOtp = async (e) => {

    e.preventDefault();

    if (securityBusy) return;



    setSecurityBusy(true);

    setError("");

    setSuccess("");



    try {

      const response = await fetch(

        `${API_BASE_URL}/auth/email-change/verify-otp`,

        {

          method: "POST",

          credentials: "include",

          headers: {

            "Content-Type": "application/json",

            Accept: "application/json",

          },

          body: JSON.stringify({ otp: emailOtp.trim() }),

        }

      );



      const data = await response.json().catch(() => ({}));



      if (response.status === 401 || response.status === 403) {

        handleUnauthorized();

        return;

      }



      if (!response.ok || !data.success) {

        throw new Error(data.message || "OTP verify nahi ho paya.");

      }



      if (data.user) {

        setUser((previous) => ({ ...previous, ...data.user }));

      }



      setNewEmail("");

      setEmailCurrentPassword("");

      setEmailOtp("");

      setEmailOtpSent(false);

      setSuccess("Email address successfully update ho gaya.");

    } catch (err) {

      setError(err.message || "Email update karne mein error aaya.");

    } finally {

      setSecurityBusy(false);

    }

  };



  const displayName = user?.name || "Nestro Customer";

  const initials = displayName

    .trim()

    .split(/\s+/)

    .slice(0, 2)

    .map((part) => part[0]?.toUpperCase())

    .join("");



  const createdDate = user?.createdAt

    ? new Date(user.createdAt).toLocaleDateString("en-IN", {

        month: "long",

        year: "numeric",

      })

    : null;



  if (loading) {

    return (

      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf7f3] px-4">

        <div className="text-center">

          <LoaderCircle

            size={35}

            className="mx-auto animate-spin text-[#a66e43]"

          />

          <p className="mt-4 text-sm text-[#81766d]">

            Loading your account...

          </p>

        </div>

      </main>

    );

  }



  if (error && !user) {

    return (

      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf7f3] px-4">

        <div className="w-full max-w-md rounded-2xl border border-[#eee5dc] bg-white p-8 text-center">

          <AlertCircle size={35} className="mx-auto text-[#a66e43]" />

          <h1 className="mt-4 text-xl font-semibold text-[#38261e]">

            Unable to load profile

          </h1>

          <p className="mt-2 text-sm text-[#81766d]">{error}</p>

          <button

            onClick={() => window.location.reload()}

            className="mt-6 rounded-xl bg-[#38261e] px-6 py-3 text-sm font-semibold text-white"

          >

            Try Again

          </button>

        </div>

      </main>

    );

  }



  return (

    <main className="min-h-screen bg-[#faf7f3] pb-16">

      <section className="border-b border-[#ece3da] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

          <div className="flex items-center gap-2 text-xs text-[#897d73]">

            <button onClick={() => router.push("/")} className="hover:text-[#a66e43]">

              Home

            </button>

            <ChevronRight size={14} />

            <span className="text-[#a66e43]">My Account</span>

          </div>



          <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a66e43]">

                YOUR NESTRO ACCOUNT

              </p>

              <h1 className="mt-2 text-3xl font-medium tracking-tight text-[#30231d] sm:text-4xl">

                My Account

              </h1>

              <p className="mt-2 text-sm leading-6 text-[#81766d]">

                Manage your details and keep everything in one place.

              </p>

            </div>

            <button

              onClick={() => router.push("/store")}

              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e7d9ca] px-5 py-3 text-sm font-medium text-[#8f5b38] hover:bg-[#faf4ec]"

            >

              <ShoppingBag size={17} /> Continue Shopping <ArrowRight size={15} />

            </button>

          </div>

        </div>

      </section>



      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">

        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">

          <aside className="overflow-hidden rounded-2xl border border-[#eee5dc] bg-white shadow-sm">

            <div className="bg-[#38261e] px-5 py-7 text-white sm:px-6">

              <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full border border-[#d3a982]/50 bg-[#50372b] text-xl font-semibold text-[#e9c5a2]">

                {initials || <UserRound size={27} />}

              </div>

              <h2 className="mt-4 break-words text-xl font-medium">{displayName}</h2>

              <p className="mt-1 break-all text-sm text-white/65">{user?.email}</p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-[#f0d5bb]">

                <ShieldCheck size={14} /> Verified account

              </div>

            </div>



            <nav className="p-3">

              {menuItems.map((item) => {

                const Icon = item.icon;

                const active = activeTab === item.id;



                return (

                  <button

                    key={item.id}

                    onClick={() => {

                      setActiveTab(item.id);

                      setError("");

                      setSuccess("");

                    }}

                    className={`mb-1 flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 text-left text-sm transition ${

                      active

                        ? "bg-[#f5eee6] font-semibold text-[#8f5b38]"

                        : "text-[#62584f] hover:bg-[#faf7f3]"

                    }`}

                  >

                    <Icon size={19} />

                    <span className="flex-1">{item.label}</span>

                    <ChevronRight size={16} />

                  </button>

                );

              })}



              <div className="my-3 border-t border-[#eee5dc]" />



              <button

                onClick={handleLogout}

                disabled={loggingOut}

                className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 text-left text-sm text-[#a14f40] hover:bg-red-50 disabled:opacity-60"

              >

                {loggingOut ? (

                  <LoaderCircle size={19} className="animate-spin" />

                ) : (

                  <LogOut size={19} />

                )}

                {loggingOut ? "Logging out..." : "Logout"}

              </button>

            </nav>

          </aside>



          <section className="min-w-0 rounded-2xl border border-[#eee5dc] bg-white p-5 shadow-sm sm:p-7 lg:p-9">

            {error && (

              <div role="alert" className="mb-6 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">

                {error}

              </div>

            )}

            {success && (

              <div role="status" className="mb-6 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">

                {success}

              </div>

            )}



            {activeTab === "profile" && (

              <>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                  <SectionHeading

                    eyebrow="Account details"

                    title="Personal Information"

                    description="Your basic account information."

                  />

                  <button

                    type="button"

                    onClick={() => {

                      setNameDraft(user?.name || "");

                      setPhoneDraft(user?.phone || "");

                      setEditing(!editing);

                      setError("");

                      setSuccess("");

                    }}

                    className="mb-7 inline-flex w-fit items-center gap-2 rounded-lg border border-[#e7d9ca] px-4 py-2.5 text-sm font-medium text-[#8f5b38] hover:bg-[#faf4ec]"

                  >

                    <Pencil size={15} /> {editing ? "Cancel Edit" : "Edit Profile"}

                  </button>

                </div>



                {editing ? (

                  <form onSubmit={handleSaveProfile} className="space-y-5">

                    <div>

                      <label className="mb-2 block text-sm font-medium text-[#38261e]">

                        Full Name

                      </label>

                      <input

                        type="text"

                        value={nameDraft}

                        onChange={(e) => setNameDraft(e.target.value)}

                        required

                        maxLength={100}

                        className={inputClass}

                        placeholder="Enter your full name"

                      />

                    </div>



                    <div>

                      <label className="mb-2 block text-sm font-medium text-[#38261e]">

                        Email Address

                      </label>

                      <input

                        type="email"

                        value={user?.email || ""}

                        disabled

                        className="w-full rounded-xl border border-[#d8c5b4] bg-[#faf7f3] px-4 py-3 text-sm text-[#62584f] opacity-100 disabled:cursor-not-allowed disabled:text-[#62584f]"

                      />

                    </div>



                    <div>

                      <label className="mb-2 block text-sm font-medium text-[#38261e]">

                        Mobile Number

                      </label>

                      <input

                        type="tel"

                        inputMode="numeric"

                        value={phoneDraft}

                        onChange={(e) =>

                          setPhoneDraft(e.target.value.replace(/\D/g, "").slice(0, 10))

                        }

                        maxLength={10}

                        pattern="[6-9][0-9]{9}"

                        className={inputClass}

                        placeholder="Enter 10-digit mobile number"

                      />

                    </div>



                    <div className="flex flex-wrap gap-3">

                      <button

                        type="submit"

                        disabled={saving}

                        className="rounded-xl bg-[#38261e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"

                      >

                        {saving ? "Saving..." : "Save Changes"}

                      </button>

                      <button

                        type="button"

                        onClick={() => {

                          setEditing(false);

                          setNameDraft(user?.name || "");

                          setPhoneDraft(user?.phone || "");

                          setError("");

                        }}

                        className="rounded-xl border border-[#e7d9ca] px-6 py-3 text-sm font-semibold text-[#38261e]"

                      >

                        Cancel

                      </button>

                    </div>

                  </form>

                ) : (

                  <div className="grid gap-4 sm:grid-cols-2">

                    <DetailCard icon={UserRound} label="Full Name" value={user?.name} />

                    <DetailCard icon={Mail} label="Email Address" value={user?.email} />

                    <DetailCard icon={Phone} label="Mobile Number" value={user?.phone || user?.mobile} />

                    <DetailCard icon={CalendarDays} label="Member Since" value={createdDate} />

                  </div>

                )}



                <div className="mt-8 rounded-xl bg-[#faf7f3] p-5 sm:p-6">

                  <div className="flex gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#a66e43]">

                      <ShieldCheck size={22} />

                    </div>

                    <div>

                      <h3 className="font-semibold text-[#38261e]">

                        Your account, your space

                      </h3>

                      <p className="mt-1 text-sm leading-6 text-[#81766d]">

                        Keep your details up to date for a smoother shopping and delivery experience.

                      </p>

                    </div>

                  </div>

                </div>

              </>

            )}



            {activeTab === "orders" && (
              <>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <SectionHeading
                    eyebrow="Your purchases"
                    title="My Orders"
                    description="View your furniture purchases and delivery updates."
                  />
                  <button
                    type="button"
                    onClick={loadOrders}
                    disabled={ordersLoading}
                    className="mb-7 inline-flex items-center gap-2 rounded-lg border border-[#e7d9ca] px-4 py-2.5 text-sm font-medium text-[#8f5b38] disabled:opacity-60"
                  >
                    <LoaderCircle size={15} className={ordersLoading ? "animate-spin" : ""} />
                    Refresh Orders
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="py-12 text-center">
                    <LoaderCircle size={32} className="mx-auto animate-spin text-[#a66e43]" />
                    <p className="mt-3 text-sm text-[#81766d]">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#dfd1c3] bg-[#faf7f3] px-5 py-12 text-center sm:px-10">
                    <Package size={32} className="mx-auto text-[#a66e43]" />
                    <h3 className="mt-5 text-lg font-semibold text-[#38261e]">No orders yet</h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#81766d]">Your order history will appear here after you place an order.</p>
                    <button type="button" onClick={() => router.push("/store")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#38261e] px-5 py-3 text-sm font-semibold text-white">
                      Explore Furniture <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((order) => (
                      <div key={order._id} className="overflow-hidden rounded-2xl border border-[#eee5dc] bg-white">
                        <div className="flex flex-col justify-between gap-3 bg-[#faf7f3] p-4 sm:flex-row sm:items-center sm:p-5">
                          <div>
                            <p className="text-xs text-[#81766d]">Order ID</p>
                            <p className="mt-1 break-all text-sm font-semibold text-[#38261e]">#{order._id}</p>
                            <p className="mt-1 text-xs text-[#81766d]">
                              {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Date unavailable"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium capitalize text-[#8f5b38]">{order.orderStatus || "placed"}</span>
                            <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${order.paymentStatus === "paid" ? "bg-green-50 text-green-700" : order.paymentStatus === "failed" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>Payment: {order.paymentStatus || "pending"}</span>
                          </div>
                        </div>

                        <div className="space-y-4 p-4 sm:p-5">
                          {(order.items || []).map((item, index) => (
                            <div key={`${order._id}-${item.product || index}`} className="flex items-start gap-3">
                              {item.image ? <img src={item.image} alt={item.name || "Product"} className="h-16 w-16 rounded-xl border border-[#eee5dc] bg-[#faf7f3] object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#faf7f3] text-[#a66e43]"><Package size={24} /></div>}
                              <div className="min-w-0 flex-1">
                                <p className="break-words text-sm font-semibold text-[#38261e]">{item.name || "Product"}</p>
                                <p className="mt-1 text-xs text-[#81766d]">Quantity: {item.quantity}</p>
                                <p className="mt-1 text-sm font-medium text-[#8f5b38]">₹{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString("en-IN")}</p>
                              </div>
                            </div>
                          ))}

                          <div className="border-t border-[#eee5dc] pt-4">
                            <div className="flex justify-between gap-3 text-sm text-[#62584f]"><span>Subtotal</span><span>₹{Number(order.subtotal || 0).toLocaleString("en-IN")}</span></div>
                            <div className="mt-2 flex justify-between gap-3 text-sm text-[#62584f]"><span>Shipping</span><span>₹{Number(order.shippingCharge || 0).toLocaleString("en-IN")}</span></div>
                            <div className="mt-3 flex justify-between gap-3 border-t border-[#eee5dc] pt-3"><span className="font-semibold text-[#38261e]">Total Amount</span><span className="text-lg font-bold text-[#8f5b38]">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</span></div>
                            <p className="mt-3 text-xs text-[#81766d]">Payment Method: <span className="font-medium uppercase">{order.paymentMethod || "N/A"}</span></p>
                            {order.shippingAddress && (
                              <div className="mt-4 rounded-xl bg-[#faf7f3] p-3 text-xs leading-5 text-[#62584f]">
                                <p className="mb-1 font-semibold text-[#38261e]">Delivery Address</p>
                                <p>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                <p>Phone: {order.shippingAddress.phone}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "addresses" && (

              <>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                  <SectionHeading

                    eyebrow="Delivery information"

                    title="Saved Addresses"

                    description="Manage the addresses where your orders will be delivered."

                  />

                  <button

                    type="button"

                    onClick={() => {

                      setError("");

                      setSuccess("");

                      setEditingAddressId(null);

                      setAddressForm({ ...EMPTY_ADDRESS });

                      setShowAddressForm((prev) => !prev);

                    }}

                    className="mb-7 inline-flex w-fit items-center gap-2 rounded-lg bg-[#38261e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#50372b]"

                  >

                    {showAddressForm ? <X size={16} /> : <Plus size={16} />}

                    {showAddressForm ? "Cancel" : "Add Address"}

                  </button>

                </div>



                {showAddressForm && (

                  <form

                    onSubmit={handleSaveAddress}

                    className="mb-8 space-y-5 rounded-2xl border border-[#eee5dc] bg-[#faf7f3] p-5 sm:p-6"

                  >

                    <h3 className="text-lg font-semibold text-[#38261e]">

                      {editingAddressId ? "Edit Address" : "Add New Address"}

                    </h3>



                    <div className="grid gap-4 sm:grid-cols-2">

                      {[

                        ["fullName", "Full Name", true],

                        ["phone", "Mobile Number", true],

                        ["addressLine1", "House No. / Street / Area", true],

                        ["addressLine2", "Address Line 2", false],

                        ["landmark", "Landmark", false],

                        ["city", "City", true],

                        ["state", "State", true],

                        ["pincode", "PIN Code", true],

                      ].map(([key, label, required]) => (

                        <div key={key}>

                          <label className="mb-2 block text-sm font-medium text-[#38261e]">

                            {label}{required ? " \*" : " (Optional)"}

                          </label>

                          <input

                            type="text"

                            value={addressForm[key]}

                            required={required}

                            maxLength={

                              key === "phone"

                                ? 10

                                : key === "pincode"

                                ? 6

                                : key === "fullName"

                                ? 100

                                : undefined

                            }

                            inputMode={

                              key === "phone" || key === "pincode"

                                ? "numeric"

                                : undefined

                            }

                            pattern={

                              key === "phone"

                                ? "[6-9][0-9]{9}"

                                : key === "pincode"

                                ? "[0-9]{6}"

                                : undefined

                            }

                            onChange={(e) => {

                              let value = e.target.value;

                              if (key === "phone") value = value.replace(/\D/g, "").slice(0, 10);

                              if (key === "pincode") value = value.replace(/\D/g, "").slice(0, 6);

                              setAddressForm((prev) => ({ ...prev, [key]: value }));

                            }}

                            placeholder={`Enter ${label.toLowerCase()}`}

                            className={inputClass}

                          />

                        </div>

                      ))}



                      <div>

                        <label className="mb-2 block text-sm font-medium text-[#38261e]">

                          Address Type

                        </label>

                        <select

                          value={addressForm.addressType}

                          onChange={(e) =>

                            setAddressForm((prev) => ({

                              ...prev,

                              addressType: e.target.value,

                            }))

                          }

                          className={selectClass}

                        >

                          <option value="Home">Home</option>

                          <option value="Work">Work</option>

                          <option value="Other">Other</option>

                        </select>

                      </div>



                      <label className="flex items-center gap-3 self-center text-sm text-[#38261e]">

                        <input

                          type="checkbox"

                          checked={addressForm.isDefault}

                          onChange={(e) =>

                            setAddressForm((prev) => ({

                              ...prev,

                              isDefault: e.target.checked,

                            }))

                          }

                          className="h-4 w-4 accent-[#a66e43]"

                        />

                        Set as default address

                      </label>

                    </div>



                    <div className="flex flex-wrap gap-3">

                      <button

                        type="submit"

                        disabled={addressSaving}

                        className="rounded-xl bg-[#38261e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"

                      >

                        {addressSaving

                          ? "Saving..."

                          : editingAddressId

                          ? "Update Address"

                          : "Save Address"}

                      </button>

                      <button

                        type="button"

                        disabled={addressSaving}

                        onClick={() => {

                          setShowAddressForm(false);

                          setEditingAddressId(null);

                          setAddressForm({ ...EMPTY_ADDRESS });

                        }}

                        className="rounded-xl border border-[#e7d9ca] px-6 py-3 text-sm font-semibold text-[#38261e]"

                      >

                        Cancel

                      </button>

                    </div>

                  </form>

                )}



                {addressLoading ? (

                  <div className="py-12 text-center">

                    <LoaderCircle size={30} className="mx-auto animate-spin text-[#a66e43]" />

                    <p className="mt-3 text-sm text-[#81766d]">Loading saved addresses...</p>

                  </div>

                ) : addresses.length === 0 ? (

                  <div className="rounded-2xl border border-dashed border-[#dfd1c3] bg-[#faf7f3] px-5 py-12 text-center sm:px-10">

                    <MapPin size={32} className="mx-auto text-[#a66e43]" />

                    <h3 className="mt-5 text-lg font-semibold text-[#38261e]">

                      No saved addresses yet

                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#81766d]">

                      Add your delivery address to make checkout easier.

                    </p>

                    {!showAddressForm && (

                      <button

                        onClick={() => {

                          setAddressForm({ ...EMPTY_ADDRESS });

                          setEditingAddressId(null);

                          setShowAddressForm(true);

                        }}

                        className="mt-6 rounded-xl bg-[#38261e] px-5 py-3 text-sm font-semibold text-white"

                      >

                        <Plus size={16} className="mr-1 inline" /> Add Your First Address

                      </button>

                    )}

                  </div>

                ) : (

                  <div className="grid gap-4">

                    {addresses.map((address) => (

                      <div

                        key={address._id}

                        className="rounded-2xl border border-[#eee5dc] bg-white p-5 sm:p-6"

                      >

                        <div className="flex flex-wrap items-center justify-between gap-3">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-[#f5eee6] px-3 py-1 text-xs font-semibold text-[#8f5b38]">

                              {address.addressType || "Home"}

                            </span>

                            {address.isDefault && (

                              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">

                                Default Address

                              </span>

                            )}

                          </div>

                          <MapPin size={20} className="text-[#a66e43]" />

                        </div>



                        <h3 className="mt-4 text-lg font-semibold text-[#38261e]">

                          {address.fullName}

                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#62584f]">

                          {address.addressLine1}

                          {address.addressLine2 ? `, ${address.addressLine2}` : ""}

                          {address.landmark ? `, Near ${address.landmark}` : ""}

                          {`, ${address.city}, ${address.state} - ${address.pincode}`}

                        </p>

                        <p className="mt-2 text-sm text-[#62584f]">

                          <Phone size={14} className="mr-2 inline" />

                          {address.phone}

                        </p>



                        <div className="mt-5 flex flex-wrap gap-3 border-t border-[#eee5dc] pt-4">

                          <button

                            disabled={addressActionId === address._id}

                            onClick={() => handleEditAddress(address)}

                            className="rounded-lg border border-[#e7d9ca] px-4 py-2 text-sm font-medium text-[#8f5b38] hover:bg-[#faf4ec] disabled:opacity-60"

                          >

                            <Pencil size={14} className="mr-1 inline" /> Edit

                          </button>

                          <button

                            disabled={addressActionId === address._id}

                            onClick={() => handleDeleteAddress(address._id)}

                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"

                          >

                            {addressActionId === address._id ? (

                              <LoaderCircle size={14} className="mr-1 inline animate-spin" />

                            ) : (

                              <Trash2 size={14} className="mr-1 inline" />

                            )}

                            Delete

                          </button>

                          {!address.isDefault && (

                            <button

                              disabled={addressActionId === address._id}

                              onClick={() => handleSetDefaultAddress(address)}

                              className="rounded-lg bg-[#38261e] px-4 py-2 text-sm font-medium text-white hover:bg-[#50372b] disabled:opacity-60"

                            >

                              <Star size={14} className="mr-1 inline" /> Set as Default

                            </button>

                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </>

            )}



            {activeTab === "security" && (

              <>

                <SectionHeading

                  eyebrow="Account preferences"

                  title="Account Settings"

                  description="Manage your email address and password."

                />



                {/\* CHANGE EMAIL \*/}

                <div className="mb-8 rounded-xl border border-[#eee5dc] p-5 sm:p-6">

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5eee6] text-[#a66e43]">

                      <Mail size={20} />

                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-[#38261e]">Change Email Address</h3>

                      <p className="break-all text-sm text-[#81766d]">

                        Current email: {user?.email}

                      </p>

                    </div>

                  </div>



                  <form

                    onSubmit={emailOtpSent ? handleVerifyEmailOtp : handleSendEmailOtp}

                    className="space-y-4"

                  >

                    {!emailOtpSent ? (

                      <>

                        <div>

                          <label className="mb-2 block text-sm font-medium text-[#38261e]">

                            New Email Address

                          </label>

                          <input

                            type="email"

                            required

                            value={newEmail}

                            onChange={(e) => setNewEmail(e.target.value)}

                            className={inputClass}

                            placeholder="Enter your new email"

                            autoComplete="email"

                          />

                        </div>



                        <div>

                          <label className="mb-2 block text-sm font-medium text-[#38261e]">

                            Current Password

                          </label>

                          <input

                            type="password"

                            required

                            value={emailCurrentPassword}

                            onChange={(e) => setEmailCurrentPassword(e.target.value)}

                            className={inputClass}

                            placeholder="Confirm with your password"

                            autoComplete="current-password"

                          />

                        </div>



                        <button

                          type="submit"

                          disabled={securityBusy}

                          className="rounded-xl bg-[#38261e] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"

                        >

                          {securityBusy ? "Sending OTP..." : "Send Verification OTP"}

                        </button>

                      </>

                    ) : (

                      <>

                        <p className="text-sm text-[#62584f]">

                          OTP sent to <strong>{newEmail}</strong>. Please check your inbox.

                        </p>

                        <div>

                          <label className="mb-2 block text-sm font-medium text-[#38261e]">

                            Six-digit OTP

                          </label>

                          <input

                            type="text"

                            inputMode="numeric"

                            autoComplete="one-time-code"

                            required

                            pattern="[0-9]{6}"

                            maxLength={6}

                            value={emailOtp}

                            onChange={(e) =>

                              setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))

                            }

                            className={inputClass}

                            placeholder="Enter OTP"

                          />

                        </div>



                        <div className="flex flex-wrap gap-3">

                          <button

                            type="submit"

                            disabled={securityBusy || emailOtp.length !== 6}

                            className="rounded-xl bg-[#38261e] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"

                          >

                            {securityBusy ? "Verifying..." : "Verify & Update Email"}

                          </button>

                          <button

                            type="button"

                            disabled={securityBusy}

                            onClick={() => {

                              setEmailOtpSent(false);

                              setEmailOtp("");

                              setError("");

                              setSuccess("");

                            }}

                            className="rounded-xl border border-[#e7d9ca] px-5 py-3 text-sm font-semibold text-[#38261e] disabled:opacity-60"

                          >

                            Cancel

                          </button>

                        </div>

                      </>

                    )}

                  </form>

                </div>



                {/\* CHANGE PASSWORD \*/}

                <div className="rounded-xl border border-[#eee5dc] p-5 sm:p-6">

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5eee6] text-[#a66e43]">

                      <ShieldCheck size={20} />

                    </div>

                    <div>

                      <h3 className="font-semibold text-[#38261e]">Change Password</h3>

                      <p className="text-sm text-[#81766d]">

                        Choose a strong password of at least 8 characters.

                      </p>

                    </div>

                  </div>



                  <form onSubmit={handleChangePassword} className="space-y-4">

                    <div>

                      <label className="mb-2 block text-sm font-medium text-[#38261e]">

                        Current Password

                      </label>

                      <div className="relative">

                        <input

                          type={showCurrentPassword ? "text" : "password"}

                          required

                          autoComplete="current-password"

                          value={currentPassword}

                          onChange={(e) => setCurrentPassword(e.target.value)}

                          className={`${inputClass} pr-12`}

                          placeholder="Enter current password"

                        />

                        <button

                          type="button"

                          onClick={() => setShowCurrentPassword((prev) => !prev)}

                          className="absolute inset-y-0 right-3 flex items-center text-[#81766d] hover:text-[#a66e43]"

                          aria-label={showCurrentPassword ? "Hide password" : "Show password"}

                        >

                          {showCurrentPassword ? <EyeOff size={19} /> : <Eye size={19} />}

                        </button>

                      </div>

                    </div>



                    <div>

                      <label className="mb-2 block text-sm font-medium text-[#38261e]">

                        New Password

                      </label>

                      <div className="relative">

                        <input

                          type={showNewPassword ? "text" : "password"}

                          required

                          minLength={8}

                          autoComplete="new-password"

                          value={newPassword}

                          onChange={(e) => setNewPassword(e.target.value)}

                          className={`${inputClass} pr-12`}

                          placeholder="Enter new password"

                        />

                        <button

                          type="button"

                          onClick={() => setShowNewPassword((prev) => !prev)}

                          className="absolute inset-y-0 right-3 flex items-center text-[#81766d] hover:text-[#a66e43]"

                          aria-label={showNewPassword ? "Hide password" : "Show password"}

                        >

                          {showNewPassword ? <EyeOff size={19} /> : <Eye size={19} />}

                        </button>

                      </div>

                    </div>



                    <div>

                      <label className="mb-2 block text-sm font-medium text-[#38261e]">

                        Confirm New Password

                      </label>

                      <div className="relative">

                        <input

                          type={showConfirmPassword ? "text" : "password"}

                          required

                          minLength={8}

                          autoComplete="new-password"

                          value={confirmPassword}

                          onChange={(e) => setConfirmPassword(e.target.value)}

                          className={`${inputClass} pr-12`}

                          placeholder="Confirm new password"

                        />

                        <button

                          type="button"

                          onClick={() => setShowConfirmPassword((prev) => !prev)}

                          className="absolute inset-y-0 right-3 flex items-center text-[#81766d] hover:text-[#a66e43]"

                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}

                        >

                          {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}

                        </button>

                      </div>

                    </div>



                    <button

                      type="submit"

                      disabled={securityBusy}

                      className="rounded-xl bg-[#38261e] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"

                    >

                      {securityBusy ? "Updating..." : "Change Password"}

                    </button>

                  </form>

                </div>



                <button

                  type="button"

                  onClick={handleLogout}

                  disabled={loggingOut}

                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"

                >

                  {loggingOut ? (

                    <LoaderCircle size={17} className="animate-spin" />

                  ) : (

                    <LogOut size={17} />

                  )}

                  {loggingOut ? "Logging out..." : "Logout from account"}

                </button>

              </>

            )}

          </section>

        </div>



        <p className="mt-8 text-center text-xs leading-5 text-[#988b7f]">

          NESTRO. · Thoughtfully designed furniture for your home.

        </p>

      </div>

    </main>

  );

}
