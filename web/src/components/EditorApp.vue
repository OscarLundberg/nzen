<script lang="ts" setup>
import { ref } from 'vue';
import FileInspector from './editors/FileInspector/FileInspector.vue';
import ScriptEditor from './editors/ScriptEditor.vue';
let hasProject = ref(false);
</script>
<template>
  <button v-if="!hasProject" @click="() => hasProject = true" class="btn btn-outline-primary">Create
    Project</button>
  <template v-else>
    <FileInspector></FileInspector>
    <ScriptEditor></ScriptEditor>
  </template>
</template>