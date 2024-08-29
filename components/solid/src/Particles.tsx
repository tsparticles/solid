import { tsParticles, Container } from "@tsparticles/engine";
import type { IParticlesProps } from "./IParticlesProps";
import { createEffect, createMemo, createSignal, onCleanup, JSX } from "solid-js";

/**
 * @param (props:IParticlesProps) Particles component properties
 */
const Particles = (props: IParticlesProps): JSX.Element => {
	try {
		const id = props.id ?? "tsparticles";
		const options = createMemo(() => props.params ?? props.options ?? {});
		const [containerId, setContainerId] = createSignal(undefined as symbol | undefined);

		const cb = async (container?: Container) => {
			setContainerId(container?.id);

			if (props.particlesLoaded && container) {
				await props.particlesLoaded(container);
			}
		};

		createEffect(async () => {
			console.log("effect", tsParticles.dom());
			let container = tsParticles.dom().find(t => t.id === containerId());

			container?.destroy();

			container = await tsParticles.load({
				id,
				options: options(),
				url: props.url,
			});

			await cb(container);
		});

		onCleanup(() => {
			const container = tsParticles.dom().find(t => t.id === containerId());

			container?.destroy();

			setContainerId(undefined);
		});

		return (
			<div class={props.className ?? ""} id={id}>
				<canvas
					class={props.canvasClassName ?? ""}
					style={{
						...props.style,
						width: props.width,
						height: props.height,
					}}
				/>
			</div>
		);
	} catch (e) {
		return <div />;
	}
};

export default Particles;
