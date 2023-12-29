import logo from './logo.svg';
import './App.css';
import { loadFull } from "tsparticles";
import configs from "@tsparticles/configs";
import { createEffect, createSignal } from "solid-js";
import Particles, { initParticlesEngine } from "@tsparticles/solid";
import { Engine } from "@tsparticles/engine";

function App() {
    const [ init, setInit ] = createSignal<boolean>(false);

    createEffect(() => {
        if (init()) {
            return;
        }

        initParticlesEngine(async (engine: Engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        })
    });

    return (
        <div class="App">
            <header class="App-header">
                <img src={logo} class="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    class="App-link"
                    href="https://github.com/ryansolid/solid"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn Solid
                </a>
            </header>
            {init() && <Particles id="tsparticles" options={configs.basic}/>}
        </div>
    );
}

export default App;
