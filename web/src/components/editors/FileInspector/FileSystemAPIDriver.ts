
import { ArrayDriver, BaseAdapter, type ArchiveParams, type DeleteParams, type DeleteResult, type DirEntry, type FileContentResult, type FileOperationResult, type FsData, type RenameParams, type SaveParams, type TransferParams } from 'vuefinder';

/**
 * Configuration for Cloud Adapter
 */
export interface FileSystemAPIDriverConfig {
}

/**
 * Driver for handling file operations using local files via FileSystem API
 */
export class FileSystemAPIDriver extends BaseAdapter {
  list(params?: { path?: string; }): Promise<FsData> {
    throw new Error('Method not implemented.');
  }
  delete(params: DeleteParams): Promise<DeleteResult> {
    throw new Error('Method not implemented.');
  }
  rename(params: RenameParams): Promise<FileOperationResult> {
    throw new Error('Method not implemented.');
  }
  copy(params: TransferParams): Promise<FileOperationResult> {
    throw new Error('Method not implemented.');
  }
  move(params: TransferParams): Promise<FileOperationResult> {
    throw new Error('Method not implemented.');
  }
  archive(params: ArchiveParams): Promise<FileOperationResult> {
    throw new Error('Method not implemented.');
  }
  unarchive(params: { item: string; path: string; }): Promise<FileOperationResult> {
    throw new Error('Method not implemented.');
  }
  createFile(params: { path: string; name: string; }): Promise<FileOperationResult> {
    throw new Error('Method not implemented.');
  }
  createFolder(params: { path: string; name: string; }): Promise<FileOperationResult> {
    throw new Error('Method not implemented.');
  }
  getPreviewUrl(params: { path: string; }): string {
    throw new Error('Method not implemented.');
  }
  getContent(params: { path: string; }): Promise<FileContentResult> {
    throw new Error('Method not implemented.');
  }
  getDownloadUrl(params: { path: string; }): string {
    throw new Error('Method not implemented.');
  }
  search(params: { path?: string; filter: string; deep?: boolean; size?: 'all' | 'small' | 'medium' | 'large'; }): Promise<DirEntry[]> {
    throw new Error('Method not implemented.');
  }
  save(params: SaveParams): Promise<string> {
    throw new Error('Method not implemented.');
  }

  constructor(private config: FileSystemAPIDriverConfig) {
    super();
    if ('showDirectoryPicker' in self) {
      self.showDirectoryPicker()
      // The `showOpenFilePicker()` method of the File System Access API is supported.
    }
  }

}
