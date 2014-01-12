/*
 * AppacitiveSDK.js v1.0 - Javascript SDK to integrate applictions using Appacitive
 * Copyright (c) 2013 Appacitive Software Pvt Ltd
 * MIT license  : http://www.apache.org/licenses/LICENSE-2.0.html
 * Project      : https://github.com/chiragsanghvi/JavascriptSDK
 * Contact      : support@appacitive.com | csanghvi@appacitive.com
 * Build time 	: Sun Dec 15 17:44:23 IST 2013
 */
"use strict";

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind= function(owner) {
        var that= this;
        if (arguments.length<=1) {
            return function() {
                return that.apply(owner, arguments);
            };
        } else {
            var args= Array.prototype.slice.call(arguments, 1);
            return function() {
                return that.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim= function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}


// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf= function(find, i /*opt*/) {
        if (i===undefined) i= this.length-1;
        if (i<0) i+= this.length;
        if (i>this.length-1) i= this.length-1;
        for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter= function(filter, that /*opt*/) {
        var other= [], v;
        for (var i=0, n= this.length; i<n; i++)
            if (i in this && filter.call(that, v= this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}
// Override only if native toISOString is not defined
if ( !Date.prototype.toISOString ) {
    ( function() {

        function pad(number) {
            var r = String(number);
            if ( r.length === 1 ) {
                r = '0' + r;
            }
            return r;
        }

        Date.prototype.toISOString = function() {
            return this.getUTCFullYear()
                + '-' + pad( this.getUTCMonth() + 1 )
                + '-' + pad( this.getUTCDate() )
                + 'T' + pad( this.getUTCHours() )
                + ':' + pad( this.getUTCMinutes() )
                + ':' + pad( this.getUTCSeconds() )
                + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                + 'Z';
        };

    }() );
};

String.addSlashes = function (str) {
    if (!str) return str;
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
};

String.stripSlashes = function (str) {
    if (!str) return str;
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
};

if (typeof console === 'undefined' || console === null) {
    console = { log: function() {}, dir: function() {} };
}

var _type = function (o) {

    // handle null in old IE
    if (o === null || typeof o === 'undefined' || o === 'undefined') {
        return 'null';
    }

    // handle DOM elements
    if (o && (o.nodeType === 1 || o.nodeType === 9)) {
        return 'element';
    }

    var s = Object.prototype.toString.call(o);
    var type = s.match(/\[object (.*?)\]/)[1].toLowerCase();

    // handle NaN and Infinity
    if (type === 'number') {
        if (isNaN(o)) {
            return 'nan';
        }
        if (!isFinite(o)) {
            return 'infinity';
        }
    }

    return type;
};

var types = [
    'Null',
    'Undefined',
    'Object',
    'Array',
    'String',
    'Number',
    'Boolean',
    'Function',
    'RegExp',
    'Element',
    'NaN',
    'Infinite'
];

var generateMethod = function (t) {
    _type['is' + t] = function (o) {
        return _type(o) === t.toLowerCase();
    };
};

for (var i = 0; i < types.length; i++) {
    generateMethod(types[i]);
}

_type['isNullOrUndefined'] = function(o) {
    return _type(o) == 'null' || _type(o) == 'undefined';
};

_type['isNumeric'] = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}// monolithic file

var global = {};

(function () {

	"use strict";

	// create the global object

	if (typeof window === 'undefined') {
        global = process;
    } else {
        global = window;
    }

	var _initialize = function () {
		var t;
		if (!global.Appacitive) {
			global.Appacitive = {
				runtime: {
					isNode: typeof process != typeof t,
					isBrowser: typeof window != typeof t
				}
			};
		}
	};
	_initialize();



	// httpBuffer class, stores a queue of the requests
	// and fires them. Global level pre and post processing 
	// goes here. 
	// requires httpTransport class that is able to actually 
	// send the request and receive the response
	/**
	 * @constructor
	 */
	var HttpBuffer = function (httpTransport) {

		// validate the httpTransport passed
		// and assign the callback
		if (!httpTransport || !httpTransport.send || !_type.isFunction(httpTransport.send)) {
			throw new Error('No applicable httpTransport class found');
		} else {
			httpTransport.onResponse = this.onResponse;
		}

		// internal handle to the http requests
		var _queue = [];

		// handle to the list of pre-processing functions
		var _preProcessors = {}, _preCount = 0;

		// handle to the list of post-processing functions
		var _postProcessors = {}, _postCount = 0;

		// public method to add a processor
		this.addProcessor = function (processor) {
			if (!processor) return;
			processor.pre = processor.pre || function () {};
			processor.post = processor.post || function () {};

			addPreprocessor(processor.pre);
			addPostprocessor(processor.post);
		};

		// stores a preprocessor
		// returns a numeric id that can be used to remove this processor
		var addPreprocessor = function (preprocessor) {
			_preCount += 1;
			_preProcessors[_preCount] = preprocessor;
			return _preCount;
		};

		// removes a preprocessor
		// returns true if it exists and has been removed successfully
		// else false
		var removePreprocessor = function (id) {
			if (_preProcessors[id]) {
				delete(_preProcessors[id]);
				return true;
			} else {
				return false;
			}
		};

		// stores a postprocessor
		// returns a numeric id that can be used to remove this processor
		var addPostprocessor = function (postprocessor) {
			_postCount += 1;
			_postProcessors[_postCount] = postprocessor;
			return _postCount;
		};

		// removes a postprocessor
		// returns true if it exists and has been removed successfully
		// else false
		var removePostprocessor = function (id) {
			if (_postProcessors[id]) {
				delete(_postProcessors[id]);
				return true;
			} else {
				return false;
			}
		};

		// enqueues a request in the queue
		// returns true is succesfully added
		this.enqueueRequest = function (request) {
			_queue.push(request);
		};


		this.changeRequestForCors = function(request) {
			var body = {
				m : request.method.toUpperCase()
			};
			request.headers.forEach(function(h) {
				body[h.key] = h.value;
			});
			request.prevHeaders = request.headers;
			request.headers = [];
			request.headers.push({ key:'Content-Type', value: 'text/plain' });
			request.method = 'POST';

			if (request.data) body.b = request.data;
			delete request.data;
			
			if (global.Appacitive.config.debug) {
				if (request.url.indexOf('?') === -1) request.url = request.url + '?debug=true';
				else request.url = request.url + '&debug=true';
			}

			try { request.data = JSON.stringify(body); } catch(e) {}
			return request;
		};

		// notifies the queue that there are requests pending
		// this will start firing the requests via the method 
		// passed while initalizing
		this.notify = function () {
			if (_queue.length === 0) return;

			// for convienience, extract the postprocessing object into an array
			var _callbacks = [];
			for (var processor in _postProcessors) {
				if (_postProcessors.hasOwnProperty(processor)) {
					_callbacks.push(_postProcessors[processor]);
				}
			}

			while (_queue.length > 0) {
				var toFire = _queue.shift();

				// execute the preprocessors
				// if they return anything, pass it along
				// to be able to access it in the post processing callbacks
				var _state = [];
				for (var processor in _preProcessors) {
					if (_preProcessors.hasOwnProperty(processor)) {
						_state.push(_preProcessors[processor](toFire));
					}
				}

				this.changeRequestForCors(toFire);

				// send the requests
				// and the callbacks and the 
				// results returned from the preprocessors
				httpTransport.send(toFire, _callbacks, _state);
			}
		};

		// callback to be invoked when a request has completed
		this.onResponse = function (responseData) {
			console.dir(responseData);
		};

	};

	// base httpTransport class
	/**
	 * @constructor
	 */
	var _HttpTransport = function () {
		var _notImplemented = function () {
			throw new Error('Not Implemented Exception');
		};
		var _notProvided = function () {
			throw new Error('Delegate not provided');
		};

		// implements this
		this.send = _notImplemented;
		this.inOnline = _notImplemented;

		// needs these callbacks to be set
		this.onResponse = function (response, request) {
			_notImplemented();
		};
		this.onError = function (request) {
			_notImplemented();
		};
	};

	// base xmlhttprequest class
	/**
	  * @constructor
	  */

	var _XMLHttpRequest = null;

	_XMLHttpRequest = (global.Appacitive.runtime.isBrowser) ?  XMLHttpRequest : require('xmlhttprequest-with-globalagent').XMLHttpRequest;

	var _XDomainRequest = function(request) {
		var promise = global.Appacitive.Promise.buildPromise({ success: request.onSuccess, error: request.onError });
		var xdr = new XDomainRequest();
	    xdr.onload = function() {
  			var response = xdr.responseText;
			try {
				var contentType = xdr.contentType;
				if (contentType.toLowerCase() == 'application/json' ||  contentType.toLowerCase() == 'application/javascript' || contentType.toLowerCase() == 'application/json; charset=utf-8' || contentType.toLowerCase() == 'application/json; charset=utf-8;') { 
					var jData = response;
					if (!global.Appacitive.runtime.isBrowser) {
						if (jData[0] != "{") {
							jData = jData.substr(1, jData.length - 1);
						}
					}
					response = JSON.parse(jData);
				}
			} catch(e) {}
            promise.fulfill(response, this);       
	    };
	    xdr.onerror = xdr.ontimeout = function() {
	       promise.reject(xdr);
	    };
	    xdr.onprogress = function() {};
	    if (request.url.indexOf('?') === -1)
            request.url = request.url + '?ua=ie';
        else
            request.url = request.url + '&ua=ie';

	    xdr.open(request.method, request.url, true);
	    xdr.send(request.data);
		return promise;
	};


	var _XMLHttp = function(request) {

		if (!request.url) throw new Error("Please specify request url");
		if (!request.method) request.method = 'GET' ;
		if (!request.headers) request.headers = [];
		var data = {};

		var promise = global.Appacitive.Promise.buildPromise({ success: request.onSuccess, error: request.onError });
		
		var doNotStringify = true;
		request.headers.forEach(function(r){
			if (r.key.toLowerCase() == 'content-type') {
				doNotStringify = true;
				if (r.value.toLowerCase() == 'application/json' || r.value.toLowerCase() == "application/javascript" || r.value.toLowerCase() == 'application/json; charset=utf-8' || r.value.toLowerCase() == 'application/json; charset=utf-8;') {
					doNotStringify = false;
				}
			}
		});


		if (doNotStringify) data = request.data;
		else {
			if (request.data) { 
				data = request.data;
				if (_type.isObject(request.data)) {
					try { data = JSON.stringify(data); } catch(e) {}
				}
			}
		}

		if (!request.onSuccess || !_type.isFunction(request.onSuccess)) request.onSuccess = function() {};
	    if (!request.onError || !_type.isFunction(request.onError)) request.onError = function() {};
	    
	    if (global.navigator && (global.navigator.userAgent.indexOf('MSIE 8') != -1 || global.navigator.userAgent.indexOf('MSIE 9') != -1)) {
	    	request.data = data;
			var xdr = new _XDomainRequest(request);
			return xdr;
	    } else {
		    var xhr = new _XMLHttpRequest();
		    xhr.onreadystatechange = function() {
		    	if (this.readyState == 4) {
			    	if ((this.status >= 200 && this.status < 300) || this.status == 304) {
						var response = this.responseText;
						try {
							var contentType = this.getResponseHeader('content-type') || this.getResponseHeader('Content-Type');
							if (contentType.toLowerCase() == 'application/json' ||  contentType.toLowerCase() == 'application/javascript' || contentType.toLowerCase() == 'application/json; charset=utf-8' || contentType.toLowerCase() == 'application/json; charset=utf-8;') { 
								var jData = response;
								if (!global.Appacitive.runtime.isBrowser) {
									if (jData[0] != "{") {
										jData = jData.substr(1, jData.length - 1);
									}
								}
								response = JSON.parse(jData);
							}
						} catch(e) {}
			            promise.fulfill(response, this);
			        } else {
			        	promise.reject(this.responseText, this);
			        }
		    	}
		    };
		    xhr.open(request.method, request.url, true);

		    for (var x = 0; x < request.headers.length; x += 1)
				xhr.setRequestHeader(request.headers[x].key, request.headers[x].value);
			
			if (!global.Appacitive.runtime.isBrowser)
				xhr.setRequestHeader('User-Agent', 'Appacitive-NodeJSSDK'); 
		    
		    xhr.send(data);

		    return promise;
		}
	};


	// httpRequest class, encapsulates the request 
	// without bothering about how it is going to be fired.
	/**
	 * @constructor
	 */
	var HttpRequest = function (o) {
		o = o || {};
		this.url = o.url || '';
		this.data = o.data || {};
		this.headers = o.headers || [];
		this.method = o.method || 'GET';
		this.onSuccess = o.onSuccess || function(){};
		this.onError = o.onError || function(){};

		this.send = function(doNotStringify) {
			return new _XMLHttp(this, doNotStringify);
		};
	};

	// browser based http transport class
	/**
	 * @constructor
	 */
	var BasicHttpTransport = function () {

		var _super = new _HttpTransport();

		_super.isOnline = function () { return true; };

		var _executeCallbacks = function (response, callbacks, states) {
			if (callbacks.length != states.length) {
				throw new Error('Callback length and state length mismatch!');
			}
			for (var x = 0; x < callbacks.length; x += 1) {
				callbacks[x].apply({}, [response, states[x]]);
			}
		};

		var that = _super;

		var _trigger = function(request, callbacks, states) {
			new  _XMLHttp({
				method: request.method,
				url: request.url,
				headers: request.headers,
				data: request.data,
				onSuccess: function(data, xhr) {
					if (!data) {
					 	that.onError(request, { responseText: JSON.stringify({ code:'400', message: 'Invalid request' }) });
						return;
					}
					try { data = JSON.parse(data);} catch(e) {}
					// execute the callbacks first
					_executeCallbacks(data, callbacks, states);

					if ((data.code >= '200' && data.code <= '300') || (data.status && data.status.code >= '200' && data.status.code <= '300')) {
						that.onResponse(request, data);
					} else {
						data = data || {};
						data = data.status || data;
						data.message = data.message || 'Bad Request';
						data.code = data.code || '400';
						that.onError(request, { responseText: JSON.stringify(data) });
					}
				},
				onError: function(xhr) {
					that.onError(request, xhr);
				}
			});
		};

		_super.send = function (request, callbacks, states) {
			if (!global.Appacitive.Session.initialized) throw new Error("Initialize Appacitive SDK");
			if (_type.isFunction(request.beforeSend)) {
				request.beforeSend(request);
			}
			_trigger(request, callbacks, states);
		};

		return _super;
	};

	// http functionality provider
	/**
	 * @constructor
	 */
	var HttpProvider = function () {

		// actual http provider
		//var _inner = global.Appacitive.runtime.isBrowser ? new JQueryHttpTransport() : new NodeHttpTransport();
		var _inner = new BasicHttpTransport();

		// the http buffer
		var _buffer = new HttpBuffer(_inner);

		// used to pause/unpause the provider
		var _paused = false;

		// allow pausing/unpausing
		this.pause = function () {
			_paused = true;
		};

		this.unpause = function () {
			_paused = false;
		};

		// allow adding processors to the buffer
		this.addProcessor = function (processor) {
			var _processorError = new Error('Must provide a processor object with either a "pre" function or a "post" function.');
			if (!processor) throw _processorError;
			if (!processor.pre && !processor.post) throw _processorError;

			_buffer.addProcessor(processor);
		};

		// the method used to send the requests
		this.send = function (request) {
			
			request.promise = (global.Appacitive.Promise.is(request.promise)) ? request.promise : new global.Appacitive.Promise.buildPromise({ error: request.onError });

			_buffer.enqueueRequest(request);

			// notify the queue if the actual transport 
			// is ready to send the requests
			if (_inner.isOnline() && _paused === false) {
				_buffer.notify();
			}
			
			return request.promise;
		};

		// method used to clear the queue
		this.flush = function (force) {
			if (!force) {
				if (_inner.isOnline()) {
					_buffer.notify();
				}
			} else {
				_buffer.notify();
			}
		};

		// the error handler
		this.onError = function (request, response) {
			var error;
		    if (response && response.responseText) {
		        try {
		          var errorJSON = JSON.parse(response.responseText);
		          if (errorJSON) {
		            error = { code: errorJSON.code, error: errorJSON.message };
		          }
		        } catch (e) {}
		    }

		    error = error || { code: response.status, message: response.responseText };
		    global.Appacitive.logs.logRequest(request, error, error, 'error');
		    request.promise.reject(error, request.entity);
		};
		_inner.onError = this.onError;

		// the success handler
		this.onResponse = function (request, response) {
			if (request.onSuccess) {
				if (request.context) {
					request.onSuccess.apply(request.context, [response]);
				} else {
					request.onSuccess(response);
				}
			}
			global.Appacitive.logs.logRequest(request, response, response ? response.status : null, 'successful');
		};
		_inner.onResponse = this.onResponse;
	};

	// create the http provider and the request
	global.Appacitive.http = new HttpProvider();
	global.Appacitive.HttpRequest = HttpRequest;

	/* PLUGIN: Http Utilities */

	// compulsory plugin
	// handles session and shits
	(function (global) {

		if (!global.Appacitive) return;
		if (!global.Appacitive.http) return;

		global.Appacitive.http.addProcessor({
			pre: function (request) {
				return request;
			},
			post: function (response, request) {
				try {
					var _valid = global.Appacitive.Session.isSessionValid(response);
					if (!_valid.status) {
						if (_valid.isSession) {
							if (global.Appacitive.Session.get() !== null) {
								global.Appacitive.Session.resetSession();
							}
							global.Appacitive.http.send(request);
						}
					} else {
						if (response && ((response.status && response.status.code && response.status.code == '19036') || (response.code &&response.code == '19036'))) {
							global.Appacitive.Users.logout();
						} else {
							global.Appacitive.Session.incrementExpiry();
						}
					}
				} catch(e){}
			}
		});

		global.Appacitive.http.addProcessor({
			pre: function (req) {
				return { start: new Date().getTime(), request: req };
			},
			post: function (response, args) {
				args.request.timeTakenInMilliseconds = new Date().getTime() - args.start;
			}
		});

	})(global);

	/* Http Utilities */

})(this);
(function(global) {

    "use strict";

    global.Appacitive.logs = [];

    global.Appacitive.logs.errors = [];

    global.Appacitive.logs.exceptions = []; 

	global.Appacitive.logs.logRequest = function(request, response, status, type) {
		if (global.Appacitive.log) {
			response = response || {};
			status = status || {};
			var body = JSON.parse(request.data);
	    	var log = {
	    		status: type,
	    		referenceId: status.referenceid,
	    		date: new Date().toISOString(),
	    		method: body['m'],
	    		url: request.url,
	    		responseTime : request.timeTakenInMilliseconds,
	    		headers: {},
	    		request: null,
	    		response: response
			};

			if (request.headers) {
				request.headers.forEach(function(h) {
					log.headers[h.key] = h.value;
				});
			}

			if (request.prevHeaders) {
				request.prevHeaders.forEach(function(h) {
					log.headers[h.key] = h.value;
				});
			}

			if (log.method !== 'GET') {
		    	log.request = body['b'];
		    }
	    	
	    	if (type == 'error') {
	    		console.dir(log);
	    		this.errors.push(log);
		    }
		    this.push(log);
	    }
	};    

	var getLogs = function(log, method) {
		var logs = [];
		log.forEach(function(l) { if (l.method == method) logs.push(l); });
		return logs;
	};

	global.Appacitive.logs.getPutLogs = function() { return getLogs(this, 'PUT'); };

	global.Appacitive.logs.getGetLogs = function() { return getLogs(this, 'GET'); };

	global.Appacitive.logs.getPostLogs = function() { return getLogs(this, 'POST'); };

	global.Appacitive.logs.getDeleteLogs = function() { return getLogs(this, 'DELETE'); };

})(global);(function (global) {

    "use strict";

    /**
     * @param {...string} var_args
     */
    String.format = function (text, var_args) {
        if (arguments.length <= 1) {
            return text;
        }
        var tokenCount = arguments.length - 2;
        for (var token = 0; token <= tokenCount; token++) {
            //iterate through the tokens and replace their placeholders from the original text in order
            text = text.replace(new RegExp("\\{" + token + "\\}", "gi"),
                                                arguments[token + 1]);
        }
        return text;
    };
    String.prototype.toPascalCase = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    String.prototype.trimChar = function (char1) {
        var pattern = new RegExp("^" + char1);
        var returnStr = this;
        if (pattern.test(returnStr)) returnStr = returnStr.slice(1, returnStr.length);
        pattern = new RegExp(char1 + "$");
        if (pattern.test(returnStr)) returnStr = returnStr.slice(0, -1);
        return returnStr;
    };
    String.toSearchString = function (text) {
        if (typeof (text) === 'undefined')
            text = '';

        var result = '';
        for (var x = 0; x < text.length; x = x + 1) {
            if (' .,;#'.indexOf(text[x]) === -1)
                result += text[x];
        }

        result = result.toLowerCase();

        return result;
    };

    String.contains = function (s1, s2) {
        return (s1.indexOf(s2) !== -1);
    };

    String.startsWith = function (s1, s2) {
        return (s1.indexOf(s2) === 0);
    };

    Array.distinct = function(orgArr) {
        var newArr = [],
            origLen = orgArr.length,
            found,
            x, y;
            
        for ( x = 0; x < origLen; x++ ) {
            found = undefined;
            for ( y = 0; y < newArr.length; y++ ) {
                if ( orgArr[x].toLowerCase() === newArr[y].toLowerCase() ) { 
                  found = true;
                  break;
                }
            }
            if (!found) newArr.push(orgArr[x]);    
        }
       return newArr;
    };

    Object.isEmpty = function (object) {
        if(!object) return true;
        var isEmpty = true;
        for (var keys in object) {
            isEmpty = false; 
            break; // exiting since we found that the object is not empty
        }
        return isEmpty;
    };

    global.dateFromWcf = function (input, throwOnInvalidInput) {
        var pattern = /Date\(([^)]+)\)/;
        var results = pattern.exec(input);
        if (results.length != 2) {
            if (!throwOnInvalidInput) {
                return s;
            }
            throw new Error(s + " is not .net json date.");
        }
        return new Date(parseFloat(results[1]));
    };

    /**
     * @constructor
     */
    var UrlFactory = function () {

        global.Appacitive.bag = global.Appacitive.bag || {};
        
        var baseUrl = (global.Appacitive.config || { apiBaseUrl: '' }).apiBaseUrl;
        
        var _getFields = function(fields) {
            if (typeof fields === 'object' && fields.length > 0 && (typeof fields[0] === 'string' || typeof fields[0] === 'number')) fields = fields.join(',');
            if (!fields) fields = '';
            return fields;
        };

        this.application = {
            applicationServiceUrl : 'application',

            getSessionCreateUrl: function() {
                return String.format("{0}/session", this.applicationServiceUrl);
            }
        };

        this.email = {
            emailServiceUrl: 'email',
            
            getSendEmailUrl: function() {
                return String.format("{0}/send", this.emailServiceUrl);
            }
        };
        this.user = {

            userServiceUrl:  'user',

            getCreateUrl: function (type, fields) {
                return String.format("{0}/create?fields={1}", this.userServiceUrl, _getFields(fields));
            },
            getAuthenticateUserUrl: function () {
                return String.format("{0}/authenticate", this.userServiceUrl);
            },
            getGetUrl: function (type, userId, fields) {
                return String.format("{0}/{1}?fields={2}", type, userId, _getFields(fields));
            },
            getUserByTokenUrl: function(userToken) {
                return String.format("{0}/me?useridtype=token&token={1}", this.userServiceUrl, userToken);
            },
            getUserByUsernameUrl: function(username) {
                return String.format("{0}/{1}?useridtype=username", this.userServiceUrl, username);
            },
            getUpdateUrl: function (userId, fields, revision) {
                if (!revision) {
                    return String.format("{0}/{1}?fields={2}", this.userServiceUrl, userId, _getFields(fields));
                } else {
                    return String.format("{0}/{1}?fields={2}&revision={3}", this.userServiceUrl, userId, _getFields(fields), revision);
                }
            },
            getDeleteUrl: function (type, userId, deleteConnections) {
                if (deleteConnections === true ) {
                    return String.format("{0}/{1}?deleteconnections=true", this.userServiceUrl, userId);
                } else {
                    return String.format("{0}/{1}", this.userServiceUrl, userId);
                }

            },
            getGetAllLinkedAccountsUrl: function(userId) {
                var url = String.format("{0}/{1}/linkedaccounts", this.userServiceUrl, userId);
                return url;
            },
            getValidateTokenUrl: function(token) {
                return String.format("{0}/validate?userToken={1}", this.userServiceUrl, token);
            },
            getInvalidateTokenUrl: function(token) {
                return String.format("{0}/invalidate?userToken={1}", this.userServiceUrl, token);
            },
            getSendResetPasswordEmailUrl: function() {
                return String.format("{0}/sendresetpasswordemail", this.userServiceUrl);
            },
            getUpdatePasswordUrl: function(userId) {
                return String.format("{0}/{1}/changepassword", this.userServiceUrl, userId);
            },
            getLinkAccountUrl: function(userId) {
                return String.format("{0}/{1}/link", this.userServiceUrl, userId);
            },
            getDelinkAccountUrl: function(userId, type){
                return String.format("{0}/{1}/{2}/delink", this.userServiceUrl, userId, type);
            },
            getCheckinUrl: function(userId, lat, lng) {
                return String.format("{0}/{1}/chekin?lat={2}&lng={3}", this.userServiceUrl, userId, lat, lng);
            },
            getResetPasswordUrl: function(token) {
                return String.format("{0}/resetpassword?token={1}", this.userServiceUrl, token);
            },
            getValidateResetPasswordUrl: function(token) {
                return String.format("{0}/validateresetpasswordtoken?token={1}", this.userServiceUrl, token);
            }
        };
        this.device = {
            deviceServiceUrl: 'device',

            getCreateUrl: function (type, fields) {
                return String.format("{0}/register?fields={1}", this.deviceServiceUrl, _getFields(fields));
            },
            getGetUrl: function (type, deviceId, fields) {
                return String.format("{0}/{1}?fields={2}", this.deviceServiceUrl, deviceId, _getFields(fields));
            },
            getUpdateUrl: function (deviceId, fields, revision) {
                if (!revision) {
                    return String.format("{0}/{1}?fields={2}", this.deviceServiceUrl, deviceId, _getFields(fields));
                } else {
                    return String.format("{0}/{1}?fields={2}&revision={3}", this.deviceServiceUrl, deviceId, _getFields(fields), revision);
                }
            },
            getDeleteUrl: function (type, deviceId, deleteConnections) {
                if (deleteConnections === true ) {
                    return String.format('{0}/{1}?deleteconnections=true', this.deviceServiceUrl, deviceId);
                } else {
                    return String.format('{0}/{1}', this.deviceServiceUrl, deviceId);
                }
            }
        };
        this.object = {
            objectServiceUrl: 'object',

            getSearchAllUrl: function (typeName, queryParams, pageSize) {
                var url = '';

                url = String.format('{0}/search/{1}/all', this.objectServiceUrl, typeName);

                if (pageSize)
                    url = url + '?psize=' + pageSize;
                else
                    url = url + '?psize=10';
                if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                    for (var i = 0; i < queryParams.length; i = i + 1) {
                        if (queryParams[i].trim().length === 0) continue;
                        url = url + "&" + queryParams[i];
                    }
                }
                return url;
            },
            getProjectionQueryUrl: function() {
                return String.format('{0}/search/project', this.objectServiceUrl);
            },
            getPropertiesSearchUrl: function (typeName, query) {
                return String.format('{0}/search/{1}/all?properties={2}', this.objectServiceUrl, typeName, query);
            },
            getMultiGetUrl: function (typeName, objectIds, fields) {
                return String.format('{0}/{1}/multiGet/{2}?fields={3}', this.objectServiceUrl, typeName, objectIds, _getFields(fields));
            },
            getCreateUrl: function (typeName, fields) {
                return String.format('{0}/{1}?fields={2}', this.objectServiceUrl, typeName, _getFields(fields));
            },
            getGetUrl: function (typeName, objectId, fields) {
                return String.format('{0}/{1}/{2}?fields={3}', this.objectServiceUrl, typeName, objectId, _getFields(fields));
            },
            getUpdateUrl: function (typeName, objectId, fields, revision) {
                if (!revision) {
                    return String.format('{0}/{1}/{2}?fields={3}', this.objectServiceUrl, typeName, objectId, _getFields(fields));
                } else {
                    return String.format('{0}/{1}/{2}?fields={3}&revision={4}', this.objectServiceUrl, typeName, objectId, _getFields(fields), revision);
                }
            },
            getDeleteUrl: function (typeName, objectId, deleteConnections) {
                if (deleteConnections === true ) {
                    return String.format('{0}/{1}/{2}?deleteconnections=true', this.objectServiceUrl, typeName, objectId);
                } else {
                    return String.format('{0}/{1}/{2}', this.objectServiceUrl, typeName, objectId);
                }
            },
            getMultiDeleteUrl: function (typeName) {
                return String.format('{0}/{1}/bulkdelete', this.objectServiceUrl, typeName);
            }
        };
        this.connection = {

            connectionServiceUrl: 'connection',

            getGetUrl: function (relationName, connectionId, fields) {
                return String.format('{0}/{1}/{2}?fields={3}', this.connectionServiceUrl, relationName, connectionId, _getFields(fields));
            },
            getMultiGetUrl: function (relationName, connectionIds, fields) {
                return String.format('{0}/{1}/multiGet/{2}?fields={3}', this.connectionServiceUrl, relationName, connectionIds, _getFields(fields));
            },
            getCreateUrl: function (relationName, fields) {
                return String.format('{0}/{1}?fields={2}', this.connectionServiceUrl, relationName, _getFields(fields));
            },
            getUpdateUrl: function (relationName, connectionId, fields, revision) {
                if (!revision) {
                    return String.format('{0}/{1}/{2}?fields={3}', this.connectionServiceUrl, relationName, connectionId, _getFields(fields));
                } else {
                    return String.format('{0}/{1}/{2}?fields={3}&revision={4}', this.connectionServiceUrl, relationName, connectionId, _getFields(fields), revision);
                }
            },
            getDeleteUrl: function (relationName, connectionId) {
                return String.format('{0}/{1}/{2}', this.connectionServiceUrl, relationName, connectionId);
            },
            getMultiDeleteUrl: function (relationName) {
                return String.format('{0}/{1}/bulkdelete', this.connectionServiceUrl, relationName);
            },
            getSearchByArticleUrl: function (relationName, objectId, label, queryParams) {
                var url = '';

                url = String.format('{0}/{1}/find/all?label={2}&objectid={3}', this.connectionServiceUrl, relationName, label, objectId);
                // url = url + '?psize=1000';
                if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                    for (var i = 0; i < queryParams.length; i = i + 1) {
                        url = url + "&" + queryParams[i];
                    }
                }
                return url;
            },
            getConnectedArticles: function (relationName, objectId, queryParams) {
                var url = '';
                url = String.format('{0}/{1}/{2}/find', this.connectionServiceUrl, relationName, objectId);
                if (queryParams && queryParams.length && queryParams.length > 0) {
                    for (var x = 0; x < queryParams.length; x += 1) {
                        if (x === 0) {
                            url += '?' + queryParams[x];
                        } else {
                            url += '&' + queryParams[x];
                        }
                    }
                }
                return url;
            },
            getInterconnectsUrl: function () {
                return String.format('{0}/interconnects', this.connectionServiceUrl);
            },
            getPropertiesSearchUrl: function (relationName, query) {
                return String.format('{0}/{1}/find/all?properties=', this.connectionServiceUrl, relationName, query);
            }
        };
        this.cannedList = {

            cannedListServiceUrl: 'list',

            getGetListItemsUrl: function (cannedListId) {
                return String.format('{0}/list/{1}/contents', this.cannedListServiceUrl, cannedListId);
            }
        };
        this.push = {
            
            pushServiceUrl: 'push',

            getPushUrl: function () {
                return String.format('{0}/', this.pushServiceUrl);
            },

            getGetNotificationUrl: function (notificationId) {
                return String.format('{0}/notification/{1}', this.pushServiceUrl, notificationId);
            },

            getGetAllNotificationsUrl: function (pagingInfo) {
                return String.format('{0}/getAll?psize={1}&pnum={2}', this.pushServiceUrl, pagingInfo.psize, pagingInfo.pnum);
            }
        };
        this.file = {

            fileServiceUrl: 'file',

            getUploadUrl: function (contentType, fileName) {
                if (fileName && fileName.length > 0) {
                    return String.format('{0}/uploadurl?contenttype={1}&expires=20&filename={2}', this.fileServiceUrl, escape(contentType), escape(fileName));
                } else {
                    return String.format('{0}/uploadurl?contenttype={1}&expires=20', this.fileServiceUrl, escape(contentType));
                }
            },

            getUpdateUrl: function (fileId, contentType) {
                return String.format('{0}/updateurl/{1}?contenttype={2}&expires=20', this.fileServiceUrl, fileId, escape(contentType));
            },

            getDownloadUrl: function (fileId, expiryTime) {
                return String.format('{0}/download/{1}?expires={2}', this.fileServiceUrl, fileId, expiryTime);
            },

            getDeleteUrl: function (fileId) {
                return String.format('{0}/delete/{1}', this.fileServiceUrl, fileId);
            }
        };
        this.query = {
            params: function (key) {
                var match = [];
                if (location.search === "" || location.search.indexOf("?") === -1) return match;
                if (!key) return location.search.split("?")[1].split("=");
                else {
                    key = key.toLowerCase();
                    var splitQuery = location.search.split("?")[1].split("&");
                    splitQuery.forEach(function (i, k) {
                        var splitKey = k.split("=");
                        var value = splitKey[1];
                        if (splitKey.length > 2) {
                            splitKey.forEach(function (ii, kk) {
                                if (ii === 0 || ii === 1) return;
                                value = value + "=" + splitKey[ii];
                            });
                        }
                        if (splitKey[0].toLowerCase() === key) match = [splitKey[0], value];
                    });
                    return match;
                }
            }
        };

    };

    global.Appacitive.storage = global.Appacitive.storage || {};
    global.Appacitive.storage.urlFactory = new UrlFactory();

})(global);

