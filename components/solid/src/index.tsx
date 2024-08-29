import { Engine, tsParticles } from "@tsparticles/engine";
import type { IParticlesProps } from "./IParticlesProps";
import Particles from "./Particles";

async function initParticlesEngine(cb: (engine: Engine) => Promise<void>): Promise<void> {
    tsParticles.init();

    await cb(tsParticles);
}

export default Particles;
export { initParticlesEngine, IParticlesProps, Particles };
