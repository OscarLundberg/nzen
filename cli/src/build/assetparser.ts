import path from "path";
import { parseModule } from "./moduleparser";

/**
 * Parses `.nzasset` files 
 * 
 * `.toml` syntax is experimental
 * @param filepath 
 * @returns 
 */
export async function parseAssetType(filepath: string, rootDir: string) {
  const splitPattern = ".nzasset."
  const [beforeSplit, afterSplit] = path.basename(filepath).split(splitPattern)
  const moduleConf = await parseModule(filepath, rootDir, splitPattern);

  if (!afterSplit.includes("toml")) {
    // the shorthand way is `{assetextension}.nzasset.{langextension}`
    return {
      extensions: [beforeSplit],
      ...moduleConf
    }
  }
  return { extensions: [], ...moduleConf };
}
