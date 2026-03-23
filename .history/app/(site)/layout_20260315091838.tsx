import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
});

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={leagueSpartan.className}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
