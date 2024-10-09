import { defineConfig, moduleTools } from '@modern-js/module-tools';

export default defineConfig({
  plugins: [moduleTools()],
  buildConfig: {
    minify: 'terser',
    buildType: 'bundleless',
    platform: 'browser',
    tsconfig: './tsconfig.build.json',
    jsx: 'automatic',
  },
  buildPreset: 'npm-library',
});
