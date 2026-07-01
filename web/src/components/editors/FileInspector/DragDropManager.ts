import { ref } from "vue";
import type { FSDirEntry, VirtualFileSystem } from "./VirtualFileSystem";


let current = ref<[parent: FileSystemDirectoryHandle | undefined, target: string]>();
let cleanup = () => { }

export function useDragDrop(fs: VirtualFileSystem, consumer: FSDirEntry | undefined, emit: (((arg0: 'dragDropEnd') => void) & ((arg0: 'dragLeave') => void) & ((arg0: 'dragEnter') => void) & ((arg0: 'dragDropBegin', target?: string) => void))) {
    const isHovering = ref(false);
    return {
        /**
         * Should be called by a direct child of the consuming dir. pass the filename of the target
         * @param target 
         */
        begin: (target?: string) => {
            if (!fs.isDirectory(consumer)) {
                return emit('dragDropBegin', consumer?.name);
            }
            if (!target) {
                console.warn("Received undefined name. cannot drag drop root")
                return;
            }
            current.value = [consumer, target];
        },

        end: () => {
            if (!fs.isDirectory(consumer)) {
                return emit('dragDropEnd');
            }

            if (current.value) {
                const [parent, targetName] = current.value
                fs.move(parent, targetName, consumer, targetName)
            }
            isHovering.value = false;
        },
        enter: () => {
            if (!fs.isDirectory(consumer)) {
                return emit('dragEnter')
            }
            isHovering.value = true;
        },
        leave: () => {
            if (!fs.isDirectory(consumer)) { return; }
            
            isHovering.value = false;
        },
        isHovering
    }
};