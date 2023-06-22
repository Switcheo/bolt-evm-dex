import { useMemo } from "react";
import { parseENSAddress } from "../utils/parseEnsAddress";
import uriToHttp from "../utils/uriToHttp";
import contenthashToUri from "./contenthashToUri";
import useENSContentHash from "./useENSContentHash";

const useHttpLocations = (uri: string | undefined | null) => {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri]);
  const resolvedContentHash = useENSContentHash(ens?.ensName);
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash)) : [];
    } else {
      return uri ? uriToHttp(uri) : [];
    }
  }, [ens, resolvedContentHash.contenthash, uri]);
};

export default useHttpLocations;
