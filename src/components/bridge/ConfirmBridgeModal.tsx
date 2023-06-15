import { currencyEquals, Trade } from "@bolt-dex/sdk";
import { BridgeTx } from "pages/Bridge";
import React, { useCallback, useMemo } from "react";
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from "../TransactionConfirmationModal";
import BridgeConfirmationModal from "./BridgeConfirmationModal";
import BridgeModalFooter from "./BridgeModalFooter";
import BridgeModalHeader from "./BridgeModalHeader";

export default function ConfirmBridgeModal({
  bridgeTx,
  onAcceptChanges,
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
  }, [onConfirm]);

  // text to show while loading
  const pendingText = `Bridging ${bridgeTx?.amount} ${bridgeTx?.srcToken?.symbol} to ${bridgeTx?.destToken?.symbol}`;

  const confirmationContent = useCallback(
    () =>
      bridgeErrorMessage ? (
        <TransactionErrorContent
          onDismiss={onDismiss}
          message={bridgeErrorMessage}
        />
      ) : (
        <ConfirmationModalContent
          title="Confirm Bridge"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader],
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
