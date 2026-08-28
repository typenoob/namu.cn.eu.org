"use client";

import Link from "next/link";

export default function SnakePage() {
	return (
		<div className="flex min-h-screen flex-col items-center gap-6 p-4 font-[family-name:var(--font-geist-sans)]">
			<header className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Snake</h1>
				<p className="text-sm text-muted-foreground sm:text-base">
					Classic snake game built with C and WebAssembly.
				</p>
			</header>

			<div className="w-full max-w-5xl">
				<iframe
					id="snake-frame"
					allowFullScreen
					title="Snake"
					src="/snake/snake.html"
					className="aspect-video w-full rounded-xl border shadow-lg"
					sandbox="allow-scripts allow-same-origin allow-downloads"
				/>
			</div>

			<footer className="flex gap-4 text-sm">
				<Link
					href="/games"
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					← Game Collection
				</Link>
				<Link
					href="/"
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Home
				</Link>
			</footer>
		</div>
	);
}
