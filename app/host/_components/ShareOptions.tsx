"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ShareOptionsProps {
    roomId: string;
}

export function ShareOptions({ roomId }: ShareOptionsProps) {
    const t = useTranslations("ShareOptions");
    const { toast } = useToast();

    function copyRoomId() {
        navigator.clipboard.writeText(roomId);
        toast({
            title: t("code-copied"),
            description: t("code-copied-desc")
        });
    }

    function copyShareableLink() {
        const shareableUrl = `${window.location.origin}/join?room=${roomId}`;
        navigator.clipboard.writeText(shareableUrl);
        toast({
            title: t("link-copied"),
            description: t("link-copied-desc")
        });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t("room-code")}</span>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={copyRoomId} disabled={!roomId}>
                        <Copy className="h-4 w-4" />
                        {t("copy-code-btn")}
                    </Button>
                </div>
                <code className="block w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono">{roomId || t("generating-code")}</code>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t("shareable-link")}</span>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={copyShareableLink} disabled={!roomId}>
                        <LinkIcon className="h-4 w-4" />
                        {t("copy-link-btn")}
                    </Button>
                </div>
                <code className="block w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono truncate">{roomId ? `${window.location.origin}/join?room=${roomId}` : t("generating-link")}</code>
            </div>
        </div>
    );
}
