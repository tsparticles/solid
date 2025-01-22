import configs from "@tsparticles/configs";
import Particles, { initParticlesEngine } from "@tsparticles/solid";
import type { Component } from 'solid-js';
import { createSignal, Show } from "solid-js";
import { loadFull } from "tsparticles";

const App: Component = () => {
  const init = initParticlesEngine(loadFull)
  const [config, setConfig] = createSignal(configs.basic)

  setTimeout(() => setConfig(configs.absorbers), 1000)

  return (
    <Show when={init()}>
      <Particles id="tsparticles" options={config()}/>
    </Show>
  );
};

export default App;
