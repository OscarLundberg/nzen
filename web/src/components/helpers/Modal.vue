<script setup lang="ts">
import type { ModalOpts } from './popupManager';

defineProps<ModalOpts>();
const emit = defineEmits<{ acceptTriggered: [], dismissTriggered: [] }>()
</script>

<template>
    <dialog open>
        <div class="card w-25" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{{ title ?? "" }}</h5>
                <p class="card-text">{{ body ?? "" }}</p>
            </div>
            <div class="card-body d-flex gap-1 justify-content-end">
                <button class="btn btn-secondary" @click="emit('acceptTriggered')">{{ dismissText ?? "Cancel" }}</button>
                <button class="btn btn-primary" @click="emit('dismissTriggered')">{{ acceptText ?? "OK" }}</button>

            </div>
        </div>
    </dialog>
</template>

<style scoped>
dialog {
    border: none;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>