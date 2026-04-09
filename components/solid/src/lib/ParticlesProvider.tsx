import {
  createContext,
  useContext,
  Resource,
  createResource,
  JSXElement,
} from "solid-js";
import type { Engine } from "@tsparticles/engine";

interface ParticlesContextValue {
  engine: Resource<Engine | undefined>;
  isLoading: () => boolean;
  error: () => Error | undefined;
}

const ParticlesContext = createContext<ParticlesContextValue | undefined>();

interface ParticlesProviderProps {
  children: JSXElement;
  particlesInit?: (engine: Engine) => Promise<void> | void;
}

export const ParticlesProvider = (props: ParticlesProviderProps) => {
  // Create a resource that lazily initializes the engine once
  const [engine, { loading, error }] = createResource(async () => {
    try {
      const { tsParticles } = await import("@tsparticles/engine");

      if (props.particlesInit) {
        await props.particlesInit(tsParticles);
      }

      return tsParticles;
    } catch (err) {
      console.error("Failed to initialize particles:", err);
      throw err;
    }
  });

  const contextValue: ParticlesContextValue = {
    engine,
    isLoading: loading,
    error,
  };

  return (
    <ParticlesContext.Provider value={contextValue}>
      {props.children}
    </ParticlesContext.Provider>
  );
};

/**
 * Hook to access the tsParticles engine from provider context.
 * Throws if called outside ParticlesProvider.
 */
export const useParticlesEngine = (): ParticlesContextValue => {
  const context = useContext(ParticlesContext);
  if (!context) {
    throw new Error(
      "useParticlesEngine must be used within a ParticlesProvider"
    );
  }
  return context;
};
