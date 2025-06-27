
import type { Metadata } from "next";
import SideMenu from "../components/dashboard/SideMenu";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard | Keen",
  description: "To You Musliss",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dashboard-layout">
      <SideMenu></SideMenu>

      <div className="page">
        <Suspense fallback={<p>تحميل...</p>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
