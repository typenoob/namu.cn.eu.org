/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	headers: async () => {
		return [
			{
				source: "/nbtv.m3u",
				headers: [{ key: "Content-Type", value: "text/plain" }],
			},
			{
				// Godot Web export requires cross-origin isolation for SharedArrayBuffer.
				// Cross-origin isolation is a browsing-context-group-wide property: the
				// top-level page AND every document (incl. iframes) must carry these
				// headers, otherwise window.crossOriginIsolated is false everywhere.
				source: "/:path*",
				headers: [
					{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
					{ key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
				],
			},
		];
	},
};

export default nextConfig;
