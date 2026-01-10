"use client";

export default function BadgesShowcase() {
	return (
		<div className="space-y-8 p-6">
			<div>
				<h1 className="mb-4 text-3xl font-bold">Badge Variants</h1>
				<p className="mb-6 text-gray-600">
					Displaying different badge styles and colors
				</p>
			</div>

			<div className="space-y-6">
				<div>
					<h2 className="mb-3 text-lg font-semibold">Status Badges</h2>
					<div className="flex flex-wrap gap-2">
						<span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
							Active
						</span>
						<span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
							Pending
						</span>
						<span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
							Inactive
						</span>
						<span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
							New
						</span>
					</div>
				</div>

				<div>
					<h2 className="mb-3 text-lg font-semibold">Category Badges</h2>
					<div className="flex flex-wrap gap-2">
						<span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
							Frontend
						</span>
						<span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
							Backend
						</span>
						<span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
							Database
						</span>
						<span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
							DevOps
						</span>
						<span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
							Security
						</span>
					</div>
				</div>

				<div>
					<h2 className="mb-3 text-lg font-semibold">Priority</h2>
					<div className="flex flex-wrap gap-2">
						<span className="inline-block rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
							Critical
						</span>
						<span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
							High
						</span>
						<span className="inline-block rounded-full bg-yellow-500 px-3 py-1 text-sm font-medium text-white">
							Medium
						</span>
						<span className="inline-block rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
							Low
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
