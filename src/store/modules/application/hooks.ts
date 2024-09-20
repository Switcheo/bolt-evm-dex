import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addPopup, PopupContent, removePopup } from "./applicationSlice";

export function useBlockNumber(): number | undefined {
  const { chain } = useAccount();
  const chainId = chain?.id;

  return useAppSelector((state) => state.application.blockNumber[chainId ?? -1]);
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }));
    },
    [dispatch],
  );
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }));
    },
    [dispatch],
  );
}

// get the list of active popups
export function useActivePopups() {
  const list = useAppSelector((state) => state.application.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}
