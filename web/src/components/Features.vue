<script setup lang="ts">
import Accordion from './accordion/Accordion.vue';
import AccordionItem from './accordion/AccordionItem.vue';
import CodeBlock from './CodeBlock.vue';
import Page from './Page.vue';
const dir = `
ghost/           <---- written in TypeScript
├─ package.json
├─ main.ts
pacman/          <---- written in rust
├─ Cargo.toml
├─ lib.rs
food.nzmod.js    <---- single-file javascript module 
game.nzentity.toml <---- wire everything up
`;
const ex1 = `
[pacman]
color = "yellow"
speed = 5

[ghost]
speed = 5 
state = "scared"
`
</script>

<template>
  <Page id="features">
    <div id="card-1" class="cd w-100 d-flex flex-column gap-5">
      <div class="d-flex container align-items-center w-100 justify-content-evenly">
        <div>

          <h1 class="display-4">Mix and match</h1>
          <p class="lead">
            Write code that you want to write<br>WebAssembly allows <span class="nz">nzen</span> to be language-agnostic
          </p>
        </div>
        <div class="lead">
          <div class="d-flex gap-1 flex-wrap py-2">
            <span class="badge rounded-pill d-flex align-items-center text-bg-info">TypeScript</span>
            <span class="badge rounded-pill d-flex align-items-center text-bg-warning">JavaScript</span>
            <span class="badge rounded-pill d-flex align-items-center text-bg-danger">Rust</span>
            <span class="badge rounded-pill d-flex align-items-center text-bg-secondary"
                style="background-color: #9179E4 !important;">C#</span>
            <span class="badge rounded-pill d-flex align-items-center text-bg-primary">lua</span><br>
          </div>
          or <a href="https://github.com/appcypher/awesome-wasm-langs"><kbd> your favourite language</kbd></a>
        </div>
      </div>
    </div>

    <div id="card-2" class="cd d-flex flex-column gap-5">
      <div class="d-flex align-items-center justify-content-evenly w-100 flex-wrap gap-3">
        <CodeBlock lang="ini" :source="ex1" file="game.nzentity.toml" />
        <div class="d-flex flex-column  px-5">
          <h1 class="display-6">Game design i<span class="nz">n zen</span> mode<br></h1>
          <p class="lead">
            Design, tweak and arrange in plain, readable <kbd>.toml</kbd><br>
            use your favourite text editor,
            or add UI on top
          </p>
        </div>
      </div>
    </div>
    <div id="card-3" class="cd d-flex flex-column gap-5">
      <div class="d-flex flex-column px-5">
        <h1 class="display-6">Write code once</h1>
        <p class="lead">
          out of the box, <span class="nz">nzen</span> offers a modest library of gamedev utilities.
          However,<br> as
          a
          framework, it
          empowers you to build your code in a scalable and reusable way. <br>
          When you (or someone in the community) writes some code once, sharing and reusing it is really easy.
        </p>
      </div>
    </div>
  </Page>
</template>


<style scoped>
.cd {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

#card-1 {
  height: 33%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
}

#card-2 {
  height: 33%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
}

#card-3 {
  height: 33%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");

}

#title {
  color: var(--color-primary);
  font-weight: 600;
}

#short {
  text-shadow: 0px 2px 6px var(--color-primary);
}
</style>