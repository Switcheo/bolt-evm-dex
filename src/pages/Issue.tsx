import { erc20, infoDefaults, KindedOptions } from "@openzeppelin/wizard";
import { ERC20Options, premintPattern, printERC20 } from "@openzeppelin/wizard/dist/erc20";
import { useEffect, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import solidity from "react-syntax-highlighter/dist/esm/languages/prism/solidity";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import styled from "styled-components";
import { UserRejectedRequestError } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ButtonError, ConnectKitLightButton } from "../components/Button";
import { AutoColumn } from "../components/Column";
import Loader from "../components/Loader";
import { AutoRow, RowBetween } from "../components/Row";
import { useTransactionAdder } from "../store/modules/transactions/hooks";
import { getCompilerInput } from "../utils/getCompilerInput";
import { Solc } from "../utils/solidity-compiler/wrapper";

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`;

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

const Input = styled.input<{ $error?: boolean }>`
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 6px;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ $error }) => ($error ? "step-end" : "step-start")};
  color: ${({ $error, theme }) => ($error ? theme.red1 : theme.text1)};
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

type ERC20OptionKeys = Exclude<keyof ERC20Options, "name" | "symbol" | "access" | "upgradeable" | "info">;

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
  }
];

interface CompilerOutput {
  errors?: string[];
  contracts?: {
    [fullContractName: string]: {
      [contractName: string]: {
        abi: any[];
        evm: {
          bytecode: {
            object: `0x${string}`;
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

SyntaxHighlighter.registerLanguage("solidity", solidity);

const Issue = () => {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const addTransaction = useTransactionAdder();

  const [opts, setOpts] = useState<Required<KindedOptions["ERC20"]>>({
    kind: "ERC20",
    ...erc20.defaults,
    premint: "",
    info: { ...infoDefaults },
  });
  const [rawCode, setRawCode] = useState<string>(printERC20(opts));

  const [compiling, setCompiling] = useState<boolean>(false);
  const [deployError, setDeployError] = useState<string | null>(null);

  // Effects
  useEffect(() => {
    setRawCode(printERC20(opts));
  }, [opts]);

  // Effects for code changes

  const handleDeployment = async () => {
    if (!walletClient || isError || isLoading) {
      setDeployError("Wallet client is not available");
      return;
    }

    setCompiling(true);
    setDeployError(null);
    const compiler = new Solc();
    const input = getCompilerInput(rawCode, opts.name);

    const output: CompilerOutput = await compiler.compile(input);

    // Contract name is opts.name. if theres' space, remove it
    const contractName = opts.name.replace(/\s/g, "");

    if (!output.contracts?.[opts.name]?.[contractName] || output.errors) {
      setDeployError(output.errors?.join(", ") ?? "No compiled contract output");
      setCompiling(false);
      return;
    }

    const compiledContractOutput = output.contracts[opts.name][contractName];
    const bytecode = compiledContractOutput.evm.bytecode.object;
    const abi = compiledContractOutput.abi;

    try {
      const [address] = await walletClient.requestAddresses();
      const hash = await walletClient.deployContract({
        abi,
        account: address,
        bytecode,
        args: [],
      });

      const transactionReceipt = await publicClient.waitForTransactionReceipt({ hash });

      addTransaction(transactionReceipt, {
        summary: `Deployed ${contractName}`,
      });
    } catch (error) {
      if (error instanceof UserRejectedRequestError) {
        setDeployError(error.message);
      }
    } finally {
      setCompiling(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOpts({ ...opts, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOpts({ ...opts, [name]: checked });
  };

  return (
    <IssueBody>
      <Wrapper id="issue-page">
        <AutoColumn gap="1rem">
          <AutoRow justify="end" width="100%">
            {walletClient && !isError && !isLoading && address ? (
              <ButtonError
                padding="10px 16px"
                width="unset"
                onClick={handleDeployment}
                disabled={compiling}
                $borderRadius="10px"
                $error={!!deployError}
              >
                {compiling ? (
                  <SpinnerContainer>
                    <Loader />
                    <span>Deploying Token...</span>
                  </SpinnerContainer>
                ) : deployError ? (
                  deployError
                ) : (
                  "Deploy Token"
                )}
              </ButtonError>
            ) : (
              <ConnectKitLightButton padding="18px" $borderRadius="20px" width="unset" />
            )}
          </AutoRow>
          <IssueRow>
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
                          <input type="checkbox" name={feature.id} onChange={handleCheckboxChange} />
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
                <SyntaxHighlighter
                  language="solidity"
                  style={vscDarkPlus}
                  customStyle={{
                    height: "100%",
                    margin: 0,
                  }}
                >
                  {rawCode}
                </SyntaxHighlighter>
              </OutputPreSection>
            </OutputSection>
          </IssueRow>
        </AutoColumn>
      </Wrapper>
    </IssueBody>
  );
};

export default Issue;
