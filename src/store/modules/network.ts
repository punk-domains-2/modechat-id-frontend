import tokens from '../../abi/tokens.json'
import { useVueDapp } from '@vue-dapp/core'

export default {
	namespaced: true,

	state: () => ({
		networkCurrency: 'ETH',
		networkName: 'Unsupported Network',
		supportedNetworks: {
			34443: 'Mode',
		},
	}),

	getters: {
		getBlockExplorerBaseUrl() {
			// TODO
			return 'https://explorer.mode.network/'
		},

		getChainId() {
			const { chainId } = useVueDapp()
			return chainId.value
		},

		getNetworkCurrency(state) {
			return state.networkCurrency
		},

		getNetworkName(state) {
			const { chainId } = useVueDapp()
			const supportedIds = Object.keys(state.supportedNetworks)

			if (supportedIds && supportedIds.includes(String(chainId.value))) {
				return state.networkName
			}

			return 'Unsupported Network'
		},

		getSupportedNetworks(state) {
			return state.supportedNetworks
		},

		getSupportedNetworkIds(state) {
			return Object.keys(state.supportedNetworks)
		},

		getSupportedNetworkNames(state) {
			return Object.values(state.supportedNetworks)
		},

		getTokens(state) {
			const { chainId } = useVueDapp()
			return tokens[String(chainId.value)]
		},

		isNetworkSupported(state) {
			const { chainId } = useVueDapp()
			const supportedIds = Object.keys(state.supportedNetworks)

			if (supportedIds && supportedIds.includes(String(chainId.value))) {
				return true
			}

			return false
		},
	},

	mutations: {
		setNetworkData(state) {
			// TODO
			state.networkName = 'Mode'
			state.networkCurrency = 'ETH'
		},
	},

	actions: {},
}
