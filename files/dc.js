(function() {
  /**
   * @param {number} data
   * @param {number} deepDataAndEvents
   * @return {?}
   */
  function dataAttr(data, deepDataAndEvents) {
    switch(deepDataAndEvents) {
      case 0:
        return "" + data;
      case 1:
        return 1 * data;
      case 2:
        return!!data;
      case 3:
        return 1E3 * data;
    }
    return data;
  }
  /**
   * @param {?} arg
   * @return {?}
   */
  function isFunction(arg) {
    return "function" == typeof arg;
  }
  /**
   * @param {Object} value
   * @return {?}
   */
  function isString(value) {
    return void 0 != value && -1 < (value.constructor + "").indexOf("String");
  }
  /**
   * @param {string} value
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  function expect(value, dataAndEvents) {
    return void 0 == value || ("-" == value && !dataAndEvents || "" == value);
  }
  /**
   * @param {string} str
   * @return {?}
   */
  function trim(str) {
    if (!str || "" == str) {
      return "";
    }
    for (;str && -1 < " \n\r\t".indexOf(str.charAt(0));) {
      str = str.substring(1);
    }
    for (;str && -1 < " \n\r\t".indexOf(str.charAt(str.length - 1));) {
      str = str.substring(0, str.length - 1);
    }
    return str;
  }
  /**
   * @return {?}
   */
  function done() {
    return Math.round(2147483647 * Math.random());
  }
  /**
   * @return {undefined}
   */
  function noop() {
  }
  /**
   * @param {string} key
   * @param {boolean} prefix
   * @return {?}
   */
  function escape(key, prefix) {
    if (encodeURIComponent instanceof Function) {
      return prefix ? encodeURI(key) : encodeURIComponent(key);
    }
    replace(68);
    return escape(key);
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function split(key) {
    key = key.split("+").join(" ");
    if (decodeURIComponent instanceof Function) {
      try {
        return decodeURIComponent(key);
      } catch (b) {
        replace(17);
      }
    } else {
      replace(68);
    }
    return unescape(key);
  }
  /**
   * @param {string} path
   * @param {string} uri
   * @return {?}
   */
  function loadScript(path, uri) {
    if (path) {
      /** @type {Element} */
      var el = doc.createElement("script");
      /** @type {string} */
      el.type = "text/javascript";
      /** @type {boolean} */
      el.async = true;
      /** @type {string} */
      el.src = path;
      /** @type {string} */
      el.id = uri;
      var insertAt = doc.getElementsByTagName("script")[0];
      insertAt.parentNode.insertBefore(el, insertAt);
      return el;
    }
  }
  /**
   * @param {string} args
   * @return {?}
   */
  function require(args) {
    return args && 0 < args.length ? args[0] : "";
  }
  /**
   * @param {Array} collection
   * @return {?}
   */
  function forEach(collection) {
    var length = collection ? collection.length : 0;
    return 0 < length ? collection[length - 1] : "";
  }
  /**
   * @param {string} s
   * @return {?}
   */
  function gsub(s) {
    if (0 == s.indexOf("www.")) {
      s = s.substring(4);
    }
    return s.toLowerCase();
  }
  /**
   * @param {string} path
   * @param {boolean} recurring
   * @return {?}
   */
  function select(path, recurring) {
    var index;
    var data = {
      url : path,
      protocol : "http",
      host : "",
      path : "",
      R : new Node,
      anchor : ""
    };
    if (!path) {
      return data;
    }
    index = path.indexOf("://");
    if (0 <= index) {
      data.protocol = path.substring(0, index);
      path = path.substring(index + 3);
    }
    index = path.search("/|\\?|#");
    if (0 <= index) {
      data.host = path.substring(0, index).toLowerCase();
      path = path.substring(index);
    } else {
      return data.host = path.toLowerCase(), data;
    }
    index = path.indexOf("#");
    if (0 <= index) {
      data.anchor = path.substring(index + 1);
      path = path.substring(0, index);
    }
    index = path.indexOf("?");
    if (0 <= index) {
      remove(data.R, path.substring(index + 1));
      path = path.substring(0, index);
    }
    if (data.anchor) {
      if (recurring) {
        remove(data.R, data.anchor);
      }
    }
    if (path) {
      if ("/" == path.charAt(0)) {
        path = path.substring(1);
      }
    }
    /** @type {string} */
    data.path = path;
    return data;
  }
  /**
   * @param {string} url
   * @param {Object} b
   * @return {?}
   */
  function parseURL(url, b) {
    /**
     * @param {(Object|string)} url
     * @return {?}
     */
    function match(url) {
      var b = (url.hostname || "").split(":")[0].toLowerCase();
      var val = (url.protocol || "").toLowerCase();
      /** @type {(number|string)} */
      val = 1 * url.port || ("http:" == val ? 80 : "https:" == val ? 443 : "");
      url = url.pathname || "";
      if (!(0 == url.indexOf("/"))) {
        /** @type {string} */
        url = "/" + url;
      }
      return[b, "" + val, url];
    }
    var a = b || doc.createElement("a");
    /** @type {string} */
    a.href = doc.location.href;
    var host = (a.protocol || "").toLowerCase();
    var m = match(a);
    var home = a.search || "";
    var fullUrl = host + "//" + m[0] + (m[1] ? ":" + m[1] : "");
    if (0 == url.indexOf("//")) {
      url = host + url;
    } else {
      if (0 == url.indexOf("/")) {
        url = fullUrl + url;
      } else {
        if (url && 0 != url.indexOf("?")) {
          if (0 > url.split("/")[0].indexOf(":")) {
            /** @type {string} */
            url = fullUrl + m[2].substring(0, m[2].lastIndexOf("/")) + "/" + url;
          }
        } else {
          url = fullUrl + m[2] + (url || home);
        }
      }
    }
    /** @type {string} */
    a.href = url;
    host = match(a);
    return{
      protocol : (a.protocol || "").toLowerCase(),
      host : host[0],
      port : host[1],
      path : host[2],
      Oa : a.search || "",
      url : url || ""
    };
  }
  /**
   * @param {Object} entry
   * @param {(number|string)} selector
   * @return {undefined}
   */
  function remove(entry, selector) {
    /**
     * @param {?} storageKey
     * @param {string} fake
     * @return {undefined}
     */
    function add(storageKey, fake) {
      if (!entry.contains(storageKey)) {
        entry.set(storageKey, []);
      }
      entry.get(storageKey).push(fake);
    }
    var parms = trim(selector).split("&");
    /** @type {number} */
    var i = 0;
    for (;i < parms.length;i++) {
      if (parms[i]) {
        var indexOfEquals = parms[i].indexOf("=");
        if (0 > indexOfEquals) {
          add(parms[i], "1");
        } else {
          add(parms[i].substring(0, indexOfEquals), parms[i].substring(indexOfEquals + 1));
        }
      }
    }
  }
  /**
   * @param {string} selector
   * @param {string} params
   * @return {?}
   */
  function _(selector, params) {
    if (expect(selector) || "[" == selector.charAt(0) && "]" == selector.charAt(selector.length - 1)) {
      return "-";
    }
    /** @type {string} */
    var id = doc.domain;
    return selector.indexOf(id + (params && "/" != params ? params : "")) == (0 == selector.indexOf("http://") ? 7 : 0 == selector.indexOf("https://") ? 8 : 0) ? "0" : selector;
  }
  /**
   * @param {(Array|string)} results
   * @param {string} value
   * @param {?} file
   * @return {undefined}
   */
  function add(results, value, file) {
    if (!(1 <= Qa)) {
      if (!(1 <= 100 * Math.random())) {
        if (!isEmpty()) {
          /** @type {Array} */
          results = ["utmt=error", "utmerr=" + results, "utmwv=5.6.7dc", "utmn=" + done(), "utmsp=1"];
          if (value) {
            results.push("api=" + value);
          }
          if (file) {
            results.push("msg=" + escape(file.substring(0, 100)));
          }
          if (node.w) {
            results.push("aip=1");
          }
          preload(results.join("&"));
          Qa++;
        }
      }
    }
  }
  /**
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  function parseInt(dataAndEvents) {
    return jQuery("x" + NOW++, dataAndEvents);
  }
  /**
   * @param {string} key
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  function jQuery(key, dataAndEvents) {
    /** @type {boolean} */
    $cookies[key] = !!dataAndEvents;
    return key;
  }
  /**
   * @param {?} storageKey
   * @return {?}
   */
  function params(storageKey) {
    var storage = this.plugins_;
    if (storage) {
      return storage.get(storageKey);
    }
  }
  /**
   * @param {string} id
   * @param {Array} resultItems
   * @return {?}
   */
  function getName(id, resultItems) {
    resultItems = resultItems || [];
    /** @type {number} */
    var i = 0;
    for (;i < resultItems.length;i++) {
      var result = resultItems[i];
      if ("" + id == result || 0 == result.indexOf(id + ".")) {
        return result;
      }
    }
    return "-";
  }
  /**
   * @param {Object} e
   * @return {undefined}
   */
  function blur(e) {
    if (100 != e.get(k)) {
      if (e.get(o) % 1E4 >= 100 * e.get(k)) {
        e.stopPropagation();
      }
    }
  }
  /**
   * @param {Object} evt
   * @return {undefined}
   */
  function close(evt) {
    if (isEmpty(evt.get(key))) {
      evt.stopPropagation();
    }
  }
  /**
   * @param {?} evt
   * @return {undefined}
   */
  function _track(evt) {
    if ("file:" == doc.location.protocol) {
      evt.stopPropagation();
    }
  }
  /**
   * @param {?} e
   * @return {undefined}
   */
  function which(e) {
    if (preview()) {
      e.stopPropagation();
    }
  }
  /**
   * @param {HTMLElement} test
   * @return {undefined}
   */
  function onSuccess(test) {
    if (!test.get(storageKey)) {
      test.set(storageKey, doc.title, true);
    }
    if (!test.get(path)) {
      test.set(path, doc.location.pathname + doc.location.search, true);
    }
  }
  /**
   * @param {Object} evt
   * @return {undefined}
   */
  function click(evt) {
    if (!(evt.get(key) && "UA-XXXXX-X" != evt.get(key))) {
      evt.stopPropagation();
    }
  }
  /**
   * @param {number} opt_attributes
   * @return {undefined}
   */
  function replace(opt_attributes) {
    exports.set(opt_attributes);
  }
  /**
   * @param {?} str
   * @return {?}
   */
  function encodeURIComponent(str) {
    return "string" == typeof str;
  }
  /**
   * @param {number} value
   * @return {?}
   */
  function isNumber(value) {
    return!("number" == typeof value || void 0 != Number && value instanceof Number) || (Math.round(value) != value || (isNaN(value) || Infinity == value)) ? false : true;
  }
  /**
   * @param {string} number
   * @return {?}
   */
  function call(number) {
    /** @type {number} */
    var ret = 1;
    /** @type {number} */
    var chr = 0;
    var i;
    if (number) {
      /** @type {number} */
      ret = 0;
      /** @type {number} */
      i = number.length - 1;
      for (;0 <= i;i--) {
        chr = number.charCodeAt(i);
        ret = (ret << 6 & 268435455) + chr + (chr << 14);
        /** @type {number} */
        chr = ret & 266338304;
        ret = 0 != chr ? ret ^ chr >> 21 : ret;
      }
    }
    return ret;
  }
  var item;
  /**
   * @param {HTMLElement} obj
   * @param {string} type
   * @param {Function} fn
   * @param {boolean} useCapture
   * @return {undefined}
   */
  var addEvent = function(obj, type, fn, useCapture) {
    if (obj.addEventListener) {
      obj.addEventListener(type, fn, !!useCapture);
    } else {
      if (obj.attachEvent) {
        obj.attachEvent("on" + type, fn);
      }
    }
  };
  /**
   * @return {undefined}
   */
  var Node = function() {
    /** @type {string} */
    this.prefix = "ga.";
    this.values = {};
  };
  /**
   * @param {?} key
   * @param {?} value
   * @return {undefined}
   */
  Node.prototype.set = function(key, value) {
    this.values[this.prefix + key] = value;
  };
  /**
   * @param {?} key
   * @return {?}
   */
  Node.prototype.get = function(key) {
    return this.values[this.prefix + key];
  };
  /**
   * @param {?} key
   * @return {?}
   */
  Node.prototype.contains = function(key) {
    return void 0 !== this.get(key);
  };
  /** @type {number} */
  var Qa = 0;
  /** @type {number} */
  var NOW = 0;
  var $cookies = {};
  var key = parseInt();
  var span = jQuery("anonymizeIp");
  var md = parseInt();
  var third = parseInt();
  var value = parseInt();
  var selector = parseInt();
  var elem = parseInt();
  var attr = parseInt();
  var i = parseInt();
  var r = parseInt();
  var prop = parseInt();
  var actualKey = parseInt();
  var callee = parseInt();
  var key1 = parseInt();
  var name = parseInt();
  var modalInstance = parseInt();
  var attrs = parseInt();
  var key2 = parseInt();
  var p = parseInt();
  var version = parseInt();
  var offsetParent = parseInt();
  var target = parseInt();
  var subKey = parseInt();
  var ast = parseInt();
  var ms = parseInt();
  var opt_key = parseInt();
  var k = parseInt();
  var KEY = parseInt();
  var input = parseInt();
  var methods = parseInt();
  var sid = parseInt();
  var idx = parseInt();
  var val = parseInt();
  var type = parseInt();
  var ctx = parseInt();
  var index = parseInt();
  var data = parseInt(true);
  var root = jQuery("currencyCode");
  var path = jQuery("page");
  var storageKey = jQuery("title");
  var parentNode = parseInt();
  var CACHE_KEY = parseInt();
  var expireKey = parseInt();
  var serverAttrs = parseInt();
  var field = parseInt();
  var testKey = parseInt();
  var localStorageName = parseInt();
  var foo = parseInt();
  var group = parseInt();
  var o = parseInt(true);
  var handle = parseInt(true);
  var state = parseInt(true);
  var needle = parseInt(true);
  var tag = parseInt(true);
  var href = parseInt(true);
  var properties = parseInt(true);
  var x = parseInt(true);
  var instance = parseInt(true);
  var arg = parseInt(true);
  var expr = parseInt(true);
  var disabled = parseInt(true);
  var pos = parseInt(true);
  var width = parseInt(true);
  var height = parseInt(true);
  var j = parseInt(true);
  var child = parseInt(true);
  var props = parseInt(true);
  var length = parseInt(true);
  var cur = parseInt(true);
  var eventType = parseInt(true);
  var camelKey = parseInt(true);
  var message = parseInt(true);
  var valueKey = parseInt(true);
  var later = parseInt(true);
  var result = parseInt(true);
  var events = parseInt(true);
  var rel = jQuery("campaignParams");
  var n = parseInt();
  var paramName = jQuery("hitCallback");
  var keys = parseInt();
  parseInt();
  var pn = parseInt();
  var parent = parseInt();
  var time = parseInt();
  var query = parseInt();
  var primaryKey = parseInt();
  var part = parseInt();
  var hash = parseInt();
  var contextKey = parseInt();
  var count = parseInt();
  var indexKey = parseInt();
  var uuid = parseInt();
  var d = parseInt();
  var file = parseInt();
  var url = parseInt();
  parseInt();
  var img = parseInt();
  var id = parseInt();
  var b = parseInt();
  var a = parseInt();
  var first = parseInt();
  var c = jQuery("utmtCookieName");
  var targets = jQuery("displayFeatures");
  var button = parseInt();
  var code = jQuery("gtmid");
  var newIndex = jQuery("uaName");
  var cacheKey = jQuery("uaDomain");
  var script = jQuery("uaPath");
  var second = jQuery("linkid");
  /**
   * @return {undefined}
   */
  var iterate = function() {
    /**
     * @param {string} properties
     * @param {Function} source
     * @param {number} opt_attributes
     * @return {undefined}
     */
    function mixin(properties, source, opt_attributes) {
      extend(loop.prototype, properties, source, opt_attributes);
    }
    mixin("_createTracker", loop.prototype.hb, 55);
    mixin("_getTracker", loop.prototype.oa, 0);
    mixin("_getTrackerByName", loop.prototype.u, 51);
    mixin("_getTrackers", loop.prototype.pa, 130);
    mixin("_anonymizeIp", loop.prototype.aa, 16);
    mixin("_forceSSL", loop.prototype.la, 125);
    mixin("_getPlugin", params, 120);
  };
  /**
   * @return {undefined}
   */
  var _createScriptTag = function() {
    /**
     * @param {string} params
     * @param {Function} id
     * @param {number} opt_attributes
     * @return {undefined}
     */
    function when(params, id, opt_attributes) {
      extend($.prototype, params, id, opt_attributes);
    }
    hasOwn("_getName", third, 58);
    hasOwn("_getAccount", key, 64);
    hasOwn("_visitCode", o, 54);
    hasOwn("_getClientInfo", name, 53, 1);
    hasOwn("_getDetectTitle", key2, 56, 1);
    hasOwn("_getDetectFlash", modalInstance, 65, 1);
    hasOwn("_getLocalGifPath", KEY, 57);
    hasOwn("_getServiceMode", input, 59);
    debug("_setClientInfo", name, 66, 2);
    debug("_setAccount", key, 3);
    debug("_setNamespace", md, 48);
    debug("_setAllowLinker", actualKey, 11, 2);
    debug("_setDetectFlash", modalInstance, 61, 2);
    debug("_setDetectTitle", key2, 62, 2);
    debug("_setLocalGifPath", KEY, 46, 0);
    debug("_setLocalServerMode", input, 92, void 0, 0);
    debug("_setRemoteServerMode", input, 63, void 0, 1);
    debug("_setLocalRemoteServerMode", input, 47, void 0, 2);
    debug("_setSampleRate", k, 45, 1);
    debug("_setCampaignTrack", attrs, 36, 2);
    debug("_setAllowAnchor", callee, 7, 2);
    debug("_setCampNameKey", version, 41);
    debug("_setCampContentKey", ms, 38);
    debug("_setCampIdKey", p, 39);
    debug("_setCampMediumKey", subKey, 40);
    debug("_setCampNOKey", opt_key, 42);
    debug("_setCampSourceKey", target, 43);
    debug("_setCampTermKey", ast, 44);
    debug("_setCampCIdKey", offsetParent, 37);
    debug("_setCookiePath", attr, 9, 0);
    debug("_setMaxCustomVariables", methods, 0, 1);
    debug("_setVisitorCookieTimeout", i, 28, 1);
    debug("_setSessionCookieTimeout", r, 26, 1);
    debug("_setCampaignCookieTimeout", prop, 29, 1);
    debug("_setReferrerOverride", parentNode, 49);
    debug("_setSiteSpeedSampleRate", count, 132);
    when("_trackPageview", $.prototype.Fa, 1);
    when("_trackEvent", $.prototype.F, 4);
    when("_trackPageLoadTime", $.prototype.Ea, 100);
    when("_trackSocial", $.prototype.Ga, 104);
    when("_trackTrans", $.prototype.Ia, 18);
    when("_sendXEvent", $.prototype.ib, 78);
    when("_createEventTracker", $.prototype.ia, 74);
    when("_getVersion", $.prototype.qa, 60);
    when("_setDomainName", $.prototype.B, 6);
    when("_setAllowHash", $.prototype.va, 8);
    when("_getLinkerUrl", $.prototype.na, 52);
    when("_link", $.prototype.link, 101);
    when("_linkByPost", $.prototype.ua, 102);
    when("_setTrans", $.prototype.za, 20);
    when("_addTrans", $.prototype.$, 21);
    when("_addItem", $.prototype.Y, 19);
    when("_clearTrans", $.prototype.ea, 105);
    when("_setTransactionDelim", $.prototype.Aa, 82);
    when("_setCustomVar", $.prototype.wa, 10);
    when("_deleteCustomVar", $.prototype.ka, 35);
    when("_getVisitorCustomVar", $.prototype.ra, 50);
    when("_setXKey", $.prototype.Ca, 83);
    when("_setXValue", $.prototype.Da, 84);
    when("_getXKey", $.prototype.sa, 76);
    when("_getXValue", $.prototype.ta, 77);
    when("_clearXKey", $.prototype.fa, 72);
    when("_clearXValue", $.prototype.ga, 73);
    when("_createXObj", $.prototype.ja, 75);
    when("_addIgnoredOrganic", $.prototype.W, 15);
    when("_clearIgnoredOrganic", $.prototype.ba, 97);
    when("_addIgnoredRef", $.prototype.X, 31);
    when("_clearIgnoredRef", $.prototype.ca, 32);
    when("_addOrganic", $.prototype.Z, 14);
    when("_clearOrganic", $.prototype.da, 70);
    when("_cookiePathCopy", $.prototype.ha, 30);
    when("_get", $.prototype.ma, 106);
    when("_set", $.prototype.xa, 107);
    when("_addEventListener", $.prototype.addEventListener, 108);
    when("_removeEventListener", $.prototype.removeEventListener, 109);
    when("_addDevId", $.prototype.V);
    when("_getPlugin", params, 122);
    when("_setPageGroup", $.prototype.ya, 126);
    when("_trackTiming", $.prototype.Ha, 124);
    when("_initData", $.prototype.initData, 2);
    when("_setVar", $.prototype.Ba, 22);
    debug("_setSessionTimeout", r, 27, 3);
    debug("_setCookieTimeout", prop, 25, 3);
    debug("_setCookiePersistence", i, 24, 1);
    when("_setAutoTrackOutbound", noop, 79);
    when("_setTrackOutboundSubdomains", noop, 81);
    when("_setHrefExamineLimit", noop, 80);
  };
  /**
   * @param {?} o
   * @param {string} b
   * @param {Function} s
   * @param {number} opt_attributes
   * @return {undefined}
   */
  var extend = function(o, b, s, opt_attributes) {
    /**
     * @return {?}
     */
    o[b] = function() {
      try {
        return void 0 != opt_attributes && replace(opt_attributes), s.apply(this, arguments);
      } catch (packageInfo) {
        throw add("exc", b, packageInfo && packageInfo.name), packageInfo;
      }
    };
  };
  /**
   * @param {string} event
   * @param {?} key
   * @param {number} opt_attributes
   * @param {number} deepDataAndEvents
   * @return {undefined}
   */
  var hasOwn = function(event, key, opt_attributes, deepDataAndEvents) {
    /**
     * @return {?}
     */
    $.prototype[event] = function() {
      try {
        return replace(opt_attributes), dataAttr(this.a.get(key), deepDataAndEvents);
      } catch (packageInfo) {
        throw add("exc", event, packageInfo && packageInfo.name), packageInfo;
      }
    };
  };
  /**
   * @param {string} event
   * @param {?} key
   * @param {number} opt_attributes
   * @param {number} expectedNumberOfNonCommentArgs
   * @param {number} isXML
   * @return {undefined}
   */
  var debug = function(event, key, opt_attributes, expectedNumberOfNonCommentArgs, isXML) {
    /**
     * @param {number} xml
     * @return {undefined}
     */
    $.prototype[event] = function(xml) {
      try {
        replace(opt_attributes);
        if (void 0 == isXML) {
          this.a.set(key, dataAttr(xml, expectedNumberOfNonCommentArgs));
        } else {
          this.a.set(key, isXML);
        }
      } catch (packageInfo) {
        throw add("exc", event, packageInfo && packageInfo.name), packageInfo;
      }
    };
  };
  /**
   * @param {Object} opts
   * @param {string} eventName
   * @return {?}
   */
  var makeKeyEvent = function(opts, eventName) {
    return{
      type : eventName,
      target : opts,
      /**
       * @return {?}
       */
      stopPropagation : function() {
        throw "aborted";
      }
    };
  };
  /** @type {RegExp} */
  var rPrefix = new RegExp(/(^|\.)doubleclick\.net$/i);
  /**
   * @param {string} name
   * @param {Object} keepData
   * @return {?}
   */
  var getData = function(name, keepData) {
    return rPrefix.test(doc.location.hostname) ? true : "/" !== keepData ? false : 0 != name.indexOf("www.google.") && (0 != name.indexOf(".google.") && 0 != name.indexOf("google.")) || -1 < name.indexOf("google.org") ? false : true;
  };
  /**
   * @param {Object} e
   * @return {undefined}
   */
  var stop = function(e) {
    var elem = e.get(selector);
    var name = e.c(attr, "/");
    if (getData(elem, name)) {
      e.stopPropagation();
    }
  };
  /**
   * @return {undefined}
   */
  var Storage = function() {
    var flags = {};
    var _cache = {};
    var self = new F;
    /**
     * @param {string} k
     * @param {Function} node
     * @return {undefined}
     */
    this.g = function(k, node) {
      self.add(k, node);
    };
    var instance = new F;
    /**
     * @param {string} name
     * @param {Function} callback
     * @return {undefined}
     */
    this.v = function(name, callback) {
      instance.add(name, callback);
    };
    /** @type {boolean} */
    var e = false;
    /** @type {boolean} */
    var f = false;
    /** @type {boolean} */
    var Be = true;
    /**
     * @return {undefined}
     */
    this.T = function() {
      /** @type {boolean} */
      e = true;
    };
    /**
     * @param {string} value
     * @return {undefined}
     */
    this.j = function(value) {
      this.load();
      this.set(n, value, true);
      value = new bump(this);
      /** @type {boolean} */
      e = false;
      instance.cb(this);
      /** @type {boolean} */
      e = true;
      _cache = {};
      this.gb();
      value.Ja();
    };
    /**
     * @return {undefined}
     */
    this.load = function() {
      if (e) {
        /** @type {boolean} */
        e = false;
        this.Ka();
        send(this);
        if (!f) {
          /** @type {boolean} */
          f = true;
          self.cb(this);
          onload(this);
          send(this);
        }
        /** @type {boolean} */
        e = true;
      }
    };
    /**
     * @return {undefined}
     */
    this.gb = function() {
      if (e) {
        if (f) {
          /** @type {boolean} */
          e = false;
          onload(this);
          /** @type {boolean} */
          e = true;
        } else {
          this.load();
        }
      }
    };
    /**
     * @param {?} key
     * @return {?}
     */
    this.get = function(key) {
      if ($cookies[key]) {
        this.load();
      }
      return void 0 !== _cache[key] ? _cache[key] : flags[key];
    };
    /**
     * @param {?} key
     * @param {?} value
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    this.set = function(key, value, dataAndEvents) {
      if ($cookies[key]) {
        this.load();
      }
      if (dataAndEvents) {
        _cache[key] = value;
      } else {
        flags[key] = value;
      }
      if ($cookies[key]) {
        this.gb();
      }
    };
    /**
     * @param {?} key
     * @return {undefined}
     */
    this.Za = function(key) {
      flags[key] = this.b(key, 0) + 1;
    };
    /**
     * @param {?} key
     * @param {number} recurring
     * @return {?}
     */
    this.b = function(key, recurring) {
      var data = this.get(key);
      return void 0 == data || "" === data ? recurring : 1 * data;
    };
    /**
     * @param {?} key
     * @param {string} str
     * @return {?}
     */
    this.c = function(key, str) {
      var val = this.get(key);
      return void 0 == val ? str : val + "";
    };
    /**
     * @return {undefined}
     */
    this.Ka = function() {
      if (Be) {
        var node = this.c(selector, "");
        var name = this.c(attr, "/");
        if (!getData(node, name)) {
          flags[elem] = flags[key1] && "" != node ? call(node) : 1;
          /** @type {boolean} */
          Be = false;
        }
      }
    };
  };
  /**
   * @return {?}
   */
  Storage.prototype.stopPropagation = function() {
    throw "aborted";
  };
  /**
   * @param {HTMLElement} data_user
   * @return {undefined}
   */
  var bump = function(data_user) {
    var udataCur = this;
    /** @type {number} */
    this.fb = 0;
    var debouncedIncr = data_user.get(paramName);
    /**
     * @return {undefined}
     */
    this.Ua = function() {
      if (0 < udataCur.fb) {
        if (debouncedIncr) {
          udataCur.fb--;
          if (!udataCur.fb) {
            debouncedIncr();
          }
        }
      }
    };
    /**
     * @return {undefined}
     */
    this.Ja = function() {
      if (!udataCur.fb) {
        if (debouncedIncr) {
          setTimeout(debouncedIncr, 10);
        }
      }
    };
    data_user.set(keys, udataCur, true);
  };
  /**
   * @param {Object} node
   * @param {(number|string)} func
   * @param {boolean} value
   * @return {?}
   */
  var each = function(node, func, value) {
    value = value ? "" : node.c(elem, "1");
    func = func.split(".");
    if (6 !== func.length || indexOf(func[0], value)) {
      return false;
    }
    /** @type {number} */
    value = 1 * func[1];
    /** @type {number} */
    var udataCur = 1 * func[2];
    /** @type {number} */
    var pdataCur = 1 * func[3];
    /** @type {number} */
    var pdataOld = 1 * func[4];
    /** @type {number} */
    func = 1 * func[5];
    if (!(0 <= value && (0 < udataCur && (0 < pdataCur && (0 < pdataOld && 0 <= func))))) {
      return false;
    }
    node.set(o, value);
    node.set(tag, udataCur);
    node.set(href, pdataCur);
    node.set(properties, pdataOld);
    node.set(x, func);
    return true;
  };
  /**
   * @param {Object} target
   * @return {?}
   */
  var apply = function(target) {
    var prop = target.get(o);
    var elements = target.get(tag);
    var matches = target.get(href);
    var values = target.get(properties);
    var unit = target.b(x, 1);
    return[target.b(elem, 1), void 0 != prop ? prop : "-", elements || "-", matches || "-", values || "-", unit].join(".");
  };
  /**
   * @param {Object} target
   * @return {?}
   */
  var flatten = function(target) {
    return[target.b(elem, 1), target.b(expr, 0), target.b(disabled, 1), target.b(pos, 0)].join(".");
  };
  /**
   * @param {Object} target
   * @param {string} collection
   * @param {string} val
   * @return {?}
   */
  var has = function(target, collection, val) {
    val = val ? "" : target.c(elem, "1");
    var playing = collection.split(".");
    if (4 !== playing.length || indexOf(playing[0], val)) {
      /** @type {null} */
      playing = null;
    }
    target.set(expr, playing ? 1 * playing[1] : 0);
    target.set(disabled, playing ? 1 * playing[2] : 10);
    target.set(pos, playing ? 1 * playing[3] : target.get(value));
    return null != playing || !indexOf(collection, val);
  };
  /**
   * @param {Object} value
   * @param {boolean} recurring
   * @return {?}
   */
  var complete = function(value, recurring) {
    var path = escape(value.c(state, ""));
    /** @type {Array} */
    var leaks = [];
    var resultItems = value.get(data);
    if (!recurring && resultItems) {
      /** @type {number} */
      var i = 0;
      for (;i < resultItems.length;i++) {
        var result = resultItems[i];
        if (result) {
          if (1 == result.scope) {
            leaks.push(i + "=" + escape(result.name) + "=" + escape(result.value) + "=1");
          }
        }
      }
      if (0 < leaks.length) {
        path += "|" + leaks.join("^");
      }
    }
    return path ? value.b(elem, 1) + "." + path : null;
  };
  /**
   * @param {Object} actual
   * @param {Object} matches
   * @param {boolean} p
   * @return {?}
   */
  var compare = function(actual, matches, p) {
    p = p ? "" : actual.c(elem, "1");
    matches = matches.split(".");
    if (2 > matches.length || indexOf(matches[0], p)) {
      return false;
    }
    matches = matches.slice(1).join(".").split("|");
    if (0 < matches.length) {
      actual.set(state, split(matches[0]));
    }
    if (1 >= matches.length) {
      return true;
    }
    matches = matches[1].split(-1 == matches[1].indexOf(",") ? "^" : ",");
    /** @type {number} */
    p = 0;
    for (;p < matches.length;p++) {
      var codeSegments = matches[p].split("=");
      if (4 == codeSegments.length) {
        var me = {};
        me.name = split(codeSegments[1]);
        me.value = split(codeSegments[2]);
        /** @type {number} */
        me.scope = 1;
        actual.get(data)[codeSegments[0]] = me;
      }
    }
    return true;
  };
  /**
   * @param {Object} input
   * @param {boolean} recurring
   * @return {?}
   */
  var onComplete = function(input, recurring) {
    var pos = success(input, recurring);
    return pos ? [input.b(elem, 1), input.b(width, 0), input.b(height, 1), input.b(j, 1), pos].join(".") : "";
  };
  /**
   * @param {Object} tree
   * @return {?}
   */
  var success = function(tree) {
    /**
     * @param {?} key
     * @param {string} __
     * @return {undefined}
     */
    function callback(key, __) {
      if (!expect(tree.get(key))) {
        var name = tree.c(key, "");
        name = name.split(" ").join("%20");
        name = name.split("+").join("%20");
        listItems.push(__ + "=" + name);
      }
    }
    /** @type {Array} */
    var listItems = [];
    callback(props, "utmcid");
    callback(valueKey, "utmcsr");
    callback(cur, "utmgclid");
    callback(eventType, "utmgclsrc");
    callback(camelKey, "utmdclid");
    callback(message, "utmdsid");
    callback(length, "utmccn");
    callback(later, "utmcmd");
    callback(result, "utmctr");
    callback(events, "utmcct");
    return listItems.join("|");
  };
  /**
   * @param {Object} object
   * @param {string} args
   * @param {boolean} value
   * @return {?}
   */
  var render = function(object, args, value) {
    value = value ? "" : object.c(elem, "1");
    args = args.split(".");
    if (5 > args.length || indexOf(args[0], value)) {
      return object.set(width, void 0), object.set(height, void 0), object.set(j, void 0), object.set(props, void 0), object.set(length, void 0), object.set(valueKey, void 0), object.set(later, void 0), object.set(result, void 0), object.set(events, void 0), object.set(cur, void 0), object.set(eventType, void 0), object.set(camelKey, void 0), object.set(message, void 0), false;
    }
    object.set(width, 1 * args[1]);
    object.set(height, 1 * args[2]);
    object.set(j, 1 * args[3]);
    register(object, args.slice(4).join("."));
    return true;
  };
  /**
   * @param {Object} config
   * @param {string} attributes
   * @return {undefined}
   */
  var register = function(config, attributes) {
    /**
     * @param {string} needle
     * @return {?}
     */
    function find(needle) {
      return(needle = attributes.match(needle + "=(.*?)(?:\\|utm|$)")) && 2 == needle.length ? needle[1] : void 0;
    }
    /**
     * @param {?} key
     * @param {string} value
     * @return {undefined}
     */
    function callback(key, value) {
      if (value) {
        value = isSet ? split(value) : value.split("%20").join(" ");
        config.set(key, value);
      } else {
        config.set(key, void 0);
      }
    }
    if (-1 == attributes.indexOf("=")) {
      attributes = split(attributes);
    }
    /** @type {boolean} */
    var isSet = "2" == find("utmcvr");
    callback(props, find("utmcid"));
    callback(length, find("utmccn"));
    callback(valueKey, find("utmcsr"));
    callback(later, find("utmcmd"));
    callback(result, find("utmctr"));
    callback(events, find("utmcct"));
    callback(cur, find("utmgclid"));
    callback(eventType, find("utmgclsrc"));
    callback(camelKey, find("utmdclid"));
    callback(message, find("utmdsid"));
  };
  /**
   * @param {boolean} value
   * @param {boolean} o
   * @return {?}
   */
  var indexOf = function(value, o) {
    return o ? value != o : !/^\d+$/.test(value);
  };
  /**
   * @return {undefined}
   */
  var F = function() {
    /** @type {Array} */
    this.filters = [];
  };
  /**
   * @param {string} name
   * @param {string} dataAndEvents
   * @return {undefined}
   */
  F.prototype.add = function(name, dataAndEvents) {
    this.filters.push({
      name : name,
      s : dataAndEvents
    });
  };
  /**
   * @param {?} list
   * @return {undefined}
   */
  F.prototype.cb = function(list) {
    try {
      /** @type {number} */
      var i = 0;
      for (;i < this.filters.length;i++) {
        this.filters[i].s.call(win, list);
      }
    } catch (c) {
    }
  };
  var exports = new function() {
    /** @type {Array} */
    var resultItems = [];
    /**
     * @param {?} key
     * @return {undefined}
     */
    this.set = function(key) {
      /** @type {boolean} */
      resultItems[key] = true;
    };
    /**
     * @return {?}
     */
    this.encode = function() {
      /** @type {Array} */
      var codeSegments = [];
      /** @type {number} */
      var i = 0;
      for (;i < resultItems.length;i++) {
        if (resultItems[i]) {
          codeSegments[Math.floor(i / 6)] ^= 1 << i % 6;
        }
      }
      /** @type {number} */
      i = 0;
      for (;i < codeSegments.length;i++) {
        /** @type {string} */
        codeSegments[i] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(codeSegments[i] || 0);
      }
      return codeSegments.join("") + "~";
    };
  };
  /** @type {Window} */
  var win = window;
  /** @type {HTMLDocument} */
  var doc = document;
  /**
   * @param {Function} str
   * @return {?}
   */
  var isEmpty = function(str) {
    var nav = win._gaUserPrefs;
    if (nav && (nav.ioo && nav.ioo()) || str && true === win["ga-disable-" + str]) {
      return true;
    }
    try {
      var loc = win.external;
      if (loc && (loc._gaUserPrefs && "oo" == loc._gaUserPrefs)) {
        return true;
      }
    } catch (d) {
    }
    return false;
  };
  /**
   * @return {?}
   */
  var preview = function() {
    return win.navigator && "preview" == win.navigator.loadPurpose;
  };
  /**
   * @param {Function} func
   * @param {number} timestep
   * @return {undefined}
   */
  var step = function(func, timestep) {
    setTimeout(func, timestep);
  };
  /**
   * @param {string} pattern
   * @return {?}
   */
  var filter = function(pattern) {
    /** @type {Array} */
    var ret = [];
    /** @type {Array.<string>} */
    var codeSegments = doc.cookie.split(";");
    /** @type {RegExp} */
    pattern = new RegExp("^\\s*" + pattern + "=\\s*(.*?)\\s*$");
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      /** @type {(Array.<string>|null)} */
      var names = codeSegments[i].match(pattern);
      if (names) {
        ret.push(names[1]);
      }
    }
    return ret;
  };
  /**
   * @param {string} text
   * @param {string} obj
   * @param {Error} name
   * @param {string} id
   * @param {boolean} key
   * @param {number} opt_attributes
   * @return {undefined}
   */
  var stringify = function(text, obj, name, id, key, opt_attributes) {
    /** @type {boolean} */
    key = isEmpty(key) ? false : getData(id, name) ? false : preview() ? false : true;
    if (key) {
      if (obj = escapeString(obj)) {
        if (2E3 < obj.length) {
          obj = obj.substring(0, 2E3);
          replace(69);
        }
      }
      /** @type {string} */
      text = text + "=" + obj + "; path=" + name + "; ";
      if (opt_attributes) {
        text += "expires=" + (new Date((new Date).getTime() + opt_attributes)).toGMTString() + "; ";
      }
      if (id) {
        text += "domain=" + id + ";";
      }
      /** @type {string} */
      doc.cookie = text;
    }
  };
  /**
   * @param {string} str
   * @return {?}
   */
  var escapeString = function(str) {
    if (!str) {
      return str;
    }
    var i = str.indexOf(";");
    if (-1 != i) {
      str = str.substring(0, i);
      replace(141);
    }
    if (!(0 <= win.navigator.userAgent.indexOf("Firefox"))) {
      return str;
    }
    str = str.replace(/\n|\r/g, " ");
    /** @type {number} */
    i = 0;
    var len = str.length;
    for (;i < len;++i) {
      /** @type {number} */
      var zeroQuoted = str.charCodeAt(i) & 255;
      if (10 == zeroQuoted || 13 == zeroQuoted) {
        /** @type {string} */
        str = str.substring(0, i) + "?" + str.substring(i + 1);
      }
    }
    return str;
  };
  var anonymousDefine;
  var pdataOld;
  /**
   * @return {undefined}
   */
  var update = function() {
    if (!anonymousDefine) {
      var args = {};
      /** @type {(Navigator|null)} */
      var nav = win.navigator;
      /** @type {(Screen|null)} */
      var screen = win.screen;
      /** @type {string} */
      args.jb = screen ? screen.width + "x" + screen.height : "-";
      /** @type {string} */
      args.P = screen ? screen.colorDepth + "-bit" : "-";
      /** @type {string} */
      args.language = (nav && (nav.language || nav.browserLanguage) || "-").toLowerCase();
      /** @type {number} */
      args.javaEnabled = nav && nav.javaEnabled() ? 1 : 0;
      args.characterSet = doc.characterSet || (doc.charset || "-");
      try {
        var str;
        /** @type {Element} */
        var docElem = doc.documentElement;
        /** @type {(HTMLElement|null)} */
        var elem = doc.body;
        /** @type {(null|number)} */
        var nType = elem && (elem.clientWidth && elem.clientHeight);
        /** @type {Array} */
        nav = [];
        if (docElem && (docElem.clientWidth && (docElem.clientHeight && ("CSS1Compat" === doc.compatMode || !nType)))) {
          /** @type {Array} */
          nav = [docElem.clientWidth, docElem.clientHeight];
        } else {
          if (nType) {
            /** @type {Array} */
            nav = [elem.clientWidth, elem.clientHeight];
          }
        }
        /** @type {string} */
        str = 0 >= nav[0] || 0 >= nav[1] ? "" : nav.join("x");
        /** @type {string} */
        args.Wa = str;
      } catch (n) {
        replace(135);
      }
      anonymousDefine = args;
    }
  };
  /**
   * @return {?}
   */
  var start = function() {
    update();
    var result = anonymousDefine;
    /** @type {(Navigator|null)} */
    var n = win.navigator;
    /** @type {string} */
    result = n.appName + n.version + result.language + n.platform + n.userAgent + result.javaEnabled + result.jb + result.P + (doc.cookie ? doc.cookie : "") + (doc.referrer ? doc.referrer : "");
    /** @type {number} */
    n = result.length;
    /** @type {number} */
    var cnl = win.history.length;
    for (;0 < cnl;) {
      result += cnl-- ^ n++;
    }
    return call(result);
  };
  /**
   * @param {HTMLElement} store
   * @return {undefined}
   */
  var initialize = function(store) {
    update();
    var args = anonymousDefine;
    store.set(expireKey, args.jb);
    store.set(serverAttrs, args.P);
    store.set(localStorageName, args.language);
    store.set(foo, args.characterSet);
    store.set(field, args.javaEnabled);
    store.set(group, args.Wa);
    if (store.get(name) && store.get(modalInstance)) {
      if (!(args = pdataOld)) {
        var a;
        var item;
        var value;
        /** @type {string} */
        item = "ShockwaveFlash";
        if ((args = (args = win.navigator) ? args.plugins : void 0) && 0 < args.length) {
          /** @type {number} */
          a = 0;
          for (;a < args.length && !value;a++) {
            item = args[a];
            if (-1 < item.name.indexOf("Shockwave Flash")) {
              value = item.description.split("Shockwave Flash ")[1];
            }
          }
        } else {
          /** @type {string} */
          item = item + "." + item;
          try {
            a = new ActiveXObject(item + ".7");
            value = a.GetVariable("$version");
          } catch (f) {
          }
          if (!value) {
            try {
              a = new ActiveXObject(item + ".6");
              /** @type {string} */
              value = "WIN 6,0,21,0";
              /** @type {string} */
              a.AllowScriptAccess = "always";
              value = a.GetVariable("$version");
            } catch (Be) {
            }
          }
          if (!value) {
            try {
              a = new ActiveXObject(item);
              value = a.GetVariable("$version");
            } catch (n) {
            }
          }
          if (value) {
            value = value.split(" ")[1].split(",");
            value = value[0] + "." + value[1] + " r" + value[2];
          }
        }
        args = value ? value : "-";
      }
      pdataOld = args;
      store.set(testKey, pdataOld);
    } else {
      store.set(testKey, "-");
    }
  };
  /**
   * @param {string} value
   * @return {undefined}
   */
  var parse = function(value) {
    if (isFunction(value)) {
      /** @type {string} */
      this.s = value;
    } else {
      var raw = value[0];
      var i = raw.lastIndexOf(":");
      var pos = raw.lastIndexOf(".");
      /** @type {string} */
      this.h = this.i = this.l = "";
      if (-1 == i && -1 == pos) {
        this.h = raw;
      } else {
        if (-1 == i && -1 != pos) {
          this.i = raw.substring(0, pos);
          this.h = raw.substring(pos + 1);
        } else {
          if (-1 != i && -1 == pos) {
            this.l = raw.substring(0, i);
            this.h = raw.substring(i + 1);
          } else {
            if (i > pos) {
              this.i = raw.substring(0, pos);
              this.l = raw.substring(pos + 1, i);
              this.h = raw.substring(i + 1);
            } else {
              this.i = raw.substring(0, pos);
              this.h = raw.substring(pos + 1);
            }
          }
        }
      }
      this.Xa = value.slice(1);
      /** @type {boolean} */
      this.Ma = !this.l && "_require" == this.h;
      /** @type {boolean} */
      this.J = !this.i && (!this.l && "_provide" == this.h);
    }
  };
  /**
   * @return {undefined}
   */
  var self = function() {
    extend(self.prototype, "push", self.prototype.push, 5);
    extend(self.prototype, "_getPlugin", params, 121);
    extend(self.prototype, "_createAsyncTracker", self.prototype.Sa, 33);
    extend(self.prototype, "_getAsyncTracker", self.prototype.Ta, 34);
    this.I = new Node;
    /** @type {Array} */
    this.eb = [];
  };
  item = self.prototype;
  /**
   * @param {?} storageKey
   * @param {string} layer
   * @param {Object} dataAndEvents
   * @return {?}
   */
  item.Na = function(storageKey, layer, dataAndEvents) {
    var value = this.I.get(storageKey);
    if (!isFunction(value)) {
      return false;
    }
    layer.plugins_ = layer.plugins_ || new Node;
    layer.plugins_.set(storageKey, new value(layer, dataAndEvents || {}));
    return true;
  };
  /**
   * @param {string} name
   * @return {?}
   */
  item.push = function(name) {
    var temp = current.Va.apply(this, arguments);
    temp = current.eb.concat(temp);
    /** @type {Array} */
    current.eb = [];
    for (;0 < temp.length && (!current.O(temp[0]) && !(temp.shift(), 0 < current.eb.length));) {
    }
    /** @type {Array} */
    current.eb = current.eb.concat(temp);
    return 0;
  };
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  item.Va = function(dataAndEvents) {
    /** @type {Array} */
    var assigns = [];
    /** @type {number} */
    var i = 0;
    for (;i < arguments.length;i++) {
      try {
        var vvar = new parse(arguments[i]);
        if (vvar.J) {
          this.O(vvar);
        } else {
          assigns.push(vvar);
        }
      } catch (e) {
      }
    }
    return assigns;
  };
  /**
   * @param {Object} o
   * @return {?}
   */
  item.O = function(o) {
    try {
      if (o.s) {
        o.s.apply(win);
      } else {
        if (o.J) {
          this.I.set(o.Xa[0], o.Xa[1]);
        } else {
          var i = "_gat" == o.i ? node : "_gaq" == o.i ? current : node.u(o.i);
          if (o.Ma) {
            if (!this.Na(o.Xa[0], i, o.Xa[2])) {
              if (!o.Pa) {
                var a = parseURL("" + o.Xa[1]);
                var method = a.protocol;
                /** @type {string} */
                var all = doc.location.protocol;
                var f;
                if (f = "https:" == method || method == all ? true : "http:" != method ? false : "http:" == all) {
                  a: {
                    var b = parseURL(doc.location.href);
                    if (!(a.Oa || (0 <= a.url.indexOf("?") || (0 <= a.path.indexOf("://") || a.host == b.host && a.port == b.port)))) {
                      /** @type {number} */
                      var defaultPort = "http:" == a.protocol ? 80 : 443;
                      var codeSegments = node.S;
                      /** @type {number} */
                      i = 0;
                      for (;i < codeSegments.length;i++) {
                        if (a.host == codeSegments[i][0] && ((a.port || defaultPort) == (codeSegments[i][1] || defaultPort) && 0 == a.path.indexOf(codeSegments[i][2]))) {
                          /** @type {boolean} */
                          f = true;
                          break a;
                        }
                      }
                    }
                    /** @type {boolean} */
                    f = false;
                  }
                }
                if (f) {
                  if (!isEmpty()) {
                    o.Pa = loadScript(a.url);
                  }
                }
              }
              return true;
            }
          } else {
            if (o.l) {
              i = i.plugins_.get(o.l);
            }
            i[o.h].apply(i, o.Xa);
          }
        }
      }
    } catch (t) {
    }
  };
  /**
   * @param {string} defs
   * @param {string} id
   * @return {?}
   */
  item.Sa = function(defs, id) {
    return node.hb(defs, id || "");
  };
  /**
   * @param {string} d
   * @return {?}
   */
  item.Ta = function(d) {
    return node.u(d);
  };
  /**
   * @return {undefined}
   */
  var Element = function() {
    /**
     * @param {number} attributes
     * @param {string} j
     * @param {number} k
     * @param {?} args
     * @return {undefined}
     */
    function add(attributes, j, k, args) {
      if (void 0 == codeSegments[attributes]) {
        codeSegments[attributes] = {};
      }
      if (void 0 == codeSegments[attributes][j]) {
        /** @type {Array} */
        codeSegments[attributes][j] = [];
      }
      codeSegments[attributes][j][k] = args;
    }
    /**
     * @param {number} i
     * @param {string} event
     * @param {?} key
     * @return {?}
     */
    function callback(i, event, key) {
      if (void 0 != codeSegments[i] && void 0 != codeSegments[i][event]) {
        return codeSegments[i][event][key];
      }
    }
    /**
     * @param {number} i
     * @param {string} attr
     * @return {undefined}
     */
    function has(i, attr) {
      if (void 0 != codeSegments[i] && void 0 != codeSegments[i][attr]) {
        codeSegments[i][attr] = void 0;
        /** @type {boolean} */
        var c = true;
        var j;
        /** @type {number} */
        j = 0;
        for (;j < poly.length;j++) {
          if (void 0 != codeSegments[i][poly[j]]) {
            /** @type {boolean} */
            c = false;
            break;
          }
        }
        if (c) {
          codeSegments[i] = void 0;
        }
      }
    }
    /**
     * @param {?} separator2
     * @return {?}
     */
    function join(separator2) {
      /** @type {string} */
      var b = "";
      /** @type {boolean} */
      var assigns = false;
      var j;
      var codeSegments;
      /** @type {number} */
      j = 0;
      for (;j < poly.length;j++) {
        if (codeSegments = separator2[poly[j]], void 0 != codeSegments) {
          if (assigns) {
            b += poly[j];
          }
          /** @type {Array} */
          assigns = [];
          var vvar = void 0;
          var i = void 0;
          /** @type {number} */
          i = 0;
          for (;i < codeSegments.length;i++) {
            if (void 0 != codeSegments[i]) {
              /** @type {string} */
              vvar = "";
              if (1 != i) {
                if (void 0 == codeSegments[i - 1]) {
                  vvar += i.toString() + "!";
                }
              }
              var keys = codeSegments[i];
              /** @type {string} */
              var str = "";
              var k = void 0;
              var name = void 0;
              var src = void 0;
              /** @type {number} */
              k = 0;
              for (;k < keys.length;k++) {
                name = keys.charAt(k);
                src = target[name];
                str += void 0 != src ? src : name;
              }
              vvar += str;
              assigns.push(vvar);
            }
          }
          b += "(" + assigns.join("*") + ")";
          /** @type {boolean} */
          assigns = false;
        } else {
          /** @type {boolean} */
          assigns = true;
        }
      }
      return b;
    }
    var e = this;
    /** @type {Array} */
    var codeSegments = [];
    /** @type {Array} */
    var poly = ["k", "v"];
    var target = {
      "'" : "'0",
      ")" : "'1",
      "*" : "'2",
      "!" : "'3"
    };
    /**
     * @param {number} i
     * @return {?}
     */
    e.Ra = function(i) {
      return void 0 != codeSegments[i];
    };
    /**
     * @return {?}
     */
    e.A = function() {
      /** @type {string} */
      var ret = "";
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        if (void 0 != codeSegments[i]) {
          ret += i.toString() + join(codeSegments[i]);
        }
      }
      return ret;
    };
    /**
     * @param {number} self
     * @return {?}
     */
    e.Qa = function(self) {
      if (void 0 == self) {
        return e.A();
      }
      var Qa = self.A();
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        if (!(void 0 == codeSegments[i])) {
          if (!self.Ra(i)) {
            Qa += i.toString() + join(codeSegments[i]);
          }
        }
      }
      return Qa;
    };
    /**
     * @param {number} opt_attributes
     * @param {number} expectedNumberOfNonCommentArgs
     * @param {?} value
     * @return {?}
     */
    e.f = function(opt_attributes, expectedNumberOfNonCommentArgs, value) {
      if (!encodeURIComponent(value)) {
        return false;
      }
      add(opt_attributes, "k", expectedNumberOfNonCommentArgs, value);
      return true;
    };
    /**
     * @param {number} opt_attributes
     * @param {number} expectedNumberOfNonCommentArgs
     * @param {(number|string)} a
     * @return {?}
     */
    e.o = function(opt_attributes, expectedNumberOfNonCommentArgs, a) {
      if (!isNumber(a)) {
        return false;
      }
      add(opt_attributes, "v", expectedNumberOfNonCommentArgs, a.toString());
      return true;
    };
    /**
     * @param {number} index
     * @param {?} object
     * @return {?}
     */
    e.getKey = function(index, object) {
      return callback(index, "k", object);
    };
    /**
     * @param {number} name
     * @param {?} arg
     * @return {?}
     */
    e.N = function(name, arg) {
      return callback(name, "v", arg);
    };
    /**
     * @param {number} a
     * @return {undefined}
     */
    e.L = function(a) {
      has(a, "k");
    };
    /**
     * @param {number} a
     * @return {undefined}
     */
    e.M = function(a) {
      has(a, "v");
    };
    extend(e, "_setKey", e.f, 89);
    extend(e, "_setValue", e.o, 90);
    extend(e, "_getKey", e.getKey, 87);
    extend(e, "_getValue", e.N, 88);
    extend(e, "_clearKey", e.L, 85);
    extend(e, "_clearValue", e.M, 86);
  };
  /**
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  var event = function(dataAndEvents) {
    var r = win.gaGlobal;
    if (dataAndEvents) {
      if (!r) {
        win.gaGlobal = r = {};
      }
    }
    return r;
  };
  /**
   * @return {?}
   */
  var at = function() {
    var result = event(true).hid;
    if (null == result) {
      result = done();
      event(true).hid = result;
    }
    return result;
  };
  /**
   * @param {HTMLElement} _this
   * @return {undefined}
   */
  var loaded = function(_this) {
    _this.set(CACHE_KEY, at());
    var item = event();
    if (item && item.dh == _this.get(elem)) {
      var pdataOld = item.sid;
      if (pdataOld) {
        if (_this.get(instance)) {
          replace(112);
        } else {
          replace(132);
        }
        _this.set(properties, pdataOld);
        if (_this.get(handle)) {
          _this.set(href, pdataOld);
        }
      }
      item = item.vid;
      if (_this.get(handle)) {
        if (item) {
          item = item.split(".");
          _this.set(o, 1 * item[0]);
          _this.set(tag, 1 * item[1]);
        }
      }
    }
  };
  var Ed;
  /**
   * @param {Object} o
   * @param {string} e
   * @param {string} walkers
   * @param {number} resp
   * @return {undefined}
   */
  var l = function(o, e, walkers, resp) {
    var ancestor = o.c(selector, "");
    var name = o.c(attr, "/");
    resp = void 0 != resp ? resp : o.b(i, 0);
    o = o.c(key, "");
    stringify(e, walkers, name, ancestor, o, resp);
  };
  /**
   * @param {Object} value
   * @return {undefined}
   */
  var onload = function(value) {
    var ancestor = value.c(selector, "");
    value.b(elem, 1);
    var name = value.c(attr, "/");
    var camelKey = value.c(key, "");
    stringify("__utma", apply(value), name, ancestor, camelKey, value.get(i));
    stringify("__utmb", flatten(value), name, ancestor, camelKey, value.get(r));
    stringify("__utmc", "" + value.b(elem, 1), name, ancestor, camelKey);
    var actual = onComplete(value, true);
    if (actual) {
      stringify("__utmz", actual, name, ancestor, camelKey, value.get(prop));
    } else {
      stringify("__utmz", "", name, ancestor, "", -1);
    }
    if (actual = complete(value, false)) {
      stringify("__utmv", actual, name, ancestor, camelKey, value.get(i));
    } else {
      stringify("__utmv", "", name, ancestor, "", -1);
    }
  };
  /**
   * @param {Object} item
   * @return {?}
   */
  var send = function(item) {
    var parent = item.b(elem, 1);
    if (!each(item, getName(parent, filter("__utma")))) {
      return item.set(needle, true), false;
    }
    /** @type {boolean} */
    var pdataOld = !has(item, getName(parent, filter("__utmb")));
    item.set(arg, pdataOld);
    render(item, getName(parent, filter("__utmz")));
    compare(item, getName(parent, filter("__utmv")));
    /** @type {boolean} */
    Ed = !pdataOld;
    return true;
  };
  /**
   * @param {Object} e
   * @return {undefined}
   */
  var errorHandler = function(e) {
    if (!Ed) {
      if (!(0 < filter("__utmb").length)) {
        stringify("__utmd", "1", e.c(attr, "/"), e.c(selector, ""), e.c(key, ""), 1E4);
        if (0 == filter("__utmd").length) {
          e.stopPropagation();
        }
      }
    }
  };
  /** @type {number} */
  var h = 0;
  /**
   * @param {Node} list
   * @return {undefined}
   */
  var reset = function(list) {
    if (void 0 == list.get(o)) {
      init(list);
    } else {
      if (list.get(needle) && !list.get(img)) {
        init(list);
      } else {
        if (list.get(arg)) {
          setData(list);
        }
      }
    }
  };
  /**
   * @param {Node} node
   * @return {undefined}
   */
  var change = function(node) {
    if (node.get(child)) {
      if (!node.get(instance)) {
        setData(node);
        node.set(height, node.get(x));
      }
    }
  };
  /**
   * @param {(Node|string)} list
   * @return {undefined}
   */
  var init = function(list) {
    h++;
    if (1 < h) {
      replace(137);
    }
    var pdataOld = list.get(value);
    list.set(handle, true);
    list.set(o, done() ^ start(list) & 2147483647);
    list.set(state, "");
    list.set(tag, pdataOld);
    list.set(href, pdataOld);
    list.set(properties, pdataOld);
    list.set(x, 1);
    list.set(instance, true);
    list.set(expr, 0);
    list.set(disabled, 10);
    list.set(pos, pdataOld);
    list.set(data, []);
    list.set(needle, false);
    list.set(arg, false);
  };
  /**
   * @param {(Node|string)} node
   * @return {undefined}
   */
  var setData = function(node) {
    h++;
    if (1 < h) {
      replace(137);
    }
    node.set(href, node.get(properties));
    node.set(properties, node.get(value));
    node.Za(x);
    node.set(instance, true);
    node.set(expr, 0);
    node.set(disabled, 10);
    node.set(pos, node.get(value));
    node.set(arg, false);
  };
  /** @type {Array.<string>} */
  var models = "daum:q eniro:search_word naver:query pchome:q images.google:q google:q yahoo:p yahoo:q msn:q bing:q aol:query aol:q lycos:q lycos:query ask:q cnn:query virgilio:qs baidu:wd baidu:word alice:qs yandex:text najdi:q seznam:q rakuten:qt biglobe:q goo.ne:MT search.smt.docomo:MT onet:qt onet:q kvasir:q terra:query rambler:query conduit:q babylon:q search-results:q avg:q comcast:q incredimail:q startsiden:q go.mail.ru:q centrum.cz:q 360.cn:q sogou:query tut.by:query globo:q ukr:q so.com:q haosou.com:q auone:q".split(" ");
  /**
   * @param {Object} node
   * @return {undefined}
   */
  var link = function(node) {
    if (node.get(attrs) && !node.get(img)) {
      var color;
      /** @type {boolean} */
      color = !expect(node.get(props)) || (!expect(node.get(valueKey)) || (!expect(node.get(cur)) || !expect(node.get(camelKey))));
      var data = {};
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        var key = codeSegments[i];
        data[key] = node.get(key);
      }
      if (i = node.get(rel)) {
        replace(149);
        key = new Node;
        remove(key, i);
        i = key;
      } else {
        i = select(doc.location.href, node.get(callee)).R;
      }
      if ("1" != forEach(i.get(node.get(opt_key))) || !color) {
        if (i = match(node, i) || contains(node), i || (color || (!node.get(instance) || (on(node, void 0, "(direct)", void 0, void 0, void 0, "(direct)", "(none)", void 0, void 0), i = true))), i && (node.set(child, check(node, data)), color = "(direct)" == node.get(valueKey) && ("(direct)" == node.get(length) && "(none)" == node.get(later)), node.get(child) || node.get(instance) && !color)) {
          node.set(width, node.get(value));
          node.set(height, node.get(x));
          node.Za(j);
        }
      }
    }
  };
  /**
   * @param {Object} element
   * @param {number} el
   * @return {?}
   */
  var match = function(element, el) {
    /**
     * @param {?} key
     * @param {number} sep
     * @return {?}
     */
    function parse(key, sep) {
      sep = sep || "-";
      var instance = forEach(el.get(element.get(key)));
      return instance && "-" != instance ? split(instance) : sep;
    }
    var click = forEach(el.get(element.get(p))) || "-";
    var selector = forEach(el.get(element.get(target))) || "-";
    var pdataOld = forEach(el.get(element.get(offsetParent))) || "-";
    var id = forEach(el.get("gclsrc")) || "-";
    var end = forEach(el.get("dclid")) || "-";
    var url = parse(version, "(not set)");
    var pdataCur = parse(subKey, "(not set)");
    var value = parse(ast);
    var restoreScript = parse(ms);
    if (expect(click) && (expect(pdataOld) && (expect(end) && expect(selector)))) {
      return false;
    }
    /** @type {boolean} */
    var fail = !expect(pdataOld) && !expect(id);
    fail = expect(selector) && (!expect(end) || fail);
    var rv = expect(value);
    if (fail || rv) {
      var val = bind(element);
      val = select(val, true);
      if (val = format(element, val)) {
        if (!expect(val[1] && !val[2])) {
          if (fail) {
            selector = val[0];
          }
          if (rv) {
            value = val[1];
          }
        }
      }
    }
    on(element, click, selector, pdataOld, id, end, url, pdataCur, value, restoreScript);
    return true;
  };
  /**
   * @param {boolean} node
   * @return {?}
   */
  var contains = function(node) {
    var result = bind(node);
    var item = select(result, true);
    if (!(result = !(void 0 != result && (null != result && ("" != result && ("0" != result && ("-" != result && 0 <= result.indexOf("://")))))))) {
      result = item && (-1 < item.host.indexOf("google") && (item.R.contains("q") && "cse" == item.path));
    }
    if (result) {
      return false;
    }
    if ((result = format(node, item)) && !result[2]) {
      return on(node, void 0, result[0], void 0, void 0, void 0, "(organic)", "organic", result[1], void 0), true;
    }
    if (result || !node.get(instance)) {
      return false;
    }
    a: {
      result = node.get(val);
      var nodes = gsub(item.host);
      /** @type {number} */
      var i = 0;
      for (;i < result.length;++i) {
        if (-1 < nodes.indexOf(result[i])) {
          /** @type {boolean} */
          node = false;
          break a;
        }
      }
      on(node, void 0, nodes, void 0, void 0, void 0, "(referral)", "referral", void 0, "/" + item.path);
      /** @type {boolean} */
      node = true;
    }
    return node;
  };
  /**
   * @param {Object} node
   * @param {Object} item
   * @return {?}
   */
  var format = function(node, item) {
    var tag = node.get(sid);
    /** @type {number} */
    var j = 0;
    for (;j < tag.length;++j) {
      var tokens = tag[j].split(":");
      if (-1 < item.host.indexOf(tokens[0].toLowerCase())) {
        var path = item.R.get(tokens[1]);
        if (path && (path = require(path), !path && (-1 < item.host.indexOf("google.") && (path = "(not provided)")), !tokens[3] || -1 < item.url.indexOf(tokens[3]))) {
          if (!path) {
            replace(151);
          }
          a: {
            tag = path;
            j = node.get(idx);
            tag = split(tag).toLowerCase();
            /** @type {number} */
            var i = 0;
            for (;i < j.length;++i) {
              if (tag == j[i]) {
                /** @type {boolean} */
                tag = true;
                break a;
              }
            }
            /** @type {boolean} */
            tag = false;
          }
          return[tokens[2] || tokens[0], path, tag];
        }
      }
    }
    return null;
  };
  /**
   * @param {Object} el
   * @param {(Error|string)} method
   * @param {?} selector
   * @param {(Error|string)} value
   * @param {(Error|string)} id
   * @param {(Error|string)} event
   * @param {?} func
   * @param {?} data
   * @param {(Error|string)} x
   * @param {(Error|string)} callback
   * @return {undefined}
   */
  var on = function(el, method, selector, value, id, event, func, data, x, callback) {
    el.set(props, method);
    el.set(valueKey, selector);
    el.set(cur, value);
    el.set(eventType, id);
    el.set(camelKey, event);
    el.set(length, func);
    el.set(later, data);
    el.set(result, x);
    el.set(events, callback);
  };
  /** @type {Array} */
  var codeSegments = [length, props, cur, camelKey, valueKey, later, result, events];
  /**
   * @param {Object} output
   * @param {Arguments} attr
   * @return {?}
   */
  var check = function(output, attr) {
    /**
     * @param {string} event
     * @return {?}
     */
    function check(event) {
      /** @type {string} */
      event = ("" + event).split("+").join("%20");
      return event = event.split(" ").join("%20");
    }
    /**
     * @param {?} key
     * @return {?}
     */
    function next(key) {
      var k = "" + (output.get(key) || "");
      key = "" + (attr[key] || "");
      return 0 < k.length && k == key;
    }
    if (next(cur) || next(camelKey)) {
      return replace(131), false;
    }
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      var key = codeSegments[i];
      var self = attr[key] || "-";
      key = output.get(key) || "-";
      if (check(self) != check(key)) {
        return true;
      }
    }
    return false;
  };
  /** @type {RegExp} */
  var HCHARS = new RegExp(/^https?:\/\/(www\.)?google(\.com?)?(\.[a-z]{2}t?)?\/?$/i);
  /** @type {RegExp} */
  var rchecked = /^https?:\/\/(r\.)?search\.yahoo\.com?(\.jp)?\/?[^?]*$/i;
  /** @type {RegExp} */
  var exclude = /^https?:\/\/(www\.)?bing\.com\/?$/i;
  /**
   * @param {string} node
   * @return {?}
   */
  var bind = function(node) {
    node = _(node.get(parentNode), node.get(attr));
    try {
      if (HCHARS.test(node)) {
        return replace(136), node + "?q=";
      }
      if (rchecked.test(node)) {
        return replace(150), node + "?p=(not provided)";
      }
      if (exclude.test(node)) {
        return node + "?q=(not provided)";
      }
    } catch (b) {
      replace(145);
    }
    return node;
  };
  var udataCur;
  var source;
  /**
   * @param {Object} e
   * @return {undefined}
   */
  var w = function(e) {
    udataCur = e.c(cur, "");
    source = e.c(eventType, "");
  };
  /**
   * @param {Object} e
   * @return {undefined}
   */
  var end = function(e) {
    var name = e.c(cur, "");
    var index = e.c(eventType, "");
    if (name != udataCur) {
      if (-1 < index.indexOf("ds")) {
        e.set(message, void 0);
      } else {
        if (!expect(udataCur)) {
          if (-1 < source.indexOf("ds")) {
            e.set(message, udataCur);
          }
        }
      }
    }
  };
  /**
   * @param {Object} node
   * @return {undefined}
   */
  var poll = function(node) {
    if (run(node, doc.location.href)) {
      node.set(img, true);
      replace(12);
    } else {
      node.set(img, false);
    }
  };
  /**
   * @param {Object} obj
   * @param {string} target
   * @return {?}
   */
  var run = function(obj, target) {
    if (!obj.get(actualKey)) {
      return false;
    }
    var data = select(target, obj.get(callee));
    var a = require(data.R.get("__utma"));
    var b = require(data.R.get("__utmb"));
    var children = require(data.R.get("__utmc"));
    var value = require(data.R.get("__utmx"));
    var _ = require(data.R.get("__utmz"));
    var child = require(data.R.get("__utmv"));
    data = require(data.R.get("__utmk"));
    if (call("" + a + b + children + value + _ + child) != data) {
      a = split(a);
      b = split(b);
      children = split(children);
      value = split(value);
      children = func(a + b + children + value, _, child, data);
      if (!children) {
        return false;
      }
      _ = children[0];
      child = children[1];
    }
    if (!each(obj, a, true)) {
      return false;
    }
    has(obj, b, true);
    render(obj, _, true);
    compare(obj, child, true);
    mixin(obj, value, true);
    return true;
  };
  /**
   * @param {number} value
   * @param {string} el
   * @param {string} args
   * @return {?}
   */
  var addClass = function(value, el, args) {
    var name;
    name = apply(value) || "-";
    var index = flatten(value) || "-";
    var i = "" + value.b(elem, 1) || "-";
    var field = map(value) || "-";
    var quote = onComplete(value, false) || "-";
    value = complete(value, false) || "-";
    var l = call("" + name + index + i + field + quote + value);
    /** @type {Array} */
    var result = [];
    result.push("__utma=" + name);
    result.push("__utmb=" + index);
    result.push("__utmc=" + i);
    result.push("__utmx=" + field);
    result.push("__utmz=" + quote);
    result.push("__utmv=" + value);
    result.push("__utmk=" + l);
    /** @type {string} */
    name = result.join("&");
    if (!name) {
      return el;
    }
    index = el.indexOf("#");
    if (args) {
      return 0 > index ? el + "#" + name : el + "&" + name;
    }
    /** @type {string} */
    args = "";
    i = el.indexOf("?");
    if (0 < index) {
      args = el.substring(index);
      el = el.substring(0, index);
    }
    return 0 > i ? el + "?" + name + args : el + "&" + name + args;
  };
  /**
   * @param {string} _
   * @param {string} name
   * @param {string} b
   * @param {?} arg1
   * @return {?}
   */
  var func = function(_, name, b, arg1) {
    /** @type {number} */
    var e = 0;
    for (;3 > e;e++) {
      /** @type {number} */
      var f = 0;
      for (;3 > f;f++) {
        if (arg1 == call(_ + name + b)) {
          return replace(127), [name, b];
        }
        var a = name.replace(/ /g, "%20");
        var extension = b.replace(/ /g, "%20");
        if (arg1 == call(_ + a + extension)) {
          return replace(128), [a, extension];
        }
        a = a.replace(/\+/g, "%20");
        extension = extension.replace(/\+/g, "%20");
        if (arg1 == call(_ + a + extension)) {
          return replace(129), [a, extension];
        }
        try {
          var matches = name.match("utmctr=(.*?)(?:\\|utm|$)");
          if (matches && (2 == matches.length && (a = name.replace(matches[1], escape(split(matches[1]))), arg1 == call(_ + a + b)))) {
            return replace(139), [a, b];
          }
        } catch (t) {
        }
        name = split(name);
      }
      b = split(b);
    }
  };
  /** @type {string} */
  var slashSplit = "|";
  /**
   * @param {Object} str
   * @param {number} data
   * @param {?} item
   * @param {number} evt
   * @param {?} arg
   * @param {?} target
   * @param {?} value
   * @param {number} obj
   * @param {?} val
   * @return {?}
   */
  var emit = function(str, data, item, evt, arg, target, value, obj, val) {
    var self = push(str, data);
    if (!self) {
      self = {};
      str.get(type).push(self);
    }
    /** @type {number} */
    self.id_ = data;
    self.affiliation_ = item;
    /** @type {number} */
    self.total_ = evt;
    self.tax_ = arg;
    self.shipping_ = target;
    self.city_ = value;
    /** @type {number} */
    self.state_ = obj;
    self.country_ = val;
    self.items_ = self.items_ || [];
    return self;
  };
  /**
   * @param {Object} result
   * @param {number} data
   * @param {?} i
   * @param {string} name
   * @param {?} deepDataAndEvents
   * @param {?} item
   * @param {?} index
   * @return {?}
   */
  var addItem = function(result, data, i, name, deepDataAndEvents, item, index) {
    result = push(result, data) || emit(result, data, "", 0, 0, 0, "", "", "");
    var error;
    a: {
      if (result && result.items_) {
        error = result.items_;
        /** @type {number} */
        var row = 0;
        for (;row < error.length;row++) {
          if (error[row].sku_ == i) {
            error = error[row];
            break a;
          }
        }
      }
      /** @type {null} */
      error = null;
    }
    row = error || {};
    /** @type {number} */
    row.transId_ = data;
    row.sku_ = i;
    /** @type {string} */
    row.name_ = name;
    row.category_ = deepDataAndEvents;
    row.price_ = item;
    row.quantity_ = index;
    if (!error) {
      result.items_.push(row);
    }
    return row;
  };
  /**
   * @param {Object} message
   * @param {number} head
   * @return {?}
   */
  var push = function(message, head) {
    var codeSegments = message.get(type);
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      if (codeSegments[i].id_ == head) {
        return codeSegments[i];
      }
    }
    return null;
  };
  var he;
  /**
   * @param {boolean} target
   * @return {undefined}
   */
  var handler = function(target) {
    if (!he) {
      var value;
      /** @type {string} */
      value = doc.location.hash;
      /** @type {string} */
      var t = win.name;
      /** @type {RegExp} */
      var core_rnotwhite = /^#?gaso=([^&]*)/;
      if (t = (value = (value = value && value.match(core_rnotwhite) || t && t.match(core_rnotwhite)) ? value[1] : require(filter("GASO"))) && value.match(/^(?:!([-0-9a-z.]{1,40})!)?([-.\w]{10,1200})$/i)) {
        l(target, "GASO", "" + value, 0);
        node._gasoDomain = target.get(selector);
        node._gasoCPath = target.get(attr);
        target = t[1];
        loadScript("https://www.google.com/analytics/web/inpage/pub/inpage.js?" + (target ? "prefix=" + target + "&" : "") + done(), "_gasojs");
      }
      /** @type {boolean} */
      he = true;
    }
  };
  /**
   * @param {Object} target
   * @param {string} value
   * @param {?} data
   * @return {undefined}
   */
  var mixin = function(target, value, data) {
    if (data) {
      value = split(value);
    }
    data = target.b(elem, 1);
    value = value.split(".");
    if (!(2 > value.length)) {
      if (!!/^\d+$/.test(value[0])) {
        /** @type {string} */
        value[0] = "" + data;
        l(target, "__utmx", value.join("."), void 0);
      }
    }
  };
  /**
   * @param {Object} target
   * @param {boolean} test
   * @return {?}
   */
  var map = function(target, test) {
    var out = getName(target.get(elem), filter("__utmx"));
    if ("-" == out) {
      /** @type {string} */
      out = "";
    }
    return test ? escape(out) : out;
  };
  /**
   * @param {(Node|string)} element
   * @return {undefined}
   */
  var setup = function(element) {
    try {
      var item = select(doc.location.href, false);
      /** @type {string} */
      var pdataOld = decodeURIComponent(forEach(item.R.get("utm_referrer"))) || "";
      if (pdataOld) {
        element.set(parentNode, pdataOld);
      }
      /** @type {string} */
      var id = decodeURIComponent(require(item.R.get("utm_expid"))) || "";
      if (id) {
        /** @type {string} */
        id = id.split(".")[0];
        element.set(button, "" + id);
      }
    } catch (e) {
      replace(146);
    }
  };
  /**
   * @param {(Node|string)} elem
   * @return {undefined}
   */
  var restoreScript = function(elem) {
    var val = win.gaData && win.gaData.expId;
    if (val) {
      elem.set(button, "" + val);
    }
  };
  /**
   * @param {Node} e
   * @param {Function} next
   * @return {?}
   */
  var refresh = function(e, next) {
    /** @type {number} */
    var x = Math.min(e.b(count, 0), 100);
    if (e.b(o, 0) % 100 >= x) {
      return false;
    }
    x = calcFirstPaintTimeResults() || _render();
    if (void 0 == x) {
      return false;
    }
    var month = x[0];
    if (void 0 == month || (Infinity == month || isNaN(month))) {
      return false;
    }
    if (0 < month) {
      if (focus(x)) {
        next(traverse(x));
      } else {
        next(traverse(x.slice(0, 1)));
      }
    } else {
      addEvent(win, "load", function() {
        refresh(e, next);
      }, false);
    }
    return true;
  };
  /**
   * @param {string} element
   * @param {string} y
   * @param {number} value
   * @param {string} col
   * @return {?}
   */
  var getValue = function(element, y, value, col) {
    var node = new Element;
    node.f(14, 90, y.substring(0, 500));
    node.f(14, 91, element.substring(0, 150));
    node.f(14, 92, "" + getter(value));
    if (void 0 != col) {
      node.f(14, 93, col.substring(0, 500));
    }
    node.o(14, 90, value);
    return node;
  };
  /**
   * @param {(Array|NodeList)} data
   * @return {?}
   */
  var focus = function(data) {
    /** @type {number} */
    var i = 1;
    for (;i < data.length;i++) {
      if (isNaN(data[i]) || (Infinity == data[i] || 0 > data[i])) {
        return false;
      }
    }
    return true;
  };
  /**
   * @param {number} end
   * @return {?}
   */
  var getter = function(end) {
    return isNaN(end) || 0 > end ? 0 : 5E3 > end ? 10 * Math.floor(end / 10) : 5E4 > end ? 100 * Math.floor(end / 100) : 41E5 > end ? 1E3 * Math.floor(end / 1E3) : 41E5;
  };
  /**
   * @param {(Array|NodeList)} list
   * @return {?}
   */
  var traverse = function(list) {
    var node = new Element;
    /** @type {number} */
    var i = 0;
    for (;i < list.length;i++) {
      node.f(14, i + 1, "" + getter(list[i]));
      node.o(14, i + 1, list[i]);
    }
    return node;
  };
  /**
   * @return {?}
   */
  var calcFirstPaintTimeResults = function() {
    var t = win.performance || win.webkitPerformance;
    if (t = t && t.timing) {
      var sibling = t.navigationStart;
      if (0 == sibling) {
        replace(133);
      } else {
        return[t.loadEventStart - sibling, t.domainLookupEnd - t.domainLookupStart, t.connectEnd - t.connectStart, t.responseStart - t.requestStart, t.responseEnd - t.responseStart, t.fetchStart - sibling, t.domInteractive - sibling, t.domContentLoadedEventStart - sibling];
      }
    }
  };
  /**
   * @return {?}
   */
  var _render = function() {
    if (win.top == win) {
      var loc = win.external;
      var intersection = loc && loc.onloadT;
      if (loc) {
        if (!loc.isValidLoadTime) {
          intersection = void 0;
        }
      }
      if (2147483648 < intersection) {
        intersection = void 0;
      }
      if (0 < intersection) {
        loc.setPageReadyTime();
      }
      return void 0 == intersection ? void 0 : [intersection];
    }
  };
  /**
   * @param {HTMLElement} _this
   * @return {undefined}
   */
  var next = function(_this) {
    if (_this.get(handle)) {
      try {
        var event;
        a: {
          var tmp = filter(_this.get(newIndex) || "_ga");
          if (tmp && !(1 > tmp.length)) {
            /** @type {Array} */
            var ret = [];
            /** @type {number} */
            var x = 0;
            for (;x < tmp.length;x++) {
              var modId;
              var namespaces = tmp[x].split(".");
              var zeroQuoted = namespaces.shift();
              if (("GA1" == zeroQuoted || "1" == zeroQuoted) && 1 < namespaces.length) {
                var buf = namespaces.shift().split("-");
                if (1 == buf.length) {
                  /** @type {string} */
                  buf[1] = "1";
                }
                buf[0] *= 1;
                buf[1] *= 1;
                modId = {
                  Ya : buf,
                  $a : namespaces.join(".")
                };
              } else {
                modId = void 0;
              }
              if (modId) {
                ret.push(modId);
              }
            }
            if (1 == ret.length) {
              event = ret[0].$a;
              break a;
            }
            if (0 != ret.length) {
              var types = _this.get(cacheKey) || _this.get(selector);
              ret = merge(ret, (0 == types.indexOf(".") ? types.substr(1) : types).split(".").length, 0);
              if (1 == ret.length) {
                event = ret[0].$a;
                break a;
              }
              var val = _this.get(script) || _this.get(attr);
              if (tmp = val) {
                if (1 < tmp.length) {
                  if ("/" == tmp.charAt(tmp.length - 1)) {
                    tmp = tmp.substr(0, tmp.length - 1);
                  }
                }
                if (0 != tmp.indexOf("/")) {
                  /** @type {string} */
                  tmp = "/" + tmp;
                }
                val = tmp;
              } else {
                /** @type {string} */
                val = "/";
              }
              ret = merge(ret, "/" == val ? 1 : val.split("/").length, 1);
              event = ret[0].$a;
              break a;
            }
          }
          event = void 0;
        }
        if (event) {
          /** @type {Array.<string>} */
          var list = ("" + event).split(".");
          if (2 == list.length) {
            if (/[0-9.]/.test(list)) {
              replace(114);
              _this.set(o, list[0]);
              _this.set(tag, list[1]);
              _this.set(handle, false);
            }
          }
        }
      } catch (mb) {
        replace(115);
      }
    }
  };
  /**
   * @param {Array} parent
   * @param {?} tree
   * @param {number} key
   * @return {?}
   */
  var merge = function(parent, tree, key) {
    /** @type {Array} */
    var paragraph = [];
    /** @type {Array} */
    var children = [];
    /** @type {number} */
    var val = 128;
    /** @type {number} */
    var i = 0;
    for (;i < parent.length;i++) {
      var child = parent[i];
      if (child.Ya[key] == tree) {
        paragraph.push(child);
      } else {
        if (child.Ya[key] == val) {
          children.push(child);
        } else {
          if (child.Ya[key] < val) {
            /** @type {Array} */
            children = [child];
            val = child.Ya[key];
          }
        }
      }
    }
    return 0 < paragraph.length ? paragraph : children;
  };
  /** @type {RegExp} */
  var cx = /^gtm\d+$/;
  /**
   * @param {Object} that
   * @return {undefined}
   */
  var test = function(that) {
    var json;
    /** @type {boolean} */
    json = !!that.b(targets, 1);
    if (json) {
      replace(140);
      if ("page" != that.get(n)) {
        that.set(first, "", true);
      } else {
        json = that.c(c, "");
        if (!json) {
          /** @type {string} */
          json = (json = that.c(third, "")) && "~0" != json ? cx.test(json) ? "__utmt_" + escape(that.c(key, "")) : "__utmt_" + escape(json) : "__utmt";
        }
        if (0 < filter(json).length) {
          that.set(first, "", true);
        } else {
          stringify(json, "1", that.c(attr, "/"), that.c(selector, ""), that.c(key, ""), 6E5);
          if (0 < filter(json).length) {
            that.set(first, done(), true);
            that.set(b, 3, true);
            that.set(a, trigger() + "/r/__utm.gif?", true);
          }
        }
      }
    }
  };
  /**
   * @param {string} state
   * @param {string} blockHolder
   * @param {string} stream
   * @return {undefined}
   */
  var $ = function(state, blockHolder, stream) {
    /**
     * @param {string} method
     * @return {?}
     */
    function bind(method) {
      return function(context) {
        if ((context = context.get(id)[method]) && context.length) {
          var operation = makeKeyEvent(opts, method);
          /** @type {number} */
          var c = 0;
          for (;c < context.length;c++) {
            context[c].call(opts, operation);
          }
        }
      };
    }
    var opts = this;
    this.a = new Storage;
    /**
     * @param {?} key
     * @return {?}
     */
    this.get = function(key) {
      return this.a.get(key);
    };
    /**
     * @param {?} key
     * @param {?} value
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    this.set = function(key, value, dataAndEvents) {
      this.a.set(key, value, dataAndEvents);
    };
    this.set(key, blockHolder || "UA-XXXXX-X");
    this.set(third, state || "");
    this.set(md, stream || "");
    this.set(value, Math.round((new Date).getTime() / 1E3));
    this.set(attr, "/");
    this.set(i, 63072E6);
    this.set(prop, 15768E6);
    this.set(r, 18E5);
    this.set(actualKey, false);
    this.set(methods, 50);
    this.set(callee, false);
    this.set(key1, true);
    this.set(name, true);
    this.set(modalInstance, true);
    this.set(attrs, true);
    this.set(key2, true);
    this.set(version, "utm_campaign");
    this.set(p, "utm_id");
    this.set(offsetParent, "gclid");
    this.set(target, "utm_source");
    this.set(subKey, "utm_medium");
    this.set(ast, "utm_term");
    this.set(ms, "utm_content");
    this.set(opt_key, "utm_nooverride");
    this.set(k, 100);
    this.set(count, 1);
    this.set(indexKey, false);
    this.set(KEY, "/__utm.gif");
    this.set(input, 1);
    this.set(type, []);
    this.set(data, []);
    this.set(sid, models.slice(0));
    this.set(idx, []);
    this.set(val, []);
    this.B("auto");
    this.set(parentNode, doc.referrer);
    setup(this.a);
    this.set(id, {
      hit : [],
      load : []
    });
    this.a.g("0", poll);
    this.a.g("1", w);
    this.a.g("2", reset);
    this.a.g("3", next);
    this.a.g("4", link);
    this.a.g("5", end);
    this.a.g("6", change);
    this.a.g("7", bind("load"));
    this.a.g("8", handler);
    this.a.v("A", close);
    this.a.v("B", _track);
    this.a.v("C", which);
    this.a.v("D", reset);
    this.a.v("E", blur);
    this.a.v("F", stop);
    this.a.v("G", play);
    this.a.v("H", click);
    this.a.v("I", errorHandler);
    this.a.v("J", onSuccess);
    this.a.v("K", initialize);
    this.a.v("L", loaded);
    this.a.v("M", restoreScript);
    this.a.v("N", test);
    this.a.v("O", bind("hit"));
    this.a.v("P", find);
    this.a.v("Q", exit);
    if (0 === this.get(value)) {
      replace(111);
    }
    this.a.T();
    this.H = void 0;
  };
  item = $.prototype;
  /**
   * @return {?}
   */
  item.m = function() {
    var silentOptions = this.get(ctx);
    if (!silentOptions) {
      silentOptions = new Element;
      this.set(ctx, silentOptions);
    }
    return silentOptions;
  };
  /**
   * @param {Object} props
   * @return {undefined}
   */
  item.La = function(props) {
    var prop;
    for (prop in props) {
      var silentOptions = props[prop];
      if (props.hasOwnProperty(prop)) {
        this.set(prop, silentOptions, true);
      }
    }
  };
  /**
   * @param {?} udataCur
   * @return {?}
   */
  item.K = function(udataCur) {
    if (this.get(indexKey)) {
      return false;
    }
    var data_user = this;
    var silentOptions = refresh(this.a, function(isXML) {
      data_user.set(path, udataCur, true);
      data_user.ib(isXML);
    });
    this.set(indexKey, silentOptions);
    return silentOptions;
  };
  /**
   * @param {Object} val
   * @return {undefined}
   */
  item.Fa = function(val) {
    if (val && isString(val)) {
      replace(13);
      this.set(path, val, true);
    } else {
      if ("object" === typeof val) {
        if (null !== val) {
          this.La(val);
        }
      }
    }
    this.H = val = this.get(path);
    this.a.j("page");
    this.K(val);
  };
  /**
   * @param {string} id
   * @param {string} key
   * @param {?} value
   * @param {string} x
   * @param {?} l
   * @return {?}
   */
  item.F = function(id, key, value, x, l) {
    if ("" == id || (!encodeURIComponent(id) || ("" == key || (!encodeURIComponent(key) || (void 0 != value && !encodeURIComponent(value) || void 0 != x && !isNumber(x)))))) {
      return false;
    }
    this.set(parent, id, true);
    this.set(time, key, true);
    this.set(query, value, true);
    this.set(primaryKey, x, true);
    this.set(pn, !!l, true);
    this.a.j("event");
    return true;
  };
  /**
   * @param {string} key
   * @param {string} h
   * @param {number} width
   * @param {string} c
   * @param {number} textAlt
   * @return {?}
   */
  item.Ha = function(key, h, width, c, textAlt) {
    var text = this.a.b(count, 0);
    if (1 * textAlt === textAlt) {
      /** @type {number} */
      text = textAlt;
    }
    if (this.a.b(o, 0) % 100 >= text) {
      return false;
    }
    /** @type {number} */
    width = 1 * ("" + width);
    if ("" == key || (!encodeURIComponent(key) || ("" == h || (!encodeURIComponent(h) || (!isNumber(width) || (isNaN(width) || (0 > width || (0 > text || (100 < text || void 0 != c && ("" == c || !encodeURIComponent(c))))))))))) {
      return false;
    }
    this.ib(getValue(key, h, width, c));
    return true;
  };
  /**
   * @param {?} isXML
   * @param {?} caption
   * @param {string} sUrl
   * @param {?} silentOptions
   * @return {?}
   */
  item.Ga = function(isXML, caption, sUrl, silentOptions) {
    if (!isXML || !caption) {
      return false;
    }
    this.set(part, isXML, true);
    this.set(hash, caption, true);
    this.set(contextKey, sUrl || doc.location.href, true);
    if (silentOptions) {
      this.set(path, silentOptions, true);
    }
    this.a.j("social");
    return true;
  };
  /**
   * @return {undefined}
   */
  item.Ea = function() {
    this.set(count, 10);
    this.K(this.H);
  };
  /**
   * @return {undefined}
   */
  item.Ia = function() {
    this.a.j("trans");
  };
  /**
   * @param {?} isXML
   * @return {undefined}
   */
  item.ib = function(isXML) {
    this.set(index, isXML, true);
    this.a.j("event");
  };
  /**
   * @param {string} storedFileId
   * @return {?}
   */
  item.ia = function(storedFileId) {
    this.initData();
    var self = this;
    return{
      /**
       * @param {string} eventType
       * @param {string} value
       * @param {string} event
       * @return {undefined}
       */
      _trackEvent : function(eventType, value, event) {
        replace(91);
        self.F(storedFileId, eventType, value, event);
      }
    };
  };
  /**
   * @param {?} storageKey
   * @return {?}
   */
  item.ma = function(storageKey) {
    return this.get(storageKey);
  };
  /**
   * @param {Object} prop
   * @param {?} isXML
   * @return {undefined}
   */
  item.xa = function(prop, isXML) {
    if (prop) {
      if (isString(prop)) {
        this.set(prop, isXML);
      } else {
        if ("object" == typeof prop) {
          var p;
          for (p in prop) {
            if (prop.hasOwnProperty(p)) {
              this.set(p, prop[p]);
            }
          }
        }
      }
    }
  };
  /**
   * @param {string} name
   * @param {Function} handler
   * @return {undefined}
   */
  item.addEventListener = function(name, handler) {
    var set = this.get(id)[name];
    if (set) {
      set.push(handler);
    }
  };
  /**
   * @param {string} name
   * @param {Function} listener
   * @return {undefined}
   */
  item.removeEventListener = function(name, listener) {
    var arr = this.get(id)[name];
    /** @type {number} */
    var i = 0;
    for (;arr && i < arr.length;i++) {
      if (arr[i] == listener) {
        arr.splice(i, 1);
        break;
      }
    }
  };
  /**
   * @return {?}
   */
  item.qa = function() {
    return "5.6.7dc";
  };
  /**
   * @param {Object} val
   * @return {undefined}
   */
  item.B = function(val) {
    this.get(key1);
    val = "auto" == val ? gsub(doc.domain) : val && ("-" != val && "none" != val) ? val.toLowerCase() : "";
    this.set(selector, val);
  };
  /**
   * @param {?} dataAndEvents
   * @return {undefined}
   */
  item.va = function(dataAndEvents) {
    this.set(key1, !!dataAndEvents);
  };
  /**
   * @param {string} slide
   * @param {string} re
   * @return {?}
   */
  item.na = function(slide, re) {
    return addClass(this.a, slide, re);
  };
  /**
   * @param {string} elem
   * @param {string} options
   * @return {undefined}
   */
  item.link = function(elem, options) {
    if (this.a.get(actualKey) && elem) {
      var content = addClass(this.a, elem, options);
      doc.location.href = content;
    }
  };
  /**
   * @param {Object} item
   * @param {string} re
   * @return {undefined}
   */
  item.ua = function(item, re) {
    if (this.a.get(actualKey)) {
      if (item) {
        if (item.action) {
          item.action = addClass(this.a, item.action, re);
        }
      }
    }
  };
  /**
   * @return {undefined}
   */
  item.za = function() {
    this.initData();
    var a = this.a;
    var list = doc.getElementById ? doc.getElementById("utmtrans") : doc.utmform && doc.utmform.utmtrans ? doc.utmform.utmtrans : null;
    if (list && list.value) {
      a.set(type, []);
      list = list.value.split("UTM:");
      /** @type {number} */
      var i = 0;
      for (;i < list.length;i++) {
        list[i] = trim(list[i]);
        var branchDataJSON = list[i].split(slashSplit);
        /** @type {number} */
        var conditionIndex = 0;
        for (;conditionIndex < branchDataJSON.length;conditionIndex++) {
          branchDataJSON[conditionIndex] = trim(branchDataJSON[conditionIndex]);
        }
        if ("T" == branchDataJSON[0]) {
          emit(a, branchDataJSON[1], branchDataJSON[2], branchDataJSON[3], branchDataJSON[4], branchDataJSON[5], branchDataJSON[6], branchDataJSON[7], branchDataJSON[8]);
        } else {
          if ("I" == branchDataJSON[0]) {
            addItem(a, branchDataJSON[1], branchDataJSON[2], branchDataJSON[3], branchDataJSON[4], branchDataJSON[5], branchDataJSON[6]);
          }
        }
      }
    }
  };
  /**
   * @param {number} doc
   * @param {?} callback
   * @param {number} err
   * @param {?} re
   * @param {?} state
   * @param {?} isXML
   * @param {number} walkers
   * @param {?} attr
   * @return {?}
   */
  item.$ = function(doc, callback, err, re, state, isXML, walkers, attr) {
    return emit(this.a, doc, callback, err, re, state, isXML, walkers, attr);
  };
  /**
   * @param {number} inplace
   * @param {?} dataName
   * @param {string} node
   * @param {?} deepDataAndEvents
   * @param {?} d
   * @param {?} opt_i
   * @return {?}
   */
  item.Y = function(inplace, dataName, node, deepDataAndEvents, d, opt_i) {
    return addItem(this.a, inplace, dataName, node, deepDataAndEvents, d, opt_i);
  };
  /**
   * @param {string} dataAndEvents
   * @return {undefined}
   */
  item.Aa = function(dataAndEvents) {
    slashSplit = dataAndEvents || "|";
  };
  /**
   * @return {undefined}
   */
  item.ea = function() {
    this.set(type, []);
  };
  /**
   * @param {boolean} i
   * @param {string} value
   * @param {?} key
   * @param {number} lvl
   * @return {?}
   */
  item.wa = function(i, value, key, lvl) {
    var object = this.a;
    if (0 >= i || i > object.get(methods)) {
      /** @type {boolean} */
      i = false;
    } else {
      if (!value || (!key || 128 < value.length + key.length)) {
        /** @type {boolean} */
        i = false;
      } else {
        if (1 != lvl) {
          if (2 != lvl) {
            /** @type {number} */
            lvl = 3;
          }
        }
        var o = {};
        /** @type {string} */
        o.name = value;
        o.value = key;
        /** @type {number} */
        o.scope = lvl;
        object.get(data)[i] = o;
        /** @type {boolean} */
        i = true;
      }
    }
    if (i) {
      this.a.gb();
    }
    return i;
  };
  /**
   * @param {?} field
   * @return {undefined}
   */
  item.ka = function(field) {
    this.a.get(data)[field] = void 0;
    this.a.gb();
  };
  /**
   * @param {Object} field
   * @return {?}
   */
  item.ra = function(field) {
    return(field = this.a.get(data)[field]) && 1 == field.scope ? field.value : void 0;
  };
  /**
   * @param {number} opt_attributes
   * @param {number} expectedNumberOfNonCommentArgs
   * @param {?} isXML
   * @return {undefined}
   */
  item.Ca = function(opt_attributes, expectedNumberOfNonCommentArgs, isXML) {
    if (12 == opt_attributes && 1 == expectedNumberOfNonCommentArgs) {
      this.set(second, isXML);
    } else {
      this.m().f(opt_attributes, expectedNumberOfNonCommentArgs, isXML);
    }
  };
  /**
   * @param {number} opt_attributes
   * @param {number} expectedNumberOfNonCommentArgs
   * @param {(number|string)} defs
   * @return {undefined}
   */
  item.Da = function(opt_attributes, expectedNumberOfNonCommentArgs, defs) {
    this.m().o(opt_attributes, expectedNumberOfNonCommentArgs, defs);
  };
  /**
   * @param {number} index
   * @param {?} which
   * @return {?}
   */
  item.sa = function(index, which) {
    return this.m().getKey(index, which);
  };
  /**
   * @param {number} name
   * @param {?} until
   * @return {?}
   */
  item.ta = function(name, until) {
    return this.m().N(name, until);
  };
  /**
   * @param {number} defs
   * @return {undefined}
   */
  item.fa = function(defs) {
    this.m().L(defs);
  };
  /**
   * @param {number} defs
   * @return {undefined}
   */
  item.ga = function(defs) {
    this.m().M(defs);
  };
  /**
   * @return {?}
   */
  item.ja = function() {
    return new Element;
  };
  /**
   * @param {Object} opts
   * @return {undefined}
   */
  item.W = function(opts) {
    if (opts) {
      this.get(idx).push(opts.toLowerCase());
    }
  };
  /**
   * @return {undefined}
   */
  item.ba = function() {
    this.set(idx, []);
  };
  /**
   * @param {Object} b
   * @return {undefined}
   */
  item.X = function(b) {
    if (b) {
      this.get(val).push(b.toLowerCase());
    }
  };
  /**
   * @return {undefined}
   */
  item.ca = function() {
    this.set(val, []);
  };
  /**
   * @param {string} mod
   * @param {string} cmd
   * @param {boolean} err
   * @param {Array} m
   * @param {Array} querystring
   * @return {undefined}
   */
  item.Z = function(mod, cmd, err, m, querystring) {
    if (mod && cmd) {
      /** @type {string} */
      mod = [mod, cmd.toLowerCase()].join(":");
      if (m || querystring) {
        /** @type {string} */
        mod = [mod, m, querystring].join(":");
      }
      m = this.get(sid);
      m.splice(err ? 0 : m.length, 0, mod);
    }
  };
  /**
   * @return {undefined}
   */
  item.da = function() {
    this.set(sid, []);
  };
  /**
   * @param {?} isXML
   * @return {undefined}
   */
  item.ha = function(isXML) {
    this.a.load();
    var silentOptions = this.get(attr);
    var udataCur = map(this.a);
    this.set(attr, isXML);
    this.a.gb();
    mixin(this.a, udataCur);
    this.set(attr, silentOptions);
  };
  /**
   * @param {number} path
   * @param {string} val
   * @return {undefined}
   */
  item.ya = function(path, val) {
    if (0 < path && (5 >= path && (isString(val) && "" != val))) {
      var silentOptions = this.get(uuid) || [];
      /** @type {string} */
      silentOptions[path] = val;
      this.set(uuid, silentOptions);
    }
  };
  /**
   * @param {string} tagName
   * @return {undefined}
   */
  item.V = function(tagName) {
    /** @type {string} */
    tagName = "" + tagName;
    if (tagName.match(/^[A-Za-z0-9]{1,5}$/)) {
      var silentOptions = this.get(url) || [];
      silentOptions.push(tagName);
      this.set(url, silentOptions);
    }
  };
  /**
   * @return {undefined}
   */
  item.initData = function() {
    this.a.load();
  };
  /**
   * @param {string} isXML
   * @return {undefined}
   */
  item.Ba = function(isXML) {
    if (isXML) {
      if ("" != isXML) {
        this.set(state, isXML);
        this.a.j("var");
      }
    }
  };
  /**
   * @param {Object} self
   * @return {undefined}
   */
  var play = function(self) {
    if ("trans" !== self.get(n)) {
      if (500 <= self.b(expr, 0)) {
        self.stopPropagation();
      }
    }
    if ("event" === self.get(n)) {
      /** @type {number} */
      var pdataOld = (new Date).getTime();
      var dir = self.b(pos, 0);
      var values = self.b(properties, 0);
      /** @type {number} */
      dir = Math.floor((pdataOld - (dir != values ? dir : 1E3 * dir)) / 1E3 * 1);
      if (0 < dir) {
        self.set(pos, pdataOld);
        self.set(disabled, Math.min(10, self.b(disabled, 0) + dir));
      }
      if (0 >= self.b(disabled, 0)) {
        self.stopPropagation();
      }
    }
  };
  /**
   * @param {Node} c
   * @return {undefined}
   */
  var exit = function(c) {
    if ("event" === c.get(n)) {
      c.set(disabled, Math.max(0, c.b(disabled, 10) - 1));
    }
  };
  /**
   * @return {undefined}
   */
  var Buffer = function() {
    /** @type {Array} */
    var headers = [];
    /**
     * @param {string} key
     * @param {string} value
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    this.add = function(key, value, dataAndEvents) {
      if (dataAndEvents) {
        value = escape("" + value);
      }
      headers.push(key + "=" + value);
    };
    /**
     * @return {?}
     */
    this.toString = function() {
      return headers.join("&");
    };
  };
  /**
   * @param {Object} path
   * @param {boolean} keepData
   * @return {undefined}
   */
  var resolve = function(path, keepData) {
    if (keepData || 2 != path.get(input)) {
      path.Za(expr);
    }
  };
  /**
   * @param {Object} str
   * @param {?} d
   * @return {undefined}
   */
  var error = function(str, d) {
    d.add("utmwv", "5.6.7dc");
    d.add("utms", str.get(expr));
    d.add("utmn", done());
    /** @type {string} */
    var node = doc.location.hostname;
    if (!expect(node)) {
      d.add("utmhn", node, true);
    }
    node = str.get(k);
    if (100 != node) {
      d.add("utmsp", node, true);
    }
  };
  /**
   * @param {Object} t
   * @param {Object} el
   * @return {undefined}
   */
  var set = function(t, el) {
    el.add("utmht", (new Date).getTime());
    el.add("utmac", trim(t.get(key)));
    if (t.get(button)) {
      el.add("utmxkey", t.get(button), true);
    }
    if (t.get(pn)) {
      el.add("utmni", 1);
    }
    if (t.get(code)) {
      el.add("utmgtm", t.get(code), true);
    }
    var queryString = t.get(url);
    if (queryString) {
      if (0 < queryString.length) {
        el.add("utmdid", queryString.join("."));
      }
    }
    finish(t, el);
    if (false !== t.get(span)) {
      if (t.get(span) || node.w) {
        el.add("aip", 1);
      }
    }
    if (void 0 !== t.get(first)) {
      el.add("utmjid", t.c(first, ""), true);
    }
    if (t.b(b, 0)) {
      el.add("utmredir", t.b(b, 0), true);
    }
    if (!node.bb) {
      node.bb = t.get(key);
    }
    if (1 < node.ab() || node.bb != t.get(key)) {
      el.add("utmmt", 1);
    }
    el.add("utmu", exports.encode());
  };
  /**
   * @param {Object} right
   * @param {?} collection
   * @return {undefined}
   */
  var process = function(right, collection) {
    var codeSegments = right.get(uuid) || [];
    /** @type {Array} */
    var leaks = [];
    /** @type {number} */
    var i = 1;
    for (;i < codeSegments.length;i++) {
      if (codeSegments[i]) {
        leaks.push(i + ":" + escape(codeSegments[i].replace(/%/g, "%25").replace(/:/g, "%3A").replace(/,/g, "%2C")));
      }
    }
    if (leaks.length) {
      collection.add("utmpg", leaks.join(","));
    }
  };
  /**
   * @param {Object} value
   * @param {Object} text
   * @return {undefined}
   */
  var finish = function(value, text) {
    /**
     * @param {string} label
     * @param {?} results
     * @return {undefined}
     */
    function report(label, results) {
      if (results) {
        tagNameArr.push(label + "=" + results + ";");
      }
    }
    /** @type {Array} */
    var tagNameArr = [];
    report("__utma", apply(value));
    report("__utmz", onComplete(value, false));
    report("__utmv", complete(value, true));
    report("__utmx", map(value));
    text.add("utmcc", tagNameArr.join("+"), true);
  };
  /**
   * @param {Object} parent
   * @param {?} objects
   * @return {undefined}
   */
  var expand = function(parent, objects) {
    if (parent.get(name)) {
      objects.add("utmcs", parent.get(foo), true);
      objects.add("utmsr", parent.get(expireKey));
      if (parent.get(group)) {
        objects.add("utmvp", parent.get(group));
      }
      objects.add("utmsc", parent.get(serverAttrs));
      objects.add("utmul", parent.get(localStorageName));
      objects.add("utmje", parent.get(field));
      objects.add("utmfl", parent.get(testKey), true);
    }
  };
  /**
   * @param {Object} view
   * @param {?} target
   * @return {undefined}
   */
  var log = function(view, target) {
    if (view.get(key2)) {
      if (view.get(storageKey)) {
        target.add("utmdt", view.get(storageKey), true);
      }
    }
    target.add("utmhid", view.get(CACHE_KEY));
    target.add("utmr", _(view.get(parentNode), view.get(attr)), true);
    target.add("utmp", escape(view.get(path), true), true);
  };
  /**
   * @param {Object} doc
   * @param {?} _
   * @return {undefined}
   */
  var callback = function(doc, _) {
    var node = doc.get(ctx);
    var self = doc.get(index);
    var d = doc.get(data) || [];
    /** @type {number} */
    var i = 0;
    for (;i < d.length;i++) {
      var el = d[i];
      if (el) {
        if (!node) {
          node = new Element;
        }
        node.f(8, i, el.name);
        node.f(9, i, el.value);
        if (3 != el.scope) {
          node.f(11, i, "" + el.scope);
        }
      }
    }
    if (!expect(doc.get(parent))) {
      if (!expect(doc.get(time), true)) {
        if (!node) {
          node = new Element;
        }
        node.f(5, 1, doc.get(parent));
        node.f(5, 2, doc.get(time));
        d = doc.get(query);
        if (void 0 != d) {
          node.f(5, 3, d);
        }
        d = doc.get(primaryKey);
        if (void 0 != d) {
          node.o(5, 1, d);
        }
      }
    }
    if (!expect(doc.get(second))) {
      if (!node) {
        node = new Element;
      }
      node.f(12, 1, doc.get(second));
    }
    if (node) {
      _.add("utme", node.Qa(self), true);
    } else {
      if (self) {
        _.add("utme", self.A(), true);
      }
    }
  };
  /**
   * @param {Object} path
   * @param {Object} node
   * @param {boolean} name
   * @return {?}
   */
  var fn = function(path, node, name) {
    var key = new Buffer;
    resolve(path, name);
    error(path, key);
    key.add("utmt", "tran");
    key.add("utmtid", node.id_, true);
    key.add("utmtst", node.affiliation_, true);
    key.add("utmtto", node.total_, true);
    key.add("utmttx", node.tax_, true);
    key.add("utmtsp", node.shipping_, true);
    key.add("utmtci", node.city_, true);
    key.add("utmtrg", node.state_, true);
    key.add("utmtco", node.country_, true);
    callback(path, key);
    expand(path, key);
    log(path, key);
    if (node = path.get(root)) {
      key.add("utmcu", node, true);
    }
    if (!name) {
      process(path, key);
      set(path, key);
    }
    return key.toString();
  };
  /**
   * @param {Object} path
   * @param {Text} node
   * @param {boolean} name
   * @return {?}
   */
  var get = function(path, node, name) {
    var key = new Buffer;
    resolve(path, name);
    error(path, key);
    key.add("utmt", "item");
    key.add("utmtid", node.transId_, true);
    key.add("utmipc", node.sku_, true);
    key.add("utmipn", node.name_, true);
    key.add("utmiva", node.category_, true);
    key.add("utmipr", node.price_, true);
    key.add("utmiqt", node.quantity_, true);
    callback(path, key);
    expand(path, key);
    log(path, key);
    if (node = path.get(root)) {
      key.add("utmcu", node, true);
    }
    if (!name) {
      process(path, key);
      set(path, key);
    }
    return key.toString();
  };
  /**
   * @param {Object} path
   * @param {boolean} name
   * @return {?}
   */
  var compile = function(path, name) {
    var data = path.get(n);
    if ("page" == data) {
      data = new Buffer;
      resolve(path, name);
      error(path, data);
      callback(path, data);
      expand(path, data);
      log(path, data);
      if (!name) {
        process(path, data);
        set(path, data);
      }
      /** @type {Array} */
      data = [data.toString()];
    } else {
      if ("event" == data) {
        data = new Buffer;
        resolve(path, name);
        error(path, data);
        data.add("utmt", "event");
        callback(path, data);
        expand(path, data);
        log(path, data);
        if (!name) {
          process(path, data);
          set(path, data);
        }
        /** @type {Array} */
        data = [data.toString()];
      } else {
        if ("var" == data) {
          data = new Buffer;
          resolve(path, name);
          error(path, data);
          data.add("utmt", "var");
          if (!name) {
            set(path, data);
          }
          /** @type {Array} */
          data = [data.toString()];
        } else {
          if ("trans" == data) {
            /** @type {Array} */
            data = [];
            var codeSegments = path.get(type);
            /** @type {number} */
            var i = 0;
            for (;i < codeSegments.length;++i) {
              data.push(fn(path, codeSegments[i], name));
              var parts = codeSegments[i].items_;
              /** @type {number} */
              var idx = 0;
              for (;idx < parts.length;++idx) {
                data.push(get(path, parts[idx], name));
              }
            }
          } else {
            if ("social" == data) {
              if (name) {
                /** @type {Array} */
                data = [];
              } else {
                data = new Buffer;
                resolve(path, name);
                error(path, data);
                data.add("utmt", "social");
                data.add("utmsn", path.get(part), true);
                data.add("utmsa", path.get(hash), true);
                data.add("utmsid", path.get(contextKey), true);
                callback(path, data);
                expand(path, data);
                log(path, data);
                process(path, data);
                set(path, data);
                /** @type {Array} */
                data = [data.toString()];
              }
            } else {
              if ("feedback" == data) {
                if (name) {
                  /** @type {Array} */
                  data = [];
                } else {
                  data = new Buffer;
                  resolve(path, name);
                  error(path, data);
                  data.add("utmt", "feedback");
                  data.add("utmfbid", path.get(d), true);
                  data.add("utmfbpr", path.get(file), true);
                  callback(path, data);
                  expand(path, data);
                  log(path, data);
                  process(path, data);
                  set(path, data);
                  /** @type {Array} */
                  data = [data.toString()];
                }
              } else {
                /** @type {Array} */
                data = [];
              }
            }
          }
        }
      }
    }
    return data;
  };
  /**
   * @param {Object} t
   * @return {undefined}
   */
  var find = function(t) {
    var employees;
    var method = t.get(input);
    var element = t.get(keys);
    var restoreScript = element && element.Ua;
    /** @type {number} */
    var className = 0;
    if (0 == method || 2 == method) {
      var CB = t.get(KEY) + "?";
      employees = compile(t, true);
      /** @type {number} */
      var i = 0;
      var l = employees.length;
      for (;i < l;i++) {
        preload(employees[i], restoreScript, CB, true);
        className++;
      }
    }
    if (1 == method || 2 == method) {
      employees = compile(t);
      t = t.c(a, "");
      /** @type {number} */
      i = 0;
      l = employees.length;
      for (;i < l;i++) {
        try {
          preload(employees[i], restoreScript, t);
          className++;
        } catch (to) {
          if (to) {
            add(to.name, void 0, to.message);
          }
        }
      }
    }
    if (element) {
      /** @type {number} */
      element.fb = className;
    }
  };
  /**
   * @return {?}
   */
  var trigger = function() {
    return "https:" == doc.location.protocol || node.G ? "https://stats.g.doubleclick.net" : "http://stats.g.doubleclick.net";
  };
  /**
   * @param {string} type
   * @return {undefined}
   */
  var ctor = function(type) {
    /** @type {string} */
    this.name = "len";
    /** @type {string} */
    this.message = type + "-8192";
  };
  /**
   * @param {string} message
   * @return {undefined}
   */
  var assert = function(message) {
    /** @type {string} */
    this.name = "ff2post";
    /** @type {string} */
    this.message = message + "-2036";
  };
  /**
   * @param {string} value
   * @param {string} callback
   * @param {string} cb
   * @param {boolean} dataAndEvents
   * @return {undefined}
   */
  var preload = function(value, callback, cb, dataAndEvents) {
    callback = callback || noop;
    if (dataAndEvents || 2036 >= value.length) {
      load(value, callback, cb);
    } else {
      if (8192 >= value.length) {
        if (0 <= win.navigator.userAgent.indexOf("Firefox") && ![].reduce) {
          throw new assert(value.length);
        }
        if (!request(value, callback)) {
          if (!f(value, callback)) {
            callback();
          }
        }
      } else {
        throw new ctor(value.length);
      }
    }
  };
  /**
   * @param {string} filename
   * @param {string} callback
   * @param {string} path
   * @return {undefined}
   */
  var load = function(filename, callback, path) {
    path = path || trigger() + "/__utm.gif?";
    /** @type {Image} */
    var image = new Image(1, 1);
    image.src = path + filename;
    /**
     * @return {undefined}
     */
    image.onload = function() {
      /** @type {null} */
      image.onload = null;
      /** @type {null} */
      image.onerror = null;
      callback();
    };
    /**
     * @return {undefined}
     */
    image.onerror = function() {
      /** @type {null} */
      image.onload = null;
      /** @type {null} */
      image.onerror = null;
      callback();
    };
  };
  /**
   * @param {string} data
   * @param {string} callback
   * @return {?}
   */
  var request = function(data, callback) {
    var XHR = win.XMLHttpRequest;
    if (!XHR) {
      return false;
    }
    /** @type {XMLHttpRequest} */
    var xhr = new XHR;
    if (!("withCredentials" in xhr)) {
      return false;
    }
    xhr.open("POST", trigger() + "/p/__utm.gif", true);
    /** @type {boolean} */
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "text/plain");
    /**
     * @return {undefined}
     */
    xhr.onreadystatechange = function() {
      if (4 == xhr.readyState) {
        callback();
        /** @type {null} */
        xhr = null;
      }
    };
    xhr.send(data);
    return true;
  };
  /**
   * @param {string} value
   * @param {string} cb
   * @return {?}
   */
  var f = function(value, cb) {
    if (!doc.body) {
      return step(function() {
        f(value, cb);
      }, 100), true;
    }
    /** @type {string} */
    value = encodeURIComponent(value);
    try {
      /** @type {Element} */
      var el = doc.createElement('<iframe name="' + value + '"></iframe>');
    } catch (d) {
      /** @type {Element} */
      el = doc.createElement("iframe");
      /** @type {string} */
      el.name = value;
    }
    /** @type {string} */
    el.height = "0";
    /** @type {string} */
    el.width = "0";
    /** @type {string} */
    el.style.display = "none";
    /** @type {string} */
    el.style.visibility = "hidden";
    /** @type {string} */
    var path = trigger() + "/u/post_iframe_dc.html";
    addEvent(win, "beforeunload", function() {
      /** @type {string} */
      el.src = "";
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    setTimeout(cb, 1E3);
    doc.body.appendChild(el);
    /** @type {string} */
    el.src = path;
    return true;
  };
  /**
   * @return {undefined}
   */
  var loop = function() {
    /** @type {boolean} */
    this.G = this.w = false;
    if (0 == done() % 100) {
      replace(142);
      /** @type {boolean} */
      this.G = true;
    }
    this.C = {};
    /** @type {Array} */
    this.D = [];
    /** @type {number} */
    this.U = 0;
    /** @type {Array} */
    this.S = [["www.google-analytics.com", "", "/plugins/"]];
    this._gasoCPath = this._gasoDomain = this.bb = void 0;
    iterate();
    _createScriptTag();
  };
  item = loop.prototype;
  /**
   * @param {string} walkers
   * @param {string} deepDataAndEvents
   * @return {?}
   */
  item.oa = function(walkers, deepDataAndEvents) {
    return this.hb(walkers, void 0, deepDataAndEvents);
  };
  /**
   * @param {string} obj
   * @param {string} name
   * @param {string} deepDataAndEvents
   * @return {?}
   */
  item.hb = function(obj, name, deepDataAndEvents) {
    if (name) {
      replace(23);
    }
    if (deepDataAndEvents) {
      replace(67);
    }
    if (void 0 == name) {
      /** @type {string} */
      name = "~" + node.U++;
    }
    obj = new $(name, obj, deepDataAndEvents);
    /** @type {string} */
    node.C[name] = obj;
    node.D.push(obj);
    return obj;
  };
  /**
   * @param {string} d
   * @return {?}
   */
  item.u = function(d) {
    d = d || "";
    return node.C[d] || node.hb(void 0, d);
  };
  /**
   * @return {?}
   */
  item.pa = function() {
    return node.D.slice(0);
  };
  /**
   * @return {?}
   */
  item.ab = function() {
    return node.D.length;
  };
  /**
   * @return {undefined}
   */
  item.aa = function() {
    /** @type {boolean} */
    this.w = true;
  };
  /**
   * @return {undefined}
   */
  item.la = function() {
    /** @type {boolean} */
    this.G = true;
  };
  /**
   * @param {Function} callback
   * @return {?}
   */
  var empty = function(callback) {
    if ("prerender" == doc.visibilityState) {
      return false;
    }
    callback();
    return true;
  };
  var node = new loop;
  var callbackOutput = win._gat;
  if (callbackOutput && isFunction(callbackOutput._getTracker)) {
    node = callbackOutput;
  } else {
    win._gat = node;
  }
  var current = new self;
  (function(value) {
    if (!empty(value)) {
      replace(123);
      /** @type {boolean} */
      var right = false;
      /**
       * @return {undefined}
       */
      var fn = function() {
        if (!right && empty(value)) {
          /** @type {boolean} */
          right = true;
          /** @type {HTMLDocument} */
          var obj = doc;
          /** @type {function (): undefined} */
          var f = fn;
          if (obj.removeEventListener) {
            obj.removeEventListener("visibilitychange", f, false);
          } else {
            if (obj.detachEvent) {
              obj.detachEvent("onvisibilitychange", f);
            }
          }
        }
      };
      addEvent(doc, "visibilitychange", fn);
    }
  })(function() {
    var value = win._gaq;
    /** @type {boolean} */
    var a = false;
    if (value && (isFunction(value.push) && (a = "[object Array]" == Object.prototype.toString.call(Object(value)), !a))) {
      current = value;
      return;
    }
    win._gaq = current;
    if (a) {
      current.push.apply(current, value);
    }
  });
})();