/* 
* Copyright (c) 2012 Kaerus (kaerus.com), Anders Elo <anders @ kaerus com>.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

(function(global) {

    "use strict";

    var setImmediate;

    if (global.Appacitive.runtime.isNode) {
        setImmediate = process.nextTick;
    } else {
        setImmediate = setTimeout;
    }

    var PROMISE = 0, FULFILLED = 1, REJECTED = 2;

    var Promise = function () {

        if (!(this instanceof Promise)) return new Promise();

        this.calls = [];
    };

    Promise.prototype.isResolved = function() {
        if (this.state === 1) return true;
        return false;
    };

    Promise.prototype.isRejected = function() {
        if (this.state === 2) return true;
        return false;
    };

    Promise.prototype.isFulfilled = function() {
        if (this.state === 1 || this.state === 2) return true;
        return false;
    };

    Promise.prototype.done = function() {
        var then, promise, res, state = this.state, value = this.value;

        if (!state) return this;

        while (then = this.calls.shift()) {
            promise = then[PROMISE];

            if (typeof then[state] === 'function') {
                
                try {
                    value = then[state].apply(promise, this.value);  
                } catch(error) {
                    if (global.Appacitive.log) {
                        global.Appacitive.logs.exceptions.push(error);
                        console.log(JSON.stringify({name: error.name, message: error.message, stack: error.stack}, null, 2));
                    }   
                    if (promise.calls.length == 0) throw error;
                    else promise.reject(error);
                }

                if (value instanceof Promise || Promise.is(value) )  {
                    /* assume value is thenable */
                    value.then(function(v){
                        promise.fulfill(v); 
                    }, function(r) {
                        promise.reject(r);
                    });
                } else {
                    if (state === FULFILLED)
                        promise.fulfill(value);
                    else 
                        promise.reject(value);
                }  
            } else {
                if (state === FULFILLED)
                    promise.fulfill(value);
                else 
                    promise.reject(value);
            }
        }
    };

    Promise.prototype.fulfill = function() {
        if (this.state) return this;

        this.state = FULFILLED;
        this.value = arguments;

        this.done();

        return this;
    };

    Promise.prototype.resolve = Promise.prototype.fulfill;

    Promise.prototype.reject = function() {
        if(this.state) return this;

        this.state = REJECTED;
        this.reason = this.value = arguments;

        this.done();

        return this;
    };

    Promise.prototype.then = function(onFulfill, onReject) {
        var self = this, promise = new Promise();

        this.calls[this.calls.length] = [promise, onFulfill, onReject];

        if (this.state) {
            setImmediate(function(){
                self.done();
            });
        }    

        return promise;
    };

    Promise.when = function(task) {
        
        var values = [], reasons = [], total, numDone = 0;

        var promise = new Promise();

        /* If no task found then simply fulfill the promise */
        if (!task) {
            promise.fulfill(values);
            return promise;
        }

        /* Check whether all promises have been resolved */
        var notifier = function() {
            numDone += 1;
            if (numDone == total) {
                if (!promise.state) {
                    if (reasons.length > 0) {
                        promise.reject(reasons, values);
                    } else {
                        promise.fulfill(values);
                    }
                }
            }
        };

        /* Assign callbacks for task depending on its type (function/promise) */
        var defer = function(i) {
            var value;
            var proc = task[i];
            if (proc instanceof Promise || (proc && typeof proc.then === 'function')) {
                 setImmediate(function() {
                    /* If proc is a promise, then wait for fulfillment */
                    proc.then(function(value) {
                        values[i] = value;
                        notifier();
                    }, function(reason) {
                        reasons[i] = reason;
                        notifier();
                    });
                });
            } else {
                setImmediate(function() {
                    /* Call the proc and set values/errors and call notifier */
                    try {
                        values[i] = proc.call();
                    } catch (e) {
                        reasons[i] = e;
                    }
                    notifier();
                });
            }
        };

        /* Single task */
        if (!Array.isArray(task)) { 
            task = [task];
        }

        /* Set count for future notifier */
        total = task.length;

        /* Iterate over all task */
        for (var i = 0; i < total; i = i + 1) {
            defer(i);
        }

        return promise;
    }; 

    Promise.is = function(p) {
        if (p instanceof Promise) return true; return false; 
    };

    Promise.buildPromise = function(options) {
        var promise = new Promise(); 
        
        if (_type.isObject(options)) {
            promise.then(options.success, options.error);
        }
        return promise;
    };

    global.Appacitive.Promise = Promise;

})(global);/**
Depends on  NOTHING
**/

