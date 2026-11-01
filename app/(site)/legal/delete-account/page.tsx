import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete your Makatu Driver account | Makatu",
  description:
    "How to request deletion of your Makatu Driver app account and what data is removed.",
  alternates: { canonical: "/legal/delete-account" },
};

const mailto =
  "mailto:alex@makatu.co.za?subject=" +
  encodeURIComponent("Delete Driver account") +
  "&body=" +
  encodeURIComponent(
    "Please delete my Makatu Driver app account.\n\nName:\nEmail / phone / username used in the app:\n",
  );

export default function DeleteAccountPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-[#311d60]">
        Delete your Makatu Driver account
      </h1>
      <p className="mb-10 text-gray-600">
        This page explains how drivers, checkers and TAC users of the Makatu
        Driver app (Makatu Business Enterprises) can ask for their account and
        related data to be deleted.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#311d60]">
          How to request deletion
        </h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            Email <strong>alex@makatu.co.za</strong> from the email address
            linked to your account. If you can&apos;t, include the phone number
            or username you use in the Driver app.
          </li>
          <li>
            Use the subject line <strong>&quot;Delete Driver account&quot;</strong>.
          </li>
          <li>We may contact you to confirm the request is really from you.</li>
        </ol>
        <a
          href={mailto}
          className="inline-block mt-6 rounded-lg bg-[#311d60] px-6 py-3 font-semibold text-white hover:bg-[#4a2d91]"
        >
          Email a deletion request
        </a>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#311d60]">
          What happens
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your Driver app login is stopped and your Zoho portal access is removed.</li>
          <li>We handle requests within <strong>7 business days</strong> and confirm by email.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#311d60]">
          What data is deleted
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your portal user account and login access.</li>
          <li>
            The app profile data held for you in our system (such as your name,
            contact details and app settings).
          </li>
        </ul>
        <h3 className="text-lg font-semibold mt-6 mb-2">What may be kept</h3>
        <p>
          Operational records required by law or for completed deliveries
          (for example inspection and delivery records for customer vehicles)
          may be kept for as long as required, then deleted.
        </p>
      </section>

      <p className="text-sm text-gray-500">
        Questions? Email{" "}
        <a href="mailto:alex@makatu.co.za" className="text-[#311d60] underline">
          alex@makatu.co.za
        </a>
        .
      </p>
    </div>
  );
}
