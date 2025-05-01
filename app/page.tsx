import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Monitor, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">Share Your Screen Instantly</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">Create a room, share the code, and start presenting to your audience in seconds.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor className="h-6 w-6" />
                            Start Sharing
                        </CardTitle>
                        <CardDescription>Create a room and share your screen with others</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/host">
                            <Button className="w-full">Create Room</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            Join a Room
                        </CardTitle>
                        <CardDescription>Enter a room code to view someone's screen</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/join">
                            <Button variant="outline" className="w-full">
                                Join Room
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>Screen sharing isn’t supported on mobile devices. Mobile users can still join a room to view screens shared by others.</AlertDescription>
            </Alert>
        </div>
    );
}
