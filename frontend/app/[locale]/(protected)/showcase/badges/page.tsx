import { Badge } from "@/components/ui/Badge";

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
						<Badge className="bg-green-100 text-green-800">
							Active
						</Badge>
						<Badge className="bg-yellow-100 text-yellow-800">
							Pending
						</Badge>
						<Badge className="bg-red-100 text-red-800">
							Inactive
						</Badge>
						<Badge className="bg-blue-100 text-blue-800">
							New
						</Badge>
					</div>
				</div>

				<div>
					<h2 className="mb-3 text-lg font-semibold">
						Category Badges
					</h2>
					<div className="flex flex-wrap gap-2">
						<Badge>Frontend</Badge>
						<Badge>Backend</Badge>
						<Badge>Database</Badge>
						<Badge>DevOps</Badge>
						<Badge>Security</Badge>
					</div>
				</div>

				<div>
					<h2 className="mb-3 text-lg font-semibold">Priority</h2>
					<div className="flex flex-wrap gap-2">
						<Badge className="bg-red-500 text-white">Critical</Badge>
						<Badge className="bg-orange-500 text-white">High</Badge>
						<Badge className="bg-yellow-500 text-white">Medium</Badge>
						<Badge className="bg-blue-500 text-white">Low</Badge>
					</div>
				</div>
			</div>
		</div>
	);
}
