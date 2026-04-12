import { build as viteBuild } from "vite";

export async function getCodeFromViteBuild(...args: Parameters<typeof viteBuild>): Promise<string> {

  const result = await viteBuild(...args);
  const resultArr = Array.isArray(result) ? result : [result];
  //@ts-ignore
  return resultArr[0].output[0].code;
}
