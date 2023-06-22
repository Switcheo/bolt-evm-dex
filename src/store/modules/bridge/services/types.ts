export interface TokenDetailsResponse {
  id: string;
  creator: string;
  denom: string;
  name: string;
  symbol: string;
  decimals: string;
  bridge_id: string;
  chain_id: string;
  token_address: string;
  bridge_address: string;
  is_active: boolean;
  is_collateral: boolean;
}

export interface TokenResponse {
  tokens: TokenDetailsResponse[];
}

export interface FeeResponse {
  id: number;
  token_denom: string;
  blockchain: string;
  create_wallet_fee: string;
  deposit_fee: string;
  withdrawal_fee: string;
  created_at: string;
  expires_at: string;
}
