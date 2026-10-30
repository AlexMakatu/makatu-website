import type { Metadata } from "next";
import Uploader from "./Uploader";

export const metadata: Metadata = {
  title: "Campaign header upload | Makatu",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Uploader />;
}
