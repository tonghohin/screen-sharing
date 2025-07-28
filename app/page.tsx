import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { CustomRoomIdForm } from "./_components/custom-room-id-form";

export default function Home() {
    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Share Your Screen Instantly</h1>
                <p className="text-primary text-xl">Create a room, share the code, and start presenting to your audience in seconds.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor />
                            Start Sharing
                        </CardTitle>
                        <CardDescription>Create a room and share your screen with others</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Link href="/host">
                            <Button className="w-full">Create Room</Button>
                        </Link>
                        <CustomRoomIdForm />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users />
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
                <AlertCircle />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>Screen sharing isn’t supported on mobile devices. Mobile users can still join a room to view screens shared by others.</AlertDescription>
            </Alert>
        </div>
    );
}
