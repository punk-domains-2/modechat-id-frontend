<template>
	<nav class="navbar navbar-expand-lg navbar-dark">
		<div class="container-fluid">
			<router-link to="/" class="navbar-brand">
				<img src="/assets/favicon.svg" alt="" height="30" class="d-inline-block align-middle navbar-img" />
				MODECHAT ID
			</router-link>

			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<div class="d-flex ms-auto">
					<div class="navbar-menu-buttons">
						<a class="btn btn-primary mx-2 navbar-menu-btn" href="https://modechat.xyz" target="_blank"
							>Chat on ModeChat</a
						>

						<!--
            <a 
              class="btn btn-primary mx-2 navbar-menu-btn" 
              href="https://paintswap.finance/marketplace/fantom/collections/fantom-names" 
              target="_blank"
            >Marketplace</a>
            -->

						<div v-if="isActivated" class="btn-group mx-2 navbar-menu-btn">
							<button
								class="btn btn-primary dropdown-toggle"
								type="button"
								id="dropdownMenuButton1"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								{{ getNetworkName }}
							</button>
							<ul class="dropdown-menu dropdown-menu-start" aria-labelledby="dropdownMenuButton1">
								<li>
									<span
										class="dropdown-item"
										:key="network"
										v-for="network in getSupportedNetworkNames"
										@click="changeNetwork(network)"
										>Switch to {{ network }}</span
									>
								</li>
							</ul>
						</div>

						<div v-if="isActivated" class="btn-group mx-2 navbar-menu-btn">
							<button
								class="btn btn-primary dropdown-toggle"
								type="button"
								id="dropdownMenuButton2"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								{{ getNameOrAddress }}
							</button>
							<ul class="dropdown-menu dropdown-menu-start" aria-labelledby="dropdownMenuButton2">
								<router-link tag="li" class="dropdown-item" to="/profile">Profile</router-link>
								<router-link tag="li" class="dropdown-item" to="/">Buy domain</router-link>
								<router-link tag="li" class="dropdown-item" to="/search-domain"
									>Search domain</router-link
								>
								<router-link tag="li" class="dropdown-item" to="/send-tokens">Send tokens</router-link>
								<router-link tag="li" class="dropdown-item" to="/about">About</router-link>
								<!-- <router-link tag="li" class="dropdown-item" to="/browser">Browser extension</router-link> -->
								<li class="dropdown-item" @click="openUrl('https://docs.punk.domains/')">Docs</li>
								<li class="dropdown-item" @click="logout">Disconnect</li>
							</ul>
						</div>

						<button
							v-if="!isActivated"
							class="btn btn-primary navbar-menu-btn"
							data-bs-toggle="modal"
							data-bs-target="#connectModal"
						>
							Connect wallet
						</button>

						<div v-if="isActivated" class="btn-group mx-2 navbar-menu-btn">
							<router-link tag="button" class="btn btn-primary" to="/send-tokens"
								>Send Tokens</router-link
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { useBoard, useEthers, useWallet } from 'vue-dapp'
import useChainHelpers from '../hooks/useChainHelpers'

export default {
	name: 'Navbar',

	computed: {
		...mapGetters('user', ['getUserShortAddress', 'getUserSelectedName']),
		...mapGetters('network', ['getNetworkName', 'getSupportedNetworks', 'getSupportedNetworkNames']),

		getNameOrAddress() {
			if (this.getUserSelectedName) {
				return this.getUserSelectedName
			} else {
				return this.getUserShortAddress
			}
		},
	},

	methods: {
		changeNetwork(networkName) {
			const networkData = this.switchNetwork(networkName)

			window.ethereum.request({
				method: networkData.method,
				params: networkData.params,
			})
		},

		logout() {
			this.disconnect()
			localStorage.clear()
			localStorage.setItem('connected', 'null')
		},

		openUrl(url) {
			window.open(url, '_blank').focus()
		},
	},

	setup() {
		const { open } = useBoard()
		const { disconnect } = useWallet()
		const { isActivated } = useEthers()
		const { switchNetwork } = useChainHelpers()

		return {
			isActivated,
			disconnect,
			open,
			switchNetwork,
		}
	},
}
</script>

<style scoped>
.dropdown-item {
	cursor: pointer;
}

.navbar-dark {
	border-radius: 0px 0px 10px 10px;
	/*background: linear-gradient(30deg, #C71585 30%, #c111c3 100%);*/
	background: transparent;
	padding: 20px;
}
.navbar-img {
	margin-right: 5px;
}

@media only screen and (max-width: 767px) {
	.navbar-menu-btn {
		margin-bottom: 5px;
	}
	.navbar-other-item {
		margin-top: 10px;
	}
	.navbar-menu-buttons {
		display: flex;
		flex-direction: column;
	}
}
</style>
