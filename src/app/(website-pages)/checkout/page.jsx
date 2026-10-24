"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

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

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

export default function CheckoutPage() {
  const router = useRouter();

  const cartItems = useSelector(
    (state) => state.cart?.items ?? []
  );

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          throw new Error("API URL is not configured");
        }

        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.user) {
          throw new Error("Not authenticated");
        }

        if (!cancelled) {
          setIsAuthenticated(true);

          setForm((previous) => ({
            ...previous,
            email: data.user.email || "",
            firstName:
              data.user.name?.split(" ")[0] || "",
            lastName:
              data.user.name
                ?.split(" ")
                .slice(1)
                .join(" ") || "",
          }));
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);

          router.replace(
            "/sign-in?redirect=%2Fcheckout"
          );
        }
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
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [orderItems]
  );

  // Demo shipping rule; backend will calculate final amount.
  const shipping =
    subtotal === 0 || subtotal >= 5000 ? 0 : 199;

  const total = subtotal + shipping;

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

    if (orderItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const missingField = requiredFields.find(
      (field) => !form[field].trim()
    );

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

    if (paymentMethod === "online") {
      setError(
        "Online payment will be available after payment gateway integration."
      );
      return;
    }

    setLoading(true);

    try {
      // Order API will be integrated in the next step.
      // Do not clear cart or display a fake order confirmation.

      setError(
        "Checkout details are valid. Order placement will be enabled after the Order API is connected."
      );
    } finally {
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
  // LOADING SCREEN
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-20">
      {/* ======================================
          PAGE HEADER
      ====================================== */}
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
                Just a few details before your new furniture
                finds its home.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#e9ded1] bg-[#fbf8f4] px-4 py-2 text-xs font-medium text-[#8a6546]">
              <LockKeyhole size={15} />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          CHECKOUT CONTENT
      ====================================== */}
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
              Add your favourite furniture pieces before
              proceeding to checkout.
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
            {/* LEFT SIDE */}
            <div className="space-y-7">
              {/* SHIPPING ADDRESS */}
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#51483f]">
                      First Name *
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
                      Last Name *
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
                      Email Address *
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
                      Mobile Number *
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
                      Street Address *
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
                      City *
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
                      State *
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
                      PIN Code *
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

              {/* PAYMENT METHOD */}
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
                  {/* COD */}
                  <label
                    className={`
                      flex cursor-pointer items-start gap-4
                      rounded-2xl border p-5 transition-all
                      ${
                        paymentMethod === "cod"
                          ? "border-[#9a633b] bg-[#fcf8f4]"
                          : "border-[#e9e2d9] hover:border-[#c8aa90]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
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

                  {/* ONLINE PAYMENT */}
                  <label
                    className={`
                      flex cursor-pointer items-start gap-4
                      rounded-2xl border p-5 transition-all
                      ${
                        paymentMethod === "online"
                          ? "border-[#9a633b] bg-[#fcf8f4]"
                          : "border-[#e9e2d9] hover:border-[#c8aa90]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
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
                        Coming Soon
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

            {/* RIGHT SIDE: ORDER SUMMARY */}
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

                {/* PRODUCTS */}
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

                {/* PRICE BREAKDOWN */}
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
                    className="
                      mt-6 flex w-full items-center justify-center
                      gap-3 rounded-xl bg-[#9a633b] px-5 py-4
                      text-sm font-medium text-white
                      transition-all hover:bg-[#80512f]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {loading
                      ? "Processing..."
                      : "Place Order"}

                    {!loading && <ArrowRight size={18} />}
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

              {/* DELIVERY INFORMATION */}
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
                      Delivery availability and final shipping
                      charges will be confirmed when order
                      processing is enabled.
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