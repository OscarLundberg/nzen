<script lang="ts" setup>
import 'highlight.js/styles/default.min.css';
import 'highlight.js/styles/tokyo-night-dark.min.css';
import Highlight from "highlight.js"
const props = withDefaults(defineProps<{
  file?: string,
  source?: string,
  lang?: string,
  titlebar?: boolean
}>(), {
  titlebar: true
});

const highlighted = Highlight.highlight(props.source.trim(), { language: props?.lang ?? 'plaintext' });
const res = highlighted.value.replace(
  /\[\[([^|]+)\|([^\]]+)\]\]/g,
  '<a href="$2" class="hljs-link-custom">$1</a>'
);

</script>

<template>
  <div class="code-card" :class="{ 'borderless': !titlebar }">
    <div class="code-card__titlebar" v-if="titlebar">
      <span class="stoplight stoplight--close"></span>
      <span class="stoplight stoplight--min"></span>
      <span class="stoplight stoplight--expand"></span>
      <span class="title">
        {{ props.file }}
      </span>
    </div>
    <pre><code v-html="res"></code></pre>
    <slot></slot>
  </div>

</template>


<style scoped>
.borderless {
  border: 0 !important;
}

.title {
  font-size: small;
  font-family: monospace;
  color: darkgray;
  padding-left: 8px;
}

.code-card {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #313131;
  background: #1e1e1e;
  white-space: pre;
  min-width: 400px;
}

.code-card__titlebar {
  background: #2d2d2d;
  border-bottom: 1px solid #313131;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.stoplight {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.stoplight--close {
  background: #ff5f57;
}

.stoplight--min {
  background: #febc2e;
}

.stoplight--expand {
  background: #28c840;
}

.code-card pre {
  margin: 0;
  padding: 1.25rem 1.5rem;
  background: transparent;
  color: #d4d4d4;
  font-family: 'SF Mono', 'Fira Code', 'Menlo', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.7;
}
</style>