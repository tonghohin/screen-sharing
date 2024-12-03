"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export default function JoinPage() {
    const [roomId, setRoomId] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const peerRef = useRef<Peer | null>(null);
    const { toast } = useToast();

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordingChunks, setRecordingChunks] = useState<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);

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
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
        };
    }, []);

    function joinRoom(roomIdToJoin: string = roomId) {
        if (!roomIdToJoin.trim()) {
            toast({
                title: "Room code required",
                description: "Please enter a valid room code.",
                variant: "destructive"
            });
            return;
        }

        setIsConnecting(true);

        const peer = new Peer({ debug: 2 });
        peerRef.current = peer;

        peer.on("open", () => {
            const connection = peer.connect(roomIdToJoin);

            connection.on("open", () => {
                setIsConnected(true);
                toast({
                    title: "Connected!",
                    description: "Waiting for host to share their screen..."
                });
            });

            peer.on("call", (call) => {
                call.answer();
                call.on("stream", (remoteStream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = remoteStream;
                        videoRef.current.play().catch(console.error);
                    }
                    setActiveStream(remoteStream);
                });
            });

            connection.on("close", () => {
                setIsConnecting(false);
                setIsConnected(false);
                setRoomId("");
                toast({
                    title: "Disconnected",
                    description: "The session has been ended.",
                    variant: "destructive"
                });
            });
        });

        peer.on("error", (err) => {
            setIsConnecting(false);
            toast({
                title: "Connection failed",
                description: "Could not connect to the room. Please check the room code and try again.",
                variant: "destructive"
            });
        });
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "video/webm;codecs=vp8,opus"
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordingChunks((prev) => [...prev, event.data]);
                }
            };

            mediaRecorder.onstart = () => {
                toast({
                    title: "Recording started",
                    description: "The recording has started successfully."
                });
            };

            mediaRecorder.onerror = (event) => {
                console.error("MediaRecorder error:", event);
                setIsRecording(false);
                setMediaRecorder(null);
                toast({
                    title: "Recording Error",
                    description: "An error occurred during recording.",
                    variant: "destructive"
                });
            };

            setRecordingChunks([]);
            mediaRecorder.start(100);
            setMediaRecorder(mediaRecorder);
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordingChunks, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "recorded-video.webm";
                a.click();
                URL.revokeObjectURL(url);
                setRecordingChunks([]);
            };
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <Button variant="outline" asChild>
                    <Link href="/" className="flex items-center gap-2">
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
                    <CardContent className="space-y-6">
                        {!isConnected ? (
                            <div className="space-y-4">
                                <Input placeholder="Enter room code" value={roomId} onChange={(e) => setRoomId(e.target.value)} disabled={isConnecting} />
                                <Button className="w-full" onClick={() => joinRoom()} disabled={isConnecting || !roomId.trim()}>
                                    {isConnecting ? "Connecting..." : "Join Room"}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div ref={videoContainerRef} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
                                    <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline controls />
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => {
                                            if (activeStream) {
                                                startRecording();
                                            } else {
                                                toast({
                                                    title: "No Stream Available",
                                                    description: "There is no active stream to record.",
                                                    variant: "destructive"
                                                });
                                            }
                                        }}
                                        disabled={isRecording}>
                                        Start Recording
                                    </Button>
                                    <Button onClick={stopRecording} disabled={!isRecording}>
                                        Stop Recording
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
