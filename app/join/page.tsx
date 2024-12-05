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
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<Peer | null>(null);
    const { toast } = useToast();

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordingChunks, setRecordingChunks] = useState<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);

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

    useEffect(() => {
        if (videoRef.current && activeStream) {
            videoRef.current.srcObject = activeStream;
            videoRef.current.play().catch(console.error);
        }
    }, [activeStream]);

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
                toast({
                    title: "Connected!",
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
                toast({
                    title: "Disconnected",
                    description: "The session has been ended.",
                    variant: "destructive"
                });
            });
        });

        peer.on("error", (err) => {
            console.error("Peer error:", err);
            setIsConnecting(false);
            toast({
                title: "Connection failed",
                description: "Could not connect to the room. Please check the room code and try again.",
                variant: "destructive"
            });
        });
    }

    function startRecording() {
        console.log(peerRef.current);
        console.log("Connection when start recording");
        if (!activeStream) {
            toast({
                title: "No Stream",
                description: "No active stream to record.",
                variant: "destructive"
            });
            return;
        }

        try {
            const mimeType = "video/mp4";
            const recorder = new MediaRecorder(activeStream, {
                mimeType,
                videoBitsPerSecond: 2500000
            });

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordingChunks((prev) => [...prev, event.data]);
                }
            };

            recorder.onstart = () => {
                setRecordingChunks([]);
                toast({
                    title: "Recording started",
                    description: "The recording has started successfully."
                });
            };

            recorder.onerror = (event) => {
                console.error("MediaRecorder error:", event);
                setIsRecording(false);
                setMediaRecorder(null);
                toast({
                    title: "Recording Error",
                    description: "An error occurred during recording.",
                    variant: "destructive"
                });
            };

            recorder.start(100);
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error("Failed to start recording:", error);
            setIsRecording(false);
            toast({
                title: "Recording Error",
                description: "Unable to start recording. Please try again.",
                variant: "destructive"
            });
        }
    }

    function stopRecording() {
        if (!mediaRecorder) return;

        try {
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordingChunks, { type: "video/mp4" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `recording-${new Date().toISOString()}.mp4`;
                link.click();

                URL.revokeObjectURL(url);
                setRecordingChunks([]);
                setIsRecording(false);
                setMediaRecorder(null);

                toast({
                    title: "Recording Saved",
                    description: "The recording has been saved successfully."
                });
            };

            mediaRecorder.stop();
        } catch (error) {
            console.error("Error stopping recording:", error);
            toast({
                title: "Error",
                description: "Failed to stop recording.",
                variant: "destructive"
            });
        }
    }

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
                        {!activeStream ? (
                            <div className="space-y-4">
                                <Input placeholder="Enter room code" value={roomId} onChange={(e) => setRoomId(e.target.value)} disabled={isConnecting} />
                                <Button className="w-full" onClick={() => joinRoom()} disabled={isConnecting || !roomId.trim()}>
                                    {isConnecting ? "Connecting..." : "Join Room"}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
                                    <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline loop controls />
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
