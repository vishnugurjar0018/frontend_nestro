"use client";

import React, { useEffect, useMemo, useState } from "react";
import Script from "next/script";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/cartSlice";

import {

ArrowLeft,

ArrowRight,

CheckCircle2,

ChevronRight,

CreditCard,

LockKeyhole,

MapPin,

Package,

ShieldCheck,

ShoppingBag,

Truck,

Wallet,

} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const formatPrice = (price) =>

`₹${Number(price || 0).toLocaleString("en-IN", {

maximumFractionDigits: 2,

})}`;

export default function CheckoutPage() {

const router = useRouter();
const dispatch = useDispatch();

const cartItems = useSelector(

(state) => state.cart?.items ?? []

);

const [checkingAuth, setCheckingAuth] = useState(true);
const [hasMounted, setHasMounted] = useState(false);

const [isAuthenticated, setIsAuthenticated] = useState(false);

const [paymentMethod, setPaymentMethod] = useState("cod");

const [loading, setLoading] = useState(false);

const [error, setError] = useState("");

const [savedAddresses, setSavedAddresses] = useState([]);

const [selectedAddressId, setSelectedAddressId] = useState("");

const [addressesLoading, setAddressesLoading] = useState(false);

const [form, setForm] = useState({

firstName: "",

lastName: "",

email: "",

phone: "",

address: "",

apartment: "",

city: "",

state: "",

pincode: "",

landmark: "",

});

// ==========================================

// CHECK LOGIN STATUS

// ==========================================

useEffect(() => {

let cancelled = false;

const checkAuth = async () => {

try {

if (!API_URL) {

throw new Error("API_URL_MISSING");

}

const response = await fetch(

`${API_URL}/auth/me`,

{

method: "GET",

credentials: "include",

headers: {

Accept: "application/json",

},

cache: "no-store",

}

);

let data = {};

try {

data = await response.json();

} catch {

data = {};

}

if (cancelled) return;

// Redirect only when backend explicitly says

// the session is unauthorized.

if (

response.status === 401 ||

response.status === 403

) {

setIsAuthenticated(false);

router.replace(

"/sign-in?redirect=%2Fcheckout"

);

return;

}

// Other server errors are not automatically

// treated as a logged-out session.

if (!response.ok) {

throw new Error(

"Account verification failed. Please try again."

);

}

if (data?.success !== true || !data?.user) {

throw new Error(

"Unexpected account response."

);

}

setIsAuthenticated(true);

const fullName = (

data.user.name || ""

).trim();

const nameParts = fullName

? fullName.split(/\s+/)

: [];

setForm((previous) => ({

...previous,

email: data.user.email || "",

firstName: nameParts[0] || "",

lastName: nameParts.slice(1).join(" "),

phone: data.user.phone || previous.phone,

}));

// Load the authenticated user's saved addresses.

setAddressesLoading(true);

try {

const addressResponse = await fetch(`${API_URL}/addresses`, {

method: "GET",

credentials: "include",

headers: { Accept: "application/json" },

cache: "no-store",

});

const addressData = await addressResponse.json().catch(() => ({}));

if (cancelled) return;

if (addressResponse.ok && addressData.success) {

const addressList = Array.isArray(addressData.addresses)

? addressData.addresses

: [];

setSavedAddresses(addressList);

const defaultAddress =

addressList.find((address) => address.isDefault) ||

addressList[0];

if (defaultAddress) {

setSelectedAddressId(String(defaultAddress._id));

const addressName = (defaultAddress.fullName || "").trim();

const addressNameParts = addressName

? addressName.split(/\s+/)

: [];

setForm((previous) => ({

...previous,

firstName: addressNameParts[0] || nameParts[0] || "",

lastName:

addressNameParts.slice(1).join(" ") ||

nameParts.slice(1).join(" "),

phone: defaultAddress.phone || data.user.phone || "",

address: defaultAddress.addressLine1 || "",

apartment: defaultAddress.addressLine2 || "",

city: defaultAddress.city || "",

state: defaultAddress.state || "",

pincode: defaultAddress.pincode || "",

landmark: defaultAddress.landmark || "",

}));

}

} else if (!addressResponse.ok) {

console.error(

"Unable to load saved addresses:",

addressData.message || addressResponse.status

);

}

} catch (addressError) {

if (!cancelled) {

console.error("Unable to load saved addresses:", addressError);

}

} finally {

if (!cancelled) setAddressesLoading(false);

}

} catch (err) {

if (cancelled) return;

console.error(

"Checkout authentication error:",

err

);

setIsAuthenticated(false);

setError(

"We couldn't verify your account. Please try again."

);

} finally {

if (!cancelled) {

setCheckingAuth(false);

}

}

};

checkAuth();

return () => {

cancelled = true;

};

}, [router]);

// ==========================================

// CART CALCULATIONS

// ==========================================

const orderItems = useMemo(() => {

return cartItems.map((item, index) => {

const quantity = Math.max(

1,

Number(item.quantity) || 1

);

const price = Number(

item.salePrice ??

item.discountPrice ??

item.price ??

0

);

return {

id: item._id ?? item.id ?? index,

name:

item.name ??

item.title ??

"Furniture Product",

image:

item.image ??

item.thumbnail ??

item.images?.[0] ??

"",

price,

quantity,

color: item.color ?? "",

size: item.size ?? "",

};

});

}, [cartItems]);


const subtotal = useMemo(
  () =>
    orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  [orderItems]
);


// Demo shipping rule; final charges should be

// calculated and verified by the backend.

const shipping =

subtotal === 0 || subtotal >= 5000 ? 0 : 199;

const total = subtotal + shipping;

// ==========================================

// SELECT SAVED ADDRESS

// ==========================================

const handleSelectAddress = (event) => {

const addressId = event.target.value;

setSelectedAddressId(addressId);

const selectedAddress = savedAddresses.find(

(address) => String(address._id) === addressId

);

if (!selectedAddress) return;

const addressName = (selectedAddress.fullName || "").trim();

const nameParts = addressName ? addressName.split(/\s+/) : [];

setForm((previous) => ({

...previous,

firstName: nameParts[0] || previous.firstName,

lastName: nameParts.slice(1).join(" "),

phone: selectedAddress.phone || previous.phone,

address: selectedAddress.addressLine1 || "",

apartment: selectedAddress.addressLine2 || "",

city: selectedAddress.city || "",

state: selectedAddress.state || "",

pincode: selectedAddress.pincode || "",

landmark: selectedAddress.landmark || "",

}));

setError("");

};

// ==========================================

// HANDLE INPUT CHANGE

// ==========================================

const handleChange = (event) => {

const { name, value } = event.target;

setForm((previous) => ({

...previous,

[name]: value,

}));

setError("");

};

// ==========================================

// PLACE ORDER

// ==========================================

const handlePlaceOrder = async (event) => {
  event.preventDefault();
  setError("");
  if (loading) return;

  if (!API_URL) {
    setError("API URL is missing. Please check your frontend .env file.");
    return;
  }
  if (!orderItems.length) {
    setError("Your cart is empty.");
    return;
  }

  const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"];
  const missingField = requiredFields.find((field) => !String(form[field] || "").trim());
  if (missingField) {
    setError("Please fill in all required fields.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    setError("Please enter a valid email address.");
    return;
  }
  if (!/^[6-9]\d{9}$/.test(form.phone)) {
    setError("Please enter a valid 10-digit mobile number.");
    return;
  }
  if (!/^\d{6}$/.test(form.pincode)) {
    setError("Please enter a valid 6-digit PIN code.");
    return;
  }

  const items = orderItems.map((item) => ({ id: String(item.id), quantity: item.quantity }));
  if (items.some((item) => !/^[a-f\d]{24}$/i.test(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1)) {
    setError("A product in your cart has an invalid ID. Please remove it and add the product again.");
    return;
  }

  const payload = {
    items,
    shippingAddress: {
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      addressLine1: form.address.trim(),
      addressLine2: form.apartment.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      landmark: form.landmark.trim(),
    },
  };

  setLoading(true);
  try {
    if (paymentMethod === "cod") {
      const response = await fetch(`${API_URL}/orders/cod`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to place your order.");
      dispatch(clearCart());
      alert(`Order placed successfully!${data.order?._id ? ` Order ID: ${data.order._id}` : ""}`);
      router.push("/");
      return;
    }

    if (paymentMethod !== "online") throw new Error("Please select a payment method.");
    if (!window.Razorpay) throw new Error("Payment gateway is loading. Please wait a moment and try again.");

    const createResponse = await fetch(`${API_URL}/orders/razorpay/create`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const orderData = await createResponse.json().catch(() => ({}));
    if (!createResponse.ok || !orderData.success) throw new Error(orderData.message || "Unable to initialize online payment.");

    const razorpay = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Nestro",
      description: "Furniture order payment",
      order_id: orderData.razorpayOrderId,
      prefill: { name: payload.shippingAddress.fullName, email: form.email, contact: form.phone },
      theme: { color: "#9a633b" },
      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await fetch(`${API_URL}/orders/razorpay/verify`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ orderId: orderData.orderId, ...paymentResponse }),
          });
          const verifyData = await verifyResponse.json().catch(() => ({}));
          if (!verifyResponse.ok || !verifyData.success) {
            setError(verifyData.message || "Payment verification failed. Please contact support before retrying.");
            setLoading(false);
            return;
          }
          dispatch(clearCart());
          alert("Payment successful and verified!");
          router.push("/");
        } catch (verificationError) {
          setError(verificationError.message || "Unable to verify payment. Please contact support.");
        } finally {
          setLoading(false);
        }
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    razorpay.on("payment.failed", (paymentError) => {
      setError(paymentError.error?.description || "Payment failed. Please try again.");
      setLoading(false);
    });
    razorpay.open();
  } catch (err) {
    setError(err.message || "Something went wrong. Please try again.");
    setLoading(false);
  }
};

const inputClass = `

w-full rounded-xl border border-[#e6ded4]

bg-white px-4 py-3.5 text-sm text-[#29251f]

outline-none transition-all duration-200

placeholder:text-[#aaa198]

focus:border-[#a87951]

focus:ring-2 focus:ring-[#a87951]/10

`;

// ==========================================

// AUTH CHECK LOADING SCREEN

// ==========================================

if (checkingAuth) {

return (

<div className="flex min-h-[70vh] items-center justify-center bg-[#faf8f5]">

<div className="text-center">

<div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadfd3] border-t-[#9a633b]" />

<p className="mt-4 text-sm text-[#82776c]">

Checking your account...

</p>

</div>

</div>

);

}

// Do not show a blank page if verification fails.

if (!isAuthenticated) {

return (

<main className="flex min-h-[50vh] flex-col items-center justify-center bg-[#faf8f5] px-4 text-center">

<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f6efe7] text-[#9a633b]">

<LockKeyhole size={25} />

</div>

<h1 className="mt-5 text-xl font-medium text-[#29251f]">

Account verification

</h1>

<p className="mt-3 max-w-md text-sm leading-6 text-[#82776c]">

{error ||

"Please sign in to continue to checkout."}

</p>

<div className="mt-6 flex flex-wrap justify-center gap-3">

<button

type="button"

onClick={() => window.location.reload()}

className="rounded-xl bg-[#9a633b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#80512f]"

>

Try Again

</button>

<Link

href="/sign-in?redirect=%2Fcheckout"

className="rounded-xl border border-[#e6ded4] bg-white px-5 py-3 text-sm font-medium text-[#51483f] transition hover:bg-[#faf7f2]"

>

Sign In

</Link>

</div>

</main >

);

}

return (

<main className="min-h-screen bg-[#faf8f5] pb-20">
<Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

{/**\*** PAGE HEADER **\***/}

<div className="border-b border-[#eae3db] bg-white">

<div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

<div className="flex flex-wrap items-center gap-2 text-xs text-[#8a8075]">

<Link

href="/"

className="hover:text-[#9a633b]"

>

Home

</Link>

<ChevronRight size={14} />

<Link

href="/cart"

className="hover:text-[#9a633b]"

>

Cart

</Link>

<ChevronRight size={14} />

<span className="font-medium text-[#9a633b]">

Checkout

</span>

</div>

<div className="mt-5 flex flex-wrap items-end justify-between gap-4">

<div>

<p className="mb-2 text-xs font-medium uppercase tracking-[3px] text-[#a87951]">

Secure checkout

</p>

<h1 className="text-3xl font-medium tracking-tight text-[#29251f] sm:text-4xl">

Complete your order

</h1>

<p className="mt-3 text-sm text-[#857a70]">

Just a few details before your new

furniture finds its home.

</p>

</div>

<div className="flex items-center gap-2 rounded-full border border-[#e9ded1] bg-[#fbf8f4] px-4 py-2 text-xs font-medium text-[#8a6546]">

<LockKeyhole size={15} />

Secure Checkout

</div>

</div>

</div>

</div>

{/**\*** CHECKOUT CONTENT **\***/}

<div className="mx-auto max-w-7xl px-4 pt-9 sm:px-6 lg:px-8">

{orderItems.length === 0 ? (

<div className="mx-auto max-w-xl rounded-3xl border border-[#eee7de] bg-white px-6 py-16 text-center shadow-sm">

<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6efe7] text-[#9a633b]">

<ShoppingBag size={30} />

</div>

<h2 className="mt-6 text-2xl font-medium text-[#29251f]">

Your cart is empty

</h2>

<p className="mt-3 text-sm leading-6 text-[#82776c]">

Add your favourite furniture pieces

before proceeding to checkout.

</p>

<Link

href="/store"

className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#9a633b] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#80512f]"

>

Explore Furniture

<ArrowRight size={17} />

</Link>

</div>

) : (

<form

onSubmit={handlePlaceOrder}

className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]"

>

{/**\*** LEFT SIDE **\***/}

<div className="space-y-7">

{/**\*** SHIPPING ADDRESS **\***/}

<section className="rounded-3xl border border-[#eee7de] bg-white p-5 shadow-sm sm:p-8">

<div className="mb-7 flex items-start gap-4">

<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6efe7] text-[#9a633b]">

<MapPin size={23} />

</div>

<div>

<h2 className="text-xl font-medium text-[#29251f]">

Shipping Address

</h2>

<p className="mt-1 text-sm text-[#8b8176]">

Where should we deliver your order?

</p>

</div>

</div>

{addressesLoading && (

<div className="mb-5 rounded-xl bg-[#fbf8f4] px-4 py-3 text-sm text-[#82776c]">

Loading your saved addresses...

</div>

)}

{!addressesLoading && savedAddresses.length > 0 && (

<div className="mb-6 rounded-2xl border border-[#e9ded1] bg-[#fcf8f4] p-4 sm:p-5">

<label

htmlFor="savedAddress"

className="mb-2 block text-sm font-semibold text-[#51483f]"

>

Select Saved Address

</label>

<select

id="savedAddress"

value={selectedAddressId}

onChange={handleSelectAddress}

className={inputClass}

>

<option value="">Choose a delivery address</option>

{savedAddresses.map((address) => (

<option

key={address._id}

value={String(address._id)}

>

{address.addressType || "Address"} — {address.fullName},{" "}

{address.city}, {address.pincode}

{address.isDefault ? " (Default)" : ""}

</option>

))}

</select>

<p className="mt-2 text-xs text-[#82776c]">

Select an address to automatically fill your delivery details.

</p>

</div>

)}

{!addressesLoading && savedAddresses.length === 0 && (

<div className="mb-6 rounded-xl bg-[#fcf8f4] p-4 text-sm text-[#82776c]">

No saved addresses found. You can enter your delivery details below.

</div>

)}

<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

<div>

<label className="mb-2 block text-sm font-medium text-[#51483f]">

First Name \*

</label>

<input

type="text"

name="firstName"

value={form.firstName}

onChange={handleChange}

placeholder="First name"

autoComplete="given-name"

required

className={inputClass}

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium text-[#51483f]">

Last Name \*

</label>

<input

type="text"

name="lastName"

value={form.lastName}

onChange={handleChange}

placeholder="Last name"

autoComplete="family-name"

required

className={inputClass}

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium text-[#51483f]">

Email Address \*

</label>

<input

type="email"

name="email"

value={form.email}

onChange={handleChange}

placeholder="you@example.com"

autoComplete="email"

required

className={inputClass}

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium text-[#51483f]">

Mobile Number \*

</label>

<input

type="tel"

name="phone"

value={form.phone}

onChange={(event) =>

setForm((previous) => ({

...previous,

phone: event.target.value

.replace(/\D/g, "")

.slice(0, 10),

}))

}

placeholder="10-digit mobile number"

autoComplete="tel"

inputMode="numeric"

maxLength={10}

required

className={inputClass}

/>

</div>

<div className="sm:col-span-2">

<label className="mb-2 block text-sm font-medium text-[#51483f]">

Street Address \*

</label>

<input

type="text"

name="address"

value={form.address}

onChange={handleChange}

placeholder="House number, street name, area"

autoComplete="street-address"

required

className={inputClass}

/>

</div>

<div className="sm:col-span-2">

<label className="mb-2 block text-sm font-medium text-[#51483f]">

Apartment / Building (Optional)

</label>

<input

type="text"

name="apartment"

value={form.apartment}

onChange={handleChange}

placeholder="Apartment, floor, building name"

className={inputClass}

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium text-[#51483f]">

City \*

</label>

<input

type="text"

name="city"

value={form.city}

onChange={handleChange}

placeholder="Your city"

autoComplete="address-level2"

required

className={inputClass}

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium text-[#51483f]">

State \*

</label>

<input

type="text"

name="state"

value={form.state}

onChange={handleChange}

placeholder="Your state"

autoComplete="address-level1"

required

className={inputClass}

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium text-[#51483f]">

PIN Code \*

</label>

<input

type="text"

name="pincode"

value={form.pincode}

onChange={(event) =>

setForm((previous) => ({

...previous,

pincode: event.target.value

.replace(/\D/g, "")

.slice(0, 6),

}))

}

placeholder="6-digit PIN code"

autoComplete="postal-code"

inputMode="numeric"

maxLength={6}

required

className={inputClass}

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium text-[#51483f]">

Landmark (Optional)

</label>

<input

type="text"

name="landmark"

value={form.landmark}

onChange={handleChange}

placeholder="Nearby landmark"

className={inputClass}

/>

</div>

</div>

</section>

{/**\*** PAYMENT METHOD **\***/}

<section className="rounded-3xl border border-[#eee7de] bg-white p-5 shadow-sm sm:p-8">

<div className="mb-7 flex items-start gap-4">

<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6efe7] text-[#9a633b]">

<CreditCard size={23} />

</div>

<div>

<h2 className="text-xl font-medium text-[#29251f]">

Payment Method

</h2>

<p className="mt-1 text-sm text-[#8b8176]">

Choose how you would like to pay.

</p>

</div>

</div>

<div className="space-y-4">

<label

className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all ${paymentMethod === "cod"

? "border-[#9a633b] bg-[#fcf8f4]"

: "border-[#e9e2d9] hover:border-[#c8aa90]"

}`}

>

<input

type="radio"

name="paymentMethod"

value="cod"

checked={paymentMethod === "cod"}

onChange={() =>

setPaymentMethod("cod")

}

className="mt-1 accent-[#9a633b]"

/>

<Wallet

size={22}

className="shrink-0 text-[#9a633b]"

/>

<div className="flex-1">

<p className="text-sm font-semibold text-[#342b24]">

Cash on Delivery

</p>

<p className="mt-1 text-xs leading-5 text-[#8b8176]">

Pay when your furniture arrives.

</p>

</div>

{paymentMethod === "cod" && (

<CheckCircle2

size={19}

className="text-[#9a633b]"

/>

)}

</label>

<label

className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all ${paymentMethod === "online"

? "border-[#9a633b] bg-[#fcf8f4]"

: "border-[#e9e2d9] hover:border-[#c8aa90]"

}`}

>

<input

type="radio"

name="paymentMethod"

value="online"

checked={paymentMethod === "online"}

onChange={() =>

setPaymentMethod("online")

}

className="mt-1 accent-[#9a633b]"

/>

<CreditCard

size={22}

className="shrink-0 text-[#9a633b]"

/>

<div className="flex-1">

<p className="text-sm font-semibold text-[#342b24]">

Online Payment

</p>

<p className="mt-1 text-xs leading-5 text-[#8b8176]">

UPI, cards and net banking.

</p>

<span className="mt-2 inline-block rounded-full bg-[#f1e9df] px-2.5 py-1 text-[10px] font-medium text-[#8a6546]">

Razorpay Test Mode

</span>

</div>

</label>

</div>

</section>

<Link

href="/cart"

className="inline-flex items-center gap-2 text-sm font-medium text-[#9a633b] hover:text-[#80512f]"

>

<ArrowLeft size={17} />

Return to Cart

</Link>

</div>

{/**\*** RIGHT SIDE: ORDER SUMMARY **\***/}

<aside className="lg:sticky lg:top-6">

<div className="overflow-hidden rounded-3xl border border-[#eee7de] bg-white shadow-sm">

<div className="border-b border-[#eee7de] p-6">

<div className="flex items-center justify-between">

<h2 className="text-xl font-medium text-[#29251f]">

Order Summary

</h2>

<ShoppingBag

size={21}

className="text-[#9a633b]"

/>

</div>

<p className="mt-1 text-xs text-[#8b8176]">

{orderItems.length} product(s) in your cart

</p>

</div>

{/**\*** PRODUCTS **\***/}

<div className="max-h-[340px] space-y-5 overflow-y-auto p-6">

{orderItems.map((item) => (

<div

key={item.id}

className="flex gap-4"

>

<div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f7f3ee]">

{typeof item.image === "string" &&

item.image ? (

<img

src={item.image}

alt={item.name}

className="h-full w-full object-cover"

/>

) : (

<Package

size={25}

className="text-[#b8a798]"

/>

)}

</div>

<div className="min-w-0 flex-1">

<h3 className="line-clamp-2 text-sm font-medium text-[#342b24]">

{item.name}

</h3>

<p className="mt-1 text-xs text-[#8b8176]">

Qty: {item.quantity}

</p>

{item.color && (

<p className="text-xs text-[#8b8176]">

Color: {item.color}

</p>

)}

{item.size && (

<p className="text-xs text-[#8b8176]">

Size: {item.size}

</p>

)}

<p className="mt-2 text-sm font-semibold text-[#9a633b]">

{formatPrice(

item.price * item.quantity

)}

</p>

</div>

</div>

))}

</div>

{/**\*** PRICE BREAKDOWN **\***/}

<div className="border-t border-[#eee7de] p-6">

<div className="space-y-4">

<div className="flex justify-between text-sm">

<span className="text-[#82776c]">

Subtotal

</span>

<span className="font-medium text-[#342b24]">

{formatPrice(subtotal)}

</span>

</div>

<div className="flex justify-between text-sm">

<span className="text-[#82776c]">

Shipping

</span>

<span

className={

shipping === 0

? "font-medium text-green-700"

: "font-medium text-[#342b24]"

}

>

{shipping === 0

? "FREE"

: formatPrice(shipping)}

</span>

</div>

{shipping > 0 && (

<p className="rounded-lg bg-[#f7f3ee] px-3 py-2 text-xs text-[#8b8176]">

Free shipping on orders above ₹5,000.

</p>

)}

</div>

<div className="my-6 h-px bg-[#eee7de]" />

<div className="flex items-center justify-between">

<div>

<p className="text-base font-semibold text-[#342b24]">

Total

</p>

<p className="mt-1 text-xs text-[#92877b]">

Estimated amount

</p>

</div>

<span className="text-2xl font-semibold text-[#9a633b]">

{formatPrice(total)}

</span>

</div>

{error && (

<div

role="alert"

className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"

>

{error}

</div>

)}

<button

type="submit"

disabled={loading}

className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#9a633b] px-5 py-4 text-sm font-medium text-white transition-all hover:bg-[#80512f] disabled:cursor-not-allowed disabled:opacity-60"

>

{loading

? "Processing..."

: "Place Order"}

{!loading && (

<ArrowRight size={18} />

)}

</button>

<div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8b8176]">

<ShieldCheck

size={16}

className="text-[#9a633b]"

/>

Your details are handled securely

</div>

</div>

</div>

{/**\*** DELIVERY INFORMATION **\***/}

<div className="mt-5 rounded-2xl border border-[#eee7de] bg-white p-5">

<div className="flex items-start gap-3">

<Truck

size={21}

className="mt-0.5 shrink-0 text-[#9a633b]"

/>

<div>

<h3 className="text-sm font-medium text-[#342b24]">

Furniture Delivery

</h3>

<p className="mt-1 text-xs leading-5 text-[#8b8176]">

Delivery availability and final

shipping charges will be confirmed

when order processing is enabled.

</p>

</div>

</div>

</div>

</aside>

</form>

)}

</div>

</main>

);

}
