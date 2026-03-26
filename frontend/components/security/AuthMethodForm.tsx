"use client";

import { useState } from "react";
import type { AuthenticationMethod, CreateAuthenticationMethodRequest } from "@/types/api";

/**
 * Formulario para crear o editar un método de autenticación.
 *
 * @example
 * <AuthMethodForm
 *   method={selectedMethod}
 *   onSave={(data) => handleSave(data)}
 *   onCancel={() => setOpen(false)}
 * />
 */
interface AuthMethodFormProps {
    /** Método a editar. Si es undefined/null, el formulario opera en modo creación */
    method?: AuthenticationMethod | null;
    /** Callback con los datos del formulario al guardar */
    onSave: (data: CreateAuthenticationMethodRequest) => void;
    /** Callback al cancelar */
    onCancel: () => void;
}

export function AuthMethodForm({ method, onSave, onCancel }: AuthMethodFormProps) {
    const [name, setName] = useState(method?.name ?? "");
    const [description, setDescription] = useState(method?.description ?? "");
    const [nameError, setNameError] = useState("");

    const isEditMode = Boolean(method);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) {
            setNameError("El nombre es requerido");
            return;
        }
        onSave({ name: name.trim(), description: description.trim() || undefined });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="auth-method-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Nombre
                </label>
                <input
                    id="auth-method-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError("");
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej. OAuth2, SAML, Kerberos"
                />
                {nameError && (
                    <p className="mt-1 text-xs text-red-600">{nameError}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="auth-method-description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Descripción
                </label>
                <textarea
                    id="auth-method-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Descripción opcional del método de autenticación"
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {isEditMode ? "Actualizar" : "Crear"}
                </button>
            </div>
        </form>
    );
}
