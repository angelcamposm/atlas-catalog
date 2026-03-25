"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { HiXMark, HiCamera, HiUser } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
    const t = useTranslations("profile");
    const router = useRouter();
    const pathname = usePathname();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileImage, setProfileImage] = useState<string | null>(
        user.avatar || null
    );
    const [showSaveNotification, setShowSaveNotification] = useState(false);

    // Get current locale from pathname
    const currentLocale = pathname.split("/")[1] || "en";

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Solo para demostración visual - crear una URL temporal
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSave = () => {
        // Por ahora solo mostramos una notificación
        // TODO: Implementar guardado real cuando esté el backend
        setShowSaveNotification(true);
        setTimeout(() => {
            setShowSaveNotification(false);
        }, 3000);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-900"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {t("title")}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t("subtitle")}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            >
                                <HiXMark className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 p-6">
                        {/* Save Notification */}
                        {showSaveNotification && (
                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    {t("changesSaved")}
                                </p>
                            </div>
                        )}

                        {/* Profile Picture Section */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                {t("profilePicture")}
                            </h3>
                            <div className="flex items-center space-x-6">
                                {/* Avatar Display */}
                                <div className="relative h-24 w-24 rounded-full bg-gradient-blue-indigo">
                                    {profileImage ? (
                                        <Image
                                            src={profileImage}
                                            alt={user.name}
                                            width={96}
                                            height={96}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                                            <HiUser className="h-12 w-12" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg dark:bg-gray-800"
                                    >
                                        <HiCamera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>

                                {/* Upload Controls */}
                                <div className="flex-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <div className="flex space-x-3">
                                        <Button
                                            variant="outline"
                                            size="default"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            {profileImage
                                                ? t("changeImage")
                                                : t("uploadImage")}
                                        </Button>
                                        {profileImage && (
                                            <Button
                                                variant="ghost"
                                                size="default"
                                                onClick={handleRemoveImage}
                                                className="text-red-600 hover:text-red-700 dark:text-red-400"
                                            >
                                                {t("removeImage")}
                                            </Button>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        {t("uploadDescription")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                {t("personalInfo")}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t("fullName")}
                                    </label>
                                    <input
                                        type="text"
                                        value={user.name}
                                        readOnly
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t("email")}
                                    </label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        readOnly
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t("role")}
                                    </label>
                                    <input
                                        type="text"
                                        value={user.role}
                                        readOnly
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Language Settings */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                {t("language")}
                            </h3>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("selectLanguage")}
                                </label>
                                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                                    {t("languageDescription")}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        {
                                            code: "en",
                                            name: "English",
                                            flag: "🇬🇧",
                                        },
                                        {
                                            code: "es",
                                            name: "Español",
                                            flag: "🇪🇸",
                                        },
                                    ].map((lang) => {
                                        const isSelected =
                                            currentLocale === lang.code;

                                        return (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    const newPath =
                                                        pathname.replace(
                                                            `/${currentLocale}`,
                                                            `/${lang.code}`
                                                        );
                                                    router.push(newPath);
                                                }}
                                                className={`rounded-lg border-2 p-4 text-left transition-all ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-900/20 dark:ring-blue-800"
                                                        : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-3xl">
                                                        {lang.flag}
                                                    </span>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {lang.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {lang.code.toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                size="default"
                                onClick={onClose}
                            >
                                {t("close")}
                            </Button>
                            <Button
                                variant="default"
                                size="default"
                                onClick={handleSave}
                                className="bg-gradient-blue-indigo"
                            >
                                {t("saveChanges")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
