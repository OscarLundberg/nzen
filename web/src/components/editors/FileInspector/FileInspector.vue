<script lang="ts" setup>
import { onMounted, ref } from 'vue';
//@ts-ignore
import VueResizable from 'vue-resizable'
import { VirtualFileSystem } from './VirtualFileSystem';
import DirectoryEntry from './DirectoryEntry.vue';
import Await from '../../helpers/Await.vue';

const props = defineProps<{
  projectName: string
}>();

const fileSystem = new VirtualFileSystem("test");
const visible = ref(false);
const key = ref(0)
async function opAndRedraw(op: (vfs: VirtualFileSystem) => Promise<any>) {
  await op(fileSystem);
  key.value += 1;
}


</script>

<template>
  <button id="toggleBtn" class="btn btn-outline-secondary" @click="visible = !visible">Toggle</button>
  <div class="offcanvas offcanvas-start" :class="{ 'show': visible }" tabindex="-1" id="offcanvas"
    aria-labelledby="offcanvasLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasLabel">Offcanvas</h5>
      <button type="button" class="btn-close" @click="visible = false" aria-label="Close"></button>

    </div>
    <div class="mx-3">
      <span class=" d-flex flex-row justify-content-between gap-2">
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline-secondary" @click="opAndRedraw(fs => fs.touch('temp'))"> <i
              class="fa fa-file"></i>
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="opAndRedraw(fs => fs.mkdir())"
            aria-label="Close"> <i class="fa fa-folder"></i> </button>
        </div>
        <div>

          <button type="button" class="btn btn-outline-secondary" @click="visible = false" aria-label="Close"> <i
              class="fa fa-upload"></i> </button>
        </div>
      </span>

    </div>
    <div class="offcanvas-body">
      <div class="file-list d-flex flex-column">
        <Await :promise="fileSystem.root()" #resolved="{ resolved }">
          <DirectoryEntry :target="resolved" @invalidate="key += 1" :fs="fileSystem" :key="key" />
        </Await>
      </div>
    </div>
  </div>
</template>


<style scoped>
#toggleBtn {
  position: fixed;
  left: 0px;
  top: 0px;
  margin: 20px;
}
</style>