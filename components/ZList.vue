<template>
	<view class="Listview">
		<!-- 搜索框 -->
		<view v-if="searchBarVisible" class="cu-bar fixed nav search bg-white" style="z-index: 1026;">
			<view class="search-form round">
				<Icon style="margin-left: 16rpx; position: relative; width: 48rpx; height: 48rpx; overflow: hidden;" posY="173"></Icon>
				<input
					@focus="searchFocus"
					@blur="searchBlur"
					@confirm="searchConfirm"
					:adjust-position="false"
					type="text"
					v-model="keywords"
					:placeholder="searchPlaceholder"
					confirm-type="search"
				/>
			</view>
			<view v-if="drawerVisible" class="action" @tap="showDrawer">
				<text>{{ drawerText }}</text>
				<text class="cuIcon-triangledownfill"></text>
			</view>
		</view>
		<!-- tab -->
		<scroll-view v-if="tabs.length !== 0 && !subTabs" scroll-x class="bg-white nav fixed" :style="'top:'+(searchBarVisible?'100rpx':'0rpx')">
			<view class="flex text-center">
				<view
					class="cu-item flex-sub"
					:class="index == activeTab ? 'text-blue cur' : ''"
					v-for="(item, index) in tabs"
					:key="index"
					@tap="tabSelect(index)"
					:data-id="index"
				>
					{{ item.title }}{{ item.count ? ' · ' + item.count + '' : '' }}
				</view>
			</view>
		</scroll-view>
		<scroll-view v-if="tabs.length !== 0 && subTabs" scroll-x class="bg-white nav fixed" :style="'top:'+(searchBarVisible?'100rpx':'0rpx')">
			<view class="cu-item" :class="index == activeTab ? 'text-blue cur' : ''" v-for="(item, index) in tabs" :key="index" @tap="tabSelect(index)" :data-id="index">
				{{ item.title }}{{ item.count ? ' · ' + item.count + '' : '' }}
			</view>
		</scroll-view>
		<!--  -->
		<view class="cu-load load-modal" v-if="loadModalVisible">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="/static/image/loading.png" mode="aspectFit"></image>
			<view class="gray-text">加载中...</view>
		</view>
		<scroll-view
			:class="listClass"
			:style="'padding-top:' + offsetTop + 'rpx; height: calc(100vh - '+ reduceHeight +'rpx)'"
			:scroll-y="scrollEnable"
			:refresher-enabled="refresherEnabled"
			:refresher-triggered="refresher"
			:scroll-top="currentScrollTop"
			:refresher-default-style="none"
			@refresherrefresh="handleRefresh"
			@scrolltolower="scrolltolower"
			@scroll="scroll"
			style=" position: relative; z-index:9;"
		>
			<view id="list">
				<view style="height: 118rpx; width: 100vw; " :style="'margin-top: '+(-118+Number.parseInt(moreOffsetTop))+'rpx;'" class="flex justify-center">
					<image style="width: 210rpx; height: 118rpx;" src="/static/loading.gif" mode="aspectFit"></image>
				</view>
				<slot></slot>
				<Nodata v-if="result.length === 0 && !loadModalVisible && !isLoadTextVisible && noDataVisible"></Nodata>
				<view v-if="result.length !== 0 && !loadModalVisible" class="cu-load" :class="isLoadTextVisible ? 'loading' : ''"></view>
				<view v-if="!isLoadTextVisible && result.length !== 0 && zindex === 1" class="overLoad" style="position: relative;">没有更多了</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
