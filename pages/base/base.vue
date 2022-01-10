<template>
	<view class="bg-white">
		<ZList apiKey="example" :formData="formData" @updateResult="updateResult">
			<template v-slot>
				<view class="cu-list menu-avatar">
					<view class="cu-item" v-for="(item, index) in result" :key="index">
						<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
						<view class="content">
							<view class="text-grey">{{item.name}}</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									<text class="cuIcon-infofill text-red  margin-right-xs"></text>
									{{index}}我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。
								</view> </view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">22:20</view>
							<view class="cu-tag round bg-grey sm">{{item.age}}</view>
						</view>
					</view>
				</view>
			</template>
		</ZList>
	</view>
</template>

<script>
	import ZList from '@/components/ZList.vue'
	export default {
		data() {
			return {
				formData: {
					
				},
				result: []
			}
		},
		components:{
			ZList,
		},
		methods: {
			updateResult(data) {
				this.result = data
			}
		}
	}
</script>

<style>

</style>
