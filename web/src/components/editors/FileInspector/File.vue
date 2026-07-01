<script lang="ts" setup>
import Await from '../../helpers/Await.vue';
import File from './File.vue';
import FileLabel from './FileLabel.vue';
import type { FSDir, FSFile, VirtualFileSystem } from './VirtualFileSystem';


const props = defineProps<{ target: FSFile, fs: VirtualFileSystem, level: number }>()
const emit = defineEmits(["invalidate"]);

</script>
<template>
    <div>
        <FileLabel @invalidate="emit('invalidate')" :fs="fs" :filename="target" :level="level" />
    </div>
</template>