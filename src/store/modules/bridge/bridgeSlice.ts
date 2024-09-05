import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupportedChainId } from "../../../constants/chains";
import { getBridgeableTokens, serializeBridgeableTokensMap, SerializedBridgeableToken } from "../../../utils/bridge";
import { fetchHydrogenFees, fetchTokens } from "./services/api";
import { FeeResponse, TokenResponse } from "./services/types";

interface CurrencyI {
  chainId?: SupportedChainId,
  address?: string,
  decimals: number,
  symbol?: string,
  name?: string
}

interface BridgeState {
  sourceChain: SupportedChainId;
  destinationChain: SupportedChainId;
  selectedCurrency: CurrencyI;
  sourceAmount: string;
  bridgeableTokens: Record<string, { [chainId: number]: SerializedBridgeableToken }> | undefined;
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  bridgeFees: string | undefined;
}

const initialState: BridgeState = {
  sourceChain: SupportedChainId.SEPOLIA,
  destinationChain: SupportedChainId.PIVOTAL_SEPOLIA,
  selectedCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  sourceAmount: "",
  bridgeableTokens: {} as Record<string, { [chainId: number]: SerializedBridgeableToken }>,
  status: "idle",
  error: null,
  bridgeFees: undefined,
};

const bridgeSlice = createSlice({
  name: "bridge",
  initialState,
  reducers: {
    setSourceChain: (state, action: PayloadAction<SupportedChainId>) => {
      // If sourceChain is the same as destinationChain, then swap the two
      if (state.destinationChain === action.payload) {
        state.destinationChain = state.sourceChain;
      }
      state.sourceChain = action.payload;
    },
    setDestinationChain: (state, action: PayloadAction<SupportedChainId>) => {
      // If destinationChain is the same as sourceChain, then swap the two
      if (state.sourceChain === action.payload) {
        state.sourceChain = state.destinationChain;
      }
      state.destinationChain = action.payload;
    },
    setSelectedCurrency: (state, action: PayloadAction<CurrencyI>) => {
      state.selectedCurrency = action.payload;
    },
    setSourceAmount: (state, action: PayloadAction<string>) => {
      state.sourceAmount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokens.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTokens.fulfilled, (state, action: PayloadAction<TokenResponse>) => {
        state.status = "fulfilled";

        state.bridgeableTokens = serializeBridgeableTokensMap(getBridgeableTokens(action.payload));
      })
      .addCase(fetchTokens.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message ? action.error.message : null;
      })
      // Fees
      .addCase(fetchHydrogenFees.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchHydrogenFees.fulfilled, (state, action: PayloadAction<FeeResponse>) => {
        state.status = "fulfilled";

        state.bridgeFees = action.payload.withdrawal_fee;
      })
      .addCase(fetchHydrogenFees.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message ? action.error.message : null;
        state.bridgeFees = "0";
      });
  },
});

export const { setSourceChain, setDestinationChain, setSelectedCurrency, setSourceAmount } = bridgeSlice.actions;

export default bridgeSlice.reducer;
