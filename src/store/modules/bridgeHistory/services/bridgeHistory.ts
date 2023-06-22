// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_HYDROGEN_API_URL, HYDROGEN_BRIDGE_RELAY_API_URL } from "../../../../constants/utils";
import { BridgeRelayParams, GetRelaysResponse } from "./types";

// Define a service using a base URL and expected endpoints
export const bridgeHistoryApi = createApi({
  reducerPath: "bridgeHistoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_HYDROGEN_API_URL }),
  endpoints: (builder) => ({
    getRelays: builder.query<GetRelaysResponse, BridgeRelayParams>({
      query: (args) => {
        const { bridgeType, sourceBlockchain, destinationBlockchain, searchTerm } = args;

        const params = new URLSearchParams();
        if (bridgeType) {
          params.append("bridge", bridgeType);
        }
        if (sourceBlockchain) {
          params.append("source_blockchain", sourceBlockchain);
        }
        if (destinationBlockchain) {
          params.append("destination_blockchain", destinationBlockchain);
        }
        if (searchTerm) {
          params.append("search_term", searchTerm);
        }

        const queryString = params.toString();
        const url = `${HYDROGEN_BRIDGE_RELAY_API_URL}${queryString ? `?${queryString}` : ""}`;

        return { url };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetRelaysQuery } = bridgeHistoryApi;
