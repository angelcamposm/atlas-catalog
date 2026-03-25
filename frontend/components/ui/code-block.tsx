"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    oneDark,
    oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { HiOutlineClipboard, HiOutlineCheck } from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
    highlightLines?: number[];
    className?: string;
    theme?: "dark" | "light";
    maxHeight?: string;
}

export function CodeBlock({
    code,
    language = "typescript",
    title,
    showLineNumbers = true,
    highlightLines = [],
    className,
    theme = "dark",
    maxHeight = "400px",
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const syntaxTheme = theme === "dark" ? oneDark : oneLight;

    return (
        <div
            className={cn(
                "rounded-lg overflow-hidden border",
                theme === "dark"
                    ? "bg-[#282c34] border-gray-700"
                    : "bg-gray-50 border-gray-200",
                className
            )}
        >
            {/* Header */}
            <div
                className={cn(
                    "flex items-center justify-between px-4 py-2 border-b",
                    theme === "dark"
                        ? "bg-[#21252b] border-gray-700"
                        : "bg-gray-100 border-gray-200"
                )}
            >
                <div className="flex items-center gap-2">
                    {/* Traffic lights */}
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    {title && (
                        <span
                            className={cn(
                                "text-sm font-mono ml-2",
                                theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                            )}
                        >
                            {title}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-xs px-2 py-0.5 rounded",
                            theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-600"
                        )}
                    >
                        {language}
                    </span>
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "p-1.5 rounded transition-colors",
                            theme === "dark"
                                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                                : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                        )}
                        title={copied ? "Copied!" : "Copy code"}
                    >
                        {copied ? (
                            <HiOutlineCheck className="w-4 h-4 text-green-500" />
                        ) : (
                            <HiOutlineClipboard className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Code */}
            <div className="overflow-auto" style={{ maxHeight }}>
                <SyntaxHighlighter
                    language={language}
                    style={syntaxTheme}
                    showLineNumbers={showLineNumbers}
                    wrapLines={true}
                    lineProps={(lineNumber) => {
                        const style: React.CSSProperties = { display: "block" };
                        if (highlightLines.includes(lineNumber)) {
                            style.backgroundColor =
                                theme === "dark"
                                    ? "rgba(255, 255, 0, 0.1)"
                                    : "rgba(255, 255, 0, 0.2)";
                        }
                        return { style };
                    }}
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                    }}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

// Inline code component
interface InlineCodeProps {
    children: React.ReactNode;
    className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
    return (
        <code
            className={cn(
                "px-1.5 py-0.5 rounded text-sm font-mono",
                "bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400",
                className
            )}
        >
            {children}
        </code>
    );
}
