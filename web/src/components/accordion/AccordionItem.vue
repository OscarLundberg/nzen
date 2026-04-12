<script lang="ts" setup>
import { inject } from 'vue';

const id = inject("accordion-id");
const rnd = Math.floor(Math.random() * 100000000).toString(16);

</script>
<template>

  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
          :data-bs-target="`#flush-${rnd}`" aria-expanded="false" :aria-controls="`flush-${rnd}`">
        <div class=" d-flex justify-content-between px-3 w-100">
          <slot name="header"></slot>
        </div>
      </button>
    </h2>
    <div :id="`flush-${rnd}`" class="accordion-collapse collapse" :data-bs-parent="id">
      <div class="accordion-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
