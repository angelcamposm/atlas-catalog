import { Button } from "@/components/ui/Button";

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
					<Button>Default</Button>
					<Button disabled>Disabled</Button>
					<Button className="bg-green-600 hover:bg-green-700">
						Success
					</Button>
					<Button className="bg-red-600 hover:bg-red-700">Error</Button>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Button Sizes</h2>
				<div className="flex flex-wrap items-center gap-2">
					<Button className="h-8 px-2 text-xs">Small</Button>
					<Button className="h-10 px-4">Medium</Button>
					<Button className="h-12 px-6 text-lg">Large</Button>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Button Groups</h2>
				<div className="flex gap-0">
					<Button className="rounded-r-none border-r">Left</Button>
					<Button className="rounded-none border-r">Center</Button>
					<Button className="rounded-l-none">Right</Button>
				</div>
			</div>
		</div>
	);
}
