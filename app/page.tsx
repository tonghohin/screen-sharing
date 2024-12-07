import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
    const t = useTranslations("Home");
    return (
        <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">{t("header")}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">{t("description")}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-12">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-6 w-6" />
                                {t("start-title")}
                            </CardTitle>
                            <CardDescription>{t("start-desc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/host">
                                <Button className="w-full">{t("create-room-btn")}</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6" />
                                {t("join-title")}
                            </CardTitle>
                            <CardDescription>{t("join-desc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/join">
                                <Button variant="outline" className="w-full">
                                    {t("join-room-btn")}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
