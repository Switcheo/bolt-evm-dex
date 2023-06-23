import { useCallback } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { BridgeableToken } from "../../utils/entities/bridgeableToken";
import Modal from "../Modal";
import BridgeCurrencySearch from "./BridgeCurrencySearch";

interface BridgeCurrencyModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: BridgeableToken | null;
  onCurrencySelect: (currency: BridgeableToken) => void;
}

const BridgeCurrencyModal = ({ isOpen, onDismiss, onCurrencySelect, selectedCurrency }: BridgeCurrencyModalProps) => {
  const { height: windowHeight } = useWindowSize();
  let modalHeight: number | undefined = 80;

  if (windowHeight) {
    // Converts pixel units to vh for Modal component
    modalHeight = Math.min(Math.round((680 / windowHeight) * 100), 80);
  }

  const handleCurrencySelect = useCallback(
    (currency: BridgeableToken) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect],
  );

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} height={modalHeight} $scrollOverlay>
      <BridgeCurrencySearch
        isOpen={isOpen}
        onDismiss={onDismiss}
        onCurrencySelect={handleCurrencySelect}
        selectedCurrency={selectedCurrency}
      />
    </Modal>
  );
};

export default BridgeCurrencyModal;
