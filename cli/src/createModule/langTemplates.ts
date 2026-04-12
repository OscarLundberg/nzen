type LanguageTemplate = {
  contents: string,
  fileName: (arg0: string) => string
}

export const templateByLanguageType: Record<string, LanguageTemplate> = {
  "js": {
    contents: "",
    fileName: (name: string) => `${name}.nzmod.js`
  },
  "ts": {
    contents: "",
    fileName: (name: string) => `${name}.nzmod.js`
  },
  "c": {
    contents: "",
    fileName: (name: string) => `${name}.nzmod.c`
  },
}