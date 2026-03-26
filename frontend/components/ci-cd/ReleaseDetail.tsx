import type { CiRelease } from "@/types/api";

interface ReleaseDetailProps {
    release: CiRelease;
}

/**
 * Detailed view of a CI/CD release.
 *
 * @example
 * <ReleaseDetail release={release} />
 */
export function ReleaseDetail({ release }: ReleaseDetailProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {release.version ?? "—"}
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">
                            Status
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {release.status ?? "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">
                            Released At
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {release.released_at
                                ? release.released_at.slice(0, 10)
                                : "—"}
                        </dd>
                    </div>
                </dl>
            </div>

            {release.changelog && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Changelog
                    </h3>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {release.changelog}
                    </pre>
                </div>
            )}
        </div>
    );
}
