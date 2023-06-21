import React from "react";
import { ReactComponent as BoltchainLogo } from "../../assets/images/bridge-assets-list/bolt-logo.svg";
import { ReactComponent as BSCLogo } from "../../assets/images/bridge-assets-list/bsc-logo.svg";
import { ReactComponent as EthereumLogo } from "../../assets/images/bridge-assets-list/ethereum-logo.svg";

// import { ReactComponent as ZilliqaLogo } from "../../assets/images/bridge-assets-list/zilliqa-logo.svg";

interface Props {
  chain: any;
  style?: any;
}

const ChainLogo: React.FC<Props> = (props: Props) => {
  const { chain, style } = props;

  const renderLogo = () => {
    switch (chain) {
      case "ETH":
        return <EthereumLogo className={style} />;
      // case "ZIL":
      //   return <ZilliqaLogo className={style} />;
      case "BNB":
        return <BSCLogo className={style} />;
      case "BOLTCHAIN":
        return <BoltchainLogo className={style} />;
      default:
        return <EthereumLogo className={style} />;
    }
  };

  return <>{renderLogo()}</>;
};

export default ChainLogo;