//todo api的验证
import apis from '@/api/index.js';
export default {
	name: 'ZList',
	props: {
		/**
		 * @description: 请求的api
		 */
		apiKey: {
			type: String,
			default: 'noApi'
		},
		/**
		 * @description: list calss
		 */
		listClass: {
			type: String,
			default: 'bg-white'
		},
		/**
		 * @description: 搜索参数
		 */
		formData: {
			type: Object,
			default: () => {
				return {}
			}
		},
		/**
		 * @description: list需要减少高度
		 */
		reduceHeight: {
			type: Number,
			default: 0
		},
		/**
		 * @description: 是否展示没有数据时的占位图
		 */
		noDataVisible: {
			type: Boolean,
			default: true
		},
		/**
		 * @description: 没有更多高度
		 */
		moreOffsetTop: {
			type: String || Number,
			default: '0'
		},
		/**
		 * @description: 列表据顶部距离
		 */
		listScrollTop: {
			type: String || Number,
			default: '0'
		},
		/**
		 * @description: 搜索文案
		 */
		searchPlaceholder: {
			type: String,
			default: '请输入关键字'
		},
		/**
		 * @description: 是否展现搜索框
		 */
		searchBarVisible: {
			type: Boolean,
			default: false
		},
		/**
		 * @description: 筛选按钮
		 */
		drawerVisible: {
			type: Boolean,
			default: true
		},
		/**
		 * @description: 筛选文案
		 */
		drawerText: {
			type: String,
			default: ''
		},
		/**
		 * @description: 默认tab页
		 */
		defaultActiveTab: {
			type: Number,
			default: 0
		},
		/**
		 * @description: 是否平分
		 */
		subTabs: {
			type: Boolean,
			default: false
		},
	
		/**
		 * @description: tab页
		 * @example: [{title: '标题'， count: 1, apiKey: 'job.getList'}]
		 */
		tabs: {
			type: Array,
			default: () => {
				return [];
			}
		},
	},
	data() {
		return {
			result: [],
			tempResult: [],
			// 默认展示的tab
			activeTab: this.defaultActiveTab,
			//请求的参数
			keywords: '',
			pagesize: 10,
			page: 0,
			tempPage: 0,
			totalcount: 0,
			// 渲染列表的数据方式： 刷新还是新增 ‘render’， ‘add’
			renderType: 'render',
			//当前刷新状态
			refresher: false,
			// 是否展示加载中文案
			isLoadTextVisible: true,
			//是否正在加载中
			isLoading: false,
			//是否有更多数据
			hasMore: true,
			//list距离顶部的高度
			offsetTop: 0,
			//没有更多的文档层级
			zindex: 8,
			//当前滚动条的高度
			currentScrollTop: 0,
			oldScrollTop: 0,
			//窗口的高度 动态计算其他的高度
			height: 0,
			//加载的动画
			loadModalVisible: true,
			// 是否允许上拉
			refresherEnabled: true,
			// 是否允许滚动
			scrollEnable: true,
		};
	},
	created() {
		this.pagesize = this.formData.pagesize ?? 10;
		this.adjust();
	},
	mounted() {
		uni.getSystemInfo({
			success: res => {
				this.height = res.windowHeight;
			}
		});
		this.handleSearch();
	},
	updated() {
		this.adjust();
	},
	onShow() {
		this.handleSearch();
	},
	watch: {
		loadModalVisible(val) {
			if (!val) {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('#list')
					.boundingClientRect(data => {
						//加上的是像素
						if (this.height > data.height + 60) {
							this.zindex = 10;
						} else {
							this.zindex = 1;
						}
					})
					.exec();
			}
		},
	},
	methods: {		
		//结束动画
		animationOver() {
			setTimeout(() => {
				//关闭动画之前其他需要的操作
				this.$emit('animationOver')
			}, 100);
			setTimeout(() => {
				this.loadModalVisible = false;
				this.refresher = false;
				this.isLoading = false;
				// this.hasMore = false;
			}, 500);
		},
		/* 滚动超过一定距离，不允许下拉刷新 */
		scroll(e) {
			this.oldScrollTop = e.detail.scrollTop;
			if (e.detail.scrollTop > 50) {
				this.refresherEnabled = false;
			} else {
				this.refresherEnabled = true;
			}
		},
		//调整高度
		adjust() {
			if (this.listScrollTop != 0) {
				this.offsetTop = this.listScrollTop;
			} else {
				if (this.tabs.length !== 0) {
					if (this.searchBarVisible) {
						this.offsetTop = 190;
					} else {
						this.offsetTop = 90;
					}
				} else {
					if (this.searchBarVisible) {
						this.offsetTop = 100;
					} else {
						this.offsetTop = 0;
					}
				}
			}
		},
		//更新
		update() {
			this.tempPage = this.page;
			this.page = 1;
			if(this.result.length > 10) {
				this.pagesize = this.page * 10;
			}
			//todo  
			this.renderType = 'change';
			this.search();
		},
		/**
		 * @description: 下拉刷新数据
		 * @params {Object} data 重置 的数据
		 * @return void
		 */
		handleRefresh() {
			this.refresher = true;
			this.handleSearch();
		},
		/**
		 * @description: 加载更多
		 * @return void
		 */
		scrolltolower() {
			console.log('准备加载数据')
			//正在刷新中或者没有数据不允许再次请求
			if (!this.isLoading && this.hasMore) {
				this.page++;
				this.renderType = 'add';
				this.hasMore = true;
				this.isLoadTextVisible = true;
				console.log('加载数据'+this.page+'页')
				this.search();
			} else {
				console.log('数据全部已经加载完成')
			}
		},
		//搜索
		handleSearch() {
			this.refresherEnabled = true;
			this.scrollEnable = true;
			this.currentScrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this.currentScrollTop = 0;
			});
			this.page = 1;
			this.renderType = 'render';
			this.isLoading = true;
			this.hasMore = true;
			this.hideDrawer();
			this.search();
		},
		//搜索
		search() {
			let api = this.apiKey;
			if(this.apiKey === 'noApi') {
				api = this.tabs[this.activeTab].apiKey
			}
			const key = api.split('.')[0];			
			const fn = api.split('.')[1]?api.split('.')[1]: 'getList';
			const formData = {...this.formData, pageSize: this.pagesize, page: this.page}
			console.log(key, fn)
			console.log('formData', formData)
			apis[key][fn](formData).then(res=>{
				//渲染总页数
				this.totalcount = res.totalcount;
				console.log('共有数据（条）：', this.totalcount )
				console.log('加载第n页：', this.page )
				if (res.totalcount < this.pagesize) {
					setTimeout(()=>{
						this.isLoading = false;
					}, 500);
				}
				//判断是否可以继续加载
				if(res.all) {
					this.isLoadTextVisible = false;
					this.hasMore = false;
				} else {
					if (this.totalcount <= this.page * this.pagesize) {
						this.isLoadTextVisible = false;
						this.hasMore = false;
					}
				}
				this.$emit('updateTabs', res.tab_num);
				this.render(res.result, this.renderType);
				//结束动画
				this.animationOver();
				console.log('加载完成')
			})	
		},
		/**
		 * @description: 处理数据
		 * @params {Object/Array/Number} data 需要处理的数据
		 * @params {Function} type 处理数据的种类
		 * @return void
		 */
		render(data, type = 'render') {
			if(!data.length || data.length === 0) {
				// this.refresherEnabled = false;
				this.scrollEnable = false;
				this.result = data;
				this.$emit("updateResult", data)
			} else {
				if (type === 'render') {
					console.log('数据加载')
					this.result = data;
					this.$emit("updateResult", data)
				}
				if (type === 'add') {
					console.log('数据新增')
					this.result =  [...this.result, ...data];
					this.$emit("updateResult", [...this.result])
				}
				//刷新某一段的时候
				if (type === 'change') {
					console.log('数据更新')
					this.result = data;
					this.page = this.tempPage;
					this.pagesize = 10;
					this.$emit("updateResult", data);
				}
			}
		},
		/**
		 * @description: 搜索框
		 */
		searchFocus() {
			this.$emit('searchFocus', this.keywords);
		},
		/**
		 * @description: 搜索框
		 */
		searchBlur() {
			this.$emit('searchBlur', this.keywords);
		},
		/**
		 * @description: 搜索框
		 */
		searchConfirm() {
			this.$emit('searchConfirm', this.keywords);
		},
		showDrawer() {
			this.$emit('showDrawer');
		},
		//关闭drawer
		hideDrawer() {
			this.$emit('hideDrawer');
		},
		//tab切换
		tabSelect(index) {
			this.activeTab = index;
			//开启加载动画
			this.loadModalVisible = true;
			//更改需要切换的参数
			this.$emit('tabSelect', index);
			this.$nextTick(() => {
				this.handleSearch();
			});
		},
	}
};
</script>

