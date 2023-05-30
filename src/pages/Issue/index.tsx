import React, { useEffect, useState } from 'react'
import { SwapPoolTabs } from 'components/NavigationTabs'
import { Wrapper } from './styleds'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import styled from 'styled-components'
import { KindedOptions, erc20, infoDefaults } from '@openzeppelin/wizard'
import { ERC20Options, premintPattern, printERC20 } from '@openzeppelin/wizard/dist/erc20'

import hljs from './highlightjs'
import 'highlight.js/styles/github-dark.css'
import { ButtonPrimary } from 'components/Button'
import { AutoRow } from 'components/Row'

import COMPILED_LIB from '../../constants/compiled_libs.json'
import LIBS_MAPPING from '../../constants/libs_mapping.json'
import { Solc } from 'utils/solidity-compiler/wrapper'
import { useActiveWeb3React } from 'hooks'
import { ethers } from 'ethers'
import { useTransactionAdder } from 'state/transactions/hooks'

const IssueBody = styled.div`
  position: relative;
  max-width: 1366px;
  // margin: 0 5rem;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  /* padding: 1rem; */
`

const IssueRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
  gap: 1rem;
`

const SettingsSection = styled.div`
  width: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1rem;
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.bg2};
`

const OutputSection = styled.div`
  border-radius: 15px;
  display: flex;
  overflow: auto;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.bg2};
`

const OutputPreSection = styled.pre`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex-basis: 0;
  flex-grow: 1;
  height: 100%;
  margin: 0;

  & > code {
    font-family: monospace;
  }
`

const OutputCodeSection = styled.code`
  overflow-x: auto;
  display: block;
  background: #282c34;
  font-size: 1em;
  padding: 1rem;
  z-index: 2;
  height: 100%;
`

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;

  & + & {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${({ theme }) => theme.bg2};
  }

  & > * + * {
    margin-top: 0.75rem;
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.5rem;
  }

  & input {
    margin-right: 0.5rem;
  }
`

const ControlSectionHeading = styled.h2`
  margin-top: 0;
  margin-bottom: 0;
  text-transform: lowercase;
  font-variant: small-caps;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text3};
  font-weight: 600;
`

const TokenDetailsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.5rem;
`

const LabeledInput = styled.label`
  display: flex;
  flex-direction: column;

  & > span {
    font-size: 0.875rem;
  }

  & > input {
    margin-top: 0.25rem;
    width: 100%;
  }
`

const Input = styled.input<{ error?: boolean }>`
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 6px;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.text1)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0.5rem 0.75rem;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }

  // Focus visible
  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.primary1};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primary1};
  }
