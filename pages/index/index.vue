<template>
	<view>
		<Listview :request="request" searchplaceholder="demo" :searchvisible="true" :tabs="tabs" tabstype="around">
			<template v-slot:list="{ result }">
				<view class="bg-white flex" v-for="(item, index) in result" :key="index">
					<view class="basis-xs padding margin-right">name:{{item.name}}</view>
					<view class="basis-xl padding">age:{{item.age}}</view>
				</view>
			</template>
			<template v-slot:drawer>
				<!-- <view style="height: 3000upx;"></view> -->
			</template>
		</Listview>
		<!-- <view style="height: 3000upx;"></view> -->
	</view>
</template>

<script>
import Listview from '@/components/Listview.vue';
export default {
	data() {
		return {
			// tabs: ['tab', 'tab', 'tab', 'tab', 'tab']
			tabs: []
		};
	},
	components: {
		Listview
	},
	methods: {
		
		request() {
			return new Promise((res, rej) => {
				this.setTotalPage(2);
				this.nextPage(1);
				let result = [];
				for (let i = 0; i < 20; i++) {
					result.push({
						name: Math.random() + 'a',
						age: Math.ceil(Math.random() * 100)
					});
				}
				// res(result);
				res(false);
			});
		}
	}
};
</script>

<style></style>
