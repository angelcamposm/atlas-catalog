import {
    HiOutlineServer,
    HiOutlineEye,
    HiOutlinePencilSquare,
    HiOutlineTrash,
} from "react-icons/hi2";
import type { CiServer } from "@/types/api";

interface ServerListProps {
    servers: CiServer[];
    onView?: (id: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

/**
 * Table listing CI servers with optional CRUD actions.
 *
 * @example
 * <ServerList servers={servers} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
 */
export function ServerList({
    servers,
    onView,
    onEdit,
    onDelete,
}: ServerListProps) {
    if (servers.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <HiOutlineServer className="mx-auto h-12 w-12 mb-3" />
                <p>No CI servers configured</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Driver
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        {(onView || onEdit || onDelete) && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {servers.map((server) => (
                        <tr key={server.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {server.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {server.driver ?? "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {server.url ?? "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {server.is_enabled === true ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Enabled
                                    </span>
                                ) : server.is_enabled === false ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        Disabled
                                    </span>
                                ) : (
                                    "—"
                                )}
                            </td>
                            {(onView || onEdit || onDelete) && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {onView && (
                                        <button
                                            onClick={() => onView(server.id)}
                                            className="text-blue-600 hover:text-blue-900"
                                            aria-label={`View ${server.name}`}
                                        >
                                            <HiOutlineEye className="h-5 w-5" />
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(server.id)}
                                            className="text-yellow-600 hover:text-yellow-900"
                                            aria-label={`Edit ${server.name}`}
                                        >
                                            <HiOutlinePencilSquare className="h-5 w-5" />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(server.id)}
                                            className="text-red-600 hover:text-red-900"
                                            aria-label={`Delete ${server.name}`}
                                        >
                                            <HiOutlineTrash className="h-5 w-5" />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
