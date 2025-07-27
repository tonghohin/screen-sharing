"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface ShareOptionsProps {
    roomId: string;
}

export function ShareOptions({ roomId }: ShareOptionsProps) {
    function copyRoomId() {
        navigator.clipboard.writeText(roomId);
        toast.success("Room code copied!", {
            description: "Share this code with others to let them join your room."
        });
    }

    function copyShareableLink() {
        const shareableUrl = `${window.location.origin}/join?room=${roomId}`;
        navigator.clipboard.writeText(shareableUrl);
        toast.success("Shareable link copied!", {
            description: "Share this link with others to let them join your room directly."
        });
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm">Room Code</p>
                <code className="bg-muted flex w-full items-center justify-between gap-2 rounded-lg p-3 font-mono text-sm tracking-tight">
                    {roomId || "Generating room code..."}
                    <Button variant="ghost" size="sm" onClick={copyRoomId} disabled={!roomId} className="text-muted-foreground size-4">
                        <CopyIcon />
                    </Button>
                </code>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">or</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm">Shareable Link</p>
                <code className="bg-muted flex w-full items-center justify-between gap-2 rounded-lg p-3 font-mono text-sm tracking-tight">
                    {roomId ? `${window.location.origin}/join?room=${roomId}` : "Generating link..."}
                    <Button variant="ghost" size="sm" onClick={copyShareableLink} disabled={!roomId} className="text-muted-foreground size-4">
                        <CopyIcon />
                    </Button>
                </code>
            </div>
        </div>
    );
}
