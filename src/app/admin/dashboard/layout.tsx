'use client';

import AdminClient from '../admin-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClient>{children}</AdminClient>;
}
