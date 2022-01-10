<template>
	<view>
		<button class="cu-btn round bg-blue" @tap="view('base')">基础</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabs: []
		};
	},
	methods: {
		view(type) {
			if(type === 'base') {
				uni.navigateTo({
					url: '/pages/base/base'
				})
			}
		}
	}
};
</script>

<style></style>
