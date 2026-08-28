import Link from "next/link";
import { ArrowUpRight, GitFork, Github, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FALLBACK_STATS = {
	stars: 29,
	forks: 7,
};

async function getRepoStats() {
	try {
		const res = await fetch("https://api.github.com/repos/typenoob/nxbt", {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return FALLBACK_STATS;
		const data = await res.json();
		return {
			stars: data.stargazers_count ?? FALLBACK_STATS.stars,
			forks: data.forks_count ?? FALLBACK_STATS.forks,
		};
	} catch {
		return FALLBACK_STATS;
	}
}

const features = [
	"Run controller macros on the Nintendo Switch",
	"Control the Switch directly via keyboard or third-party controllers",
];

const contributions = [
	"Ship ready-to-use executable files",
	"Streamline the connection experience",
	"Implement a Bumble Bluetooth stack independent of the Linux Bluetooth stack",
];

export default async function OpenSourcePage() {
	const { stars, forks } = await getRepoStats();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-12 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<header className="flex flex-col items-center gap-3 text-center">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Open Source
				</h1>
				<p className="text-sm text-muted-foreground sm:text-base">
					Projects I&apos;m proud of
				</p>
			</header>
			<main className="w-full max-w-3xl">
				<Link
					href="https://github.com/typenoob/nxbt"
					target="_blank"
					rel="noopener noreferrer"
					className="group block"
				>
					<Card className="transition-all hover:border-ring hover:shadow-lg">
						<CardContent className="flex flex-col gap-6 p-6 sm:p-8">
							{/* Project header: name + stats */}
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div className="flex flex-col gap-1">
									<h2 className="flex items-center gap-2 text-2xl font-semibold">
										<span className="inline-flex items-center gap-2">
											<Github className="h-6 w-6" />
											nxbt
										</span>
										<ArrowUpRight className="h-5 w-5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
									</h2>
									<span className="text-sm text-muted-foreground">
										typenoob / nxbt
									</span>
								</div>
								<div className="flex gap-2">
									<span
										className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm"
										title="Stars"
									>
										<Star className="h-4 w-4" />
										{stars}
									</span>
									<span
										className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm"
										title="Forks"
									>
										<GitFork className="h-4 w-4" />
										{forks}
									</span>
								</div>
							</div>

							{/* GitHub description */}
							<p className="text-sm text-muted-foreground sm:text-base">
								Control your Nintendo Switch through a website, terminal, or
								macro.
							</p>

							<div className="h-px bg-border" />

							{/* Summary */}
							<div className="flex flex-col gap-5">
								<div className="flex flex-col gap-2">
									<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
										What it does
									</h3>
									<ul className="flex flex-col gap-2">
										{features.map((item) => (
											<li key={item} className="flex items-start gap-2 text-sm">
												<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
												{item}
											</li>
										))}
									</ul>
								</div>
								<div className="flex flex-col gap-2">
									<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
										My contributions
									</h3>
									<ul className="flex flex-col gap-2">
										{contributions.map((item) => (
											<li key={item} className="flex items-start gap-2 text-sm">
												<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
												{item}
											</li>
										))}
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				</Link>
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
