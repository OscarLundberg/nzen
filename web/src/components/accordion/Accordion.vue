<script lang="ts" setup>
import { provide } from 'vue';

const rnd = `accordion-${Math.floor(Math.random() * 100000000).toString(16)}`;
provide("accordion-id", rnd);

</script>

<template>

  <div class="accordion accordion-flush" :id="rnd">
    <slot></slot>
  </div>
</template>