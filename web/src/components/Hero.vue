<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CodeBlock from './CodeBlock.vue';
import Page from './Page.vue';
import env from "../env.json";
const copied = ref(false);
const command = `npx nzen init './my-project'`
function click() {
  copied.value = true;
  window.navigator.clipboard.writeText(command)
  setTimeout(() => {
    copied.value = false;
  }, 10000)
}
</script>

<template>
  <Page id="home" :marginTop="false">
    <div id="card" class="card-img-overlay d-flex align-items-center justify-content-evenly flex-wrap">
      <div>
        <h1 id="title" class="display-1">nzen</h1>

        <p class="lead">
          lightweight, code-first, gamedev framework
        </p>
        <span>

          <a class="btn btn-outline-light" href="#features">More
            <i class="fa-solid fa-chevron-left fa-flip-horizontal"></i>
          </a>
        </span>


      </div>
      <div class="d-flex align-items-stretch flex-column gap-3 justify-items-center">

        <CodeBlock lang="bash" :source="command">
        </CodeBlock>
        <div class="d-flex justify-content-start gap-2 p-3">
          <button @click="click" class="btn btn-outline-light" v-show="!copied">
            <i class="fa-regular fa-copy"></i>
            Copy</button>
          <button @click="click" class="btn btn-success" v-show="copied">
            <i class="fa-solid fa-check"></i>
            Copied</button>
          <a :href="env.DOCS_URL" class="btn btn-primary">
            <i class="fa-solid fa-book"></i>
            Docs
            <i class="fa-solid fa-chevron-left fa-flip-horizontal"></i>
          </a>
          <a :href="env.GITHUB_URL" class="btn btn-secondary">
            <i class="fa-brands fa-github"></i>
            GitHub
            <i class="fa-solid fa-chevron-left fa-flip-horizontal"></i>
          </a>
        </div>
      </div>
    </div>
  </Page>
</template>


<style scoped>
#card {
  height: inherit;
  background-color: #dfdbe500;
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
}

#title {
  color: var(--color-primary);
  font-weight: 600;
}
</style>