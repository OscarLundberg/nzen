<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue';

const props = defineProps<{ filename: string, level: number, isDirectory: boolean, selected: Promise<boolean> }>()
const expanded = true;

const emit = defineEmits<{ rename: [oldName: string, newName: string] }>();
const displayName = ref(props.filename)
const isRenaming = ref(false);
const textInput = useTemplateRef<HTMLInputElement>("textInput");
function beginRename(payload?: PointerEvent) {
    isRenaming.value = true;
    payload?.preventDefault();
    payload?.stopImmediatePropagation();
    setTimeout(() => textInput.value?.focus())
}

function endrename() {
    if (!isRenaming) { return; }
    isRenaming.value = false;

    // if(displayName.value.includes("tmp|")) {
    //     if(props.filename.includes("tmp|")) {
    //         // DELETE FILE
    //         emit('delete')
    //     }
        
    // }

    if (displayName.value.length > 0 && props.filename != displayName.value) {
        emit("rename", props.filename, displayName.value);
    }
};

function submit() {
    textInput.value?.blur();
}

const isSelected = ref(false);

onMounted(async () => {
    isSelected.value = await props.selected;
    if (props.filename.includes(`tmp|`)) {
        // displayName.value = "[temp]"
        // beginRename();
    }
})



</script>
<template>
    <span :style="{ 'margin-left': level * 35 + 'px' }" :draggable="true" @contextmenu="beginRename"
        :class="{ 'selected': isSelected, 'folder': isDirectory }">
        <i class="fa fa-chevron-right" v-show="isDirectory && !expanded"></i>
        <i class="fa fa-chevron-down" v-show="isDirectory && expanded"></i>
        <input v-show="isRenaming" ref="textInput" type="text" v-model="displayName" @blur="endrename"
            @keypress.enter="submit">
        <span v-show="!isRenaming && !filename.includes('tmp|')">
            {{ filename }}
        </span>
        <slot v-if="isDirectory"></slot>
    </span>
</template>


<style scoped>
span {
    cursor: pointer;
    user-select: none;
}



.selected {
    color: lightblue;
}
</style>