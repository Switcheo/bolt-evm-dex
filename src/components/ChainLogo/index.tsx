import { CSSProperties } from "react";
import { ReactComponent as BoltchainLogo } from "../../assets/svg/bridge-assets-list/bolt-logo.svg";
import { ReactComponent as EthereumLogo } from "../../assets/svg/bridge-assets-list/ethereum-logo.svg";
import { SupportedChainId } from "../../constants/chains";

interface Props {
  chain: SupportedChainId;
  style?: CSSProperties;
}

const ChainLogo = (props: Props) => {
  const { chain, style } = props;

  const renderLogo = () => {
    switch (chain) {
      case SupportedChainId.MAINNET:
      case SupportedChainId.SEPOLIA:
        return <EthereumLogo style={style} />;
      default:
        return <BoltchainLogo style={style} />;
    }
  };

  return <>{renderLogo()}</>;
};

export default ChainLogo;
