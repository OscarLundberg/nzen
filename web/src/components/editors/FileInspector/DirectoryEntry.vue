<script lang="ts" setup>
import Await from '../../helpers/Await.vue';
import type { VirtualFileSystem, FSDirEntry } from './VirtualFileSystem.ts';
import FileLabel from './FileLabel.vue';
import { useDragDrop } from './DragDropManager.ts';
import { ref } from 'vue';


const props = defineProps<{ target?: FSDirEntry, fs: VirtualFileSystem, level?: number }>()
const emit = defineEmits<{ rename: [oldName: string, newName: string], dragDropBegin: [target?: string], dragDropEnd:[target?:string], click: [target?: string], dragEnter: [], dragLeave: [] }>()
const dragDrop = useDragDrop(props.fs, props.target, emit);

// const self = props.fs.getChild(target, props.target);
let key = ref(0);
function invalidate() {
    key.value += 1;
}

async function onClick(targetChild?: string) {
    // Click event is called in children, therefore *this* props.target must be a dir
    //@ts-ignore
    await props.fs.select(props.target, targetChild);
    invalidate();
}

async function onRename(oldName: string, newName: string) {
    // Click event is called in children, therefore *this* props.target must be a dir
    //@ts-ignore
    await props.fs.move(props.target, oldName, props.target, newName);
    invalidate();
}


</script>
<template>
    <div class="folder" @drag="e => emit('dragDropBegin', target?.name)" @dragleave="dragDrop.leave"
        @dragenter="dragDrop.enter" @dragend="dragDrop.end()" @click="emit('click', target?.name)" :key="key">
        <FileLabel @rename="(oldName, newName) => emit('rename', oldName, newName)"
            :filename="target?.name ?? fs.projectId" :level="level ?? 0" :isDirectory="target?.kind == 'directory'"
            :selected="fs.isSelected(target)">
            <Await :promise="fs.list(target)" #resolved="{ resolved }">
                <template v-for="child in resolved">
                    <DirectoryEntry @dragDropBegin="dragDrop.begin" @dragDropEnd="dragDrop.end" @rename="onRename" @dragEnter="dragDrop.enter" @dragLeave="dragDrop.leave" @click="onClick" :fs="fs"
                        :target="child" :level="(level ?? 0) + 1" />
                </template>
            </Await>
        </FileLabel>

    </div>
</template>


<style>
div[drop-active=true] {
    color: greenyellow;
}
</style>