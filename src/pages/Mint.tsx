import { useCallback, useState } from "react";
import useWebSocket from "react-use-websocket";
import styled, { useTheme } from "styled-components";
import { isAddress } from "viem";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import AddressInputPanel from "../components/AddressInputPanel";
import { ButtonError, ConnectKitLightButton } from "../components/Button";
import { AutoColumn, ColumnCenter } from "../components/Column";
import SuccessMintModal from "../components/SuccessMintModal";
import { SupportedChainId } from "../constants/chains";
import { WSS_FAUCET_URL } from "../constants/utils";
import { TYPE } from "../theme";
import AppBody from "./AppBody";

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
  const theme = useTheme();

  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const processMessages = useCallback(
    (event: { data: string }) => {
      let response;
      try {
        response = JSON.parse(event.data);
      } catch (e) {
        console.error("Error parsing message", e);

        setMessage("Error processing server response.");
        setStatus("error");
        return;
      }

      if (response?.error) {
        setStatus("error");
        setMessage(response.error);
      }

      if (response?.success) {
        setStatus("success");
        setMessage(`10 ETH request accepted for ${typed}. Awaiting blockchain confirmation.`);
        setShowModal(true);
      }
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
      setStatus("error");
      setMessage("Error connecting to faucet server.");
    },
  });

  const handleRecipientType = useCallback((val: string) => {
    setTyped(val);
  }, []);

  const onClaim = useCallback(() => {
    setStatus("loading");
    setShowModal(true);

    sendJsonMessage({
      ...FAUCET_REQUEST,
      url: typed,
    });
  }, [typed, sendJsonMessage]);

  const handleChangeNetwork = useCallback(() => {
    switchNetwork?.(SupportedChainId.BOLTCHAIN);
  }, [switchNetwork]);

  const handleModalDismiss = useCallback(() => {
    setStatus("idle");
    setShowModal(false);
    setMessage(null);
  }, []);

  return (
    <>
      <AppBody>
        <Wrapper id="mint-page">
          <AutoColumn>
            <TYPE.black mb={"16px"} fontWeight={700}>
              Mint
            </TYPE.black>
            <TYPE.main mb={"8px"} fontWeight={500} fontSize={"12px"} color={theme?.grey25}>
              Recipient
            </TYPE.main>
            <ColumnCenter>
              <AddressInputPanel id="mint-address-input-panel" value={typed} onChange={handleRecipientType} />
              {!address ? (
                <ConnectKitLightButton padding="18px" $borderRadius="20px" width="100%" mt={BUTTON_MARGIN_TOP} />
              ) : chain?.id !== SupportedChainId.BOLTCHAIN ? (
                <ButtonError
                  width="100%"
                  mt={BUTTON_MARGIN_TOP}
                  $error={chain?.id !== SupportedChainId.BOLTCHAIN}
                  onClick={handleChangeNetwork}
                >
                  Please switch to the Boltchain Network.
                </ButtonError>
              ) : (
                <ButtonError
                  id="mint-button"
                  width="100%"
                  mt={BUTTON_MARGIN_TOP}
                  disabled={!isAddress(typed) || readyState !== 1 || status === "loading"}
                  onClick={onClaim}
                >
                  {"Send Me ETH"}
                </ButtonError>
              )}
              <SuccessMintModal isOpen={showModal} status={status} onDismiss={handleModalDismiss} message={message} />
            </ColumnCenter>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  );
}
