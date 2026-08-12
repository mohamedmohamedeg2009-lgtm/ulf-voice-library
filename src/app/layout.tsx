import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "مكتبة أصوات الخليج", template: "%s | مكتبة أصوات الخليج" },
  description: "مكتبة شخصية لإنتاج وإدارة الأصوات الرجالية الخليجية.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body>{children}</body>
    </html>
  );
}
