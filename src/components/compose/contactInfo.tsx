"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

function WeChatIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.29c.63.19 1.29.29 2 .29.34 0 .67-.03 1-.08-.07-.3-.1-.61-.1-.92 0-2.92 2.91-5.29 6.5-5.29.36 0 .71.03 1.05.08C16.34 6.9 13.25 4 9.5 4zM7.25 8.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm4.5 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
			<path d="M22 15.5c0-2.6-2.58-4.71-5.75-4.71S10.5 12.9 10.5 15.5s2.58 4.71 5.75 4.71c.66 0 1.29-.1 1.88-.27L20 20.5l-.88-1.71c1.83-1 3.13-2.62 3.13-4.54V15.5zM17 13.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm-2.5 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
		</svg>
	);
}

const email = {
	label: "Email",
	value: "chenyutao0706@gmail.com",
	href: "mailto:chenyutao0706@gmail.com",
};

const wechat = {
	label: "WeChat",
	value: "namu-se",
};

export function ContactInfo() {
	const [copied, setCopied] = useState(false);

	const copy = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fail silently when the clipboard API is unavailable
		}
	};

	const shared =
		"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-ring hover:bg-accent";

	return (
		<div className="flex flex-wrap items-center justify-center gap-3">
			<a href={email.href} className={shared} title={email.label}>
				<Mail className="h-4 w-4" />
				{email.value}
			</a>

			<div className="group relative">
				<button
					onClick={() => copy(wechat.value)}
					className={shared}
					title={`${wechat.label}: click to copy`}
				>
					<WeChatIcon className="h-4 w-4" />
					{wechat.value}
					{copied ? (
						<Check className="h-4 w-4 text-green-500" />
					) : (
						<Copy className="h-3.5 w-3.5 opacity-60" />
					)}
				</button>
				{/* QR code shown on hover */}
				<div className="invisible absolute left-1/2 top-full z-50 mt-4 w-max -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
					<Image
						unoptimized={true}
						src="/wechat-qr.jpg"
						alt="WeChat QR code"
						width={240}
						height={240}
						className="rounded-xl border bg-background p-2 shadow-lg"
					/>
				</div>
			</div>
		</div>
	);
}
