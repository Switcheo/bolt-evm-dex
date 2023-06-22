import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export interface SwapState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly recipient: string | null;
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: "",
  [Field.INPUT]: {
    currencyId: "",
  },
  [Field.OUTPUT]: {
    currencyId: "",
  },
  recipient: null,
};

const SwapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    selectCurrency: (state, action: PayloadAction<{ field: Field; currencyId: string }>) => {
      const { field, currencyId } = action.payload;

      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      if (currencyId === state[otherField].currencyId) {
        state.independentField = state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
        state[field].currencyId = currencyId;
        state[otherField].currencyId = state[field].currencyId;
      } else {
        state[field].currencyId = currencyId;
      }
    },
    switchCurrencies: (state) => {
      const tempCurrencyId = state[Field.INPUT].currencyId;
      state[Field.INPUT].currencyId = state[Field.OUTPUT].currencyId;
      state[Field.OUTPUT].currencyId = tempCurrencyId;
      state.independentField = state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
    },
    typeInput: (state, action: PayloadAction<{ field: Field; typedValue: string }>) => {
      const { field, typedValue } = action.payload;
      state.independentField = field;
      state.typedValue = typedValue;
    },
    replaceSwapState: (
      state,
      action: PayloadAction<{
        field: Field;
        typedValue: string;
        inputCurrencyId?: string;
        outputCurrencyId?: string;
        recipient: string | null;
      }>,
    ) => {
      const { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } = action.payload;
      state[Field.INPUT].currencyId = inputCurrencyId;
      state[Field.OUTPUT].currencyId = outputCurrencyId;
      state.independentField = field;
      state.typedValue = typedValue;
      state.recipient = recipient;
    },
    setRecipient: (state, action: PayloadAction<{ recipient: string | null }>) => {
      const { recipient } = action.payload;
      state.recipient = recipient;
    },
  },
});

export const { selectCurrency, switchCurrencies, typeInput, replaceSwapState, setRecipient } = SwapSlice.actions;

export default SwapSlice.reducer;
