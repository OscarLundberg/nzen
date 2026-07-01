import { ToastyError } from "../../helpers/errorManager";
import { createPopup } from "../../helpers/popupManager";
import { createToast } from "../../helpers/toastManager";

export type FSDirEntry = FileSystemDirectoryHandle | FileSystemFileHandle;
export class VirtualFileSystem {

    async isSelected(entry?: FSDirEntry) {
        const selected = await this.selected;
        if (entry && selected) {
            return entry?.isSameEntry(selected);
        }
        return Promise.resolve(false);
    }


    // selected: FSDirEntry | undefined = undefined;

    selection?: [parent: FileSystemDirectoryHandle | undefined, key?: string];

    get selected() {
        const [parent, key] = this.selection ?? [undefined, undefined];
        return new Promise<FSDirEntry | undefined>(async res => {

            if (!key) {
                res(
                    await this.getDirOrRoot(parent)
                );
            } else {
                res(
                    await this.getChild(parent, key)
                );
            }
        })
    }

    async select(parent: FileSystemDirectoryHandle | undefined, key?: string) {
        this.selection = [parent, key];
    }

    async deselect() {
        this.selection = undefined;
    }

    readonly FS_KEY = "fs"

    async getChild(source: FileSystemDirectoryHandle | undefined, srcName: string) {
        const dir = await this.getDirOrRoot(source);
        for await (let [k, val] of dir.entries()) {
            if (k == srcName) { return val };
        }
    }

    async root() {
        await navigator.storage.persist();
        const originRoot = await navigator.storage.getDirectory();
        const projectRoot = originRoot.getDirectoryHandle(this.projectId, { create: true });
        return projectRoot;
    }

    async getSelectedDirOrRoot() {
        const [parent, target] = this.selection ?? [undefined, undefined];
        const currentSelection = await this.selected;
        if (currentSelection && this.isDirectory(currentSelection)) {
            return currentSelection;
        } else if (!currentSelection) {
            return await this.root()
        } else {
            return parent ?? await this.root()
        }
    }

    async getDirOrRoot(source: FileSystemDirectoryHandle | undefined) {
        return source ?? await this.root()
    }



    readonly version = 1;
    constructor(public projectId: string) { }


    async list(entry: FSDirEntry | undefined) {
        if (entry?.kind == 'file') return [];
        const dir = await this.getDirOrRoot(entry);
        let targets: (FileSystemDirectoryHandle | FileSystemFileHandle)[] = []
        for await (let [_, handle] of dir.entries()) { targets = [...targets, handle]; }
        return targets;
    }

    async touch(name: string, target?: FileSystemDirectoryHandle) {
        console.log({ name, target })

        createToast({
            body: "Hi this is popup",
            duration: 5000
        });

        const dir = await this.getSelectedDirOrRoot();
        return dir.getFileHandle(name, { create: true });
    }
    async mkdir() {

        const uniqueName = Math.random() * 10000000;
        console.log({uniqueName})
        const dir = await this.getSelectedDirOrRoot();
        return dir.getDirectoryHandle(`tmp|${uniqueName}`, { create: true });
    }

    async write(entry: FileSystemFileHandle, contents: string) {
        const writer = await entry.createWritable({ keepExistingData: false });
        await writer.write(contents);
        await writer.close();
    }
    async read(entry: FSDirEntry) {
        if (this.isFile(entry)) {
            const file = await entry.getFile();
            return await file.text()
        }
        return "";
    }

    async move(source: FileSystemDirectoryHandle | undefined, srcName: string, target: FileSystemDirectoryHandle | undefined, targetName: string) {
        await this.cp(source, srcName, target, targetName, { dryRun: true });
        await this.cp(source, srcName, target, targetName, { dryRun: false });
        await this.rm(source, srcName);
    }


    async cp(sourceDir: FileSystemDirectoryHandle | undefined, sourceName: string, target: FileSystemDirectoryHandle | undefined, targetName: string, opts: { dryRun: boolean } = { dryRun: false }) {
        const source = await this.getDirOrRoot(sourceDir);
        const childToMove = await this.getChild(source, sourceName)

        if (!childToMove) {
            throw new ToastyError("No such file or directory")
        }

        if (this.isDirectory(childToMove)) {
            const copy = await target?.getDirectoryHandle(targetName, { create: true });
            for await (let [name, child] of childToMove) {
                await this.cp(childToMove, name, copy, name, opts);
            }
        } else if (this.isFile(childToMove)) {
            const existing = await target?.getFileHandle(targetName, { create: false });
            if (existing) { throw new ToastyError("Failed - the file already exists"); }

            const newCopy = await target?.getFileHandle(targetName, { create: true });
            if (!newCopy) { throw new ToastyError("Failed - unknown reason"); }

            const contents = await this.read(childToMove);
            if (!opts.dryRun) {
                await this.write(newCopy, contents)
            }
        }
    }

    async rm(parent: FileSystemDirectoryHandle | undefined, name: string, recursive = true) {
        if (!parent) {
            throw new ToastyError("Cannot remove root")
        }

        await parent.removeEntry(name, { recursive })
    }


    public isDirectory(entry?: FSDirEntry): entry is FileSystemDirectoryHandle {
        return entry?.kind == "directory";
    }
    private isFile(entry?: FSDirEntry): entry is FileSystemFileHandle {
        return entry?.kind == "file"
    }
}