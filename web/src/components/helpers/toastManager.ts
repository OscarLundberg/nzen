import { ref } from "vue";

export type ToastOpts = {
    source?: string,
    body: string,
    type?: "info" | "warning" | "error"
    duration?: 5000,
    onDismiss?: () => {},
    dismissText?: string;
    /**
     * @internal
     */
    __id?: string
    /**
     * @internal
     */
    __timestamp?: number,
    showToastAge?: boolean
}

export const toasts = ref<Record<number, ToastOpts>>({});


let toastId = 0;
export function createToast(opts: ToastOpts) {
    toasts.value = { ...toasts.value, [`${toastId}`]: { ...opts, __id: `${toastId}`, __timestamp: (opts?.showToastAge ?? true) ? Date.now() : -1 } };
    if ((opts?.duration ?? 5000) > 0) {
        setTimeout(() => {
            clearToast(`${toastId}`)
        }, opts.duration ?? 30000)
    }
    toastId += 1
}

export function clearToast(id: string) {
    toasts.value = { ...toasts.value, [id]: undefined };
}