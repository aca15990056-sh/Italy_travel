import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "여행 일정 10/1~10/11 (로마 In · 밀라노 Out)",
  description: "이탈리아-스위스 11일 일정 지도/명소/경로 안내"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
