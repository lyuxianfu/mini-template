export default {
	example: {
		getList(data) {
			return new Promise(resolve=>{
				if(data.page === 1){
					setTimeout(()=>{
						resolve({
							result:[
								{name: 'stathan', age: 21},
								{name: 'stathan1', age: 22},
								{name: 'stathan2', age: 23},
								{name: 'stathan3', age: 24},
								{name: 'stathan4', age: 25},
								{name: 'stathan5', age: 26},
								{name: 'stathan5', age: 26},
								{name: 'stathan5', age: 26},
								{name: 'stathan5', age: 26},
								{name: 'stathan5', age: 26},
							],
							totalcount: 13
						})
					}, 500)
				}
				if(data.page === 2){
					setTimeout(()=>{
						resolve({
							result:[
								{name: 'bob', age: 21},
								{name: 'bob', age: 22},
								{name: 'bob', age: 23},
							],
							totalcount: 13
						})
					}, 500)
				}
			})
		}
	}
}