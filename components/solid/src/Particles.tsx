import { tsParticles, Container } from "@tsparticles/engine";
import type { IParticlesProps } from "./IParticlesProps";
import { createEffect, createMemo, createSignal, onCleanup, JSX } from "solid-js";

interface MutableRefObject<T> {
	current: T | null;
}

/**
 * @param (props:IParticlesProps) Particles component properties
 */
const Particles = (props: IParticlesProps): JSX.Element => {
	try {
		const id = props.id ?? "tsparticles",
			options = createMemo(() => props.params ?? props.options ?? {}),
			refContainer = props.container as MutableRefObject<Container | undefined>,
			{ className, canvasClassName, loaded, url, width, height } = props,
			[containerId, setContainerId] = createSignal(undefined as symbol | undefined);

		const cb = async (container?: Container) => {
			if (refContainer) {
				refContainer.current = container;
			}

			setContainerId(container?.id);

			if (loaded && container) {
				await loaded(container);
			}
		};

		createEffect(async () => {
			let container = tsParticles.dom().find(t => t.id === containerId());

			container?.destroy();

			container = await tsParticles.load({
				id,
				options: options(),
				url: url,
			});

			await cb(container);
		});

		onCleanup(() => {
			const container = tsParticles.dom().find(t => t.id === containerId());

			container?.destroy();

			setContainerId(undefined);
		});

		return (
			<div class={className ?? ""} id={id}>
				<canvas
					class={canvasClassName ?? ""}
					style={{
						...props.style,
						width,
						height,
					}}
				/>
			</div>
		);
	} catch (e) {
		return <div />;
	}
};

export default Particles;
