
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { SITE_NAME } from "@/constants/site";

const STORAGE_KEY = "splash-seen";
const DURATION = 2200;
const FADE = 500;

const subscribe = () => () => { };

function getSeen() {
    try {
        return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
        return false;
    }
}

export default function SplashScreen() {
    const seen = useSyncExternalStore(subscribe, getSeen, () => false);
    const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");

    useEffect(() => {
        if (seen) return;

        document.body.style.overflow = "hidden";

        const hideTimer = setTimeout(() => setPhase("hide"), DURATION);
        const goneTimer = setTimeout(() => {
            document.body.style.overflow = "";
            try {
                sessionStorage.setItem(STORAGE_KEY, "1");
            } catch { }
            setPhase("gone");
        }, DURATION + FADE);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(goneTimer);
            document.body.style.overflow = "";
        };
    }, [seen]);

    if (seen || phase === "gone") return null;

    return (
        <div
            role="status"
            aria-label="Loading"
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 px-6 text-center transition-opacity duration-500 ${phase === "hide" ? "opacity-0" : "opacity-100"
                }`}
        >
            {/* background glow, same as your hero */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
            </div>

            <div className="relative">
                <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
                    {SITE_NAME}
                </h1>

                <p className="mt-4 text-base text-zinc-400 sm:text-lg">
                    Notes from building things on the web.
                </p>

                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-zinc-600">
                    Web · TypeScript · AI/ML
                </p>

                <div className="mx-auto mt-10 h-1 w-48 overflow-hidden rounded-full bg-zinc-800">
                    <div className="splash-bar h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                </div>
            </div>
        </div>
    );
}