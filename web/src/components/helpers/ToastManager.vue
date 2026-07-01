<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { clearToast, toasts, type ToastOpts } from './toastManager';
import Modal from './Modal.vue';
import Toast from './Toast.vue';

const _toasts = ref(toasts);
const toastList = computed(() => Object.values(_toasts.value));


function onDismiss(popup: ToastOpts) {
    popup.onDismiss?.();
    clearToast(popup.__id!);
}
</script>

<template>
    <div class="toast-container">
        <template v-for="toast in toastList">
            <Toast @dismissTriggered="() => onDismiss(toast)" v-bind="toast" v-if="toast" />
        </template>
    </div>
</template>



<style scoped>
.toast-container {
    position: fixed;
    right: 50px;
    top: 50px;
    display: flex;
    flex-direction: column;
}
</style>