`

type ERC20OptionKeys = Exclude<keyof ERC20Options, 'name' | 'symbol' | 'access' | 'upgradeable' | 'info'>

interface ERC20Feature {
  id: ERC20OptionKeys
  label: string
}

const ERC20Features: ERC20Feature[] = [
  {
    id: 'mintable',
    label: 'Mintable'
  },
  {
    id: 'burnable',
    label: 'Burnable'
  },
  {
    id: 'pausable',
    label: 'Pausable'
  },
  {
    id: 'permit',
    label: 'Permit'
  },
  {
    id: 'votes',
    label: 'Votes'
  },
  {
    id: 'flashmint',
    label: 'Flash Minting'
  },
  {
    id: 'snapshots',
    label: 'Snapshot'
  }
]

// const ERC20AccessControl = [
//   {
//     id: 'ownable',
//     label: 'Ownable'
//   },
//   {
//     id: 'roles',
//     label: 'Roles'
//   }
// ]

// const ERC20Upgradeability = [
//   {
//     id: 'transparent',
//     label: 'Transparent'
//   },
//   {
//     id: 'uups',
//     label: 'UUPS'
//   }
// ]

const COMPILED_LIBRARIES: { [key: string]: { content: string } } = COMPILED_LIB.sources
const LIBRARIES_MAPPING: { [key: string]: string } = LIBS_MAPPING

export default function Issue() {
  const { library } = useActiveWeb3React()

  const [opts, setOpts] = useState<Required<KindedOptions['ERC20']>>({
    kind: 'ERC20',
    ...erc20.defaults,
    premint: '',
    info: { ...infoDefaults }
  })

  const [code, setCode] = useState('')
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null)

  // const [requireAccessControl, setRequireAccessControl] = useState(erc20.isAccessControlRequired(opts))

  const [compiling, setCompiling] = useState<boolean>(false)

  const addTransaction = useTransactionAdder()
  // const [hash, setHash] = useState<string | undefined>()

  useEffect(() => {
    // setRequireAccessControl(erc20.isAccessControlRequired(opts))
    setCode(printERC20(opts))
  }, [opts])

  useEffect(() => {
    setHighlightedCode(hljs.highlight(code, { language: 'solidity' }).value)
  }, [code])

  let processedFiles = new Set<string>()

  const findNestedImports = (filepath: string) => {
    const fileName = filepath.split('/').pop() ?? filepath;
    const modifiedFilePath = LIBRARIES_MAPPING[fileName]

    // Check if the file exists in the compiled libraries
    if (!COMPILED_LIBRARIES[modifiedFilePath]) {
      return []
    }

    // If the file is already processed, then return an empty array to avoid infinite recursion
    if (processedFiles.has(modifiedFilePath)) {
      return [];
  }

    // Mark the file as processed
    processedFiles.add(modifiedFilePath);

    // Read file content
    const fileContent = COMPILED_LIBRARIES[modifiedFilePath].content;

    // Regex pattern to extract all import statements
    const regex = /import\s*["']([^"']*)["'];/g

    let matches;
    let imports: string[] = [];

    while ((matches = regex.exec(fileContent)) !== null) {
        // Only add the match if it isn't already in the array
        if (!imports.includes(matches[1])) {
            const fileName = matches[1].split('/').pop() ?? matches[1];
            imports.push(fileName);
        }
    }

    // Now, for each import, check its imports recursively
    imports.forEach(importFile => {
        const subImports = findNestedImports(importFile);
        imports = imports.concat(subImports);
    });

    // Remove duplicates
    imports = [...new Set(imports)];

    return imports;
  }

  const getCompilerInput = (code: string) => {
    // Regex pattern to extract all import statements
    const regex = /import\s*["']([^"']*)["'];/g

    let matches
    let imports: string[] = []

    // Get root imports
    while ((matches = regex.exec(code)) !== null) {
      // Only add the match if it isn't already in the array
      if (!imports.includes(matches[1])) {
        imports.push(matches[1])
      }
    }

    // Get sub imports for each import
    for (let i = 0; i < imports.length; i++) {
      const subImports = findNestedImports(imports[i])
      imports = imports.concat(subImports)
    }

    // Remove duplicates
    imports = [...new Set(imports)]

    // for each import, if it doesn't have "@openzeppelin/contracts", use libs_mapping.json to get the absolute path

    for (let i = 0; i < imports.length; i++) {
      const importPath = imports[i]
      if (!importPath.includes('@openzeppelin/contracts')) {
        const libPath = LIBRARIES_MAPPING[importPath]
        if (libPath) {
          imports[i] = libPath
        }
      }
    }

    // Now create the compiler input
    const contractsInput: { [key: string]: { content: string } } = {}

    const tokenName = opts.name
    // add main contract
    contractsInput[tokenName] = { content: code }

    for (let i = 0; i < imports.length; i++) {
      const importPath = imports[i]

      contractsInput[importPath] = { content: COMPILED_LIBRARIES[importPath].content }
    }

    return contractsInput
  }

  const handleDeployment = async () => {
    setCompiling(true)
    const compiler = new Solc()
    const input = getCompilerInput(code)

    const output: {
      contracts: {
        [key: string]: {
          [key: string]: {
            abi: any[]
            devdoc: {}
            evm: {
              bytecode: {
                object: string
              }
            }
            ewasm: {}
            metadata: string
            storageLayout: {}
            userdoc: {}
          }
        }
      }
      sources: {
        [key: string]: {
          id: number
        }
      }
    } = await compiler.compile(input)

    // Contract name is opts.name. if theres' space, remove it
    const contractName = opts.name.replace(/\s/g, '')
    const compiledContractOutput = output.contracts[opts.name][contractName]

    const bytecode = compiledContractOutput.evm.bytecode.object
    const abi = compiledContractOutput.abi

    try {
      const signer = library?.getSigner()
      const factory = new ethers.ContractFactory(abi, bytecode, signer)

      const newContract = await factory.deploy()

      addTransaction(newContract.deployTransaction, {
        summary: `Deploy ${contractName}`
      })
      // setHash(newContract.deployTransaction.hash)

      await newContract.deployed()
    } catch (error) {
      console.error(error)
    } finally {
      setCompiling(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setOpts(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    setOpts(prev => ({ ...prev, [name]: checked }))
  }

  return (
    <>
      <SwapPoolTabs active={'issue'} />
      <IssueBody>
        <Wrapper id="issue-page">
          <AutoColumn gap="1rem">
            <AutoRow justify="end" width="100%">
              <ButtonPrimary
                padding="10px 16px"
                width="unset"
                borderRadius="10px"
                onClick={async () => {
                  await handleDeployment()
                }}
                disabled={compiling}
              >
                {compiling ? 'Deploying...' : 'Deploy ERC20'}
              </ButtonPrimary>
            </AutoRow>
            <IssueRow minWidth="32rem">
              <SettingsSection>
                <div>
                  <ControlSection>
                    <ControlSectionHeading>Settings</ControlSectionHeading>
                    <TokenDetailsSection>
                      <LabeledInput>
                        <span>Token Name</span>
                        <Input
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          // error={error}
                          onChange={handleInputChange}
                          name="name"
                          value={opts.name}
                        />
                        {/* <input type="text" name="name" onChange={handleInputChange} /> */}
                      </LabeledInput>
                      <LabeledInput>
                        <span>Symbol</span>
                        <Input
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          // error={error}
                          onChange={handleInputChange}
                          name="symbol"
                          value={opts.symbol}
                        />
                        {/* <input type="text" name="symbol" onChange={handleInputChange} /> */}
                      </LabeledInput>
                    </TokenDetailsSection>
                    <LabeledInput>
                      <span>Premint</span>
                      <Input
                        type="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        placeholder="0"
                        // error={error}
                        pattern={premintPattern.source}
                        onChange={handleInputChange}
                        name="premint"
                        value={opts.premint}
                      />
                    </LabeledInput>
                  </ControlSection>
                  <ControlSection>
                    <ControlSectionHeading>Features</ControlSectionHeading>
                    {ERC20Features.map(feature => {
                      return (
                        <CheckboxGroup key={`features-${feature.id}`}>
                          <label>
                            <input type="checkbox" name={feature.id} onChange={handleCheckboxChange} />
                            {feature.label}
                          </label>
                        </CheckboxGroup>
                      )
                    })}
                  </ControlSection>

                  {/* <ControlSection>
                    <ControlSectionHeading>
                      <ControlSectionHeadingLabel>
                        <span>Access Control</span>
                        <span>
                          <input
                            type="checkbox"
                            name="access"
                            disabled={requireAccessControl}
                            onChange={handleCheckboxChange}
                          />
                        </span>
                      </ControlSectionHeadingLabel>
                    </ControlSectionHeading>
                    {ERC20AccessControl.map(feature => {
                      return (
                        <CheckboxGroup key={`access-control-${feature.id}`}>
                          <label>
                            <input type="radio" name="access" value={feature.id} onChange={handleCheckboxChange} />
                            {feature.label}
                          </label>
                        </CheckboxGroup>
                      )
                    })}
                  </ControlSection> */}

                  {/* <ControlSection>
                    <ControlSectionHeading>
                      <ControlSectionHeadingLabel>
                        <span>Upgradeability</span>
                        <span>
                          <input type="checkbox" name="upgradeable" onChange={handleRadioChange} defaultValue="transparent" />
                        </span>
                      </ControlSectionHeadingLabel>
                    </ControlSectionHeading>
                    {ERC20Upgradeability.map(feature => {
                      return (
                        <CheckboxGroup key={`upgradeability-${feature.id}`}>
                          <label>
                            <input
                              type="radio"
                              name="upgradeable"
                              value={feature.id}
                              // checked={UpgradeableType === feature.id}
                              onChange={handleRadioChange}
                            />
                            {feature.label}
                          </label>
                        </CheckboxGroup>
                      )
                    })}
                  </ControlSection> */}
                </div>
              </SettingsSection>

              <OutputSection>
                <OutputPreSection>
                  <OutputCodeSection dangerouslySetInnerHTML={{ __html: highlightedCode ?? '' }} />
                </OutputPreSection>
              </OutputSection>
            </IssueRow>
          </AutoColumn>
        </Wrapper>
      </IssueBody>
    </>
  )
}
