import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MRCM SPORTS",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
