import { NzEngine } from "@nzen/core";
import { NzModule } from "./module";

/**
 * Declare an asset type preprocessor.
 * 
 * Importing the asset with an import statement, will return an instance of the appropriate NzAsset-class instead. 
 * The preprocessing/import behaviour should be implemented in {@link preprocess}
 */
export abstract class NzAsset extends NzModule {
  constructor(file: string, engine: NzEngine) {
    super(engine, {});


  }

  /**
   * Specify what extension this asset type uses
   * @example ".png"
   */
  abstract extension: string;
  /**
   * This function will run before an asset with the given {@link extension} is imported
   * 
   * The function should handle reading and processing the file data.
   * Processed data can be stored on the class instance and will be accessible on import 
   * 
   * @param file 
   */
  abstract preprocess(file: ArrayBuffer): void;
}