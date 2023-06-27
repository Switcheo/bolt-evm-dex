import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { TokenList } from "@uniswap/token-lists";

export type PopupContent =
  | {
      txn: {
        hash: string;
        success: boolean;
        summary?: string;
      };
    }
  | {
      listUpdate: {
        listUrl: string;
        oldList: TokenList;
        newList: TokenList;
        auto: boolean;
      };
    };

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>;

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number };
  readonly popupList: PopupList;
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    updateBlockNumber: (state, action: PayloadAction<{ chainId: number; blockNumber: number }>) => {
      const { chainId, blockNumber } = action.payload;
      if (typeof state.blockNumber[chainId] !== "number") {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId]);
      }
    },
    addPopup: (state, action) => {
      const { content, key, removeAfterMs = 15000 } = action.payload;
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ]);
    },
    removePopup: (state, action) => {
      const { key } = action.payload;
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false;
        }
      });
    },
  },
});

export const { updateBlockNumber, addPopup, removePopup } = applicationSlice.actions;

export default applicationSlice.reducer;
