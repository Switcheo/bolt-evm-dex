import React from "react";
import { Token } from "@bolt-dex/sdk";
import { ImportToken } from "components/SearchModal/ImportToken";

import Modal from "../Modal";

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
  onDismiss,
}: {
  isOpen: boolean;
  tokens: Token[];
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={100}>
      <ImportToken tokens={tokens} handleCurrencySelect={onConfirm} />
    </Modal>
  );
}
