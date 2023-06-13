import { useMemo } from 'react'
import contenthashToUri from '../utils/contenthashToUri'
import { parseENSAddress } from '../utils/parseENSAddress'
import uriToHttp from '../utils/uriToHttp'
import useENSContentHash from './useENSContentHash'

const useHttpLocations = (uri: string | undefined | null) => {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri])
  const resolvedContentHash = useENSContentHash(ens?.ensName)
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash)) : []
    } else {
      return uri ? uriToHttp(uri) : []
    }
  }, [ens, resolvedContentHash.contenthash, uri])
}

export default useHttpLocations
