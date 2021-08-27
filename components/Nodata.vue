<template>
	<view :style="{'height': height}" class="nodataWin flex flex-direction justify-center align-center">
		<image class="nodata" src="../static/nodata.png"></image>
		<view class="nodataText">暂无相关数据</view>
	</view>
</template>

<script>
export default {
	name: 'Nodata',
	props:{
		height: {
			type: String,
			default: '100vh'
		}
	},
	data() {
		return {};
	}
};
</script>

<style>
.nodataWin {
	width: 100%;
	height: 100vh;
	
}
.nodata {
	width: 204rpx;
	height: 262rpx;
	margin: 0 auto;
	margin-top: -172rpx;
}
.nodataText{
	height: 86rpx;
	line-height: 86rpx;
	text-align: center;
	color: #b2b2b2;
}
</style>
