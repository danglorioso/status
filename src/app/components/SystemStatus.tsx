"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Status = "online" | "offline" | "loading" | "coming-soon";

interface Project {
    key: string;
    name: string;
    url: string;
    favicon?: string;
    comingSoon?: boolean;
    description?: string;
    links?: { label: string; url: string }[];
}

interface SystemStatusProps {
    projects: Project[];
    setLastUpdated: (time: Date) => void;
}

const statusMap = {
    online: {
        text: "Operational",
        color: "bg-green-400 animate-pulse",
        textColor: "text-green-400",
        badgeColor: "bg-green-400/10 text-green-400 border-green-400/20",
    },
    loading: {
        text: "Checking...",
        color: "bg-blue-400 animate-pulse",
        textColor: "text-blue-400",
        badgeColor: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    },
    offline: {
        text: "Unavailable",
        color: "bg-red-400 animate-pulse",
        textColor: "text-red-400",
        badgeColor: "bg-red-400/10 text-red-400 border-red-400/20",
    },
    "coming-soon": {
        text: "Coming Soon",
        color: "bg-yellow-600",
        textColor: "text-yellow-500",
        badgeColor: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
};

export default function SystemStatus({ projects, setLastUpdated }: SystemStatusProps) {
    const [projectStatuses, setProjectStatuses] = useState<Record<string, Status>>({});
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const getOverallStatus = () => {
        const activeProjects = projects.filter((p) => !p.comingSoon);
        const activeStatuses = activeProjects
            .map((p) => projectStatuses[p.key])
            .filter(Boolean);

        if (activeStatuses.length === 0 || activeStatuses.length < activeProjects.length) {
            return {
                loading: true,
                message: "Checking Systems...",
                color: "text-blue-400",
                dotColor: "bg-blue-400 animate-pulse",
            };
        }

        const offlineCount = activeStatuses.filter((s) => s === "offline").length;
        const loadingCount = activeStatuses.filter((s) => s === "loading").length;

        if (offlineCount === 0 && loadingCount === 0) {
            return {
                loading: false,
                message: "All Systems Operational",
                color: "text-green-400",
                dotColor: "bg-green-400",
            };
        } else if (loadingCount === 0) {
            return {
                loading: false,
                message: `${offlineCount} System${offlineCount > 1 ? "s" : ""} Unavailable`,
                color: "text-orange-400",
                dotColor: "bg-orange-400",
            };
        } else {
            return {
                loading: false,
                message: "Checking Systems...",
                color: "text-blue-400",
                dotColor: "bg-blue-400 animate-pulse",
            };
        }
    };

    const getStatusDisplay = (projectKey: string) => {
        const status = projectStatuses[projectKey] || "loading";
        return statusMap[status];
    };

    const checkProjectStatus = async (project: Project) => {
        if (project.comingSoon) {
            setProjectStatuses((prev) => ({ ...prev, [project.key]: "coming-soon" }));
            return;
        }

        setProjectStatuses((prev) => ({ ...prev, [project.key]: "loading" }));

        try {
            const res = await fetch(`/api/ping?url=${encodeURIComponent(project.url)}`);
            const newStatus = res.status === 200 ? "online" : "offline";
            setProjectStatuses((prev) => ({ ...prev, [project.key]: newStatus }));
            setLastUpdated(new Date());
        } catch {
            setProjectStatuses((prev) => ({ ...prev, [project.key]: "offline" }));
            setLastUpdated(new Date());
        }
    };

    useEffect(() => {
        projects.forEach((project) => checkProjectStatus(project));

        const interval = setInterval(() => {
            projects.forEach((project) => {
                if (!project.comingSoon) checkProjectStatus(project);
            });
        }, 15000);

        return () => clearInterval(interval);
    }, [projects]);

    const closeModal = useCallback(() => setSelectedProject(null), []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [closeModal]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [selectedProject]);

    const hasDetails = (proj: Project) =>
        !!(proj.description || (proj.links && proj.links.length > 0));

    const overallStatus = getOverallStatus();

    const renderRow = (proj: Project) => {
        const clickable = hasDetails(proj);
        const statusDisplay = getStatusDisplay(proj.key);

        return (
            <div
                key={proj.key}
                className={`flex items-center justify-between px-6 py-4 transition-colors ${
                    clickable ? "cursor-pointer hover:bg-gray-700/30" : ""
                }`}
                onClick={() => clickable && setSelectedProject(proj)}
            >
                <div className="flex items-center gap-3 min-w-0">
                    {proj.favicon && (
                        <img
                            src={proj.favicon}
                            alt={`${proj.name} favicon`}
                            className="w-4 h-4 flex-shrink-0"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                    )}
                    <span className="text-white font-medium text-sm truncate">
                        {proj.name}
                    </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusDisplay.color}`} />
                    {clickable && (
                        <svg
                            className="w-3.5 h-3.5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    )}
                </div>
            </div>
        );
    };

    const leftProjects = projects.filter((_, i) => i % 2 === 0);
    const rightProjects = projects.filter((_, i) => i % 2 !== 0);

    return (
        <>
            {/* Header */}
            <div className="text-center">
                <div className="flex justify-start mb-10 md:mb-0">
                    <Link
                        href="https://danglorioso.com"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 backdrop-blur-sm"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Main Site
                    </Link>
                </div>

                <Link href="https://danglorioso.com">
                    <img src="/monogram.svg" alt="DG" className="mx-auto mb-4" />
                </Link>
                <h1 className="text-4xl font-bold text-white my-4">System Status</h1>

                <div className={`flex items-center justify-center gap-2 my-4 ${overallStatus.color}`}>
                    <div className="relative w-2 h-2 mr-1 flex items-center justify-center">
                        <div className={`absolute inset-0 ${overallStatus.dotColor} rounded-full animate-pulse opacity-75`} />
                        <div className={`absolute inset-0 ${overallStatus.dotColor} rounded-full animate-ping opacity-75`} />
                    </div>
                    <span className="text-md font-medium">{overallStatus.message}</span>
                </div>
            </div>

            {/* Status Grid */}
            <div className="border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm shadow-[0_0_30px_1px_rgba(0,0,0,0.1)] mt-6">
                {/* Mobile */}
                <div className="flex flex-col md:hidden divide-y divide-gray-700">
                    {projects.map((proj) => renderRow(proj))}
                </div>
                {/* Desktop: two independent columns */}
                <div className="hidden md:flex divide-x divide-gray-700">
                    <div className="flex flex-col flex-1 divide-y divide-gray-700">
                        {leftProjects.map((proj) => renderRow(proj))}
                    </div>
                    <div className="flex flex-col flex-1 divide-y divide-gray-700">
                        {rightProjects.map((proj) => renderRow(proj))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Panel */}
                    <div
                        className="relative w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                {selectedProject.favicon && (
                                    <img
                                        src={selectedProject.favicon}
                                        alt={`${selectedProject.name} favicon`}
                                        className="w-5 h-5 flex-shrink-0"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                )}
                                <h2 className="text-white font-semibold text-base">
                                    {selectedProject.name}
                                </h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700 hover:cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Status badge */}
                        <div className="px-6 pt-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusDisplay(selectedProject.key).badgeColor}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${getStatusDisplay(selectedProject.key).color}`} />
                                {getStatusDisplay(selectedProject.key).text}
                            </span>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-4">
                            {selectedProject.description && (
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    {selectedProject.description}
                                </p>
                            )}
                            {selectedProject.links && selectedProject.links.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.links.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 rounded-md transition-colors border border-blue-400/20 hover:border-blue-400/40"
                                        >
                                            {link.label}
                                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
