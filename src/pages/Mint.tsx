import { useCallback, useState } from "react";
import useWebSocket from "react-use-websocket";
import styled from "styled-components";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { switchChain } from '@wagmi/core'
import AddressInputPanel from "../components/AddressInputPanel";
import { ButtonError, ConnectKitLightButton } from "../components/Button";
import { AutoColumn, ColumnCenter } from "../components/Column";
import SuccessMintModal from "../components/SuccessMintModal";
import { SupportedChainId } from "../constants/chains";
import { WSS_FAUCET_URL } from "../constants/utils";
import AppBody from "./AppBody";
import { wagmiConfig } from "../config";

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`;

const BUTTON_MARGIN_TOP = "1rem";

const FAUCET_REQUEST = {
  url: "",
  tier: 0,
  symbol: "NativeToken",
};

export default function Mint() {
  const { address } = useAccount();

  const [typed, setTyped] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { chain } = useAccount();
  // const { switchNetwork } = useSwitchNetwork();
  // const { switchChain } = useSwitchChain();
  const processMessages = useCallback(
    (event: { data: string }) => {
      let response;
      try {
        response = JSON.parse(event.data);
      } catch (e) {
        console.error("Error parsing message", e);
        setError("Error processing server response.");
        setLoading(false);
        return;
      }

      if (response?.error) {
        setError(response.error);
        setSuccessMessage(null);
      }

      if (response?.success) {
        setError(null);
        setSuccessMessage(`10 ETH request accepted for ${typed}. Awaiting blockchain confirmation.`);
        setShowModal(true);
      }

      setLoading(false);
    },
    [typed],
  );

  const { sendJsonMessage, readyState } = useWebSocket(WSS_FAUCET_URL, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: () => true,
    onMessage: processMessages,
    onError: (event: WebSocketEventMap["error"]) => {
      console.error("WebSocket error occurred.", event);
      setLoading(false);
    },
  });

  const handleRecipientType = useCallback(
    (val: string) => {
      setTyped(val);
      if (error) setError(null);
    },
    [error],
  );

  const onClaim = useCallback(() => {
    setLoading(true);
    sendJsonMessage({
      ...FAUCET_REQUEST,
      url: typed,
    });
  }, [typed, sendJsonMessage]);

  const handleChangeNetwork = useCallback(() => {
    // switchNetwork?.(SupportedChainId.PIVOTAL_SEPOLIA);
    switchChain?.(wagmiConfig, { chainId: SupportedChainId.PIVOTAL_SEPOLIA });
  }, [switchChain]);

  const handleModalDismiss = useCallback(() => {
    setSuccessMessage(null);
    setShowModal(false);
  }, []);

  return (
    <>
      <AppBody>
        <Wrapper id="mint-page">
          <AutoColumn>
            <ColumnCenter>
              <AddressInputPanel id="mint-address-input-panel" value={typed} onChange={handleRecipientType} />
              {!address ? (
                <ConnectKitLightButton padding="18px" $borderRadius="20px" width="100%" mt={BUTTON_MARGIN_TOP} />
              ) : chain?.id !== SupportedChainId.PIVOTAL_SEPOLIA ? (
                <ButtonError
                  width="100%"
                  mt={BUTTON_MARGIN_TOP}
                  $error={chain?.id !== SupportedChainId.PIVOTAL_SEPOLIA}
                  onClick={handleChangeNetwork}
                >
                  Please switch to the Pivotal Network.
                </ButtonError>
              ) : (
                <ButtonError
                  id="mint-button"
                  width="100%"
                  mt={BUTTON_MARGIN_TOP}
                  disabled={!!error || !isAddress(typed) || readyState !== 1 || loading}
                  $error={!!error}
                  onClick={onClaim}
                >
                  {error ? error : "Send Me ETH"}
                </ButtonError>
              )}
              <SuccessMintModal isOpen={showModal} onDismiss={handleModalDismiss} message={successMessage} />
            </ColumnCenter>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  );
}
