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
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
