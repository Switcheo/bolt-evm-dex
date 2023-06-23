import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { fetchTokens } from "./services/api";

export default function Updater(): null {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTokens());
  }, [dispatch]);

  return null;
}
