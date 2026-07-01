import { ref } from "vue";

export const title = ref("");
export const items = ref<{
    title: string,
    url: string,
    iosIcon: string,
    mdIcon: string,
}[]>([])
