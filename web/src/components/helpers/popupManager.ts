import { ref } from "vue";

export type ModalOpts = {
    title?: string,
    body: string,
    onDismiss?: () => {},
    onAccept?: () => {},
    acceptText?: string;
    dismissText?: string;
    /**
     * @internal
     */
    __id?: string
}

export const popups = ref<Record<number, ModalOpts>>({});


let modalId = 0;
export function createPopup(opts: ModalOpts) {
    popups.value = { ...popups.value, [`${modalId}`]: { ...opts, __id: `${modalId}` } };
    modalId += 1
}

export function clearPopup(id: string) {
    console.log("CLEARING")
    popups.value = { ...popups.value, [id]: undefined };
}