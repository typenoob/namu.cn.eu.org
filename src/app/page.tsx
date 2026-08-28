import Image from "next/image";
import Link from "next/link";
import { FolderOpen, Gamepad2, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactInfo } from "@/components/compose/contactInfo";

const navItems = [
	{
		title: "File System",
		description: "Browse the files hosted on this site.",
		href: "/filesystem",
		icon: FolderOpen,
	},
	{
		title: "Game Collection",
		description: "Play the games built for this site.",
		href: "/games",
		icon: Gamepad2,
	},
	{
		title: "Open Source",
		description: "Projects I'm proud of.",
		href: "/opensource",
		icon: Github,
	},
] as const;

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<main className="flex w-full max-w-2xl flex-col items-center gap-16">
				{/* Intro */}
				<section className="flex flex-col items-center gap-6 text-center">
					<Image
						unoptimized={true}
						className="dark:invert"
						src="logo.svg"
						alt="Namu logo"
						width={96}
						height={96}
						priority
					/>
					<div className="flex max-w-2xl flex-col gap-3">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
							Hi, I&apos;m coyote
						</h1>
						<p className="font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground sm:text-base">
							Welcome to NAMU — which means trees in Korean — my little garden
							on the internet where ideas grow into games, tools, and
							experiments. I build with C, TypeScript, Python, and whatever
							sparks my curiosity, then share the fruits right here. Curious
							about
							something? Want to collaborate? Have a project in mind? I&apos;d
							love to hear from you — reach out below and let&apos;s grow
							something together.
						</p>
					</div>
					<ContactInfo />
				</section>

				{/* Navigation */}
				<nav
					aria-label="Navigation"
					className="grid w-full gap-4 sm:grid-cols-3"
				>
					{navItems.map((item) => (
						<Link key={item.href} href={item.href} className="group block">
							<Card className="h-full transition-all hover:border-ring hover:shadow-lg">
								<CardContent className="flex flex-col gap-4 p-6">
									<item.icon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground" />
									<div className="flex flex-col gap-1">
										<span className="text-lg font-semibold">{item.title}</span>
										<span className="text-sm text-muted-foreground">
											{item.description}
										</span>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</nav>
			</main>
			<footer className="text-sm text-muted-foreground">
				Still on developing
			</footer>
		</div>
	);
}
