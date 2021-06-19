import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import legacy from '@rollup/plugin-legacy';

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'cjs',
      format: 'cjs',
      exports: 'named'
    },
    {
      dir: 'dist',
      format: 'iife',
      exports: 'named',
      name: 'axette',
      plugins: [terser()]
    },
    {
      dir: 'output',
      format: 'esm',
      exports: 'named',
    },
    {
      dir: 'lib',
      format: 'cjs',
      plugins: [typescript({lib: ["dom", "esnext"], target: "esnext"})],
      exports: 'named',
    }
  ],
  plugins: [
    commonjs(),
    babel({ babelHelpers: 'bundled', extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'] }),
    // typescript({lib: ["es5", "es6", "dom", "es2017"], target: "esnext"}),
    legacy({ 'dist/axette.js': 'axette' })
  ]
};
