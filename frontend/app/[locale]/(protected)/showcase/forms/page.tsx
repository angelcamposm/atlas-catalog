import { useState } from "react";

export default function FormsShowcase() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		category: "",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="space-y-8 p-6">
			<div>
				<h1 className="mb-4 text-3xl font-bold">Form Elements</h1>
				<p className="mb-6 text-gray-600">
					Common form inputs and layouts
				</p>
			</div>

			<div className="max-w-2xl space-y-6">
				<div>
					<label className="mb-2 block font-medium">Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Enter your name"
						className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
					/>
				</div>

				<div>
					<label className="mb-2 block font-medium">Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="your@email.com"
						className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
					/>
				</div>

				<div>
					<label className="mb-2 block font-medium">Category</label>
					<select
						name="category"
						value={formData.category}
						onChange={handleChange}
						className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
					>
						<option value="">Select a category</option>
						<option value="frontend">Frontend</option>
						<option value="backend">Backend</option>
						<option value="devops">DevOps</option>
					</select>
				</div>

				<div>
					<label className="mb-2 block font-medium">Message</label>
					<textarea
						name="message"
						value={formData.message}
						onChange={handleChange}
						placeholder="Enter your message..."
						rows={4}
						className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
					/>
				</div>

				<div className="flex gap-3">
					<button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
						Submit
					</button>
					<button className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
