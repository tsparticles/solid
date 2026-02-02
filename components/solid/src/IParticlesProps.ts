import type { Container, ISourceOptions } from "@tsparticles/engine";
import { JSX } from "solid-js";

export interface IParticlesProps {
    id?: string;
    width?: string;
    height?: string;
    options?: ISourceOptions;
    url?: string;
    style?: JSX.CSSProperties;
    class?: string;
    canvasClass?: string;
    container?: { current: Container };
    // prettier-ignore
    particlesLoaded?: (container: Container) => Promise<void>;
}
