"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function JoinPage() {
    const [roomId, setRoomId] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<Peer | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roomFromUrl = params.get("room");
        if (roomFromUrl) {
            setRoomId(roomFromUrl);
        }

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (videoRef.current && activeStream) {
            videoRef.current.srcObject = activeStream;
            videoRef.current.play().catch(console.error);
        }
    }, [activeStream]);

    function joinRoom(roomIdToJoin: string = roomId) {
        if (!roomIdToJoin.trim()) {
            toast.error("Room code required", {
                description: "Please enter a valid room code."
            });
            return;
        }

        setIsConnecting(true);

        const peer = new Peer({ debug: 2 });
        peerRef.current = peer;

        peer.on("open", () => {
            const connection = peer.connect(roomIdToJoin);

            connection.on("open", () => {
                toast.success("Connected!", {
                    description: "Waiting for host to share their screen..."
                });
            });

            peer.on("call", (call) => {
                call.answer();
                call.on("stream", (remoteStream) => {
                    setActiveStream(remoteStream);
                });
            });

            connection.on("close", () => {
                setIsConnecting(false);
                setRoomId("");
                setActiveStream(null);
                toast.error("Disconnected", {
                    description: "The session has been ended."
                });
            });
        });

        peer.on("error", (err) => {
            console.error("Peer error:", err);
            setIsConnecting(false);
            toast.error("Connection failed", {
                description: "Could not connect to the room. Please check the room code and try again."
            });
        });
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
            <Button variant="outline" asChild>
                <Link href="/" className="flex items-center gap-2 self-start">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Join a Room
                    </CardTitle>
                    <CardDescription>Enter the room code to join and view the shared screen</CardDescription>
                </CardHeader>
                <CardContent>
                    {!activeStream ? (
                        <div className="flex flex-col gap-4">
                            <Input placeholder="Enter room code" value={roomId} onChange={(e) => setRoomId(e.target.value)} disabled={isConnecting} />
                            <Button className="w-full" onClick={() => joinRoom()} disabled={isConnecting || !roomId.trim()}>
                                {isConnecting ? "Connecting..." : "Join Room"}
                            </Button>
                        </div>
                    ) : (
                        <div className="group relative aspect-video overflow-hidden rounded-lg bg-gray-900">
                            <video ref={videoRef} className="h-full w-full object-contain" autoPlay playsInline loop controls />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
