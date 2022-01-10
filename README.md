# mini-template
 uniapp微信小程序 结合了colorui的样式
 
##组件

###ZList
需要配置api/index(可能文件的位置有要求，之后优化)

基本需要
	 
	~ @apiKey[String] 搜索的api

		default：'noapi'
		
		example: 'xxx.xx'
		
	~ @formData[Object] 请求的参数
	
	~@functions

		~@updateResult 更新列表
		
			result [data]
 
参数
~@params
 
	 基本列表需要配置的参数
	 
	~ @apiKey[String] 搜索的api

		default：'noapi'
		
		example: 'xxx.xx'
		
	~ @formData[Object] 请求的参数

	其他可选配置

	~ @searchBarVisible[Boolean] 是否展现搜索框

		default: false

	~ @searchPlaceholder[String] 搜索框placeholder

		default: '请输入关键字'

	~ @drawerVisible[Boolean] 是否筛选按钮

		default: false
		
	~ @drawerText[String] 筛选文案

		default: ''
		
	~ @tabs[Array] tab页(写上相关参数，直接展示，没有默认不显示)

	~ @subTabs[Boolean] tab是否平分

		default: false

	~ @defaultActiveTab[Number] 默认tab页

		default: 0

	为了适配界面需要的

	~ @param[String] 列表的样式

		default: 'bg-white'

	~ @reduceHeight[Number] 列表需要减少高度（为了让下拉loading展示出来）

	~ @noDataVisible[Boolean] 是否展示没有数据时的占位图
		
		default: true
		
	~ @moreOffsetTop[Number || String] "没有更多"的距离高度
		
		default: 0
		
	~ @listScrollTop[String || Number] 列表据顶部距离

方法
~@functions

	~@updateResult 更新列表
	
		result [data]

	~@searchFocus 搜索框失去焦点触发
		
		result [keywords]
	
	~@searchBlur 搜索获得焦点触发
	
		result [keywords]
	
	~@searchConfirm 搜索确认按键触发
	
		result [keywords]
	
	~@showDrawer 展示筛选回调
	
	~@tabSelect tab切换回调
	
	~@updateTabs 更新tab
	
	