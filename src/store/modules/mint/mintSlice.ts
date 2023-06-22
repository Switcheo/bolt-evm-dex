import { createSlice } from "@reduxjs/toolkit";

export enum Field {
  CURRENCY_A = "CURRENCY_A",
  CURRENCY_B = "CURRENCY_B",
}

export interface MintState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly otherTypedValue: string; // for the case when there's no liquidity
}

const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  typedValue: "",
  otherTypedValue: "",
};

const mintSlice = createSlice({
  name: "mint",
  initialState,
  reducers: {
    resetMintState: () => initialState,
    typeInput: (state, { payload: { field, typedValue, noLiquidity } }) => {
      if (noLiquidity) {
        if (field === state.independentField) {
          // When field hasn't changed, we don't need to spread the existing state.
          state.independentField = field;
          state.typedValue = typedValue;
        } else {
          return {
            ...state,
            independentField: field,
            typedValue,
            otherTypedValue: state.typedValue,
          };
        }
      } else {
        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: "",
        };
      }
    },
  },
});

export const { resetMintState, typeInput } = mintSlice.actions;

export default mintSlice.reducer;
