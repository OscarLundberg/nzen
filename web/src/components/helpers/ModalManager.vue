<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { clearPopup, popups, type ModalOpts } from './popupManager';
import Modal from './Modal.vue';

const _popups = ref(popups);
const popupList = computed(() => Object.values(_popups.value));



function onAccept(popup: ModalOpts) {
    popup.onAccept?.();
    clearPopup(popup.__id!)
}
function onDismiss(popup: ModalOpts) {
    popup.onDismiss?.();
    clearPopup(popup.__id!);
}
</script>

<template>
    <template v-for="popup in popupList">
        <Modal @acceptTriggered="() => onAccept(popup)" @dismissTriggered="() => onDismiss(popup)" v-bind="popup" v-if="popup" />
    </template>
</template>
