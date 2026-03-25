"use client";

import { Card } from "@/components/ui/card";

export default function CardsShowcase() {
	return (
		<div className="space-y-8 p-6">
			<div>
				<h1 className="mb-4 text-3xl font-bold">Card Variants</h1>
				<p className="mb-6 text-gray-600">
					Showcasing different card layouts and styles
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card className="p-6">
					<h3 className="mb-2 font-semibold">Basic Card</h3>
					<p className="text-sm text-gray-600">
						Simple card with text content
					</p>
				</Card>

				<Card className="p-6">
					<div className="mb-3 h-24 rounded bg-gradient-to-r from-blue-400 to-blue-600" />
					<h3 className="mb-2 font-semibold">Card with Image</h3>
					<p className="text-sm text-gray-600">
						Card featuring an image or gradient
					</p>
				</Card>

				<Card className="border-2 border-green-400 p-6">
					<h3 className="mb-2 font-semibold">Highlighted Card</h3>
					<p className="text-sm text-gray-600">
						Card with custom border styling
					</p>
				</Card>

				<Card className="p-6 transition-shadow hover:shadow-lg">
					<h3 className="mb-2 font-semibold">Interactive Card</h3>
					<p className="text-sm text-gray-600">
						Hover to see shadow effect
					</p>
				</Card>

				<Card className="bg-gradient-to-br from-slate-50 to-slate-100 p-6">
					<h3 className="mb-2 font-semibold">Card with Background</h3>
					<p className="text-sm text-gray-600">
						Card with gradient background
					</p>
				</Card>

				<Card className="divide-y p-0">
					<div className="p-6">
						<h3 className="font-semibold">Card with Header</h3>
					</div>
					<div className="p-6">
						<p className="text-sm text-gray-600">
							Card with divided sections
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
}
