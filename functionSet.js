(function() {

	function now() {
		return new Date().getTime();
	}

	function today(format) {
		return someday(0, format);
	}

	function getDate(APIname,delta,format){
		
		var date = new Date();
		date["set"+APIname].call(date,date["get"+APIname] + delta);
		var arr = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
		return arr.join(format ? format : "/");
	}
	function someday(delta, format) {
		return getDate("Date",delta,format);
	}

	function someMonth(delta, format) {
		return getDate("Month",delta,format);
	}
	function someYear(delta, format) {
		return getDate("FullYear",delta,format);
	}

	function random(from, to, onlyInt) {
		var digit = from + Math.random() * (to - from);
		onlyInt && (digit = digit.toFixed(0));
		return digit;
	}
	function deleteTag(str){
		return str.replace(/<\/?[\s\S]*?>/,"");
	}

	function Drawselect(data,config){
		var selectTpl="<select id='@id' class='@class'>@content</select>";
		var optionTpl="<option value='@value'>@name</option>";
		var index=0;
		var returnStr="";
		var len=data.length;
		while(index<len){
			returnStr+=optionTpl.replace(/@value/,data[index]).replace(/@name/,data[index]);
			index++;
		}

		config && (returnStr=selectTpl.replace(/@id/,config.id ? config.id : "").replace(/@class/,config.class ? config.class : "").replace(/@content/,returnStr));

		return returnStr;
	}

	function  factorial(num){
		num=Number.isInteger(num)?num:Math.floor(num)
		if ( num == 1 ) {
			return 1 
		}
		
		var value=num*factorial(num-1);

		
		if(value<=Number.MAX_VALUE)

		{
			return value;
		}
		else{
			console.log(num)

			throw new Error("value error")
		}
	}

	function transferChar(char){
		if(char.charCodeAt(0)>=65 && char.charCodeAt(0)<=90){
			return char.toLowerCase()
		}
		else if(char.charCodeAt(0)>=90 && char.charCodeAt(0)<=122){
			return char.toUpperCase();
		}
	}

	function splitWord(str){
		if(Object.prototype.toString.call(str)!="[object String]"){
			return;
		}
		str=str.replace(/^\s*/,"").replace(/\s*$/,"");
		var result=[]
		var index=0;
		var state=0;
		var len=str.length;
		for(var i=0;i<len;i++){
			result[index] || (result[index]='');
			if(!/\s/.test(str[i])){
			result[index]+=str[i];//transferChar(str[i]);
			state=0;
			continue;
			}
			if(state==0){
				index++;
			}
			state=1
		}
		return result;//.reverse();
	}

	var cache={}
	
	function sort(tree,parent){
		parent===undefined && (parent=0);
		$.each(tree,function(index,value){
			cache[value.id]=value;
			cache[value.id].parent=parent;
			sort(value.children?value.children:[],value.id);
			//value.children=[]

		})
	}
	this.ZYM = {
		now: now,
		someday: someday,
		someMonth:someMonth,
		someYear:someYear,
		today: today,
		random: random,
		deleteTag:deleteTag,
		Drawselect:Drawselect,
		factorial:factorial,
		transferChar:transferChar,
		splitWord:splitWord,
		sort:sort,
		cache:cache
	};


}).call(this)