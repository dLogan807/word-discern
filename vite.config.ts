import react from "@vitejs/plugin-react";
import { definePolicy, self, unsafeInline } from "csp-toolkit";
import { defineConfig } from "vite";
import csp from "vite-plugin-csp-guard";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig(() => {
  return {
    base: "/word-discern/",
    plugins: [
      react(),
      csp({
        algorithm: "sha256",
        dev: {
          run: true,
          override: false,
        },
        build: {
          sri: true,
          override: true,
        },
        policy: definePolicy({
          defaultSrc: [self],
          scriptSrc: [self],
          styleSrcElem: [self, unsafeInline],
          styleSrcAttr: [self],
          imgSrc: [self],
          connectSrc: [self],
        }),
      }),
      Sitemap({
        hostname: "https://example.github.io/word-discern/",
        exclude: ["/"],
        dynamicRoutes: ["word-discern"],
        changefreq: "monthly",
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
