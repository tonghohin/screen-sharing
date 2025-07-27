"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CustomRoomIdForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [customRoomId, setCustomRoomId] = useState("");

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-4">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground text-xs">
                    <ChevronRightIcon className={cn("transition-transform", isOpen && "rotate-90")} />
                    Need a custom room ID?
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="custom-id">Custom Room ID</Label>
                    <Input id="custom-id" placeholder="my-presentation-room" value={customRoomId} onChange={(e) => setCustomRoomId(e.target.value)} />
                    <span className="text-muted-foreground text-sm md:max-w-90">Must start and end with a letter or number. Dashes, underscores, and spaces allowed in between.</span>
                </div>
                <Button variant="outline" disabled={!customRoomId} asChild={!!customRoomId}>
                    <Link href={`/host?room=${customRoomId}`}>Create Room with Custom ID</Link>
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}
