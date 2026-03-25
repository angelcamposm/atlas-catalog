"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Image from "next/image";
import { CodeBlock } from "./code-block";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * MarkdownRenderer - Componente para renderizar contenido Markdown
 *
 * Características:
 * - GitHub Flavored Markdown (tablas, checkboxes, strikethrough)
 * - Syntax highlighting en bloques de código
 * - Enlaces automáticos en headings
 * - Estilos consistentes con el tema de la aplicación
 */
export function MarkdownRenderer({
    content,
    className = "",
}: MarkdownRendererProps) {
    return (
        <div
            className={`markdown-content prose prose-slate dark:prose-invert max-w-none ${className}`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                ]}
                components={{
                    // Headings
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mt-6 mb-3 pb-1 border-b border-gray-100 dark:border-gray-800">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-semibold mt-5 mb-2">
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-lg font-medium mt-4 mb-2">
                            {children}
                        </h4>
                    ),

                    // Paragraphs and text
                    p: ({ children }) => (
                        <p className="my-3 leading-7 text-gray-700 dark:text-gray-300">
                            {children}
                        </p>
                    ),

                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target={
                                href?.startsWith("http") ? "_blank" : undefined
                            }
                            rel={
                                href?.startsWith("http")
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                            {children}
                        </a>
                    ),

                    // Lists
                    ul: ({ children }) => (
                        <ul className="my-3 ml-6 list-disc space-y-1">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-3 ml-6 list-decimal space-y-1">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-gray-700 dark:text-gray-300 leading-7">
                            {children}
                        </li>
                    ),

                    // Blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="my-4 pl-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 py-2 italic text-gray-600 dark:text-gray-400">
                            {children}
                        </blockquote>
                    ),

                    // Code blocks
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !className;

                        if (isInline) {
                            return (
                                <code
                                    className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono text-pink-600 dark:text-pink-400"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        const language = match ? match[1] : "text";
                        const codeString = String(children).replace(/\n$/, "");

                        return (
                            <CodeBlock
                                code={codeString}
                                language={language}
                                showLineNumbers={
                                    codeString.split("\n").length > 3
                                }
                            />
                        );
                    },

                    // Pre (wrapper for code blocks)
                    pre: ({ children }) => <>{children}</>,

                    // Tables
                    table: ({ children }) => (
                        <div className="my-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => <tr>{children}</tr>,
                    th: ({ children }) => (
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                            {children}
                        </td>
                    ),

                    // Horizontal rule
                    hr: () => (
                        <hr className="my-6 border-gray-200 dark:border-gray-700" />
                    ),

                    // Images
                    img: ({ src, alt }) => {
                        if (!src || typeof src !== "string") return null;
                        // For external images, use regular img tag with unoptimized
                        // For local images, use Next.js Image component
                        if (src.startsWith("http")) {
                            return (
                                <Image
                                    src={src}
                                    alt={alt || ""}
                                    width={800}
                                    height={400}
                                    unoptimized
                                    className="my-4 rounded-lg max-w-full h-auto shadow-md"
                                />
                            );
                        }
                        return (
                            <Image
                                src={src}
                                alt={alt || ""}
                                width={800}
                                height={400}
                                className="my-4 rounded-lg max-w-full h-auto shadow-md"
                            />
                        );
                    },

                    // Strong and emphasis
                    strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900 dark:text-gray-100">
                            {children}
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-gray-700 dark:text-gray-300">
                            {children}
                        </em>
                    ),

                    // Strikethrough (GFM)
                    del: ({ children }) => (
                        <del className="line-through text-gray-500">
                            {children}
                        </del>
                    ),

                    // Task lists (GFM)
                    input: ({ checked, disabled, ...props }) => (
                        <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            {...props}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

export default MarkdownRenderer;
