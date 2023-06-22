import { useCallback } from "react";
import { BridgeTx } from "../../hooks/useBridgeCallback";
import { ConfirmationModalContent, TransactionErrorContent } from "../TransactionConfirmationModal";
import BridgeConfirmationModal from "./BridgeConfirmationModal";
import BridgeModalFooter from "./BridgeModalFooter";
import BridgeModalHeader from "./BridgeModalHeader";


export default function ConfirmBridgeModal({
  bridgeTx,
  onConfirm,
  onDismiss,
  recipient,
  bridgeErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
}: {
  isOpen: boolean;
  bridgeTx: BridgeTx | undefined;
  attemptingTxn: boolean;
  txHash: string | undefined;
  recipient: string | null;
  onAcceptChanges: () => void;
  onConfirm: () => void;
  bridgeErrorMessage: string | undefined;
  onDismiss: () => void;
}) {
  const showAcceptChanges = false;

  const modalHeader = useCallback(() => {
    return bridgeTx ? (
      <BridgeModalHeader
        bridgeTx={bridgeTx}
        recipient={recipient}
        // onAcceptChanges={onAcceptChanges}
      />
    ) : null;
  }, [recipient, bridgeTx]);

  const modalBottom = useCallback(() => {
    return bridgeTx ? (
      <BridgeModalFooter
        onConfirm={onConfirm}
        bridgeTx={bridgeTx}
        disabledConfirm={showAcceptChanges}
        bridgeErrorMessage={bridgeErrorMessage}
      />
    ) : null;
  }, [onConfirm, bridgeTx, bridgeErrorMessage, showAcceptChanges]);

  // text to show while loading
  const pendingText = `Bridging ${bridgeTx?.amount} ${bridgeTx?.srcToken?.symbol} to ${bridgeTx?.destToken?.symbol}`;

  const confirmationContent = useCallback(
    () =>
      bridgeErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={bridgeErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Bridge"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, bridgeErrorMessage],
  );

  return (
    <BridgeConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  );
}