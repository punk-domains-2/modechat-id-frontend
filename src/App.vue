<template>
	<Navbar />

	<div class="main-container background-main">
		<!-- Connect Wallet modal -->
		<!-- <div class="modal fade" id="connectModal" tabindex="-1" aria-labelledby="connectModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-sm" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Connect your wallet</h5>
						<button
							id="closeConnectModal"
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						>
							<span aria-hidden="true"></span>
						</button>
					</div>
					<div class="modal-body row">
						<div class="card col-6 cursor-pointer wallet-img-wrapper" @click="connectMetaMask">
							<img
								src="./assets/wallets/metamask.png"
								class="card-img-top card-img-wallet"
								alt="MetaMask"
							/>
						</div>

						<div class="card col-6 cursor-pointer wallet-img-wrapper" @click="connectMetaMask">
							<img
								src="./assets/wallets/bifrost.png"
								class="card-img-top card-img-wallet"
								alt="Bifrost"
							/>
						</div>

						<div class="card col-6 cursor-pointer wallet-img-wrapper" @click="connectMetaMask">
							<img src="./assets/wallets/rabby.png" class="card-img-top card-img-wallet" alt="Rabby" />
						</div>

						<div class="card col-6 cursor-pointer wallet-img-wrapper" @click="connectMetaMask">
							<img src="./assets/wallets/brave.png" class="card-img-top card-img-wallet" alt="Brave" />
						</div>

						<div class="card col-6 cursor-pointer wallet-img-wrapper" @click="connectMetaMask">
							<img src="./assets/wallets/zerion.png" class="card-img-top card-img-wallet" alt="Zerion" />
						</div>

						<div class="card col-6 cursor-pointer wallet-img-wrapper" @click="connectCoinbase">
							<img
								src="./assets/wallets/coinbase.png"
								class="card-img-top card-img-wallet"
								alt="Coinbase"
							/>
						</div>


						<div class="card col-6 cursor-pointer wallet-img-wrapper" @click="connectMetaMask">
							<img
								src="./assets/wallets/trust.png"
								class="card-img-top card-img-wallet"
								alt="Trust Wallet"
							/>
						</div>
					</div>
				</div>
			</div>
		</div> -->
		<!-- END Connect Wallet modal -->

		<router-view></router-view>

		<Footer />
		<VueDappModal />
	</div>
</template>

<script lang="ts">
import { ethers } from 'ethers'
import { BrowserWalletConnector, RdnsEnum, useVueDapp } from '@vue-dapp/core'
import { VueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import tldsJson from './abi/tlds.json'
import tldAbi from './abi/PunkTLD.json'
import useChainHelpers from './hooks/useChainHelpers'

export default {
	components: {
		Navbar,
		Footer,
		VueDappModal,
	},

	mounted() {
		this.fetchReferrer()
		this.setTldContract()
		this.fetchMinterContractData()
		this.checkIfAdmin()

		// reset localstorage
		const v2 = localStorage.getItem('punkv1')

		if (!v2) {
			localStorage.clear()
			localStorage.setItem('connected', 'null')
			localStorage.setItem('punkv1', 'true')
		}
	},

	computed: {
		...mapGetters('user', ['getUserSelectedName']),
	},

	methods: {
		...mapActions('user', ['checkIfAdmin', 'fetchUserDomainNames', 'fetchCanUserBuy']),
		...mapActions('tld', ['fetchMinterContractData']),

		...mapMutations('user', ['setUserData']),
		...mapMutations('network', ['setNetworkData']),
		...mapMutations('tld', ['setTldContract']),

		async connectCoinbase() {
			await this.connectTo('CoinbaseWallet', undefined)
		},

		async connectMetaMask() {
			await this.connectWith('BrowserWallet', {
				target: 'rdns',
				rdns: RdnsEnum.metamask,
			})
		},

		async fetchReferrer() {
			// check if any referral is present: ?ref=...
			const urlParams = new URLSearchParams(window.location.search)
			const referral = urlParams.get('ref')

			// check if domain name or address in the ref field
			if (referral && referral.split('.').length === 2) {
				// likely a domain name
				// split referral into two (domain name and TLD)
				const domArr = referral.split('.')

				for (let netId in tldsJson) {
					// iterate through different chains
					if (tldsJson[netId]['.' + domArr[1]]) {
						// find the correct TLD
						// get fallback provider based on network ID
						const fProvider = this.getFallbackProvider(Number(netId))
						// create TLD contract (only new ABIs)
						const intfc = new ethers.utils.Interface(tldAbi)
						const refContract = new ethers.Contract(tldsJson[netId]['.' + domArr[1]], intfc, fProvider)
						// fetch domain holder
						const refDomainHolder = await refContract.getDomainHolder(domArr[0])

						if (refDomainHolder !== ethers.constants.AddressZero) {
							localStorage.setItem('referral', refDomainHolder) // store referral address in local storafe
						}
						break
					}
				}
			} else if (referral && ethers.utils.isAddress(referral)) {
				// valid address
				// the last found referral is considered
				localStorage.setItem('referral', referral) // store referral address in local storafe
			}
		},
	},

	setup() {
		const { addConnectors, chainId, address, connectTo } = useVueDapp()
		addConnectors([new BrowserWalletConnector()])

		const { getFallbackProvider } = useChainHelpers()

		// TODO: add @vue-dapp/coinbase
		// const coinbaseConnector = new CoinbaseWalletConnector({
		// 	appName: 'ModeChat ID',
		// 	jsonRpcUrl: 'https://mainnet.mode.network/',
		// })

		// TODO: vue-dapp v1 doesn't support metamask mobile link yet
		// const mmConnector = new MetaMaskConnector({
		// 	appUrl: 'https://id.modechat.xyz',
		// })

		return { address, chainId, connectTo, getFallbackProvider }
	},

	watch: {
		address(newVal, oldVal) {
			if (newVal) {
				this.setUserData()
				this.fetchUserDomainNames(true)
				this.checkIfAdmin()
			}
		},

		chainId(newVal, oldVal) {
			if (this.chainId >= 1) {
				this.setUserData()
				this.setNetworkData()
				this.fetchUserDomainNames(true)
				this.checkIfAdmin()
			}
		},
	},
}
</script>

<style scoped>
.main-container {
	padding: 20px;
	max-width: 100%;
	margin-left: auto;
	margin-right: auto;
}
</style>
