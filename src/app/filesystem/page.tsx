"use client";

import { useEffect, useState } from "react";

type FileInfo = {
    name: string;
    size: number | null;
    date: string;
    isDirectory: boolean;
};

export default function Page() {
    const root = "/filesystem"
    const [time, setTime] = useState<string | null>(null);
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPath, setCurrentPath] = useState<string>(root); // current path state
    const [pathHistory, setPathHistory] = useState<string[]>([root]); // path history
    const [currentIndex, setCurrentIndex] = useState(0); // current index in history
    const [reloadKey, setReloadKey] = useState(0); // forces reload when path is unchanged

    useEffect(() => {
        const loadFiles = async () => {
            try {
                setError(null);

                const apiUrl = `${currentPath}/index.json`;

                const response = await fetch(apiUrl, {
                    cache: "no-store",
                });

                const update_resp = await fetch("/update", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Directory not found: ${currentPath || 'root'}`);
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const update_time = await update_resp.text();

                setFiles(data);
                setTime(update_time);
            } catch (err) {
                console.error("Failed to load files:", err);
                setError(err instanceof Error ? err.message : "Failed to load file list");
                setFiles([]);
            } finally {
                setLoading(false);
            }
        };

        loadFiles();
    }, [currentPath, reloadKey]); // reload when path changes or refresh is triggered

    // Handle folder click
    const handleFolderClick = (folderName: string) => {
        const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;

        // Update path history
        const newHistory = pathHistory.slice(0, currentIndex + 1);
        newHistory.push(newPath);

        setPathHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setCurrentPath(newPath);
        setLoading(true);
        setReloadKey(k => k + 1);
    };

    // Handle going up one directory
    const handleGoBack = () => {
        if (currentPath && currentPath != root) {
            const pathParts = currentPath.split('/');
            pathParts.pop(); // remove the last segment
            const newPath = pathParts.join('/');

            setPathHistory([...pathHistory, newPath]);
            setCurrentIndex(prev => prev + 1);
            setCurrentPath(newPath);
            setLoading(true);
            setReloadKey(k => k + 1);
        }
    };

    // Handle returning to root
    const handleGoToRoot = () => {
        const newHistory = pathHistory.slice(0, currentIndex + 1);
        newHistory.push(root);
        setPathHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setCurrentPath(root);
        setLoading(true);
        setReloadKey(k => k + 1);
    };

    // Back/forward navigation
    const handleNavigateBack = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setCurrentPath(pathHistory[newIndex]);
            setLoading(true);
            setReloadKey(k => k + 1);
        }
    };

    const handleNavigateForward = () => {
        if (currentIndex < pathHistory.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setCurrentPath(pathHistory[newIndex]);
            setLoading(true);
            setReloadKey(k => k + 1);
        }
    };

    // Handle breadcrumb click
    const handleBreadcrumbClick = (path: string) => {
        const newHistory = pathHistory.slice(0, currentIndex + 1);
        newHistory.push(path);
        setPathHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setCurrentPath(path);
        setLoading(true);
        setReloadKey(k => k + 1);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading file list...</p>
                    {currentPath && (
                        <p className="mt-2 text-sm text-gray-500">{currentPath}</p>
                    )}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-2xl mb-4">⚠️</div>
                    <p className="text-red-600 mb-2">{error}</p>
                    <div className="space-x-2">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                        <button
                            onClick={handleGoToRoot}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Back to root
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (files.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">This directory is empty</p>
                    <button
                        onClick={handleGoToRoot}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to root
                    </button>
                </div>
            </div>
        );
    }

    // Build breadcrumb path
    const breadcrumbs = currentPath ? [...currentPath.split('/').filter(Boolean)] : [];
    return (
        <div className="container mx-auto p-4 font-mono text-sm">
            {/* Navigation bar */}
            <div className="mb-4 flex items-center gap-2">
                {/* Navigation buttons */}
                <div className="flex items-center gap-2 mr-4">
                    <button
                        onClick={handleNavigateBack}
                        disabled={currentIndex === 0}
                        className={`p-1 rounded ${currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        title="Back"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNavigateForward}
                        disabled={currentIndex === pathHistory.length - 1}
                        className={`p-1 rounded ${currentIndex === pathHistory.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        title="Forward"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleGoBack}
                        disabled={!currentPath}
                        className={`p-1 rounded ${!currentPath ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        title="Parent directory"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v-6m0 0l-3 3m3-3l3 3" />
                        </svg>
                    </button>
                    <button
                        onClick={handleGoToRoot}
                        className="p-1 rounded text-gray-600 hover:bg-gray-100"
                        title="Root"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
                        </svg>
                    </button>
                </div>

                {/* Breadcrumb navigation */}
                <div className="flex items-center gap-2 flex-wrap flex-1">
                    {breadcrumbs.map((folder, index) => {
                        const pathParts = breadcrumbs.slice(0, index + 1);
                        const path = '/' + pathParts.join('/'); // prepend slash so the request path is complete

                        return (
                            <div key={index} className="flex items-center">
                                {(
                                    <>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <button
                                            onClick={() => handleBreadcrumbClick(path)}
                                            className={`px-2 py-1 text-sm rounded ${index === breadcrumbs.length - 1
                                                ? 'font-semibold text-gray-900'
                                                : 'font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                                }`}
                                        >
                                            {folder}
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <h1 className="text-xl font-bold mb-2 text-gray-800">
                Index of {currentPath ? `${currentPath}` : "/"}
            </h1>
            <p className="text-gray-500 text-xs mb-4">Updated at {time}</p>

            <div className="overflow-x-auto border border-gray-300 rounded">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last modified
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Size
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Parent directory link */}
                        {currentPath && (
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <button
                                        onClick={handleGoBack}
                                        className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2 cursor-pointer"
                                    >
                                        <span className="text-lg">📁</span>
                                        <span>..</span>
                                    </button>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">-</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">-</td>
                            </tr>
                        )}

                        {files.map((file, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {file.isDirectory ? (
                                        <button
                                            onClick={() => handleFolderClick(file.name)}
                                            className="flex items-center gap-2 font-medium text-blue-700 hover:text-blue-900 hover:underline cursor-pointer w-full text-left"
                                        >
                                            <span className="text-lg">📁</span>
                                            <span className="truncate">{file.name}</span>
                                        </button>
                                    ) : (
                                        <a
                                            href={`${currentPath ? currentPath + '/' : ''}${file.name}`}
                                            className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2"
                                            download
                                        >
                                            <span className="text-lg">📄</span>
                                            <span className="truncate">{file.name}</span>
                                        </a>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                    {file.date}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                    {file.isDirectory ? "-" : formatFileSize(file.size || 0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>
                    {files.length} items
                    {currentPath && " (current)"}
                </div>
                <div className="flex gap-4">
                    <div>
                        Folders: {files.filter(f => f.isDirectory).length}
                    </div>
                    <div>
                        Files: {files.filter(f => !f.isDirectory).length}
                    </div>
                    <div>
                        Total size: {formatFileSize(files.reduce((sum, f) => sum + (f.size || 0), 0))}
                    </div>
                </div>
            </div>

            <footer className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-400 text-xs">
                    <span className="font-medium">FileSystem v1.0.0</span> Powered by
                    Cloudflare Workers
                </p>
            </footer>
        </div>
    );
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} K`;
    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(1)} M`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} G`;
}
