import transformImports from "@rolldown/plugin-transform-imports";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    transformImports({
      "@tabler/icons-react": {
        transform: "@tabler/icons-react/dist/esm/icons/{{member}}",
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
