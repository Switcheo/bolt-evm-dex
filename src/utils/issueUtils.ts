import COMPILED_LIB from '../constants/compiled_libs.json'
import LIBS_MAPPING from '../constants/libs_mapping.json'

const COMPILED_LIBRARIES: { [key: string]: { content: string } } = COMPILED_LIB.sources
const LIBRARIES_MAPPING: { [key: string]: string } = LIBS_MAPPING

const findNestedImports = (filepath: string, processedFiles: Set<String>): string[] => {
  const fileName = filepath.split('/').pop() ?? filepath
  const modifiedFilePath = LIBRARIES_MAPPING[fileName]

  if (!COMPILED_LIBRARIES[modifiedFilePath] || processedFiles.has(modifiedFilePath)) {
    return []
  }

  processedFiles.add(modifiedFilePath)
  const fileContent = COMPILED_LIBRARIES[modifiedFilePath].content
  let imports = extractImports(fileContent)

  imports.forEach((importFile, i) => {
    imports = imports.concat(findNestedImports(importFile, processedFiles))
  })

  return Array.from(new Set(imports))
}

const extractImports = (code: string): string[] => {
  const regex = /import\s*["']([^"']*)["'];/g
  let matches
  let imports: Set<string> = new Set()

  while ((matches = regex.exec(code)) !== null) {
    const fileName = matches[1].split('/').pop() ?? matches[1]
    imports.add(fileName)
  }

  return Array.from(imports)
}

export const getCompilerInput = (code: string, tokenName: string) => {
  let processedFiles = new Set<string>()
  let imports = extractImports(code) // This will get all the root imports of the main contract.
  imports = imports.flatMap(importItem => [importItem, ...findNestedImports(importItem, processedFiles)])

  imports.forEach((importPath, i) => {
    const libPath = LIBRARIES_MAPPING[importPath]
    if (libPath) {
      imports[i] = libPath
    }
  })

  const contractsInput: { [key: string]: { content: string } } = {}
  contractsInput[tokenName] = { content: code }

  imports.forEach(importPath => {
    contractsInput[importPath] = { content: COMPILED_LIBRARIES[importPath].content }
  })

  return contractsInput
}
