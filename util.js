~ function(root) {
	var previousUtils = root.utils;
	var utils = {};
	var version = '0.1';
	var slice = Array.prototype.slice;
	var toString = Object.prototype.toString;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var isSomeTypeMap = ['Function', 'Array', 'Object', 'Arguments', 'String', 'Null', 'Number', 'Boolean', 'Undefined'];
	utils.cache = {};
	for (var index = 0, len = isSomeTypeMap.length; index < len; index++) {
		var currentType = isSomeTypeMap[index];
		utils['is' + currentType] = (function(type) {
			return function() {
				var args = utils.slice(arguments);
				var len = args.length;
				if(len === 0) {
					return;
				}
				else if (len === 1) {
					return toString.call(arguments[0]) === '[object ' + type + ']';
				}
				else {
					for (var index = 0;index<len;index++) {
						if(toString.call(args[index]) !== '[object ' + type + ']') {
							return false;
						}
					}
					return true;
				}
				
			}
		})(currentType)
	}
	utils.isArrayLike = function(obj) {
		if (!obj.length) {
			return false;
		}

		// var index = obj.length - 1;
		// while (index >= 0) {
		// 	if (!obj[index--]) {
		// 		return false;
		// 	}
		// }
		var type = toString.call(obj);
		if(type === '[object Array]' || type === '[object Arguments]') {
			return true;
		}
		else {
			return false;
		}
	}

	utils.slice = function(arr, start, end) {
		if (!utils.isArrayLike(arr) || end === 0) return [];
		return slice.call(arr, start || 0, end || arr.length);
	}

	utils.noConflict = function() {
		root.utils = previousUtils;
		return this;
	};

	utils.after = function(willExecuteFun, delta, context) {
		var self = this;
		return function() {
			var args = utils.slice(arguments);
			setTimeout(function() {
				willExecuteFun.apply(context || self, args);
			}, delta || 0);
		}
	};
	
	utils.times = function(fun, times, context) {
		return function() {
			if (times-- <= 0) return;
			fun.apply(context, utils.slice(arguments));
		}
	}

	utils.data = function(key, value, overwrite) {

		var argLen = utils.slice(arguments).length;

		if (argLen === 0) {
			return utils.cache;
		} else if (!utils.isString(key)) {
			return false;
		} else if (argLen === 1) {
			return utils.cache[key];
		} else {
			if (!overwrite && utils.cache[key]) return utils.cache[key];
			return utils.cache[key] = value;
		}
	}

	

	utils.shellSort = function(arr) {
		var step = 5;
		while (step > 0) {
			for (var i = step; i < arr.length; i++) {
				var j = i - step;
				var key = arr[i];
				while (j >= 0 && key < arr[j]) {
					arr[j + step] = arr[j];
					j -= step;
				}
				arr[j + step] = key;
			}
			step = Math.floor(step / 2);
		}
		return arr;
	}


	utils.quickSort = function(arr, start, end) {
		var target = arr[start];
		var i = start + 1;
		var j = end;
		var index = start;
		if (start >= end) {
			return;
		}
		while (i <= j) {

			while (i <= j && arr[j] > target) {
				j--;
			}
			if (i <= j) {
				arr[index] = arr[j];
				index = j--;
			}
			while (i <= j && arr[i] < target) {
				i++;
			}
			if (i <= j) {
				arr[index] = arr[i];
				index = i++;
			}

		}
		arr[index] = target;
		quickSort(arr, start, index - 1);
		quickSort(arr, index + 1, end);
	}

	utils.now = function now() {
		return (Date.now && Date.now()) || new Date().getTime();
	}

	utils.today = function(format) {
		return utils.someday(0, format);
	}

	utils.getDate = function(APIname, delta, format) {
		var date = new Date();
		date["set" + APIname].call(date, date["get" + APIname]() + delta);
		var arr = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
		return arr.join(format ? format : "/");
	}
	utils.someday = function(delta, format) {
		return utils.getDate("Date", delta, format);
	}

	utils.someMonth = function(delta, format) {
		return utils.getDate("Month", delta, format);
	}
	utils.someYear = function(delta, format) {
		return utils.getDate("FullYear", delta, format);
	}

	utils.random = function(from, to, onlyInt) {
		if (utils.slice(arguments).length === 0) return Math.random();
		from = from || 0;
		to = to || Number.MAX_SAFE_INTEGER;
		var digit = from + Math.random() * (to - from);
		onlyInt && (digit = ~~digit); //.toFixed(0)
		return digit;
	}

	utils.randomNumbers = function(count, start, stop, onlyInt) {
		if (utils.isNumber(count)) return [];
		var result = [];
		for (var i = 0; i < count; i++) {
			result.push(utils.random(start, stop, onlyInt))
		}
		return result;
	}

	utils.Drawselect = function(data, config) {
		var selectTpl = "<select id='@id' class='@class'>@content</select>";
		var optionTpl = "<option value='@value'>@name</option>";
		var index = 0;
		var returnStr = "";
		var len = data.length;
		while (index < len) {
			returnStr += optionTpl.replace(/@value/, data[index]).replace(/@name/, data[index]);
			index++;
		}
		config.id = config.id || "";
		config.class = config.class || "";
		returnStr = selectTpl.replace(/@id/, config.id).replace(/@class/, config.class).replace(/@content/, returnStr);
		return returnStr;
	}

	utils.splitWord = function(str) {
		if (utils.isString(str)) {
			return;
		}
		str = str.replace(/^\s*/, "").replace(/\s*$/, "");
		var result = [];
		var index = 0;
		var state = 0;
		var len = str.length;
		for (var i = 0; i < len; i++) {
			(result[index] === undefined) || (result[index] = '');
			if (!/\s/.test(str[i])) {
				result[index] += str[i]; //transferChar(str[i]);
				state = 0;
				continue;
			}
			if (state == 0) {
				index++;
				state = 1;
			}
		}
		return result; //.reverse();
	}

	utils.range = function(start, stop, step) {
		if (!utils.isNumber(start) || !utils.isNumber(stop)) return;
		if (!utils.isNumber(step) || step === 0) {
			step = 1;
		}
		var result = [start];
		while (start + step <= stop) {
			start = start + step
			result.push(start)
		}
		return result;
	}

	utils.curring = function(fn) {
		if (utils.isFunction(fn)) return;
		var len = fn.length;
		var args = utils.slice(arguments, 1);
		return function() {
			if (arguments.length == 0) {
				len === args.length ? fn.apply(null, args) : fn(args); //fn.apply({},args)//fn(args)也可以，但传入的函数需要有一个参数接受args变量
			} else {
				args = args.concat(utils.slice(arguments));
				return arguments.callee
			}
		}

	}

	utils.uncurring = function() {
		return arguments.length && 　Function.prototype.call.bind(arguments[0]);
	}

	utils.keys = function(obj) {
		if (!utils.isObject(obj)) return;
		if (Object.keys) {
			return Object.keys(obj);
		} else {
			var result = [];
			var index = 0;
			for (var key in obj) {
				hasOwnProperty.call(obj, key) && (result[index++] = obj[key]);
			}
			return result;
		}
	}

	
	utils.flatten =function(arg,overwrite) {
		if (utils.isArray(arg)) {
			return flattenArray(arg);
		}
		else {
			return flattenObject(arg,overwrite);
		}
	}

	utils.flattenArray = function(arr) {
		var result = [];
		var len = arr.length;
		var index = 0;
		var position = 0;
		for (;index<len;index++) {
			var value = arr[index];
			if (utils.isArray(value)) {
				var tmp = utils.flattenArray(value);
				var _len = tmp.length;
				var _index = 0;
				while (_index<_len) {
					result[position++] = tmp[_index++];
				}
			}
			else{
				result[position++] = value;
			}
		}
		return result;
	}

	utils.flattenObject = function(obj, overwrite) { //键值越前越深就可能会被后面的覆盖
		if (!utils.isObject(obj)) {
			return;
		}
		var keys = utils.keys(obj);
		var len = keys.length;
		var result = {};
		for (var index = 0; index < len; index++) {
			var value = obj[keys[index]];
			if (utils.isObject(value)) {
				var ret = utils.flatten(value, overwrite);
				var _keys = utils.keys(ret);
				var _len = _keys.length;
				for (var _index = 0; _index < _len; _index++) {
					var _key = _keys[_index];
					(result[_key] && !overwrite) || (result[_key] = ret[_key]);
				}
			} else {
				(result[keys[index]] && !overwrite) || (result[keys[index]] = value);
			}
		}
		return result;
	}

	utils.max = utils.best = function(set,getVal,comparison) {
        if(!set || !set.length) return false;
        return utils.creator(set,getVal,comparison,'max');
    }

    utils.min = utils.worse = function(set,getVal,comparison) {
        if(!set || !set.length) return false;
        return utils.creator(set,getVal,comparison,'min');
    }

    utils.creator = function(set,getVal,comparison,type) {

        var ret = function(first,second,_type) {
            if(_type==='max') {
                return first>second ? first:second;
            }
            else {
                return first>second ? second : first;
            }
        }
        getVal || (getVal = function(value) { return value;});
        comparison || (comparison = function(first,second) {return ret(first,second,type);})
        var tmp = set[0];
        var first;
        var second;
        var current;
        for(var index=1;index<set.length;index++) {
            first = getVal(tmp);
            second = getVal(set[index]);
            tmp = (comparison(first,second) === first) ? tmp : set[index];
        }
        return tmp;
    }

    utils.topN = function(arr,n) {
        if(!arr) {
            return false;
        }
        if (!n) {
            return;
        }
        return utils.creatorN(arr,n,'top');
    }

    utils.bottomN = function(arr,n) {
        return utils.creatorN(arr,n,'bottom');
    }

    utils.creatorN = function(arr,n,type) {
        var result = utils.shellSort(arr);
        return type==='top' ? result.slice(0,n) : result.slice(arr.length-n);
    }

    utils.uid = function() {
    	return utils.cache['_uid'] = ~~utils.cache['_uid'] + 1;
	}

	utils.execute = function(fun,context) {
		var args = utils.slice(arguments);
		var result =  utils.isFunction(fun) && fun.apply(context,args);
		while (utils.isFunction(result)) {
			result = result.apply(context,args);
		}
		return result;
	}

	utils.validate = function(config) {
        var validateRules = {
            config: null,
            notEmpty: function(target) {
                return !(target.val() === '');
            },
            customize: function(target,rule) {
                return rule.test(target.val());
            },
            check: function(type,target,rule) {
                return this[type](target,rule);
            },
            validate: function() {
                var flag = true;
                var self = this;
                $(this.config).each(function(index,obj) {
                    flag = self.check(obj.type,obj.element,obj.rule?obj.rule:undefined);
                    if(!flag) {
                        alert(obj.errorMsg);
                        return false
                    }
                });
                return flag;
            },
            setConfig: function(config) {
                this.config = config;
                return this;
            }
        }
        return validateRules.setConfig(config).validate();
    }

	utils.inherit = function(children,parent) {
        function F() {}
        F.prototype = parent.prototype;
        children.prototype = new F();
        children.prototype.constructor = children;
        F.prototype = null;
    }

    utils.fixComma = function(str) {
        return str.replace(/[\uff0c]/g, ",").replace(/^\s*/,'').replace(/\s*$/,'');
    }


    utils.default = function(defaults) {
    	return function(obj) {
    		var result = {};
    		for(var key in obj) {
    			if (hasOwnProperty.call(obj,key)) {
    				result[key] = obj[key] || defaults[key];
    			}
    		}
    		return result;
    	}
    }

    utils.checker = function(check) {
    	return function(obj) {
    		for(var key in obj) {
    			if (hasOwnProperty.call(obj,key) && !check(obj[key])) {
    				return {key:key,value:obj[key]};
    			}
    		}
    		return true;
    	}
    }

    utils.each = function(obj,iterator,context) {
    	for (var index = 0;index<obj.length;index++) {
    		if(iterator.call(context,obj[index],index,obj)===false) {
    			return;
    		}
    	}
    }
    var operators = [{key:'add',operator:'+'},{key:'sub',operator:'-'},{key:'mul',operator:'*'},{key:'div',operator:'/'}];

    utils.each(operators,function(obj,index,ignore) {
    	this[obj['key']] = function(arr,userDefined) {
    		if(!utils.isArray(arr) || arr.length===0) {
    			return;
    		}
    		
    		var first;
    		var result = arr[0];
    		var operator = new Function('first','second','return first' + obj['operator'] +'second;')
    		for (var index = 1;index<arr.length;index++) {
    			var first = result;
    			var second = arr[index];
    			result = utils.isFunction(userDefined) ? userDefined(first,second) : operator(first,second);
    		}
    		return result;
	    	
    	}
    },utils);	

    utils.isInteger = Number.isInteger || function(digit) {
    	return digit === (digit>>0);
    }

    utils.toInteger = function(digit) {
    	return ~~digit;
    }

    var regCfg = [{key:'isNdigit',value: '\\d'},{key: 'isNstring',value: '\\w'}];
    utils.each(regCfg,function(value,index,arr) {
    	this[value['key']] = function(str,from,to) {
    		var len = utils.slice(arguments).length;
    		var count;
	    	if (len === 1) {
	    		count = '+';
	    	}
	    	else if (len === 2) {
	    		count = '{'+ from +',}';
	    	}
	    	else if (len > 2){
	    		count = '{'+ ~~from +','+ ~~to +'}';
	    	}
	    	var regexp = new RegExp('^'+ value['value'] + count +'$');//用RegExp创建正则表达式的时候，字符串里的斜杠是转义的意思，直接写正则字面量的时候斜杠代表自己
	    	return regexp.test(str);
    	}
    },utils);
    
    var _arrayEqual = function(source,dest) {
    	
    	var len = utils.max([source.length,dest.length]);
    	for (var index = 0;index < len; index++) {
    		if(utils.isArray(source[index],dest[index])) {
    			if (!_arrayEqual(source[index],dest[index])) {
    				return false;
    			}
    		}
    		else if (source[index] !== dest[index]){
    			return false;
    		}
    	}
    	return true;
    }

    var _objectEqual = function(source,dest) {
    	for (var key in source) {
    		if (!hasOwnProperty.call(source,key)) continue;
    		if(utils.isObject(source[key],dest[key])) {
    			if (!_objectEqual(source[key],dest[key])) {
    				return false;
    			}
    		}
    		else if (source[key] !== dest[key]){
    			return false;
    		}
    	}
    	return true;
    }
    //utils.isEqual({a:1,b:2,c:{a:1,b:2,c:{a:1,b:2,c:{a:1,b:2,c:{a:1,b:2,c:3}}}}},{a:1,b:2,c:{a:1,b:2,c:{a:1,b:2,c:{a:1,b:2,c:{a:1,b:2,c:3}}}}},true)
//utils.isEqual([[1],[2],[3],[1],[2],[3,[1],[2],[3,[1],[2],[3,[[1],[2],[3],[1],[2],[3,[1],[2],[3,[1],[2],[3]]]]]]]],[[1],[2],[3],[1],[2],[3,[1],[2],[3,[1],[2],[3,[[1],[2],[3],[1],[2],[3,[1],[2],[3,[1],[2],[3]]]]]]]],true)
    var _arrayEqual = function(source,dest) {
    	
    	var len = utils.max([source.length,dest.length]);
    	for (var index = 0;index < len; index++) {
    		if(utils.isArray(source[index],dest[index])) {
    			if (!_arrayEqual(source[index],dest[index])) {
    				return false;
    			}
    		}
    		else if (source[index] !== dest[index]){
    			return false;
    		}
    	}
    	return true;
    }

    utils.isEqual = function(source,dest,isDeep) {

    	isDeep = isDeep || false;
    	if (isDeep && utils.isArray(source,dest)) {
    		return _arrayEqual(source,dest);
    	}
    	else if (isDeep && utils.isObject(source,dest)) {
    		return _objectEqual(source,dest);
    	}
    	else {
    		return source === dest;
    	}
    }

    utils.isPrecision = function(str,n) {
    	var regexp = new RegExp(n ? '^\\d+\\.\\d{'+ n +'}$': '^\\d+$');
    	return regexp.test(str);
    }
    
    utils.isIp = function(str) {
    	return /^(([0-9]|[1-9][0-9]|1[0-9][0-9]|25[0-5]|2[0-4][0-9])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|25[0-5]|2[0-4][0-9])$/.test(str)
    }

    utils.constant = function(value) {
    	return function() {
    		return value;
    	}
    }

    utils.dataManager = function(_value) {
    	return {
	    		getter: function() {
	    	    		return _value;
	    	    },
	    	    setter: function(value,userDefined) {
	    	    	if (userDefined && utils.isFunction(userDefined)) {
	    	    		userDefined(_value,value);
	    	    	}
	    	    	else {
	    	    		_value = value;
	    	    	}
	    	    }
    	    }
    }

    utils.isReferenceType = function(obj) {
    	return utils.isFunction(obj) || typeof obj === 'object';
    }
    utils.isValueType = function(obj) {
    	return !utils.isReference(obj);
    }

    _arrClone = function(arr) {
    	var result = [];
    	for (var index = 0;index<arr.length;index++) {
    		if (utils.isArray(arr[index])){
    			result[index] = _arrClone(arr[index]);
    		}
    		else if(utils.isObject(arr[index])) {
    			result[index] = _objClone(arr[index]);
    		}
    		else {
    			result[index] = arr[index];
    		}
    	}
    	return result;
    }

    _objClone = function(obj) {
    	var _obj = {};
    	for (var key in obj) {
    		if (hasOwnProperty.call(obj,key)) {
    			if (utils.isArray(obj[key])) {
    				_obj[key] = _arrClone(obj[key]);
    			}
    			else if(utils.isObject(obj[key])) {
    				_obj[key] = _objClone(obj[key]);
    			}
    			else {
    				_obj[key] = obj[key];
    			}
    		}
    	}
    	return _obj;
    }
//复制的时候可以把属性值的描述符和访问符也复制过去，
    utils.clone =function(obj,isDeep) {
    	if (isDeep && utils.isObject(obj)) {
			return _objClone(obj);
		}
		else if (isDeep && utils.isArray(obj)) {
			return _arrClone(obj);
		}
		else {
			return obj;
		}
	}

    utils.flyWeight = function(obj) {
    	var uid = utils.uid();
    	for (var key in obj) {	
    		if(hasOwnProperty.call(obj,key)) {
    			Object.defineProperty(obj,key,{writable: false});
    		}
    	}
    	utils.cache[uid] = obj;
    	obj = null;
    	return {
    		get: (function(defaultUid){
    			return function(currentUid) {	
    				return utils.cache[currentUid || defaultUid];
	    		}
    		}(uid)),
    	}
    }

    utils.partial = function (fun,context) {
		var args = Array.prototype.slice.call(arguments,2);
		var len = fun.length;
		return function() {
			args = args.concat(Array.prototype.slice.call(arguments));
			if(args.length < len) {
				return arguments.callee;
			}
			return fun.apply(context,args);
		}
	}
	
	utils.pipe = function() {
		var args = utils.slice(arguments);
		var data = args[0];
		var rest = utils.slice(args,1);
		if (!utils.isFunction.apply(null,rest)) {
			return false;
		}
		var tmp;
		while (tmp = rest.shift()) {
			data = tmp(data);
		} 
		return data;
	}

	utils.lazyExecute = function() {
		var args = utils.slice(arguments);
		var data = args[0];
		var sets = utils.slice(args,1);
		return {
			execute: function() {
				sets.unshift(data);
				return utils.pipe.apply(null,sets);
			},

			add: function() {
				sets = sets.concat(utils.slice(arguments));
			}
		}

	}

	utils.counter = function() {
		var args = utils.slice(arguments);
		var len = args.length;
		if (len < 2) return;
		var todoList = utils.slice(args,0,len-1);
		var tag = args[len-1];
		var i = 0;
		console.time(tag);
		while (i<len-1) {
			todoList[i]();
			i++;
		}
		console.timeEnd(tag);
	}

	utils.getAsciiList = function(format) {
		var result = [];
		for (var i = 10;i<36;i++) {
			result.push(i.toString(36));
		}
		return utils.isString(format) ? result.join(format) : result;
	}

	utils.parseQueryStr = function(data) {
        var queryStr = data || location.search.replace(/\?/,'');
        if (!queryStr) return {};
        var result = {};
        var tmp;
        queryStr = queryStr.split('&');
        for (var i=0;i<queryStr.length;i++) {
            tmp = queryStr[i].split('=');
            result[tmp[0]] = tmp[1];
        }
        return result;
    }

	utils.makeQueryStr = function(data) {
        var result = [];
        for (var key in data) {
            result.push(key+'='+data[key]);
        }
        return result.join('&');
    }

    var deleteCreator = function(first,second,bool) {
    	var map = {};
        var firstResult = [];
        var secondResult = [];
        var result = [];
        for (var i = 0; i < first.length; i++) {
            map[first[i]] || (map[first[i]] = true);
        }
        for (var j = 0; j < second.length; j++) {
        	if (map[second[j]]) {
        		if (bool) {
	                delete map[second[j]];
	                second.splice(j,1);   
	                j--;
	            }
	            else {
	            	result.push(second[j]);
	            }
            }
        }
        if(!bool) {
        	return result;	
        }
	    first = Object.keys(map);
	    return [first,second];
	}

    

    utils.deleteDifferent = function(first,second) {
        return deleteCreator(first,second,0);
	}

	utils.deleteEqual = function(first,second) {
		return deleteCreator(first,second,1);
	}
	
	utils._countArray = function(target,position,fn) {
		var hash = {};
		var val;
		if (arguments.length >= 2 && utils.isFunction(arguments[1])) {
			fn = position;
			position = void 0;
		}
		for(var i = 0; i< target.length;i++) {
			val = fn ? fn(target[i],i) : target[i];
			if(!hash[val]) {
				hash[val] = {} ;
				hash[val]['count'] = 1;
				if (position) {
					hash[val]['position'] = [];
					hash[val]['position'].push(i);
				}
			}
			else {
				hash[val]['count']++;
				if (position) {
					hash[val]['position'].push(i);
				}
			}
		}
		return hash;
	}

	utils.isIn = function(first,second,isret) {

		var cache = {}

		for (var i = 0;i<first.length;i++) {
			cache[first[i]] = true;
		}
		var ret = [];
		for (var j=0;j<second.length;j++) {
			if(!cache[second[j]]) {
				if(isret) {
					ret.push(second[j]);
				}
				else {
					return false;
				}
			}
		}
		if(isret && ret.length>0) return ret;
		return true;
	}

	utils.countArray = function(target,position,fn) {
		var hash = {};
		var val;
		if (arguments.length >= 2 && utils.isFunction(arguments[1])) {
			fn = position;
			position = void 0;
		}
		for(var i = 0; i< target.length;i++) {
			val = fn ? fn(target[i],i) : target[i];
			if(!hash[val]) {
				if (position) {
					hash[val] = {} ;
					hash[val]['count'] = 1;
					hash[val]['position'] = [];
					hash[val]['position'].push(i);
				}
				else {
					hash[val] = 1;
				}
			}
			else {
				if (position) {
					hash[val]['count']++;
					hash[val]['position'].push(i);
				}
				else {
					hash[val]++;
				}
			}
		}
		return hash;
	}

	// utils.check = function(target) {
	// 	if (!/^[`~!@#$%^&*()-+\[\]|?';,.0-9a-zA-Z]{8,16}$/.test(target) || (/^[a-zA-Z]+$/.test(target) || /^[0-9]+$/.test(target) || /^[`~!@#$%^&*()-+\[\]|?';,.]+$/.test(target))) {
	// 		return false;
	// 	}
	// 	return true;
	// }

	// utils._check = function(target,obj,from,to) {
	// 	var map = {
	// 		mix: /^[`~!@#$%^&*()-+\[\]|?';,.0-9a-zA-Z]$/,
	// 		digit: /^[0-9]+$/,
	// 		alpha: /^[a-zA-Z]+$/
	// 	};
	// 	var _reg = [];
	// 	var result = '^[';
	// 	from = from || 0;
	// 	to = to || '';
		
	// 	for (var key in obj) {
	// 		result+=obj[key];
	// 		_reg.push(obj[key]);
	// 	}
	// 	result+=']{' + from + ',' + to +"}$"; 
	// 	//result = result.replace(/([\[\]])/g,'\\$1');
	// 	if (!new RegExp(result).test(target)) {
	// 		return false;
	// 	}
	// 	for(var _key=0;_key<_reg.length;_key++) {
	// 		if(new RegExp("^["+_reg[_key]+"]+$").test(target)) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }
    
	root.utils = utils;
}(self)
