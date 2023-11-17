import { mkdtemp, readdir, rm } from 'fs/promises';
import { build } from 'esbuild';
import { UserConfig } from '@/types';
import { join } from 'path';

export const getConfig = async (): Promise<UserConfig> => {
  const allFiles = await readdir(process.cwd());
  const configFile = allFiles.find((path) => path == 'mdorganizer.config.ts');

  if (!configFile) {
    throw new Error('config file not found');
  }

  console.log(`process.cwd(): ${process.cwd()}`);

  // const tempDir = 'mdorgnaizer_temp';
  // await mkdir(tempDir, { recursive: true });
  const tempDir = await mkdtemp('mdorgnaizer_temp', { encoding: 'utf-8' });

  try {
    // copy config file to temp dir
    await build({
      entryPoints: [join(process.cwd(), configFile)],
      format: 'esm',
      bundle: true,
      outdir: join(process.cwd(), tempDir),
      sourcemap: true,
      platform: 'node',
      absWorkingDir: process.cwd(),
      outExtension: { '.js': '.js' },
    });

    const config = await import(
      `${join(process.cwd(), tempDir, 'mdorganizer.config.js')}`
    );

    console.log('config file successfully loaded');
    await rm(join(process.cwd(), tempDir), {
      force: true,
      recursive: true,
    });
    return config.default;
  } catch (err) {
    await rm(join(process.cwd(), tempDir), {
      force: true,
      recursive: true,
    });
    console.error(err);
    throw new Error('config file not found');
  }
};