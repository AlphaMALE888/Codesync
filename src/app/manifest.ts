import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CODESYNC Digi Marketing Pvt. Ltd.",
    short_name: "CODESYNC",
    description:
      "Marketing that grows revenue. Software that moves business forward. Based in Lucknow, Uttar Pradesh.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F5F3",
    theme_color: "#111213",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
