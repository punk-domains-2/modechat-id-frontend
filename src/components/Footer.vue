<template>
	<div class="container-fluid text-center mt-3">
		<router-link v-if="isActivated && isNetworkSupported" to="/profile">Profile</router-link>

		<span v-if="isActivated && isNetworkSupported"> | </span>

		<router-link v-if="isActivated && isNetworkSupported" to="/send-tokens">Send Tokens</router-link>
		<span v-if="isActivated && isNetworkSupported"> | </span>

		<router-link v-if="isUserMinterAdmin || isUserRoyaltyFeeUpdater || isUserTldAdmin" to="/admin"
			>Admin</router-link
		>
		<span v-if="isUserMinterAdmin || isUserRoyaltyFeeUpdater || isUserTldAdmin"> | </span>

		<a target="_blank" href="https://punk.domains">Powered by Punk Domains</a> |
		<a target="_blank" href="https://modechat.xyz">Built for Mode Chat</a>
	</div>

	<div class="container-fluid text-center">
		<a class="icons" href="http://docs.punk.domains" target="_blank"><i class="bi bi-journal-text"></i></a>

		<a class="icons" target="_blank" href="https://github.com/punk-domains-2/modechat-id-frontend"
			><i class="bi bi-github"></i
		></a>

		<a class="icons" target="_blank" href="https://discord.gg/8dSrwrAQeu"><i class="bi bi-discord"></i></a>

		<a class="icons" target="_blank" href="https://twitter.com/PunkDomains"><i class="bi bi-twitter"></i></a>
	</div>
</template>

<script>
import { useEthers } from 'vue-dapp'
import { mapGetters } from 'vuex'

export default {
	name: 'Footer',

	computed: {
		...mapGetters('network', ['isNetworkSupported']),
		...mapGetters('user', ['isUserMinterAdmin', 'isUserTldAdmin', 'isUserRoyaltyFeeUpdater']),
	},

	setup() {
		const { isActivated } = useEthers()
		return { isActivated }
	},
}
</script>

<style scoped>
a {
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

.container-fluid {
	/*background-color: #24263A;*/
	background-color: transparent;
	padding: 20px 0px;
	border-radius: 10px;
}

.icons {
	margin-left: 15px;
	margin-right: 15px;
	font-size: 2em;
}

.polygon {
	vertical-align: text-bottom;
	width: 40px;
}

.polygon svg circle {
	fill: #dbdfea;
}

.polygon:hover svg circle {
	fill: white;
}
</style>
