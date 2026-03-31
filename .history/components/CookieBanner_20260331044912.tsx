"use client";

import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="makatu_cookie_consent"
      style={{ background: "#111827" }}
      buttonStyle={{ color: "#fff", background: "#2563eb" }}
      declineButtonStyle={{ color: "#fff", background: "#6b7280" }}
      expires={365}
    >
      We use cookies to improve your experience.
    </CookieConsent>
  );
}
