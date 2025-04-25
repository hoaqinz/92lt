import { Roboto } from "next/font/google";
import "../globals.css";
import "./admin.scss";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata = {
  title: "92LOTTERY Admin Panel",
  description: "Admin Panel for 92LOTTERY",
  robots: "noindex, nofollow"
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${roboto.variable} admin-body`}>
        {children}
      </body>
    </html>
  );
}
