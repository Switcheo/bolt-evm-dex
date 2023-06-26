import { useCallback, useState } from "react";
import useWebSocket from "react-use-websocket";
import styled, { useTheme } from "styled-components";
import { isAddress } from "viem";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import AddressInputPanel from "../components/AddressInputPanel";
import { ButtonError, ConnectKitLightButton } from "../components/Button";
import { AutoColumn, ColumnCenter } from "../components/Column";
import { SupportedChainId } from "../constants/chains";
import { WSS_FAUCET_URL } from "../constants/utils";
import { TYPE } from "../theme";
import AppBody from "./AppBody";

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`;

const BUTTON_PADDING = "16px 16px";
const BUTTON_MARGIN_TOP = "1rem";
const FONT_SIZE = 14;
const SUCCESS_COLOR = "green1";

const FAUCET_REQUEST = {
  url: "",
  tier: 0,
  symbol: "NativeToken",
};

export default function Mint() {
  const theme = useTheme();
  const { address } = useAccount();

  const [typed, setTyped] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

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
      }

      setLoading(false);
    },
    [typed],
  );

  const { sendJsonMessage, readyState } = useWebSocket(
    WSS_FAUCET_URL,
    {
      onOpen: () => console.log("WebSocket connection opened."),
      onClose: () => console.log("WebSocket connection closed."),
      shouldReconnect: () => true,
      onMessage: processMessages,
      onError: (event: WebSocketEventMap["error"]) => {
        console.error("WebSocket error occurred.", event);
        setLoading(false);
      },
    },
    chain?.id === SupportedChainId.BOLTCHAIN,
  );

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
    switchNetwork?.(42069);
  }, [switchNetwork]);

  return (
    <>
      <AppBody>
        <Wrapper id="mint-page">
          <AutoColumn>
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
                  disabled={!!error || !isAddress(typed) || readyState !== 1 || loading}
                  $error={!!error}
                  onClick={onClaim}
                >
                  {error ? error : "Send Me ETH"}
                </ButtonError>
              )}

              {successMessage && (
                <TYPE.body color={theme?.[SUCCESS_COLOR]} fontWeight={500} fontSize={FONT_SIZE} mt="0.75rem">
                  {successMessage}
                </TYPE.body>
              )}
            </ColumnCenter>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  );
}
