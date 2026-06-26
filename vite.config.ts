import babel from '@rolldown/plugin-babel';
import transformImports from '@rolldown/plugin-transform-imports';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    babel({ presets: [reactCompilerPreset()] }),
    react(),
    transformImports({
      '@tabler/icons-react': {
        transform: '@tabler/icons-react/dist/esm/icons/{{member}}',
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
