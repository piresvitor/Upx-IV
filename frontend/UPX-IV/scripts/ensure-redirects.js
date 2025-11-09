import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');
const distDir = join(process.cwd(), 'dist');
const redirectsFile = join(publicDir, '_redirects');
const distRedirectsFile = join(distDir, '_redirects');

// Garantir que a pasta dist existe
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Copiar arquivo _redirects para dist
if (existsSync(redirectsFile)) {
  copyFileSync(redirectsFile, distRedirectsFile);
  console.log('✅ Arquivo _redirects copiado para dist/');
} else {
  console.error('❌ Arquivo _redirects não encontrado em public/');
  process.exit(1);
}

