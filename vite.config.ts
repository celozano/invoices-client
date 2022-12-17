import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const getAliases = () => {
  const srcFolders = fs
    .readdirSync('./src')
    .map((file) => path.join('./src', file))
    .filter((path) => fs.lstatSync(path).isDirectory());

  const alias: { [key: string]: string } = {};
  srcFolders.forEach((folder) => {
    alias[folder.slice(4)] = path.resolve(__dirname, folder);
  });

  return alias;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: getAliases(),
  },
});
