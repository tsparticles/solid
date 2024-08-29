import Particles from "./Particles";
import type { IParticlesProps } from "./IParticlesProps";
import { Engine, tsParticles } from "@tsparticles/engine";

async function initParticlesEngine(cb: (engine: Engine) => Promise<void>): Promise<void> {
	tsParticles.init();

	await cb(tsParticles);
}

export default Particles;
export { Particles, initParticlesEngine, IParticlesProps };