<style>
.Listview .search {
	padding: 5rpx 40rpx 15rpx 40rpx;
	box-shadow: none;
}
.Listview .search-form {
	width: 600rpx;
	height: 72rpx;
	margin: 0;
	border-radius: 36rpx;
}
.Listview .search input {
	margin-left: 16rpx;
}
.Listview .action {
	margin-right: 0;
	margin-left: 24rpx;
}
.Listview .cu-bar .search-form + .action {
	margin-right: 0;
}
.Listview scroll-view:not(.nav) .cu-item {
	height: 86rpx;
	line-height: 86rpx;
	margin: 0;
	padding: 0 50rpx;
	border-bottom-width: 2rpx;
}
.Listview .overLoad {
	height: 120rpx;
	line-height: 120rpx;
	width: 100vw;
	text-align: center;
	color: #b2b2b2;
	position: relative;
}
.overLoad::before {
	content: '';
	width: 80rpx;
	height: 2rpx;
	position: absolute;
	background-color: #b2b2b2;
	top: 50%;
	left: 50%;
	margin-left: -174rpx;
}
.overLoad::after {
	content: '';
	width: 80rpx;
	height: 2rpx;
	position: absolute;
	background-color: #b2b2b2;
	top: 50%;
	left: 50%;
	margin-left: 84rpx;
}
</style>
