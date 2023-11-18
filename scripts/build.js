import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

/** @type {import('esbuild').BuildOptions}*/
const options = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'node',
  target: 'node18',
  outdir: './dist',
  outExtension: { '.js': '.bundle.mjs' },
  plugins: [nodeExternalsPlugin({ packagePath: 'package.json' })],
};

if (process.env.WATCH === 'true') {
  options.watch = {
    onRebuild(error, result) {
      if (error) {
        console.error('watch build failed: ', error);
      } else {
        console.log('watch build succeeded: ', result);
      }
    },
  };
}

build(options).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});
