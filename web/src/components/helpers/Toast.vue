<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ToastOpts } from './toastManager';
import { Config } from './config';

const props = defineProps<ToastOpts>();
const emit = defineEmits<{ dismissTriggered: [] }>()

function determineAgeLabel() {
    if (!props?.__timestamp || props.__timestamp <= 0) {
        return ""
    }

    const secondsElapsed = (Date.now() - props.__timestamp) / 1000;

    if (secondsElapsed < 10) {
        return "Just now"
    } else if (secondsElapsed < 30) {
        return "<30 seconds ago"
    }

    else if (secondsElapsed < 60) {
        return "<1 minute ago"
    } else if (secondsElapsed < (60 * 60)) {
        const minutes = Math.floor(secondsElapsed / 60)
        const pluralS = minutes > 1 ? "s" : ""
        return `${minutes} minute${pluralS} ago`;
    } else {
        return `More than 1 hour ago`
    }
}


const timeSinceCreated = ref(determineAgeLabel());

setInterval(() => timeSinceCreated.value = determineAgeLabel(), 10500);


</script>

<template>
    <div class="toast show" :class="{ 'text-bg-warning': type == 'warning', 'text-bg-danger': type == 'error' }"
        role="alert" aria-live="assertive" aria-atomic="true" :id="__id">
        <div class="toast-header">
            <strong class="me-auto">{{ source ?? Config.APP_NAME }}</strong>
            <small>{{ timeSinceCreated }}</small>
            <button type="button" class="btn-close" aria-label="Close" @click="emit('dismissTriggered')"></button>
        </div>
        <div class="toast-body">
            {{ body }}
        </div>
    </div>
</template>
