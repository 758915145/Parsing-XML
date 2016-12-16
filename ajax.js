/**
 * ajax的简单封装
 * @param  {Object} obj 参数对象
 * @param  {Function} callback 回调函数
 * @example
 	//常用版
	ajax({
		url:'http://www.baidu.com/'
	},function(res){
		console.log(res);
	});

	//完整版
	ajax({
	    url:'http://www.baidu.com/',	//要请求的url
	    method:'GET',						//请求方式，默认为'GET'，可选参数：'GET'、'POST'等
		async:true,						//是否异步，默认为true
		formdata:false,					//是否使用FormData提交，默认为false
		responseType:'json',			//返回的格式，默认为json
	},function(res){
		console.log(res);
	});
 */
window.ajax = function(obj,callback){
	var xhr = __ajax__.xhr;
    var option = __ajax__.option;

	for(var key in option){
		if(!obj[key])
		obj[key] = option[key]
	}

	//设置一些参数 : method & url & 异步
	xhr.open(
		obj.method,
		obj.url,
		obj.async
	);

	//post需要设置这个东西，但是formdata的post不能设置这个东西
	if(obj.method==='POST'&&!obj.formdata)xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

	//发起请求 & 如果是post的话将data写到send里面 ( 和get一样的写法 )
	xhr.send(obj.data);
	xhr.responseType = obj.responseType;//需要放在send后面

	//响应时会自动调用onreadystatechange
	xhr.onreadystatechange = function(){
		//xhr.readyState : 0,1,2,3,4
		//xhr.status : 100,200,300,400,500
		if(xhr.readyState==4 && xhr.status==200){
			//返回的字符串或对象
			callback && callback(xhr.response);
		}
	}
};
//创建xhr对象
__ajax__ = {
    xhr:window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
    option:{
        method:'GET',
        async:true,
        formdata:false,
		responseType:'json'
    }
};
