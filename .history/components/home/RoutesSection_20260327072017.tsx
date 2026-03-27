"use client";

import Link from "next/link";
import Image from "next/image";

type Route = {
  slug?: {
    current?: string;
  };
  routeSummary?: string;
  routeImage?: {
    asset?: {
      url?: string;
    };
  };
  fromCity?: {
    name?: string;
  };
  toCity?: {
    name?: string;
  };
  lowestPrice?: number;
  priceType?: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
};

type Props = {
  routes?: Route[];
};

export default function RoutesSection({ routes }: Props) {
  if (!routes || routes.length === 0) return null;

  function renderPrice(route: Route) {
    // No price at all
    if (!route.lowestPrice || route.priceType === "quoteRequired") {
      return (
        <div className="mb-3">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            Pricing
          </span>
          <div className="text-brand text-lg font-semibold leading-tight">
            Quote Required
          </div>
        </div>
      );
    }

    // Negotiable
    if (route.priceType === "negotiable") {
      return (
        <div className="mb-3">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            Pricing
          </span>
          <div className="text-brand text-lg font-semibold leading-tight">
            Negotiable
          </div>
        </div>
      );
    }

    // Fixed or startingFrom
    return (
      <div className="mb-3">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {route.priceType === "fixed"
            ? "Price (Excl. VAT)"
            : "From (Excl. VAT)"}
        </span>

        <div className="text-brand text-lg font-semibold leading-tight">
          R{route.lowestPrice.toLocaleString()}
        </div>

        <p className="text-xs text-gray-400 mt-1">
          Estimated price. Final quote may vary.
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* HEADING */}
        <div className="relative text-center mb-14">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] md:text-[140px] font-extrabold text-brand/10 leading-none pointer-events-none select-none">
            ROUTES
          </span>

          <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Popular Vehicle Transport Routes
          </h2>
        </div>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route, index) => {
            const from = route.fromCity?.name || "";
            const to = route.toCity?.name || "";

            return (
              <Link
                key={index}
                href={`/vehicle-transport/${route.slug?.current}`}
                className="group w-full"
              >
                <div
                  className="
                    bg-white rounded-2xl overflow-hidden
                    border border-gray-200
                    transition-all duration-300
                    hover:-translate-y-2
                    hover:shadow-[0_25px_70px_rgba(49,29,96,0.08)]
                  "
                >
                  {/* IMAGE */}
                  <div className="relative h-52 w-full bg-gray-100">
                    <Image
                      src={
                        route.routeImage?.asset?.url ||
                        "/images/placeholder.jpg"
                      }
                      alt={`${from} to ${to}`}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute top-4 left-4 bg-brand text-white text-xs px-3 py-1 rounded-full shadow">
                      Top Route
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 text-center">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {from} → {to}
                    </h3>

                    {/* PRICE */}
                    {renderPrice(route)}

                    <span className="text-sm font-medium text-brand group-hover:underline">
                      View Route →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/vehicle-transport"
            className="text-brand font-medium hover:underline"
          >
            View all routes →
          </Link>
        </div>
      </div>
    </section>
  );
}
