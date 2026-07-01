<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import FileInspector from './editors/FileInspector/FileInspector.vue';
import ScriptEditor from './editors/ScriptEditor.vue';
import ModalManager from './helpers/ModalManager.vue';
import ToastManager from './helpers/ToastManager.vue';
let hasProject = ref(false);


type Project = {name:string, createdDate: number};
const projects = ref<Project[]>([]);

onMounted(() => {
  const locallyStoredProjects:Project[] = JSON.parse(localStorage.getItem("nz_project_list") ?? "[]")

  if(locallyStoredProjects){
    projects.value = [...locallyStoredProjects];
  }
});

</script>
<template>
  <div class="container">
    <ModalManager />
    <ToastManager />
    <button v-if="projects.length <= 0 " @click="() => hasProject = true" class="btn btn-outline-primary">Create
      Project</button>
    <template v-else v-for="project in projects">
      <FileInspector projectName="test"></FileInspector>
      <ScriptEditor></ScriptEditor>
    </template>
  </div>
</template>