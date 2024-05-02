import { defineStore } from 'pinia'
import { ethers } from 'ethers'
import { markRaw } from 'vue'
import { useVueDapp } from '@vue-dapp/core'

export function displayEther(balance) {
	return ethers.utils.formatEther(balance)
}

export const useEthers = defineStore('Ethers', {
	state: () => ({
		provider: null,
		signer: null,
		balance: 0n,
	}),
	getters: {},
	actions: {
		async setWallet(_provider) {
			this.provider = markRaw(new ethers.providers.Web3Provider(_provider))
			this.signer = markRaw(this.provider.getSigner())
		},

		resetWallet() {
			this.provider = null
			this.signer = null
			this.balance = 0n
		},

		async fetchBalance() {
			const { isConnected } = useVueDapp()
			if (!isConnected.value) return

			this.balance = (await this.signer.getBalance()).toBigInt()
		},
	},
})
