import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  BASE_CARBON_API_URL,
  BASE_HYDROGEN_API_URL,
  CARBON_TOKENS_API_URL,
  HYDROGEN_BRIDGE_RELAY_API_URL,
  HYDROGEN_FEES_API_URL,
} from "../../../../constants/utils";
import { TokenResponse } from "./types";

export const fetchTokens = createAsyncThunk("bridge/fetchTokens", async () => {
  const response = await fetch(`${BASE_CARBON_API_URL}${CARBON_TOKENS_API_URL}`);
  const data: TokenResponse = await response.json();
  return data;
});

export const fetchHydrogenFees = createAsyncThunk("bridge/bridgeFetchFees", async (token_denom: string) => {
  try {
    const response = await fetch(`${BASE_HYDROGEN_API_URL}${HYDROGEN_FEES_API_URL}?token_denom=${token_denom}`);
    if (!response.ok) {
      throw new Error("Failed to fetch Hydrogen fees. Response status: " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle the error here
    console.error("Error fetching Hydrogen fees:", error);
    throw error; // Rethrow the error to propagate it to the caller
  }
});

// export const fetchHydrogenBridgeRelays = createAsyncThunk(
//   "bridge/fetchHydrogenBridgeRelays",
//   async ({ bridgeType, sourceBlockchain, destinationBlockchain }: BridgeRelay) => {
//     try {
//       const response = await fetch(
//         `${BASE_HYDROGEN_API_URL}${HYDROGEN_BRIDGE_RELAY_API_URL}?bridge=${bridgeType}&source_blockchain=${sourceBlockchain}&destination_blockchain=${destinationBlockchain}`,
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch Hydrogen bridge relays. Response status: " + response.status);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       // Handle the error here
//       console.error("Error fetching Hydrogen bridge relays:", error);
//       throw error; // Rethrow the error to propagate it to the caller
//     }
//   },
// );
