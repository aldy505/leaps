import {App, Plugin} from 'vue';
import Leaps from './components/Leaps';
import Parallax from './components/Parallax';
import Reveal from './components/Reveal';
import Timeline from './components/Timeline';

export function install(app: App) {
  app.component('VueLeaps', Leaps);
}

if (typeof window !== 'undefined' && (window as any).Vue) {
  install((window as any).Vue);
}

const plugin: Plugin = {
  install,
};

// Re-define: https://github.com/vitejs/vite/issues/2117
export interface VueLeapsOptions {
  name: string
  value: any
}

export default plugin;
export {Leaps, Reveal, Parallax, Timeline};
