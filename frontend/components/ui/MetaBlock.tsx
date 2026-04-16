import { cn } from "@/lib/utils";

/**
 * Displays audit metadata: creation and last-update timestamps with optional
 * author names.
 *
 * @example
 * <MetaBlock
 *   createdAt="2024-01-15T10:30:00Z"
 *   createdBy="Alice"
 *   updatedAt="2024-06-20T08:00:00Z"
 *   updatedBy="Bob"
 * />
 */
export interface MetaBlockProps {
    /** ISO timestamp of when the resource was created */
    createdAt?: string;
    /** ISO timestamp of when the resource was last updated */
    updatedAt?: string;
    /** Display name of the user who created the resource */
    createdBy?: string;
    /** Display name of the user who last updated the resource */
    updatedBy?: string;
    className?: string;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function MetaBlock({
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    className,
}: MetaBlockProps) {
    const hasCreated = Boolean(createdAt);
    const hasUpdated = Boolean(updatedAt);

    if (!hasCreated && !hasUpdated) {
        return null;
    }

    return (
        <dl
            className={cn(
                "flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground",
                className,
            )}
        >
            {hasCreated && (
                <>
                    <div className="flex items-center gap-1">
                        <dt className="font-medium text-foreground">Created</dt>
                        <dd>{formatDate(createdAt!)}</dd>
                        {createdBy && <dd>{createdBy}</dd>}
                    </div>
                </>
            )}
            {hasUpdated && (
                <>
                    <div className="flex items-center gap-1">
                        <dt className="font-medium text-foreground">Updated</dt>
                        <dd>{formatDate(updatedAt!)}</dd>
                        {updatedBy && <dd>{updatedBy}</dd>}
                    </div>
                </>
            )}
        </dl>
    );
}
