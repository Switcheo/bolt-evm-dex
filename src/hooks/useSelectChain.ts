import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { SupportedChainId } from "constants/chains";

const useSelectChain = () => {
  // const dispatch = useAppDispatch()
  const { connector } = useWeb3React();

  return useCallback(async (targetChain: SupportedChainId) => {
    if (!connector) return;

    // const connection = getConnection(connector)

    // try {
    //   await switchChain(connector, targetChain)
    // } catch (error) {
    //   if (didUserReject(connection, error)) {
    //     return
    //   }

    //   console.error('Failed to switch networks', error)

    //   dispatch(addPopup({ content: { failedSwitchNetwork: targetChain }, key: 'failed-network-switch' }))
  }, []);
};

export default useSelectChain;
