import { ClarityScript } from "@/components/clarity-script";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Screen Share - Share Your Screen Instantly",
    description: "Share your screen instantly with anyone using a simple room code. No downloads or sign-ups required.",
    keywords: ["screen sharing", "webrtc", "online screen share", "browser screen sharing", "free screen sharing", "share your screen", "share screen", "screen share"],
    other: {
        "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ""
    }
} satisfies Metadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="from-background to-muted flex min-h-screen flex-col justify-between bg-linear-to-b">
                    {children}
                    <footer className="text-muted-foreground px-4 py-8 text-center text-sm">
                        Built by{" "}
                        <Link href="https://tonghohin.vercel.app" className="underline" target="_blank">
                            Hin
                        </Link>
                        . The source code is available on{" "}
                        <Link href="https://github.com/tonghohin/screen-sharing" className="underline" target="_blank">
                            Github
                        </Link>
                        .
                    </footer>
                </main>
                <ClarityScript />
                <Toaster richColors />
            </body>
        </html>
    );
}
