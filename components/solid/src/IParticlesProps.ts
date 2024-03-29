import type { Container, ISourceOptions } from "@tsparticles/engine";
import { JSX } from "solid-js";

export interface IParticlesProps {
	id?: string;
	width?: string;
	height?: string;
	options?: ISourceOptions;
	url?: string;
	params?: ISourceOptions;
	style?: JSX.CSSProperties;
	className?: string;
	canvasClassName?: string;
	container?: { current: Container };
	particlesLoaded?: (container: Container) => Promise<void>;
}
