import React, { useEffect } from "react";
import {
  ERC20Options,
  premintPattern,
  printERC20,
} from "@openzeppelin/wizard/dist/erc20";
import { AutoColumn } from "components/Column";
import { SwapPoolTabs } from "components/NavigationTabs";
import { RowBetween } from "components/Row";
import styled from "styled-components";

import hljs from "./highlightjs";
import { Wrapper } from "./styleds";

import "highlight.js/styles/github-dark.css";

import { ButtonPrimary } from "components/Button";
import Loader from "components/Loader";
import { AutoRow } from "components/Row";
import { ethers } from "ethers";
import { useActiveWeb3React } from "hooks";
import { useAppDispatch, useAppSelector } from "state/issue/hooks";
import {
  codeSet,
  compilingSet,
  highlightedCodeSet,
  optsSet,
  selectCode,
  selectCompiling,
  selectHighlightedCode,
  selectOpts,
} from "state/issue/issueSlice";
import { useTransactionAdder } from "state/transactions/hooks";
import { getCompilerInput } from "utils/issueUtils";
import { Solc } from "utils/solidity-compiler/wrapper";

const IssueBody = styled.div`
  position: relative;
  max-width: 1366px;
  // margin: 0 5rem;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  /* padding: 1rem; */
  margin-top: -50px;
`;

const IssueRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
  gap: 1rem;
`;

const SettingsSection = styled.div`
  width: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1rem;
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.bg2};
`;

const OutputSection = styled.div`
  border-radius: 15px;
  display: flex;
  overflow: auto;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.bg2};
`;

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
`;

const OutputCodeSection = styled.code`
  overflow-x: auto;
  display: block;
  background: #282c34;
  font-size: 1em;
  padding: 1rem;
  z-index: 2;
  height: 100%;
`;

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
`;

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
`;

const ControlSectionHeading = styled.h2`
  margin-top: 0;
  margin-bottom: 0;
  text-transform: lowercase;
  font-variant: small-caps;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text3};
  font-weight: 600;
`;

const TokenDetailsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.5rem;
`;

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
`;

const Input = styled.input<{ error?: boolean }>`
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 6px;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? "step-end" : "step-start")};
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
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

type ERC20OptionKeys = Exclude<
  keyof ERC20Options,
  "name" | "symbol" | "access" | "upgradeable" | "info"
>;

interface ERC20Feature {
  id: ERC20OptionKeys;
  label: string;
}

const ERC20Features: ERC20Feature[] = [
  {
    id: "mintable",
    label: "Mintable",
  },
  {
    id: "burnable",
    label: "Burnable",
  },
  {
    id: "pausable",
    label: "Pausable",
  },
  {
    id: "permit",
    label: "Permit",
  },
  {
    id: "votes",
    label: "Votes",
  },
  {
    id: "flashmint",
    label: "Flash Minting",
  },
  {
    id: "snapshots",
    label: "Snapshot",
  },
];

interface CompilerOutput {
  errors?: string[];
  contracts?: {
    [fullContractName: string]: {
      [contractName: string]: {
        abi: any[];
        evm: {
          bytecode: {
            object: string;
          };
        };
      };
    };
  };
  sources?: {
    [fileName: string]: {
      id: number;
    };
  };
}

export default function Issue() {
  const { library } = useActiveWeb3React();

  const opts = useAppSelector(selectOpts);
  const code = useAppSelector(selectCode);
  const highlightedCode = useAppSelector(selectHighlightedCode);
  const compiling = useAppSelector(selectCompiling);
  const dispatch = useAppDispatch();

  const addTransaction = useTransactionAdder();

  /*
  The dispatch function reference will be stable as long as the same store instance is being passed to the <Provider>. Normally, that store instance never changes in an application.
  However, the React hooks lint rules do not know that dispatch should be stable, and will warn that the dispatch variable should be added to dependency arrays for useEffect and useCallback.
  */
  useEffect(() => {
    dispatch(codeSet(printERC20(opts)));
  }, [opts, dispatch]);

  useEffect(() => {
    dispatch(
      highlightedCodeSet(hljs.highlight(code, { language: "solidity" }).value),
    );
  }, [code, dispatch]);

  const handleDeployment = async () => {
    dispatch(compilingSet(true));
    const compiler = new Solc();
    const input = getCompilerInput(code, opts.name);

    const output: CompilerOutput = await compiler.compile(input);

    // Contract name is opts.name. if theres' space, remove it
    const contractName = opts.name.replace(/\s/g, "");
    const compiledContractOutput =
      output.contracts?.[opts.name]?.[contractName];

    if (!compiledContractOutput || output.errors) {
      console.error(output.errors ?? "No compiled contract output");
      dispatch(compilingSet(false));
      return;
    }

    const bytecode = compiledContractOutput.evm.bytecode.object;
    const abi = compiledContractOutput.abi;

    try {
      const signer = library?.getSigner();
      const factory = new ethers.ContractFactory(abi, bytecode, signer);

      const newContract = await factory.deploy();

      addTransaction(newContract.deployTransaction, {
        summary: `Deploy ${contractName}`,
      });

      await newContract.deployed();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(compilingSet(false));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch(optsSet({ ...opts, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    dispatch(optsSet({ ...opts, [name]: checked }));
  };

  return (
    <>
      <SwapPoolTabs active={"issue"} />
      <IssueBody>
        <Wrapper id="issue-page">
          <AutoColumn gap="1rem">
            <AutoRow justify="end" width="100%">
              <ButtonPrimary
                padding="10px 16px"
                width="unset"
                borderRadius="10px"
                onClick={async () => {
                  await handleDeployment();
                }}
                disabled={compiling}
              >
                {compiling ? (
                  <SpinnerContainer>
                    <Loader />
                    <span>Deploying ERC20...</span>
                  </SpinnerContainer>
                ) : (
                  "Deploy ERC20"
                )}
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
                    {ERC20Features.map((feature) => {
                      return (
                        <CheckboxGroup key={`features-${feature.id}`}>
                          <label>
                            <input
                              type="checkbox"
                              name={feature.id}
                              onChange={handleCheckboxChange}
                            />
                            {feature.label}
                          </label>
                        </CheckboxGroup>
                      );
                    })}
                  </ControlSection>
                </div>
              </SettingsSection>

              <OutputSection>
                <OutputPreSection>
                  <OutputCodeSection
                    dangerouslySetInnerHTML={{ __html: highlightedCode ?? "" }}
                  />
                </OutputPreSection>
              </OutputSection>
            </IssueRow>
          </AutoColumn>
        </Wrapper>
      </IssueBody>
    </>
  );
}
