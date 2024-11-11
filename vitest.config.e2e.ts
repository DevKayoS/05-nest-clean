
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'], //apenas executar testes com essa extensao
    globals: true,
    root: './',
  },
  plugins: [
    tsConfigPaths(), 
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
