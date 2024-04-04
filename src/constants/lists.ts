const BOLT_DEFAULT_LIST = "https://raw.githubusercontent.com/Switcheo/bolt-token-list/master/lists/bolt-default-list.json";

const BA_LIST = "https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json";

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST];

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  BOLT_DEFAULT_LIST,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
];

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [];
