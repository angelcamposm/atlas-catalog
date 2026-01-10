"use client";

import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from "lucide-react";

export default function AlertsShowcase() {
	return (
		<div className="space-y-8 p-6">
			<div>
				<h1 className="mb-4 text-3xl font-bold">Alert Variants</h1>
				<p className="mb-6 text-gray-600">
					Different alert styles for various message types
				</p>
			</div>

			<div className="space-y-4">
				<div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
					<CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
					<div>
						<h3 className="font-semibold text-green-900">Success</h3>
						<p className="mt-1 text-sm text-green-700">
							Your changes have been saved successfully.
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
					<InfoIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
					<div>
						<h3 className="font-semibold text-blue-900">Information</h3>
						<p className="mt-1 text-sm text-blue-700">
							This is an informational message for the user.
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
					<AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
					<div>
						<h3 className="font-semibold text-yellow-900">Warning</h3>
						<p className="mt-1 text-sm text-yellow-700">
							Please be cautious with this action.
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
					<AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
					<div>
						<h3 className="font-semibold text-red-900">Error</h3>
						<p className="mt-1 text-sm text-red-700">
							An error occurred while processing your request.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
