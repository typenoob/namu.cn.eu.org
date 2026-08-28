import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const games = [
	{
		name: "snake",
		title: "Snake",
		description: "Classic snake game built with C and WebAssembly.",
	},
] as const;

export default function GamesPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-12 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<header className="flex flex-col items-center gap-3 text-center">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Game Collection
				</h1>
				<p className="text-sm text-muted-foreground sm:text-base">
					Games built for NAMU
				</p>
			</header>
			<main className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
				{games.map((game) => (
					<Link
						key={game.name}
						href={`/games/${game.name}`}
						className="group block"
					>
						<Card className="h-full transition-all hover:border-ring hover:shadow-lg">
							<CardContent className="flex flex-col items-center gap-4 p-6">
								<Image
									unoptimized={true}
									className="transition-transform group-hover:scale-105"
									src={`${game.name}.svg`}
									alt={game.title}
									width={100}
									height={100}
									priority
								/>
								<div className="flex flex-col items-center gap-1">
									<span className="text-lg font-semibold">{game.title}</span>
									<span className="text-center text-sm text-muted-foreground">
										{game.description}
									</span>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</main>
			<footer>
				<Link
					href="/"
					className="text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					← Back to home
				</Link>
			</footer>
		</div>
	);
}
