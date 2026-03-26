import type { CiServer } from "@/types/api";

interface ServerDetailProps {
    server: CiServer;
}

/**
 * Displays full details of a CI server.
 *
 * @example
 * <ServerDetail server={server} />
 */
export function ServerDetail({ server }: ServerDetailProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
                {server.name}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Driver
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {server.driver ?? "—"}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">URL</dt>
                    <dd className="mt-1 text-sm text-gray-900 break-all">
                        {server.url ?? "—"}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Status
                    </dt>
                    <dd className="mt-1">
                        {server.is_enabled === true ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Enabled
                            </span>
                        ) : server.is_enabled === false ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Disabled
                            </span>
                        ) : (
                            <span className="text-sm text-gray-500">—</span>
                        )}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Last Synced
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {server.last_synced_at
                            ? server.last_synced_at.slice(0, 10)
                            : "—"}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Created
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {server.created_at.slice(0, 10)}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {server.updated_at.slice(0, 10)}
                    </dd>
                </div>
            </dl>
        </div>
    );
}
