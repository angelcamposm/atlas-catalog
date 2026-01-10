"use client";

export default function ButtonsShowcase() {
	return (
		<div className="space-y-8 p-6">
			<div>
				<h1 className="mb-4 text-3xl font-bold">Button Variants</h1>
				<p className="mb-6 text-gray-600">
					Showcasing different button styles and states
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Default Buttons</h2>
				<div className="flex flex-wrap gap-2">
					<button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
						Default
					</button>
					<button
						disabled
						className="rounded-md bg-gray-300 px-4 py-2 text-gray-500 cursor-not-allowed"
					>
						Disabled
					</button>
					<button className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
						Success
					</button>
					<button className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
						Error
					</button>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Button Sizes</h2>
				<div className="flex flex-wrap items-center gap-2">
					<button className="h-8 px-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">
						Small
					</button>
					<button className="h-10 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700">
						Medium
					</button>
					<button className="h-12 px-6 text-lg rounded-md bg-blue-600 text-white hover:bg-blue-700">
						Large
					</button>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Button Groups</h2>
				<div className="flex gap-0">
					<button className="rounded-l-md border border-r-0 border-blue-600 bg-white px-4 py-2 text-blue-600 hover:bg-blue-50">
						Left
					</button>
					<button className="border-y border-blue-600 bg-white px-4 py-2 text-blue-600 hover:bg-blue-50">
						Center
					</button>
					<button className="rounded-r-md border border-l-0 border-blue-600 bg-white px-4 py-2 text-blue-600 hover:bg-blue-50">
						Right
					</button>
				</div>
			</div>
		</div>
	);
}
