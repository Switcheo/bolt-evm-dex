/**
 *
 * This file contains functions that formats text for display
 * For example, a transaction hash is 66 characters long, but we only want to display the first 6 and last 4 characters.
 *
 * @summary A file for functions that format text for display
 *
 */

import { capitalize } from "lodash";

// Function that formats a transaction hash for display
export const formatTransactionHash = (hash: string | undefined): string => {
  if (!hash) return "";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

// function that shortens long strings
export const shortenString = (str: string, length: number): string => {
  return `${str.slice(0, length)}...${str.slice(-length)}`;
};

// function that put ellipsis after a certain number of characters
export const ellipsisAfterChars = (str: string, length: number): string => {
  return `${str.slice(0, length)}...`;
};

export const formatChainName = (chainName: string) => {
  if (chainName === "bsc") return "Binance Smart Chain";
  return chainName.charAt(0).toUpperCase() + chainName.slice(1);
};

export const formatStatus = (status: string) => {
  if (status === "in_transit") return "In Transit";
  return capitalize(status);
};
