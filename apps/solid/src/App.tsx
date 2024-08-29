import type { Component } from 'solid-js';
import { createResource } from "solid-js";
// import { createSignal, onMount } from "solid-js";
import { loadFull } from "tsparticles";
import configs from "@tsparticles/configs";
import Particles, { initParticlesEngine } from "@tsparticles/solid";
// import { Engine } from '@tsparticles/engine'
import MySolidComponent from 'solid-library';

const App: Component = () => {
  // const [init, setInit] = createSignal<boolean>(false);

  // onMount(() => {
  //   if (init()) {
  //     return;
  //   }

  //   initParticlesEngine(async (engine: Engine) => {
  //     await loadFull(engine);
  //   }).then(() => {
  //     setInit(true);
  //   });
  // });

  const [init] = createResource(async () => {
    await initParticlesEngine(loadFull)
    return true
  })

  return (
    <>
      {/* <MySolidComponent/> */}
      {init() && <Particles id="tsparticles" options={configs.basic}/>}
    </>
  );
};

export default App;


// import type { Component } from 'solid-js';
// import Particles from "@tsparticles/solid";
// // import MySolidComponent from 'solid-library';

// const App: Component = () => {

//   return (
//     <>
//       {/* <MySolidComponent/> */}
//       <Particles/>
//     </>
//   );
// };

// export default App;
