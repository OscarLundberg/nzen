<script lang="ts" setup>
import { minimalEditor, basicEditor, readonlyEditor } from "prism-code-editor/setups"
import "prism-code-editor/prism/languages/markup"
import { onMounted, ref } from "vue";
import type { PrismEditor } from "prism-code-editor";
import type { EditorTheme } from "prism-code-editor/themes";

const editor = ref<HTMLElement>()
const editorRef = ref<PrismEditor<{ theme: EditorTheme; }>>()
onMounted(() => {
  if (!editor.value) throw new Error("Element did not mount correctly");

  editorRef.value = basicEditor(
    editor.value,
    {
      language: "html",
      theme: "github-dark",
    },
    () => console.log("ready")
  )

})

</script>

<template>
  <div ref="editor"> </div>
</template>