"use client";

export default function PrintButton() {
  const printOrganogram = () => {
    document.body.classList.add("organogram-is-printing");

    const cleanup = () => {
      document.body.classList.remove("organogram-is-printing");
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  return (
    <button
      type="button"
      onClick={printOrganogram}
      className="rounded-full bg-white px-6 py-3 text-sm font-black text-[#311d60] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
