<template>
	<view>
		<view class="nav fixed">
			<!-- 搜索栏 -->
			<view class="cu-bar search bg-white">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input @focus="searchFocus" @blur="searchBlur" :adjust-position="false" type="text" :placeholder="searchplaceholder" confirm-type="search" />
				</view>
				<view class="action" @tap="showDrawer">
					<text>{{ actiontext }}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</view>
			<!-- 导航默认可滚动 -->
			<scroll-view v-if="tabstype === 'scroll'" scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="index == activeTabcur ? 'text-green cur' : ''" v-for="(item, index) in tabs" :key="index" @tap="tabSelect(index)" :data-id="index">
					{{ item }}
				</view>
			</scroll-view>
			<!-- 导航平分 -->
			<scroll-view v-if="tabstype === 'around'" scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view
						class="cu-item flex-sub"
						:class="index == activeTabcur ? 'text-orange cur' : ''"
						v-for="(item, index) in tabs"
						:key="index"
						@tap="tabSelect(index)"
						:data-id="index"
					>
						{{ item }}
					</view>
				</view>
			</scroll-view>
		</view>
		<scroll-view
			:style="'padding-top:' + top + 'rpx; height: 100vh'"
			scroll-y
			class="cu-list"
			:refresher-enabled="refresherEnabled"
			:refresher-triggered="refresher"
			:scroll-top="scrollTop"
			:refresher-default-style="none"
			@refresherrefresh="refresherrefresh"
			@scrolltolower="scrolltolower"
			@scroll="scroll"
		>
			<view :style="'margin-top:-108rpx'" class="flex align-center justify-center"><Loading></Loading></view>
			<view v-if="loading" class="flex align-center justify-center" style="height: 100vh;"><Loading></Loading></view>
			<view v-if="!noData" :style="'min-height: calc(100vh - ' + (top + 120) * scale + 'px)'"><slot name="list" :result="result"></slot></view>
			<Nodata v-if="noData"></Nodata>
			<view class="cu-load bg-blue" :class="page!==totalpage?'loading':''"></view>
			<view class="nomore" v-if="page===totalpage">没有更多了</view>
		</scroll-view>
		<!-- 侧边窗口 -->
		<view class="cu-modal drawer-modal justify-end" :class="drawerVisible ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog basis-xl" @tap.stop="" style="height: 100vh;"><slot name="drawer"></slot></view>
		</view>
	</view>
</template>

<script>
import Loading from './Loading';
import Nodata from './Nodata';
export default {
	name: 'Listview',
	props: {
		//查询数据方法
		request: {
			type: Function,
			default: () => {
				return () => {
					return new Promise((res, rej) => {
						res(true);
					});
				};
			}
		},
		//是否失去焦点查询
		searchblurable: {
			type: Boolean,
			default: false
		},
		//搜索框搜索文案placeholder
		searchplaceholder: {
			type: String,
			default: ''
		},
		//侧边窗口文案
		actiontext: {
			type: String,
			default: '筛选'
		},
		//是否展示搜索框
		searchvisible: {
			type: Boolean,
			default: false
		},
		//侧拉tabs
		tabs: {
			type: Array,
			default: () => {
				return [];
			}
		},
		//tab 类型  scroll around
		tabstype: {
			type: String,
			default: 'scroll'
		},
	},
	data() {
		return {
			scale: 1,
			drawerVisible: false,
			noData: false,
			loading: false,
			result: '',
			activeTabcur: 0,
			refresherEnabled: true,
			refresher: false,
			top: 0,
			oldScrollTop: 0,
			currentScrollTop: this.top,
			page: 0,
			totalpage: 0,
		};
	},
	components: {
		Loading,
		Nodata
	},
	created() {
		uni.getSystemInfo({
			success: e => {
				this.scale = e.screenWidth / 750;
				console.log(this.scale);
			}
		});
	},
	mounted() {
		if (this.tabs.length !== 0 && this.searchvisible) {
			this.top = 190;
		} else {
			if (this.tabs.length !== 0 && !this.searchvisible) {
				this.top = 90;
			} else if (this.tabs.length === 0 && this.searchvisible) {
				this.top = 100;
			} else {
				this.top = 0;
			}
		}
		this.loading = true;
		this.search()
	},
	methods: {
		//拉起弹窗
		showDrawer() {
			this.drawerVisible = true;
		},
		search(refresh) {
			this.request().then(res => {
				if (res) {
					//请求结束
					//有数据
					this.noData = false;
					//是否刷新
					if(refresh){
						setTimeout(() => {
							this.result = [...res];
						}, 500);
					} else {
						setTimeout(() => {
							this.result = [...this.result, ...res];
						}, 500);
					}
				} else {
					//没有数据
					this.noData = true;
				}
				setTimeout(() => {
					this.loading = false;
					this.refresher = false;
					//状态恢复
					this.currentScrollTop = this.oldScrollTop;
					this.$nextTick(() => {
						this.currentScrollTop = this.top;
					});
				}, 500);
			});
		},
		//关闭侧拉窗口
		hideModal() {
			this.drawerVisible = false;
		},
		//focus
		searchFocus() {
			this.$emit('searchFocus');
		},
		//blur
		searchBlur() {
			if (this.searchblurable) {
				this.search();
			}
			this.$emit('searchBlur');
		},
		//confirm
		searchConfirm() {
			this.search();
			this.$emit('searchConfirm');
		},
		//tab切换
		tabSelect(index) {
			this.activeTabcur = index;
			this.search();
		},
		//刷新
		refresherrefresh() {
			//todo  状态重置
			this.refresher = true;
			this.page = 0;
			this.currentScrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this.currentScrollTop = this.top;
			});
			this.search(true);
		},
		//上拉到底部
		scrolltolower() {
			this.search()
		},
		//滚动监听
		scroll(e) {
			this.oldScrollTop = e.detail.scrollTop;
			if (e.detail.scrollTop > 50) {
				this.refresherEnabled = false;
			} else {
				this.refresherEnabled = true;
			}
		},
		//设置当前页码
		setTotalPage(num) {
			this.totalpage = num;
		},
		nextPage(num){
			if(num){
				this.page = num
			} else {
				if(thi.page < this.totalpage){
					this.page ++
				}
			}
		},
	}
};
</script>

<style></style>