(function(global) {

    "use strict";

    /**
     * @constructor
    */

    var EventManager = function () {

        function GUID() {
            var S4 = function () {
                return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
            };

            return (
                S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
        }

        var _subscriptions = {};

        this.subscribe = function (eventName, callback) {
            if (typeof (eventName) != "string" || typeof (callback) != "function")
                throw new Error("Incorrect subscription call");

            if (typeof (_subscriptions[eventName]) == "undefined")
                _subscriptions[eventName] = [];

            var _id = GUID();
            _subscriptions[eventName].push({
                callback: callback,
                id: _id
            });

            return _id;
        };

        this.unsubscribe = function (id) {
            if (!id) return false;
            var index = -1, eN = null;
            for (var eventName in _subscriptions) {
                for (var y = 0; y < _subscriptions[eventName].length; y = y + 1) {
                    if (_subscriptions[eventName][y].id == id) {
                        index = y;
                        eN = eventName;
                        break;
                    }
                }
            }
            if (index != -1) {
                _subscriptions[eN].splice(index, 1);
                return true;
            }
            return false;
        };

        this.fire = function (eventName, sender, args) {
            if (typeof (eventName) != "string") throw new Error("Incorrect fire call");

            if (typeof (args) == "undefined" || args === null)
                args = {};
            args.eventName = eventName;

            // shifted logging here
            // for better debugging
            //if (console && console.log && typeof console.log == 'function')
               // console.log(eventName + ' fired');

            if (typeof (_subscriptions["all"]) != "undefined") {
                for (var x = 0; x < _subscriptions["all"].length; x = x + 1) {
                    //try {
                    _subscriptions["all"][x].callback(sender, args);
                    //} catch (e) { }
                }
            }

            var _callback = function (f, s, a) {
                setTimeout(function () {
                    f(s, a);
                }, 0);
            };

            if (typeof (_subscriptions[eventName]) != "undefined") {
                for (var y= 0; y < _subscriptions[eventName].length; y = y + 1) {
                    _callback(_subscriptions[eventName][y].callback, sender, args);
                }
            }
        };

        this.clearSubscriptions = function (eventName) {
            if (typeof (eventName) != 'string')
                throw new Error('Event Name must be string in EventManager.clearSubscriptions');

            if (_subscriptions[eventName]) _subscriptions[eventName].length = 0;

            return this;
        };

        this.clearAndSubscribe = function (eventName, callback) {
            this.clearSubscriptions(eventName);
            this.subscribe(eventName, callback);
        };

        this.dump = function () {
            console.dir(_subscriptions);
        };

    };

    global.Appacitive.eventManager = new EventManager();

})(global);(function (global) {

	"use strict";

	global.Appacitive.config = {
		apiBaseUrl: 'https://apis.appacitive.com/v1.0/'
	};

	if (typeof XDomainRequest != 'undefined') {
		global.Appacitive.config.apiBaseUrl = window.location.protocol + '//apis.appacitive.com/v1.0/';
	}

}(global));

(function(global) {

    "use strict";
	
    var getUrl = function(options) {
    	var ctx = global.Appacitive.storage.urlFactory[options.type];
    	return global.Appacitive.config.apiBaseUrl + ctx[options.op].apply(ctx, options.args || []);
    };

    var _request = function(options) {

		if (!options || !_type.isObject(options)) throw new Error("Please specify request options");

		this.promise = global.Appacitive.Promise.buildPromise(options.callbacks);

		var request = this.request = new global.Appacitive.HttpRequest();
		
		request.url = getUrl(options);

		request.method = options.method || 'get';
		
		request.data = options.data || {} ;

		request.onSuccess = options.onSuccess;
		request.onError = options.onError;

		request.promise = this.promise;

		if (options.entity) request.entity = options.entity; 

		return this;
    };

    _request.prototype.send = function() {
    	return global.Appacitive.http.send(this.request);
    };

    global.Appacitive._Request = _request;

})(global);(function (global) {

	"use strict";

	/**
	 * @constructor
	 */
	var SessionManager = function() {

		/**
		 * @constructor
		 */

		this.initialized = false;

		var _sessionRequest = function() {
			this.apikey = '';
			this.isnonsliding = false;
			this.usagecount = -1;
			this.windowtime = 240;
		};

		var _sessionKey = null, _appName = null, _options = null, _apikey = null, _authToken = null, authEnabled = false;

		this.useApiKey = true ;

		this.onSessionCreated = function() {};

		this.recreate = function(callbacks) {
			return global.Appacitive.Session.create(callbacks);
		};

		this.create = function(callbacks) {

			if (!this.initialized) throw new Error("Intialize Appacitive SDK");

			// create the session
			var _sRequest = new _sessionRequest();

			_sRequest.apikey = _apikey;

			var request = new global.Appacitive._Request({
				method: 'PUT',
				type: 'application',
				op: 'getSessionCreateUrl',
				callbacks: callbacks,
				data: _sRequest,
				onSuccess: function(data) {
					_sessionKey = data.session.sessionkey;
					global.Appacitive.Session.useApiKey = false;
					request.promise.fulfill(data);
					global.Appacitive.Session.onSessionCreated();
				}
			});
			return request.send();
		};

		global.Appacitive.http.addProcessor({
			pre: function(request) {
				if (global.Appacitive.Session.useApiKey) {
					request.headers.push({ key: 'ak', value: _apikey });
				} else {
					request.headers.push({ key: 'as', value: _sessionKey });
				}

				if (authEnabled === true) {
					var userAuthHeader = request.headers.filter(function (uah) {
						return uah.key == 'ut';
					});
					if (userAuthHeader.length == 1) {
						request.headers.forEach(function (uah) {
							if (uah.key == 'ut') {
								uah.value = _authToken;
							}
						});
					} else {
						request.headers.push({ key: 'ut', value: _authToken });
					}
				}
			}
		});

		this.setUserAuthHeader = function(authToken, expiry, doNotSetCookie) {
			try {
				if (authToken) {
					authEnabled = true;
					_authToken = authToken;
					if (!doNotSetCookie) {
						if(!expiry) expiry = 60;
						if (expiry == -1) expiry = null;
						global.Appacitive.Cookie.setCookie('Appacitive-UserToken', authToken, expiry);
						global.Appacitive.Cookie.setCookie('Appacitive-UserTokenExpiry', expiry ? expiry : -1, expiry);
					}
				}
			} catch(e) {}
		};

		this.incrementExpiry = function() {
			return;
			/*try {
				if (global.Appacitive.runtime.isBrowser && authEnabled) {
					var expiry = global.Appacitive.Cookie.readCookie('Appacitive-UserTokenExpiry');
					
					if (!expiry) expiry = 60;
					if (expiry == -1) expiry = null;
					
					global.Appacitive.Cookie.setCookie('Appacitive-UserToken', _authToken, expiry);
					global.Appacitive.Cookie.setCookie('Appacitive-UserTokenExpiry', expiry ? expiry : -1, expiry);
				}
			} catch(e) {}*/
		};

		this.removeUserAuthHeader = function(makeApiCall) {
			
			global.Appacitive.localStorage.remove('Appacitive-User');
		 	if (_authToken && makeApiCall) {
				try {
					var promise = new global.Appacitive.Promise();

					var _request = new global.Appacitive.HttpRequest();
		            _request.url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.user.getInvalidateTokenUrl(_authToken);
		            _request.method = 'POST';
		            _request.data = {};
		            _request.onSuccess = _request.onError = function() {
		            	authEnabled = false;
		            	_authToken = null;
		            	global.Appacitive.Cookie.eraseCookie('Appacitive-UserToken');
		 				global.Appacitive.Cookie.eraseCookie('Appacitive-UserTokenExpiry');
						promise.fulfill();  
		            };

		 	        global.Appacitive.http.send(_request);

		 	        return promise;
				} catch (e){}
			} else {
				authEnabled = false;
				_authToken = null;
				global.Appacitive.Cookie.eraseCookie('Appacitive-UserToken');
		 		global.Appacitive.Cookie.eraseCookie('Appacitive-UserTokenExpiry');
				return global.Appacitive.Promise().fulfill();
			}
		};

		this.isSessionValid = function(response) {
			if (!response) return true;
			if (response.status) {
				if (response.status.code) {
					if (response.status.code == '19027' || response.status.code == '19002') {
						return { status: false, isSession: (response.status.code == '19027') ? true : false };
					}
				}
			} else if (response.code) {
				if (response.code == '19027' || response.code == '19002') {
					return { status: false, isSession: (response.code == '19027') ? true : false };
				}
			}
			return { status: true };
		};

		this.resetSession = function() {
			_sessionKey = null;
			this.useApiKey = true;
		};

		this.get = function() {
			return _sessionKey;
		};

		this.setSession = function(session) {
			if (session) {
				_sessionKey = session;
				this.useApiKey = false;
			}
		};

		this.setApiKey = function(apikey) {
			if (apikey) {
				_apikey = apikey;
				this.useApiKey = true;
			}
		};

		// the name of the environment, simple public property
		var _env = 'sandbox';
		this.environment = function() {
			if (arguments.length == 1) {
				var value = arguments[0];
				if (value != 'sandbox' && value != 'live')	value = 'sandbox';
				_env = value;
			}
			return _env;
		};
	};

	global.Appacitive.Session = new SessionManager();

	global.Appacitive.getAppPrefix = function(str) {
		return global.Appacitive.Session.environment() + '/' + global.Appacitive.appId + '/' + str;
	};

	global.Appacitive.initialize = function(options) {
		
		options = options || {};

		if (global.Appacitive.Session.initialized) return;
		
		if (!options.apikey || options.apikey.length === 0) throw new Error("apikey is mandatory");
		
		if (!options.appId || options.appId.length === 0) throw new Error("appId is mandatory");


		global.Appacitive.Session.setApiKey( options.apikey) ;
		global.Appacitive.Session.environment(options.env || 'sandbox' );
		global.Appacitive.useApiKey = true;
		global.Appacitive.appId = options.appId;
  		
  		global.Appacitive.Session.initialized = true;
  		global.Appacitive.Session.persistUserToken = options.persistUserToken;
  		
		if (options.debug) global.Appacitive.config.debug = true;
		if (options.log) global.Appacitive.log = [];

  		if (options.userToken) {

			if (options.expiry == -1)  options.expiry = null;
			else if (!options.expiry)  options.expiry = 3600;

			global.Appacitive.Session.setUserAuthHeader(options.userToken, options.expiry);

			if (options.user) {
				global.Appacitive.Users.setCurrentUser(options.user);	
			} else {
				//read user from from localstorage and set it;
				var user = global.Appacitive.localStorage.get('Appacitive-User');	
				if (user) global.Appacitive.Users.setCurrentUser(user);
			}

		} else {

			if (global.Appacitive.runtime.isBrowser) {
				//read usertoken from cookie and set it
				var token = global.Appacitive.Cookie.readCookie('Appacitive-UserToken');
				if (token) { 
					var expiry = global.Appacitive.Cookie.readCookie('Appacitive-UserTokenExpiry');
					if (!expiry) expiry = 60;
					
					//read usertoken from cookie and user from from localstorage and set it;
					var user = global.Appacitive.localStorage.get('Appacitive-User');	
					if (user) global.Appacitive.Users.setCurrentUser(user, token, expiry);
				}
			}
		}			
	};

} (global));


// compulsory http plugin
// attaches the appacitive environment headers
(function (global){

	"use strict";

	if (!global.Appacitive) return;
	if (!global.Appacitive.http) return;

	global.Appacitive.http.addProcessor({
		pre: function(req) {
			req.headers.push({ key: 'e', value: global.Appacitive.Session.environment() });
		}
	});

})(global);
(function (global) {

    "use strict";

    var Appacitive = global.Appacitive;

    Appacitive.GeoCoord = function(lat, lng) {
        
        var _validateGeoCoord = function(lat, lng) {
          if (isNaN(lat) || isNaN(lng)) throw new Error("Invalid Latitiude or longitiude provided");
          if (lat < -90.0 || lat > 90.0) throw new Error("Latitude " + lat + " should be in range of  -90.0 to 90.");
          if (lng < -180.0 || lng > 180.0) throw new Error("Latitude " + lng + " should be in range of  -180.0 to 180.");
        };

        // Parses string geocode value and return Appacitive geocode object or false
        var getGeocode = function(geoCode) {
          // geoCode is not string or its length is 0, return false
          if (typeof geoCode !== 'string' || geoCode.length == 0) return false;
          
          // Split geocode string by ,
          var split = geoCode.split(',');

          // split length is not equal to 2 so return false
          if (split.length !== 2 ) return false;

          // validate the geocode
          try {
            return new Appacitive.GeoCoord(split[0], split[1]);
          } catch(e) {
            return false;
          }
        };

        if (_type.isString(lat) && !lng) {
            var geoCode = getGeocode(lat);
            if (geoCode) return geoCode;
        }

        if (!lat || !lng) {
          this.lat = 0, this.lng = 0;
        } else {
          _validateGeoCoord(lat, lng);
          this.lat = lat, this.lng = lng;
        }

        this.toJSON = function() {
            return {
                latitude : this.lat,
                longitude: this.lng
            };
        };

        this.getValue = function() {
            return String.format("{0},{1}", lat, lng);
        };

        this.toString = function() { return this.getValue(); };
    };

    var _filter = function() { 
        this.toString = function() { }; 

        this.Or = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, this);
            return new _compoundFilter(_operators.or, args); 
        };

        this.And = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, this);
            return new _compoundFilter(_operators.and, args); 
        };
    };

    var _fieldFilter = function(options) {

        _filter.call(this);

        options = options || {};
        this.fieldType = options.fieldType;
        this.field = options.field || '';
        this.value = options.value;
        this.operator = options.operator;

        this.getFieldType = function() {
            switch (this.fieldType) {
                case 'property' : return '*';
                case 'attribute' : return '@';
                case 'aggregate' : return '$';
                default : return '*';
            }
        };

        this.toString = function() {
             return String.format("{0}{1} {2} {3}",
                    this.getFieldType(),
                    this.field.toLowerCase(),
                    this.operator,
                    this.value.getValue());
        };

    };

    _fieldFilter.prototype = new _filter();
    _fieldFilter.prototype.constructor = _fieldFilter;


    var _containsFilter = function(options) {
        
        options = options || '';

        if (!_type.isArray(options.value) || !options.value.length) throw new Error("Specify field value as array");
        
        _fieldFilter.call(this, options);

        var _getValue = function(value) {
            if (_type.isString(value)) return "'" + value + "'";
            else if (_type.isNumber(value)) return value;  
            else return value.toString();
        };

        this.toString = function() {
            var values = [];
            for (var i = 0; i < this.value.length; i = i + 1) {
                values.push(String.format("{0}{1} {2} {3}",
                            this.getFieldType(),
                            this.field.toLowerCase(),
                            this.operator,
                            _getValue(this.value[i])));
            }
            return "("  + values.join(' or ') + ")"; 
        };

    };

    _containsFilter.prototype = new _fieldFilter();
    _containsFilter.prototype.constructor = _containsFilter;

    var _betweenFilter = function(options) {
        options = options || '';

        if (!options.val1) throw new Error("Specify field value1 ");
        if (!options.val2) throw new Error("Specify field value2 ");

        this.val1 = options.val1;
        this.val2 = options.val2;

        _fieldFilter.call(this, options);

        delete this.value;

        this.toString = function() {
             return String.format("{0}{1} {2} ({3},{4})",
                    this.getFieldType(),
                    this.field.toLowerCase(),
                    this.operator,
                    this.val1.getValue(),
                    this.val2.getValue());
        };

    };

    _betweenFilter.prototype = new _fieldFilter();
    _betweenFilter.prototype.constructor = _betweenFilter;


    var _radialFilter = function(options) {

        options = options || '';

        if (!options.geoCoord || !(options.geoCoord instanceof Appacitive.GeoCoord)) throw new Error("withinCircle filter needs Appacitive.GeoCoord object as argument");

        _fieldFilter.call(this, options);

        this.value = options.geoCoord;

        this.unit = options.unit || 'mi';

        this.distance = options.distance || 5;

        this.toString = function() {
             return String.format("{0}{1} {2} {3},{4} {5}",
                    this.getFieldType(),
                    this.field.toLowerCase(),
                    this.operator,
                    this.value.getValue(),
                    this.distance,
                    this.unit);
        };
    };

    _radialFilter.prototype = new _fieldFilter();
    _radialFilter.prototype.constructor = _betweenFilter;


    var _polygonFilter = function(options) {

        options = options || '';

        if (!options.geoCoords || options.geoCoords.length === 0) throw new Error("polygon filter needs array of Appacitive.GeoCoord objects as argument");

        if (options.geoCoords.length < 3) throw new Error("polygon filter needs atleast 3 Appacitive.GeoCoord objects as arguments");

        _fieldFilter.call(this, options);

        this.value = options.geoCoords;

        var _getPipeSeparatedList = function(coords) {
            var value = '';
            coords.forEach(function(c) {
                if (value.length === 0) value = c.toString();
                else value += " | " + c.toString();
            });
            return value;
        };

        this.toString = function() {
             return String.format("{0}{1} {2} {3}",
                    this.getFieldType(),
                    this.field.toLowerCase(),
                    this.operator,
                    _getPipeSeparatedList(this.value));
        };
    };

    _polygonFilter.prototype = new _fieldFilter();
    _polygonFilter.prototype.constructor = _betweenFilter;

    var _tagFilter = function(options) {

        _filter.call(this);

        options = options || {};
        if (!options.tags || _type.isArray(options.tags) || options.tags.length === 0) throw new Error("Specify valid tags");

        this.tags = options.tags;
        this.operator = options.operator;
        
        this.toString = function() {
             return String.format("{0}('{1}')", this.operator, this.tags.join(','));
        };
    };

    _tagFilter.prototype = new _filter();
    _tagFilter.prototype.constructor = _tagFilter;

    var _compoundFilter = function(operator, filters) {
        
        if (!filters || !filters.length || filters.length < 2) throw new Error("Provide valid or atleast 2 filters");

        this.operator = operator;

        this.innerFilters = [];

        for (var i = 0; i < filters.length ; i = i + 1) {
            if (!(filters[i] instanceof _filter)) throw new Error("Invalid filter provided");
            this.innerFilters.push(filters[i]);
        }

        this.toString = function() {
            var op = this.operator;
            var value = "(";
            this.innerFilters.forEach(function(f) {
                if (value.length === 1) value += ' ' + f.toString();
                else value += String.format(' {0} {1} ', op, f.toString());
            });
            value += ")";
            return value;
        };
    };

    _compoundFilter.prototype = new _filter();
    _compoundFilter.prototype.constructor = _compoundFilter;


    var _operators = {
        isEqualTo: "==",
        isGreaterThan: ">",
        isGreaterThanEqualTo: ">=",
        isLessThan: "<",
        isLessThanEqualTo: "<=",
        like: "like",
        match: "match",
        between: "between",
        withinCircle: "within_circle",
        withinPolygon: "within_polygon",
        or: "or",
        and: "and",
        taggedWithAll: "tagged_with_all",
        taggedWithOneOrMore: "tagged_with_one_or_more"
    };

    var _primitiveFieldValue = function(value, type) {

        if (value === null || value === undefined || value.length === 0) throw new Error("Specify value");

        this.value = value;

        if (type) this.type = type;
        else this.type = typeof this.value; 

        if (this.type === 'number') {
          if (!_type.isNumeric(this.value)) throw new Error("Value should be numeric for filter expression");  
        }

        this.getValue = function() {
            if (this.type === 'string') return "'" + this.value + "'";
            else if (this.type === 'number' || _type.isBoolean(this.value))return this.value;  
            else if (this.type === 'object' && this.value instanceof date) return "datetime('" + Appacitive.Date.toISOString(this.value) + "')";
            else return this.value.toString();
        };
    };

    var _dateFieldValue = function(value) {
        this.value = value;
        
        this.getValue = function() {
            if (this.value instanceof Date) return "date('" + Appacitive.Date.toISODate(this.value) + "')";
            else return "date('" + this.value + "')";
        };
    };

    var _timeFieldValue = function(value) {
        this.value = value;
        
        this.getValue = function() {
            if (this.value instanceof Date) return "time('" + Appacitive.Date.toISOTime(this.value) + "')";
            else return "time('" + this.value + "')";
        };
    };

    var _dateTimeFieldValue = function(value) {
        this.value = value;
        
        this.getValue = function() {
            if (this.value instanceof Date) return "datetime('" + Appacitive.Date.toISOString(this.value) + "')";
            else return "datetime('" + this.value + "')";
        };
    };

    var _fieldFilterUtils = function(type, name, context) { 

        if (!context) context = this;

        context.type = type;

        context.name = name;

        /* Helper functions for EqualTo */
        context.equalTo = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value), operator: _operators.isEqualTo });
        };

        context.equalToNumber = function(value){
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isEqualTo });
        };

        context.equalToDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isEqualTo });
        };

        context.equalToTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isEqualTo });
        };

        context.equalToDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isEqualTo });
        };


        /* Helper functions for GreaterThan */
        context.greaterThan = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isGreaterThan });
        };

        context.greaterThanDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isGreaterThan });
        };

        context.greaterThanTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isGreaterThan });
        };

        context.greaterThanDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isGreaterThan });
        };


        /* Helper functions for GreaterThanEqualTo */
        context.greaterThanEqualTo = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isGreaterThanEqualTo });
        };

        context.greaterThanEqualToDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isGreaterThanEqualTo });
        };

        context.greaterThanEqualToTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isGreaterThanEqualTo });
        };

        context.greaterThanEqualToDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isGreaterThanEqualTo });
        };

        /* Helper functions for LessThan */
        context.lessThan = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isLessThan });
        };

        context.lessThanDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isLessThan });
        };

        context.lessThanTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isLessThan });
        };

        context.lessThanDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isLessThan });
        };


        /* Helper functions for LessThanEqualTo */
        context.lessThanEqualTo = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isLessThanEqualTo });
        };

        context.lessThanEqualToDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isLessThanEqualTo });
        };

        context.lessThanEqualToTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isLessThanEqualTo });
        };

        context.lessThanEqualToDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isLessThanEqualTo });
        };

        /* Helper functions for string operations */
        context.like = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue("*" + value + "*"), operator: _operators.like });
        };

        context.match = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue("*" + value + "*"), operator: _operators.match });
        };

        context.startsWith = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value + "*"), operator: _operators.like });
        };

        context.endsWith = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue("*" + value), operator: _operators.like });
        };

        context.contains = function(values) {
            return new _containsFilter({ field: this.name, fieldType: this.type, value: values, operator: _operators.isEqualTo });
        };

        /* Helper functions for between */
        context.between = function(val1, val2) {
            return new _betweenFilter({ field: this.name, fieldType: this.type, val1: new _primitiveFieldValue(val1, 'number'), val2: new _primitiveFieldValue(val2, 'number'), operator: _operators.between });
        };

        context.betweenDate = function(val1, val2) {
            return new _betweenFilter({ field: this.name, fieldType: this.type, val1: new _dateFieldValue(val1), val2: new _dateFieldValue(val2), operator: _operators.between });
        };

        context.betweenTime = function(val1, val2) {
            return new _betweenFilter({ field: this.name, fieldType: this.type, val1: new _timeFieldValue(val1), val2: new _timeFieldValue(val2), operator: _operators.between });
        };

        context.betweenDateTime = function(val1, val2) {
            return new _betweenFilter({ field: this.name, fieldType: this.type, val1: new _dateTimeFieldValue(val1), val2: new _dateTimeFieldValue(val2), operator: _operators.between });
        };

        /*Helper functionf for geolocation search */
        context.withinCircle = function(geoCoord, distance, unit) {
            return new _radialFilter({ field: this.name, fieldType: this.type, geoCoord: geoCoord, distance: distance, unit: unit, operator: _operators.withinCircle });
        };

        context.withinPolygon = function(geoCoords) {
            return new _polygonFilter({ field: this.name, fieldType: this.type, geoCoords: geoCoords, operator: _operators.withinPolygon });
        };
    };

    var _propertyExpression = function(name) {
        
        if (!name || name.length === 0) throw new Error("Specify field name");
        
        this.field = name;

        _fieldFilterUtils("property", name, this);

        return this;
    };

    var _aggregateExpression = function(name) {
        
        if (!name || name.length === 0) throw new Error("Specify field name");
        
        this.field = name;

        var _fieldFilters = new _fieldFilterUtils("aggregate", name);

        this.equalTo = function(value) {
            return _fieldFilters.equalTo(value);
        };

        this.greaterThan = function(value) {
            return _fieldFilters.greaterThan(value);
        };

        this.greaterThanEqualTo = function(value) {
            return _fieldFilters.greaterThanEqualTo(value);
        };

        this.lessThan = function(value) {
            return _fieldFilters.lessThan(value);
        };

        this.lessThanEqualTo = function(value) {
            return _fieldFilters.lessThanEqualTo(value);
        };

        this.between = function(val1, val2) {
            return _fieldFilters.between(val1, val2);
        };

        return this;
    };

    var _attributeExpression = function(name) {
        if (!name || name.length === 0) throw new Error("Specify field name");
        
        this.field = name;

        var _fieldFilters = new _fieldFilterUtils("attribute", name);

        /* Helper functions for string operations */
        this.like = function(value) {
            return _fieldFilters.like(value);
        };

        this.like = function(value) {
            return _fieldFilters.match(value);
        };

        this.startWith = function(value) {
            return _fieldFilters.startsWith(value);
        };

        this.endsWith = function(value) {
            return _fieldFilters.endsWith(value);
        };

        this.equalTo = function(value) {
            return _fieldFilters.equalTo(value);
        };        

        this.contains = function(values) {
            return _fieldFilters.contains(values);
        };

        return this;
    };

    Appacitive.Filter = {
        Property: function(name) {
            return new _propertyExpression(name);
        },
        Aggregate: function(name) {
            return new _aggregateExpression(name);
        },
        Attribute: function(name) {
            return new _attributeExpression(name);
        },
        Or: function() {
            return new _compoundFilter(_operators.or, arguments); 
        },
        And: function() {
            return new _compoundFilter(_operators.and, arguments); 
        },
        taggedWithOneOrMore: function(tags) {
            return new _tagFilter({ tags: tags, operator: _operators.taggedWithOneOrMore });
        },
        taggedWithAll: function(tags) {
            return new _tagFilter({ tags: tags, operator: _operators.taggedWithAll });
        }
    };

})(global);(function (global) {

	"use strict";

	global.Appacitive.Queries = {};

	// basic query for contains pagination
	/** 
	* @constructor
	**/
	var PageQuery = function(o) {
		var options = o || {};
		var _pageNumber = 1;
		var _pageSize = 20;

		//define getter and setter for pageNumber
		this.pageNumber =  function() { 
			if (arguments.length == 1) {
				_pageNumber = arguments[0] || 1;
				return this;
			}
			return _pageNumber; 
		};

		//define getter and setter for pageSize
		this.pageSize =  function() { 
			if (arguments.length == 1) {
				_pageSize = arguments[0] || 20;
				return this;
			}
			return _pageSize; 
		};

		this.pageNumber(options.pageNumber);
		this.pageSize(options.pageSize);
	};
	PageQuery.prototype.toString = function() {
		return 'psize=' + this.pageSize() + '&pnum=' + this.pageNumber();
	};

	// sort query
	/** 
	* @constructor
	**/
	var SortQuery = function(o) {
		var options = o || {};
		var _orderBy = null;
		var _isAscending = false;

		//define getter/setter for orderby
		this.orderBy =  function() { 
			if (arguments.length === 1 && _type.isString(arguments[0])) {
				_orderBy = arguments[0];
				return this;
			}
			return _orderBy; 
		};

		//define getter for isAscending
		this.isAscending =  function() { 
			if (arguments.length === 1) {
				_isAscending = (arguments[0] === undefined || arguments[0] == null) ? false : arguments[0];
				return this;
			}
			return _isAscending; 
		};

		this.orderBy(options.orderBy);
		this.isAscending(options.isAscending);
	};
	SortQuery.prototype.toString = function() {
		if (this.orderBy() && this.orderBy().length > 0) {
			return 'orderBy=' + this.orderBy() + '&isAsc=' + this.isAscending();
		} else {
			return '';
		}
	};

	// base query
	/** 
	* @constructor
	**/
	var BasicQuery = function(o) {

		var options = o || {};

		//set filters , freetext and fields
		var _filter = '';
		var _freeText = '';
		var _fields = '';
		var _queryType = options.queryType || 'BasicQuery';
		var _pageQuery = new PageQuery(o);
		var _sortQuery = new SortQuery(o);
		var _entityType = options.type || options.relation;
		var _etype = (options.relation) ? 'connection' : 'object';
		
		var self = this;

		//define getter for type (object/connection)
		this.type = function() { return _etype; };

		//define getter for basetype (type/relation)
		this.entityType = function() { return _entityType; };

		//define getter for querytype (basic,connectedobjects etc)
		this.queryType = function() { return _queryType; };

		//define getter for pagequery 
		this.pageQuery = function() { return _pageQuery; };

		
		//define getter and setter for pageNumber
		this.pageNumber =  function() { 
			if (arguments.length === 1) {
				_pageQuery.pageNumber(arguments[0]);
				return this;
			}
			return _pageQuery.pageNumber(); 
		};

		//define getter and setter for pageSize
		this.pageSize =  function() { 
			if (arguments.length === 1) {
				_pageQuery.pageSize(arguments[0]);
				return this;
			}
			return _pageQuery.pageSize(); 
		};

		//define getter for sortquery
		this.sortQuery = function() { return _sortQuery; };

		//define getter and setter for orderby
		this.orderBy =  function() { 
			if (arguments.length === 1) {
				_sortQuery.orderBy(arguments[0]);
				return this;
			}
			return _sortQuery.orderBy(); 
		};

		//define getter and setter for isAscending
		this.isAscending =  function() { 
			if (arguments.length === 1) {
				_sortQuery.isAscending(arguments[0]);
				return this;
			}
			return _sortQuery.isAscending(); 
		};

		//define getter and setter for filter
		this.filter =  function() { 
			if (arguments.length === 1) {
				_filter = arguments[0];
				return this;
			}
			return _filter; 
		};		
		
		//define getter and setter for freetext
		this.freeText =  function() { 
			if (arguments.length === 1) {
				var value = arguments[0];
				if (_type.isString(value)) _freeText = arguments[0];
				else if (_type.isArray(value) && value.length) _freeText = arguments[0].join(' ');
				return this;
			}
			return _freeText; 
		};		
		
		
		this.fields = function() {
			if (arguments.length === 1) {
				var value = arguments[0];
				if (_type.isString(value)) _fields = value;
				else if (_type.isArray(value) && value.length) _fields = value.join(',');
				return this;
			} else {
				return _fields;
			}
		};

		//set filters , freetext and fields
		this.filter(options.filter || '');
		this.freeText(options.freeText || '');
		this.fields(options.fields || '');

		this.setFilter = function() { this.filter(arguments[0]); };
		this.setFreeText = function() { this.freeText(arguments[0]); };
        this.setFields = function() { this.fields(arguments[0]); };

        this.extendOptions = function(changes) {
			for (var key in changes) {
				options[key] = changes[key];
			}
			_pageQuery = new PageQuery(options);
			_sortQuery = new SortQuery(options);
			return this;
		};

		this.getQueryString = function() {

			var finalUrl = _pageQuery.toString();

			var sortQuery =  _sortQuery.toString();

			if (sortQuery) finalUrl += '&' + sortQuery;

			if (this.filter()) {
				var filter = this.filter().toString();
			    if (filter.trim().length > 0) finalUrl += '&query=' + filter;
			}

			if (this.freeText() && this.freeText().trim().length > 0) {
                finalUrl += "&freetext=" + this.freeText() + "&language=en";
            }

            if (this.fields() && this.fields().trim().length > 0) {
            	finalUrl += "&fields=" + this.fields();
            }

			return finalUrl;
		};

		this.toUrl = function() {
			return global.Appacitive.config.apiBaseUrl + _etype + '/' + _entityType + '/find/all?' + this.getQueryString();
		};

		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = this.toUrl();
            r.method = 'get';
			return r;
		};

		this.getOptions = function() {
			var o = {};
			for (var key in this) {
				if (this.hasOwnProperty(key) && !_type.isFunction(this[key])) {
					o[key] = this[key];
				}
			}
			return o;
		};

		this._setPaging = function(pi) {
			if (pi) {
				_pageQuery.pageNumber(pi.pagenumber);
				_pageQuery.pageSize(pi.pagesize);
				
				this.results = this.results || [];

				this.results.isLastPage = false;
				this.results.total = pi.totalrecords;
				this.results.pageNumber = pi.pagenumber;
				this.results.pageSize = pi.pagesize;
				
				if ((pi.pagenumber * pi.pagesize) >= pi.totalrecords) {
					this.results.isLastPage = true;
				}
			}
		};

		var _parse = function(entities) {
			var entityObjects = [];
			if (!entities) entities = [];
			var eType = (_etype === 'object') ? 'Object' : 'Connection';
			
			if (_entityType && _entityType.toLowerCase() == 'user') eType = 'User';
			
			entities.forEach(function(e) {
				entityObjects.push(new global.Appacitive[eType](e, true));
			});

			return entityObjects;
		};

		this.fetch = function(callbacks) {
			var promise = global.Appacitive.Promise.buildPromise(callbacks);

			var request = this.toRequest();
			request.onSuccess = function(d) {
			   self.results = _parse(d[_etype + 's']);
			   self._setPaging(d.paginginfo);

			   promise.fulfill(self.results, d.paginginfo);
			};
			request.promise = promise;
			request.entity = this;
			return global.Appacitive.http.send(request);
		};

		this.fetchNext = function(callbacks) {
			var pNum = this.pageNumber();
			this.pageNumber(++pNum);
			return this.fetch(callbacks);
		};

		this.fetchPrev = function(callbacks) {
			var pNum = this.pageNumber();
			pNum -= 1;
			if (pNum <= 0) pNum = 1;
			this.pageNumber(pNum);
			return this.fetch(callbacks);
		};

		this.count = function(callbacks) {
			var promise = global.Appacitive.Promise.buildPromise(callbacks);

			var _queryRequest = this.toRequest();
			_queryRequest.onSuccess = function(data) {
				data = data || {};
				var pagingInfo = data.paginginfo;

				var count = 0;
				if (!pagingInfo) {
					count = 0;
				} else {
					count = pagingInfo.totalrecords;
				}
				promise.fulfill(count);
			};
			_queryRequest.promise = promise;
			_queryRequest.entity = this;
			return global.Appacitive.http.send(_queryRequest);
		};
	};

	/** 
	* @constructor
	**/
	global.Appacitive.Queries.FindAllQuery = function(options) {

		options = options || {};

		if ((!options.type && !options.relation) || (options.type && options.relation)) 
		    throw new Error('Specify either type or relation for basic filter query');

		options.queryType = 'BasicFilterQuery';

		BasicQuery.call(this, options);

		return this;
	};

	global.Appacitive.Queries.FindAllQuery.prototype = new BasicQuery();

	global.Appacitive.Queries.FindAllQuery.prototype.constructor = global.Appacitive.Queries.FindAllQuery;

	/** 
	* @constructor
	**/
	global.Appacitive.Queries.ConnectedObjectsQuery = function(options) {

		options = options || {};

		if (!options.relation) throw new Error('Specify relation for connected objects query');
		if (!options.objectId) throw new Error('Specify objectId for connected objects query');
		if (!options.type) throw new Error('Specify type of object id for connected objects query');
		
		var type = options.type;
		delete options.type;

		options.queryType = 'ConnectedObjectsQuery';

		BasicQuery.call(this, options);

		this.objectId = options.objectId;
		this.relation = options.relation;
		this.type = type;
		if (options.object instanceof global.Appacitive.Object) this.object = options.object;

		this.returnEdge = true;
		if (options.returnEdge !== undefined && options.returnEdge !== null && !options.returnEdge && !this.prev) this.returnEdge = false;
		
		this.label = '';
		var self = this;

		if (_type.isString(options.label) && options.label.length > 0) this.label = '&label=' + options.label;

		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = this.toUrl();
			r.method = 'get';
			return r;
		};

		this.toUrl = function() {
			return global.Appacitive.config.apiBaseUrl + 'connection/' + this.relation + '/' + this.type + '/' + this.objectId + '/find?' +
				this.getQueryString() + this.label + '&returnEdge=' + this.returnEdge;
		};


		var parseNodes = function(nodes, endpointA) {
			var objects = [];
			nodes.forEach(function(o) {
				var tmpObject = null;
				if (o.__edge) {
					var edge = o.__edge;
					delete o.__edge;

					edge.__endpointa = endpointA;
					edge.__endpointb = {
						objectid: o.__id,
						label: edge.__label,
						type: o.__type
					};
					delete edge.label;

					var connection = new global.Appacitive.Connection(edge, true);
					tmpObject = new global.Appacitive.Object(o, true);
					tmpObject.connection = connection;
				} else {
					tmpObject = new global.Appacitive.Object(o, true);
				}
				objects.push(tmpObject);
			});
			
			if (self.object) self.object.children[self.relation] = objects;

			return objects;
		};

		this.fetch = function(callbacks) {
			var promise = global.Appacitive.Promise.buildPromise(callbacks);
			
			var request = this.toRequest();
			request.onSuccess = function(d) {
			    var _parse = parseNodes;
			    if (self.prev) _parse = prevParseNodes;

			    self.results = _parse(d.nodes ? d.nodes : [], { objectid : options.objectId, type: type, label: d.parent });
		   	    self._setPaging(d.paginginfo);

		   	    promise.fulfill(self.results, d.paginginfo);   
			};
			request.promise = promise;
			request.entity = this;
			return global.Appacitive.http.send(request);
		};

		return this;
	};

	global.Appacitive.Queries.ConnectedObjectsQuery.prototype = new BasicQuery();

	global.Appacitive.Queries.ConnectedObjectsQuery.prototype.constructor = global.Appacitive.Queries.ConnectedObjectsQuery;

	/** 
	* @constructor
	**/
	global.Appacitive.Queries.GetConnectionsQuery = function(options) {

		options = options || {};

		if (!options.relation) throw new Error('Specify relation for GetConnectionsQuery query');
		if (!options.objectId) throw new Error('Specify objectId for GetConnectionsQuery query');
		if (!options.label || options.label.trim().length === 0) throw new Error('Specify label for GetConnectionsQuery query');
		if (options.type) delete options.type;

		options.queryType = 'GetConnectionsQuery';

		BasicQuery.call(this, options);

		this.objectId = options.objectId;
		this.relation = options.relation;
		this.label = options.label;

		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = this.toUrl();
			r.method = 'get';
			return r;
		};

		this.toUrl = function() {
			return global.Appacitive.config.apiBaseUrl + 'connection/' + this.relation + '/find/all?' +
				this.getQueryString() + 
				'&objectid=' + this.objectId +
				'&label=' + this.label;
		};

		return this;
	};

	global.Appacitive.Queries.GetConnectionsQuery.prototype = new BasicQuery();

	global.Appacitive.Queries.GetConnectionsQuery.prototype.constructor = global.Appacitive.Queries.GetConnectionsQuery;

	/** 
	* @constructor
	**/
	global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery = function(options, queryType) {

		options = options || {};

		if (!options.objectAId || !_type.isString(options.objectAId) || options.objectAId.length === 0) throw new Error('Specify valid objectAId for GetConnectionsBetweenObjectsQuery query');
		if (!options.objectBId || !_type.isString(options.objectBId) || options.objectBId.length === 0) throw new Error('Specify objectBId for GetConnectionsBetweenObjectsQuery query');
		if (options.type) delete options.type;

		options.queryType = queryType || 'GetConnectionsBetweenObjectsQuery';

		BasicQuery.call(this, options);

		this.objectAId = options.objectAId;
		this.objectBId = options.objectBId;
		this.label = (this.queryType() === 'GetConnectionsBetweenObjectsForRelationQuery' && options.label && _type.isString(options.label) && options.label.length > 0) ? '&label=' + options.label : '';
		this.relation = (options.relation && _type.isString(options.relation) && options.relation.length > 0) ? options.relation + '/' : '';
		
		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = this.toUrl();
			r.method = 'get';
			return r;
		};

		this.toUrl = function() {
			return global.Appacitive.config.apiBaseUrl + 'connection/' + this.relation + 'find/' + this.objectAId + '/' + this.objectBId + '?'
				+ this.getQueryString() + this.label;
		};

		return this;
	};

	global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery.prototype = new BasicQuery();

	global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery.prototype.constructor = global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery;

	/** 
	* @constructor
	**/
	global.Appacitive.Queries.GetConnectionsBetweenObjectsForRelationQuery = function(options) {
		
		options = options || {};
		
		if (!options.relation) throw new Error('Specify relation for GetConnectionsBetweenObjectsForRelationQuery query');
		
		var inner = new global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery(options, 'GetConnectionsBetweenObjectsForRelationQuery');

		inner.fetch = function(callbacks) {
			var promise = global.Appacitive.Promise.buildPromise(callbacks);

			var request = this.toRequest();
			request.onSuccess = function(d) {
				promise.fulfill(d.connection ? new global.Appacitive.Connection(d.connection, true) :  null);
			};
			request.promise = promise;
			request.entity = this;
			return global.Appacitive.http.send(request);
		};

		return inner;
	};

	/** 
	* @constructor
	**/
	global.Appacitive.Queries.InterconnectsQuery = function(options) {

		options = options || {};

		if (!options.objectAId || !_type.isString(options.objectAId) || options.objectAId.length === 0) throw new Error('Specify valid objectAId for InterconnectsQuery query');
		if (!options.objectBIds || !_type.isArray(options.objectBIds) || !(options.objectBIds.length > 0)) throw new Error('Specify list of objectBIds for InterconnectsQuery query');
		if (options.type) delete options.type;

		options.queryType = 'InterconnectsQuery';

		BasicQuery.call(this, options);

		this.objectAId = options.objectAId;
		this.objectBIds = options.objectBIds;
		
		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = this.toUrl();
			r.method = 'post';
			r.data = {
				object1id: this.objectAId,
				object2ids: this.objectBIds
			};
			return r;
		};

		this.toUrl = function() {
			return global.Appacitive.config.apiBaseUrl + 'connection/interconnects?' + this.getQueryString();
		};

		return this;
	};

	global.Appacitive.Queries.InterconnectsQuery.prototype = new BasicQuery();

	global.Appacitive.Queries.InterconnectsQuery.prototype.constructor = global.Appacitive.Queries.InterconnectsQuery;


	/** 
	* @constructor
	**/
	global.Appacitive.Queries.GraphFilterQuery = function(name, placeholders) {

		if (!name || name.length === 0) throw new Error("Specify name of filter query");
		
		this.name = name;
		this.data = { };
		this.queryType = 'GraphFilterQuery';

		if (placeholders) { 
			this.data.placeholders = placeholders;
			for (var ph in this.data.placeholders) {
				this.data.placeholders[ph] = this.data.placeholders[ph];
			}
		}
		
		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = this.toUrl();
			r.method = 'post';
			r.data = this.data;
			return r;
		};

		this.toUrl = function() {
			return global.Appacitive.config.apiBaseUrl + 'search/' + this.name + '/filter';
		};

		this.fetch = function(callbacks) {
			var promise = global.Appacitive.Promise.buildPromise(callbacks);

			var request = this.toRequest();
			request.onSuccess = function(d) {
		   		promise.fulfill(d.ids ? d.ids : []);
			};
			request.promise = promise;
			request.entity = this;
			return global.Appacitive.http.send(request);
		};

	};

	/** 
	* @constructor
	**/
	global.Appacitive.Queries.GraphProjectQuery = function(name, ids, placeholders) {

		if (!name || name.length === 0) throw new Error("Specify name of project query");
		if (!ids || !ids.length) throw new Error("Specify ids to project");
		
		this.name = name;
		this.data = { ids: ids };
		this.queryType = 'GraphProjectQuery';

		if (placeholders) { 
			this.data.placeholders = placeholders;
			for (var ph in this.data.placeholders) {
				this.data.placeholders[ph] = this.data.placeholders[ph];
			}
		}

		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = this.toUrl();
			r.method = 'post';
			r.data = this.data;
			return r;
		};

		this.toUrl = function() {
			return global.Appacitive.config.apiBaseUrl + 'search/' + this.name + '/project';
		};

		var _parseResult = function(result) {
			var root;
			for (var key in result) {
				if (key !== 'status') {
					root = result[key];
					break;
				}
			}
			var parseChildren = function(obj, parentLabel, parentId) {
				var props = [];
				obj.forEach(function(o) {
					var children = o.__children;
					delete o.__children;
					
					var edge = o.__edge;
					delete o.__edge;

					var tmpObject = new global.Appacitive.Object(o, true);
					tmpObject.children = {};
					for (var key in children) {
						tmpObject.children[key] = [];
						tmpObject.children[key] = parseChildren(children[key].values, children[key].parent, tmpObject.id);
					}

					if (edge) {
						edge.__endpointa = {
							objectid : parentId,
							label: parentLabel
						};
						edge.__endpointb = {
							objectid: tmpObject.id(),
							label: edge.__label
						};
						delete edge.__label;
						tmpObject.connection = new global.Appacitive.Connection(edge, true);
					}
					props.push(tmpObject);
				});
				return props;
			};
			return parseChildren(root.values);
		};

		this.fetch = function(callbacks) {
			
			var promise = global.Appacitive.Promise.buildPromise(callbacks);

			var request = this.toRequest();
			request.onSuccess = function(d) {
		   		promise.fulfill(_parseResult(d));
			};
			request.promise = promise;
			request.entity = this;
			return global.Appacitive.http.send(request);
		};
	};

})(global);(function (global) {

	"use strict";

	//base object for objects and connections
	/**
	* @constructor
	**/
	var _BaseObject = function(objectOptions, setSnapShot) {

		var _snapshot = {};

		//Copy properties to current object
		var _copy = function(src, des) {
			for (var property in src) {
				if (_type.isString(src[property])) {
					des[property] = src[property];
				} else if(src[property] instanceof Date){
					des[property] = global.Appacitive.Date.toISOString(src[property]);
				} else if (_type.isObject(src[property]))  {
					
					if (src[property] instanceof global.Appacitive.GeoCoord) {
		 				des[property] = src[property].toString();
		 			} else {

						if (!des[property]) des[property] = {};

						for (var p in src[property]) {
							des[property][p] = src[property][p];
						}
					}
				} else if (_type.isArray(src[property])) {
					des[property] = [];
				
					src[property].forEach(function(v) {
						if (_type.isString(v)) { des[property].push(v); }
			 			else if (_type.isNumber(v) || _type.isBoolean(v)) { des[property].push(value + ''); }
			 			else if (v instanceof Date) des[property].push(global.Appacitive.Date.toISOString(v));
			 			else if (property == '__link') des[property].push(v);
			 			else throw new Error("Multivalued property cannot have values of property as an object");
					});

					if (property !== '__tags' || property !== '__link') {
						des[property].push = function(v) {
						  	var len = this.length;
						  	if (_type.isString(v)) { this[len] = v; }
				 			else if (_type.isNumber(v) || _type.isBoolean(v)) { this[len] = v + ''; }
				 			else if (v instanceof Date) {
			 					this[len] = global.Appacitive.Date.toISOString(v);
			 				} else {
			 					throw new Error("Multivalued property cannot have values of property as an object");
			 				} 
			 				return this;
						}
					}
				} else {
					des[property] = src[property];
				}
			}
		};

		var that = this;

		var raw = {};
		_copy(objectOptions, raw);
		var object = raw;

		//will be used in case of creating an appacitive object for internal purpose
		if (setSnapShot) {
			_copy(object, _snapshot);
		}

		if (!_snapshot.__id && raw.__id) _snapshot.__id = raw.__id;

		//Check whether __type or __relationtype is mentioned and set type property
		if (raw.__type) { 
			raw.__type = raw.__type.toLowerCase();
			this.entityType = 'type';
			this.type = 'object';
		} else if (raw.__relationtype) {
			raw.__relationtype = raw.__relationtype.toLowerCase();
			this.entityType = 'relation';
			this.type = 'connection';
		}

		var __cid = parseInt(Math.random() * 1000000, 10);

		this.cid = __cid;

		//attributes
		if (!object.__attributes) object.__attributes = {};
		if (!_snapshot.__attributes) _snapshot.__attributes = {};

		//atomic properties
		var _atomicProps = [];

		//tags
		var _removeTags = []; 
		if (!object.__tags) object.__tags = [];
		if (!_snapshot.__tags) _snapshot.__tags = [];

		//fields to be returned
		var _fields = '';

		//Fileds to be ignored while update operation
		var _ignoreTheseFields = ["__id", "__revision", "__endpointa", "__endpointb", "__createdby", "__lastmodifiedby", "__type", "__relationtype", "__typeid", "__relationid", "__utcdatecreated", "__utclastupdateddate", "__tags", "__authType", "__link"];
		
		var _allowObjectSetOperations = ["__link", "__endpointa", "__endpointb"];

		/* parse api output to get error info
		   TODO: define error objects in future depending on codes and messages */
		var _getOutpuStatus = function(data) {
			data = data || {};
			data.message = data.message || 'Server error';
			data.code = data.code || '500';
			return data;
		};

		this.attributes = this.toJSON = this.getObject = function() { return JSON.parse(JSON.stringify(object)); };

		this.properties = function() {
			var properties = this.attributes();
			delete properties.__attributes;
			delete properties.__tags;
			return properties;
		};

		this.id = function() {
			if (arguments.length === 1) {
				this.set('__id', arguments[0]);
				return this;
			}
			return this.get('__id');	
		};

		// accessor function for the object's attributes
		this.attr = function() {
			if (arguments.length === 0) {
				if (!object.__attributes) object.__attributes = {};
				return object.__attributes;
			} else if (arguments.length === 1) {
				if (!object.__attributes) object.__attributes = {};
				return object.__attributes[arguments[0]];
			} else if (arguments.length === 2) {
				if (!_type.isString(arguments[1]) && arguments[1] !== null)
					throw new Error('only string values can be stored in attributes.');
				if (!object.__attributes) object.__attributes = {};
				object.__attributes[arguments[0]] = arguments[1];
			} else throw new Error('.attr() called with an incorrect number of arguments. 0, 1, 2 are supported.');

			return object.__attributes;
		};

		//accessor function to get changed attributes
		var _getChangedAttributes = function() {
			if (!object.__attributes) return null;
			if (!_snapshot.__attributes) return object.__attributes;

			var isDirty = false;
			var changeSet = JSON.parse(JSON.stringify(_snapshot.__attributes));
			for (var property in object.__attributes) {
				if (object.__attributes[property] == null || object.__attributes[property] == undefined) {
					changeSet[property] = null;
					isDirty = true;
				} else if (object.__attributes[property] != _snapshot.__attributes[property]) {
					changeSet[property] = object.__attributes[property];
					isDirty = true;
				} else if (object.__attributes[property] == _snapshot.__attributes[property]) {
					delete changeSet[property];
				}
			}
			if (!isDirty) return null;
			return changeSet;
		};

		this.getChangedAttributes = _getChangedAttributes;

		// accessor function for the object's aggregates
		this.aggregate = function() {
			var aggregates = {};
			for (var key in object) {
				if (!object.hasOwnProperty(key)) return;
				if (key[0] == '$') {
					aggregates[key.substring(1)] = object[key];
				}
			}
			if (arguments.length === 0) return aggregates;
			else if (arguments.length == 1) return aggregates[arguments[0]];
			else throw new Error('.aggregates() called with an incorrect number of arguments. 0, and 1 are supported.');
		};

		this.tags = function()  {
			if (!object.__tags) return [];
			return object.__tags;
		};

		this.addTag = function(tag) {
			if (!tag || !_type.isString(tag) || !tag.length) return this;
		    
		    if (!object.__tags) object.__tags = [];

		    object.__tags.push(tag);
		    object.__tags = Array.distinct(object.__tags);

		    if (!_removeTags || !_removeTags.length) return this;
			var index = _removeTags.indexOf(tag);
			if (index != -1) _removeTags.splice(index, 1);
			return this;
		};

		this.removeTag = function(tag) {
			if (!tag || !_type.isString(tag) || !tag.length) return this;
			//tag = tag.toLowerCase();
			_removeTags.push(tag);
			_removeTags = Array.distinct(_removeTags);

			if (!object.__tags || !object.__tags.length) return this;
			var index = object.__tags.indexOf(tag);
			if (index != -1) object.__tags.splice(index, 1);
			return this;
		};

		var _getChangedTags = function() {
			if (!object.__tags) return [];
			if (!_snapshot.__tags) return object.__tags;

			var _tags = [];
			object.__tags.forEach(function(a) {
				if (_snapshot.__tags.indexOf(a) == -1)
					_tags.push(a);
			});
			return _tags.length > 0 ? _tags : null;
		};

		this.getChangedTags = _getChangedTags;

		this.getRemovedTags = function() { return _removetags; };

		var _getChanged = function(isInternal) {
			var isDirty = false;
			var changeSet = JSON.parse(JSON.stringify(_snapshot));
			for (var property in object) {
				if (object[property] == null || object[property] == undefined) {
					changeSet[property] = null;
					isDirty = true;
				} else if (object[property] != _snapshot[property]) {
					if (property == '__tags' || property == '__attributes') {
						delete changeSet[property];
					} else {
						changeSet[property] = object[property];
						isDirty = true;
					}
				} else if (object[property] == _snapshot[property]) {
					delete changeSet[property];
				}
			}

			try {
				_ignoreTheseFields.forEach(function(c) {
					if (changeSet[c]) delete changeSet[c];
				});
			} catch(e) {}

			var changedTags = _getChangedTags();
			if (isInternal) {
				if (changedTags) { 
					changeSet["__addtags"] = changedTags; 
					isDirty = true;
				}
				if (_removeTags && _removeTags.length > 0) {
				    changeSet["__removetags"] = _removeTags;
				    isDirty = true;
				}
			} else {
				if (changedTags) { 
					changeSet["__addtags"] = changedTags; 
					isDirty = true;
				}
			}

			var attrs = _getChangedAttributes();
			if (attrs) { 
				changeSet["__attributes"] = attrs;
				isDirty = true;
			}
			else delete changeSet["__attributes"];

			for (var p in changeSet) {
				if (p[0] == '$') delete changeSet[p];
			}

			if (isDirty && !Object.isEmpty(changeSet)) return changeSet;
			return false;
		};

		this.changed = function() {
			return _getChanged();
		};

		this.hasChanged = function() {
			var changeSet = _getChanged(true);
			if (arguments.length === 0) {
				return Object.isEmpty(changeSet) ? false : true;
			} else if (arguments.length == 1 && _type.isString(arguments[0]) && arguments[0].length > 0) {
				if (changeSet && changeSet[arguments[0]]) {
					return true;
				} return false;
			}
			return false;
		};

		this.changedAttributes  = function() {
			var changeSet = _getChanged(true);
			
			if (arguments.length === 0) {
				return changeSet;
			} else if (arguments.length == 1 && _type.isArray(arguments[0]) && arguments[0].length) {
				var attrs = {};
				arguments[0].forEach(function(c) {
					if (changeSet[c]) attrs.push(changeSet[c]);
				});
				return attrs;
			}
			return false;
		};

		this.previous = function() {
			if (arguments.length == 1 && _type.isString(arguments[0]) && arguments[0].length) {
				return _snapshot[arguments[0]];	
			}
			return null;
		};

		this.previousAttributes = function() { return _snapshot; };

		this.fields = function() {
			if (arguments.length == 1) {
				var value = arguments[0];
				if (_type.isString(value)) _fields = value;
				else if (_type.isArray(value)) _fields = value.join(',');
				return this;
			} else {
				return _fields;
			}
		};

		var _types = {
			"integer": function(value) { 
				if (value) {
					var res = parseInt(value);
					if (!isNaN(res)) return res;
				}
				return value;
			}, "decimal": function(value) { 
				if (value) {
					var res = parseFloat(value);
					if (!isNaN(res)) return res;
				}
				return value;
			}, "boolean": function(value) { 
				if (value !== undefined && value !== null && (value.toString().toLowerCase() === 'true' || value === true || value > 0)) return true;
				return false;
			}, "date": function(value) { 
				if (value) {
					var res = global.Appacitive.Date.parseISODate(value);
					if (res) return res;
				}
				return value;
			}, "datetime": function(value) { 
				if (value) {
					var res = global.Appacitive.Date.parseISODate(value);
					if (res) return res;
				}
				return value;
			}, "time": function(value) { 
				if (value) {
					var res = global.Appacitive.Date.parseISOTime(value);
					if (res) return res;
				}
				return value;
			}, "string": function(value) { 
				if (value) return value.toString();
				return value;
			}, "geocode": function(value) {
				// value is not string or its length is 0, return false
				if (!_type.isString(value) || value.trim().length == 0) return false;
				  
				// Split value string by ,
				var split = value.split(',');

				// split length is not equal to 2 so return false
				if (split.length !== 2 ) return false;

				// validate the value
				return new global.Appacitive.GeoCoord(split[0], split[1]);
			}
		};

		this.get = function(key, type) { 
			if (key) { 
				if (type && _types[type.toLowerCase()]) {
					if (_types[type.toLowerCase()]) {
						var res = _types[type.toLowerCase()](object[key]);
						return res;
					} else {
						throw new Error('Invalid cast-type "' + type + '"" provided for get "' + key + '"');
					}
				}
				return object[key];
			}
		};

		this.tryGet = function(key, value, type) {
			var res = this.get(key, type);
			if (res !== undefined) return res;
			return value;
		};

		this.set = function(key, value) {

			if(!key || !_type.isString(key) ||  key.length === 0 || key.trim().indexOf('$') === 0) return this; 
		 	
		 	if (value == undefined || value == null) { object[key] = null;}
		 	else if (_type.isString(value)) { object[key] = value; }
		 	else if (_type.isNumber(value) || _type.isBoolean(value)) { object[key] = value + ''; }
		 	else if (value instanceof Date) object[key] = global.Appacitive.Date.toISOString(value);
		 	else if (_type.isObject(value)) {
		 		if (_allowObjectSetOperations.indexOf(key) !== -1) {
		 		 	object[key] = value;
		 		} else {
		 			if (value instanceof global.Appacitive.GeoCoord) {
		 				object[key] = value.toString();
		 			} else {
		 				throw new Error("Property cannot have value as an object");
		 			}
		 		}
			} else if(_type.isArray(value)) {
				object[key] = [];

				value.forEach(function(v) {
					if (_type.isString(v)) { object[key].push(v); }
		 			else if (_type.isNumber(v) || _type.isBoolean(v)) { object[key].push(v + ''); }
		 			else if (v instanceof Date) object[key].push(global.Appacitive.Date.toISOString(v));
	 				else throw new Error("Multivalued property cannot have values of property as an object");
				});

				if (key !== 'tags' || key !== '__link') {
					object[key].push = function(v) {
					  	var len = this.length;
					  	if (_type.isString(v)) { this[len] = v; }
			 			else if (_type.isNumber(v) || _type.isBoolean(v)) { this[len] = v + ''; }
			 			else if (v instanceof Date) this[len] = global.Appacitive.Date.toISOString(v);
		 				else throw new Error("Multivalued property cannot have values of property as an object");
		 				return this; 
					}
				}
			}
		 	
		 	return this;
		};

		this.unset = function(key) {
			if (!key || !_type.isString(key) ||  key.length === 0 || key.indexOf('__') === 0) return this; 
		 	try { delete object[key]; } catch(e) {}
			return this;
		};

		this.has = function(key) {
			if (!key || !_type.isString(key) ||  key.length === 0) return false; 
			if (object[key] && !_type.isUndefined(object[key])) return true;
			return false;
		};

		this.isNew = function() {
			if (object.__id && object.__id.length) return false;
			return true;
		};

		this.clone = function() {
			if (this.type == 'object') return new global.Appacitive.Object(this.toJSON());
			return new global.Appacitive.connection(object);
		};

		this.copy = function(properties, setSnapShot) { 
			if (properties) { 
				_copy(properties, object);
				if (setSnapShot) {
					_copy(properties, _snapshot);
				}
			}
			return this;
		};

		this.mergeWithPrevious = function() {
			_copy(object, _snapshot);
			_removeTags = [];
			_atomicProps.length = 0;
			return this;
		};

		var _merge = function() {
			_copy(_snapshot, object);
			_removeTags = [];
			_atomicProps.length = 0;
		};

		this.rollback = function() {
			object = raw = {};
			_merge();
			return this;
		};

		var _atomic = function(key, amount, multiplier) {
			if (!key || !_type.isString(key) ||  key.length === 0 || key.indexOf('__') === 0) return this;

			if (!amount || isNaN(parseInt(amount))) amount = multiplier;
			else amount = parseInt(amount) * multiplier;

			_atomicProps.push({ key: key.toLowerCase(), amount: amount });
			return that;
		};

		this.increment = function(key, amount) {
			return _atomic(key, amount, 1);
		};

		this.decrement = function(key, amount) {
			return _atomic(key, amount, -1);
		};

		/* crud operations  */

		/* save
		   if the object has an id, then it has been created -> update
		   else create */
		this.save = function() {
			if (object.__id) return _update.apply(this, arguments);
			else return _create.apply(this, arguments);
		};

		// to create the object
		var _create = function(callbacks) {

			var type = that.type;
			if (object.__type &&  ( object.__type.toLowerCase() == 'user' ||  object.__type.toLowerCase() == 'device')) {
				type = object.__type.toLowerCase()
			}

			//remove __revision and aggregate poprerties
			for (var p in object) {
				if (p[0] == '$') delete object[p];
			}
			if (object["__revision"]) delete object["__revision"];
			
			var request = new global.Appacitive._Request({
				method: 'PUT',
				type: type,
				op: 'getCreateUrl',
				args: [object.__type || object.__relationtype, _fields],
				data: object,
				callbacks: callbacks,
				entity: that,
				onSuccess: function(data) {
					var savedState = null;
					if (data && (data.object || data.connection || data.user || data.device)) {
						savedState = data.object || data.connection || data.user || data.device;
					}
					if (data && savedState) {
						_snapshot = savedState;
						object.__id = savedState.__id;
						
						_merge();

						if (that.type == 'connection') that.parseConnection();
						global.Appacitive.eventManager.fire(that.entityType + '.' + that.type + '.created', that, { object : that });

						that.created = true;

						request.promise.fulfill(that);
					} else {
						global.Appacitive.eventManager.fire(that.entityType + '.' + that.type + '.createFailed', that, { error: data.status });
						request.promise.reject(data.status, that);
					}
				}
			});
				
			return request.send();
		};

		// to update the object
		var _update = function(callbacks, promise) {

			if (!global.Appacitive.Promise.is(promise)) promise = global.Appacitive.Promise.buildPromise(callbacks);

			var cb = function(revision) {
				var changeSet = _getChanged(true);
				for (var p in changeSet) {
					if (p[0] == '$') delete changeSet[p];
				}

				if (!Object.isEmpty(changeSet)) {

					var fields = _fields;

					var _updateRequest = new global.Appacitive.HttpRequest();
					var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory[that.type].getUpdateUrl(object.__type || object.__relationtype, (_snapshot.__id) ? _snapshot.__id : object.__id, fields, revision);
					
					var type = that.type;

					// for User and Device objects
					if (object && object.__type &&  ( object.__type.toLowerCase() == 'user' ||  object.__type.toLowerCase() == 'device')) { 
						type = object.__type.toLowerCase();
						url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory[object.__type.toLowerCase()].getUpdateUrl(_snapshot.__id, fields, revision);
					}
					_updateRequest.url = url;
					_updateRequest.method = 'post';
					_updateRequest.data = changeSet;
					_updateRequest.onSuccess = function(data) {
						if (data && data[type]) {
							_snapshot = data[type];
							
							_merge();
							
							delete that.created;
							
							global.Appacitive.eventManager.fire(that.entityType  + '.' + type + "." + object.__id +  '.updated', that, { object : that });
							promise.fulfill(that);
						} else {
							if (data.status.code == '14008' && _atomicProps.length > 0) {
								_update(callbacks, promise);
							}  else {
								global.Appacitive.eventManager.fire(that.entityType  + '.' + type + "." + object.__id +  '.updateFailed', that, { object : data.status });
								promise.reject(data.status, that);
							}
						}
					};
					_updateRequest.onError = function(err) {
						err = _getOutpuStatus(err);
						if (err.code == '14008' && _atomicProps.length > 0) {
							_update(callbacks, promise);
						} else {
							promise.reject(err, that);
						}
					};
					global.Appacitive.http.send(_updateRequest);
				} else {
					promise.fulfill(that);
				}
			};

			if (_atomicProps.length > 0) {
				var props = ['__revision'];
				_atomicProps.forEach(function(p) { 
					props.push(p.key); 
				});

				var args = { id: this.id(), fields: props };
				
				if (this.type == 'object') args.type = this.get('__type');
				else args.relation = this.get('__type');

				global.Appacitive[this.type == 'object' ? 'Article' : 'Connection']
					.get(args)
					.then(function(obj) {

						obj = obj.toJSON();
						_atomicProps.forEach(function(p) {
							var value = _types['integer'](obj[p.key]);
							if (!value) value = 0;
							that.set(p.key, value + p.amount);
						});

						cb(obj.__revision);
					}, function(err) {
						promise.reject(err);
					}); 
			} else cb();

			return promise;
		};

		var _fetch = function (callbacks) {

			if (!object.__id) throw new Error('Please specify id for get operation');
			
			var type = this.type;

			// for User and Device objects
			if (object && object.__type &&  ( object.__type.toLowerCase() == 'user' ||  object.__type.toLowerCase() == 'device')) { 
				type = object.__type.toLowerCase();
			}

			var request = new global.Appacitive._Request({
				method: 'GET',
				type: type,
				op: 'getGetUrl',
				args: [object.__type || object.__relationtype, object.__id, _fields],
				callbacks: callbacks,
				entity: that,
				onSuccess: function(data) {
					if (data && data[type]) {
						_snapshot = data[type];
						_copy(_snapshot, object);
						if (data.connection) {
							if (!that.endpoints && (!that.endpointA || !that.endpointB)) {
								that.setupConnection(object.__endpointa, object.__endpointb);
							}
						}
						request.promise.fulfill(that);
					} else {
						data = data || {};
						data.status =  data.status || {};
						data.status = _getOutpuStatus(data.status);
						request.promise.reject(data.status, that);
					}
				}
			});
			return request.send();
		};

		// fetch ( by id )
		this.fetch = function(callbacks) {
			return _fetch.apply(this ,[callbacks]);
		};

		// delete the object
		this.destroy = function(callbacks, deleteConnections) {
          
			if (_type.isBoolean(callbacks)) {
				deleteConnections = callbacks;
				callbacks = null;
			} else if(!_type.isBoolean(deleteConnections)) {
				deleteConnections = false;
			}

			// if the object does not have __id set, 
	        // just call success
	        // else delete the object

	        if (!object['__id']) return new global.Appacitive.Promise.buildPromise(callbacks).fulfill();

	        var type = this.type;
			if (object.__type &&  ( object.__type.toLowerCase() == 'user' ||  object.__type.toLowerCase() == 'device')) {
				type = object.__type.toLowerCase()
			}

			var request = new global.Appacitive._Request({
				method: 'DELETE',
				type: type,
				op: 'getDeleteUrl',
				args: [object.__type || object.__relationtype, object.__id, deleteConnections],
				callbacks: callbacks,
				entity: this,
				onSuccess: function(data) {
					request.promise.fulfill(data);
				}
			});
			return request.send();
		};
		this.del = this.destroy;
	};

	global.Appacitive.BaseObject = _BaseObject;

	global.Appacitive.BaseObject.prototype.toString = function() {
		return JSON.stringify(this.getObject());
	};

})(global);
(function (global) {

	"use strict";

	var S4 = function () {
		return Math.floor(Math.random() * 0x10000).toString(16);
	};

	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	var _utf8_encode = function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	};

	var encodeToBase64 = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}

		return output;
	};

	/**
	 * @constructor
	 **/
	global.Appacitive.GUID = function () {
		return encodeToBase64(
		S4() + S4() + "-" +
			S4() + "-" +
			S4() + "-" +
			S4() + "-" +
			S4() + S4() + S4()).toString();
	};

})(global);
(function (global) {

	"use strict";

	global.Appacitive.Object = function(options, setSnapShot) {
		options = options || {};

		if (_type.isString(options)) {
			var sName = options;
			options = { __type : sName };
		}

		if (!options.__type) throw new Error("Cannot set object without __type");
		
		global.Appacitive.BaseObject.call(this, options, setSnapShot);

		this.type = 'object';
		this.getObject = this.getObject;
		this.children = {};

		this.toJSON = function(recursive) {
			if (recursive) {
				var parseChildren = function(root) {
					var objects = [];
					root.forEach(function(obj) {
						var tmp = obj.getObject();
						if (obj.children && !Object.isEmpty(obj.children)) {
							tmp.children = {};
							for (var c in obj.children) {
								tmp.children[c] = parseChildren(obj.children[c]);
							}
						}
						if (obj.connection) tmp.__connection = obj.connection.toJSON();
						objects.push(tmp);
					});
					return objects;
				};
				return parseChildren([this])[0];
			} else {
				return this.getObject();
			}
		};
		return this;
	};

	global.Appacitive.Object.prototype = new global.Appacitive.BaseObject();

	global.Appacitive.Object.prototype.constructor = global.Appacitive.Object;

	//private function for parsing objects
	var _parseObjects = function(objects) {
		var tmpObjects = [];
		objects.forEach(function(a) {
			tmpObjects.push(new global.Appacitive.Object(a, true));
		});
		return tmpObjects;
	};

	global.Appacitive._parseObjects = _parseObjects;

	global.Appacitive.Object.multiDelete = function(options, callbacks) {
		options = options || {};
		if (!options.type || !_type.isString(options.type) || options.type.length === 0) throw new Error("Specify valid type");
		if (options.type.toLowerCase() === 'user' || options.type.toLowerCase() === 'device') throw new Error("Cannot delete user and devices using multidelete");
		if (!options.ids || options.ids.length === 0) throw new Error("Specify ids to delete");

		var request = new global.Appacitive._Request({
			method: 'POST',
			data: { idlist : options.ids },
			type: 'object',
			op: 'getMultiDeleteUrl',
			args: [options.type],
			callbacks: callbacks,
			onSuccess: function(d) {
				request.promise.fulfill();
			}
		});
		
		return request.send();
	};


	//takes relationaname and array of objectids and returns an array of Appacitive object objects
	global.Appacitive.Object.multiGet = function(options, callbacks) {
		options = options || {};
		if (!options.type || !_type.isString(options.type) || options.type.length === 0) throw new Error("Specify valid type");
		if (!options.ids || options.ids.length === 0) throw new Error("Specify ids to delete");

		var request = new global.Appacitive._Request({
			method: 'GET',
			type: 'object',
			op: 'getMultiGetUrl',
			args: [options.type, options.ids.join(','), options.fields],
			callbacks: callbacks,
			onSuccess: function(d) {
				request.promise.fulfill(_parseObjects(d.objects));
			}
		});
			
		return request.send();
	};

	//takes object id , type and fields and returns that object
	global.Appacitive.Object.get = function(options, callbacks) {
		options = options || {};
		if (!options.type) throw new Error("Specify type");
		if (!options.id) throw new Error("Specify id to fetch");

		var obj = {};
		if (options.type.toLowerCase() === 'user') obj = new global.Appacitive.User({ __id: options.id });
		else obj = new global.Appacitive.Object({ __type: options.type, __id: options.id });
		
		obj.fields = options.fields;

		return obj.fetch(callbacks);
	};

    //takes relation type and returns query for it
	global.Appacitive.Object.prototype.getConnections = function(options) {
		if (this.isNew()) throw new Error("Cannot fetch connections for new object");
		options.objectId = this.get('__id');
		return new global.Appacitive.Queries.GetConnectionsQuery(options);
	};

	//takes relation type and returns a query for it
	global.Appacitive.Object.prototype.getConnectedObjects = function(options) {
		if (this.isNew()) throw new Error("Cannot fetch connections for new object");
		options = options || {};
		if (_type.isString(options)) options = { relation: options };
		options.type = this.get('__type');
		options.objectId = this.get('__id');
		options.object = this;
		return new global.Appacitive.Queries.ConnectedObjectsQuery(options);
	};
	global.Appacitive.Object.prototype.fetchConnectedObjects = global.Appacitive.Object.prototype.getConnectedObjects;
	
	// takes type and return a query for it
	global.Appacitive.Object.findAll = function(options) {
		return new global.Appacitive.Queries.FindAllQuery(options);
	};

})(global);
(function (global) {

	"use strict";

	var _parseEndpoint = function(endpoint, type, base) {
		var result = { label: endpoint.label };
		if (endpoint.objectid)  result.objectid = endpoint.objectid;
		if (endpoint.object) {
			if (_type.isFunction(endpoint.object.getObject)) {
				// provided an instance of Appacitive.ObjectCollection
				// stick the whole object if there is no __id
				// else just stick the __id
				if (endpoint.object.get('__id')) result.objectid = endpoint.object.get('__id');
				else result.object = endpoint.object.getObject();
			} else if (_type.isObject(endpoint.object)) {
				// provided a raw object
				// if there is an __id, just add that
				// else add the entire object
				if (endpoint.object.__id) result.objectid = endpoint.object.__id;
				else result.object = endpoint.object;

				endpoint.object =  new global.Appacitive.Object(endpoint.object);
			} 
		} else {
			if (!result.objectid && !result.object) throw new Error('Incorrectly configured endpoints provided to setupConnection');
		}

		base["endpoint" + type] = endpoint;
		return result;
	};

	var _convertEndpoint = function(endpoint, type, base) {
		if ( endpoint.object && _type.isObject(endpoint.object)) {
			if (!base['endpoint' + type]) {
				base["endpoint" + type] = {};
				base['endpoint' + type].object = new global.Appacitive.Object(endpoint.object, true);
			} else {
				if (base['endpoint' + type] && base['endpoint' + type].object && base['endpoint' + type].object instanceof global.Appacitive.Object)
					base["endpoint" + type].object.copy(endpoint.object, true);
				else 
					base['endpoint' + type].object = new global.Appacitive.Object(endpoint.object, true);
			}
			base["endpoint" + type].objectid = endpoint.object.__id;
			base["endpoint" + type].label = endpoint.label;
			base["endpoint" + type].type = endpoint.type;
		} else {
			base["endpoint" + type] = endpoint;
		}
	};

	global.Appacitive.Connection = function(options, doNotSetup) {
		options = options || {};
		
		if (_type.isString(options)) {
			var rName = options;
			options = { __relationtype : rName };
		}

		if (!options.__relationtype && !options.relation ) throw new Error("Cannot set connection without relation");

		if (options.relation) {
			options.__relationtype = options.relation;
			delete options.relation;
		}

		if (options.endpoints && options.endpoints.length === 2) {
			options.__endpointa = options.endpoints[0];
			options.__endpointb = options.endpoints[1];
			delete options.endpoints;
		}

		global.Appacitive.BaseObject.call(this, options, doNotSetup);
		this.type = 'connection';
		this.getConnection = this.getObject;

		this.parseConnection = function() {
			
			var typeA = 'A', typeB ='B';
			if ( options.__endpointa.label.toLowerCase() === this.get('__endpointb').label.toLowerCase() ) {
				if ((options.__endpointa.label.toLowerCase() != options.__endpointb.label.toLowerCase()) && (options.__endpointa.objectid == this.get('__endpointb').objectid || !options.__endpointa.objectid)) {
				 	typeA = 'B';
				 	typeB = 'A';
				}
			}

			_convertEndpoint(this.get('__endpointa'), typeA, this);
			_convertEndpoint(this.get('__endpointb'), typeB, this);

			this.endpoints = function() {
				if (arguments.length === 1 && _type.isString(arguments[0])) {
					if (this.endpointA.label.toLowerCase() === arguments[0].toLowerCase()) return this.endpointA;
					else if (this.endpointB.label.toLowerCase() === arguments[0].toLowerCase()) return this.endpointB;
					else throw new Error("Invalid label provided");
				}
				var endpoints = [];
				endpoints.push(this.endpointA);
				endpoints.push(this.endpointB);
				return endpoints;
			};

			return this;
		};

		if (doNotSetup) {
			this.parseConnection(options);
		} else {
			if (options.__endpointa && options.__endpointb) this.setupConnection(this.get('__endpointa'), this.get('__endpointb'));
		} 

		return this;
	};

	global.Appacitive.Connection.prototype = new global.Appacitive.BaseObject();

	global.Appacitive.Connection.prototype.constructor = global.Appacitive.Connection;

	global.Appacitive.Connection.prototype.setupConnection = function(endpointA, endpointB) {
		
		// validate the endpoints
		if (!endpointA || (!endpointA.objectid &&  !endpointA.object) || !endpointA.label || !endpointB || (!endpointB.objectid && !endpointB.object) || !endpointB.label) {
			throw new Error('Incorrect endpoints configuration passed.');
		}

		// there are two ways to do this
		// either we are provided the object id
		// or a raw object
		// or an Appacitive.Object instance
		// sigh
		
		// 1
		this.set('__endpointa', _parseEndpoint(endpointA, 'A', this));

		// 2
		this.set('__endpointb', _parseEndpoint(endpointB, 'B', this));

		// 3
		this.endpoints = function() {

			if (arguments.length === 1 && _type.isString(arguments[0])) {
				if (this.endpointA.label.toLowerCase() === arguments[0].toLowerCase()) return this.endpointA;
				else if (this.endpointB.label.toLowerCase() === arguments[0].toLowerCase()) return this.endpointB;
				else throw new Error("Invalid label provided");
			}

			var endpoints = [];
			endpoints.push(this.endpointA);
			endpoints.push(this.endpointB);
			return endpoints;
		};

	};

	global.Appacitive.Connection.get = function(options, callbacks) {
		options = options || {};
		if (!options.relation) throw new Error("Specify relation");
		if (!options.id) throw new Error("Specify id to fetch");
		var obj = new global.Appacitive.Connection({ __relationtype: options.relation, __id: options.id });
		obj.fields = options.fields;
		return obj.fetch(callbacks);
	};

    //private function for parsing api connections in sdk connection object
	var _parseConnections = function(connections) {
		var connectionObjects = [];
		if (!connections) connections = [];
		connections.forEach(function(c){
			connectionObjects.push(new global.Appacitive.Connection(c, true));
		});
		return connectionObjects;
	};

	global.Appacitive.Connection._parseConnections = _parseConnections;

	//takes relationname and array of connectionids and returns an array of Appacitive object objects
	global.Appacitive.Connection.multiGet = function(options, callbacks) {
		options = options || {};
		if (!options.relation || !_type.isString(options.relation) || options.relation.length === 0) throw new Error("Specify valid relation");
		if (!options.ids || options.ids.length === 0) throw new Error("Specify ids to delete");

		var request = new global.Appacitive._Request({
			method: 'GET',
			type: 'connection',
			op: 'getMultiGetUrl',
			args: [options.relation, options.ids.join(','), options.fields],
			callbacks: callbacks,
			onSuccess: function(d) {
				request.promise.fulfill(_parseConnections(d.connections));
			}
		});
			
		return request.send();
	};

	//takes relationame, and array of connections ids
	global.Appacitive.Connection.multiDelete = function(options, callbacks) {
		options = options || {};
		
		if (!options.relation || !_type.isString(options.relation) || options.relation.length === 0) throw new Error("Specify valid relation");
		if (!options.ids || options.ids.length === 0) throw new Error("Specify ids to get");
		
		var request = new global.Appacitive._Request({
			method: 'POST',
			data: { idlist : options.ids },
			type: 'connection',
			op: 'getMultiDeleteUrl',
			args: [options.relation],
			callbacks: callbacks,
			onSuccess: function(d) {
				request.promise.fulfill();
			}
		});
		
		return request.send();
	};

	//takes relation type and returns all connections for it
	global.Appacitive.Connection.findAll = function(options) {
		return new global.Appacitive.Queries.FindAllQuery(options);
	};

	//takes 1 objectid and multiple aricleids and returns connections between both 
	global.Appacitive.Connection.getInterconnects = function(options) {
		return new global.Appacitive.Queries.InterconnectsQuery(options);
	};

	//takes 2 objectids and returns connections between them
	global.Appacitive.Connection.getBetweenObjects = function(options) {
		return new global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery(options);
	};

	//takes 2 objects and returns connections between them of particluar relationtype
	global.Appacitive.Connection.getBetweenObjectsForRelation = function(options) {
		return new global.Appacitive.Queries.GetConnectionsBetweenObjectsForRelationQuery(options);
	};

})(global);
(function (global) {

	"use strict";

	var UserManager = function() {

		var _authenticatedUser = null;

		this.current = function() {
			return _authenticatedUser;
		};

		this.currentUser = this.current;

		var _updatePassword = function(oldPassword, newPassword, callbacks) {
			var userId = this.get('__id');
			if (!userId || !_type.isString(userId) || userId.length === 0) throw new Error("Please specify valid userid");
			if (!oldPassword || !_type.isString(oldPassword) || oldPassword.length === 0) throw new Error("Please specify valid oldPassword");
			if (!newPassword || !_type.isString(newPassword) || newPassword.length === 0) throw new Error("Please specify valid newPassword");

			var updatedPasswordOptions = { oldpassword : oldPassword, newpassword: newPassword };
			
			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'user',
				op: 'getUpdatePasswordUrl',
				args: [userId],
				callbacks: callbacks,
				data: updatedPasswordOptions,
				entity: this,
				onSuccess: function(data) {
					request.promise.fulfill(that);
				}
			});
			return request.send();
		};

		var _link = function(link, callbacks) {
			var userId = this.get('__id');

			if (!this.get('__id')) {
				this.set('__link', link);
				return global.Appacitive.Promise.buildPromise(callbacks).fulfill(this);
			}

			var that = this;

			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'user',
				op: 'getLinkAccountUrl',
				args: [userId],
				callbacks: callbacks,
				data: link,
				entity: this,
				onSuccess: function(data) {
					var links = that.get('__link');
					if (!_type.isArray(links)) {
						links = (links) ? [links] : [];
					}
					links.push(link);
					that.copy({__link: links }, true);
					request.promise.fulfill(that);
				}
			});
			return request.send();
		};

		this.setCurrentUser = function(user, token, expiry) {
			if (!user) throw new Error('Cannot set null object as user');
			var userObject = user;
			
			if (!(userObject instanceof global.Appacitive.User)) userObject = new global.Appacitive.User(user, true); 
			else if (!userObject.get('__id') || userObject.get('__id').length === 0) throw new Error('Specify user __id');
			else user = userObject.toJSON(); 

			global.Appacitive.localStorage.set('Appacitive-User', user);
			if (!expiry) expiry = 60;
			_authenticatedUser = userObject;

			if (token) global.Appacitive.Session.setUserAuthHeader(token, expiry);

			_authenticatedUser.logout = function(callback) { return global.Appacitive.Users.logout(callback); };

			_authenticatedUser.updatePassword = function(oldPassword, newPassword, callbacks) {
				return _updatePassword.apply(this, [oldPassword, newPassword, callbacks]);
			};

			_authenticatedUser.logout = function(callback) { return global.Appacitive.Users.logout(callback); };

			global.Appacitive.eventManager.clearAndSubscribe('type.user.' + userObject.get('__id') + '.updated', function(sender, args) {
				global.Appacitive.localStorage.set('Appacitive-User', args.object.getObject());
			});

			return _authenticatedUser;
		};
		
		global.Appacitive.User = function(options) {
			options = options || {};
			options.__type = 'user';
			global.Appacitive.Object.call(this, options);
			return this;
		};

		global.Appacitive.User.prototype = new global.Appacitive.Object('user');

		global.Appacitive.User.prototype.constructor = global.Appacitive.User;

		//getter to get linkedaccounts
		global.Appacitive.User.prototype.linkedAccounts = function() {
			
			var accounts = this.get('__link');
			
			if (!accounts) accounts = [];
			else if (!_type.isArray(accounts)) accounts = [accounts];
			
			return accounts;
		};

		//method for getting all linked accounts
		global.Appacitive.User.prototype.getAllLinkedAccounts = function(callbacks) {
			var userId = this.get('__id');
			
			if (!userId || !_type.isString(userId) || userId.length === 0) {
				return global.Appacitive.Promise.buildPromise(callbacks).fulfill(this.linkedAccounts(), this);
			}

			var that = this;

			var request = new global.Appacitive._Request({
				method: 'GET',
				type: 'user',
				op: 'getGetAllLinkedAccountsUrl',
				args: [userId],
				callbacks: callbacks,
				entity: this,
				onSuccess: function() {
					var accounts = a.identities || []; 
					if (accounts.length > 0) that.set('__link', accounts);
					else that.set('__link', null);
					
					request.promise.fulfill(accounts, that);
				}
			});
			return request.send();
		};

		global.Appacitive.User.prototype.checkin = function(coords, callbacks) {
			var userId = this.get('__id');
			if (!userId || !_type.isString(userId) || userId.length === 0) {
				if (onSuccess && _type.isFunction(onSuccess)) onSuccess();
			}
			if (!coords || !(coords instanceof global.Appacitive.GeoCoord)) throw new Error("Invalid coordinates provided");

			var that = this;

			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'user',
				op: 'getCheckinUrl',
				args: [userId, coords.lat, coords.lngerId],
				callbacks: callbacks,
				entity: this,
				onSuccess: function() {
					request.promise.fulfill(that);
				}
			});
			return request.send();
		};

		//method for linking facebook account to a user
		global.Appacitive.User.prototype.linkFacebook = function(accessToken, callbacks) {
			
			if (!accessToken || !_type.isString(accessToken)) throw new Error("Please provide accessToken");

			var payload = {
				"authtype": "facebook",
				"accesstoken": accessToken,
				"name": "facebook"
			};

			return _link.apply(this, [payload, callbacks]);
		};

		//method for linking twitter account to a user
		global.Appacitive.User.prototype.linkTwitter = function(twitterObj, callbacks) {
			
			if (!_type.isObject(twitterObj) || !twitterObj.oAuthToken  || !twitterObj.oAuthTokenSecret) throw new Error("Twitter Token and Token Secret required for linking");
			
			var payload = {
				"authtype": "twitter",
				"oauthtoken": twitterObj.oAuthToken ,
				"oauthtokensecret": twitterObj.oAuthTokenSecret
			};

			if (twitterObj.consumerKey && twitterObj.consumerSecret) {
				payload.consumersecret = twitterObj.consumerSecret;
				payload.consumerkey = twitterObj.consumerKey;
			}

			return _link.apply(this, [payload, callbacks]);
		};

		//method to unlink an oauth account
		global.Appacitive.User.prototype.unlink = function(name, callbacks) {
			
			if (!_.isString(name)) throw new Error("Specify aouth account type for unlinking");

			var userId = this.get('__id');

			if (!this.get('__id')) {
				this.set('__link', null);
				promise.fulfill(this);
				return promise;
			}

			var that = this;

			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'user',
				op: 'getDelinkAccountUrl',
				args: [userId, name],
				callbacks: callbacks,
				entity: this,
				onSuccess: function(a) {
					var accounts = that.get('__link');
			
					if (!accounts) accounts = [];
					else if (!_type.isArray(accounts)) accounts = [accounts];

					if (accounts.length >= 0) {
						var ind = null;
						accounts.forEach(function(a, i) {
							if (a.name == name.toLowerCase()) {
								ind = i;
								return;
							}
						});
						if (ind != null) accounts.splice(ind, 1);
						that.copy({ __link: accounts }, true);
					} else {
						that.copy({ __link: [] }, true);
					}

					request.promise.fulfill(that);
				}
			});
			return request.send();
		};

		global.Appacitive.User.prototype.clone = function() {
			return new global.Appacitive.User(this.getObject());
		};

		this.deleteUser = function(userId, callbacks) {
			if (!userId) throw new Error('Specify userid for user delete');
			return new global.Appacitive.Object({ __type: 'user', __id: userId }).del(true, callbacks);
		};

		this.deleteCurrentUser = function(callbacks) {
			
			var promise = global.Appacitive.Promise.buildPromise(callbacks);

			var _callback = function() {
				global.Appacitive.Session.removeUserAuthHeader();
				promise.fulfill();
			};

			if (_authenticatedUser === null) { 
				_callback();
				return promise;
			}

			var currentUserId = _authenticatedUser.get('__id');
			
			this.deleteUser(currentUserId).then(function() { 
				_authenticatedUser = null;
				_callback();
			}, function() { 
				promise.reject(arguments);
			});

			return promise;
		};

		this.createNewUser = function(user, callbacks) {
			user = user || {};
			user.__type = 'user';
			if (!user.username || !user.password || !user.firstname || user.username.length === 0 || user.password.length === 0 || user.firstname.length === 0) 
				throw new Error('username, password and firstname are mandatory');

			return new global.Appacitive.User(user).save(callbacks);
		};
		this.createUser = this.createNewUser;

		//method to allow user to signup and then login 
		this.signup = function(user, callbacks) {
			var that = this;
			var promise = global.Appacitive.Promise.buildPromise(callbacks);

			this.createUser(user).then(function() {
				that.login(user.username, user.password).then(function() {
					promise.fulfill.apply(promise, arguments);
				}, function(staus) {
					promise.reject.apply(promise, arguments);
				});
			}, function() {
				promise.reject(arguments);
			});

			return promise;
		};

		//authenticate user with authrequest that contains username , password and expiry
		this.authenticateUser = function(authRequest, callbacks, provider) {

			if (!authRequest.expiry) authRequest.expiry = 86400000;
			var that = this;

			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'user',
				op: 'getAuthenticateUserUrl',
				callbacks: callbacks,
				data: authRequest,
				onSuccess: function(data) {
					if (data && data.user) {
						if (provider) data.user.__authType = provider;
						that.setCurrentUser(data.user, data.token, authRequest.expiry);
						request.promise.fulfill({ user : _authenticatedUser, token: data.token });
					} else {
						request.promise.reject(data.status);
					}
				}
			});
			return request.send();
		};

		//An overrride for user login with username and password directly
		this.login = function(username, password, callbacks) {

			if (!username || !password || username.length ==0 || password.length == 0) throw new Error('Please specify username and password');

			var authRequest = {
				username : username,
				password: password,
				expiry: 86400000
			};

			return this.authenticateUser(authRequest, callbacks, 'BASIC');
		};

		this.loginWithFacebook = function(accessToken, callbacks) {
			
			if (!accessToken || !_type.isString(accessToken)) throw new Error("Please provide accessToken");

			var authRequest = {
				"accesstoken": accessToken,
				"type": "facebook",
				"expiry": 86400000,
				"createnew": true
			};

			return this.authenticateUser(authRequest, callbacks, 'FB');
		};

		this.loginWithTwitter = function(twitterObj, callbacks) {
			
			if (!_type.isObject(twitterObj) || !twitterObj.oAuthToken  || !twitterObj.oAuthTokenSecret) throw new Error("Twitter Token and Token Secret required for linking");
			
			var authRequest = {
				"type": "twitter",
				"oauthtoken": twitterObj.oAuthToken ,
				"oauthtokensecret": twitterObj.oAuthTokenSecret,
				"expiry": 86400000,
				"createnew": true
			};

			if (twitterObj.consumerKey && twitterObj.consumerSecret) {
				authRequest.consumersecret = twitterObj.consumerSecret;
				authRequest.consumerkey = twitterObj.consumerKey;
			}

			return this.authenticateUser(authRequest, callbacks, 'TWITTER');
		};

		this.validateCurrentUser = function(avoidApiCall, callback) {

			var promise = global.Appacitive.Promise.buildPromise({ success: callback });

			if (callback && _type.isBoolean(callback)) {
				avoidApiCall = callback;
				callback = function() {}; 
			}

			var token = global.Appacitive.Cookie.readCookie('Appacitive-UserToken');

			if (!token) {
				promise.fulfill(false);
				return promise;
			}

			if (!avoidApiCall) {
				try {
					var that = this;
					this.getUserByToken(token).then(function(user) {
						that.setCurrentUser(user, token);
						promise.fulfill(true);
					}, function() {
						promise.fulfill(false);
					});
				} catch (e) { 
					promise.fulfill(false);
				}
			} else {
				promise.fulfill(true);
			}

			return promise;
		};

		var _getUserByIdType = function(op, args, callbacks) {
			var request = new global.Appacitive._Request({
				method: 'GET',
				type: 'user',
				op: op,
				callbacks: callbacks,
				args: args,
				onSuccess: function(data) {
					if (data && data.user) request.promise.fulfill(new global.Appacitive.User(data.user));
					else request.promise.reject(data.status);
				}
			});
			return request.send();
		};

		this.getUserByToken = function(token, callbacks) {
			if (!token || !_type.isString(token) || token.length === 0) throw new Error("Please specify valid token");
			global.Appacitive.Session.setUserAuthHeader(token, 0, true);
			return _getUserByIdType("getUserByTokenUrl", [token], callbacks);
		};

		this.getUserByUsername = function(username, callbacks) {
			if (!username || !_type.isString(username) || username.length === 0) throw new Error("Please specify valid username");
			return _getUserByIdType("getUserByUsernameUrl", [username], callbacks);
		};

		this.logout = function(makeApiCall) {
			_authenticatedUser = null;
			return global.Appacitive.Session.removeUserAuthHeader(makeApiCall);
		};

		this.sendResetPasswordEmail = function(username, subject, callbacks) {

			if (!username || !_type.isString(username)  || username.length === 0) throw new Error("Please specify valid username");
			if (!subject || !_type.isString(subject) || subject.length === 0) throw new Error('Plase specify subject for email');

			var passwordResetOptions = { username: username, subject: subject };

			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'user',
				op: 'getSendResetPasswordEmailUrl',
				callbacks: callbacks,
				data: passwordResetOptions,
				onSuccess: function() {
					request.promise.fulfill();
				}
			});
			return request.send();
		};

		this.resetPassword = function(token, newPassword, callbacks) {

			if (!token) throw new Error("Please specify token");
			if (!newPassword || newPassword.length === 0) throw new Error("Please specify password");

			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'user',
				op: 'getResetPasswordUrl',
				callbacks: callbacks,
				data: { newpassword: newPassword },
				args: [token],
				onSuccess: function() {
					request.promise.fulfill();
				}
			});
			return request.send();
		};

		this.validateResetPasswordToken = function(token, callbacks) {
			
			if (!token) throw new Error("Please specify token");

			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'user',
				op: 'getValidateResetPasswordUrl',
				callbacks: callbacks,
				data: {},
				args: [token],
				onSuccess: function(a) {
					request.promise.fulfill(a.user);
				}
			});
			return request.send();
		};
	};

	global.Appacitive.Users = new UserManager();

})(global);
(function (global) {

 	"use strict";

    var _browserFacebook = function() {

		var _accessToken = null;

		var _initialized = true;

		var _app_id = null;

		this.initialize = function(options) {
		  if (!FB) throw "Facebook SDK needs be loaded before calling initialize.";
		  if (!options.appId) throw new Error("Please provide appid");
		  _app_id = options.appId;
		  FB.init(options);
		  _initialized = true;
		};

		this.requestLogin = function(scope) {

			scope = scope || {};

			if (!_initialized) throw new Error("Either facebook sdk has not yet been initialized, or not yet loaded.");
		    var promise = new Appacitive.Promise();
			FB.login(function(response) {
				if (response && response.status === 'connected' && response.authResponse) {
					_accessToken = response.authResponse.accessToken;
					promise.fulfill(response.authResponse);
				} else {
					promise.reject();
				}
			}, scope);

			return promise;
		};

		this.getCurrentUserInfo = function() {
			if (!_initialized) throw new Error("Either facebook sdk has not yet been initialized, or not yet loaded.");
			var promise = new Appacitive.Promise();
			
			FB.api('/me', function(response) {
				if (response && !response.error) {
					_accessToken = FB.getAuthResponse().accessToken;
					promise.fulfill(response);
				} else {
					promise.reject();
				}
			});

			return promise;
		};

		this.accessToken = function() {
			if (arguments.length === 1) {
				_accessToken = arguments[0];
				return this;
			}
			return _accessToken;
		};

		this.getProfilePictureUrl = function(username) {
			return 'https://graph.facebook.com/' + username + '/picture';
		};

		this.logout = function() {
			_accessToken = null;
			var promise = new Appacitive.Promise();
			
			try {
				FB.logout(function() {
					global.Appacitive.Users.logout();
					promise.fulfill();
				});
			} catch(e) {
				promise.reject(e.message);
			}

			return promise;
		};
	};

	var _nodeFacebook = function() {

		var _accessToken = null;

		this.FB = null;

		var _app_id = null;

		var _app_secret = null;

		var _initialized = false;

		this.initialize = function (options) { 
			if (!Facebook) throw new Error("node-facebook SDK needs be loaded before calling initialize.");
			if (!options.appId) throw new Error("Please provide appid");
			if (!options.appSecret) throw new Error("Please provide app secret");

			_app_id = options.appId;
			_app_secret = options.appSecret;
		    this.FB = new (require('facebook-node-sdk'))({ appId: _appId, secret: _app_secret });
		    _initialized = true;
		};

		this.requestLogin = function(accessToken) {
			if (accessToken) _accessToken = accessToken;
			return new Appacitive.Promise().fulfill();
		};

		this.getCurrentUserInfo = function() {
			if (!_initialized) throw new Error("Either facebook sdk has not yet been initialized, or not yet loaded.");

			var promise = new Appacitive.Promise();

			if (this.FB && _accessToken) {
				this.FB.api('/me', function(err, response) {
					if (response) {
						promise.fulfill(response);
					} else {
						promise.reject("Access token is invalid");
					}
				});
			} else {
				promise.reject("Either intialize facebook with your appid and appsecret or set accesstoken");
			}

			return promise;
		};

		this.accessToken = function() {
			if (arguments.length === 1) {
				_accessToken = arguments[0];
				return this;
			}
			return _accessToken;
		};

		this.getProfilePictureUrl = function(username) {
			return 'https://graph.facebook.com/' + username + '/picture';
		};

		this.logout = function() {
			global.Appacitive.Facebook.accessToken = "";
			return new Appacitive.Promise().fulfill();
		};
	};

	global.Appacitive.Facebook = global.Appacitive.runtime.isBrowser ? new _browserFacebook() : new _nodeFacebook();

})(global);
(function (global) {

	"use strict";

	var _emailManager = function() {

		var config = {
			smtp: {
				username: null,
				password: null,
				host: "smtp.gmail.com",
				port: 465,
				enablessl: true
			},
			from: null,
			replyto: null
		};

		this.getConfig = function() {
			var _copy = config;
			return _copy;
		};

		var _sendEmail = function (email, callbacks) {
			
			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'email',
				op: 'getSendEmailUrl',
				callbacks: callbacks,
				data: email,
				entity: email,
				onSuccess: function(d) {
					request.promise.fulfill(d.email);
				}
			});
			return request.send();
		};

		this.setupEmail = function(options) {
			options = options || {};
			config.smtp.username = options.username || config.smtp.username;
			config.from = options.from || config.from;
			config.smtp.password = options.password || config.smtp.password;
			config.smtp.host = options.smtp.host || config.smtp.host;
			config.smtp.port = options.smtp.port || config.smtp.port;
			config.smtp.enablessl = options.enableSSL || config.smtp.enablessl;
			config.replyto = options.replyTo || config.replyto;
		};


		this.sendTemplatedEmail = function(options, callbacks) {
			
			if (!options || !options.to || !options.to.length || options.to.length === 0) {
				throw new Error('Atleast one receipient is mandatory to send an email');
			}
			if (!options.subject || options.subject.trim().length === 0) {
				throw new Error('Subject is mandatory to send an email');
			}

			if(!options.from && config.from) {
				throw new Error('from is mandatory to send an email. Set it in config or send it in options on the portal');
			} 

			if (!options.templateName) {
				throw new Error('template name is mandatory to send an email');
			}

			var email = {
				to: options.to || [],
				cc: options.cc || [],
				bcc: options.bcc || [],
				subject: options.subject,
				from: options.from,
				body: {
					templatename: options.templateName || '',
					data : options.data || {},
					ishtml: (options.isHtml === false) ? false : true
				}
			};

			if (options.useConfig) {
				email.smtp = config.smtp;
				if(!options.from && !config.from) {
					throw new Error('from is mandatory to send an email. Set it in config or send it in options');
				}
				email.from = options.from || config.from;
				email.replyto = options.replyTo || config.replyto;
			}

			return _sendEmail(email, callbacks);
		};

		this.sendRawEmail = function(options, callbacks) {

			if (!options || !options.to || !options.to.length || options.to.length === 0) {
				throw new Error('Atleast one receipient is mandatory to send an email');
			}
			if (!options.subject || options.subject.trim().length === 0) {
				throw new Error('Subject is mandatory to send an email');
			}

			if(!options.from && config.from) {
				throw new Error('from is mandatory to send an email. Set it in config or send it in options on the portal');
			} 

			if (!options.body) {
				throw new Error('body is mandatory to send an email');
			} 

			var email = {
				to: options.to || [],
				cc: options.cc || [],
				bcc: options.bcc || [],
				subject: options.subject,
				from: options.from,
				body: {
					content: options.body || '',
					ishtml: (options.isHtml === false) ? false : true
				}
			};

			if (options.useConfig) {
				email.smtp = config.smtp;
				if(!options.from && !config.from) {
					throw new Error('from is mandatory to send an email. Set it in config or send it in options');
				}
				email.from = options.from || config.from;
				email.replyto = options.replyTo || config.replyto;
			}

			return _sendEmail(email, callbacks);
		};

	};

	global.Appacitive.Email = new _emailManager();

})(global);
(function (global) {

	"use strict";

	var _pushManager = function() {

		this.send = function(options, callbacks) {
			
			if (!options) throw new Error("Please specify push options");

			var request = new global.Appacitive._Request({
				method: 'POST',
				type: 'push',
				op: 'getPushUrl',
				callbacks: callbacks,
				data: options,
				entity: options,
				onSuccess: function(d) {
					request.promise.fulfill(d.id);
				}
			});
			return request.send();
		};

		this.getNotification = function(notificationId, callbacks) {

			if (!notificationId) throw new Error("Please specify notification id");

			var request = new global.Appacitive._Request({
				method: 'GET',
				type: 'push',
				op: 'getGetNotificationUrl',
				args: [notificationId],
				callbacks: callbacks,
				onSuccess: function(d) {
					request.promise.fulfill(d.pushnotification);
				}
			});
			return request.send();
		};

		this.getAllNotifications = function(pagingInfo, callbacks) {
			
			if (!pagingInfo)
				pagingInfo = { pnum: 1, psize: 20 };
			else {
				pagingInfo.pnum = pagingInfo.pnum || 1;
				pagingInfo.psize = pagingInfo.psize || 20;
			}

			var request = new global.Appacitive._Request({
				method: 'GET',
				type: 'push',
				op: 'getGetAllNotificationsUrl',
				args: [pagingInfo],
				callbacks: callbacks,
				onSuccess: function(d) {
					request.promise.fulfill(d.pushnotifications, d.paginginfo);
				}
			});
			return request.send();
		};

	};

	global.Appacitive.Push = new _pushManager();

})(global);
(function (global) {

  "use strict";

  var _file = function(options) {
      
      options = options || {}; 
      this.fileId = options.fileId;
      this.contentType = options.contentType;
      this.fileData = options.fileData;
      var that = this;

      var _getUrls = function(url, onSuccess, promise) {
          var request = new global.Appacitive.HttpRequest();
          request.url = url;
          request.method = 'GET';
          request.onSuccess = onSuccess;
          request.promise = promise;
          request.entity = that;
          global.Appacitive.http.send(request); 
      };

      var _upload = function(url, file, type, onSuccess, promise) {
          var fd = new FormData();
          fd.append("fileToUpload", file);
          var request = new global.Appacitive.HttpRequest();
          request.url = url;
          request.method = 'PUT';
          request.data = file;
          request.headers.push({ key:'content-type', value: type });
          request.onSuccess = onSuccess;
          request.send().then(onSuccess, function() {
            promise.reject(d, that);
          });
      };

      this.save = function(callbacks) {
        if (this.fileId && _type.isString(this.fileId) && this.fileId.length > 0)
          return _update(callbacks);
        else
          return _create(callbacks);
      };

      var _create = function(callbacks) {
          if (!that.fileData) throw new Error('Please specify filedata');
          if(!that.contentType) {
            try { that.contentType = that.fileData.type; } catch(e) {}
          }
          if (!that.contentType || !_type.isString(that.contentType) || that.contentType.length === 0) that.contentType = 'text/plain';
          
          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getUploadUrl(that.contentType, that.fileId ? that.fileId : '');
         
          _getUrls(url, function(response) {
                _upload(response.url, that.fileData, that.contentType, function() {
                    that.fileId = response.id;
                    
                    that.getDownloadUrl(function(res) {
                      return promise.fulfill(res, that);
                    }, function(e) {
                      return promise.reject(e);
                    });

                }, promise);
          }, promise);

          return promise;
      };

      var _update = function(callbacks) {
          if (!that.fileData) throw new Error('Please specify filedata');
          if(!that.contentType) {
            try { that.contentType = that.fileData.type; } catch(e) {}
          }
          if (!that.contentType || !_type.isString(that.contentType) || that.contentType.length === 0) that.contentType = 'text/plain';
          
          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getUpdateUrl(that.fileId, that.contentType);
          
          _getUrls(url, function(response) {
              _upload(response.url, that.fileData, that.contentType, function() {
                  
                  that.getDownloadUrl().then(function(res) {
                    promise.fulfill(res, that);
                  }, function(e) {
                    promise.reject(e);
                  });

              }, promise);
          }, promise);

          return promise;
      };

      this.deleteFile = function(callbacks) {
          if (!this.fileId) throw new Error('Please specify fileId to delete');

          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var request = new global.Appacitive.HttpRequest();
          request.url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getDeleteUrl(this.fileId);
          request.method = 'DELETE';

          request.onSuccess = function(response) {
              promise.fulfill();
          };
          request.promise = promise;
          request.entity = that;
          return global.Appacitive.http.send(request); 
      };

      this.getDownloadUrl = function(callbacks) {
          if (!this.fileId) throw new Error('Please specify fileId to download');
          var expiry = 5560000;
          
          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getDownloadUrl(this.fileId, expiry);
 
          _getUrls(url, function(response) {
              that.url = response.uri;
              promise.fulfill(response.uri);
          }, promise);

          return promise;
      };

      this.getUploadUrl = function(callbacks) {
          if (!that.contentType || !_type.isString(that.contentType) || that.contentType.length === 0) that.contentType = 'text/plain';

          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getUploadUrl(this.contentType, this.fileId ? this.fileId : '');

          _getUrls(url, function(response) {
              that.url = response.url;
              promise.fulfill(response.url, that);
          }, promise);

          return promise;
      };
  };

  global.Appacitive.File = _file;

}(global));
(function (global) {
  
  "use strict";

  global.Appacitive.Date = {};

  var pad = function (n) {
      if (n < 10) return '0' + n;
      return n;
  };

  global.Appacitive.Date.parseISODate = function (str) {
    try {
        var regexp = new RegExp("^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})" + "T" + "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" + "(.([0-9]+))?" + "Z?$");

        if (!regexp.exec(str)) return new Date(str);
          
        var parts = str.split('T'),
          dateParts = parts[0].split('-'),
          timeParts = parts[1].split('Z'),
          timeSubParts = timeParts[0].split(':'),
          timeSecParts = timeSubParts[2].split('.'),
          timeHours = Number(timeSubParts[0]),
          date = new Date();

        date.setUTCFullYear(Number(dateParts[0]));
        date.setUTCMonth(Number(dateParts[1])-1);
        date.setUTCDate(Number(dateParts[2]));
        
        date.setUTCHours(Number(timeHours));
        date.setUTCMinutes(Number(timeSubParts[1]));
        date.setUTCSeconds(Number(timeSecParts[0]));
        if (timeSecParts[1]) date.setUTCMilliseconds(Number(timeSecParts[1].substring(0, 3)));

        return date;
    } catch(e) {return null;}
  };

  global.Appacitive.Date.toISOString = function (date) {
    try {
      date = date.toISOString();
      date = date.replace('Z','0000Z');
      return date;
    } catch(e) { return null;}
  };

  global.Appacitive.Date.toISODate = function(date) {
    if (date instanceof Date) return String.format("{0}-{1}-{2}", date.getFullYear(), pad((date.getMonth() + 1)), pad(date.getDate()));
    throw new Error("Invalid date provided Appacitive.Date.toISODate method");
  };

  global.Appacitive.Date.toISOTime = function(date) {
    var padMilliseconds = function (n) {
                if (n < 10) return n + '000000';
           else if (n < 100) return n + '00000';
           else if (n < 1000) return n + '0000';
           else if (n < 10000) return n + '000';
           else if (n < 100000) return n + '00';
           else if (n < 1000000) return n + '0';
           return n;
    };
    if (date instanceof Date) return String.format("{0}:{1}:{2}.{3}", pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()), padMilliseconds(date.getMilliseconds()));
    throw new Error("Invalid date provided Appacitive.Date.toISOTime method");
  };

  global.Appacitive.Date.parseISOTime = function(str) {
    try {
      var date = new Date();
    
      var parts = str.split('T');
      if (parts.length === 1) parts.push(parts[0]);
      
      var regexp = new RegExp("^([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" + "(.([0-9]+))?" + "Z?$");
      if (!regexp.exec(parts[1])) {
         return null;
      }

      var timeParts = parts[1].split('Z'),
      timeSubParts = timeParts[0].split(':'),
      timeSecParts = timeSubParts[2].split('.'),
      timeHours = Number(timeSubParts[0]);
      
      if (parts.length > 1) {
        date.setUTCHours(Number(timeHours));
        date.setUTCMinutes(Number(timeSubParts[1]));
        date.setUTCSeconds(Number(timeSecParts[0]));
        if (timeSecParts[1]) date.setUTCMilliseconds(Number(timeSecParts[1].substring(0, 3)));
      } else {
        date.setHours(Number(timeHours));
        date.setMinutes(Number(timeSubParts[1]));
        date.setSeconds(Number(timeSecParts[0]));
        if (timeSecParts[1]) date.setMilliseconds(Number(timeSecParts[1].substring(0, 3)));
      }

      return date;
    } catch(e) {return null;}
  };

})(global);
(function (global) {

	"use strict";

	if (global.Appacitive.runtime.isBrowser) {

		var A_LocalStorage = function() {

			var _localStorage = (global.Appacitive.runtime.isBrowser) ? window.localStorage : { getItem: function() { return null; } };

			this.set = function(key, value) {
				value = value || '';
				if (!key) return false;

			    if (_type.isObject(value) || _type.isArray(value)) {
			    	try {
				      value = JSON.stringify(value);
				    } catch(e){}
			    }
			    key = global.Appacitive.getAppPrefix(key);

				_localStorage[key] = value;
				return this;
			};

			this.get = function(key) {
				if (!key) return null;

				key = global.Appacitive.getAppPrefix(key);

				var value = _localStorage.getItem(key);
			   	if (!value) { return null; }

			    // assume it is an object that has been stringified
			    if (value[0] === "{") {
			    	try {
				      value = JSON.parse(value);
				    } catch(e){}
			    }

			    return value;
			};
			
			this.remove = function(key) {
				if (!key) return;
				key = global.Appacitive.getAppPrefix(key);
				try { delete _localStorage[key]; } catch(e){}
			};
		};
		global.Appacitive.localStorage = new A_LocalStorage();

	} else {
		var A_LocalStorage = function() {
			
            var _localStorage = [];

            this.set = function(key, value) {
                value = value || '';
                if (!key || _type.isString(key)) return false;

                key = global.Appacitive.getAppPrefix(key);

                _localStorage[key] = value;
                return this;
            };

            this.get = function(key) {
                if (!key || _type.isString(key)) return null;

                key = global.Appacitive.getAppPrefix(key);

                var value = _localStorage[key];
	            if (!value) { return null; }

                return value;
            };
            
            this.remove = function(key) {
                if (!key || _type.isString(key)) return;
                key = global.Appacitive.getAppPrefix(key);
                try { delete _localStorage[key]; } catch(e){}
            };
        };

        global.Appacitive.localStorage = new A_LocalStorage();
	}
})(global);
(function (global) {

"use strict";

if (global.Appacitive.runtime.isBrowser) {

	var _cookieManager = function () {

		this.setCookie = function (name, value, minutes, erase) {
			name = global.Appacitive.getAppPrefix(name);
			var expires = '';
			if (minutes) {
				var date = new Date();
				date.setTime(date.getTime() + (minutes*60*1000));
				expires = "; expires=" + date.toGMTString();
			}

			if (!erase) {
				//for now lets make this a session cookie if it is not an erase
				if (!global.Appacitive.Session.persistUserToken) expires = '';
				else expires = "; expires=" +  new Date("2020-12-31").toGMTString();
			} else {
				expires = '; expires=Thu, 01-Jan-1970 00:00:01 GMT';
			}
			var domain = 'domain=' + window.location.hostname;
			if (window.location.hostname == 'localhost') domain = '';
			
			document.cookie = name + "=" + value + expires + "; path=/;" + domain;
		};

		this.readCookie = function (name) {
			name = global.Appacitive.getAppPrefix(name);
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i=0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		};

		this.eraseCookie = function (name) {
			this.setCookie(name, "" ,-1, true);
		};

	};

	global.Appacitive.Cookie = new _cookieManager();

} else {
	var _cookieManager = function () {

	        this.setCookie = function (name, value) {
	                global.Appacitive.localStorage.set( 'cookie/' + name, value);
	        };

	        this.readCookie = function (name) {
	                return global.Appacitive.localStorage.get( 'cookie/' + name);
	        };

	        this.eraseCookie = function (name) {
	                global.Appacitive.localStorage.remove( 'cookie/' + name);
	        };

	};
	global.Appacitive.Cookie = new _cookieManager();
}

})(global);

if (typeof module !== 'undefined' && !global.Appacitive.runtime.isBrowser) module.exports =  global.Appacitive;
