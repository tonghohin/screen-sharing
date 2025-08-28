"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

export function ClarityScript() {
    const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (!clarityProjectId) return null;

    useEffect(() => {
        if (window.location.hostname === "localhost") return;

        Clarity.init(clarityProjectId);
        Clarity.consent();
    }, [clarityProjectId]);

    return null;
}
