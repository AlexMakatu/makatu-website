export default function Footer() {
  return (
    <footer className="bg-[#2f1d5a] text-white mt-32">
      {/* CTA SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold">Need to move a vehicle?</h2>

        <p className="text-purple-200 mt-3">
          Get a fast nationwide transport quote in minutes.
        </p>

        <a
          href="/get-a-quote"
          className="inline-block mt-6 bg-white text-[#2f1d5a] px-6 py-3 rounded-lg font-medium hover:opacity-90"
        >
          Get a Quote
        </a>
      </div>

      {/* MAIN FOOTER */}
      <div className="border-t border-purple-500/30">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-16">
          {/* BRAND */}
          <div>
            <h3 className="text-xl font-semibold">Makatu</h3>

            <p className="text-purple-200 mt-3 max-w-sm text-sm">
              Reliable nationwide vehicle transport across South Africa.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h4 className="font-semibold mb-3">Services</h4>

            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <a href="/vehicle-transport">Vehicle Transport</a>
              </li>
              <li>
                <a href="/get-a-quote">Request Quote</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>

            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-purple-500/30">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between text-xs text-purple-300">
          <span>© Makatu Vehicle Transport 2026</span>

          <div className="flex gap-6">
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
