<script lang="ts" setup>
import { RemoteDriver, VueFinder } from 'vuefinder';
import { FileSystemAPIDriver } from './FileSystemAPIDriver';
import { onMounted, ref } from 'vue';

const driver = ref<FileSystemAPIDriver>();
onMounted(() =>
  driver.value = new FileSystemAPIDriver({
    baseURL: 'https://vuefinder-api.ozdemir.be/api/files',
  })
);


</script>

<template>
  <VueFinder v-if="driver" id="file-inspector" :driver="driver" :config="{}"></VueFinder>
</template>

<style>
div {
  height: 100%;
}
</style>