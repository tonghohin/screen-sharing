import { Clarity } from "@/components/Clarity";
import { Toaster } from "@/components/ui/toaster";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale: (await params).locale, namespace: "Common" });

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords")
    };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    const t = await getTranslations({ locale, namespace: "Common" });

    return (
        <html lang={locale}>
            <body className={inter.className}>
                <main className="flex flex-col justify-between min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
                    <footer className="py-8 px-4 text-center text-gray-500 text-sm">
                        {t.rich("footer", {
                            author: (chunks) => (
                                <Link href="https://tonghohin.vercel.app" className="underline" target="_blank">
                                    {chunks}
                                </Link>
                            ),
                            link: (chunks) => (
                                <Link href="https://github.com/tonghohin/screen-sharing" className="underline" target="_blank">
                                    {chunks}
                                </Link>
                            )
                        })}
                    </footer>
                </main>
                <Clarity />
                <Toaster />
            </body>
        </html>
    );
}
