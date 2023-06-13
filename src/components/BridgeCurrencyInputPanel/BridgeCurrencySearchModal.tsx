import React, { useCallback } from "react";
import { Token } from "state/bridge/actions";

import Modal from "../Modal";
import { BridgeCurrencySearch } from "./BridgeCurrencySearch";

interface BridgeCurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Token | null;
  onCurrencySelect: (currency: Token) => void;
}

export default function BridgeCurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
}: BridgeCurrencySearchModalProps) {
  const handleCurrencySelect = useCallback(
    (currency: Token) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect],
  );

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <BridgeCurrencySearch
        isOpen={isOpen}
        onDismiss={onDismiss}
        onCurrencySelect={handleCurrencySelect}
        selectedCurrency={selectedCurrency}
      />
    </Modal>
  );
}
