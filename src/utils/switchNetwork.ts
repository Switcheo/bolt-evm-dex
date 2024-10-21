import { switchChain } from '@wagmi/core'
import { pivotal, wagmiConfig } from '../config';

export default async function switchNetwork (chainId: number) {
    try {
        await switchChain(wagmiConfig, { chainId: chainId });
    } catch (error) {
        if ((error as { code: number }).code === 4902) {
        // Chain not added, so add it manually
        try {
            await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params:[
                {
                chainId: '0x4061', // Hexadecimal for 16481 (Pivotal Sepolia)
                chainName: pivotal.name,
                rpcUrls: pivotal.rpcUrls.public.http,
                nativeCurrency: pivotal.nativeCurrency,
                blockExplorerUrls: [pivotal.blockExplorers.default.url],
                }
            ],
            });
        } catch (addError) {
            console.error("Failed to add network: ", addError);
            throw new Error(`Failed to add network: ${addError}`)
        }
        } else {
            console.error("Failed to switch network: ", error);
            throw new Error(`Failed to switchhow network: ${error}`)
        }
    }
}