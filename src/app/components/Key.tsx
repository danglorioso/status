"use client";

import { useState, useEffect } from "react";

interface FooterProps {
    lastUpdated?: Date;
}

export default function Footer({ lastUpdated }: FooterProps) {
    const [initialClientTime, setInitialClientTime] = useState<string | null>(
        null
    );

    useEffect(() => {
        // Set fallback time only on the client
        setInitialClientTime(new Date().toLocaleString());
    }, []);

    return (
        <div className="space-y-4">
            {/* Footer */}
            <div className="text-center mt-5 text-gray-400 text-sm">
                <p>
                    Last updated:{" "}
                    {lastUpdated
                        ? lastUpdated.toLocaleString()
                        : initialClientTime}
                </p>
            </div>

            {/* Status Legend */}
            <div className="text-center">
                <div className="inline-flex flex-wrap items-center justify-center gap-6 px-6 py-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50">
                    <div className="text-sm text-gray-400 font-medium mb-2 sm:mb-0 w-full sm:w-auto">
                        Status Legend:
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-grow-pulse" />
                        <span className="text-sm text-green-400 font-medium">
                            Available
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-grow-pulse" />
                        <span className="text-sm text-red-400 font-medium">
                            Unavailable
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-grow-pulse" />
                        <span className="text-sm text-blue-400 font-medium">
                            Loading
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-600 animate-grow-pulse" />
                        <span className="text-sm text-yellow-600 font-medium">
                            Coming Soon
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
