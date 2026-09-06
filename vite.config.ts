import react from "@vitejs/plugin-react";
import { definePolicy, self, unsafeInline } from "csp-toolkit";
import { defineConfig } from "vite";
import csp from "vite-plugin-csp-guard";

export default defineConfig(() => {
  return {
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
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
