import { CSSProperties } from "react";
import { ReactComponent as PivotalchainLogo } from "../../assets/svg/bridge-assets-list/pivotal-logo-.svg";
import { ReactComponent as BSCLogo } from "../../assets/svg/bridge-assets-list/bsc-logo.svg";
import { ReactComponent as EthereumLogo } from "../../assets/svg/bridge-assets-list/ethereum-logo.svg";
import { ReactComponent as PolygonLogo } from "../../assets/svg/bridge-assets-list/polygon-logo.svg";
import { SupportedChainId } from "../../constants/chains";

interface Props {
  chain: SupportedChainId;
  style?: CSSProperties;
}

const ChainLogo = (props: Props) => {
  const { chain, style } = props;

  const renderLogo = () => {
    switch (chain) {
      case SupportedChainId.BOLTCHAIN:
        return <PivotalchainLogo style={style} />;
      case SupportedChainId.MAINNET:
        return <EthereumLogo style={style} />;
      case SupportedChainId.BSC:
        return <BSCLogo style={style} />;
      case SupportedChainId.POLYGON:
        return <PolygonLogo style={style} />;
      default:
        return <PivotalchainLogo style={style} />;
    }
  };

  return <>{renderLogo()}</>;
};

export default ChainLogo;
