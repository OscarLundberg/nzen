<script lang="ts" generic="T extends Promise<any>" setup>
import { onMounted, ref } from 'vue';

const props = defineProps<{ promise: T }>()
const success = ref(false);
const resolved = ref<Awaited<T>>();
const error = ref<unknown>();
onMounted(async () => {
    try {

        success.value = true;
        resolved.value = await props.promise

    } catch (err) {
        error.value = err;
    }
});

</script>

<template>
    
    <slot name="loading" v-if="!resolved"></slot>
    <slot name="resolved" v-else-if="success" :resolved="resolved"></slot>
    <slot name="catch" v-else :error="error"></slot>
</template>