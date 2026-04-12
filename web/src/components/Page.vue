<script lang="ts" setup>
const props = withDefaults(
  defineProps<{ marginTop?: boolean, id: string }>(),
  {
    marginTop: true
  }
);
</script>

<template>
  <div :id="id" class="text-bg-dark fullheight">
    <slot></slot>
  </div>
</template>

<style scoped>
hr {
  background-color: transparent;
  margin-top: 0px;
  margin-bottom: 0px;
  position: relative;
  top: 0px;
}
</style>