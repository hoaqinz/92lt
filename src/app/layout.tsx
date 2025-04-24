import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "92LOTTERY - Xổ Số & Casino Trực Tuyến Hàng Đầu Việt Nam",
  description: "92LOTTERY - Nền tảng xổ số, casino và cá cược trực tuyến uy tín hàng đầu Việt Nam. Đa dạng trò chơi, thanh toán nhanh chóng, bảo mật tuyệt đối.",
  keywords: "92lottery, 92 lottery, xổ số trực tuyến, casino trực tuyến, cá cược thể thao, win go, k3 lotre, 5d lotre, slots, bắn cá, game bài, sòng bài trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${roboto.variable}`}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
