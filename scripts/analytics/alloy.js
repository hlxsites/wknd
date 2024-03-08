/**
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

(function () {
  'use strict';

  if (document.documentMode && document.documentMode < 11) {
    console.warn('The Adobe Experience Cloud Web SDK does not support IE 10 and below.');
    return;
  }


  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createInstanceFunction = (function (executeCommand) {
    return function (args) {
      // Would use destructuring, but destructuring doesn't work on IE
      // without polyfilling Symbol.
      // https://github.com/babel/babel/issues/7597
      var resolve = args[0];
      var reject = args[1];
      var userProvidedArgs = args[2];
      var commandName = userProvidedArgs[0];
      var options = userProvidedArgs[1];
      executeCommand(commandName, options).then(resolve, reject);
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var CHROME = "Chrome";
  var EDGE$1 = "Edge";
  var EDGE_CHROMIUM = "EdgeChromium";
  var FIREFOX = "Firefox";
  var IE = "IE";
  var SAFARI = "Safari";
  var UNKNOWN = "Unknown";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Determines whether an array includes a certain value.
   * @param {Array} arr Array to search.
   * @param {*} item The item for which to search.
   * @returns {boolean}
   */
  var includes = (function (arr, item) {
    return arr.indexOf(item) !== -1;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // Users could have also disabled third-party cookies within these browsers, but
  // we don't know. We also assume "unknown" browsers support third-party cookies,
  // though we don't really know that either. We're making best guesses.
  var browsersSupportingThirdPartyCookie = [CHROME, EDGE$1, EDGE_CHROMIUM, IE, UNKNOWN];
  var areThirdPartyCookiesSupportedByDefault = (function (browser) {
    return includes(browsersSupportingThirdPartyCookie, browser);
  });

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */

  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }
    return Object(val);
  }
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }

      // Detect buggy property enumeration order in older V8 versions.

      // https://bugs.chromium.org/p/v8/issues/detail?id=4118
      var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
      test1[5] = 'de';
      if (Object.getOwnPropertyNames(test1)[0] === '5') {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2['_' + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });
      if (order2.join('') !== '0123456789') {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
        return false;
      }
      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }
  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    var from;
    var to = toObject(target);
    var symbols;
    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);
      for (var key in from) {
        if (hasOwnProperty$1.call(from, key)) {
          to[key] = from[key];
        }
      }
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
    return to;
  };

  var reactorObjectAssign = objectAssign;

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns true when the value is null.
   * @param {*} value
   * @returns {boolean}
   */
  var isNil = (function (value) {
    return value == null;
  });

  /**
   * Returns whether the value is an object.
   * @param {*} value
   * @returns {boolean}
   */
  var isObject = (function (value) {
    return !isNil(value) && !Array.isArray(value) && _typeof(value) === "object";
  });

  var assignConcatArrayValues = (function () {
    for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }
    if (values.length < 2) {
      // if the number of args is 0 or 1, just use the default behavior from Object.assign
      return reactorObjectAssign.apply(void 0, values);
    }
    return values.reduce(function (accumulator, currentValue) {
      if (isObject(currentValue)) {
        Object.keys(currentValue).forEach(function (key) {
          if (Array.isArray(currentValue[key])) {
            if (Array.isArray(accumulator[key])) {
              var _accumulator$key;
              (_accumulator$key = accumulator[key]).push.apply(_accumulator$key, _toConsumableArray(currentValue[key]));
            } else {
              // clone the array so the original isn't modified.
              accumulator[key] = _toConsumableArray(currentValue[key]);
            }
          } else {
            accumulator[key] = currentValue[key];
          }
        });
      }
      return accumulator;
    }); // no default value to pass into reduce because we want to skip the first value
  });

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var js_cookie = createCommonjsModule(function (module, exports) {
    (function (factory) {
      var registeredInModuleLoader;
      {
        module.exports = factory();
        registeredInModuleLoader = true;
      }
      if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
          window.Cookies = OldCookies;
          return api;
        };
      }
    })(function () {
      function extend() {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
          var attributes = arguments[i];
          for (var key in attributes) {
            result[key] = attributes[key];
          }
        }
        return result;
      }
      function decode(s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
      }
      function init(converter) {
        function api() {}
        function set(key, value, attributes) {
          if (typeof document === 'undefined') {
            return;
          }
          attributes = extend({
            path: '/'
          }, api.defaults, attributes);
          if (typeof attributes.expires === 'number') {
            attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
          }

          // We're using "expires" because "max-age" is not supported by IE
          attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';
          try {
            var result = JSON.stringify(value);
            if (/^[\{\[]/.test(result)) {
              value = result;
            }
          } catch (e) {}
          value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
          key = encodeURIComponent(String(key)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
          var stringifiedAttributes = '';
          for (var attributeName in attributes) {
            if (!attributes[attributeName]) {
              continue;
            }
            stringifiedAttributes += '; ' + attributeName;
            if (attributes[attributeName] === true) {
              continue;
            }

            // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (";")
            //     character:
            // Consume the characters of the unparsed-attributes up to,
            // not including, the first %x3B (";") character.
            // ...
            stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
          }
          return document.cookie = key + '=' + value + stringifiedAttributes;
        }
        function get(key, json) {
          if (typeof document === 'undefined') {
            return;
          }
          var jar = {};
          // To prevent the for loop in the first place assign an empty array
          // in case there are no cookies at all.
          var cookies = document.cookie ? document.cookie.split('; ') : [];
          var i = 0;
          for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var cookie = parts.slice(1).join('=');
            if (!json && cookie.charAt(0) === '"') {
              cookie = cookie.slice(1, -1);
            }
            try {
              var name = decode(parts[0]);
              cookie = (converter.read || converter)(cookie, name) || decode(cookie);
              if (json) {
                try {
                  cookie = JSON.parse(cookie);
                } catch (e) {}
              }
              jar[name] = cookie;
              if (key === name) {
                break;
              }
            } catch (e) {}
          }
          return key ? jar[key] : jar;
        }
        api.set = set;
        api.get = function (key) {
          return get(key, false /* read as raw */);
        };

        api.getJSON = function (key) {
          return get(key, true /* read as json */);
        };

        api.remove = function (key, attributes) {
          set(key, '', extend(attributes, {
            expires: -1
          }));
        };
        api.defaults = {};
        api.withConverter = init;
        return api;
      }
      return init(function () {});
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var cookieJar = {
    get: js_cookie.get,
    set: js_cookie.set,
    remove: js_cookie.remove,
    withConverter: js_cookie.withConverter
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var deepAssignObject = function deepAssignObject(target, source) {
    Object.keys(source).forEach(function (key) {
      if (isObject(target[key]) && isObject(source[key])) {
        deepAssignObject(target[key], source[key]);
        return;
      }
      target[key] = source[key];
    });
  };

  /**
   * Recursively copy the values of all enumerable own properties from a source item to a target item if the both items are objects
   * @param {Object} target - a target object
   * @param {...Object} source - an array of source objects
   * @example
   * deepAssign({ a: 'a', b: 'b' }, { b: 'B', c: 'c' });
   * // { a: 'a', b: 'B', c: 'c' }
   */
  var deepAssign = (function (target) {
    if (isNil(target)) {
      throw new TypeError('deepAssign "target" cannot be null or undefined');
    }
    var result = Object(target);
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }
    sources.forEach(function (source) {
      return deepAssignObject(result, Object(source));
    });
    return result;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Creates a function that, when passed an object of updates, will merge
   * the updates onto the current value of a payload property.
   * @param {Object} content The base object to modify
   * @param {String } key The property to merge updates into. This
   * can be a dot-notation property path.
   * @returns {Function}
   */
  var createMerger = (function (content, key) {
    return function (updates) {
      var propertyPath = key.split(".");
      var hostObjectForUpdates = propertyPath.reduce(function (obj, propertyName) {
        obj[propertyName] = obj[propertyName] || {};
        return obj[propertyName];
      }, content);
      deepAssign(hostObjectForUpdates, updates);
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Allows callbacks to be registered and then later called. When the
   * callbacks are called, their responses are combined into a single promise.
   */
  var createCallbackAggregator = (function () {
    var callbacks = [];
    return {
      add: function add(callback) {
        callbacks.push(callback);
      },
      call: function call() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        // While this utility doesn't necessarily need to be doing the
        // Promise.all, it's currently useful everywhere this is used and
        // reduces repetitive code. We can factor it out later if we want
        // to make this utility more "pure".
        return Promise.all(callbacks.map(function (callback) {
          return callback.apply(void 0, args);
        }));
      }
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createLoggingCookieJar = (function (_ref) {
    var logger = _ref.logger,
      cookieJar = _ref.cookieJar;
    return _objectSpread2(_objectSpread2({}, cookieJar), {}, {
      set: function set(key, value, options) {
        logger.info("Setting cookie", _objectSpread2({
          name: key,
          value: value
        }, options));
        cookieJar.set(key, value, options);
      }
    });
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Sequences tasks.
   */
  var createTaskQueue = (function () {
    var queueLength = 0;
    var lastPromiseInQueue = Promise.resolve();
    return {
      /**
       * Add a task to the queue. If no task is currenty running,
       * the task will begin immediately.
       * @param {Function} task A function that will be called when
       * the task should be run. If the task it asynchronous, it should
       * return a promise.
       * @returns {Promise} A promise that will be resolved or rejected
       * with whatever value the task resolved or rejects its promise.
       */
      addTask: function addTask(task) {
        queueLength += 1;
        var lastPromiseFulfilledHandler = function lastPromiseFulfilledHandler() {
          return task().finally(function () {
            queueLength -= 1;
          });
        };
        lastPromiseInQueue = lastPromiseInQueue.then(lastPromiseFulfilledHandler, lastPromiseFulfilledHandler);
        return lastPromiseInQueue;
      },
      /**
       * How many tasks are in the queue. This includes the task
       * that's currently running.
       * @returns {number}
       */
      get length() {
        return queueLength;
      }
    };
  });

  /* eslint-disable */

  /*
  crc32 Â· JavaScript Function to Calculate CRC32 of a String
  Description
    Below is a JavaScript function to calculate CRC32 of a string. 
    The string can be either ASCII or Unicode. 
    Unicode strings will be encoded in UTF-8. 
    The polynomial used in calculation is 0xedb88320. 
    This polynomial is used in Ethernet, Gzip, PNG, SATA and many other technologies.
  */
  var crc32 = function () {
    var table = [];
    for (var i = 0; i < 256; i++) {
      var c = i;
      for (var j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
      }
      table.push(c);
    }
    return function (str, crc) {
      str = unescape(encodeURIComponent(str));
      if (!crc) crc = 0;
      crc = crc ^ -1;
      for (var _i = 0; _i < str.length; _i++) {
        var y = (crc ^ str.charCodeAt(_i)) & 0xff;
        crc = crc >>> 8 ^ table[y];
      }
      crc = crc ^ -1;
      return crc >>> 0;
    };
  }();

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * A simple utility for managing a promise's state outside of
   * the promise's "executor" (the function passed into the constructor).
   */
  var defer = (function () {
    var deferred = {};
    deferred.promise = new Promise(function (resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    return deferred;
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var REFERENCE_EQUALITY = function REFERENCE_EQUALITY(a, b) {
    return a === b;
  };
  var findIndex = function findIndex(array, item, isEqual) {
    for (var i = 0; i < array.length; i += 1) {
      if (isEqual(array[i], item)) {
        return i;
      }
    }
    return -1;
  };
  var deduplicateArray = (function (array) {
    var isEqual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REFERENCE_EQUALITY;
    return array.filter(function (item, index) {
      return findIndex(array, item, isEqual) === index;
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Whether a string ends with the characters of a specified string
   * @param {String} str The string to search within.
   * @param {String} suffix The string to search for.
   * @returns {boolean}
   */
  var endsWith = (function (str, suffix) {
    return str.substr(-suffix.length) === suffix;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns the first item in the array that satisfies the provided testing function.
   * @param {Array} arr The array to search.
   * @param {Function} predicate Function that will be called for each item. Arguments
   * will be the item, the item index, then the array itself.
   * @returns {*}
   */
  var find = (function (arr, predicate) {
    for (var i = 0; i < arr.length; i += 1) {
      var item = arr[i];
      if (predicate(item, i, arr)) {
        return item;
      }
    }
    return undefined;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var appendNode = (function (parent, node) {
    return parent.appendChild(node);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var populateElementProperties = function populateElementProperties(element, props) {
    Object.keys(props).forEach(function (key) {
      // The following is to support setting style properties to avoid CSP errors.
      if (key === "style" && isObject(props[key])) {
        var styleProps = props[key];
        Object.keys(styleProps).forEach(function (styleKey) {
          element.style[styleKey] = styleProps[styleKey];
        });
      } else {
        element[key] = props[key];
      }
    });
  };
  var createNode = (function (tag) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var children = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var doc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document;
    var result = doc.createElement(tag);
    Object.keys(attrs).forEach(function (key) {
      // TODO: To highlight CSP problems consider throwing a descriptive error
      //       if nonce is available and key is style.
      result.setAttribute(key, attrs[key]);
    });
    populateElementProperties(result, props);
    children.forEach(function (child) {
      return appendNode(result, child);
    });
    return result;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var BODY = "BODY";
  var IFRAME = "IFRAME";
  var IMG = "IMG";
  var DIV = "DIV";
  var STYLE = "STYLE";
  var SCRIPT = "SCRIPT";
  var HEAD = "HEAD";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Fires an image pixel from the current document's window.
   * @param {object} currentDocument
   * @param {string} src
   * @returns {Promise}
   */
  var fireImageInDocument = (function (_ref) {
    var src = _ref.src,
      _ref$currentDocument = _ref.currentDocument,
      currentDocument = _ref$currentDocument === void 0 ? document : _ref$currentDocument;
    return new Promise(function (resolve, reject) {
      var attrs = {
        src: src
      };
      var props = {
        onload: resolve,
        onerror: reject,
        onabort: reject
      };
      createNode(IMG, attrs, props, [], currentDocument);
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether the value is a function.
   * @param {*} value
   * @returns {boolean}
   */
  var isFunction = (function (value) {
    return typeof value === "function";
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether the value is a non-empty array.
   * @param {*} value
   * @returns {boolean}
   */
  var isNonEmptyArray = (function (value) {
    return Array.isArray(value) && value.length > 0;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var toArray = (function (value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (value == null) {
      return [];
    }
    return [].slice.call(value);
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var SIBLING_PATTERN = /^\s*>/;
  var querySelectorAll = (function (context, selector) {
    if (!SIBLING_PATTERN.test(selector)) {
      return toArray(context.querySelectorAll(selector));
    }
    var tag = "alloy-" + Date.now();

    // We could use a :scope selector here, but we want to be IE compliant
    // so we add a dummy css class to be able to select the children
    try {
      context.classList.add(tag);
      return toArray(context.querySelectorAll("." + tag + " " + selector));
    } finally {
      context.classList.remove(tag);
    }
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Whether a string starts with the characters of a specified string
   * @param {String} str The string to search within.
   * @param {String} prefix The string to search for.
   * @returns {boolean}
   */
  var startsWith = (function (str, prefix) {
    return str.substr(0, prefix.length) === prefix;
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var SHADOW_SEPARATOR = ":shadow";

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var splitWithShadow = function splitWithShadow(selector) {
    return selector.split(SHADOW_SEPARATOR);
  };
  var transformPrefix = function transformPrefix(parent, selector) {
    var result = selector;
    var hasChildCombinatorPrefix = startsWith(result, ">");
    if (!hasChildCombinatorPrefix) {
      return result;
    }

    // IE doesn't support :scope
    if (window.document.documentMode) {
      return result.substring(1).trim();
    }
    var prefix = parent instanceof Element || parent instanceof HTMLDocument ? ":scope" : ":host"; // see https://bugs.webkit.org/show_bug.cgi?id=233380

    return prefix + " " + result;
  };
  var selectNodesWithShadow = (function (context, selector) {
    // Shadow DOM should be supported
    if (!window.document.documentElement.attachShadow) {
      return querySelectorAll(context, selector.replace(SHADOW_SEPARATOR, ""));
    }
    var parts = splitWithShadow(selector);
    if (parts.length < 2) {
      return querySelectorAll(context, selector);
    }

    // split the selector into parts separated by :shadow pseudo-selectors
    // find each subselector element based on the previously selected node's shadowRoot
    var parent = context;
    for (var i = 0; i < parts.length; i += 1) {
      var part = parts[i].trim();
      // if part is empty, it means there's a chained :eq:shadow selector
      if (part === "" && parent.shadowRoot) {
        parent = parent.shadowRoot;
        // eslint-disable-next-line no-continue
        continue;
      }
      var prefixed = transformPrefix(parent, part);
      var partNode = querySelectorAll(parent, prefixed);
      if (partNode.length === 0 || !partNode[0] || !partNode[0].shadowRoot) {
        return partNode;
      }
      parent = partNode[0].shadowRoot;
    }
    return undefined;
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var isShadowSelector = (function (str) {
    return str.indexOf(SHADOW_SEPARATOR) !== -1;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns an array of matched DOM nodes.
   * @param {String} selector
   * @param {Node} [context=document] defaults to document
   * @returns {Array} an array of DOM nodes
   */
  var selectNodes = (function (selector) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    if (!isShadowSelector(selector)) {
      return querySelectorAll(context, selector);
    }
    return selectNodesWithShadow(context, selector);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var MUTATION_OBSERVER = "MutationObserver";
  var RAF = "requestAnimationFrame";
  var MUTATION_OBSERVER_CONFIG = {
    childList: true,
    subtree: true
  };
  var VISIBILITY_STATE = "visibilityState";
  var VISIBLE = "visible";
  var DELAY = 100;
  var MAX_POLLING_TIMEOUT = 5000;
  var createError = function createError(selector) {
    return new Error("Could not find: " + selector);
  };
  var createPromise = function createPromise(executor) {
    return new Promise(executor);
  };
  var canUseMutationObserver = function canUseMutationObserver(win) {
    return isFunction(win[MUTATION_OBSERVER]);
  };
  var awaitUsingMutationObserver = function awaitUsingMutationObserver(win, doc, selector, timeout, selectFunc) {
    return createPromise(function (resolve, reject) {
      var mutationObserver = new win[MUTATION_OBSERVER](function () {
        var nodes = selectFunc(selector);
        if (isNonEmptyArray(nodes)) {
          mutationObserver.disconnect();
          resolve(nodes);
        }
      });
      setTimeout(function () {
        mutationObserver.disconnect();
        reject(createError(selector));
      }, timeout);
      mutationObserver.observe(doc, MUTATION_OBSERVER_CONFIG);
    });
  };
  var canUseRequestAnimationFrame = function canUseRequestAnimationFrame(doc) {
    return doc[VISIBILITY_STATE] === VISIBLE;
  };
  var awaitUsingRequestAnimation = function awaitUsingRequestAnimation(win, selector, timeout, selectFunc) {
    return createPromise(function (resolve, reject) {
      var execute = function execute() {
        var nodes = selectFunc(selector);
        if (isNonEmptyArray(nodes)) {
          resolve(nodes);
          return;
        }
        win[RAF](execute);
      };
      execute();
      setTimeout(function () {
        reject(createError(selector));
      }, timeout);
    });
  };
  var awaitUsingTimer = function awaitUsingTimer(selector, timeout, selectFunc) {
    return createPromise(function (resolve, reject) {
      var execute = function execute() {
        var nodes = selectFunc(selector);
        if (isNonEmptyArray(nodes)) {
          resolve(nodes);
          return;
        }
        setTimeout(execute, DELAY);
      };
      execute();
      setTimeout(function () {
        reject(createError(selector));
      }, timeout);
    });
  };
  var awaitSelector = (function (selector) {
    var selectFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : selectNodes;
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAX_POLLING_TIMEOUT;
    var win = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;
    var doc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document;
    var nodes = selectFunc(selector);
    if (isNonEmptyArray(nodes)) {
      return Promise.resolve(nodes);
    }
    if (canUseMutationObserver(win)) {
      return awaitUsingMutationObserver(win, doc, selector, timeout, selectFunc);
    }
    if (canUseRequestAnimationFrame(doc)) {
      return awaitUsingRequestAnimation(win, selector, timeout, selectFunc);
    }
    return awaitUsingTimer(selector, timeout, selectFunc);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns true if element matches the selector.
   * @param {String} selector
   * @param {Node} [element]
   * @returns {Boolean}
   */
  var matchesSelector = (function (selector, element) {
    if (element.matches) {
      return element.matches(selector);
    }

    // Making IE 11 happy
    return element.msMatchesSelector(selector);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var removeNode = (function (node) {
    var parent = node.parentNode;
    if (parent) {
      return parent.removeChild(node);
    }
    return null;
  });

  var IFRAME_ATTRS = {
    name: "Adobe Alloy"
  };
  var IFRAME_PROPS = {
    style: {
      display: "none",
      width: 0,
      height: 0
    }
  };
  var injectFireReferrerHideableImage = (function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$appendNode = _ref.appendNode,
      appendNode$1 = _ref$appendNode === void 0 ? appendNode : _ref$appendNode,
      _ref$awaitSelector = _ref.awaitSelector,
      awaitSelector$1 = _ref$awaitSelector === void 0 ? awaitSelector : _ref$awaitSelector,
      _ref$createNode = _ref.createNode,
      createNode$1 = _ref$createNode === void 0 ? createNode : _ref$createNode,
      _ref$fireImage = _ref.fireImage,
      fireImage = _ref$fireImage === void 0 ? fireImageInDocument : _ref$fireImage;
    var fireOnPage = fireImage;
    var hiddenIframe;
    var createIframe = function createIframe() {
      return awaitSelector$1(BODY).then(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 1),
          body = _ref3[0];
        if (hiddenIframe) {
          return hiddenIframe;
        }
        hiddenIframe = createNode$1(IFRAME, IFRAME_ATTRS, IFRAME_PROPS);
        return appendNode$1(body, hiddenIframe);
      });
    };
    var fireInIframe = function fireInIframe(_ref4) {
      var src = _ref4.src;
      return createIframe().then(function (iframe) {
        var currentDocument = iframe.contentWindow.document;
        return fireImage({
          src: src,
          currentDocument: currentDocument
        });
      });
    };
    return function (request) {
      var hideReferrer = request.hideReferrer,
        url = request.url;
      return hideReferrer ? fireInIframe({
        src: url
      }) : fireOnPage({
        src: url
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether the value is an empty object.
   * @param {*} value
   * @returns {boolean}
   */
  var isEmptyObject = (function (value) {
    return isObject(value) && Object.keys(value).length === 0;
  });

  /**
   * Given an object and a function that takes a value and returns a predicate, filter out
   * all non-object deeply nested values that do not pass the predicate.
   *
   * Example: filterObject({ a: 2, b: { c: 6 } }, (val) => val > 5) returns { b { c: 6 } }
   *
   * @param {*} obj
   * @param {* => boolean} predicate a function that takes a value and return a boolean,
   * representing if it should be included in the result object or not.
   * @returns A copy of the original object with the values that fail the predicate, filtered out.
   */
  var filterObject = function filterObject(obj, predicate) {
    if (isNil(obj) || !isObject(obj)) {
      return obj;
    }
    return Object.keys(obj).reduce(function (result, key) {
      var value = obj[key];
      if (isObject(value)) {
        // value is object, go deeper
        var filteredValue = filterObject(value, predicate);
        if (isEmptyObject(filteredValue)) {
          return result;
        }
        return _objectSpread2(_objectSpread2({}, result), {}, _defineProperty({}, key, filteredValue));
      }
      // value is not an object, test predicate
      if (predicate(value)) {
        return _objectSpread2(_objectSpread2({}, result), {}, _defineProperty({}, key, value));
      }
      return result;
    }, {});
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var flatMap = (function (array, mapFunction) {
    return Array.prototype.concat.apply([], array.map(mapFunction));
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var baseNamespace = "com.adobe.alloy.";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns the last N number of items from an array.
   * @param {Array} arr
   * @param {number} itemCount
   * @returns {Array}
   */
  var getLastArrayItems = (function (arr, itemCount) {
    return arr.slice(-itemCount);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var cookieName = baseNamespace + "getTld";

  /**
   * Of the current web page's hostname, this is the top-most domain that is
   * not a "public suffix" as outlined in https://publicsuffix.org/. In other
   * words, this is top-most domain that is able to accept cookies.
   * @param {Object} window
   * @param {Object} cookieJar
   * @returns {string}
   */
  var getApexDomain = (function (window, cookieJar) {
    var topLevelCookieDomain = "";

    // If hostParts.length === 1, we may be on localhost.
    var hostParts = window.location.hostname.toLowerCase().split(".");
    var i = 1;
    while (i < hostParts.length && !cookieJar.get(cookieName)) {
      i += 1;
      topLevelCookieDomain = getLastArrayItems(hostParts, i).join(".");
      cookieJar.set(cookieName, cookieName, {
        domain: topLevelCookieDomain
      });
    }
    cookieJar.remove(cookieName, {
      domain: topLevelCookieDomain
    });
    return topLevelCookieDomain;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // Remember to also incorporate the org ID wherever cookies are read or written.
  var COOKIE_NAME_PREFIX = "kndctr";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var sanitizeOrgIdForCookieName = (function (orgId) {
    return orgId.replace("@", "_");
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var getNamespacedCookieName = (function (orgId, key) {
    return COOKIE_NAME_PREFIX + "_" + sanitizeOrgIdForCookieName(orgId) + "_" + key;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Group an array by a key getter provided
   * @param {Array} arr Array to iterate over.
   * @param {Function} keyGetter The key getter by which to group.
   * @returns {Object}
   */
  var groupBy = (function (arr, keyGetter) {
    var result = {};
    arr.forEach(function (item) {
      var key = keyGetter(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
    });
    return result;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var IDENTITY = "identity";
  var CONSENT = "consent";
  var CLUSTER = "cluster";

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectDoesIdentityCookieExist = (function (_ref) {
    var orgId = _ref.orgId;
    var identityCookieName = getNamespacedCookieName(orgId, IDENTITY);
    /**
     * Returns whether the identity cookie exists.
     */
    return function () {
      return Boolean(cookieJar.get(identityCookieName));
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var getStorageByType = function getStorageByType(context, storageType, namespace) {
    // When storage is disabled on Safari, the mere act of referencing
    // window.localStorage or window.sessionStorage throws an error.
    // For this reason, we wrap in a try-catch.
    return {
      /**
       * Reads a value from storage.
       * @param {string} name The name of the item to be read.
       * @returns {string}
       */
      getItem: function getItem(name) {
        try {
          return context[storageType].getItem(namespace + name);
        } catch (e) {
          return null;
        }
      },
      /**
       * Saves a value to storage.
       * @param {string} name The name of the item to be saved.
       * @param {string} value The value of the item to be saved.
       * @returns {boolean} Whether the item was successfully saved to storage.
       */
      setItem: function setItem(name, value) {
        try {
          context[storageType].setItem(namespace + name, value);
          return true;
        } catch (e) {
          return false;
        }
      },
      /**
       * Clear all values in storage that match the namespace.
       */
      clear: function clear() {
        try {
          Object.keys(context[storageType]).forEach(function (key) {
            if (startsWith(key, namespace)) {
              context[storageType].removeItem(key);
            }
          });
          return true;
        } catch (e) {
          return false;
        }
      }
    };
  };
  var injectStorage = (function (context) {
    return function (additionalNamespace) {
      var finalNamespace = baseNamespace + additionalNamespace;
      return {
        session: getStorageByType(context, "sessionStorage", finalNamespace),
        persistent: getStorageByType(context, "localStorage", finalNamespace)
      };
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns items that are found within both arrays.
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
  var intersection = (function (a, b) {
    return a.filter(function (x) {
      return includes(b, x);
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether the value is a boolean.
   * @param {*} value
   * @returns {boolean}
   */
  var isBoolean = (function (value) {
    return typeof value === "boolean";
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether the value is a number.
   * @param {*} value
   * @returns {boolean}
   */
  // eslint-disable-next-line no-restricted-globals
  var isNumber$1 = (function (value) {
    return typeof value === "number" && !isNaN(value);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether the value is an integer.
   * @param {*} value
   * @returns {boolean}
   */
  var isInteger = (function (value) {
    var parsed = parseInt(value, 10);
    return isNumber$1(parsed) && value === parsed;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Determines whether a cookie name is namespaced according to the contract
   * defined by the server.
   * @param {String} orgId The org ID configured for the Alloy instance.
   * @param {String} name The cookie name.
   * @returns {boolean}
   */
  var isNamespacedCookieName = (function (orgId, name) {
    return name.indexOf(COOKIE_NAME_PREFIX + "_" + sanitizeOrgIdForCookieName(orgId) + "_") === 0;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether the value is a string.
   * @param {*} value
   * @returns {boolean}
   */
  var isString = (function (value) {
    return typeof value === "string";
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether the value is a populated string.
   * @param {*} value
   * @returns {boolean}
   */
  var isNonEmptyString = (function (value) {
    return isString(value) && value.length > 0;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Creates a function that memoizes the result of `fn`. If `keyResolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key.
   *
   * @param {Function} fn The function to have its output memoized.
   * @param {Function} [keyResolver] The function to resolve the cache key.
   * @returns {Function} The new memoized function.
   */
  var memoize = (function (fn, keyResolver) {
    var map = new Map();
    return function () {
      var key = keyResolver ? keyResolver.apply(void 0, arguments) : arguments.length <= 0 ? undefined : arguments[0];
      if (map.has(key)) {
        return map.get(key);
      }
      var result = fn.apply(void 0, arguments);
      map.set(key, result);
      return result;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * A function that performs no operations.
   */
  var noop$1 = (function () {});

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  var padStart = (function (string, targetLength, padString) {
    var originalString = String(string);
    var repeatedPadString = String(padString);
    if (originalString.length >= targetLength || repeatedPadString.length === 0) {
      return originalString;
    }
    var lengthToAdd = targetLength - originalString.length;
    while (lengthToAdd > repeatedPadString.length) {
      repeatedPadString += repeatedPadString;
    }
    return repeatedPadString.slice(0, lengthToAdd) + originalString;
  });

  var src = function src(str) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!str) return undefined;
    var o = {
      key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
      q: {
        name: 'queryKey',
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?))?((((?:[^?#/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#/]*\.[^?#/.]+(?:[?#]|$)))*\/?)?([^?#/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };
    var m = o.parser[opts.strictMode ? 'strict' : 'loose'].exec(str);
    var uri = {};
    var i = 14;
    while (i--) {
      uri[o.key[i]] = m[i] || '';
    }
    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) uri[o.q.name][$1] = $2;
    });
    return uri;
  };

  var parseDomainBasic = function parseDomainBasic(host) {
    var result = {};
    var domainParts = host.split(".");
    switch (domainParts.length) {
      case 1:
        result.subdomain = "";
        result.domain = host;
        result.topLevelDomain = "";
        break;
      case 2:
        result.subdomain = "";
        result.domain = host;
        result.topLevelDomain = domainParts[1];
        break;
      case 3:
        result.subdomain = domainParts[0] === "www" ? "" : domainParts[0];
        result.domain = host;
        result.topLevelDomain = domainParts[2];
        break;
      case 4:
        result.subdomain = domainParts[0] === "www" ? "" : domainParts[0];
        result.domain = host;
        result.topLevelDomain = domainParts[2] + "." + domainParts[3];
        break;
    }
    return result;
  };
  var parseUrl = function parseUrl(url) {
    var parseDomain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : parseDomainBasic;
    if (!isString(url)) {
      // eslint-disable-next-line no-param-reassign
      url = "";
    }
    var parsed = src(url) || {};
    var _parsed$host = parsed.host,
      host = _parsed$host === void 0 ? "" : _parsed$host,
      _parsed$path = parsed.path,
      path = _parsed$path === void 0 ? "" : _parsed$path,
      _parsed$query = parsed.query,
      query = _parsed$query === void 0 ? "" : _parsed$query,
      _parsed$anchor = parsed.anchor,
      anchor = _parsed$anchor === void 0 ? "" : _parsed$anchor;
    return _objectSpread2({
      path: path,
      query: query,
      fragment: anchor
    }, parseDomain(host));
  };

  // We want to avoid mapping between specific keys because we want Konductor
  // to be able to add overrides in the future without us needing to make
  // any changes to the Web SDK
  var prepareConfigOverridesForEdge = (function (configuration) {
    if (isNil(configuration) || _typeof(configuration) !== "object") {
      return null;
    }
    // remove entries that are empty strings or arrays
    var configOverrides = filterObject(configuration, function (value) {
      if (isNil(value)) {
        return false;
      }
      if (isBoolean(value)) {
        return true;
      }
      if (isNumber$1(value)) {
        return true;
      }
      if (isNonEmptyString(value)) {
        return true;
      }
      if (isNonEmptyArray(value)) {
        return true;
      }
      return false;
    });
    if (isEmptyObject(configOverrides)) {
      return null;
    }
    return configOverrides;
  });

  // Copyright Joyent, Inc. and other Node contributors.

  // If obj.hasOwnProperty has been overridden, then calling
  // obj.hasOwnProperty(prop) will break.
  // See: https://github.com/joyent/node/issues/1707
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  var decode = function decode(qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};
    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }
    var regexp = /\+/g;
    qs = qs.split(sep);
    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }
    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }
    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;
      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }
      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);
      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (Array.isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }
    return obj;
  };

  // Copyright Joyent, Inc. and other Node contributors.
  var stringifyPrimitive = function stringifyPrimitive(v) {
    switch (_typeof(v)) {
      case 'string':
        return v;
      case 'boolean':
        return v ? 'true' : 'false';
      case 'number':
        return isFinite(v) ? v : '';
      default:
        return '';
    }
  };
  var encode = function encode(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
      obj = undefined;
    }
    if (_typeof(obj) === 'object') {
      return Object.keys(obj).map(function (k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
        if (Array.isArray(obj[k])) {
          return obj[k].map(function (v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);
    }
    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
  };

  var querystring = createCommonjsModule(function (module, exports) {

    exports.decode = exports.parse = decode;
    exports.encode = exports.stringify = encode;
  });
  querystring.decode;
  querystring.parse;
  querystring.encode;
  querystring.stringify;

  // We proxy the underlying querystring module so we can limit the API we expose.
  // This allows us to more easily make changes to the underlying implementation later without
  // having to worry about breaking extensions. If extensions demand additional functionality, we
  // can make adjustments as needed.
  var reactorQueryString = {
    parse: function parse(string) {
      //
      if (typeof string === 'string') {
        // Remove leading ?, #, & for some leniency so you can pass in location.search or
        // location.hash directly.
        string = string.trim().replace(/^[?#&]/, '');
      }
      return querystring.parse(string);
    },
    stringify: function stringify(object) {
      return querystring.stringify(object);
    }
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Creates and returns a new error using the provided value as a message.
   * If the provided value is already an Error, it will be returned unmodified.
   * @param {*} value
   * @returns {Error}
   */
  var toError = (function (value) {
    return value instanceof Error ? value : new Error(value);
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var updateErrorMessage = (function (_ref) {
    var error = _ref.error,
      message = _ref.message;
    try {
      error.message = message;
    } catch (e) {
      // We'll set a new message when we can, but some errors, like DOMException,
      // have a read-only message property, which limits our options.
    }
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Augments an error's message with additional context as it bubbles up the call stack.
   * @param {String} message The message to be added to the error.
   * @param {*} error Optimally, this is an instance of Error. If it is not,
   * this is used as the basis for the message of a newly created Error instance.
   * @returns {*}
   */
  var stackError = (function (_ref) {
    var error = _ref.error,
      message = _ref.message;
    var errorToStack = toError(error);
    var newMessage = message + "\nCaused by: " + errorToStack.message;
    updateErrorMessage({
      error: errorToStack,
      message: newMessage
    });
    return errorToStack;
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var stringToBoolean = (function (str) {
    return isString(str) && str.toLowerCase() === "true";
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /*
   * coerce `value` to a number or return `defaultValue` if it cannot be.
   *
   * The coersion is attempted if value is a number or string.
   */
  var toInteger = (function (value, defaultValue) {
    if (isNumber$1(value) || isString(value)) {
      var n = Math.round(Number(value));
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(n)) {
        return n;
      }
    }
    return defaultValue;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Formats the date into an ISO date-time string in the local timezone
   * @param {Date} date
   * @returns {string}
   */
  var toISOStringLocal = (function (date) {
    var YYYY = date.getFullYear();
    var MM = padStart(date.getMonth() + 1, 2, "0");
    var DD = padStart(date.getDate(), 2, "0");
    var hh = padStart(date.getHours(), 2, "0");
    var mm = padStart(date.getMinutes(), 2, "0");
    var ss = padStart(date.getSeconds(), 2, "0");
    var mmm = padStart(date.getMilliseconds(), 3, "0");

    // The time-zone offset is the difference, in minutes, from local time to UTC. Note that this
    // means that the offset is positive if the local timezone is behind UTC and negative if it is
    // ahead. For example, for time zone UTC+10:00, -600 will be returned.
    var timezoneOffset = toInteger(date.getTimezoneOffset(), 0);
    var ts = timezoneOffset > 0 ? "-" : "+";
    var th = padStart(Math.floor(Math.abs(timezoneOffset) / 60), 2, "0");
    var tm = padStart(Math.abs(timezoneOffset) % 60, 2, "0");
    return YYYY + "-" + MM + "-" + DD + "T" + hh + ":" + mm + ":" + ss + "." + mmm + ts + th + ":" + tm;
  });

  var rngBrowser = createCommonjsModule(function (module) {
    // Unique ID creation requires a high quality random # generator.  In the
    // browser this is a little complicated due to unknown quality of Math.random()
    // and inconsistent support for the `crypto` API.  We do the best we can via
    // feature-detection

    // getRandomValues needs to be invoked in a context where "this" is a Crypto
    // implementation. Also, find the complete implementation of crypto on IE11.
    var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
    if (getRandomValues) {
      // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
      var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

      module.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var rnds = new Array(16);
      module.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
        return rnds;
      };
    }
  });

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }
  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
    return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
  }
  var bytesToUuid_1 = bytesToUuid;

  function v4(options, buf, offset) {
    var i = buf && offset || 0;
    if (typeof options == 'string') {
      buf = options === 'binary' ? new Array(16) : null;
      options = null;
    }
    options = options || {};
    var rnds = options.random || (options.rng || rngBrowser)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }
    return buf || bytesToUuid_1(rnds);
  }
  var v4_1 = v4;

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Wraps a validator returning the value if it is null or undefined, otherwise
   * it will call the original validator and return the result.
   *
   * @param {function} validator - the validator to call if the value is not null
   */
  var skipIfNull = function skipIfNull(validator) {
    return function skipIfNullValidator(value, path) {
      return value == null ? value : validator.call(this, value, path);
    };
  };

  /**
   * Returns a new validator that calls the first validator and then calls the second
   * validator with the result of the first validator. The result of the second validator
   * is returned.
   *
   * @param {function} firstValidator - validator to call first
   * @param {function} secondValidator - validator to call second
   * @returns {function} - a new validator that calls the first and second validators
   */
  var callSequentially = function callSequentially(firstValidator, secondValidator) {
    return function callSequentiallyValidator(value, path) {
      return secondValidator.call(this, firstValidator.call(this, value, path), path);
    };
  };

  /**
   * Just like callSequentially, but if either validator throws an error, the errors
   * are collected and thrown at the end.
   *
   * @param {function} firstValidator
   * @param {function} secondValidator
   * @returns {function}
   */
  var callSequentiallyJoinErrors = function callSequentiallyJoinErrors(firstValidator, secondValidator) {
    return function callSequentiallyJoinErrorsValidator(value, path) {
      var _this = this;
      var errors = [];
      var newValue = [firstValidator, secondValidator].reduce(function (memo, validator) {
        try {
          return validator.call(_this, memo, path);
        } catch (e) {
          errors.push(e);
          return memo;
        }
      }, value);
      if (errors.length) {
        throw new Error(errors.join("\n"));
      }
      return newValue;
    };
  };

  /**
   * Chains two validators together. In addition to calling the validators in
   * sequence, this will also copy over methods from the base validator to the
   * resulting validator and include any additional methods.
   *
   * @param {function} baseValidator - This validator will be called first, and its
   * methods will be copied over to the returned validator.
   * @param {function} newValidator - This validator will be called second.
   * @param {object} additionalMethods - Additional methods to include on the returned
   * validator.
   * @returns {function}
   */
  var chain = function chain(baseValidator, newValidator, additionalMethods) {
    return reactorObjectAssign(callSequentially(baseValidator, newValidator), baseValidator, additionalMethods);
  };

  /**
   * Chains two validators together, but skips the second validator if the value
   * is null. In addition to calling the validators in sequence, this will also
   * copy over methods from the base validator to the resulting validator and
   * include any additional methods.
   *
   * @param {function} baseValidator - This validator will be called first, and its
   * methods will be copied over to the returned validator.
   * @param {function} newValidator - This validator will be called second. If the value
   * is null after the first validator is called, this validator will not be
   * called.
   * @param {object} additionalMethods - Additional methods to include on the returned
   * validator.
   * @returns {function}
   */
  var nullSafeChain = function nullSafeChain(baseValidator, newValidator, additionalMethods) {
    return reactorObjectAssign(callSequentially(baseValidator, skipIfNull(newValidator)), baseValidator, additionalMethods);
  };

  /**
   * Same as nullSafeChain, but calls the new validator first.
   *
   * @param {function} baseValidator - This validator will be called second, and its
   * methods will be copied over to the returned validator.
   * @param {function} newValidator - This validator will be called first. If the value
   * is null, this validator will not be called.
   * @param {function} additionalMethods - Additional methods to include on the returned
   * validator.
   * @returns {function}
   */
  var reverseNullSafeChainJoinErrors = function reverseNullSafeChainJoinErrors(baseValidator, newValidator, additionalMethods) {
    return reactorObjectAssign(callSequentiallyJoinErrors(skipIfNull(newValidator), baseValidator), baseValidator, additionalMethods);
  };

  /**
   * Throws an error if the value is not valid.
   *
   * @param {boolean} isValid - Whether or not the value is valid.
   * @param {*} value - The value to validate.
   * @param {string} path - The path to the value.
   * @param {string} message - The expected part of the error message.
   * @throws {Error} - Throws an error if the value is not valid.
   * @returns {void}
   */
  var assertValid = function assertValid(isValid, value, path, message) {
    if (!isValid) {
      throw new Error("'" + path + "': Expected " + message + ", but got " + JSON.stringify(value) + ".");
    }
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var booleanValidator = (function (value, path) {
    assertValid(isBoolean(value), value, path, "true or false");
    return value;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var callbackValidator = (function (value, path) {
    assertValid(isFunction(value), value, path, "a function");
    return value;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createArrayOfValidator = (function (elementValidator) {
    return function arrayOf(value, path) {
      var _this = this;
      assertValid(Array.isArray(value), value, path, "an array");
      var errors = [];
      var validatedArray = value.map(function (subValue, i) {
        try {
          return elementValidator.call(_this, subValue, path + "[" + i + "]", value);
        } catch (e) {
          errors.push(e.message);
          return undefined;
        }
      });
      if (errors.length) {
        throw new Error(errors.join("\n"));
      }
      return validatedArray;
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createDefaultValidator = (function (defaultValue) {
    return function (value) {
      if (value == null) {
        return defaultValue;
      }
      return value;
    };
  });

  var createDeprecatedValidator = (function (oldField, oldSchema, newField) {
    return function deprecated(value, path) {
      assertValid(isObject(value), value, path, "an object");
      var oldValue = value[oldField],
        newValue = value[newField],
        otherValues = _objectWithoutProperties(value, [oldField, newField].map(_toPropertyKey));
      var validatedOldValue = oldSchema(oldValue, path);
      if (validatedOldValue !== undefined) {
        var message = "The field '" + oldField + "' is deprecated. Use '" + newField + "' instead.";
        if (path) {
          message = "'" + path + "': " + message;
        }
        if (newValue !== undefined && newValue !== validatedOldValue) {
          throw new Error(message);
        } else if (this && this.logger) {
          this.logger.warn(message);
        }
      }
      return _objectSpread2(_defineProperty({}, newField, newValue || validatedOldValue), otherValues);
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createLiteralValidator = (function (literalValue) {
    return function (value, path) {
      assertValid(value === literalValue, value, path, "" + literalValue);
      return value;
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createMapOfValuesValidator = (function (valueValidator) {
    return function mapOfValues(value, path) {
      var _this = this;
      assertValid(isObject(value), value, path, "an object");
      var errors = [];
      var validatedObject = {};
      Object.keys(value).forEach(function (subKey) {
        var subValue = value[subKey];
        var subPath = path ? path + "." + subKey : subKey;
        try {
          var validatedValue = valueValidator.call(_this, subValue, subPath);
          if (validatedValue !== undefined) {
            validatedObject[subKey] = validatedValue;
          }
        } catch (e) {
          errors.push(e.message);
        }
      });
      if (errors.length) {
        throw new Error(errors.join("\n"));
      }
      return validatedObject;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createMinimumValidator = (function (typeName, minimum) {
    return function (value, path) {
      assertValid(value >= minimum, value, path, typeName + " greater than or equal to " + minimum);
      return value;
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createNoUnknownFieldsValidator = (function (schema) {
    return function (value, path) {
      var errors = [];
      Object.keys(value).forEach(function (subKey) {
        if (!schema[subKey]) {
          var subPath = path ? path + "." + subKey : subKey;
          errors.push("'" + subPath + "': Unknown field.");
        }
      });
      if (errors.length) {
        throw new Error(errors.join("\n"));
      }
      return value;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createNonEmptyValidator = (function (message) {
    return function (value, path) {
      if (isObject(value)) {
        assertValid(!isEmptyObject(value), value, path, message);
      } else {
        assertValid(value.length > 0, value, path, message);
      }
      return value;
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createObjectOfValidator = (function (schema) {
    return function objectOf(value, path) {
      var _this = this;
      assertValid(isObject(value), value, path, "an object");
      var errors = [];
      var validatedObject = {};
      Object.keys(schema).forEach(function (subKey) {
        var subValue = value[subKey];
        var subSchema = schema[subKey];
        var subPath = path ? path + "." + subKey : subKey;
        try {
          var validatedValue = subSchema.call(_this, subValue, subPath);
          if (validatedValue !== undefined) {
            validatedObject[subKey] = validatedValue;
          }
        } catch (e) {
          errors.push(e.message);
        }
      });

      // copy over unknown properties
      Object.keys(value).forEach(function (subKey) {
        if (!Object.prototype.hasOwnProperty.call(validatedObject, subKey)) {
          validatedObject[subKey] = value[subKey];
        }
      });
      if (errors.length) {
        throw new Error(errors.join("\n"));
      }
      return validatedObject;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createAnyOfValidator = (function (validators, message) {
    return function anyOf(value, path) {
      var _this = this;
      var newValue;
      var valid = find(validators, function (validator) {
        try {
          newValue = validator.call(_this, value, path);
          return true;
        } catch (e) {
          return false;
        }
      });
      assertValid(valid, value, path, message);
      return newValue;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createUniqueValidator = (function () {
    var values = [];
    return function (value, path) {
      assertValid(values.indexOf(value) === -1, value, path, "a unique value across instances");
      values.push(value);
      return value;
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  /**
   * Returns whether an array contains unique values.
   * @param {*} value
   * @returns {boolean}
   */
  var isUnique = (function (values) {
    var storedVals = Object.create(null);
    for (var i = 0; i < values.length; i += 1) {
      var item = values[i];
      if (item in storedVals) {
        return false;
      }
      storedVals[item] = true;
    }
    return true;
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createUniqueItemsValidator = (function () {
    return function (value, path) {
      assertValid(isUnique(value), value, path, "array values to be unique");
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var DOMAIN_REGEX = /^[a-z0-9.-]{1,}$/i;
  var domainValidator = (function (value, path) {
    assertValid(DOMAIN_REGEX.test(value), value, path, "a valid domain");
    return value;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var integerValidator = (function (value, path) {
    assertValid(isInteger(value), value, path, "an integer");
    return value;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var numberValidator = (function (value, path) {
    assertValid(isNumber$1(value), value, path, "a number");
    return value;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Determines whether the value is a valid regular expression.
   * @param {*} value
   * @returns {boolean}
   */
  var isValidRegExp = (function (value) {
    try {
      return new RegExp(value) !== null;
    } catch (e) {
      return false;
    }
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var regexpValidator = (function (value, path) {
    assertValid(isValidRegExp(value), value, path, "a regular expression");
    return value;
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var requiredValidator = (function (value, path) {
    if (value == null) {
      throw new Error("'" + path + "' is a required option");
    }
    return value;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var stringValidator = (function (value, path) {
    assertValid(isString(value), value, path, "a string");
    return value;
  });

  // The base validator does no validation and just returns the value unchanged
  var base = function base(value) {
    return value;
  };

  // The 'default', 'required', and 'deprecated' methods are available after any
  // data-type method. Don't use the nullSafeChain on 'default' or 'required'
  // because they need to handle the null or undefined case
  base.default = function _default(defaultValue) {
    return chain(this, createDefaultValidator(defaultValue));
  };
  base.required = function required() {
    return chain(this, requiredValidator);
  };

  // helper validators
  var domain = function domain() {
    return nullSafeChain(this, domainValidator);
  };
  var minimumInteger = function minimumInteger(minValue) {
    return nullSafeChain(this, createMinimumValidator("an integer", minValue));
  };
  var minimumNumber = function minimumNumber(minValue) {
    return nullSafeChain(this, createMinimumValidator("a number", minValue));
  };
  var integer = function integer() {
    return nullSafeChain(this, integerValidator, {
      minimum: minimumInteger
    });
  };
  var nonEmptyString = function nonEmptyString() {
    return nullSafeChain(this, createNonEmptyValidator("a non-empty string"));
  };
  var nonEmptyArray = function nonEmptyArray() {
    return nullSafeChain(this, createNonEmptyValidator("a non-empty array"));
  };
  var nonEmptyObject = function nonEmptyObject() {
    return nullSafeChain(this, createNonEmptyValidator("a non-empty object"));
  };
  var regexp = function regexp() {
    return nullSafeChain(this, regexpValidator);
  };
  var unique = function createUnique() {
    return nullSafeChain(this, createUniqueValidator());
  };
  var uniqueItems = function createUniqueItems() {
    return nullSafeChain(this, createUniqueItemsValidator());
  };

  // top-level validators.  These are the first functions that are called to create a validator.
  var anyOf = function anyOf(validators, message) {
    // use chain here because we don't want to accept null or undefined unless at least
    // one of the validators accept null or undefined.
    return chain(this, createAnyOfValidator(validators, message));
  };
  var anything = function anything() {
    return this;
  };
  var arrayOf = function arrayOf(elementValidator) {
    return nullSafeChain(this, createArrayOfValidator(elementValidator), {
      nonEmpty: nonEmptyArray,
      uniqueItems: uniqueItems
    });
  };
  var boolean = function boolean() {
    return nullSafeChain(this, booleanValidator);
  };
  var callback = function callback() {
    return nullSafeChain(this, callbackValidator);
  };
  var literal = function literal(literalValue) {
    return nullSafeChain(this, createLiteralValidator(literalValue));
  };
  var number = function number() {
    return nullSafeChain(this, numberValidator, {
      minimum: minimumNumber,
      integer: integer,
      unique: unique
    });
  };
  var mapOfValues = function mapOfValues(valuesValidator) {
    return nullSafeChain(this, createMapOfValuesValidator(valuesValidator), {
      nonEmpty: nonEmptyObject
    });
  };
  var createObjectOfAdditionalProperties = function createObjectOfAdditionalProperties(schema) {
    return {
      noUnknownFields: function noUnknownFields() {
        return nullSafeChain(this, createNoUnknownFieldsValidator(schema));
      },
      nonEmpty: nonEmptyObject,
      concat: function concat(otherObjectOfValidator) {
        // combine the schema so that noUnknownFields, and concat have the combined schema
        var newSchema = _objectSpread2(_objectSpread2({}, schema), otherObjectOfValidator.schema);
        return nullSafeChain(this, otherObjectOfValidator, createObjectOfAdditionalProperties(newSchema));
      },
      deprecated: function deprecated(oldField, oldSchema, newField) {
        // Run the deprecated validator first so that the deprecated field is removed
        // before the objectOf validator runs.
        return reverseNullSafeChainJoinErrors(this, createDeprecatedValidator(oldField, oldSchema, newField));
      },
      schema: schema
    };
  };
  var objectOf = function objectOf(schema) {
    return nullSafeChain(this, createObjectOfValidator(schema), createObjectOfAdditionalProperties(schema));
  };
  var string = function string() {
    return nullSafeChain(this, stringValidator, {
      regexp: regexp,
      domain: domain,
      nonEmpty: nonEmptyString,
      unique: unique
    });
  };
  var boundAnyOf = anyOf.bind(base);
  var boundAnything = anything.bind(base);
  var boundArrayOf = arrayOf.bind(base);
  var boundBoolean = boolean.bind(base);
  var boundCallback = callback.bind(base);
  var boundLiteral = literal.bind(base);
  number.bind(base);
  var boundMapOfValues = mapOfValues.bind(base);
  var boundObjectOf = objectOf.bind(base);
  var boundString = string.bind(base);

  // compound validators
  var boundEnumOf = function boundEnumOf() {
    for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }
    return boundAnyOf(values.map(boundLiteral), "one of these values: [" + JSON.stringify(values) + "]");
  };

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var AMBIGUOUS = "ambiguous";
  var AUTHENTICATED = "authenticated";
  var LOGGED_OUT = "loggedOut";

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var validateIdentityMap = boundMapOfValues(boundArrayOf(boundObjectOf({
    authenticatedState: boundEnumOf(AMBIGUOUS, AUTHENTICATED, LOGGED_OUT),
    id: boundString(),
    namespace: boundObjectOf({
      code: boundString()
    }).noUnknownFields(),
    primary: boundBoolean(),
    xid: boundString()
  }).noUnknownFields()).required());

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var validateConfigOverride = boundObjectOf({});

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns an array whose items are the provided object's own enumerable
   * property values.
   * @param {Object} obj
   * @returns {Array}
   */
  var values = (function (obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var debugQueryParam = "alloy_debug";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createLogController = (function (_ref) {
    var console = _ref.console,
      locationSearch = _ref.locationSearch,
      createLogger = _ref.createLogger,
      instanceName = _ref.instanceName,
      createNamespacedStorage = _ref.createNamespacedStorage,
      getMonitors = _ref.getMonitors;
    var parsedQueryString = reactorQueryString.parse(locationSearch);
    var storage = createNamespacedStorage("instance." + instanceName + ".");
    var debugSessionValue = storage.session.getItem("debug");
    var debugEnabled = debugSessionValue === "true";
    var debugEnabledWritableFromConfig = debugSessionValue === null;
    var getDebugEnabled = function getDebugEnabled() {
      return debugEnabled;
    };
    var setDebugEnabled = function setDebugEnabled(value, _ref2) {
      var fromConfig = _ref2.fromConfig;
      if (!fromConfig || debugEnabledWritableFromConfig) {
        debugEnabled = value;
      }
      if (!fromConfig) {
        // Web storage only allows strings, so we explicitly convert to string.
        storage.session.setItem("debug", value.toString());
        debugEnabledWritableFromConfig = false;
      }
    };
    if (parsedQueryString[debugQueryParam] !== undefined) {
      setDebugEnabled(stringToBoolean(parsedQueryString[debugQueryParam]), {
        fromConfig: false
      });
    }
    return {
      setDebugEnabled: setDebugEnabled,
      logger: createLogger({
        getDebugEnabled: getDebugEnabled,
        context: {
          instanceName: instanceName
        },
        getMonitors: getMonitors,
        console: console
      }),
      createComponentLogger: function createComponentLogger(componentName) {
        return createLogger({
          getDebugEnabled: getDebugEnabled,
          context: {
            instanceName: instanceName,
            componentName: componentName
          },
          getMonitors: getMonitors,
          console: console
        });
      }
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // TO-DOCUMENT: Lifecycle hooks and their params.
  var hookNames = [
  // Called after all components have been registered.
  "onComponentsRegistered",
  // Called before an event is sent on a data collection request
  "onBeforeEvent",
  // Called before each request is made to the edge.
  "onBeforeRequest",
  // Called after each response is returned from the edge with a successful
  // status code
  "onResponse",
  // Called after a network request to the edge fails. Either the request
  // didn't make it to the edge, didn't make it to Konductor, or Konductor
  // failed to return a regularly-structured response. (In this case { error }
  // is passed as the parameter)
  // Also called when the respone returns a 400 or 500 error. (In this case
  // { response } is passed as the parameter)
  "onRequestFailure",
  // A user clicked on an element.
  "onClick",
  // Called by DecisioningEngine when a ruleset is satisfied with a list of
  // propositions
  "onDecision"];
  var createHook = function createHook(componentRegistry, hookName) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return Promise.all(componentRegistry.getLifecycleCallbacks(hookName).map(function (callback) {
        return new Promise(function (resolve) {
          resolve(callback.apply(void 0, args));
        });
      }));
    };
  };

  /**
   * This ensures that if a component's lifecycle method X
   * attempts to execute lifecycle method Y, that all X methods on all components
   * will have been called before any of their Y methods are called. It does
   * this by kicking the call to the Y method to the next JavaScript tick.
   * @returns {function}
   */
  var guardHook = function guardHook(fn) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return Promise.resolve().then(function () {
        return fn.apply(void 0, args);
      });
    };
  };
  var createLifecycle = (function (componentRegistry) {
    return hookNames.reduce(function (memo, hookName) {
      memo[hookName] = guardHook(createHook(componentRegistry, hookName));
      return memo;
    }, {});
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var wrapForErrorHandling = function wrapForErrorHandling(fn, stackMessage) {
    return function () {
      var result;
      try {
        result = fn.apply(void 0, arguments);
      } catch (error) {
        throw stackError({
          error: error,
          message: stackMessage
        });
      }
      if (result instanceof Promise) {
        result = result.catch(function (error) {
          throw stackError({
            error: error,
            message: stackMessage
          });
        });
      }
      return result;
    };
  };

  // TO-DOCUMENT: All public commands and their signatures.
  var createComponentRegistry = (function () {
    var componentsByNamespace = {};
    var commandsByName = {};
    var lifecycleCallbacksByName = {};
    var registerComponentCommands = function registerComponentCommands(namespace) {
      var componentCommandsByName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conflictingCommandNames = intersection(Object.keys(commandsByName), Object.keys(componentCommandsByName));
      if (conflictingCommandNames.length) {
        throw new Error("[ComponentRegistry] Could not register " + namespace + " " + ("because it has existing command(s): " + conflictingCommandNames.join(",")));
      }
      Object.keys(componentCommandsByName).forEach(function (commandName) {
        var command = componentCommandsByName[commandName];
        command.commandName = commandName;
        command.run = wrapForErrorHandling(command.run, "[" + namespace + "] An error occurred while executing the " + commandName + " command.");
        commandsByName[commandName] = command;
      });
    };
    var registerLifecycleCallbacks = function registerLifecycleCallbacks(namespace) {
      var componentLifecycleCallbacksByName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      Object.keys(componentLifecycleCallbacksByName).forEach(function (hookName) {
        lifecycleCallbacksByName[hookName] = lifecycleCallbacksByName[hookName] || [];
        lifecycleCallbacksByName[hookName].push(wrapForErrorHandling(componentLifecycleCallbacksByName[hookName], "[" + namespace + "] An error occurred while executing the " + hookName + " lifecycle hook."));
      });
    };
    return {
      register: function register(namespace, component) {
        var commands = component.commands,
          lifecycle = component.lifecycle;
        registerComponentCommands(namespace, commands);
        registerLifecycleCallbacks(namespace, lifecycle);
        componentsByNamespace[namespace] = component;
      },
      getCommand: function getCommand(commandName) {
        return commandsByName[commandName];
      },
      getCommandNames: function getCommandNames() {
        return Object.keys(commandsByName);
      },
      getLifecycleCallbacks: function getLifecycleCallbacks(hookName) {
        return lifecycleCallbacksByName[hookName] || [];
      }
    };
  });

  var injectSendNetworkRequest = (function (_ref) {
    var logger = _ref.logger,
      sendFetchRequest = _ref.sendFetchRequest,
      sendBeaconRequest = _ref.sendBeaconRequest,
      isRequestRetryable = _ref.isRequestRetryable,
      getRequestRetryDelay = _ref.getRequestRetryDelay;
    /**
     * Send a network request and returns details about the response.
     */
    return function (_ref2) {
      var requestId = _ref2.requestId,
        url = _ref2.url,
        payload = _ref2.payload,
        useSendBeacon = _ref2.useSendBeacon;
      // We want to log raw payload and event data rather than
      // our fancy wrapper objects. Calling payload.toJSON() is
      // insufficient to get all the nested raw data, because it's
      // not recursive (it doesn't call toJSON() on the event objects).
      // Parsing the result of JSON.stringify(), however, gives the
      // fully recursive raw data.
      var stringifiedPayload = JSON.stringify(payload);
      var parsedPayload = JSON.parse(stringifiedPayload);
      logger.logOnBeforeNetworkRequest({
        url: url,
        requestId: requestId,
        payload: parsedPayload
      });
      var executeRequest = function executeRequest() {
        var retriesAttempted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var requestMethod = useSendBeacon ? sendBeaconRequest : sendFetchRequest;
        return requestMethod(url, stringifiedPayload).then(function (response) {
          var requestIsRetryable = isRequestRetryable({
            response: response,
            retriesAttempted: retriesAttempted
          });
          if (requestIsRetryable) {
            var requestRetryDelay = getRequestRetryDelay({
              response: response,
              retriesAttempted: retriesAttempted
            });
            return new Promise(function (resolve) {
              setTimeout(function () {
                resolve(executeRequest(retriesAttempted + 1));
              }, requestRetryDelay);
            });
          }
          var parsedBody;
          try {
            parsedBody = JSON.parse(response.body);
          } catch (e) {
            // Non-JSON. Something went wrong.
          }
          logger.logOnNetworkResponse(_objectSpread2(_objectSpread2({
            requestId: requestId,
            url: url,
            payload: parsedPayload
          }, response), {}, {
            parsedBody: parsedBody,
            retriesAttempted: retriesAttempted
          }));
          return {
            statusCode: response.statusCode,
            body: response.body,
            parsedBody: parsedBody,
            getHeader: response.getHeader
          };
        });
      };
      return executeRequest().catch(function (error) {
        logger.logOnNetworkError({
          requestId: requestId,
          url: url,
          payload: parsedPayload,
          error: error
        });
        throw stackError({
          error: error,
          message: "Network request failed."
        });
      });
    };
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var injectExtractEdgeInfo = (function (_ref) {
    var logger = _ref.logger;
    return function (adobeEdgeHeader) {
      if (adobeEdgeHeader) {
        var headerParts = adobeEdgeHeader.split(";");
        if (headerParts.length >= 2 && headerParts[1].length > 0) {
          try {
            var regionId = parseInt(headerParts[1], 10);
            // eslint recommends using Number.isNaN instead, but this function is
            // not available in Internet Explorer. Number.isNaN is more robust to
            // non-numeric parameters. Since we already know regionId will be an
            // integer, using isNaN is okay.
            // https://github.com/airbnb/javascript#standard-library--isnan
            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(regionId)) {
              return {
                regionId: regionId
              };
            }
          } catch (e) {
            // No need to do anything. The log statement below will log an error
          }
        }
        logger.warn("Invalid adobe edge: \"" + adobeEdgeHeader + "\"");
      }
      return {};
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var IN = "in";
  var OUT = "out";
  var PENDING = "pending";

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var GENERAL = "general";

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var DECLINED_CONSENT_ERROR_CODE = "declinedConsent";
  var CONSENT_SOURCE_DEFAULT = "default";
  var CONSENT_SOURCE_INITIAL = "initial";
  var CONSENT_SOURCE_NEW = "new";
  var createDeclinedConsentError = function createDeclinedConsentError(errorMessage) {
    var error = new Error(errorMessage);
    error.code = DECLINED_CONSENT_ERROR_CODE;
    error.message = errorMessage;
    return error;
  };
  var createConsentStateMachine = (function (_ref) {
    var logger = _ref.logger;
    var deferreds = [];
    var runAll = function runAll() {
      while (deferreds.length) {
        deferreds.shift().resolve();
      }
    };
    var discardAll = function discardAll() {
      while (deferreds.length) {
        deferreds.shift().reject(createDeclinedConsentError("The user declined consent."));
      }
    };
    var awaitInitial = function awaitInitial() {
      return Promise.reject(new Error("Consent has not been initialized."));
    };
    var awaitInDefault = function awaitInDefault() {
      return Promise.resolve();
    };
    var awaitIn = function awaitIn() {
      return Promise.resolve();
    };
    var awaitOutDefault = function awaitOutDefault() {
      return Promise.reject(createDeclinedConsentError("No consent preferences have been set."));
    };
    var awaitOut = function awaitOut() {
      return Promise.reject(createDeclinedConsentError("The user declined consent."));
    };
    var awaitPending = function awaitPending(returnImmediately) {
      if (returnImmediately) {
        return Promise.reject(new Error("Consent is pending."));
      }
      var deferred = defer();
      deferreds.push(deferred);
      return deferred.promise;
    };
    return {
      in: function _in(source) {
        if (source === CONSENT_SOURCE_DEFAULT) {
          this.awaitConsent = awaitInDefault;
        } else {
          if (source === CONSENT_SOURCE_INITIAL) {
            logger.info("Loaded user consent preferences. The user previously consented.");
          } else if (source === CONSENT_SOURCE_NEW && this.awaitConsent !== awaitIn) {
            logger.info("User consented.");
          }
          runAll();
          this.awaitConsent = awaitIn;
        }
      },
      out: function out(source) {
        if (source === CONSENT_SOURCE_DEFAULT) {
          logger.warn("User consent preferences not found. Default consent of out will be used.");
          this.awaitConsent = awaitOutDefault;
        } else {
          if (source === CONSENT_SOURCE_INITIAL) {
            logger.warn("Loaded user consent preferences. The user previously declined consent.");
          } else if (source === CONSENT_SOURCE_NEW && this.awaitConsent !== awaitOut) {
            logger.warn("User declined consent.");
          }
          discardAll();
          this.awaitConsent = awaitOut;
        }
      },
      pending: function pending(source) {
        if (source === CONSENT_SOURCE_DEFAULT) {
          logger.info("User consent preferences not found. Default consent of pending will be used. Some commands may be delayed.");
        }
        this.awaitConsent = awaitPending;
      },
      awaitConsent: awaitInitial,
      withConsent: function withConsent() {
        return this.awaitConsent(true);
      }
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createConsent = (function (_ref) {
    var generalConsentState = _ref.generalConsentState,
      logger = _ref.logger;
    var _setConsent = function setConsent(consentByPurpose, source) {
      switch (consentByPurpose[GENERAL]) {
        case IN:
          generalConsentState.in(source);
          break;
        case OUT:
          generalConsentState.out(source);
          break;
        case PENDING:
          generalConsentState.pending(source);
          break;
        default:
          logger.warn("Unknown consent value: " + consentByPurpose[GENERAL]);
          break;
      }
    };
    return {
      initializeConsent: function initializeConsent(defaultConsentByPurpose, storedConsentByPurpose) {
        if (storedConsentByPurpose[GENERAL]) {
          _setConsent(storedConsentByPurpose, CONSENT_SOURCE_INITIAL);
        } else {
          _setConsent(defaultConsentByPurpose, CONSENT_SOURCE_DEFAULT);
        }
      },
      setConsent: function setConsent(consentByPurpose) {
        _setConsent(consentByPurpose, CONSENT_SOURCE_NEW);
      },
      suspend: function suspend() {
        generalConsentState.pending();
      },
      awaitConsent: function awaitConsent() {
        return generalConsentState.awaitConsent();
      },
      withConsent: function withConsent() {
        return generalConsentState.withConsent();
      }
    };
  });

  var getXdmPropositions = function getXdmPropositions(xdm) {
    return xdm &&
    // eslint-disable-next-line no-underscore-dangle
    xdm._experience &&
    // eslint-disable-next-line no-underscore-dangle
    xdm._experience.decisioning &&
    // eslint-disable-next-line no-underscore-dangle
    isNonEmptyArray(xdm._experience.decisioning.propositions) ?
    // eslint-disable-next-line no-underscore-dangle
    xdm._experience.decisioning.propositions : [];
  };
  var createEvent = (function () {
    var content = {};
    var userXdm;
    var userData;
    var _documentMayUnload = false;
    var isFinalized = false;
    var shouldSendEvent = true;
    var throwIfEventFinalized = function throwIfEventFinalized(methodName) {
      if (isFinalized) {
        throw new Error(methodName + " cannot be called after event is finalized.");
      }
    };
    var event = {
      hasQuery: function hasQuery() {
        return Object.prototype.hasOwnProperty.call(this.getContent(), "query");
      },
      getContent: function getContent() {
        var currentContent = JSON.parse(JSON.stringify(content));
        if (userXdm) {
          deepAssign(currentContent, {
            xdm: userXdm
          });
        }
        if (userData) {
          deepAssign(currentContent, {
            data: userData
          });
        }
        return currentContent;
      },
      setUserXdm: function setUserXdm(value) {
        throwIfEventFinalized("setUserXdm");
        userXdm = value;
      },
      setUserData: function setUserData(value) {
        throwIfEventFinalized("setUserData");
        userData = value;
      },
      mergeXdm: function mergeXdm(xdm) {
        throwIfEventFinalized("mergeXdm");
        if (xdm) {
          deepAssign(content, {
            xdm: xdm
          });
        }
      },
      mergeData: function mergeData(data) {
        throwIfEventFinalized("mergeData");
        if (data) {
          deepAssign(content, {
            data: data
          });
        }
      },
      mergeMeta: function mergeMeta(meta) {
        throwIfEventFinalized("mergeMeta");
        if (meta) {
          deepAssign(content, {
            meta: meta
          });
        }
      },
      mergeQuery: function mergeQuery(query) {
        throwIfEventFinalized("mergeQuery");
        if (query) {
          deepAssign(content, {
            query: query
          });
        }
      },
      documentMayUnload: function documentMayUnload() {
        _documentMayUnload = true;
      },
      finalize: function finalize(onBeforeEventSend) {
        if (isFinalized) {
          return;
        }
        var newPropositions = deduplicateArray([].concat(_toConsumableArray(getXdmPropositions(userXdm)), _toConsumableArray(getXdmPropositions(content.xdm))), function (a, b) {
          return a === b || a.id && b.id && a.id === b.id && a.scope && b.scope && a.scope === b.scope;
        });
        if (userXdm) {
          this.mergeXdm(userXdm);
        }
        if (newPropositions.length > 0) {
          // eslint-disable-next-line no-underscore-dangle
          content.xdm._experience.decisioning.propositions = newPropositions;
        }
        if (userData) {
          event.mergeData(userData);
        }

        // the event should already be considered finalized in case onBeforeEventSend throws an error
        isFinalized = true;
        if (onBeforeEventSend) {
          // assume that the onBeforeEventSend callback will fail (in-case of an error)
          shouldSendEvent = false;

          // this allows the user to replace the xdm and data properties
          // on the object passed to the callback
          var tempContent = {
            xdm: content.xdm || {},
            data: content.data || {}
          };
          var result = onBeforeEventSend(tempContent);
          shouldSendEvent = result !== false;
          content.xdm = tempContent.xdm || {};
          content.data = tempContent.data || {};
          if (isEmptyObject(content.xdm)) {
            delete content.xdm;
          }
          if (isEmptyObject(content.data)) {
            delete content.data;
          }
        }
      },
      getDocumentMayUnload: function getDocumentMayUnload() {
        return _documentMayUnload;
      },
      isEmpty: function isEmpty() {
        return isEmptyObject(content) && (!userXdm || isEmptyObject(userXdm)) && (!userData || isEmptyObject(userData));
      },
      shouldSend: function shouldSend() {
        return shouldSendEvent;
      },
      getViewName: function getViewName() {
        if (!userXdm || !userXdm.web || !userXdm.web.webPageDetails) {
          return undefined;
        }
        return userXdm.web.webPageDetails.viewName;
      },
      toJSON: function toJSON() {
        if (!isFinalized) {
          throw new Error("toJSON called before finalize");
        }
        return content;
      }
    };
    return event;
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var RETRY_AFTER = "Retry-After";
  var ADOBE_EDGE = "x-adobe-edge";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Creates a representation of a gateway response with the addition of
   * helper methods.
   * @returns Response
   */
  var injectCreateResponse = (function (_ref) {
    var extractEdgeInfo = _ref.extractEdgeInfo;
    return function (_ref2) {
      var _ref2$content = _ref2.content,
        content = _ref2$content === void 0 ? {} : _ref2$content,
        getHeader = _ref2.getHeader;
      var _content$handle = content.handle,
        handle = _content$handle === void 0 ? [] : _content$handle,
        _content$errors = content.errors,
        errors = _content$errors === void 0 ? [] : _content$errors,
        _content$warnings = content.warnings,
        warnings = _content$warnings === void 0 ? [] : _content$warnings;

      /**
       * Response object.
       * @typedef {Object} Response
       */
      return {
        /**
         * Returns matching fragments of the response by type.
         * @param {String} type A string with the current format: <namespace:action>
         *
         * @example
         * getPayloadsByType("identity:persist")
         */
        getPayloadsByType: function getPayloadsByType(type) {
          return flatMap(handle.filter(function (fragment) {
            return fragment.type === type;
          }), function (fragment) {
            return fragment.payload;
          });
        },
        /**
         * Returns all errors.
         */
        getErrors: function getErrors() {
          return errors;
        },
        /**
         * Returns all warnings.
         */
        getWarnings: function getWarnings() {
          return warnings;
        },
        /**
         * Returns an object containing the regionId from the x-adobe-edge header
         */
        getEdge: function getEdge() {
          return extractEdgeInfo(getHeader(ADOBE_EDGE));
        },
        toJSON: function toJSON() {
          return content;
        }
      };
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var CONFIGURE = "configure";
  var SET_DEBUG = "setDebug";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectExecuteCommand = (function (_ref) {
    var logger = _ref.logger,
      configureCommand = _ref.configureCommand,
      setDebugCommand = _ref.setDebugCommand,
      handleError = _ref.handleError,
      validateCommandOptions = _ref.validateCommandOptions;
    var configurePromise;
    var getExecutor = function getExecutor(commandName, options) {
      var executor;
      if (commandName === CONFIGURE) {
        if (configurePromise) {
          throw new Error("The library has already been configured and may only be configured once.");
        }
        executor = function executor() {
          configurePromise = configureCommand(options);
          return configurePromise.then(function () {
            // Don't expose internals to the user.
          });
        };
      } else {
        if (!configurePromise) {
          throw new Error("The library must be configured first. Please do so by executing the configure command.");
        }
        if (commandName === SET_DEBUG) {
          executor = function executor() {
            return setDebugCommand(options);
          };
        } else {
          executor = function executor() {
            return configurePromise.then(function (componentRegistry) {
              var command = componentRegistry.getCommand(commandName);
              if (!command || !isFunction(command.run)) {
                var commandNames = [CONFIGURE, SET_DEBUG].concat(componentRegistry.getCommandNames()).join(", ");
                throw new Error("The " + commandName + " command does not exist. List of available commands: " + commandNames + ".");
              }
              var validatedOptions = validateCommandOptions({
                command: command,
                options: options
              });
              return command.run(validatedOptions);
            }, function () {
              logger.warn("An error during configuration is preventing the " + commandName + " command from executing.");
              // If configuration failed, we prevent the configuration
              // error from bubbling here because we don't want the
              // configuration error to be reported in the console every
              // time any command is executed. Only having it bubble
              // once when the configure command runs is sufficient.
              // Instead, for this command, we'll just return a promise
              // that never gets resolved.
              return new Promise(function () {});
            });
          };
        }
      }
      return executor;
    };
    return function (commandName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Promise(function (resolve) {
        // We have to wrap the getExecutor() call in the promise so the promise
        // will be rejected if getExecutor() throws errors.
        var executor = getExecutor(commandName, options);
        logger.logOnBeforeCommand({
          commandName: commandName,
          options: options
        });
        resolve(executor());
      }).catch(function (error) {
        return handleError(error, commandName + " command");
      }).catch(function (error) {
        logger.logOnCommandRejected({
          commandName: commandName,
          options: options,
          error: error
        });
        throw error;
      }).then(function (rawResult) {
        // We should always be returning an object from every command.
        var result = isObject(rawResult) ? rawResult : {};
        logger.logOnCommandResolved({
          commandName: commandName,
          options: options,
          result: result
        });
        return result;
      });
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var COMMAND_DOC_URI = "https://adobe.ly/3sHgQHb";
  var validateCommandOptions = (function (_ref) {
    var command = _ref.command,
      options = _ref.options;
    var commandName = command.commandName,
      _command$documentatio = command.documentationUri,
      documentationUri = _command$documentatio === void 0 ? COMMAND_DOC_URI : _command$documentatio,
      optionsValidator = command.optionsValidator;
    var validatedOptions = options;
    if (optionsValidator) {
      try {
        validatedOptions = optionsValidator(options);
      } catch (validationError) {
        var invalidOptionsMessage = "Invalid " + commandName + " command options:\n\t - " + validationError + " For command documentation see: " + documentationUri;
        throw new Error(invalidOptionsMessage);
      }
    }
    return validatedOptions;
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  /**
   * Verifies user provided event options.
   * @param {*} options The user event options to validate
   * @returns {*} Validated options
   */
  var validateUserEventOptions = (function (_ref) {
    var options = _ref.options;
    var eventOptionsValidator = boundObjectOf({
      type: boundString(),
      xdm: boundObjectOf({
        eventType: boundString(),
        identityMap: validateIdentityMap
      }),
      data: boundObjectOf({}),
      documentUnloading: boundBoolean(),
      renderDecisions: boundBoolean(),
      decisionScopes: boundArrayOf(boundString()).uniqueItems(),
      personalization: boundObjectOf({
        decisionScopes: boundArrayOf(boundString()).uniqueItems(),
        surfaces: boundArrayOf(boundString()).uniqueItems(),
        sendDisplayEvent: boundBoolean().default(true),
        includeRenderedPropositions: boundBoolean().default(false),
        defaultPersonalizationEnabled: boundBoolean(),
        decisionContext: boundObjectOf({})
      }).default({
        sendDisplayEvent: true
      }),
      datasetId: boundString(),
      mergeId: boundString(),
      edgeConfigOverrides: validateConfigOverride,
      initializePersonalization: boundBoolean()
    }).required().noUnknownFields();
    return eventOptionsValidator(options);
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var validateApplyResponse = (function (_ref) {
    var options = _ref.options;
    var validator = boundObjectOf({
      renderDecisions: boundBoolean(),
      responseHeaders: boundMapOfValues(boundString().required()),
      responseBody: boundObjectOf({
        handle: boundArrayOf(boundObjectOf({
          type: boundString().required(),
          payload: boundAnything().required()
        })).required()
      }).required(),
      personalization: boundObjectOf({
        sendDisplayEvent: boundBoolean().default(true),
        decisionContext: boundObjectOf({})
      }).default({
        sendDisplayEvent: true
      })
    }).noUnknownFields();
    return validator(options);
  });

  var _excluded$5 = ["xdm", "data", "documentUnloading", "type", "mergeId", "datasetId", "edgeConfigOverrides"];
  var createDataCollector = function createDataCollector(_ref) {
    var eventManager = _ref.eventManager,
      logger = _ref.logger;
    return {
      commands: {
        sendEvent: {
          documentationUri: "https://adobe.ly/3GQ3Q7t",
          optionsValidator: function optionsValidator(options) {
            return validateUserEventOptions({
              options: options
            });
          },
          run: function run(options) {
            var xdm = options.xdm,
              data = options.data,
              documentUnloading = options.documentUnloading,
              type = options.type,
              mergeId = options.mergeId,
              datasetId = options.datasetId,
              edgeConfigOverrides = options.edgeConfigOverrides,
              eventManagerOptions = _objectWithoutProperties(options, _excluded$5);
            var event = eventManager.createEvent();
            if (documentUnloading) {
              event.documentMayUnload();
            }
            event.setUserXdm(xdm);
            event.setUserData(data);
            if (type) {
              event.mergeXdm({
                eventType: type
              });
            }
            if (mergeId) {
              event.mergeXdm({
                eventMergeId: mergeId
              });
            }
            if (edgeConfigOverrides) {
              eventManagerOptions.edgeConfigOverrides = edgeConfigOverrides;
            }
            if (datasetId) {
              logger.warn("The 'datasetId' option has been deprecated. Please use 'edgeConfigOverrides.com_adobe_experience_platform.datasets.event.datasetId' instead.");
              eventManagerOptions.edgeConfigOverrides = edgeConfigOverrides || {};
              deepAssign(eventManagerOptions.edgeConfigOverrides, {
                com_adobe_experience_platform: {
                  datasets: {
                    event: {
                      datasetId: datasetId
                    }
                  }
                }
              });
            }
            return eventManager.sendEvent(event, eventManagerOptions);
          }
        },
        applyResponse: {
          documentationUri: "",
          optionsValidator: function optionsValidator(options) {
            return validateApplyResponse({
              options: options
            });
          },
          run: function run(options) {
            var _options$renderDecisi = options.renderDecisions,
              renderDecisions = _options$renderDecisi === void 0 ? false : _options$renderDecisi,
              _options$decisionCont = options.decisionContext,
              decisionContext = _options$decisionCont === void 0 ? {} : _options$decisionCont,
              _options$responseHead = options.responseHeaders,
              responseHeaders = _options$responseHead === void 0 ? {} : _options$responseHead,
              _options$responseBody = options.responseBody,
              responseBody = _options$responseBody === void 0 ? {
                handle: []
              } : _options$responseBody,
              personalization = options.personalization;
            var event = eventManager.createEvent();
            return eventManager.applyResponse(event, {
              renderDecisions: renderDecisions,
              decisionContext: decisionContext,
              responseHeaders: responseHeaders,
              responseBody: responseBody,
              personalization: personalization
            });
          }
        }
      }
    };
  };
  createDataCollector.namespace = "DataCollector";

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createClickHandler = function createClickHandler(_ref) {
    var eventManager = _ref.eventManager,
      lifecycle = _ref.lifecycle,
      handleError = _ref.handleError;
    return function (clickEvent) {
      // TODO: Consider safeguarding from the same object being clicked multiple times in rapid succession?
      var clickedElement = clickEvent.target;
      var event = eventManager.createEvent();
      // this is to make sure a exit link personalization metric use send beacon
      event.documentMayUnload();
      return lifecycle.onClick({
        event: event,
        clickedElement: clickedElement
      }).then(function () {
        if (event.isEmpty()) {
          return Promise.resolve();
        }
        return eventManager.sendEvent(event);
      })
      // eventManager.sendEvent() will return a promise resolved to an
      // object and we want to avoid returning any value to the customer
      .then(noop$1).catch(function (error) {
        handleError(error, "click collection");
      });
    };
  };
  var attachClickActivityCollector = (function (_ref2) {
    var eventManager = _ref2.eventManager,
      lifecycle = _ref2.lifecycle,
      handleError = _ref2.handleError;
    var clickHandler = createClickHandler({
      eventManager: eventManager,
      lifecycle: lifecycle,
      handleError: handleError
    });
    document.addEventListener("click", clickHandler, true);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var downloadLinkQualifier = boundString().regexp().default("\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$");
  var configValidators$1 = boundObjectOf({
    clickCollectionEnabled: boundBoolean().default(true),
    onBeforeLinkClickSend: boundCallback(),
    downloadLinkQualifier: downloadLinkQualifier
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createLinkClick = (function (_ref) {
    var getLinkDetails = _ref.getLinkDetails,
      config = _ref.config,
      logger = _ref.logger;
    var clickCollectionEnabled = config.clickCollectionEnabled;
    if (!clickCollectionEnabled) {
      return function () {
        return undefined;
      };
    }
    return function (_ref2) {
      var targetElement = _ref2.targetElement,
        event = _ref2.event;
      var linkDetails = getLinkDetails({
        targetElement: targetElement,
        config: config,
        logger: logger
      });
      if (linkDetails) {
        event.mergeXdm(linkDetails.xdm);
        event.setUserData(linkDetails.data);
      }
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createGetLinkDetails = (function (_ref) {
    var window = _ref.window,
      getLinkName = _ref.getLinkName,
      getLinkRegion = _ref.getLinkRegion,
      getAbsoluteUrlFromAnchorElement = _ref.getAbsoluteUrlFromAnchorElement,
      findSupportedAnchorElement = _ref.findSupportedAnchorElement,
      determineLinkType = _ref.determineLinkType;
    return function (_ref2) {
      var targetElement = _ref2.targetElement,
        config = _ref2.config,
        logger = _ref2.logger;
      var anchorElement = findSupportedAnchorElement(targetElement);
      if (!anchorElement) {
        logger.info("This link click event is not triggered because the HTML element is not an anchor.");
        return undefined;
      }
      var linkUrl = getAbsoluteUrlFromAnchorElement(window, anchorElement);
      if (!linkUrl) {
        logger.info("This link click event is not triggered because the HTML element doesn't have an URL.");
        return undefined;
      }
      var linkType = determineLinkType(window, config, linkUrl, anchorElement);
      var linkRegion = getLinkRegion(anchorElement);
      var linkName = getLinkName(anchorElement);
      var onBeforeLinkClickSend = config.onBeforeLinkClickSend;
      var options = {
        xdm: {
          eventType: "web.webinteraction.linkClicks",
          web: {
            webInteraction: {
              name: linkName,
              region: linkRegion,
              type: linkType,
              URL: linkUrl,
              linkClicks: {
                value: 1
              }
            }
          }
        },
        data: {},
        clickedElement: targetElement
      };
      if (!onBeforeLinkClickSend) {
        return options;
      }
      var shouldEventBeTracked = onBeforeLinkClickSend(options);
      if (shouldEventBeTracked !== false) {
        return options;
      }
      logger.info("This link click event is not triggered because it was canceled in onBeforeLinkClickSend.");
      return undefined;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var urlStartsWithScheme = function urlStartsWithScheme(url) {
    return url && /^[a-z0-9]+:\/\//i.test(url);
  };
  var getAbsoluteUrlFromAnchorElement = function getAbsoluteUrlFromAnchorElement(window, element) {
    var loc = window.location;
    var url = element.href ? element.href : "";
    var protocol = element.protocol,
      host = element.host;
    if (!urlStartsWithScheme(url)) {
      if (!protocol) {
        protocol = loc.protocol ? loc.protocol : "";
      }
      protocol = protocol ? protocol + "//" : "";
      if (!host) {
        host = loc.host ? loc.host : "";
      }
      var path = "";
      if (url.substring(0, 1) !== "/") {
        var indx = loc.pathname.lastIndexOf("/");
        indx = indx < 0 ? 0 : indx;
        path = loc.pathname.substring(0, indx);
      }
      url = "" + protocol + host + path + "/" + url;
    }
    return url;
  };
  var isSupportedAnchorElement = function isSupportedAnchorElement(element) {
    if (element.href && (element.tagName === "A" || element.tagName === "AREA") && (!element.onclick || !element.protocol || element.protocol.toLowerCase().indexOf("javascript") < 0)) {
      return true;
    }
    return false;
  };
  var trimQueryFromUrl = function trimQueryFromUrl(url) {
    var questionMarkIndex = url.indexOf("?");
    var hashIndex = url.indexOf("#");
    if (questionMarkIndex >= 0 && (questionMarkIndex < hashIndex || hashIndex < 0)) {
      return url.substring(0, questionMarkIndex);
    }
    if (hashIndex >= 0) {
      return url.substring(0, hashIndex);
    }
    return url;
  };
  var isDownloadLink = function isDownloadLink(downloadLinkQualifier, linkUrl, clickedObj) {
    var re = new RegExp(downloadLinkQualifier);
    var trimmedLinkUrl = trimQueryFromUrl(linkUrl).toLowerCase();
    return clickedObj.download ? true : re.test(trimmedLinkUrl);
  };
  var isExitLink = function isExitLink(window, linkUrl) {
    var currentHostname = window.location.hostname.toLowerCase();
    var trimmedLinkUrl = trimQueryFromUrl(linkUrl).toLowerCase();
    if (trimmedLinkUrl.indexOf(currentHostname) >= 0) {
      return false;
    }
    return true;
  };

  /**
   * Reduces repeated whitespace within a string. Whitespace surrounding the string
   * is trimmed and any occurrence of whitespace within the string is replaced with
   * a single space.
   * @param {string} str String to be formatted.
   * @returns {string} Formatted string.
   */
  var truncateWhiteSpace = function truncateWhiteSpace(str) {
    return str && str.replace(/\s+/g, " ").trim();
  };
  var determineLinkType = function determineLinkType(window, config, linkUrl, clickedObj) {
    var linkType = "other";
    if (isDownloadLink(config.downloadLinkQualifier, linkUrl, clickedObj)) {
      linkType = "download";
    } else if (isExitLink(window, linkUrl)) {
      linkType = "exit";
    }
    return linkType;
  };
  var findSupportedAnchorElement = function findSupportedAnchorElement(targetElement) {
    var node = targetElement;
    while (node) {
      if (isSupportedAnchorElement(node)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var unsupportedNodeNames = /^(SCRIPT|STYLE|LINK|CANVAS|NOSCRIPT|#COMMENT)$/i;

  /**
   * Determines if a node qualifies as a supported link text node.
   * @param {*} node Node to determine support for.
   * @returns {boolean}
   */
  var isSupportedTextNode = function isSupportedTextNode(node) {
    if (node && node.nodeName) {
      if (node.nodeName.match(unsupportedNodeNames)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Orders and returns specified node and its child nodes in arrays of supported
   * and unsupported nodes.
   * @param {*} node The node to extract supported and unsupported nodes from.
   * @returns {{supportedNodes: Array, includesUnsupportedNodes: boolean}} Node support object.
   */
  var extractSupportedNodes = function extractSupportedNodes(node) {
    var supportedNodes = [];
    var includesUnsupportedNodes = false;
    if (isSupportedTextNode(node)) {
      supportedNodes.push(node);
      if (node.childNodes) {
        var childNodes = Array.prototype.slice.call(node.childNodes);
        childNodes.forEach(function (childNode) {
          var nodes = extractSupportedNodes(childNode);
          supportedNodes = supportedNodes.concat(nodes.supportedNodes);
          includesUnsupportedNodes = includesUnsupportedNodes || nodes.includesUnsupportedNodes;
        });
      }
    } else {
      includesUnsupportedNodes = true;
    }
    return {
      supportedNodes: supportedNodes,
      includesUnsupportedNodes: includesUnsupportedNodes
    };
  };

  /**
   * Returns the value of a node attribute.
   * @param {*} node The node holding the attribute.
   * @param {string} attributeName The name of the attribute.
   * @param {string} nodeName Optional node name constraint.
   * @returns {string} Attribute value or undefined.
   */
  var getNodeAttributeValue = function getNodeAttributeValue(node, attributeName, nodeName) {
    var attributeValue;
    if (!nodeName || nodeName === node.nodeName.toUpperCase()) {
      attributeValue = node.getAttribute(attributeName);
    }
    return attributeValue;
  };

  /**
   * Extracts the children supported nodes attributes map
   * @param {*} nodes The nodes array holding the children nodes.
   * The returned map contains the supported not empty children attributes values.
   * */
  var getChildrenAttributes = function getChildrenAttributes(nodes) {
    var attributes = {
      texts: []
    };
    nodes.supportedNodes.forEach(function (supportedNode) {
      if (supportedNode.getAttribute) {
        if (!attributes.alt) {
          attributes.alt = truncateWhiteSpace(supportedNode.getAttribute("alt"));
        }
        if (!attributes.title) {
          attributes.title = truncateWhiteSpace(supportedNode.getAttribute("title"));
        }
        if (!attributes.inputValue) {
          attributes.inputValue = truncateWhiteSpace(getNodeAttributeValue(supportedNode, "value", "INPUT"));
        }
        if (!attributes.imgSrc) {
          attributes.imgSrc = truncateWhiteSpace(getNodeAttributeValue(supportedNode, "src", "IMG"));
        }
      }
      if (supportedNode.nodeValue) {
        attributes.texts.push(supportedNode.nodeValue);
      }
    });
    return attributes;
  };

  /**
   * Extracts a link-name from a given node.
   *
   * The returned link-name is set to one of the following (in order of priority):
   *
   * 1. Clicked node innerText
   * 2. Clicked node textContent
   * 3. Clicked node and its child nodes nodeValue appended together.
   * 4. Clicked node alt attribute or node descendant alt attribute.
   *    Whichever is found first.
   * 5. Clicked node text attribute or node descendant text attribute.
   *    Whichever is found first.
   * 6. Clicked node INPUT descendant value attribute.
   *    Whichever is found first.
   * 7. Clicked node IMG descendant src attribute.
   *    Whichever is found first.
   *
   * @param {*} node The node to find link text for.
   * @returns {string} link-name or an empty string if not link-name is found.
   */
  var getLinkName = (function (node) {
    var nodeText = truncateWhiteSpace(node.innerText || node.textContent);
    var nodes = extractSupportedNodes(node);
    // if contains unsupported nodes we want children node attributes
    if (!nodeText || nodes.includesUnsupportedNodes) {
      var attributesMap = getChildrenAttributes(nodes);
      nodeText = truncateWhiteSpace(attributesMap.texts.join(""));
      if (!nodeText) {
        nodeText = attributesMap.alt || attributesMap.title || attributesMap.inputValue || attributesMap.imgSrc;
      }
    }
    return nodeText || "";
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var semanticElements = /^(HEADER|MAIN|FOOTER|NAV)$/i;
  var getAriaRegionLabel = function getAriaRegionLabel(node) {
    var regionLabel;
    if (node.role === "region" && isNonEmptyString(node["aria-label"])) {
      regionLabel = node["aria-label"];
    }
    return regionLabel;
  };
  var getSectionNodeName = function getSectionNodeName(node) {
    var nodeName;
    if (node && node.nodeName) {
      if (node.nodeName.match(semanticElements)) {
        nodeName = node.nodeName;
      }
    }
    return nodeName;
  };

  /**
   * Extracts a node link-region.
   *
   * The link-region is determined by traversing up the DOM
   * looking for a region that is determined in order of priority:
   *
   * 1. element.id
   * 2. Aria region label
   * 3. Semantic element name
   * 4. BODY (if no other link-region is found).
   *
   * @param {*} node The node to find link region for.
   * @returns {string} link-region.
   */
  var getLinkRegion = (function (node) {
    var linkParentNode = node.parentNode;
    var regionName;
    while (linkParentNode) {
      regionName = truncateWhiteSpace(linkParentNode.id || getAriaRegionLabel(linkParentNode) || getSectionNodeName(linkParentNode));
      if (regionName) {
        return regionName;
      }
      linkParentNode = linkParentNode.parentNode;
    }
    return "BODY";
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var _getLinkDetails = createGetLinkDetails({
    window: window,
    getLinkName: getLinkName,
    getLinkRegion: getLinkRegion,
    getAbsoluteUrlFromAnchorElement: getAbsoluteUrlFromAnchorElement,
    findSupportedAnchorElement: findSupportedAnchorElement,
    determineLinkType: determineLinkType
  });
  var createActivityCollector = function createActivityCollector(_ref) {
    var config = _ref.config,
      eventManager = _ref.eventManager,
      handleError = _ref.handleError,
      logger = _ref.logger;
    var linkClick = createLinkClick({
      getLinkDetails: _getLinkDetails,
      config: config,
      logger: logger
    });
    return {
      lifecycle: {
        onComponentsRegistered: function onComponentsRegistered(tools) {
          var lifecycle = tools.lifecycle;
          attachClickActivityCollector({
            eventManager: eventManager,
            lifecycle: lifecycle,
            handleError: handleError
          });
          // TODO: createScrollActivityCollector ...
        },
        onClick: function onClick(_ref2) {
          var event = _ref2.event,
            clickedElement = _ref2.clickedElement;
          linkClick({
            targetElement: clickedElement,
            event: event
          });
        }
      }
    };
  };
  createActivityCollector.namespace = "ActivityCollector";
  createActivityCollector.configValidators = configValidators$1;
  createActivityCollector.buildOnInstanceConfiguredExtraParams = function (_ref3) {
    var config = _ref3.config,
      logger = _ref3.logger;
    return {
      getLinkDetails: function getLinkDetails(targetElement) {
        return _getLinkDetails({
          targetElement: targetElement,
          config: config,
          logger: logger
        });
      }
    };
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createResultLogMessage$1 = function createResultLogMessage(idSync, success) {
    return "ID sync " + (success ? "succeeded" : "failed") + ": " + idSync.spec.url;
  };
  var injectProcessIdSyncs = (function (_ref) {
    var fireReferrerHideableImage = _ref.fireReferrerHideableImage,
      logger = _ref.logger;
    return function (idSyncs) {
      var urlIdSyncs = idSyncs.filter(function (idSync) {
        return idSync.type === "url";
      });
      if (!urlIdSyncs.length) {
        return Promise.resolve();
      }
      return Promise.all(urlIdSyncs.map(function (idSync) {
        return fireReferrerHideableImage(idSync.spec).then(function () {
          logger.info(createResultLogMessage$1(idSync, true));
        }).catch(function () {
          // We intentionally do not throw an error if id syncs fail. We
          // consider it a non-critical failure and therefore do not want it to
          // reject the promise handed back to the customer.
          logger.error(createResultLogMessage$1(idSync, false));
        });
      })).then(noop$1);
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var configValidators = boundObjectOf({
    thirdPartyCookiesEnabled: boundBoolean().default(true),
    idMigrationEnabled: boundBoolean().default(true)
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  /**
   * Verifies user provided event options.
   * @param {*} options The user event options to validate
   * @returns {*} Validated options
   */
  var getIdentityOptionsValidator = boundObjectOf({
    namespaces: boundArrayOf(boundLiteral("ECID")).nonEmpty().uniqueItems().default(["ECID"]),
    edgeConfigOverrides: validateConfigOverride
  }).noUnknownFields().default({
    namespaces: ["ECID"]
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  /**
   * Verifies user provided event options.
   * @param {*} options The user event options to validate
   * @returns {*} Validated options
   */
  var appendIdentityToUrlOptionsValidator = boundObjectOf({
    url: boundString().required().nonEmpty(),
    edgeConfigOverrides: validateConfigOverride
  }).required().noUnknownFields();

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createComponent$4 = (function (_ref) {
    var addEcidQueryToPayload = _ref.addEcidQueryToPayload,
      addQueryStringIdentityToPayload = _ref.addQueryStringIdentityToPayload,
      ensureSingleIdentity = _ref.ensureSingleIdentity,
      setLegacyEcid = _ref.setLegacyEcid,
      handleResponseForIdSyncs = _ref.handleResponseForIdSyncs,
      getEcidFromResponse = _ref.getEcidFromResponse,
      getIdentity = _ref.getIdentity,
      consent = _ref.consent,
      appendIdentityToUrl = _ref.appendIdentityToUrl,
      logger = _ref.logger;
    var ecid;
    var edge = {};
    return {
      lifecycle: {
        onBeforeRequest: function onBeforeRequest(_ref2) {
          var request = _ref2.request,
            onResponse = _ref2.onResponse,
            onRequestFailure = _ref2.onRequestFailure;
          // Querying the ECID on every request to be able to set the legacy cookie, and make it
          // available for the `getIdentity` command.
          addEcidQueryToPayload(request.getPayload());
          addQueryStringIdentityToPayload(request.getPayload());
          return ensureSingleIdentity({
            request: request,
            onResponse: onResponse,
            onRequestFailure: onRequestFailure
          });
        },
        onResponse: function onResponse(_ref3) {
          var response = _ref3.response;
          if (!ecid) {
            ecid = getEcidFromResponse(response);

            // Only data collection calls will have an ECID in the response.
            // https://jira.corp.adobe.com/browse/EXEG-1234
            if (ecid) {
              setLegacyEcid(ecid);
            }
          }
          // For sendBeacon requests, getEdge() will return {}, so we are using assign here
          // so that sendBeacon requests don't override the edge info from before.
          edge = reactorObjectAssign(edge, response.getEdge());
          return handleResponseForIdSyncs(response);
        }
      },
      commands: {
        getIdentity: {
          optionsValidator: getIdentityOptionsValidator,
          run: function run(options) {
            return consent.awaitConsent().then(function () {
              return ecid ? undefined : getIdentity(options);
            }).then(function () {
              return {
                identity: {
                  ECID: ecid
                },
                edge: edge
              };
            });
          }
        },
        appendIdentityToUrl: {
          optionsValidator: appendIdentityToUrlOptionsValidator,
          run: function run(options) {
            return consent.withConsent().then(function () {
              return ecid ? undefined : getIdentity(options);
            }).then(function () {
              return {
                url: appendIdentityToUrl(ecid, options.url)
              };
            }).catch(function (error) {
              logger.warn("Unable to append identity to url. " + error.message);
              return options;
            });
          }
        }
      }
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Handles migration of ECID to and from Visitor.js.
   */
  var createLegacyIdentity = (function (_ref) {
    var config = _ref.config,
      getEcidFromVisitor = _ref.getEcidFromVisitor,
      apexDomain = _ref.apexDomain,
      isPageSsl = _ref.isPageSsl,
      cookieJar = _ref.cookieJar;
    var idMigrationEnabled = config.idMigrationEnabled,
      orgId = config.orgId;
    var amcvCookieName = "AMCV_" + orgId;
    var getEcidFromLegacyCookies = function getEcidFromLegacyCookies() {
      var ecid = null;
      var secidCookieName = "s_ecid";
      var legacyEcidCookieValue = cookieJar.get(secidCookieName) || cookieJar.get(amcvCookieName);
      if (legacyEcidCookieValue) {
        var reg = /(^|\|)MCMID\|(\d+)($|\|)/;
        var matches = legacyEcidCookieValue.match(reg);
        if (matches) {
          // Destructuring arrays breaks in IE
          ecid = matches[2];
        }
      }
      return ecid;
    };
    return {
      getEcid: function getEcid() {
        if (idMigrationEnabled) {
          var ecid = getEcidFromLegacyCookies();
          if (ecid) {
            return Promise.resolve(ecid);
          }
          return getEcidFromVisitor();
        }
        return Promise.resolve();
      },
      setEcid: function setEcid(ecid) {
        if (idMigrationEnabled && getEcidFromLegacyCookies() !== ecid) {
          var extraOptions = isPageSsl ? {
            sameSite: "none",
            secure: true
          } : {};
          cookieJar.set(amcvCookieName, "MCMID|" + ecid, _objectSpread2({
            domain: apexDomain,
            // Without `expires` this will be a session cookie.
            expires: 390
          }, extraOptions));
        }
      }
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var awaitVisitorOptIn = (function (_ref) {
    var logger = _ref.logger;
    return new Promise(function (resolve, reject) {
      if (isObject(window.adobe) && isObject(window.adobe.optIn)) {
        var optInOld = window.adobe.optIn;
        logger.info("Delaying request while waiting for legacy opt-in to let Visitor retrieve ECID from server.");
        optInOld.fetchPermissions(function () {
          if (optInOld.isApproved([optInOld.Categories.ECID])) {
            logger.info("Received legacy opt-in approval to let Visitor retrieve ECID from server.");
            resolve();
          } else {
            reject(new Error("Legacy opt-in was declined."));
          }
        }, true);
      } else {
        resolve();
      }
    });
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var getVisitor = (function (window) {
    var Visitor = window.Visitor;
    return isFunction(Visitor) && isFunction(Visitor.getInstance) && Visitor;
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectGetEcidFromVisitor = (function (_ref) {
    var logger = _ref.logger,
      orgId = _ref.orgId,
      awaitVisitorOptIn = _ref.awaitVisitorOptIn;
    return function () {
      var Visitor = getVisitor(window);
      if (Visitor) {
        // Need to explicitly wait for optIn because visitor will call callback
        // with invalid values prior to optIn being approved
        return awaitVisitorOptIn({
          logger: logger
        }).then(function () {
          logger.info("Delaying request while using Visitor to retrieve ECID from server.");
          return new Promise(function (resolve) {
            var visitor = Visitor.getInstance(orgId, {});
            visitor.getMarketingCloudVisitorID(function (ecid) {
              logger.info("Resuming previously delayed request that was waiting for ECID from Visitor.");
              resolve(ecid);
            }, true);
          });
        }).catch(function (error) {
          // If consent was denied, get the ECID from experience edge. OptIn and AEP Web SDK
          // consent should operate independently, but during id migration AEP Web SDK needs
          // to wait for optIn object consent resolution so that only one ECID is generated.
          if (error) {
            logger.info(error.message + ", retrieving ECID from experience edge");
          } else {
            logger.info("An error occurred while obtaining the ECID from Visitor.");
          }
        });
      }
      return Promise.resolve();
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var injectHandleResponseForIdSyncs = (function (_ref) {
    var processIdSyncs = _ref.processIdSyncs;
    return function (response) {
      return processIdSyncs(response.getPayloadsByType("identity:exchange"));
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // TO-DOCUMENT: We queue subsequent requests until we have an identity cookie.
  var injectEnsureSingleIdentity = (function (_ref) {
    var doesIdentityCookieExist = _ref.doesIdentityCookieExist,
      setDomainForInitialIdentityPayload = _ref.setDomainForInitialIdentityPayload,
      addLegacyEcidToPayload = _ref.addLegacyEcidToPayload,
      awaitIdentityCookie = _ref.awaitIdentityCookie,
      logger = _ref.logger;
    var obtainedIdentityPromise;
    var allowRequestToGoWithoutIdentity = function allowRequestToGoWithoutIdentity(request) {
      setDomainForInitialIdentityPayload(request);
      return addLegacyEcidToPayload(request.getPayload());
    };

    /**
     * Ensures that if no identity cookie exists, we only let one request at a
     * time without an identity until its response returns. In the meantime,
     * we queue all other requests, otherwise the requests could result in
     * multiple ECIDs being minted for the user. Once we get an identity
     * cookie, we can let the queued requests be sent all at once, since they
     * will have the newly minted ECID.
     *
     * Konductor should make every effort to return an identity, but in
     * certain scenarios it may not. For example, in cases where the
     * request does not match what Konductor is expecting (ie 400s).
     * In cases where Konductor does not set an identity, there should be
     * no events recorded so we don't need to worry about multiple ECIDs
     * being minted for each user.
     *
     * The reason we allow for multiple sequential requests to be sent without
     * an identity is to prevent a single malformed request causing all other
     * requests to never send.
     */
    return function (_ref2) {
      var request = _ref2.request,
        onResponse = _ref2.onResponse,
        onRequestFailure = _ref2.onRequestFailure;
      if (doesIdentityCookieExist()) {
        request.setIsIdentityEstablished();
        return Promise.resolve();
      }
      if (obtainedIdentityPromise) {
        // We don't have an identity cookie, but at least one request has
        // been sent to get it. Konductor may set the identity cookie in the
        // response. We will hold up this request until the previous request
        // returns and awaitIdentityCookie confirms the identity was set.
        logger.info("Delaying request while retrieving ECID from server.");
        var previousObtainedIdentityPromise = obtainedIdentityPromise;

        // This promise resolves when we have an identity cookie. Additional
        // requests are chained together so that only one is sent at a time
        // until we have the identity cookie.
        obtainedIdentityPromise = previousObtainedIdentityPromise.catch(function () {
          return awaitIdentityCookie({
            onResponse: onResponse,
            onRequestFailure: onRequestFailure
          });
        });

        // When this returned promise resolves, the request will go out.
        return previousObtainedIdentityPromise.then(function () {
          logger.info("Resuming previously delayed request.");
          request.setIsIdentityEstablished();
        })
        // If Konductor did not set the identity cookie on the previous
        // request, then awaitIdentityCookie will reject its promise.
        // Catch the rejection here and allow this request to go out.
        .catch(function () {
          return allowRequestToGoWithoutIdentity(request);
        });
      }

      // For Alloy+Konductor communication to be as robust as possible and
      // to ensure we don't mint new ECIDs for requests that would otherwise
      // be sent in parallel, we'll let this request go out to fetch the
      // cookie
      obtainedIdentityPromise = awaitIdentityCookie({
        onResponse: onResponse,
        onRequestFailure: onRequestFailure
      });
      // This prevents an un-caught promise in the console when the identity isn't set.
      obtainedIdentityPromise.catch(function () {
        return undefined;
      });
      return allowRequestToGoWithoutIdentity(request);
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var ecidNamespace = "ECID";

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var addEcidQueryToPayload = (function (payload) {
    payload.mergeQuery({
      identity: {
        fetch: [ecidNamespace]
      }
    });
  });

  var matchUserAgent = function matchUserAgent(regexs) {
    return function (userAgent) {
      var keys = Object.keys(regexs);
      for (var i = 0; i < keys.length; i += 1) {
        var key = keys[i];
        var regex = regexs[key];
        if (regex.test(userAgent)) {
          return key;
        }
      }
      return UNKNOWN;
    };
  };
  var getBrowser = memoize(function (window) {
    var _matchUserAgent;
    return matchUserAgent((_matchUserAgent = {}, _defineProperty(_matchUserAgent, EDGE$1, /Edge\/([0-9\._]+)/), _defineProperty(_matchUserAgent, EDGE_CHROMIUM, /Edg\/([0-9\.]+)/), _defineProperty(_matchUserAgent, CHROME, /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/), _defineProperty(_matchUserAgent, FIREFOX, /Firefox\/([0-9\.]+)(?:\s|$)/), _defineProperty(_matchUserAgent, IE, /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/), _defineProperty(_matchUserAgent, SAFARI, /Version\/([0-9\._]+).*Safari/), _matchUserAgent))(window.navigator.userAgent);
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectSetDomainForInitialIdentityPayload = (function (_ref) {
    var thirdPartyCookiesEnabled = _ref.thirdPartyCookiesEnabled,
      areThirdPartyCookiesSupportedByDefault = _ref.areThirdPartyCookiesSupportedByDefault;
    return function (request) {
      if (thirdPartyCookiesEnabled && areThirdPartyCookiesSupportedByDefault(getBrowser(window))) {
        // If third-party cookies are enabled by the customer and
        // supported by the browser, we will send the request to a
        // a third-party identification domain that allows for more accurate
        // identification of the user through use of a third-party cookie.
        // If we have an identity to migrate, we still want to hit the
        // third-party identification domain because the third-party identification
        // domain will use our ECID to set the third-party cookie if the third-party
        // cookie isn't already set, which provides for better cross-domain
        // identification for future requests.
        request.setUseIdThirdPartyDomain();
      }
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectAddLegacyEcidToPayload = (function (_ref) {
    var getLegacyEcid = _ref.getLegacyEcid,
      addEcidToPayload = _ref.addEcidToPayload;
    return function (payload) {
      if (payload.hasIdentity(ecidNamespace)) {
        // don't get the legacy identity if we already have the query string identity or if
        // the user specified it in the identity map
        return Promise.resolve();
      }
      return getLegacyEcid().then(function (ecidToMigrate) {
        if (ecidToMigrate) {
          addEcidToPayload(payload, ecidToMigrate);
        }
      });
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var queryStringIdentityParam = "adobe_mc";

  var LINK_TTL_SECONDS = 300; // 5 minute link time to live

  var injectAddQueryStringIdentityToPayload = (function (_ref) {
    var locationSearch = _ref.locationSearch,
      dateProvider = _ref.dateProvider,
      orgId = _ref.orgId,
      logger = _ref.logger;
    return function (payload) {
      if (payload.hasIdentity(ecidNamespace)) {
        // don't overwrite a user provided ecid identity
        return;
      }
      var parsedQueryString = reactorQueryString.parse(locationSearch);
      var queryStringValue = parsedQueryString[queryStringIdentityParam];
      if (queryStringValue === undefined) {
        return;
      }
      if (Array.isArray(queryStringValue)) {
        logger.warn("Found multiple adobe_mc query string paramters, only using the last one.");
        queryStringValue = queryStringValue[queryStringValue.length - 1];
      }
      var properties = queryStringValue.split("|").reduce(function (memo, keyValue) {
        var _keyValue$split = keyValue.split("="),
          _keyValue$split2 = _slicedToArray(_keyValue$split, 2),
          key = _keyValue$split2[0],
          value = _keyValue$split2[1];
        memo[key] = value;
        return memo;
      }, {});
      // We are using MCMID and MCORGID to be compatible with Visitor.
      var ts = parseInt(properties.TS, 10);
      var mcmid = properties.MCMID;
      var mcorgid = decodeURIComponent(properties.MCORGID);
      if (
      // When TS is not specified or not a number, the following inequality returns false.
      // All inequalities with NaN variables are false.
      dateProvider().getTime() / 1000 <= ts + LINK_TTL_SECONDS && mcorgid === orgId && mcmid) {
        logger.info("Found valid ECID identity " + mcmid + " from the adobe_mc query string parameter.");
        payload.addIdentity(ecidNamespace, {
          id: mcmid
        });
      } else {
        logger.info("Detected invalid or expired adobe_mc query string parameter.");
      }
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var addEcidToPayload = (function (payload, ecid) {
    payload.addIdentity(ecidNamespace, {
      id: ecid
    });
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var injectAwaitIdentityCookie = (function (_ref) {
    var doesIdentityCookieExist = _ref.doesIdentityCookieExist,
      orgId = _ref.orgId,
      logger = _ref.logger;
    /**
     * Returns a promise that will be resolved once an identity cookie exists.
     * If an identity cookie doesn't already exist, it should always exist after
     * the first response.
     */
    return function (_ref2) {
      var onResponse = _ref2.onResponse,
        onRequestFailure = _ref2.onRequestFailure;
      return new Promise(function (resolve, reject) {
        onResponse(function () {
          if (doesIdentityCookieExist()) {
            resolve();
          } else {
            // This logic assumes that the code setting the cookie is working as expected and that
            // the cookie was missing from the response.
            logger.warn("Identity cookie not found. This could be caused by any of the following issues:\n" + ("\t* The org ID " + orgId + " configured in Alloy doesn't match the org ID specified in the edge configuration.\n") + "\t* Experience edge was not able to set the identity cookie due to domain or cookie restrictions.\n" + "\t* The request was canceled by the browser and not fully processed.");

            // Rejecting the promise will tell queued events to still go out
            // one at a time.
            reject(new Error("Identity cookie not found."));
          }
        });
        onRequestFailure(function () {
          if (doesIdentityCookieExist()) {
            resolve();
          } else {
            // The error from the request failure will be logged separately. Rejecting this here
            // will tell ensureSingleIdentity to send the next request without identity
            reject(new Error("Identity cookie not found."));
          }
        });
      });
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var getEcidFromResponse = (function (response) {
    var identityResultPayloads = response.getPayloadsByType("identity:result");
    var ecidPayload = find(identityResultPayloads, function (payload) {
      return payload.namespace && payload.namespace.code === ecidNamespace;
    });
    return ecidPayload ? ecidPayload.id : undefined;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createAddIdentity = (function (content) {
    return function (namespaceCode, identity) {
      content.xdm = content.xdm || {};
      content.xdm.identityMap = content.xdm.identityMap || {};
      content.xdm.identityMap[namespaceCode] = content.xdm.identityMap[namespaceCode] || [];
      content.xdm.identityMap[namespaceCode].push(identity);
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // This provides the base functionality that all types of requests share.
  var createRequest = (function (options) {
    var payload = options.payload,
      _getAction = options.getAction,
      _getUseSendBeacon = options.getUseSendBeacon,
      datastreamIdOverride = options.datastreamIdOverride;
    var id = v4_1();
    var shouldUseThirdPartyDomain = false;
    var isIdentityEstablished = false;
    return {
      getId: function getId() {
        return id;
      },
      getPayload: function getPayload() {
        return payload;
      },
      getAction: function getAction() {
        return _getAction({
          isIdentityEstablished: isIdentityEstablished
        });
      },
      getDatastreamIdOverride: function getDatastreamIdOverride() {
        return datastreamIdOverride;
      },
      getUseSendBeacon: function getUseSendBeacon() {
        return _getUseSendBeacon({
          isIdentityEstablished: isIdentityEstablished
        });
      },
      getUseIdThirdPartyDomain: function getUseIdThirdPartyDomain() {
        return shouldUseThirdPartyDomain;
      },
      setUseIdThirdPartyDomain: function setUseIdThirdPartyDomain() {
        shouldUseThirdPartyDomain = true;
      },
      setIsIdentityEstablished: function setIsIdentityEstablished() {
        isIdentityEstablished = true;
      }
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createDataCollectionRequest = (function (_ref) {
    var dataCollectionRequestPayload = _ref.payload,
      datastreamIdOverride = _ref.datastreamIdOverride;
    var getUseSendBeacon = function getUseSendBeacon(_ref2) {
      var isIdentityEstablished = _ref2.isIdentityEstablished;
      // When the document may be unloading, we still hit the interact endpoint
      // using fetch if an identity has not been established. If we were instead
      // to hit the collect endpoint using sendBeacon in this case, one of three
      // things would occur:
      //
      // 1. The document ultimately isn't unloaded and Alloy receives an empty
      // response back from the collect endpoint, resulting in an error being
      // thrown by Alloy because we weren't able to establish an identity.
      // This is bad.
      // 2. The document is unloaded, but Alloy receives the empty
      // response back from the collect endpoint before navigation is completed,
      // resulting in an error being thrown by Alloy because we weren't able to
      // establish an identity. This is bad.
      // 3. The document is unloaded and Alloy does not receive the empty response
      // back from the collect endpoint before navigation is completed. No error
      // will be thrown, but no identity was established either. This is okay,
      // though no identity was established.
      //
      // By hitting the interact endpoint using fetch, one of the three things
      // would occur:
      //
      // 1. The document ultimately isn't unloaded and Alloy receives a
      // response with an identity back from the interact endpoint. No
      // error will be thrown and an identity is established. This is good.
      // 2. The document is unloaded and Alloy receives a response with an
      // identity back from the interact endpoint before navigation is completed.
      // No error will be thrown and an identity is established. This is good.
      // 3. The document is unloaded and Alloy does not receive the empty response
      // back from the collect endpoint before navigation is completed. In this
      // case, no error is thrown, but no identity was established and it's
      // more likely that the request never makes it to the server because we're
      // using fetch instead of sendBeacon.
      //
      // The second approach seemed preferable.
      return dataCollectionRequestPayload.getDocumentMayUnload() && isIdentityEstablished;
    };
    return createRequest({
      payload: dataCollectionRequestPayload,
      getAction: function getAction(_ref3) {
        var isIdentityEstablished = _ref3.isIdentityEstablished;
        return getUseSendBeacon({
          isIdentityEstablished: isIdentityEstablished
        }) ? "collect" : "interact";
      },
      getUseSendBeacon: getUseSendBeacon,
      datastreamIdOverride: datastreamIdOverride
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // This provides the base functionality that all types of
  // request payloads share.
  var createRequestPayload = (function (options) {
    var content = options.content,
      addIdentity = options.addIdentity,
      hasIdentity = options.hasIdentity;
    var _mergeConfigOverride = createMerger(content, "meta.configOverrides");
    return {
      mergeMeta: createMerger(content, "meta"),
      mergeState: createMerger(content, "meta.state"),
      mergeQuery: createMerger(content, "query"),
      mergeConfigOverride: function mergeConfigOverride(updates) {
        return _mergeConfigOverride(prepareConfigOverridesForEdge(updates));
      },
      addIdentity: addIdentity,
      hasIdentity: hasIdentity,
      toJSON: function toJSON() {
        return content;
      }
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createHasIdentity = (function (content) {
    return function (namespaceCode) {
      return (content.xdm && content.xdm.identityMap && content.xdm.identityMap[namespaceCode]) !== undefined;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createDataCollectionRequestPayload = (function () {
    var content = {};
    var payload = createRequestPayload({
      content: content,
      addIdentity: createAddIdentity(content),
      hasIdentity: createHasIdentity(content)
    });
    payload.addEvent = function (event) {
      content.events = content.events || [];
      content.events.push(event);
    };
    payload.getDocumentMayUnload = function () {
      return (content.events || []).some(function (event) {
        return event.getDocumentMayUnload();
      });
    };
    return payload;
  });

  var _excluded$4 = ["datastreamId"];
  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  /**
   * @typedef {{ datastreamId: string, [k: string]: Object }} Override
   * @typedef {Object} RequestPayload
   * @property {function(Override): void} mergeConfigOverride
   * @param {Object} params
   * @param {Override} params.localConfigOverrides
   * @param {Override} params.globalConfigOverrides
   * @param {RequestPayload} params.payload
   * @returns {{ payload: RequestPayload, datastreamIdOverride: string }}
   */
  var createRequestParams = (function (_ref) {
    var localConfigOverrides = _ref.localConfigOverrides,
      globalConfigOverrides = _ref.globalConfigOverrides,
      payload = _ref.payload;
    var requestParams = {
      payload: payload
    };
    var _ref2 = localConfigOverrides || {},
      datastreamId = _ref2.datastreamId,
      localConfigOverridesWithoutDatastreamId = _objectWithoutProperties(_ref2, _excluded$4);
    if (datastreamId) {
      requestParams.datastreamIdOverride = datastreamId;
    }
    payload.mergeConfigOverride(globalConfigOverrides);
    payload.mergeConfigOverride(localConfigOverridesWithoutDatastreamId);
    return requestParams;
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var ASSURANCE_VALIDATION_SESSION_URL_PARAM = "adb_validation_sessionid";
  var ASSURANCE_VALIDATION_NAMESPACE = "validation.";
  var CLIENT_ID = "clientId";
  var getOrCreateAssuranceClientId = function getOrCreateAssuranceClientId(storage) {
    var clientId = storage.persistent.getItem(CLIENT_ID);
    if (!clientId) {
      clientId = v4_1();
      storage.persistent.setItem(CLIENT_ID, clientId);
    }
    return clientId;
  };
  var createGetAssuranceValidationTokenParams = (function (_ref) {
    var window = _ref.window,
      createNamespacedStorage = _ref.createNamespacedStorage;
    var storage = createNamespacedStorage(ASSURANCE_VALIDATION_NAMESPACE);
    return function () {
      var parsedQuery = reactorQueryString.parse(window.location.search);
      var validationSessionId = parsedQuery[ASSURANCE_VALIDATION_SESSION_URL_PARAM];
      if (!validationSessionId) {
        return "";
      }
      var clientId = getOrCreateAssuranceClientId(storage);
      var validationToken = validationSessionId + "|" + clientId;
      return "&" + reactorQueryString.stringify({
        adobeAepValidationToken: validationToken
      });
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createGetIdentity = (function (_ref) {
    var sendEdgeNetworkRequest = _ref.sendEdgeNetworkRequest,
      createIdentityRequestPayload = _ref.createIdentityRequestPayload,
      createIdentityRequest = _ref.createIdentityRequest,
      globalConfigOverrides = _ref.globalConfigOverrides;
    return function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        namespaces = _ref2.namespaces,
        localConfigOverrides = _ref2.edgeConfigOverrides;
      var requestParams = createRequestParams({
        payload: createIdentityRequestPayload(namespaces),
        globalConfigOverrides: globalConfigOverrides,
        localConfigOverrides: localConfigOverrides
      });
      var request = createIdentityRequest(requestParams);
      return sendEdgeNetworkRequest({
        request: request
      });
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createIdentityRequest = (function (_ref) {
    var payload = _ref.payload,
      datastreamIdOverride = _ref.datastreamIdOverride;
    return createRequest({
      payload: payload,
      datastreamIdOverride: datastreamIdOverride,
      getAction: function getAction() {
        return "identity/acquire";
      },
      getUseSendBeacon: function getUseSendBeacon() {
        return false;
      }
    });
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createIdentityRequestPayload = (function (namespaces) {
    var content = {
      query: {
        identity: {
          fetch: namespaces
        }
      }
    };
    return createRequestPayload({
      content: content,
      addIdentity: createAddIdentity(content),
      hasIdentity: createHasIdentity(content)
    });
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var URL_REGEX = /^([^?#]*)(\??[^#]*)(#?.*)$/;
  var getSeparator = function getSeparator(queryString) {
    if (queryString === "") {
      return "?";
    }
    if (queryString === "?") {
      return "";
    }
    return "&";
  };
  var injectAppendIdentityToUrl = (function (_ref) {
    var dateProvider = _ref.dateProvider,
      orgId = _ref.orgId;
    return function (ecid, url) {
      var ts = Math.round(dateProvider().getTime() / 1000);
      var adobemc = encodeURIComponent("TS=" + ts + "|MCMID=" + ecid + "|MCORGID=" + encodeURIComponent(orgId));
      var _url$match = url.match(URL_REGEX),
        _url$match2 = _slicedToArray(_url$match, 4),
        location = _url$match2[1],
        queryString = _url$match2[2],
        fragment = _url$match2[3];
      var separator = getSeparator(queryString);
      return "" + location + queryString + separator + "adobe_mc=" + adobemc + fragment;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createIdentity = function createIdentity(_ref) {
    var config = _ref.config,
      logger = _ref.logger,
      consent = _ref.consent,
      fireReferrerHideableImage = _ref.fireReferrerHideableImage,
      sendEdgeNetworkRequest = _ref.sendEdgeNetworkRequest,
      apexDomain = _ref.apexDomain;
    var orgId = config.orgId,
      thirdPartyCookiesEnabled = config.thirdPartyCookiesEnabled,
      globalConfigOverrides = config.edgeConfigOverrides;
    var getEcidFromVisitor = injectGetEcidFromVisitor({
      logger: logger,
      orgId: orgId,
      awaitVisitorOptIn: awaitVisitorOptIn
    });
    var loggingCookieJar = createLoggingCookieJar({
      logger: logger,
      cookieJar: cookieJar
    });
    var legacyIdentity = createLegacyIdentity({
      config: config,
      getEcidFromVisitor: getEcidFromVisitor,
      apexDomain: apexDomain,
      cookieJar: loggingCookieJar,
      isPageSsl: window.location.protocol === "https:"
    });
    var doesIdentityCookieExist = injectDoesIdentityCookieExist({
      orgId: orgId
    });
    var getIdentity = createGetIdentity({
      sendEdgeNetworkRequest: sendEdgeNetworkRequest,
      createIdentityRequestPayload: createIdentityRequestPayload,
      createIdentityRequest: createIdentityRequest,
      globalConfigOverrides: globalConfigOverrides
    });
    var setDomainForInitialIdentityPayload = injectSetDomainForInitialIdentityPayload({
      thirdPartyCookiesEnabled: thirdPartyCookiesEnabled,
      areThirdPartyCookiesSupportedByDefault: areThirdPartyCookiesSupportedByDefault
    });
    var addLegacyEcidToPayload = injectAddLegacyEcidToPayload({
      getLegacyEcid: legacyIdentity.getEcid,
      addEcidToPayload: addEcidToPayload
    });
    var addQueryStringIdentityToPayload = injectAddQueryStringIdentityToPayload({
      locationSearch: window.document.location.search,
      dateProvider: function dateProvider() {
        return new Date();
      },
      orgId: orgId,
      logger: logger
    });
    var awaitIdentityCookie = injectAwaitIdentityCookie({
      doesIdentityCookieExist: doesIdentityCookieExist,
      orgId: orgId,
      logger: logger
    });
    var ensureSingleIdentity = injectEnsureSingleIdentity({
      doesIdentityCookieExist: doesIdentityCookieExist,
      setDomainForInitialIdentityPayload: setDomainForInitialIdentityPayload,
      addLegacyEcidToPayload: addLegacyEcidToPayload,
      awaitIdentityCookie: awaitIdentityCookie,
      logger: logger
    });
    var processIdSyncs = injectProcessIdSyncs({
      fireReferrerHideableImage: fireReferrerHideableImage,
      logger: logger
    });
    var handleResponseForIdSyncs = injectHandleResponseForIdSyncs({
      processIdSyncs: processIdSyncs
    });
    var appendIdentityToUrl = injectAppendIdentityToUrl({
      dateProvider: function dateProvider() {
        return new Date();
      },
      orgId: orgId,
      globalConfigOverrides: globalConfigOverrides
    });
    return createComponent$4({
      addEcidQueryToPayload: addEcidQueryToPayload,
      addQueryStringIdentityToPayload: addQueryStringIdentityToPayload,
      ensureSingleIdentity: ensureSingleIdentity,
      setLegacyEcid: legacyIdentity.setEcid,
      handleResponseForIdSyncs: handleResponseForIdSyncs,
      getEcidFromResponse: getEcidFromResponse,
      getIdentity: getIdentity,
      consent: consent,
      appendIdentityToUrl: appendIdentityToUrl,
      logger: logger,
      config: config
    });
  };
  createIdentity.namespace = "Identity";
  createIdentity.configValidators = configValidators;

  var createResultLogMessage = function createResultLogMessage(urlDestination, success) {
    return "URL destination " + (success ? "succeeded" : "failed") + ": " + urlDestination.spec.url;
  };
  var injectProcessDestinations = (function (_ref) {
    var fireReferrerHideableImage = _ref.fireReferrerHideableImage,
      logger = _ref.logger,
      cookieJar = _ref.cookieJar,
      isPageSsl = _ref.isPageSsl;
    var extraCookieOptions = isPageSsl ? {
      sameSite: "none",
      secure: true
    } : {};
    var processCookies = function processCookies(destinations) {
      var cookieDestinations = destinations.filter(function (dest) {
        return dest.type === "cookie";
      });
      cookieDestinations.forEach(function (dest) {
        var _dest$spec = dest.spec,
          name = _dest$spec.name,
          value = _dest$spec.value,
          domain = _dest$spec.domain,
          ttlDays = _dest$spec.ttlDays;
        cookieJar.set(name, value || "", _objectSpread2({
          domain: domain || "",
          expires: ttlDays || 10
        }, extraCookieOptions));
      });
    };
    var processUrls = function processUrls(destinations) {
      var urlDestinations = destinations.filter(function (dest) {
        return dest.type === "url";
      });
      return Promise.all(urlDestinations.map(function (urlDestination) {
        return fireReferrerHideableImage(urlDestination.spec).then(function () {
          logger.info(createResultLogMessage(urlDestination, true));
        }).catch(function () {
          // We intentionally do not throw an error if destinations fail. We
          // consider it a non-critical failure and therefore do not want it to
          // reject the promise handed back to the customer.
        });
      })).then(noop$1);
    };
    return function (destinations) {
      processCookies(destinations);
      return processUrls(destinations);
    };
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var injectProcessResponse = (function (_ref) {
    var processDestinations = _ref.processDestinations;
    var processPushDestinations = function processPushDestinations(_ref2) {
      var response = _ref2.response;
      var destinations = response.getPayloadsByType("activation:push");
      return processDestinations(destinations);
    };
    var retrievePullDestinations = function retrievePullDestinations(_ref3) {
      var response = _ref3.response;
      return {
        destinations: response.getPayloadsByType("activation:pull")
      };
    };
    return function (_ref4) {
      var response = _ref4.response;
      return processPushDestinations({
        response: response
      }).then(function () {
        return retrievePullDestinations({
          response: response
        });
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createAudiences = function createAudiences(_ref) {
    var logger = _ref.logger,
      fireReferrerHideableImage = _ref.fireReferrerHideableImage;
    // we override the js-cookie converter to encode the cookie value similar on how it is in DIL (PDCL-10238)
    var cookieJarWithEncoding = cookieJar.withConverter({
      write: function write(value) {
        return encodeURIComponent(value);
      }
    });
    var loggingCookieJar = createLoggingCookieJar({
      logger: logger,
      cookieJar: cookieJarWithEncoding
    });
    var processDestinations = injectProcessDestinations({
      fireReferrerHideableImage: fireReferrerHideableImage,
      logger: logger,
      cookieJar: loggingCookieJar,
      isPageSsl: window.location.protocol === "https:"
    });
    var processResponse = injectProcessResponse({
      processDestinations: processDestinations
    });
    return {
      lifecycle: {
        onResponse: processResponse
      },
      commands: {}
    };
  };
  createAudiences.namespace = "Audiences";

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var WEB = "web";
  var WEBAPP = "webapp";
  var SURFACE_TYPE_DELIMITER = "://";
  var FRAGMENT_DELIMITER = "#";

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var SURFACE_REGEX = /^(\w+):\/\/([^/#]+)(\/[^#]*)?(#.*)?$/;
  var AUTHORITY_REGEX = /^(?:.*@)?(?:[a-z\d\u00a1-\uffff.-]+|\[[a-f\d:]+])(?::\d+)?$/;
  var PATH_REGEX = /^\/(?:[/\w\u00a1-\uffff-.~]|%[a-fA-F\d]{2})*$/;
  var FRAGMENT_REGEX = /^#(?:[/\w\u00a1-\uffff-.~]|%[a-fA-F\d]{2})+$/;
  var normalizePath = function normalizePath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
    var end = path.length;
    while (end > 0 && "/".indexOf(path.charAt(end - 1)) !== -1) {
      end -= 1;
    }
    return path.substring(0, end) || "/";
  };
  var getSurfaceType = function getSurfaceType(surfaceTypeMatch) {
    return isNonEmptyString(surfaceTypeMatch) ? surfaceTypeMatch.toLowerCase() : "";
  };
  var getAuthority = function getAuthority(authorityMatch) {
    return isNonEmptyString(authorityMatch) ? authorityMatch.toLowerCase() : "";
  };
  var getPath = function getPath(pathMatch) {
    return isNonEmptyString(pathMatch) ? normalizePath(pathMatch) : "/";
  };
  var parseSurface = function parseSurface(surfaceString) {
    var matched = surfaceString.match(SURFACE_REGEX);
    return matched ? {
      surfaceType: getSurfaceType(matched[1]),
      authority: getAuthority(matched[2]),
      path: getPath(matched[3]),
      fragment: matched[4]
    } : null;
  };
  var stringifySurface = function stringifySurface(surface) {
    return "" + surface.surfaceType + SURFACE_TYPE_DELIMITER + surface.authority + (surface.path || "") + (surface.fragment || "");
  };
  var buildPageSurface = function buildPageSurface(getPageLocation) {
    var location = getPageLocation();
    var host = location.host.toLowerCase();
    var path = location.pathname;
    return WEB + SURFACE_TYPE_DELIMITER + host + normalizePath(path);
  };
  var expandFragmentSurface = function expandFragmentSurface(surface, getPageLocation) {
    return startsWith(surface, FRAGMENT_DELIMITER) ? buildPageSurface(getPageLocation) + surface : surface;
  };
  var validateSurface = function validateSurface(surface, getPageLocation, logger) {
    var invalidateSurface = function invalidateSurface(validationError) {
      logger.warn(validationError);
      return null;
    };
    if (!isNonEmptyString(surface)) {
      return invalidateSurface("Invalid surface: " + surface);
    }
    var expanded = expandFragmentSurface(surface, getPageLocation);
    var parsed = parseSurface(expanded);
    if (parsed === null) {
      return invalidateSurface("Invalid surface: " + surface);
    }
    if (!includes([WEB, WEBAPP], parsed.surfaceType)) {
      return invalidateSurface("Unsupported surface type " + parsed.surfaceType + " in surface: " + surface);
    }
    if (!parsed.authority || !AUTHORITY_REGEX.test(parsed.authority)) {
      return invalidateSurface("Invalid authority " + parsed.authority + " in surface: " + surface);
    }
    if (parsed.path && !PATH_REGEX.test(parsed.path)) {
      return invalidateSurface("Invalid path " + parsed.path + " in surface: " + surface);
    }
    if (parsed.fragment && !FRAGMENT_REGEX.test(parsed.fragment)) {
      return invalidateSurface("Invalid fragment " + parsed.fragment + " in surface: " + surface);
    }
    return parsed;
  };
  var isPageWideSurface = function isPageWideSurface(scope) {
    return !!scope && scope.indexOf(WEB + SURFACE_TYPE_DELIMITER) === 0 && scope.indexOf(FRAGMENT_DELIMITER) === -1;
  };
  var normalizeSurfaces = function normalizeSurfaces() {
    var surfaces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var getPageLocation = arguments.length > 1 ? arguments[1] : undefined;
    var logger = arguments.length > 2 ? arguments[2] : undefined;
    return surfaces.map(function (surface) {
      return validateSurface(surface, getPageLocation, logger);
    }).filter(function (surface) {
      return !isNil(surface);
    }).map(stringifySurface);
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var PAGE_WIDE_SCOPE = "__view__";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var DEFAULT_CONTENT_ITEM = "https://ns.adobe.com/personalization/default-content-item";
  var DOM_ACTION = "https://ns.adobe.com/personalization/dom-action";
  var HTML_CONTENT_ITEM = "https://ns.adobe.com/personalization/html-content-item";
  var JSON_CONTENT_ITEM = "https://ns.adobe.com/personalization/json-content-item";
  var RULESET_ITEM = "https://ns.adobe.com/personalization/ruleset-item";
  var REDIRECT_ITEM = "https://ns.adobe.com/personalization/redirect-item";
  var MESSAGE_IN_APP = "https://ns.adobe.com/personalization/message/in-app";
  var MESSAGE_FEED_ITEM = "https://ns.adobe.com/personalization/message/feed-item";

  var addPageWideScope = function addPageWideScope(scopes) {
    if (!includes(scopes, PAGE_WIDE_SCOPE)) {
      scopes.push(PAGE_WIDE_SCOPE);
    }
  };
  var addPageSurface = function addPageSurface(surfaces, getPageLocation) {
    var pageSurface = buildPageSurface(getPageLocation);
    if (!includes(surfaces, pageSurface)) {
      surfaces.push(pageSurface);
    }
  };
  var dedupe = function dedupe(array) {
    return array.filter(function (item, pos) {
      return array.indexOf(item) === pos;
    });
  };
  var createPersonalizationDetails = (function (_ref) {
    var getPageLocation = _ref.getPageLocation,
      renderDecisions = _ref.renderDecisions,
      decisionScopes = _ref.decisionScopes,
      personalization = _ref.personalization,
      event = _ref.event,
      _isCacheInitialized = _ref.isCacheInitialized,
      logger = _ref.logger;
    var viewName = event.getViewName();
    return {
      isRenderDecisions: function isRenderDecisions() {
        return renderDecisions;
      },
      isSendDisplayEvent: function isSendDisplayEvent() {
        return !!personalization.sendDisplayEvent;
      },
      shouldIncludeRenderedPropositions: function shouldIncludeRenderedPropositions() {
        return !!personalization.includeRenderedPropositions;
      },
      getViewName: function getViewName() {
        return viewName;
      },
      hasScopes: function hasScopes() {
        return decisionScopes.length > 0 || isNonEmptyArray(personalization.decisionScopes);
      },
      hasSurfaces: function hasSurfaces() {
        return isNonEmptyArray(personalization.surfaces);
      },
      hasViewName: function hasViewName() {
        return isNonEmptyString(viewName);
      },
      createQueryDetails: function createQueryDetails() {
        var scopes = _toConsumableArray(decisionScopes);
        if (isNonEmptyArray(personalization.decisionScopes)) {
          scopes.push.apply(scopes, _toConsumableArray(personalization.decisionScopes));
        }
        var eventSurfaces = normalizeSurfaces(personalization.surfaces, getPageLocation, logger);
        if (this.shouldRequestDefaultPersonalization()) {
          addPageWideScope(scopes);
          addPageSurface(eventSurfaces, getPageLocation);
        }
        var schemas = [DEFAULT_CONTENT_ITEM, HTML_CONTENT_ITEM, JSON_CONTENT_ITEM, REDIRECT_ITEM, RULESET_ITEM, MESSAGE_IN_APP, MESSAGE_FEED_ITEM];
        if (includes(scopes, PAGE_WIDE_SCOPE)) {
          schemas.push(DOM_ACTION);
        }
        return {
          schemas: schemas,
          decisionScopes: dedupe(scopes),
          surfaces: dedupe(eventSurfaces)
        };
      },
      isCacheInitialized: function isCacheInitialized() {
        return _isCacheInitialized;
      },
      shouldFetchData: function shouldFetchData() {
        return this.hasScopes() || this.hasSurfaces() || this.shouldRequestDefaultPersonalization();
      },
      shouldUseCachedData: function shouldUseCachedData() {
        return this.hasViewName() && !this.shouldFetchData();
      },
      shouldRequestDefaultPersonalization: function shouldRequestDefaultPersonalization() {
        return personalization.defaultPersonalizationEnabled || !this.isCacheInitialized() && personalization.defaultPersonalizationEnabled !== false;
      }
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var AUTHORING_ENABLED = "Rendering is disabled for authoring mode.";

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var DISPLAY = "decisioning.propositionDisplay";
  var INTERACT = "decisioning.propositionInteract";
  var TRIGGER = "decisioning.propositionTrigger";
  var DISMISS = "decisioning.propositionDismiss";
  var EVENT_TYPE_TRUE = 1;

  var _eventTypeToPropositi, _propositionEventType;
  var PropositionEventType = {
    DISPLAY: "display",
    INTERACT: "interact",
    TRIGGER: "trigger",
    DISMISS: "dismiss"
  };
  var eventTypeToPropositionEventTypeMapping = (_eventTypeToPropositi = {}, _defineProperty(_eventTypeToPropositi, DISPLAY, PropositionEventType.DISPLAY), _defineProperty(_eventTypeToPropositi, INTERACT, PropositionEventType.INTERACT), _defineProperty(_eventTypeToPropositi, TRIGGER, PropositionEventType.TRIGGER), _defineProperty(_eventTypeToPropositi, DISMISS, PropositionEventType.DISMISS), _eventTypeToPropositi);
  (_propositionEventType = {}, _defineProperty(_propositionEventType, PropositionEventType.DISPLAY, DISPLAY), _defineProperty(_propositionEventType, PropositionEventType.INTERACT, INTERACT), _defineProperty(_propositionEventType, PropositionEventType.TRIGGER, TRIGGER), _defineProperty(_propositionEventType, PropositionEventType.DISMISS, DISMISS), _propositionEventType);
  var getPropositionEventType = function getPropositionEventType(eventType) {
    return eventTypeToPropositionEventTypeMapping[eventType];
  };

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var EMPTY_PROPOSITIONS = {
    propositions: []
  };
  var validateApplyPropositionsOptions = (function (_ref) {
    var logger = _ref.logger,
      options = _ref.options;
    var applyPropositionsOptionsValidator = boundObjectOf({
      propositions: boundArrayOf(boundObjectOf(boundAnything())),
      metadata: boundObjectOf(boundAnything()),
      viewName: boundString()
    }).required();
    try {
      return applyPropositionsOptionsValidator(options);
    } catch (e) {
      logger.warn("Invalid options for applyPropositions. No propositions will be applied.", e);
      return EMPTY_PROPOSITIONS;
    }
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createComponent$3 = (function (_ref) {
    var getPageLocation = _ref.getPageLocation,
      logger = _ref.logger,
      fetchDataHandler = _ref.fetchDataHandler,
      viewChangeHandler = _ref.viewChangeHandler,
      onClickHandler = _ref.onClickHandler,
      isAuthoringModeEnabled = _ref.isAuthoringModeEnabled,
      mergeQuery = _ref.mergeQuery,
      viewCache = _ref.viewCache,
      showContainers = _ref.showContainers,
      applyPropositions = _ref.applyPropositions,
      setTargetMigration = _ref.setTargetMigration,
      mergeDecisionsMeta = _ref.mergeDecisionsMeta,
      renderedPropositions = _ref.renderedPropositions,
      onDecisionHandler = _ref.onDecisionHandler;
    return {
      lifecycle: {
        onDecision: onDecisionHandler,
        onBeforeRequest: function onBeforeRequest(_ref2) {
          var request = _ref2.request;
          setTargetMigration(request);
          return Promise.resolve();
        },
        onBeforeEvent: function onBeforeEvent(_ref3) {
          var event = _ref3.event,
            renderDecisions = _ref3.renderDecisions,
            _ref3$decisionScopes = _ref3.decisionScopes,
            decisionScopes = _ref3$decisionScopes === void 0 ? [] : _ref3$decisionScopes,
            _ref3$personalization = _ref3.personalization,
            personalization = _ref3$personalization === void 0 ? {} : _ref3$personalization,
            _ref3$onResponse = _ref3.onResponse,
            onResponse = _ref3$onResponse === void 0 ? noop$1 : _ref3$onResponse,
            _ref3$onRequestFailur = _ref3.onRequestFailure,
            onRequestFailure = _ref3$onRequestFailur === void 0 ? noop$1 : _ref3$onRequestFailur;
          // Include propositions on all responses, overridden with data as needed
          onResponse(function () {
            return {
              propositions: []
            };
          });
          onRequestFailure(function () {
            return showContainers();
          });
          if (isAuthoringModeEnabled()) {
            logger.warn(AUTHORING_ENABLED);

            // If we are in authoring mode we disable personalization
            mergeQuery(event, {
              enabled: false
            });
            return Promise.resolve();
          }
          var personalizationDetails = createPersonalizationDetails({
            getPageLocation: getPageLocation,
            renderDecisions: renderDecisions,
            decisionScopes: decisionScopes,
            personalization: personalization,
            event: event,
            isCacheInitialized: viewCache.isInitialized(),
            logger: logger
          });
          var decisionsMetaPromises = [];
          if (personalizationDetails.shouldIncludeRenderedPropositions()) {
            decisionsMetaPromises.push(renderedPropositions.clear());
          }
          if (personalizationDetails.shouldFetchData()) {
            var cacheUpdate = viewCache.createCacheUpdate(personalizationDetails.getViewName());
            onRequestFailure(function () {
              return cacheUpdate.cancel();
            });
            fetchDataHandler({
              cacheUpdate: cacheUpdate,
              personalizationDetails: personalizationDetails,
              event: event,
              onResponse: onResponse
            });
          } else if (personalizationDetails.shouldUseCachedData()) {
            // eslint-disable-next-line consistent-return
            decisionsMetaPromises.push(viewChangeHandler({
              personalizationDetails: personalizationDetails,
              event: event,
              onResponse: onResponse,
              onRequestFailure: onRequestFailure
            }));
          }

          // This promise.all waits for both the pending display notifications to be resolved
          // (i.e. the top of page call to finish rendering) and the view change handler to
          // finish rendering anything for this view.
          return Promise.all(decisionsMetaPromises).then(function (decisionsMetas) {
            // We only want to call mergeDecisionsMeta once, but we can get the propositions
            // from two places: the pending display notifications and the view change handler.
            var decisionsMeta = flatMap(decisionsMetas, function (dms) {
              return dms;
            });
            if (isNonEmptyArray(decisionsMeta)) {
              mergeDecisionsMeta(event, decisionsMeta, [PropositionEventType.DISPLAY]);
            }
          });
        },
        onClick: function onClick(_ref4) {
          var event = _ref4.event,
            clickedElement = _ref4.clickedElement;
          onClickHandler({
            event: event,
            clickedElement: clickedElement
          });
        }
      },
      commands: {
        applyPropositions: {
          optionsValidator: function optionsValidator(options) {
            return validateApplyPropositionsOptions({
              logger: logger,
              options: options
            });
          },
          run: applyPropositions
        }
      }
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createFragment = (function (content) {
    return createNode(DIV, {}, {
      innerHTML: content
    });
  });

  var css_escape = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
      // https://github.com/umdjs/umd/blob/master/returnExports.js
      {
        // For Node.js.
        module.exports = factory(root);
      }
    })(typeof commonjsGlobal != 'undefined' ? commonjsGlobal : commonjsGlobal, function (root) {
      if (root.CSS && root.CSS.escape) {
        return root.CSS.escape;
      }

      // https://drafts.csswg.org/cssom/#serialize-an-identifier
      var cssEscape = function cssEscape(value) {
        if (arguments.length == 0) {
          throw new TypeError('`CSS.escape` requires an argument.');
        }
        var string = String(value);
        var length = string.length;
        var index = -1;
        var codeUnit;
        var result = '';
        var firstCodeUnit = string.charCodeAt(0);
        while (++index < length) {
          codeUnit = string.charCodeAt(index);
          // Note: thereâ€™s no need to special-case astral symbols, surrogate
          // pairs, or lone surrogates.

          // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
          // (U+FFFD).
          if (codeUnit == 0x0000) {
            result += "\uFFFD";
            continue;
          }
          if (
          // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
          // U+007F, [â€¦]
          codeUnit >= 0x0001 && codeUnit <= 0x001F || codeUnit == 0x007F ||
          // If the character is the first character and is in the range [0-9]
          // (U+0030 to U+0039), [â€¦]
          index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
          // If the character is the second character and is in the range [0-9]
          // (U+0030 to U+0039) and the first character is a `-` (U+002D), [â€¦]

          index == 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit == 0x002D) {
            // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
            result += '\\' + codeUnit.toString(16) + ' ';
            continue;
          }
          if (
          // If the character is the first character and is a `-` (U+002D), and
          // there is no second character, [â€¦]
          index == 0 && length == 1 && codeUnit == 0x002D) {
            result += '\\' + string.charAt(index);
            continue;
          }

          // If the character is not handled by one of the above rules and is
          // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
          // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
          // U+005A), or [a-z] (U+0061 to U+007A), [â€¦]
          if (codeUnit >= 0x0080 || codeUnit == 0x002D || codeUnit == 0x005F || codeUnit >= 0x0030 && codeUnit <= 0x0039 || codeUnit >= 0x0041 && codeUnit <= 0x005A || codeUnit >= 0x0061 && codeUnit <= 0x007A) {
            // the character itself
            result += string.charAt(index);
            continue;
          }

          // Otherwise, the escaped character.
          // https://drafts.csswg.org/cssom/#escape-a-character
          result += '\\' + string.charAt(index);
        }
        return result;
      };
      if (!root.CSS) {
        root.CSS = {};
      }
      root.CSS.escape = cssEscape;
      return cssEscape;
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var EQ_START = ":eq(";
  var EQ_PATTERN = /:eq\((\d+)\)/g;
  var isNotEqSelector = function isNotEqSelector(str) {
    return str.indexOf(EQ_START) === -1;
  };
  var splitWithEq = function splitWithEq(selector) {
    return selector.split(EQ_PATTERN).filter(isNonEmptyString);
  };

  // Trying to match ID or CSS class
  var CSS_IDENTIFIER_PATTERN = /(#|\.)(-?\w+)/g;
  // Here we use CSS.escape() to make sure we get
  // correct values for ID and CSS class
  // Please check:  https://www.w3.org/TR/css-syntax-3/#escaping
  // CSS.escape() polyfill can be found here: https://github.com/mathiasbynens/CSS.escape
  var replaceIdentifier = function replaceIdentifier(_, $1, $2) {
    return "" + $1 + css_escape($2);
  };
  var escapeIdentifiersInSelector = function escapeIdentifiersInSelector(selector) {
    return selector.replace(CSS_IDENTIFIER_PATTERN, replaceIdentifier);
  };
  var parseSelector = function parseSelector(rawSelector) {
    var result = [];
    var selector = escapeIdentifiersInSelector(rawSelector.trim());
    var parts = splitWithEq(selector);
    var length = parts.length;
    var i = 0;
    while (i < length) {
      var sel = parts[i];
      var eq = parts[i + 1];
      if (eq) {
        result.push({
          sel: sel,
          eq: Number(eq)
        });
      } else {
        result.push({
          sel: sel
        });
      }
      i += 2;
    }
    return result;
  };

  /**
   * Returns an array of matched DOM nodes.
   * @param {String} selector that contains Sizzle "eq(...)" pseudo selector
   * @returns {Array} an array of DOM nodes
   */
  var selectNodesWithEq = function selectNodesWithEq(selector) {
    var doc = document;
    if (isNotEqSelector(selector)) {
      return selectNodes(selector, doc);
    }
    var parts = parseSelector(selector);
    var length = parts.length;
    var result = [];
    var context = doc;
    var i = 0;
    while (i < length) {
      var _parts$i = parts[i],
        sel = _parts$i.sel,
        eq = _parts$i.eq;
      var nodes = selectNodes(sel, context);
      var nodesCount = nodes.length;
      if (nodesCount === 0) {
        break;
      }
      if (eq != null && eq > nodesCount - 1) {
        break;
      }
      if (i < length - 1) {
        if (eq == null) {
          var _nodes = _slicedToArray(nodes, 1);
          context = _nodes[0];
        } else {
          context = nodes[eq];
        }
      }
      if (i === length - 1) {
        if (eq == null) {
          result = nodes;
        } else {
          result = [nodes[eq]];
        }
      }
      i += 1;
    }
    return result;
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns an array of matched DOM nodes.
   * @param {String} id
   * @param {Node} [context=document] defaults to document
   * @returns {HTMLElement} an element of null
   */
  var getElementById = (function (id) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return context.getElementById(id);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var setAttribute = (function (element, name, value) {
    element.setAttribute(name, value);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var getAttribute = (function (element, name) {
    return element.getAttribute(name);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var removeAttribute = (function (element, name) {
    element.removeAttribute(name);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var setStyle = (function (element, name, value, priority) {
    var css;
    if (priority) {
      css = name + ":" + value + " !" + priority + ";";
    } else {
      css = name + ":" + value + ";";
    }
    element.style.cssText += ";" + css;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var getParent = (function (element) {
    return element.parentNode;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var getNextSibling = (function (element) {
    return element.nextElementSibling;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var insertAfter = (function (container, element) {
    if (!container) {
      return;
    }
    var parent = getParent(container);
    if (parent) {
      parent.insertBefore(element, getNextSibling(container));
    }
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var insertBefore = (function (container, element) {
    if (!container) {
      return;
    }
    var parent = getParent(container);
    if (parent) {
      parent.insertBefore(element, container);
    }
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var getChildren = (function (element) {
    var children = element.children;
    if (children) {
      return toArray(children);
    }
    return [];
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var getChildNodes = (function (element) {
    var childNodes = element.childNodes;
    if (childNodes) {
      return toArray(childNodes);
    }
    return [];
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var getFirstChild = (function (element) {
    return element.firstElementChild;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var nonce;

  /**
   * Returns the nonce if available.
   * @param {Node} [context=document] defaults to document
   * @returns {(String|undefined)} the nonce or undefined if not available
   */
  var getNonce = (function () {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    if (nonce === undefined) {
      var n = context.querySelector("[nonce]");
      // NOTE: We're keeping n.getAttribute("nonce") until it is safe to remove:
      //   ref: https://github.com/whatwg/html/issues/2369#issuecomment-280853946
      nonce = n && (n.nonce || n.getAttribute("nonce"));
    }
    return nonce;
  });

  var PREHIDING_ID = "alloy-prehiding";
  var HIDING_STYLE_DEFINITION = "{ visibility: hidden }";

  // Using global is OK since we have a single DOM
  // so storing nodes even for multiple Alloy instances is fine
  var styleNodes = {};
  var hideElements = function hideElements(prehidingSelector) {
    // if we have different events with the same
    // prehiding selector we don't want to recreate
    // the style tag
    if (styleNodes[prehidingSelector]) {
      return;
    }
    var nonce = getNonce();
    var attrs = _objectSpread2({}, nonce && {
      nonce: nonce
    });
    var props = {
      textContent: prehidingSelector + " " + HIDING_STYLE_DEFINITION
    };
    var node = createNode(STYLE, attrs, props);
    appendNode(document.head, node);
    styleNodes[prehidingSelector] = node;
  };
  var showElements = function showElements(prehidingSelector) {
    var node = styleNodes[prehidingSelector];
    if (node) {
      removeNode(node);
      delete styleNodes[prehidingSelector];
    }
  };
  var hideContainers = function hideContainers(prehidingStyle) {
    if (!prehidingStyle) {
      return;
    }

    // If containers prehiding style has been added
    // by customer's prehiding snippet we don't
    // want to add the same node
    var node = getElementById(PREHIDING_ID);
    if (node) {
      return;
    }
    var nonce = getNonce();
    var attrs = _objectSpread2({
      id: PREHIDING_ID
    }, nonce && {
      nonce: nonce
    });
    var props = {
      textContent: prehidingStyle
    };
    var styleNode = createNode(STYLE, attrs, props);
    appendNode(document.head, styleNode);
  };
  var showContainers = function showContainers() {
    // If containers prehiding style exists
    // we will remove it
    var node = getElementById(PREHIDING_ID);
    if (!node) {
      return;
    }
    removeNode(node);
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var setText = (function (container, text) {
    container.textContent = text;
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var SRC = "src";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var isImage = function isImage(element) {
    return element.tagName === IMG;
  };
  var loadImage = function loadImage(url) {
    return createNode(IMG, {
      src: url
    });
  };
  var loadImages = function loadImages(fragment) {
    var images = selectNodes(IMG, fragment);
    images.forEach(function (image) {
      var url = getAttribute(image, SRC);
      if (url) {
        loadImage(url);
      }
    });
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var is$1 = function is(element, tagName) {
    return element.tagName === tagName;
  };
  var isInlineStyleElement = function isInlineStyleElement(element) {
    return is$1(element, STYLE) && !getAttribute(element, SRC);
  };
  var addNonceToInlineStyleElements = (function (fragment) {
    var styleNodes = selectNodes(STYLE, fragment);
    var length = styleNodes.length;
    var nonce = getNonce();
    if (!nonce) {
      return;
    }
    /* eslint-disable no-continue */
    for (var i = 0; i < length; i += 1) {
      var element = styleNodes[i];
      if (!isInlineStyleElement(element)) {
        continue;
      }
      element.nonce = nonce;
    }
  });

  /**
   * @this {Promise}
   */
  function finallyConstructor(callback) {
    var constructor = this.constructor;
    return this.then(function (value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function () {
        // @ts-ignore
        return constructor.reject(reason);
      });
    });
  }

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;
  function isArray(x) {
    return Boolean(x && typeof x.length !== 'undefined');
  }
  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  /**
   * @constructor
   * @param {Function} fn
   */
  function Promise$1(fn) {
    if (!(this instanceof Promise$1)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    /** @type {!number} */
    this._state = 0;
    /** @type {!boolean} */
    this._handled = false;
    /** @type {Promise|undefined} */
    this._value = undefined;
    /** @type {!Array<!Function>} */
    this._deferreds = [];
    doResolve(fn, this);
  }
  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise$1._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }
  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (_typeof(newValue) === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise$1) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }
  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }
  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise$1._immediateFn(function () {
        if (!self._handled) {
          Promise$1._unhandledRejectionFn(self._value);
        }
      });
    }
    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  /**
   * @constructor
   */
  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }
  Promise$1.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };
  Promise$1.prototype.then = function (onFulfilled, onRejected) {
    // @ts-ignore
    var prom = new this.constructor(noop);
    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };
  Promise$1.prototype['finally'] = finallyConstructor;
  Promise$1.all = function (arr) {
    return new Promise$1(function (resolve, reject) {
      if (!isArray(arr)) {
        return reject(new TypeError('Promise.all accepts an array'));
      }
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;
      function res(i, val) {
        try {
          if (val && (_typeof(val) === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }
      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };
  Promise$1.resolve = function (value) {
    if (value && _typeof(value) === 'object' && value.constructor === Promise$1) {
      return value;
    }
    return new Promise$1(function (resolve) {
      resolve(value);
    });
  };
  Promise$1.reject = function (value) {
    return new Promise$1(function (resolve, reject) {
      reject(value);
    });
  };
  Promise$1.race = function (arr) {
    return new Promise$1(function (resolve, reject) {
      if (!isArray(arr)) {
        return reject(new TypeError('Promise.race accepts an array'));
      }
      for (var i = 0, len = arr.length; i < len; i++) {
        Promise$1.resolve(arr[i]).then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise$1._immediateFn =
  // @ts-ignore
  typeof setImmediate === 'function' && function (fn) {
    // @ts-ignore
    setImmediate(fn);
  } || function (fn) {
    setTimeoutFunc(fn, 0);
  };
  Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  // For building Turbine we are using Rollup. For running the turbine tests we are using
  // Karma + Webpack. You need to specify the default import when using promise-polyfill`
  // with Webpack 2+. We need `require('promise-polyfill').default` for running the tests
  // and `require('promise-polyfill')` for building Turbine.
  var reactorPromise = typeof window !== 'undefined' && window.Promise || typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Promise || Promise$1.default || Promise$1;

  var getPromise = function getPromise(url, script) {
    return new reactorPromise(function (resolve, reject) {
      script.onload = function () {
        resolve(script);
      };
      script.onerror = function () {
        reject(new Error('Failed to load script ' + url));
      };
    });
  };
  var reactorLoadScript = function reactorLoadScript(url) {
    var script = document.createElement('script');
    script.src = url;
    script.async = true;
    var promise = getPromise(url, script);
    document.getElementsByTagName('head')[0].appendChild(script);
    return promise;
  };

  var is = function is(element, tagName) {
    return !!element && element.tagName === tagName;
  };
  var isInlineScript = function isInlineScript(element) {
    return is(element, SCRIPT) && !getAttribute(element, SRC);
  };
  var isRemoteScript = function isRemoteScript(element) {
    return is(element, SCRIPT) && getAttribute(element, SRC);
  };
  var getInlineScripts = function getInlineScripts(fragment) {
    var scripts = selectNodes(SCRIPT, fragment);
    var result = [];
    var length = scripts.length;
    var nonce = getNonce();
    var attributes = _objectSpread2({}, nonce && {
      nonce: nonce
    });

    /* eslint-disable no-continue */
    for (var i = 0; i < length; i += 1) {
      var element = scripts[i];
      if (!isInlineScript(element)) {
        continue;
      }
      var textContent = element.textContent;
      if (!textContent) {
        continue;
      }
      result.push(createNode(SCRIPT, attributes, {
        textContent: textContent
      }));
    }
    /* eslint-enable no-continue */

    return result;
  };
  var getRemoteScriptsUrls = function getRemoteScriptsUrls(fragment) {
    var scripts = selectNodes(SCRIPT, fragment);
    var result = [];
    var length = scripts.length;

    /* eslint-disable no-continue */
    for (var i = 0; i < length; i += 1) {
      var element = scripts[i];
      if (!isRemoteScript(element)) {
        continue;
      }
      var url = getAttribute(element, SRC);
      if (!url) {
        continue;
      }
      result.push(url);
    }
    /* eslint-enable no-continue */

    return result;
  };
  var executeInlineScripts = function executeInlineScripts(parent, scripts) {
    scripts.forEach(function (script) {
      parent.appendChild(script);
      parent.removeChild(script);
    });
  };
  var executeRemoteScripts = function executeRemoteScripts(urls) {
    return Promise.all(urls.map(reactorLoadScript));
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var appendHtml = (function (container, html) {
    var fragment = createFragment(html);
    addNonceToInlineStyleElements(fragment);
    var elements = getChildNodes(fragment);
    var scripts = getInlineScripts(fragment);
    var scriptsUrls = getRemoteScriptsUrls(fragment);
    loadImages(fragment);
    elements.forEach(function (element) {
      appendNode(container, element);
    });
    executeInlineScripts(container, scripts);
    return executeRemoteScripts(scriptsUrls);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var clear = function clear(container) {
    // We want to remove ALL nodes, text, comments etc
    var childNodes = getChildNodes(container);
    childNodes.forEach(removeNode);
  };
  var setHtml = (function (container, html) {
    clear(container);
    appendHtml(container, html);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var prependHtml = (function (container, html) {
    var fragment = createFragment(html);
    addNonceToInlineStyleElements(fragment);
    var elements = getChildNodes(fragment);
    var scripts = getInlineScripts(fragment);
    var scriptsUrls = getRemoteScriptsUrls(fragment);
    var length = elements.length;
    var i = length - 1;

    // We have to proactively load images to avoid flicker
    loadImages(fragment);

    // We are inserting elements in reverse order
    while (i >= 0) {
      var element = elements[i];
      var firstChild = getFirstChild(container);
      if (firstChild) {
        insertBefore(firstChild, element);
      } else {
        appendNode(container, element);
      }
      i -= 1;
    }
    executeInlineScripts(container, scripts);
    return executeRemoteScripts(scriptsUrls);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var insertHtmlBefore = (function (container, html) {
    var fragment = createFragment(html);
    addNonceToInlineStyleElements(fragment);
    var elements = getChildNodes(fragment);
    var scripts = getInlineScripts(fragment);
    var scriptsUrls = getRemoteScriptsUrls(fragment);
    loadImages(fragment);
    elements.forEach(function (element) {
      insertBefore(container, element);
    });
    executeInlineScripts(container, scripts);
    return executeRemoteScripts(scriptsUrls);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var replaceHtml = (function (container, html) {
    insertHtmlBefore(container, html);
    removeNode(container);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var insertHtmlAfter = (function (container, html) {
    var fragment = createFragment(html);
    addNonceToInlineStyleElements(fragment);
    var elements = getChildNodes(fragment);
    var scripts = getInlineScripts(fragment);
    var scriptsUrls = getRemoteScriptsUrls(fragment);
    loadImages(fragment);
    elements.forEach(function (element) {
      insertAfter(container, element);
    });
    executeInlineScripts(container, scripts);
    return executeRemoteScripts(scriptsUrls);
  });

  var _excluded$3 = ["priority"];
  var setStyles = (function (container, styles) {
    var priority = styles.priority,
      style = _objectWithoutProperties(styles, _excluded$3);
    Object.keys(style).forEach(function (key) {
      setStyle(container, key, style[key], priority);
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var setAttributes = (function (container, attributes) {
    Object.keys(attributes).forEach(function (key) {
      setAttribute(container, key, attributes[key]);
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var swapImage = (function (container, url) {
    if (!isImage(container)) {
      return;
    }

    // Start downloading the image
    loadImage(url);

    // Remove "src" so there is no flicker
    removeAttribute(container, SRC);

    // Replace the image "src"
    setAttribute(container, SRC, url);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var rearrangeChildren = (function (container, _ref) {
    var from = _ref.from,
      to = _ref.to;
    var children = getChildren(container);
    var elementFrom = children[from];
    var elementTo = children[to];
    if (!elementFrom || !elementTo) {
      // TODO: We will need to add logging
      // to ease troubleshooting
      return;
    }
    if (from < to) {
      insertAfter(elementTo, elementFrom);
    } else {
      insertBefore(elementTo, elementFrom);
    }
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var renderContent = function renderContent(elements, content, renderFunc) {
    var executions = elements.map(function (element) {
      return renderFunc(element, content);
    });
    return Promise.all(executions);
  };
  var createAction = function createAction(renderFunc) {
    return function (itemData) {
      var selector = itemData.selector,
        prehidingSelector = itemData.prehidingSelector,
        content = itemData.content;
      hideElements(prehidingSelector);
      return awaitSelector(selector, selectNodesWithEq).then(function (elements) {
        return renderContent(elements, content, renderFunc);
      }).then(function () {
        // if everything is OK, show elements
        showElements(prehidingSelector);
      }, function (error) {
        // in case of awaiting timing or error, we need to remove the style tag
        // hence showing the pre-hidden elements
        showElements(prehidingSelector);
        throw error;
      });
    };
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var initDomActionsModules = (function () {
    return {
      setHtml: createAction(setHtml),
      customCode: createAction(prependHtml),
      setText: createAction(setText),
      setAttribute: createAction(setAttributes),
      setImageSource: createAction(swapImage),
      setStyle: createAction(setStyles),
      move: createAction(setStyles),
      resize: createAction(setStyles),
      rearrange: createAction(rearrangeChildren),
      remove: createAction(removeNode),
      insertAfter: createAction(insertHtmlAfter),
      insertBefore: createAction(insertHtmlBefore),
      replaceHtml: createAction(replaceHtml),
      prependHtml: createAction(prependHtml),
      appendHtml: createAction(appendHtml)
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createCollect = (function (_ref) {
    var eventManager = _ref.eventManager,
      mergeDecisionsMeta = _ref.mergeDecisionsMeta;
    // Called when a decision is auto-rendered for the __view__ scope or a SPA view(display and empty display notification)
    return function (_ref2) {
      var _ref2$decisionsMeta = _ref2.decisionsMeta,
        decisionsMeta = _ref2$decisionsMeta === void 0 ? [] : _ref2$decisionsMeta,
        propositionAction = _ref2.propositionAction,
        _ref2$documentMayUnlo = _ref2.documentMayUnload,
        documentMayUnload = _ref2$documentMayUnlo === void 0 ? false : _ref2$documentMayUnlo,
        _ref2$eventType = _ref2.eventType,
        eventType = _ref2$eventType === void 0 ? DISPLAY : _ref2$eventType,
        _ref2$propositionEven = _ref2.propositionEventTypes,
        propositionEventTypes = _ref2$propositionEven === void 0 ? [getPropositionEventType(eventType)] : _ref2$propositionEven,
        viewName = _ref2.viewName;
      var event = eventManager.createEvent();
      var data = {
        eventType: eventType
      };
      if (viewName) {
        data.web = {
          webPageDetails: {
            viewName: viewName
          }
        };
      }
      if (isNonEmptyArray(decisionsMeta)) {
        mergeDecisionsMeta(event, decisionsMeta, propositionEventTypes, propositionAction);
      }
      event.mergeXdm(data);
      if (documentMayUnload) {
        event.documentMayUnload();
      }
      return eventManager.sendEvent(event);
    };
  });

  var DECISIONS_HANDLE = "personalization:decisions";
  var createFetchDataHandler = (function (_ref) {
    var prehidingStyle = _ref.prehidingStyle,
      showContainers = _ref.showContainers,
      hideContainers = _ref.hideContainers,
      mergeQuery = _ref.mergeQuery,
      processPropositions = _ref.processPropositions,
      createProposition = _ref.createProposition,
      notificationHandler = _ref.notificationHandler;
    return function (_ref2) {
      var cacheUpdate = _ref2.cacheUpdate,
        personalizationDetails = _ref2.personalizationDetails,
        event = _ref2.event,
        onResponse = _ref2.onResponse;
      if (personalizationDetails.isRenderDecisions()) {
        hideContainers(prehidingStyle);
      } else {
        showContainers();
      }
      mergeQuery(event, personalizationDetails.createQueryDetails());

      // This needs to be called before the response so that future sendEvent calls
      // can know to wait until this request is complete for pending display notifications.
      var handleNotifications = notificationHandler(personalizationDetails.isRenderDecisions(), personalizationDetails.isSendDisplayEvent(), personalizationDetails.getViewName());
      onResponse(function (_ref3) {
        var response = _ref3.response;
        var handles = response.getPayloadsByType(DECISIONS_HANDLE);
        var propositions = handles.map(function (handle) {
          return createProposition(handle);
        });
        var _groupBy = groupBy(propositions, function (p) {
            return p.getScopeType();
          }),
          _groupBy$page = _groupBy.page,
          pagePropositions = _groupBy$page === void 0 ? [] : _groupBy$page,
          _groupBy$view = _groupBy.view,
          viewPropositions = _groupBy$view === void 0 ? [] : _groupBy$view,
          _groupBy$proposition = _groupBy.proposition,
          nonRenderedPropositions = _groupBy$proposition === void 0 ? [] : _groupBy$proposition;
        var currentViewPropositions = cacheUpdate.update(viewPropositions);
        var render;
        var returnedPropositions;
        var returnedDecisions;
        if (personalizationDetails.isRenderDecisions()) {
          var _processPropositions = processPropositions([].concat(_toConsumableArray(pagePropositions), _toConsumableArray(currentViewPropositions)), nonRenderedPropositions);
          render = _processPropositions.render;
          returnedPropositions = _processPropositions.returnedPropositions;
          returnedDecisions = _processPropositions.returnedDecisions;
          render().then(handleNotifications);

          // Render could take a long time especially if one of the renders
          // is waiting for html to appear on the page. We show the containers
          // immediately, and whatever renders quickly will not have flicker.
          showContainers();
        } else {
          var _processPropositions2 = processPropositions([], [].concat(_toConsumableArray(pagePropositions), _toConsumableArray(currentViewPropositions), _toConsumableArray(nonRenderedPropositions)));
          returnedPropositions = _processPropositions2.returnedPropositions;
          returnedDecisions = _processPropositions2.returnedDecisions;
        }
        return {
          propositions: returnedPropositions,
          decisions: returnedDecisions
        };
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var matchesSelectorWithEq = (function (selector, element) {
    if (isNotEqSelector(selector)) {
      return matchesSelector(selector, element);
    }

    // Using node selection vs matches selector, because of :eq()
    // Find all nodes using document as context
    var nodes = selectNodesWithEq(selector);
    var result = false;

    // Iterate through all the identified elements
    // and reference compare with element
    for (var i = 0; i < nodes.length; i += 1) {
      if (nodes[i] === element) {
        result = true;
        break;
      }
    }
    return result;
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var VIEW_SCOPE_TYPE = "view";
  var PAGE_SCOPE_TYPE = "page";
  var PROPOSITION_SCOPE_TYPE = "proposition";

  var _excluded$2 = ["trackingLabel", "scopeType"];
  var getMetasIfMatches = function getMetasIfMatches(clickedElement, selector, getClickMetasBySelector) {
    var _document = document,
      documentElement = _document.documentElement;
    var element = clickedElement;
    var i = 0;
    while (element && element !== documentElement) {
      if (matchesSelectorWithEq(selector, element)) {
        var matchedMetas = getClickMetasBySelector(selector);
        var returnValue = {
          metas: matchedMetas
        };
        var foundMetaWithLabel = matchedMetas.find(function (meta) {
          return meta.trackingLabel;
        });
        if (foundMetaWithLabel) {
          returnValue.label = foundMetaWithLabel.trackingLabel;
          returnValue.weight = i;
        }
        var foundMetaWithScopeTypeView = matchedMetas.find(function (meta) {
          return meta.scopeType === VIEW_SCOPE_TYPE;
        });
        if (foundMetaWithScopeTypeView) {
          returnValue.viewName = foundMetaWithScopeTypeView.scope;
          returnValue.weight = i;
        }
        return returnValue;
      }
      element = element.parentNode;
      i += 1;
    }
    return {
      metas: null
    };
  };
  var cleanMetas = function cleanMetas(metas) {
    return metas.map(function (meta) {
      meta.trackingLabel;
        meta.scopeType;
        var rest = _objectWithoutProperties(meta, _excluded$2);
      return rest;
    });
  };
  var dedupMetas = function dedupMetas(metas) {
    return metas.filter(function (meta, index) {
      var stringifiedMeta = JSON.stringify(meta);
      return index === metas.findIndex(function (innerMeta) {
        return JSON.stringify(innerMeta) === stringifiedMeta;
      });
    });
  };
  var collectClicks = (function (clickedElement, selectors, getClickMetasBySelector) {
    var result = [];
    var resultLabel = "";
    var resultLabelWeight = Number.MAX_SAFE_INTEGER;
    var resultViewName;
    var resultViewNameWeight = Number.MAX_SAFE_INTEGER;

    /* eslint-disable no-continue */
    for (var i = 0; i < selectors.length; i += 1) {
      var _getMetasIfMatches = getMetasIfMatches(clickedElement, selectors[i], getClickMetasBySelector),
        metas = _getMetasIfMatches.metas,
        label = _getMetasIfMatches.label,
        weight = _getMetasIfMatches.weight,
        viewName = _getMetasIfMatches.viewName;
      if (!metas) {
        continue;
      }
      if (label && weight <= resultLabelWeight) {
        resultLabel = label;
        resultLabelWeight = weight;
      }
      if (viewName && weight <= resultViewNameWeight) {
        resultViewName = viewName;
        resultViewNameWeight = weight;
      }
      result.push.apply(result, _toConsumableArray(cleanMetas(metas)));
    }
    return {
      decisionsMeta: dedupMetas(result),
      eventLabel: resultLabel,
      viewName: resultViewName
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var isAuthoringModeEnabled = (function () {
    var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    return doc.location.href.indexOf("adobe_authoring_enabled") !== -1;
  });

  /* eslint-disable no-underscore-dangle */
  var mergeDecisionsMeta = function mergeDecisionsMeta(event, decisionsMeta, propositionEventTypes, propositionAction) {
    // Do not send a display notification with no decisions. Even empty view changes
    // should include a proposition.
    if (decisionsMeta.length === 0) {
      return;
    }
    var propositionEventType = {};
    propositionEventTypes.forEach(function (type) {
      propositionEventType[type] = EVENT_TYPE_TRUE;
    });
    var xdm = {
      _experience: {
        decisioning: {
          propositions: decisionsMeta,
          propositionEventType: propositionEventType
        }
      }
    };
    if (propositionAction) {
      xdm._experience.decisioning.propositionAction = propositionAction;
    }
    event.mergeXdm(xdm);
  };
  var mergeQuery = function mergeQuery(event, details) {
    event.mergeQuery({
      personalization: _objectSpread2({}, details)
    });
  };

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createOnClickHandler = (function (_ref) {
    var mergeDecisionsMeta = _ref.mergeDecisionsMeta,
      collectClicks = _ref.collectClicks,
      getClickSelectors = _ref.getClickSelectors,
      getClickMetasBySelector = _ref.getClickMetasBySelector;
    // Called when an element qualifying for conversion within an offer is clicked.
    return function (_ref2) {
      var event = _ref2.event,
        clickedElement = _ref2.clickedElement;
      var selectors = getClickSelectors();
      if (isNonEmptyArray(selectors)) {
        var _collectClicks = collectClicks(clickedElement, selectors, getClickMetasBySelector),
          decisionsMeta = _collectClicks.decisionsMeta,
          eventLabel = _collectClicks.eventLabel,
          viewName = _collectClicks.viewName;
        if (isNonEmptyArray(decisionsMeta)) {
          var xdm = {
            eventType: INTERACT
          };
          if (viewName) {
            xdm.web = {
              webPageDetails: {
                viewName: viewName
              }
            };
          }
          event.mergeXdm(xdm);
          mergeDecisionsMeta(event, decisionsMeta, [PropositionEventType.INTERACT], eventLabel ? {
            label: eventLabel
          } : undefined);
        }
      }
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createViewCacheManager = (function (_ref) {
    var createProposition = _ref.createProposition;
    var cacheUpdateCreatedAtLeastOnce = false;
    var viewStoragePromise = Promise.resolve({});
    var getViewPropositions = function getViewPropositions(viewStorage, viewName) {
      var viewPropositions = viewStorage[viewName.toLowerCase()];
      if (viewPropositions && viewPropositions.length > 0) {
        return viewPropositions;
      }
      var emptyViewProposition = createProposition({
        scope: viewName,
        scopeDetails: {
          characteristics: {
            scopeType: VIEW_SCOPE_TYPE
          }
        },
        items: [{
          schema: DEFAULT_CONTENT_ITEM
        }]
      }, false);
      return [emptyViewProposition];
    };

    // This should be called before making the request to experience edge.
    var createCacheUpdate = function createCacheUpdate(viewName) {
      var updateCacheDeferred = defer();
      cacheUpdateCreatedAtLeastOnce = true;

      // Additional updates will merge the new view propositions with the old.
      // i.e. if there are new "cart" view propositions they will overwrite the
      // old "cart" view propositions, but if there are no new "cart" view
      // propositions the old "cart" view propositions will remain.
      viewStoragePromise = viewStoragePromise.then(function (oldViewStorage) {
        return updateCacheDeferred.promise.then(function (newViewStorage) {
          return reactorObjectAssign({}, oldViewStorage, newViewStorage);
        }).catch(function () {
          return oldViewStorage;
        });
      });
      return {
        update: function update(viewPropositions) {
          var viewPropositionsWithScope = viewPropositions.filter(function (proposition) {
            return proposition.getScope();
          });
          var newViewStorage = groupBy(viewPropositionsWithScope, function (proposition) {
            return proposition.getScope().toLowerCase();
          });
          updateCacheDeferred.resolve(newViewStorage);
          if (viewName) {
            return getViewPropositions(newViewStorage, viewName);
          }
          return [];
        },
        cancel: function cancel() {
          updateCacheDeferred.reject();
        }
      };
    };
    var getView = function getView(viewName) {
      return viewStoragePromise.then(function (viewStorage) {
        return getViewPropositions(viewStorage, viewName);
      });
    };
    var isInitialized = function isInitialized() {
      return cacheUpdateCreatedAtLeastOnce;
    };
    return {
      createCacheUpdate: createCacheUpdate,
      getView: getView,
      isInitialized: isInitialized
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createViewChangeHandler = (function (_ref) {
    var processPropositions = _ref.processPropositions,
      viewCache = _ref.viewCache;
    return function (_ref2) {
      var personalizationDetails = _ref2.personalizationDetails,
        onResponse = _ref2.onResponse;
      var returnedPropositions;
      var returnedDecisions;
      var viewName = personalizationDetails.getViewName();
      onResponse(function () {
        return {
          propositions: returnedPropositions,
          decisions: returnedDecisions
        };
      });
      return viewCache.getView(viewName).then(function (propositions) {
        var render;
        if (personalizationDetails.isRenderDecisions()) {
          var _processPropositions = processPropositions(propositions);
          render = _processPropositions.render;
          returnedPropositions = _processPropositions.returnedPropositions;
          returnedDecisions = _processPropositions.returnedDecisions;
          return render();
        }
        var _processPropositions2 = processPropositions([], propositions);
        returnedPropositions = _processPropositions2.returnedPropositions;
        returnedDecisions = _processPropositions2.returnedDecisions;
        return [];
      });
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var metasToArray = function metasToArray(metas) {
    return Object.keys(metas).map(function (key) {
      return _objectSpread2({
        id: key
      }, metas[key]);
    });
  };
  var createClickStorage = (function () {
    var clickStorage = {};
    var storeClickMetrics = function storeClickMetrics(_ref) {
      var selector = _ref.selector,
        _ref$meta = _ref.meta,
        id = _ref$meta.id,
        scope = _ref$meta.scope,
        scopeDetails = _ref$meta.scopeDetails,
        trackingLabel = _ref$meta.trackingLabel,
        scopeType = _ref$meta.scopeType;
      if (!clickStorage[selector]) {
        clickStorage[selector] = {};
      }
      clickStorage[selector][id] = {
        scope: scope,
        scopeDetails: scopeDetails,
        trackingLabel: trackingLabel,
        scopeType: scopeType
      };
    };
    var getClickSelectors = function getClickSelectors() {
      return Object.keys(clickStorage);
    };
    var getClickMetasBySelector = function getClickMetasBySelector(selector) {
      var metas = clickStorage[selector];
      if (!metas) {
        return {};
      }
      return metasToArray(clickStorage[selector]);
    };
    return {
      storeClickMetrics: storeClickMetrics,
      getClickSelectors: getClickSelectors,
      getClickMetasBySelector: getClickMetasBySelector
    };
  });

  var SUPPORTED_SCHEMAS = [DOM_ACTION, HTML_CONTENT_ITEM, MESSAGE_IN_APP];
  var createApplyPropositions = (function (_ref) {
    var processPropositions = _ref.processPropositions,
      createProposition = _ref.createProposition,
      renderedPropositions = _ref.renderedPropositions,
      viewCache = _ref.viewCache;
    var filterItemsPredicate = function filterItemsPredicate(item) {
      return SUPPORTED_SCHEMAS.indexOf(item.schema) > -1;
    };
    var updatePropositionItems = function updatePropositionItems(_ref2) {
      var items = _ref2.items,
        metadataForScope = _ref2.metadataForScope;
      return items.filter(filterItemsPredicate).map(function (item) {
        if (item.schema !== HTML_CONTENT_ITEM) {
          return _objectSpread2({}, item);
        }
        if (isObject(metadataForScope)) {
          return _objectSpread2(_objectSpread2({}, item), {}, {
            data: _objectSpread2(_objectSpread2({}, item.data), {}, {
              selector: metadataForScope.selector,
              type: metadataForScope.actionType
            })
          });
        }
        return undefined;
      }).filter(function (item) {
        return item;
      });
    };
    var filterPropositionsPredicate = function filterPropositionsPredicate(proposition) {
      return !(proposition.scope === PAGE_WIDE_SCOPE && proposition.renderAttempted);
    };
    var preparePropositions = function preparePropositions(_ref3) {
      var propositions = _ref3.propositions,
        metadata = _ref3.metadata;
      return propositions.filter(filterPropositionsPredicate).map(function (proposition) {
        if (isNonEmptyArray(proposition.items)) {
          var id = proposition.id,
            scope = proposition.scope,
            scopeDetails = proposition.scopeDetails;
          return {
            id: id,
            scope: scope,
            scopeDetails: scopeDetails,
            items: updatePropositionItems({
              items: proposition.items,
              metadataForScope: metadata[proposition.scope]
            })
          };
        }
        return proposition;
      }).filter(function (proposition) {
        return isNonEmptyArray(proposition.items);
      });
    };
    return function (_ref4) {
      var _ref4$propositions = _ref4.propositions,
        propositions = _ref4$propositions === void 0 ? [] : _ref4$propositions,
        _ref4$metadata = _ref4.metadata,
        metadata = _ref4$metadata === void 0 ? {} : _ref4$metadata,
        viewName = _ref4.viewName;
      // We need to immediately call concat so that subsequent sendEvent
      // calls will wait for applyPropositions to complete before executing.
      var renderedPropositionsDeferred = defer();
      renderedPropositions.concat(renderedPropositionsDeferred.promise);
      var propositionsToExecute = preparePropositions({
        propositions: propositions,
        metadata: metadata
      }).map(function (proposition) {
        return createProposition(proposition);
      });
      return Promise.resolve().then(function () {
        if (viewName) {
          return viewCache.getView(viewName);
        }
        return [];
      }).then(function (additionalPropositions) {
        var _processPropositions = processPropositions([].concat(_toConsumableArray(propositionsToExecute), _toConsumableArray(additionalPropositions))),
          render = _processPropositions.render,
          returnedPropositions = _processPropositions.returnedPropositions;
        render().then(renderedPropositionsDeferred.resolve);
        return {
          propositions: returnedPropositions
        };
      });
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createGetPageLocation = (function (_ref) {
    var window = _ref.window;
    return function () {
      return window.location;
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createSetTargetMigration = (function (_ref) {
    var targetMigrationEnabled = _ref.targetMigrationEnabled;
    if (targetMigrationEnabled) {
      return function (request) {
        request.getPayload().mergeMeta({
          target: {
            migration: true
          }
        });
      };
    }
    return noop$1;
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var ACTION_CUSTOM_CODE = "customCode";
  var TARGET_BODY_SELECTOR = "BODY > *:eq(0)";
  var remapCustomCodeOffers = (function (action) {
    var selector = action.selector,
      type = action.type;
    if (type !== ACTION_CUSTOM_CODE) {
      return action;
    }
    if (selector !== TARGET_BODY_SELECTOR) {
      return action;
    }
    return reactorObjectAssign({}, action, {
      selector: "BODY"
    });
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Returns whether a string value is blank. Also returns true if the value is not a string.
   * @param {*} value
   * @returns {boolean}
   */
  var isBlankString = (function (value) {
    return isString(value) ? !value.trim() : true;
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var APPEND_HTML = "appendHtml";
  var HEAD_TAGS_SELECTOR = "SCRIPT,LINK,STYLE";
  var filterHeadContent = function filterHeadContent(content) {
    var container = createFragment(content);
    var headNodes = selectNodes(HEAD_TAGS_SELECTOR, container);
    return headNodes.map(function (node) {
      return node.outerHTML;
    }).join("");
  };
  var remapHeadOffers = (function (action) {
    var result = reactorObjectAssign({}, action);
    var content = result.content,
      selector = result.selector;
    if (isBlankString(content)) {
      return result;
    }
    if (selector == null) {
      return result;
    }
    var container = selectNodesWithEq(selector);
    if (!is(container[0], HEAD)) {
      return result;
    }
    result.type = APPEND_HTML;
    result.content = filterHeadContent(content);
    return result;
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createPreprocess = (function (preprocessors) {
    return function (action) {
      if (!action) {
        return action;
      }
      return preprocessors.reduce(function (processed, fn) {
        return reactorObjectAssign(processed, fn(processed));
      }, action);
    };
  });

  var injectCreateProposition = (function (_ref) {
    var preprocess = _ref.preprocess,
      isPageWideSurface = _ref.isPageWideSurface;
    var createItem = function createItem(item, proposition) {
      var schema = item.schema,
        data = item.data,
        _item$characteristics = item.characteristics;
      _item$characteristics = _item$characteristics === void 0 ? {} : _item$characteristics;
      var trackingLabel = _item$characteristics.trackingLabel;
      var processedData = preprocess(data);
      return {
        getSchema: function getSchema() {
          return schema;
        },
        getData: function getData() {
          return processedData;
        },
        getProposition: function getProposition() {
          return proposition;
        },
        getTrackingLabel: function getTrackingLabel() {
          return trackingLabel;
        },
        getOriginalItem: function getOriginalItem() {
          return item;
        },
        toString: function toString() {
          return JSON.stringify(item);
        },
        toJSON: function toJSON() {
          return item;
        }
      };
    };
    return function (payload) {
      var visibleInReturnedItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var id = payload.id,
        scope = payload.scope,
        scopeDetails = payload.scopeDetails,
        _payload$items = payload.items,
        items = _payload$items === void 0 ? [] : _payload$items;
      var _ref2 = scopeDetails || {},
        _ref2$characteristics = _ref2.characteristics;
      _ref2$characteristics = _ref2$characteristics === void 0 ? {} : _ref2$characteristics;
      var scopeType = _ref2$characteristics.scopeType;
      return {
        getScope: function getScope() {
          if (!scope) {
            return scope;
          }
          return scope;
        },
        getScopeType: function getScopeType() {
          if (scope === PAGE_WIDE_SCOPE || isPageWideSurface(scope)) {
            return PAGE_SCOPE_TYPE;
          }
          if (scopeType === VIEW_SCOPE_TYPE) {
            return VIEW_SCOPE_TYPE;
          }
          return PROPOSITION_SCOPE_TYPE;
        },
        getItems: function getItems() {
          var _this = this;
          return items.map(function (item) {
            return createItem(item, _this);
          });
        },
        getNotification: function getNotification() {
          return {
            id: id,
            scope: scope,
            scopeDetails: scopeDetails
          };
        },
        toJSON: function toJSON() {
          return payload;
        },
        addToReturnValues: function addToReturnValues(propositions, decisions, includedItems, renderAttempted) {
          if (visibleInReturnedItems) {
            propositions.push(_objectSpread2(_objectSpread2({}, payload), {}, {
              items: includedItems.map(function (i) {
                return i.getOriginalItem();
              }),
              renderAttempted: renderAttempted
            }));
            if (!renderAttempted) {
              decisions.push(_objectSpread2(_objectSpread2({}, payload), {}, {
                items: includedItems.map(function (i) {
                  return i.getOriginalItem();
                })
              }));
            }
          }
        }
      };
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createAsyncArray = (function () {
    var latest = Promise.resolve([]);
    return {
      concat: function concat(promise) {
        latest = latest.then(function (existingPropositions) {
          return promise.then(function (newPropositions) {
            return existingPropositions.concat(newPropositions);
          }).catch(function () {
            return existingPropositions;
          });
        });
      },
      /**
       * Clears the saved propositions, waiting until the next propositions are resolved and available.
       *
       * @returns {Promise<Array>} A promise that resolves to the latest propositions.
       */
      clear: function clear() {
        var oldLatest = latest;
        latest = Promise.resolve([]);
        return oldLatest;
      }
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var processDefaultContent = (function () {
    return {
      setRenderAttempted: true,
      includeInNotification: true
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createProcessDomAction = (function (_ref) {
    var modules = _ref.modules,
      logger = _ref.logger,
      storeClickMetrics = _ref.storeClickMetrics;
    return function (item) {
      var _ref2 = item.getData() || {},
        type = _ref2.type,
        selector = _ref2.selector;
      if (!type) {
        logger.warn("Invalid DOM action data: missing type.", item.getData());
        return {
          setRenderAttempted: false,
          includeInNotification: false
        };
      }
      if (type === "click") {
        if (!selector) {
          logger.warn("Invalid DOM action data: missing selector.", item.getData());
          return {
            setRenderAttempted: false,
            includeInNotification: false
          };
        }
        storeClickMetrics({
          selector: selector,
          meta: _objectSpread2(_objectSpread2({}, item.getProposition().getNotification()), {}, {
            trackingLabel: item.getTrackingLabel(),
            scopeType: item.getProposition().getScopeType()
          })
        });
        return {
          setRenderAttempted: true,
          includeInNotification: false
        };
      }
      if (!modules[type]) {
        logger.warn("Invalid DOM action data: unknown type.", item.getData());
        return {
          setRenderAttempted: false,
          includeInNotification: false
        };
      }
      return {
        render: function render() {
          return modules[type](item.getData());
        },
        setRenderAttempted: true,
        includeInNotification: true
      };
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createProcessHtmlContent = (function (_ref) {
    var modules = _ref.modules,
      logger = _ref.logger;
    return function (item) {
      var _ref2 = item.getData() || {},
        type = _ref2.type,
        selector = _ref2.selector;
      if (!selector || !type) {
        return {
          setRenderAttempted: false,
          includeInNotification: false
        };
      }
      if (!modules[type]) {
        logger.warn("Invalid HTML content data", item.getData());
        return {
          setRenderAttempted: false,
          includeInNotification: false
        };
      }
      return {
        render: function render() {
          modules[type](item.getData());
        },
        setRenderAttempted: true,
        includeInNotification: true
      };
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createProcessRedirect = (function (_ref) {
    var logger = _ref.logger,
      executeRedirect = _ref.executeRedirect,
      collect = _ref.collect;
    return function (item) {
      var _ref2 = item.getData() || {},
        content = _ref2.content;
      if (!content) {
        logger.warn("Invalid Redirect data", item.getData());
        return {};
      }
      var render = function render() {
        return collect({
          decisionsMeta: [item.getProposition().getNotification()],
          documentMayUnload: true
        }).then(function () {
          return executeRedirect(content);
          // Execute redirect will never resolve. If there are bottom of page events that are waiting
          // for display notifications from this request, they will never run because this promise will
          // not resolve. This is intentional because we don't want to run bottom of page events if
          // there is a redirect.
        });
      };

      return {
        render: render,
        setRenderAttempted: true,
        onlyRenderThis: true
      };
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createProcessPropositions = (function (_ref) {
    var schemaProcessors = _ref.schemaProcessors,
      logger = _ref.logger;
    var wrapRenderWithLogging = function wrapRenderWithLogging(render, item) {
      return function () {
        return Promise.resolve().then(render).then(function () {
          if (logger.enabled) {
            logger.info("Action " + item.toString() + " executed.");
          }
          return true;
        }).catch(function (error) {
          if (logger.enabled) {
            var message = error.message,
              stack = error.stack;
            var warning = "Failed to execute action " + item.toString() + ". " + message + " " + stack;
            logger.warn(warning);
          }
          return false;
        });
      };
    };
    var renderItems = function renderItems(renderers, meta) {
      return Promise.all(renderers.map(function (renderer) {
        return renderer();
      })).then(function (successes) {
        // as long as at least one renderer succeeds, we want to add the notification
        // to the display notifications
        if (!successes.includes(true)) {
          return undefined;
        }
        return meta;
      });
    };
    var processItem = function processItem(item) {
      var processor = schemaProcessors[item.getSchema()];
      if (!processor) {
        return {};
      }
      return processor(item);
    };
    var processItems = function processItems(_ref2) {
      var existingRenderers = _ref2.renderers,
        existingReturnedPropositions = _ref2.returnedPropositions,
        existingReturnedDecisions = _ref2.returnedDecisions,
        items = _ref2.items,
        proposition = _ref2.proposition;
      var renderers = _toConsumableArray(existingRenderers);
      var returnedPropositions = _toConsumableArray(existingReturnedPropositions);
      var returnedDecisions = _toConsumableArray(existingReturnedDecisions);
      var renderedItems = [];
      var nonRenderedItems = [];
      var itemRenderers = [];
      var atLeastOneWithNotification = false;
      var render;
      var setRenderAttempted;
      var includeInNotification;
      var onlyRenderThis = false;
      var i = 0;
      var item;
      while (items.length > i) {
        item = items[i];
        var _processItem = processItem(item);
        render = _processItem.render;
        setRenderAttempted = _processItem.setRenderAttempted;
        includeInNotification = _processItem.includeInNotification;
        onlyRenderThis = _processItem.onlyRenderThis;
        if (onlyRenderThis) {
          returnedPropositions = [];
          returnedDecisions = [];
          if (setRenderAttempted) {
            renderedItems = [item];
            nonRenderedItems = [];
          } else {
            renderedItems = [];
            nonRenderedItems = [item];
          }
          renderers = [];
          itemRenderers = [render];
          atLeastOneWithNotification = includeInNotification;
          break;
        }
        if (render) {
          itemRenderers.push(wrapRenderWithLogging(render, item));
        }
        if (includeInNotification) {
          atLeastOneWithNotification = true;
        }
        if (setRenderAttempted) {
          renderedItems.push(item);
        } else {
          nonRenderedItems.push(item);
        }
        i += 1;
      }
      if (itemRenderers.length > 0) {
        var meta = atLeastOneWithNotification ? proposition.getNotification() : undefined;
        renderers.push(function () {
          return renderItems(itemRenderers, meta);
        });
      } else if (atLeastOneWithNotification) {
        renderers.push(function () {
          return proposition.getNotification();
        });
      }
      if (renderedItems.length > 0) {
        proposition.addToReturnValues(returnedPropositions, returnedDecisions, renderedItems, true);
      }
      if (nonRenderedItems.length > 0) {
        proposition.addToReturnValues(returnedPropositions, returnedDecisions, nonRenderedItems, false);
      }
      return {
        renderers: renderers,
        returnedPropositions: returnedPropositions,
        returnedDecisions: returnedDecisions,
        onlyRenderThis: onlyRenderThis
      };
    };
    return function (renderPropositions) {
      var nonRenderPropositions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var renderers = [];
      var returnedPropositions = [];
      var returnedDecisions = [];
      var onlyRenderThis;
      var i = 0;
      var proposition;
      var items;
      while (renderPropositions.length > i) {
        proposition = renderPropositions[i];
        items = proposition.getItems();
        var _processItems = processItems({
          renderers: renderers,
          returnedPropositions: returnedPropositions,
          returnedDecisions: returnedDecisions,
          items: items,
          proposition: proposition
        });
        renderers = _processItems.renderers;
        returnedPropositions = _processItems.returnedPropositions;
        returnedDecisions = _processItems.returnedDecisions;
        onlyRenderThis = _processItems.onlyRenderThis;
        if (onlyRenderThis) {
          break;
        }
        i += 1;
      }
      if (onlyRenderThis) {
        // if onlyRenderThis is true, that means returnedPropositions and returnedDecisions
        // only contains the proposition that triggered only rendering this. We need to
        // add the other propositions to the returnedPropositions and returnedDecisions.
        renderPropositions.forEach(function (p, index) {
          if (index !== i) {
            p.addToReturnValues(returnedPropositions, returnedDecisions, p.getItems(), false);
          }
        });
      }
      nonRenderPropositions.forEach(function (p) {
        p.addToReturnValues(returnedPropositions, returnedDecisions, p.getItems(), false);
      });
      var render = function render() {
        return Promise.all(renderers.map(function (renderer) {
          return renderer();
        })).then(function (metas) {
          return metas.filter(function (meta) {
            return meta;
          });
        });
      };
      return {
        returnedPropositions: returnedPropositions,
        returnedDecisions: returnedDecisions,
        render: render
      };
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createOnDecisionHandler = (function (_ref) {
    var processPropositions = _ref.processPropositions,
      createProposition = _ref.createProposition,
      notificationHandler = _ref.notificationHandler;
    return function (_ref2) {
      var renderDecisions = _ref2.renderDecisions,
        propositions = _ref2.propositions,
        event = _ref2.event,
        _ref2$personalization = _ref2.personalization,
        personalization = _ref2$personalization === void 0 ? {} : _ref2$personalization;
      if (!renderDecisions) {
        return Promise.resolve();
      }
      var _personalization$send = personalization.sendDisplayEvent,
        sendDisplayEvent = _personalization$send === void 0 ? true : _personalization$send;
      var viewName = event ? event.getViewName() : undefined;
      var propositionsToExecute = propositions.map(function (proposition) {
        return createProposition(proposition, true);
      });
      var _processPropositions = processPropositions(propositionsToExecute),
        render = _processPropositions.render,
        returnedPropositions = _processPropositions.returnedPropositions;
      var handleNotifications = notificationHandler(renderDecisions, sendDisplayEvent, viewName);
      render().then(handleNotifications);
      return Promise.resolve({
        propositions: returnedPropositions
      });
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var TEXT_HTML = "text/html";
  var APPLICATION_JSON = "application/json";

  var DEFAULT_CONTENT = "defaultContent";
  var expectedProps = ["content", "contentType"];
  var expectedContentProps = ["mobileParameters", "webParameters", "html"];
  var isValidInAppMessage = function isValidInAppMessage(data, logger) {
    for (var i = 0; i < expectedProps.length; i += 1) {
      var prop = expectedProps[i];
      if (!Object.prototype.hasOwnProperty.call(data, prop)) {
        logger.warn("Invalid in-app message data: missing property '" + prop + "'.", data);
        return false;
      }
    }
    var content = data.content,
      contentType = data.contentType;
    if (contentType === APPLICATION_JSON) {
      for (var _i = 0; _i < expectedContentProps.length; _i += 1) {
        var _prop = expectedContentProps[_i];
        if (!Object.prototype.hasOwnProperty.call(content, _prop)) {
          logger.warn("Invalid in-app message data.content: missing property '" + _prop + "'.", data);
          return false;
        }
      }
    }
    return true;
  };
  var createProcessInAppMessage = (function (_ref) {
    var modules = _ref.modules,
      logger = _ref.logger;
    return function (item) {
      var data = item.getData();
      var meta = _objectSpread2({}, item.getProposition().getNotification());
      if (!data) {
        logger.warn("Invalid in-app message data: undefined.", data);
        return {};
      }
      var _data$type = data.type,
        type = _data$type === void 0 ? DEFAULT_CONTENT : _data$type;
      if (!modules[type]) {
        logger.warn("Invalid in-app message data: unknown type.", data);
        return {};
      }
      if (!isValidInAppMessage(data, logger)) {
        return {};
      }
      if (!meta) {
        logger.warn("Invalid in-app message meta: undefined.", meta);
        return {};
      }
      return {
        render: function render() {
          return modules[type](_objectSpread2(_objectSpread2({}, data), {}, {
            meta: meta
          }));
        },
        setRenderAttempted: true,
        includeInNotification: true
      };
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var removeElementById = function removeElementById(id) {
    var element = selectNodes("#" + id, document);
    if (element && element.length > 0) {
      removeNode(element[0]);
    }
  };
  var parseAnchor = function parseAnchor(anchor) {
    var nothing = {};
    if (!anchor || anchor.tagName.toLowerCase() !== "a") {
      return nothing;
    }
    var href = anchor.href;
    if (!href || !startsWith(href, "adbinapp://")) {
      return nothing;
    }
    var hrefParts = href.split("?");
    var action = hrefParts[0].split("://")[1];
    var label = anchor.innerText;
    var uuid = anchor.getAttribute("data-uuid") || "";
    var interaction;
    var link;
    if (isNonEmptyArray(hrefParts)) {
      var queryParams = reactorQueryString.parse(hrefParts[1]);
      interaction = queryParams.interaction || "";
      link = decodeURIComponent(queryParams.link || "");
    }
    return {
      action: action,
      interaction: interaction,
      link: link,
      label: label,
      uuid: uuid
    };
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createRedirect = (function (window) {
    return function (url) {
      var preserveHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (preserveHistory) {
        window.location.href = url;
      } else {
        window.location.replace(url);
      }
      // Return a promise that never resolves because redirects never complete
      // within the current page.
      return new Promise(function () {
        return undefined;
      });
    };
  });

  var MESSAGING_CONTAINER_ID = "alloy-messaging-container";
  var OVERLAY_CONTAINER_ID = "alloy-overlay-container";
  var IFRAME_ID = "alloy-content-iframe";
  var dismissMessage = function dismissMessage() {
    return [MESSAGING_CONTAINER_ID, OVERLAY_CONTAINER_ID].forEach(removeElementById);
  };
  var createIframeClickHandler = function createIframeClickHandler(interact) {
    var navigateToUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createRedirect(window);
    return function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var target = event.target;
      var anchor = target.tagName.toLowerCase() === "a" ? target : target.closest("a");
      if (!anchor) {
        return;
      }
      var _parseAnchor = parseAnchor(anchor),
        action = _parseAnchor.action,
        interaction = _parseAnchor.interaction,
        link = _parseAnchor.link,
        label = _parseAnchor.label,
        uuid = _parseAnchor.uuid;
      interact(action, {
        label: label,
        id: interaction,
        uuid: uuid,
        link: link
      });
      if (action === "dismiss") {
        dismissMessage();
      }
      if (isNonEmptyString(link) && link.length > 0) {
        navigateToUrl(link, true);
      }
    };
  };
  var createIframe = function createIframe(htmlContent, clickHandler) {
    var parser = new DOMParser();
    var htmlDocument = parser.parseFromString(htmlContent, TEXT_HTML);
    var scriptTag = htmlDocument.querySelector("script");
    if (scriptTag) {
      scriptTag.setAttribute("nonce", getNonce());
    }
    var element = createNode("iframe", {
      src: URL.createObjectURL(new Blob([htmlDocument.documentElement.outerHTML], {
        type: "text/html"
      })),
      id: IFRAME_ID
    });
    element.addEventListener("load", function () {
      var _ref = element.contentDocument || element.contentWindow.document,
        addEventListener = _ref.addEventListener;
      addEventListener("click", clickHandler);
    });
    return element;
  };
  var renderMessage = function renderMessage(iframe, webParameters, container, overlay) {
    [{
      id: OVERLAY_CONTAINER_ID,
      element: overlay
    }, {
      id: MESSAGING_CONTAINER_ID,
      element: container
    }, {
      id: IFRAME_ID,
      element: iframe
    }].forEach(function (_ref2) {
      var id = _ref2.id,
        element = _ref2.element;
      var _webParameters$id = webParameters[id],
        _webParameters$id$sty = _webParameters$id.style,
        style = _webParameters$id$sty === void 0 ? {} : _webParameters$id$sty,
        _webParameters$id$par = _webParameters$id.params,
        params = _webParameters$id$par === void 0 ? {} : _webParameters$id$par;
      reactorObjectAssign(element.style, style);
      var _params$parentElement = params.parentElement,
        parentElement = _params$parentElement === void 0 ? "body" : _params$parentElement,
        _params$insertionMeth = params.insertionMethod,
        insertionMethod = _params$insertionMeth === void 0 ? "appendChild" : _params$insertionMeth,
        _params$enabled = params.enabled,
        enabled = _params$enabled === void 0 ? true : _params$enabled;
      var parent = document.querySelector(parentElement);
      if (enabled && parent && typeof parent[insertionMethod] === "function") {
        parent[insertionMethod](element);
      }
    });
  };
  var buildStyleFromMobileParameters = function buildStyleFromMobileParameters(mobileParameters) {
    var verticalAlign = mobileParameters.verticalAlign,
      width = mobileParameters.width,
      horizontalAlign = mobileParameters.horizontalAlign,
      backdropColor = mobileParameters.backdropColor,
      height = mobileParameters.height,
      cornerRadius = mobileParameters.cornerRadius,
      horizontalInset = mobileParameters.horizontalInset,
      verticalInset = mobileParameters.verticalInset,
      _mobileParameters$uiT = mobileParameters.uiTakeover,
      uiTakeover = _mobileParameters$uiT === void 0 ? false : _mobileParameters$uiT;
    var style = {
      width: width ? width + "%" : "100%",
      backgroundColor: backdropColor || "rgba(0, 0, 0, 0.5)",
      borderRadius: cornerRadius ? cornerRadius + "px" : "0px",
      border: "none",
      position: uiTakeover ? "fixed" : "relative",
      overflow: "hidden"
    };
    if (horizontalAlign === "left") {
      style.left = horizontalInset ? horizontalInset + "%" : "0";
    } else if (horizontalAlign === "right") {
      style.right = horizontalInset ? horizontalInset + "%" : "0";
    } else if (horizontalAlign === "center") {
      style.left = "50%";
      style.transform = "translateX(-50%)";
    }
    if (verticalAlign === "top") {
      style.top = verticalInset ? verticalInset + "%" : "0";
    } else if (verticalAlign === "bottom") {
      style.position = "fixed";
      style.bottom = verticalInset ? verticalInset + "%" : "0";
    } else if (verticalAlign === "center") {
      style.top = "50%";
      style.transform = (horizontalAlign === "center" ? style.transform + " " : "") + "translateY(-50%)";
      style.display = "flex";
      style.alignItems = "center";
      style.justifyContent = "center";
    }
    if (height) {
      style.height = height + "vh";
    } else {
      style.height = "100%";
    }
    return style;
  };
  var mobileOverlay = function mobileOverlay(mobileParameters) {
    var backdropOpacity = mobileParameters.backdropOpacity,
      backdropColor = mobileParameters.backdropColor;
    var opacity = backdropOpacity || 0.5;
    var color = backdropColor || "#FFFFFF";
    var style = {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "transparent",
      opacity: opacity,
      backgroundColor: color
    };
    return style;
  };
  var REQUIRED_PARAMS = ["enabled", "parentElement", "insertionMethod"];
  var isValidWebParameters = function isValidWebParameters(webParameters) {
    if (!webParameters) {
      return false;
    }
    var ids = Object.keys(webParameters);
    if (!includes(ids, MESSAGING_CONTAINER_ID)) {
      return false;
    }
    if (!includes(ids, OVERLAY_CONTAINER_ID)) {
      return false;
    }
    var valuesArray = values(webParameters);
    for (var i = 0; i < valuesArray.length; i += 1) {
      if (!boundObjectOf(valuesArray[i], "style")) {
        return false;
      }
      if (!boundObjectOf(valuesArray[i], "params")) {
        return false;
      }
      for (var j = 0; j < REQUIRED_PARAMS.length; j += 1) {
        if (!boundObjectOf(valuesArray[i].params, REQUIRED_PARAMS[j])) {
          return false;
        }
      }
    }
    return true;
  };
  var generateWebParameters = function generateWebParameters(mobileParameters) {
    var _ref3;
    if (!mobileParameters) {
      return undefined;
    }
    var _mobileParameters$uiT2 = mobileParameters.uiTakeover,
      uiTakeover = _mobileParameters$uiT2 === void 0 ? false : _mobileParameters$uiT2;
    return _ref3 = {}, _defineProperty(_ref3, IFRAME_ID, {
      style: {
        border: "none",
        width: "100%",
        height: "100%"
      },
      params: {
        enabled: true,
        parentElement: "#alloy-messaging-container",
        insertionMethod: "appendChild"
      }
    }), _defineProperty(_ref3, MESSAGING_CONTAINER_ID, {
      style: buildStyleFromMobileParameters(mobileParameters),
      params: {
        enabled: true,
        parentElement: "body",
        insertionMethod: "appendChild"
      }
    }), _defineProperty(_ref3, OVERLAY_CONTAINER_ID, {
      style: mobileOverlay(mobileParameters),
      params: {
        enabled: uiTakeover === true,
        parentElement: "body",
        insertionMethod: "appendChild"
      }
    }), _ref3;
  };
  var displayHTMLContentInIframe = function displayHTMLContentInIframe() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var interact = arguments.length > 1 ? arguments[1] : undefined;
    dismissMessage();
    var content = settings.content,
      contentType = settings.contentType,
      mobileParameters = settings.mobileParameters;
    var webParameters = settings.webParameters;
    if (contentType !== TEXT_HTML) {
      return;
    }
    var container = createNode("div", {
      id: MESSAGING_CONTAINER_ID
    });
    var iframe = createIframe(content, createIframeClickHandler(interact));
    var overlay = createNode("div", {
      id: OVERLAY_CONTAINER_ID
    });
    if (!isValidWebParameters(webParameters)) {
      webParameters = generateWebParameters(mobileParameters);
    }
    if (!webParameters) {
      return;
    }
    renderMessage(iframe, webParameters, container, overlay);
  };
  var displayIframeContent = (function (settings, collect) {
    return new Promise(function (resolve) {
      var meta = settings.meta;
      displayHTMLContentInIframe(settings, function (action, propositionAction) {
        var propositionEventTypes = {};
        propositionEventTypes[PropositionEventType.INTERACT] = EVENT_TYPE_TRUE;
        if (Object.values(PropositionEventType).indexOf(action) !== -1) {
          propositionEventTypes[action] = EVENT_TYPE_TRUE;
        }
        collect({
          decisionsMeta: [meta],
          propositionAction: propositionAction,
          eventType: INTERACT,
          propositionEventTypes: Object.keys(propositionEventTypes)
        });
      });
      resolve({
        meta: meta
      });
    });
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var initInAppMessageActionsModules = (function (collect) {
    return {
      defaultContent: function defaultContent(settings) {
        return displayIframeContent(settings, collect);
      }
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createNotificationHandler = (function (collect, renderedPropositions) {
    return function (isRenderDecisions, isSendDisplayEvent, viewName) {
      if (!isRenderDecisions) {
        // If we aren't rendering anything, then we don't need to sendDisplayEvents.
        return function () {
          return undefined;
        };
      }
      if (!isSendDisplayEvent) {
        var renderedPropositionsDeferred = defer();
        renderedPropositions.concat(renderedPropositionsDeferred.promise);
        return renderedPropositionsDeferred.resolve;
      }
      return function (decisionsMeta) {
        if (decisionsMeta.length > 0) {
          collect({
            decisionsMeta: decisionsMeta,
            viewName: viewName
          });
        }
      };
    };
  });

  var createPersonalization = function createPersonalization(_ref) {
    var _schemaProcessors;
    var config = _ref.config,
      logger = _ref.logger,
      eventManager = _ref.eventManager;
    var targetMigrationEnabled = config.targetMigrationEnabled,
      prehidingStyle = config.prehidingStyle;
    var collect = createCollect({
      eventManager: eventManager,
      mergeDecisionsMeta: mergeDecisionsMeta
    });
    var _createClickStorage = createClickStorage(),
      getClickMetasBySelector = _createClickStorage.getClickMetasBySelector,
      getClickSelectors = _createClickStorage.getClickSelectors,
      storeClickMetrics = _createClickStorage.storeClickMetrics;
    var getPageLocation = createGetPageLocation({
      window: window
    });
    var domActionsModules = initDomActionsModules();
    var preprocess = createPreprocess([remapHeadOffers, remapCustomCodeOffers]);
    var createProposition = injectCreateProposition({
      preprocess: preprocess,
      isPageWideSurface: isPageWideSurface
    });
    var viewCache = createViewCacheManager({
      createProposition: createProposition
    });
    var executeRedirect = createRedirect(window);
    var schemaProcessors = (_schemaProcessors = {}, _defineProperty(_schemaProcessors, DEFAULT_CONTENT_ITEM, processDefaultContent), _defineProperty(_schemaProcessors, DOM_ACTION, createProcessDomAction({
      modules: domActionsModules,
      logger: logger,
      storeClickMetrics: storeClickMetrics
    })), _defineProperty(_schemaProcessors, HTML_CONTENT_ITEM, createProcessHtmlContent({
      modules: domActionsModules,
      logger: logger
    })), _defineProperty(_schemaProcessors, REDIRECT_ITEM, createProcessRedirect({
      logger: logger,
      executeRedirect: executeRedirect,
      collect: collect
    })), _defineProperty(_schemaProcessors, MESSAGE_IN_APP, createProcessInAppMessage({
      modules: initInAppMessageActionsModules(collect),
      logger: logger
    })), _schemaProcessors);
    var processPropositions = createProcessPropositions({
      schemaProcessors: schemaProcessors,
      logger: logger
    });
    var renderedPropositions = createAsyncArray();
    var notificationHandler = createNotificationHandler(collect, renderedPropositions);
    var fetchDataHandler = createFetchDataHandler({
      prehidingStyle: prehidingStyle,
      showContainers: showContainers,
      hideContainers: hideContainers,
      mergeQuery: mergeQuery,
      processPropositions: processPropositions,
      createProposition: createProposition,
      notificationHandler: notificationHandler
    });
    var onClickHandler = createOnClickHandler({
      mergeDecisionsMeta: mergeDecisionsMeta,
      collectClicks: collectClicks,
      getClickSelectors: getClickSelectors,
      getClickMetasBySelector: getClickMetasBySelector
    });
    var viewChangeHandler = createViewChangeHandler({
      processPropositions: processPropositions,
      viewCache: viewCache
    });
    var applyPropositions = createApplyPropositions({
      processPropositions: processPropositions,
      createProposition: createProposition,
      renderedPropositions: renderedPropositions,
      viewCache: viewCache
    });
    var setTargetMigration = createSetTargetMigration({
      targetMigrationEnabled: targetMigrationEnabled
    });
    var onDecisionHandler = createOnDecisionHandler({
      processPropositions: processPropositions,
      createProposition: createProposition,
      notificationHandler: notificationHandler
    });
    return createComponent$3({
      getPageLocation: getPageLocation,
      logger: logger,
      fetchDataHandler: fetchDataHandler,
      viewChangeHandler: viewChangeHandler,
      onClickHandler: onClickHandler,
      isAuthoringModeEnabled: isAuthoringModeEnabled,
      mergeQuery: mergeQuery,
      viewCache: viewCache,
      showContainers: showContainers,
      applyPropositions: applyPropositions,
      setTargetMigration: setTargetMigration,
      mergeDecisionsMeta: mergeDecisionsMeta,
      renderedPropositions: renderedPropositions,
      onDecisionHandler: onDecisionHandler
    });
  };
  createPersonalization.namespace = "Personalization";
  createPersonalization.configValidators = boundObjectOf({
    prehidingStyle: boundString().nonEmpty(),
    targetMigrationEnabled: boundBoolean().default(false)
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectWeb = (function (window) {
    return function (xdm) {
      var web = {
        webPageDetails: {
          URL: window.location.href || window.location
        },
        webReferrer: {
          URL: window.document.referrer
        }
      };
      deepAssign(xdm, {
        web: web
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var getScreenOrientationViaProperty = function getScreenOrientationViaProperty(window) {
    var orientation = window.screen.orientation;
    if (orientation == null || orientation.type == null) {
      return null;
    }
    var parts = orientation.type.split("-");
    if (parts.length === 0) {
      return null;
    }
    if (parts[0] !== "portrait" && parts[0] !== "landscape") {
      return null;
    }
    return parts[0];
  };
  var getScreenOrientationViaMediaQuery = function getScreenOrientationViaMediaQuery(window) {
    if (isFunction(window.matchMedia)) {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return "portrait";
      }
      if (window.matchMedia("(orientation: landscape)").matches) {
        return "landscape";
      }
    }
    return null;
  };
  var injectDevice = (function (window) {
    return function (xdm) {
      var _window$screen = window.screen,
        width = _window$screen.width,
        height = _window$screen.height;
      var device = {};
      var screenHeight = toInteger(height);
      if (screenHeight >= 0) {
        device.screenHeight = screenHeight;
      }
      var screenWidth = toInteger(width);
      if (screenWidth >= 0) {
        device.screenWidth = screenWidth;
      }
      var orientation = getScreenOrientationViaProperty(window) || getScreenOrientationViaMediaQuery(window);
      if (orientation) {
        device.screenOrientation = orientation;
      }
      if (Object.keys(device).length > 0) {
        deepAssign(xdm, {
          device: device
        });
      }
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectEnvironment = (function (window) {
    return function (xdm) {
      var _window$document$docu = window.document.documentElement;
      _window$document$docu = _window$document$docu === void 0 ? {} : _window$document$docu;
      var clientWidth = _window$document$docu.clientWidth,
        clientHeight = _window$document$docu.clientHeight;
      var environment = {
        type: "browser"
      };
      var viewportWidth = toInteger(clientWidth);
      if (viewportWidth >= 0) {
        environment.browserDetails = {
          viewportWidth: viewportWidth
        };
      }
      var viewportHeight = toInteger(clientHeight);
      if (viewportHeight >= 0) {
        environment.browserDetails = environment.browserDetails || {};
        environment.browserDetails.viewportHeight = viewportHeight;
      }
      deepAssign(xdm, {
        environment: environment
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectPlaceContext = (function (dateProvider) {
    return function (xdm) {
      var date = dateProvider();
      var placeContext = {};
      var localTimezoneOffset = toInteger(date.getTimezoneOffset());
      if (localTimezoneOffset !== undefined) {
        placeContext.localTimezoneOffset = localTimezoneOffset;
      }
      // make sure the timezone offset only uses two digits
      if (localTimezoneOffset === undefined || Math.abs(localTimezoneOffset) < 6000) {
        placeContext.localTime = toISOStringLocal(date);
      }
      deepAssign(xdm, {
        placeContext: placeContext
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectTimestamp = (function (dateProvider) {
    return function (xdm) {
      var timestamp = dateProvider().toISOString();
      deepAssign(xdm, {
        timestamp: timestamp
      });
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var libraryName = "https://ns.adobe.com/experience/alloy";

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // The __VERSION__ keyword will be replace at alloy build time with the package.json version.
  // see babel-plugin-version

  var libraryVersion = "2.19.2";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var implementationDetails = (function (xdm) {
    var implementationDetails = {
      name: libraryName,
      version: libraryVersion,
      environment: "browser"
    };
    deepAssign(xdm, {
      implementationDetails: implementationDetails
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createComponent$2 = (function (config, logger, optionalContexts, requiredContexts) {
    var configuredContexts = config.context;
    var contexts = flatMap(configuredContexts, function (context, i) {
      if (optionalContexts[context]) {
        return [optionalContexts[context]];
      }
      logger.warn("Invalid context[" + i + "]: '" + context + "' is not available.");
      return [];
    }).concat(requiredContexts);
    return {
      namespace: "Context",
      lifecycle: {
        onBeforeEvent: function onBeforeEvent(_ref) {
          var event = _ref.event;
          var xdm = {};
          return Promise.all(contexts.map(function (context) {
            return Promise.resolve(context(xdm, logger));
          })).then(function () {
            return event.mergeXdm(xdm);
          });
        }
      }
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var highEntropyUserAgentHints$1 = [["architecture", "string"], ["bitness", "string"], ["model", "string"], ["platformVersion", "string"], ["wow64", "boolean"]];

  var browserSupportsUserAgentClientHints = function browserSupportsUserAgentClientHints(navigator) {
    return typeof navigator.userAgentData !== "undefined";
  };
  var injectHighEntropyUserAgentHints = (function (navigator) {
    if (!browserSupportsUserAgentClientHints(navigator)) {
      return noop$1;
    }
    return function (xdm, logger) {
      try {
        return navigator.userAgentData.getHighEntropyValues(highEntropyUserAgentHints$1.map(function (hint) {
          return hint[0];
        })).then(function (hints) {
          var userAgentClientHints = {};
          highEntropyUserAgentHints$1.forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              hintName = _ref2[0],
              hintType = _ref2[1];
            if (Object.prototype.hasOwnProperty.call(hints, hintName) && /* eslint-disable-next-line valid-typeof */
            _typeof(hints[hintName]) === hintType) {
              userAgentClientHints[hintName] = hints[hintName];
            }
          });
          deepAssign(xdm, {
            environment: {
              browserDetails: {
                userAgentClientHints: userAgentClientHints
              }
            }
          });
        });
      } catch (error) {
        logger.warn("Unable to collect user-agent client hints. " + error.message);
        return noop$1;
      }
    };
  });

  var web = injectWeb(window);
  var device = injectDevice(window);
  var environment = injectEnvironment(window);
  var placeContext = injectPlaceContext(function () {
    return new Date();
  });
  var timestamp = injectTimestamp(function () {
    return new Date();
  });
  var highEntropyUserAgentHints = injectHighEntropyUserAgentHints(navigator);
  var defaultEnabledContexts = {
    web: web,
    device: device,
    environment: environment,
    placeContext: placeContext
  };
  var defaultDisabledContexts = {
    highEntropyUserAgentHints: highEntropyUserAgentHints
  };
  var optionalContexts = _objectSpread2(_objectSpread2({}, defaultEnabledContexts), defaultDisabledContexts);
  var requiredContexts = [timestamp, implementationDetails];
  var createContext = function createContext(_ref) {
    var config = _ref.config,
      logger = _ref.logger;
    return createComponent$2(config, logger, optionalContexts, requiredContexts);
  };
  createContext.namespace = "Context";
  createContext.configValidators = boundObjectOf({
    context: boundArrayOf(boundString()).default(Object.keys(defaultEnabledContexts))
  });

  var createComponent$1 = (function (_ref) {
    var storedConsent = _ref.storedConsent,
      taskQueue = _ref.taskQueue,
      defaultConsent = _ref.defaultConsent,
      consent = _ref.consent,
      sendSetConsentRequest = _ref.sendSetConsentRequest,
      validateSetConsentOptions = _ref.validateSetConsentOptions,
      consentHashStore = _ref.consentHashStore,
      doesIdentityCookieExist = _ref.doesIdentityCookieExist;
    var defaultConsentByPurpose = _defineProperty({}, GENERAL, defaultConsent);
    var storedConsentByPurpose = storedConsent.read();
    var identityCookieExists = doesIdentityCookieExist();
    var consentCookieExists = storedConsentByPurpose[GENERAL] !== undefined;
    if (!identityCookieExists || !consentCookieExists) {
      consentHashStore.clear();
    }
    // If the identity cookie is gone, remove the consent cookie because the
    // consent info is tied to the identity.
    if (!identityCookieExists) {
      storedConsent.clear();
      storedConsentByPurpose = {};
    }
    consent.initializeConsent(defaultConsentByPurpose, storedConsentByPurpose);
    var readCookieIfQueueEmpty = function readCookieIfQueueEmpty() {
      if (taskQueue.length === 0) {
        var storedConsentObject = storedConsent.read();
        // Only read cookies when there are no outstanding setConsent
        // requests. This helps with race conditions.
        if (storedConsentObject[GENERAL] !== undefined) {
          consent.setConsent(storedConsentObject);
        }
      }
    };
    return {
      commands: {
        setConsent: {
          optionsValidator: validateSetConsentOptions,
          run: function run(_ref2) {
            var consentOptions = _ref2.consent,
              identityMap = _ref2.identityMap,
              edgeConfigOverrides = _ref2.edgeConfigOverrides;
            consent.suspend();
            var consentHashes = consentHashStore.lookup(consentOptions);
            return taskQueue.addTask(function () {
              if (consentHashes.isNew()) {
                return sendSetConsentRequest({
                  consentOptions: consentOptions,
                  identityMap: identityMap,
                  edgeConfigOverrides: edgeConfigOverrides
                });
              }
              return Promise.resolve();
            }).then(function () {
              return consentHashes.save();
            }).finally(readCookieIfQueueEmpty);
          }
        }
      },
      lifecycle: {
        // Read the cookie here too because the consent cookie may change on any request
        onResponse: readCookieIfQueueEmpty,
        // Even when we get a failure HTTP status code, the consent cookie can
        // still get updated. This could happen, for example, if the user is
        // opted out in AudienceManager, but no consent cookie exists on the
        // client. The request will be sent and the server will respond with a
        // 403 Forbidden and a consent cookie.
        onRequestFailure: readCookieIfQueueEmpty
      }
    };
  });

  // serialize an object with a consistent ordering
  var serialize = function serialize(obj) {
    if (Array.isArray(obj)) {
      return obj.map(function (i) {
        return serialize(i);
      });
    }
    if (_typeof(obj) === "object" && obj !== null) {
      return Object.keys(obj).sort().reduce(function (memo, key) {
        memo[key] = serialize(obj[key]);
        return memo;
      }, {});
    }
    return obj;
  };
  var computeConsentHash = (function (obj) {
    return crc32(JSON.stringify(serialize(obj)));
  });

  var _excluded$1 = ["standard", "version"];
  var getKey = function getKey(_ref) {
    var standard = _ref.standard,
      version = _ref.version;
    return standard + "." + version;
  };
  var createConsentHashStore = (function (_ref2) {
    var storage = _ref2.storage;
    return {
      clear: function clear() {
        storage.clear();
      },
      lookup: function lookup(consentObjects) {
        var currentHashes = {};
        var getCurrentHash = function getCurrentHash(consentObject) {
          var key = getKey(consentObject);
          consentObject.standard;
            consentObject.version;
            var rest = _objectWithoutProperties(consentObject, _excluded$1);
          if (!currentHashes[key]) {
            currentHashes[key] = computeConsentHash(rest).toString();
          }
          return currentHashes[key];
        };
        return {
          isNew: function isNew() {
            return consentObjects.some(function (consentObject) {
              var key = getKey(consentObject);
              var previousHash = storage.getItem(key);
              return previousHash === null || previousHash !== getCurrentHash(consentObject);
            });
          },
          save: function save() {
            consentObjects.forEach(function (consentObject) {
              var key = getKey(consentObject);
              storage.setItem(key, getCurrentHash(consentObject));
            });
          }
        };
      }
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createConsentRequestPayload = (function () {
    var content = {};
    var payload = createRequestPayload({
      content: content,
      addIdentity: function addIdentity(namespaceCode, identity) {
        content.identityMap = content.identityMap || {};
        content.identityMap[namespaceCode] = content.identityMap[namespaceCode] || [];
        content.identityMap[namespaceCode].push(identity);
      },
      hasIdentity: function hasIdentity(namespaceCode) {
        return (content.identityMap && content.identityMap[namespaceCode]) !== undefined;
      }
    });
    payload.setConsent = function (consent) {
      content.consent = consent;
    };
    return payload;
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createConsentRequest = (function (_ref) {
    var payload = _ref.payload,
      datastreamIdOverride = _ref.datastreamIdOverride;
    return createRequest({
      payload: payload,
      datastreamIdOverride: datastreamIdOverride,
      getAction: function getAction() {
        return "privacy/set-consent";
      },
      getUseSendBeacon: function getUseSendBeacon() {
        return false;
      }
    });
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createStoredConsent = (function (_ref) {
    var parseConsentCookie = _ref.parseConsentCookie,
      orgId = _ref.orgId,
      cookieJar = _ref.cookieJar;
    var consentCookieName = getNamespacedCookieName(orgId, CONSENT);
    return {
      read: function read() {
        var cookieValue = cookieJar.get(consentCookieName);
        return cookieValue ? parseConsentCookie(cookieValue) : {};
      },
      clear: function clear() {
        cookieJar.remove(consentCookieName);
      }
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectSendSetConsentRequest = (function (_ref) {
    var createConsentRequestPayload = _ref.createConsentRequestPayload,
      createConsentRequest = _ref.createConsentRequest,
      sendEdgeNetworkRequest = _ref.sendEdgeNetworkRequest,
      globalConfigOverrides = _ref.edgeConfigOverrides;
    return function (_ref2) {
      var consentOptions = _ref2.consentOptions,
        identityMap = _ref2.identityMap,
        localConfigOverrides = _ref2.edgeConfigOverrides;
      var requestParams = createRequestParams({
        payload: createConsentRequestPayload(),
        globalConfigOverrides: globalConfigOverrides,
        localConfigOverrides: localConfigOverrides
      });
      requestParams.payload.setConsent(consentOptions);
      if (isObject(identityMap)) {
        Object.keys(identityMap).forEach(function (key) {
          identityMap[key].forEach(function (identity) {
            requestParams.payload.addIdentity(key, identity);
          });
        });
      }
      var request = createConsentRequest(requestParams);
      return sendEdgeNetworkRequest({
        request: request
      }).then(function () {
        // Don't let response data disseminate beyond this
        // point unless necessary.
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  /**
   * Parses a consent cookie.
   * @param {string} cookieValue Must be in the format a=b;c=d
   * @returns {Object} An object where the keys are purpose names and the values
   * are the consent status for the purpose.
   */
  var parseConsentCookie = (function (cookieValue) {
    var categoryPairs = cookieValue.split(";");
    return categoryPairs.reduce(function (consentByPurpose, categoryPair) {
      var _categoryPair$split = categoryPair.split("="),
        _categoryPair$split2 = _slicedToArray(_categoryPair$split, 2),
        name = _categoryPair$split2[0],
        value = _categoryPair$split2[1];
      consentByPurpose[name] = value;
      return consentByPurpose;
    }, {});
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var validateSetConsentOptions = boundObjectOf({
    consent: boundArrayOf(boundAnything()).required().nonEmpty(),
    identityMap: validateIdentityMap,
    edgeConfigOverrides: validateConfigOverride
  }).noUnknownFields().required();

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createPrivacy = function createPrivacy(_ref) {
    var config = _ref.config,
      consent = _ref.consent,
      sendEdgeNetworkRequest = _ref.sendEdgeNetworkRequest,
      createNamespacedStorage = _ref.createNamespacedStorage;
    var orgId = config.orgId,
      defaultConsent = config.defaultConsent;
    var storedConsent = createStoredConsent({
      parseConsentCookie: parseConsentCookie,
      orgId: orgId,
      cookieJar: cookieJar
    });
    var taskQueue = createTaskQueue();
    var sendSetConsentRequest = injectSendSetConsentRequest({
      createConsentRequestPayload: createConsentRequestPayload,
      createConsentRequest: createConsentRequest,
      sendEdgeNetworkRequest: sendEdgeNetworkRequest,
      edgeConfigOverrides: config.edgeConfigOverrides
    });
    var storage = createNamespacedStorage(sanitizeOrgIdForCookieName(orgId) + ".consentHashes.");
    var consentHashStore = createConsentHashStore({
      storage: storage.persistent
    });
    var doesIdentityCookieExist = injectDoesIdentityCookieExist({
      orgId: orgId
    });
    return createComponent$1({
      storedConsent: storedConsent,
      taskQueue: taskQueue,
      defaultConsent: defaultConsent,
      consent: consent,
      sendSetConsentRequest: sendSetConsentRequest,
      validateSetConsentOptions: validateSetConsentOptions,
      consentHashStore: consentHashStore,
      doesIdentityCookieExist: doesIdentityCookieExist
    });
  };
  createPrivacy.namespace = "Privacy";

  /*
  Copyright 20219 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createEventMergeId = (function () {
    return {
      eventMergeId: v4_1()
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createComponent = (function (_ref) {
    var createEventMergeId = _ref.createEventMergeId;
    return {
      commands: {
        createEventMergeId: {
          run: createEventMergeId
        }
      }
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createEventMerge = function createEventMerge() {
    return createComponent({
      createEventMergeId: createEventMergeId
    });
  };
  createEventMerge.namespace = "EventMerge";

  var prepareLibraryInfo = function prepareLibraryInfo(_ref) {
    var config = _ref.config,
      componentRegistry = _ref.componentRegistry;
    var allCommands = [].concat(_toConsumableArray(componentRegistry.getCommandNames()), [CONFIGURE, SET_DEBUG]).sort();
    var resultConfig = _objectSpread2({}, config);
    Object.keys(config).forEach(function (key) {
      var value = config[key];
      if (typeof value !== "function") {
        return;
      }
      resultConfig[key] = value.toString();
    });
    return {
      version: libraryVersion,
      configs: resultConfig,
      commands: allCommands
    };
  };
  var createLibraryInfo = function createLibraryInfo(_ref2) {
    var config = _ref2.config,
      componentRegistry = _ref2.componentRegistry;
    var libraryInfo = prepareLibraryInfo({
      config: config,
      componentRegistry: componentRegistry
    });
    return {
      commands: {
        getLibraryInfo: {
          run: function run() {
            return {
              libraryInfo: libraryInfo
            };
          }
        }
      }
    };
  };
  createLibraryInfo.namespace = "LibraryInfo";

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var PERSONALIZATION_DECISIONS_HANDLE = "personalization:decisions";

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var isPlainObject = function isPlainObject(obj) {
    return obj !== null && _typeof(obj) === "object" && Object.getPrototypeOf(obj) === Object.prototype;
  };
  var flattenObject = function flattenObject(obj) {
    var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var keys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    Object.keys(obj).forEach(function (key) {
      if (isPlainObject(obj[key]) || Array.isArray(obj[key])) {
        flattenObject(obj[key], result, [].concat(_toConsumableArray(keys), [key]));
      } else {
        result[[].concat(_toConsumableArray(keys), [key]).join(".")] = obj[key];
      }
    });
    return result;
  };
  var flattenObject$1 = (function (obj) {
    if (!isPlainObject(obj)) {
      return obj;
    }
    return flattenObject(obj);
  });

  var createOnResponseHandler = (function (_ref) {
    var renderDecisions = _ref.renderDecisions,
      decisionProvider = _ref.decisionProvider,
      applyResponse = _ref.applyResponse,
      event = _ref.event,
      personalization = _ref.personalization,
      decisionContext = _ref.decisionContext;
    var context = _objectSpread2(_objectSpread2({}, flattenObject$1(event.getContent())), decisionContext);
    return function (_ref2) {
      var response = _ref2.response;
      decisionProvider.addPayloads(response.getPayloadsByType(PERSONALIZATION_DECISIONS_HANDLE));

      // only evaluate events that include a personalization query
      if (!event.hasQuery()) {
        return {
          propositions: []
        };
      }
      var propositions = decisionProvider.evaluate(context);
      return applyResponse({
        renderDecisions: renderDecisions,
        propositions: propositions,
        event: event,
        personalization: personalization
      });
    };
  });

  var _MATCHERS;
  var ConditionType = {
    MATCHER: "matcher",
    GROUP: "group",
    HISTORICAL: "historical"
  };
  var MatcherType = {
    EQUALS: "eq",
    NOT_EQUALS: "ne",
    EXISTS: "ex",
    NOT_EXISTS: "nx",
    GREATER_THAN: "gt",
    GREATER_THAN_OR_EQUAL_TO: "ge",
    LESS_THAN: "lt",
    LESS_THAN_OR_EQUAL_TO: "le",
    CONTAINS: "co",
    NOT_CONTAINS: "nc",
    STARTS_WITH: "sw",
    ENDS_WITH: "ew"
  };
  var LogicType = {
    AND: "and",
    OR: "or"
  };
  var SearchType = {
    ANY: "any",
    ORDERED: "ordered"
  };
  function isObjectOrUndefined(value) {
    return _typeof(value) === "object" || typeof value === "undefined";
  }
  function createEquals() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        if (isObjectOrUndefined(context[key])) {
          return false;
        }
        var contextValue = String(context[key]).toLowerCase();
        for (var i = 0; i < values.length; i += 1) {
          if (!isObjectOrUndefined(values[i]) && contextValue === String(values[i]).toLowerCase()) {
            return true;
          }
        }
        return false;
      }
    };
  }
  function createNotEquals() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        if (isObjectOrUndefined(context[key])) {
          return false;
        }
        var contextValue = String(context[key]).toLowerCase();
        for (var i = 0; i < values.length; i += 1) {
          if (!isObjectOrUndefined(values[i]) && contextValue === String(values[i]).toLowerCase()) {
            return false;
          }
        }
        return true;
      }
    };
  }
  function createExists() {
    return {
      matches: function matches(context, key) {
        return typeof context[key] !== "undefined" && context[key] !== null;
      }
    };
  }
  function createNotExists() {
    return {
      matches: function matches(context, key) {
        return typeof context[key] === "undefined" || context[key] === null;
      }
    };
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function createGreaterThan() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var needle = context[key];
        if (!isNumber(needle)) {
          return false;
        }
        for (var i = 0; i < values.length; i += 1) {
          if (isNumber(values[i]) && needle > values[i]) {
            return true;
          }
        }
        return false;
      }
    };
  }
  function createGreaterThanEquals() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var needle = context[key];
        if (!isNumber(needle)) {
          return false;
        }
        for (var i = 0; i < values.length; i += 1) {
          if (isNumber(values[i]) && needle >= values[i]) {
            return true;
          }
        }
        return false;
      }
    };
  }
  function createLessThan() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var needle = context[key];
        if (!isNumber(needle)) {
          return false;
        }
        for (var i = 0; i < values.length; i += 1) {
          if (isNumber(values[i]) && needle < values[i]) {
            return true;
          }
        }
        return false;
      }
    };
  }
  function createLessThanEquals() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var needle = context[key];
        if (!isNumber(needle)) {
          return false;
        }
        for (var i = 0; i < values.length; i += 1) {
          if (isNumber(values[i]) && needle <= values[i]) {
            return true;
          }
        }
        return false;
      }
    };
  }
  function createContains() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        if (isObjectOrUndefined(context[key])) {
          return false;
        }
        var contextValue = String(context[key]).toLowerCase();
        for (var i = 0; i < values.length; i += 1) {
          if (!isObjectOrUndefined(values[i]) && contextValue.indexOf(String(values[i]).toLowerCase()) !== -1) {
            return true;
          }
        }
        return false;
      }
    };
  }
  function createNotContains() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        if (isObjectOrUndefined(context[key])) {
          return false;
        }
        var contextValue = String(context[key]).toLowerCase();
        for (var i = 0; i < values.length; i += 1) {
          if (!isObjectOrUndefined(values[i]) && contextValue.indexOf(String(values[i]).toLowerCase()) !== -1) {
            return false;
          }
        }
        return true;
      }
    };
  }
  function createStartsWith() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        if (isObjectOrUndefined(context[key])) {
          return false;
        }
        var contextValue = String(context[key]).toLowerCase();
        for (var i = 0; i < values.length; i += 1) {
          if (!isObjectOrUndefined(values[i]) && contextValue.startsWith(String(values[i]).toLowerCase())) {
            return true;
          }
        }
        return false;
      }
    };
  }
  function createEndsWith() {
    return {
      matches: function matches(context, key) {
        var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        if (isObjectOrUndefined(context[key])) {
          return false;
        }
        var contextValue = String(context[key]).toLowerCase();
        for (var i = 0; i < values.length; i += 1) {
          if (!isObjectOrUndefined(values[i]) && contextValue.endsWith(values[i].toLowerCase())) {
            return true;
          }
        }
        return false;
      }
    };
  }
  var MATCHERS = (_MATCHERS = {}, _defineProperty(_MATCHERS, MatcherType.EQUALS, createEquals()), _defineProperty(_MATCHERS, MatcherType.NOT_EQUALS, createNotEquals()), _defineProperty(_MATCHERS, MatcherType.EXISTS, createExists()), _defineProperty(_MATCHERS, MatcherType.NOT_EXISTS, createNotExists()), _defineProperty(_MATCHERS, MatcherType.GREATER_THAN, createGreaterThan()), _defineProperty(_MATCHERS, MatcherType.GREATER_THAN_OR_EQUAL_TO, createGreaterThanEquals()), _defineProperty(_MATCHERS, MatcherType.LESS_THAN, createLessThan()), _defineProperty(_MATCHERS, MatcherType.LESS_THAN_OR_EQUAL_TO, createLessThanEquals()), _defineProperty(_MATCHERS, MatcherType.CONTAINS, createContains()), _defineProperty(_MATCHERS, MatcherType.NOT_CONTAINS, createNotContains()), _defineProperty(_MATCHERS, MatcherType.STARTS_WITH, createStartsWith()), _defineProperty(_MATCHERS, MatcherType.ENDS_WITH, createEndsWith()), _MATCHERS);
  function getMatcher(key) {
    return MATCHERS[key];
  }
  function isUndefined(value) {
    return typeof value === "undefined";
  }
  var IAM_ID = "iam.id";
  var ID = "id";
  var IAM_EVENT_TYPE = "iam.eventType";
  var EVENT_TYPE = "eventType";
  var TYPE = "type";
  var VALID_EVENT_TYPES = [IAM_EVENT_TYPE, EVENT_TYPE, TYPE];
  var VALID_EVENT_IDS = [IAM_ID, ID];
  function checkForHistoricalMatcher(eventCount, matcherKey, value) {
    switch (matcherKey) {
      case MatcherType.GREATER_THAN:
        return eventCount > value;
      case MatcherType.GREATER_THAN_OR_EQUAL_TO:
        return eventCount >= value;
      case MatcherType.LESS_THAN:
        return eventCount < value;
      case MatcherType.LESS_THAN_OR_EQUAL_TO:
        return eventCount <= value;
      case MatcherType.EQUALS:
        return eventCount === value;
      case MatcherType.NOT_EQUALS:
        return eventCount !== value;
      default:
        return false;
    }
  }
  function oneOf(context, properties) {
    for (var i = 0; i < properties.length; i += 1) {
      if (!isUndefined(context[properties[i]])) {
        return context[properties[i]];
      }
    }
    return undefined;
  }
  function eventSatisfiesCondition(historicalEventCondition, eventContext) {
    var eventKeys = Object.keys(historicalEventCondition);
    for (var i = 0; i < eventKeys.length; i += 1) {
      var key = eventKeys[i];
      var _eventContext$event = eventContext.event,
        event = _eventContext$event === void 0 ? {} : _eventContext$event;
      if (event[eventKeys[i]] !== historicalEventCondition[key]) {
        return false;
      }
    }
    return true;
  }
  function queryAndCountAnyEvent(events, context, from, to) {
    return events.reduce(function (countTotal, event) {
      var eventType = oneOf(event, VALID_EVENT_TYPES);
      if (!eventType) {
        return countTotal;
      }
      var eventsOfType = context.events[eventType];
      if (!eventsOfType) {
        return countTotal;
      }
      var eventId = oneOf(event, VALID_EVENT_IDS);
      if (!eventId) {
        return countTotal;
      }
      var contextEvent = eventsOfType[eventId];
      if (!contextEvent) {
        return countTotal;
      }
      if (!eventSatisfiesCondition(event, contextEvent)) {
        return countTotal;
      }
      var _contextEvent$count = contextEvent.count,
        eventCount = _contextEvent$count === void 0 ? 1 : _contextEvent$count;
      if (isUndefined(from) || isUndefined(to) || contextEvent.timestamp >= from && contextEvent.timestamp <= to) {
        return countTotal + eventCount;
      }
      return countTotal;
    }, 0);
  }
  function queryAndCountOrderedEvent(events, context, from, to) {
    var previousEventTimestamp = from;
    var sameSequence = events.every(function (event) {
      var eventType = oneOf(event, VALID_EVENT_TYPES);
      if (!eventType) {
        return false;
      }
      var eventsOfType = context.events[eventType];
      if (!eventsOfType) {
        return false;
      }
      var eventId = oneOf(event, VALID_EVENT_IDS);
      if (!eventId) {
        return false;
      }
      var contextEvent = eventsOfType[eventId];
      if (!eventSatisfiesCondition(event, contextEvent)) {
        return false;
      }
      if (contextEvent === null || isUndefined(contextEvent) || contextEvent.count === 0) {
        return false;
      }
      var ordered = (isUndefined(previousEventTimestamp) || contextEvent.timestamp >= previousEventTimestamp) && (isUndefined(to) || contextEvent.timestamp <= to);
      previousEventTimestamp = contextEvent.timestamp;
      return ordered;
    });
    return sameSequence ? 1 : 0;
  }
  function evaluateAnd(context, conditions) {
    var result = true;
    for (var i = 0; i < conditions.length; i += 1) {
      result = result && conditions[i].evaluate(context);
    }
    return result;
  }
  function evaluateOr(context, conditions) {
    var result = false;
    for (var i = 0; i < conditions.length; i += 1) {
      result = result || conditions[i].evaluate(context);
      if (result) {
        return true;
      }
    }
    return false;
  }
  function createRules(version, rules) {
    return {
      version: version,
      rules: rules
    };
  }
  function createRule(condition, consequences) {
    return {
      execute: function execute(context) {
        if (condition.evaluate(context)) {
          return consequences;
        }
        return [];
      },
      toString: function toString() {
        return "Rule{condition=" + condition + ", consequences=" + consequences + "}";
      }
    };
  }
  function createCondition(type, definition) {
    return {
      evaluate: function evaluate(context) {
        return definition.evaluate(context);
      },
      toString: function toString() {
        return "Condition{type=" + type + ", definition=" + definition + "}";
      }
    };
  }
  function createConsequence(id, type, detail) {
    return {
      id: id,
      type: type,
      detail: detail
    };
  }
  function createGroupDefinition(logic, conditions) {
    return {
      evaluate: function evaluate(context) {
        if (LogicType.AND === logic) {
          return evaluateAnd(context, conditions);
        }
        if (LogicType.OR === logic) {
          return evaluateOr(context, conditions);
        }
        return false;
      }
    };
  }
  function createMatcherDefinition(key, matcherKey, values) {
    return {
      evaluate: function evaluate(context) {
        var matcher = getMatcher(matcherKey);
        if (!matcher) {
          return false;
        }
        return matcher.matches(context, key, values);
      }
    };
  }
  function createHistoricalDefinition(events, matcherKey, value, from, to, searchType) {
    return {
      evaluate: function evaluate(context) {
        var eventCount;
        if (SearchType.ORDERED === searchType) {
          eventCount = queryAndCountOrderedEvent(events, context, from, to);
        } else {
          eventCount = queryAndCountAnyEvent(events, context, from, to);
        }
        return checkForHistoricalMatcher(eventCount, matcherKey, value);
      }
    };
  }
  function parseMatcherDefinition(definition) {
    var key = definition.key,
      matcher = definition.matcher,
      values = definition.values;
    return createMatcherDefinition(key, matcher, values);
  }
  function parseGroupDefinition(definition) {
    var logic = definition.logic,
      conditions = definition.conditions;
    return createGroupDefinition(logic, conditions.map(parseCondition));
  }
  function parseHistoricalDefinition(definition) {
    var events = definition.events,
      from = definition.from,
      to = definition.to,
      matcher = definition.matcher,
      value = definition.value,
      searchType = definition.searchType;
    return createHistoricalDefinition(events, matcher, value, from, to, searchType);
  }
  function parseCondition(condition) {
    var type = condition.type,
      definition = condition.definition;
    if (ConditionType.MATCHER === type) {
      return createCondition(type, parseMatcherDefinition(definition));
    }
    if (ConditionType.GROUP === type) {
      return createCondition(type, parseGroupDefinition(definition));
    }
    if (ConditionType.HISTORICAL === type) {
      return createCondition(type, parseHistoricalDefinition(definition));
    }
    throw new Error("Can not parse condition");
  }
  function parseConsequence(consequence) {
    var id = consequence.id,
      type = consequence.type,
      detail = consequence.detail;
    return createConsequence(id, type, detail);
  }
  function parseRule(rule) {
    var condition = rule.condition,
      consequences = rule.consequences;
    return createRule(parseCondition(condition), consequences.map(parseConsequence));
  }
  function parseRules(ruleset) {
    var version = ruleset.version,
      rules = ruleset.rules;
    return createRules(version, rules.map(parseRule));
  }
  function RulesEngine(ruleset) {
    var _parseRules = parseRules(ruleset),
      version = _parseRules.version,
      rules = _parseRules.rules;
    return {
      execute: function execute(context) {
        return rules.map(function (rule) {
          return rule.execute(context);
        }).filter(function (arr) {
          return arr.length > 0;
        });
      },
      getVersion: function getVersion() {
        return version;
      },
      numRules: function numRules() {
        return rules.length;
      }
    };
  }

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var createRestoreStorage = function createRestoreStorage(storage, storageKey) {
    return function (defaultValue) {
      var stored = storage.getItem(storageKey);
      if (!stored) {
        return defaultValue;
      }
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultValue;
      }
    };
  };
  var createSaveStorage = function createSaveStorage(storage, storageKey) {
    var prepareFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (value) {
      return value;
    };
    return function (value) {
      storage.setItem(storageKey, JSON.stringify(prepareFn(value)));
    };
  };
  var getExpirationDate = function getExpirationDate(retentionPeriod) {
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - retentionPeriod);
    return expirationDate;
  };
  var getActivityId = function getActivityId(proposition) {
    var _proposition$scopeDet = proposition.scopeDetails,
      scopeDetails = _proposition$scopeDet === void 0 ? {} : _proposition$scopeDet;
    var _scopeDetails$activit = scopeDetails.activity,
      activity = _scopeDetails$activit === void 0 ? {} : _scopeDetails$activit;
    var id = activity.id;
    return id;
  };
  var createInMemoryStorage = function createInMemoryStorage() {
    var inMemoryStorage = {};
    return {
      getItem: function getItem(key) {
        return key in inMemoryStorage ? inMemoryStorage[key] : null;
      },
      setItem: function setItem(key, value) {
        inMemoryStorage[key] = value;
      }
    };
  };
  var clearLocalStorage = function clearLocalStorage(storage) {
    storage.clear();
  };
  var hasExperienceData = function hasExperienceData(xdm) {
    var _xdm$eventType = xdm.eventType,
      eventType = _xdm$eventType === void 0 ? "" : _xdm$eventType,
      _experience = xdm._experience;
    if (!eventType || eventType === "") {
      return false;
    }
    if (!_experience || _typeof(_experience) !== "object") {
      return false;
    }
    return true;
  };
  var getDecisionProvider = function getDecisionProvider(proposition) {
    var _proposition$scopeDet2 = proposition.scopeDetails,
      scopeDetails = _proposition$scopeDet2 === void 0 ? {} : _proposition$scopeDet2;
    var decisionProvider = scopeDetails.decisionProvider;
    return decisionProvider;
  };

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var flattenArray = function flattenArray() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var flat = [];
    if (!Array.isArray(items)) {
      return items;
    }
    items.forEach(function (item) {
      if (Array.isArray(item)) {
        flat.push.apply(flat, _toConsumableArray(flattenArray(item)));
      } else {
        flat.push(item);
      }
    });
    return flat;
  };

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var inAppMessageConsequenceAdapter = (function (id, type, detail) {
    var html = detail.html,
      mobileParameters = detail.mobileParameters;
    var webParameters = {};
    return {
      schema: MESSAGE_IN_APP,
      data: {
        mobileParameters: mobileParameters,
        webParameters: webParameters,
        content: html,
        contentType: TEXT_HTML
      },
      id: id
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var schemaTypeConsequenceAdapter = (function (id, type, detail) {
    var schema = detail.schema,
      data = detail.data,
      detailId = detail.id;
    return {
      schema: schema,
      data: data,
      id: detailId || id
    };
  });

  var _adapters;
  var CJM_IN_APP_MESSAGE_TYPE = "cjmiam";
  var SCHEMA = "schema";
  var adapters = (_adapters = {}, _defineProperty(_adapters, CJM_IN_APP_MESSAGE_TYPE, inAppMessageConsequenceAdapter), _defineProperty(_adapters, SCHEMA, schemaTypeConsequenceAdapter), _adapters);
  var createConsequenceAdapter = (function () {
    return function (consequence) {
      var id = consequence.id,
        type = consequence.type,
        detail = consequence.detail;
      return typeof adapters[type] === "function" ? adapters[type](id, type, detail) : detail;
    };
  });

  var isRulesetItem = function isRulesetItem(item) {
    var schema = item.schema,
      data = item.data;
    if (schema === RULESET_ITEM) {
      return true;
    }
    if (schema !== JSON_CONTENT_ITEM) {
      return false;
    }
    try {
      var content = typeof data.content === "string" ? JSON.parse(data.content) : data.content;
      return content && Object.prototype.hasOwnProperty.call(content, "version") && Object.prototype.hasOwnProperty.call(content, "rules");
    } catch (error) {
      return false;
    }
  };
  var createEvaluableRulesetPayload = (function (payload, eventRegistry, decisionHistory) {
    var consequenceAdapter = createConsequenceAdapter();
    var activityId = getActivityId(payload);
    var items = [];
    var addItem = function addItem(item) {
      var _item$data = item.data,
        data = _item$data === void 0 ? {} : _item$data,
        schema = item.schema;
      var content = schema === RULESET_ITEM ? data : data.content;
      if (!content) {
        return;
      }
      items.push(RulesEngine(typeof content === "string" ? JSON.parse(content) : content));
    };
    var evaluate = function evaluate(context) {
      var displayEvent = eventRegistry.getEvent(DISPLAY, activityId);
      var displayedDate = displayEvent ? displayEvent.firstTimestamp : undefined;
      var qualifyingItems = flattenArray(items.map(function (item) {
        return item.execute(context);
      })).map(consequenceAdapter).map(function (item) {
        var _ref = decisionHistory.recordQualified(activityId) || {},
          qualifiedDate = _ref.firstTimestamp;
        return _objectSpread2(_objectSpread2({}, item), {}, {
          data: _objectSpread2(_objectSpread2({}, item.data), {}, {
            qualifiedDate: qualifiedDate,
            displayedDate: displayedDate
          })
        });
      });
      return _objectSpread2(_objectSpread2({}, payload), {}, {
        items: qualifyingItems
      });
    };
    if (Array.isArray(payload.items)) {
      payload.items.filter(isRulesetItem).forEach(addItem);
    }
    return {
      evaluate: evaluate,
      isEvaluable: items.length > 0
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createDecisionHistory = (function (_ref) {
    var eventRegistry = _ref.eventRegistry;
    var recordQualified = function recordQualified(id) {
      if (!id) {
        return undefined;
      }
      return eventRegistry.addEvent({}, PropositionEventType.TRIGGER, id);
    };
    return {
      recordQualified: recordQualified
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createDecisionProvider = (function (_ref) {
    var eventRegistry = _ref.eventRegistry;
    var payloadsBasedOnActivityId = {};
    var decisionHistory = createDecisionHistory({
      eventRegistry: eventRegistry
    });
    var addPayload = function addPayload(payload) {
      var activityId = getActivityId(payload);
      if (!activityId) {
        return;
      }
      var evaluableRulesetPayload = createEvaluableRulesetPayload(payload, eventRegistry, decisionHistory);
      if (evaluableRulesetPayload.isEvaluable) {
        payloadsBasedOnActivityId[activityId] = evaluableRulesetPayload;
      }
    };
    var evaluate = function evaluate() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return Object.values(payloadsBasedOnActivityId).map(function (payload) {
        return payload.evaluate(context);
      }).filter(function (payload) {
        return payload.items.length > 0;
      });
    };
    var addPayloads = function addPayloads(personalizationPayloads) {
      personalizationPayloads.forEach(addPayload);
    };
    return {
      addPayload: addPayload,
      addPayloads: addPayloads,
      evaluate: evaluate
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createApplyResponse = (function (lifecycle) {
    return function (_ref) {
      var _ref$renderDecisions = _ref.renderDecisions,
        renderDecisions = _ref$renderDecisions === void 0 ? false : _ref$renderDecisions,
        _ref$propositions = _ref.propositions,
        propositions = _ref$propositions === void 0 ? [] : _ref$propositions,
        event = _ref.event,
        personalization = _ref.personalization;
      if (propositions.length > 0 && lifecycle) {
        lifecycle.onDecision({
          renderDecisions: renderDecisions,
          propositions: propositions,
          event: event,
          personalization: personalization
        });
      }
      return {
        propositions: propositions
      };
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var ADOBE_JOURNEY_OPTIMIZER = "AJO";

  var STORAGE_KEY = "events";
  var MAX_EVENT_RECORDS = 1000;
  var RETENTION_PERIOD = 30;
  var prefixed = function prefixed(key) {
    return "iam." + key;
  };
  var createEventPruner = function createEventPruner() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MAX_EVENT_RECORDS;
    var retentionPeriod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : RETENTION_PERIOD;
    return function (events) {
      var pruned = {};
      Object.keys(events).forEach(function (eventType) {
        pruned[eventType] = {};
        Object.values(events[eventType]).filter(function (entry) {
          return new Date(entry.firstTimestamp) >= getExpirationDate(retentionPeriod);
        }).sort(function (a, b) {
          return a.firstTimestamp - b.firstTimestamp;
        }).slice(-1 * limit).forEach(function (entry) {
          pruned[eventType][entry.event[prefixed("id")]] = entry;
        });
      });
      return pruned;
    };
  };
  var createEventRegistry = (function (_ref) {
    var storage = _ref.storage;
    var currentStorage = storage;
    var restore;
    var save;
    var events;
    var setStorage = function setStorage(newStorage) {
      currentStorage = newStorage;
      restore = createRestoreStorage(currentStorage, STORAGE_KEY);
      save = createSaveStorage(currentStorage, STORAGE_KEY, createEventPruner(MAX_EVENT_RECORDS, RETENTION_PERIOD));
      events = restore({});
    };
    setStorage(storage);
    var addEvent = function addEvent(event, eventType, eventId, action) {
      var _objectSpread2$1;
      if (!eventType || !eventId) {
        return undefined;
      }
      if (!events[eventType]) {
        events[eventType] = {};
      }
      var existingEvent = events[eventType][eventId];
      var count = existingEvent ? existingEvent.count : 0;
      var timestamp = new Date().getTime();
      var firstTimestamp = existingEvent ? existingEvent.firstTimestamp || existingEvent.timestamp : timestamp;
      events[eventType][eventId] = {
        event: _objectSpread2(_objectSpread2({}, event), {}, (_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, prefixed("id"), eventId), _defineProperty(_objectSpread2$1, prefixed("eventType"), eventType), _defineProperty(_objectSpread2$1, prefixed("action"), action), _objectSpread2$1)),
        firstTimestamp: firstTimestamp,
        timestamp: timestamp,
        count: count + 1
      };
      save(events);
      return events[eventType][eventId];
    };
    var addExperienceEdgeEvent = function addExperienceEdgeEvent(event) {
      var _event$getContent = event.getContent(),
        _event$getContent$xdm = _event$getContent.xdm,
        xdm = _event$getContent$xdm === void 0 ? {} : _event$getContent$xdm;
      var _experience = xdm._experience;
      if (!hasExperienceData(xdm)) {
        return;
      }
      var _experience$decisioni = _experience.decisioning,
        decisioning = _experience$decisioni === void 0 ? {} : _experience$decisioni;
      var _decisioning$proposit = decisioning.propositionEventType,
        propositionEventTypeObj = _decisioning$proposit === void 0 ? {} : _decisioning$proposit,
        _decisioning$proposit2 = decisioning.propositionAction,
        propositionAction = _decisioning$proposit2 === void 0 ? {} : _decisioning$proposit2,
        _decisioning$proposit3 = decisioning.propositions,
        propositions = _decisioning$proposit3 === void 0 ? [] : _decisioning$proposit3;
      var propositionEventTypesList = Object.keys(propositionEventTypeObj);

      // https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=CJM&title=Proposition+Event+Types
      if (propositionEventTypesList.length === 0) {
        return;
      }
      var validPropositionEventType = function validPropositionEventType(propositionEventType) {
        return propositionEventTypeObj[propositionEventType] === EVENT_TYPE_TRUE;
      };
      var action = propositionAction.id;
      propositionEventTypesList.filter(validPropositionEventType).forEach(function (propositionEventType) {
        propositions.forEach(function (proposition) {
          if (getDecisionProvider(proposition) !== ADOBE_JOURNEY_OPTIMIZER) {
            return;
          }
          addEvent({}, propositionEventType, getActivityId(proposition), action);
        });
      });
    };
    var getEvent = function getEvent(eventType, eventId) {
      if (!events[eventType]) {
        return undefined;
      }
      return events[eventType][eventId];
    };
    return {
      addExperienceEdgeEvent: addExperienceEdgeEvent,
      addEvent: addEvent,
      getEvent: getEvent,
      toJSON: function toJSON() {
        return events;
      },
      setStorage: setStorage
    };
  });

  var createContextProvider = (function (_ref) {
    var eventRegistry = _ref.eventRegistry,
      window = _ref.window;
    var pageLoadTimestamp = new Date().getTime();
    var getBrowserContext = function getBrowserContext() {
      return {
        name: getBrowser(window)
      };
    };
    var getPageContext = function getPageContext() {
      return _objectSpread2({
        title: window.title,
        url: window.url
      }, parseUrl(window.url));
    };
    var getReferrerContext = function getReferrerContext() {
      return _objectSpread2({
        url: window.referrer
      }, parseUrl(window.referrer));
    };
    var getTimeContext = function getTimeContext() {
      var now = new Date();
      var currentTimestamp = now.getTime();
      return {
        pageLoadTimestamp: pageLoadTimestamp,
        currentTimestamp: currentTimestamp,
        currentDate: now.getDate(),
        // Day of the week starts on Monday as is practiced in ISO 8601, but we want it to start on Sunday to match the authoring UI rule
        "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayofweek": now.getDay() + 1,
        "~state.com.adobe.module.lifecycle/lifecyclecontextdata.hourofday": now.getHours(),
        currentMinute: now.getMinutes(),
        currentMonth: now.getMonth(),
        currentYear: now.getFullYear(),
        pageVisitDuration: currentTimestamp - pageLoadTimestamp,
        "~timestampu": currentTimestamp / 1000,
        "~timestampz": now.toISOString()
      };
    };
    var getWindowContext = function getWindowContext() {
      var height = window.height;
      var width = window.width;
      var scrollY = window.scrollY;
      var scrollX = window.scrollX;
      return {
        height: height,
        width: width,
        scrollY: scrollY,
        scrollX: scrollX
      };
    };
    var coreGlobalContext = {
      browser: getBrowserContext(),
      page: getPageContext(),
      referringPage: getReferrerContext()
    };
    var getGlobalContext = function getGlobalContext() {
      return _objectSpread2(_objectSpread2(_objectSpread2({}, coreGlobalContext), getTimeContext()), {}, {
        window: getWindowContext(),
        "~sdkver": libraryVersion
      });
    };
    var getContext = function getContext() {
      var addedContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var context = _objectSpread2(_objectSpread2({}, getGlobalContext()), addedContext);
      return _objectSpread2(_objectSpread2({}, flattenObject$1(context)), {}, {
        events: eventRegistry.toJSON()
      });
    };
    return {
      getContext: getContext
    };
  });

  var defaultPreprocessor = function defaultPreprocessor(params) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return args;
  };

  // eslint-disable-next-line no-unused-vars
  var defaultEmissionCondition = function defaultEmissionCondition(params) {
    return true;
  };
  var createSubscription = function createSubscription() {
    var preprocessor = defaultPreprocessor;
    var emissionCondition = defaultEmissionCondition;
    var counter = 0;
    var subscriptions = {};
    var createUnsubscribe = function createUnsubscribe(id) {
      return function () {
        delete subscriptions[id];
      };
    };
    var add = function add(callback) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      if (typeof callback !== "function") {
        return function () {
          return undefined;
        };
      }
      counter += 1;
      subscriptions[counter] = {
        callback: callback,
        params: params
      };
      return createUnsubscribe(counter);
    };
    var setEmissionPreprocessor = function setEmissionPreprocessor(value) {
      if (typeof value === "function") {
        preprocessor = value;
      }
    };
    var setEmissionCondition = function setEmissionCondition(value) {
      if (typeof value === "function") {
        emissionCondition = value;
      }
    };
    var emit = function emit() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      values(subscriptions).forEach(function (_ref) {
        var callback = _ref.callback,
          params = _ref.params;
        var result = preprocessor.apply(void 0, [params].concat(args));
        if (emissionCondition.apply(void 0, [params].concat(_toConsumableArray(result)))) {
          callback.apply(void 0, _toConsumableArray(result));
        }
      });
    };
    var hasSubscriptions = function hasSubscriptions() {
      return Object.keys(subscriptions).length > 0;
    };
    return {
      add: add,
      emit: emit,
      hasSubscriptions: hasSubscriptions,
      setEmissionPreprocessor: setEmissionPreprocessor,
      setEmissionCondition: setEmissionCondition
    };
  };

  var validateOptions$1 = function validateOptions(_ref) {
    var options = _ref.options;
    var validator = boundObjectOf({
      surfaces: boundArrayOf(boundString()).uniqueItems(),
      schemas: boundArrayOf(boundString()).uniqueItems(),
      callback: boundCallback().required()
    }).noUnknownFields();
    return validator(options);
  };
  var emissionPreprocessor = function emissionPreprocessor(params, propositions) {
    var surfacesFilter = params.surfacesFilter,
      schemasFilter = params.schemasFilter;
    var result = {
      propositions: propositions.filter(function (payload) {
        return surfacesFilter ? includes(surfacesFilter, payload.scope) : true;
      }).map(function (payload) {
        var _payload$items = payload.items,
          items = _payload$items === void 0 ? [] : _payload$items;
        return _objectSpread2(_objectSpread2({}, payload), {}, {
          items: items.filter(function (item) {
            return schemasFilter ? includes(schemasFilter, item.schema) : true;
          })
        });
      }).filter(function (payload) {
        return payload.items.length > 0;
      })
    };
    return [result];
  };
  var emissionCondition = function emissionCondition(params, result) {
    return result.propositions.length > 0;
  };
  var createSubscribeRulesetItems = (function () {
    var subscription = createSubscription();
    subscription.setEmissionPreprocessor(emissionPreprocessor);
    subscription.setEmissionCondition(emissionCondition);
    var run = function run(_ref2) {
      var surfaces = _ref2.surfaces,
        schemas = _ref2.schemas,
        callback = _ref2.callback;
      var unsubscribe = subscription.add(callback, {
        surfacesFilter: surfaces instanceof Array ? surfaces : undefined,
        schemasFilter: schemas instanceof Array ? schemas : undefined
      });
      return Promise.resolve({
        unsubscribe: unsubscribe
      });
    };
    var optionsValidator = function optionsValidator(options) {
      return validateOptions$1({
        options: options
      });
    };
    var refresh = function refresh(propositions) {
      if (!subscription.hasSubscriptions()) {
        return;
      }
      subscription.emit(propositions);
    };
    return {
      refresh: refresh,
      command: {
        optionsValidator: optionsValidator,
        run: run
      }
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var CONTEXT_KEY = {
    TYPE: "~type",
    SOURCE: "~source"
  };
  var CONTEXT_EVENT_TYPE = {
    LIFECYCLE: "com.adobe.eventType.lifecycle",
    TRACK: "com.adobe.eventType.generic.track",
    EDGE: "com.adobe.eventType.edge",
    RULES_ENGINE: "com.adobe.eventType.rulesEngine"
  };
  var CONTEXT_EVENT_SOURCE = {
    LAUNCH: "com.adobe.eventSource.applicationLaunch",
    REQUEST: "com.adobe.eventSource.requestContent"
  };

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var validateOptions = function validateOptions(_ref) {
    var options = _ref.options;
    var validator = boundObjectOf({
      renderDecisions: boundBoolean(),
      personalization: boundObjectOf({
        decisionContext: boundObjectOf({})
      })
    }).noUnknownFields();
    return validator(options);
  };
  var createEvaluateRulesetsCommand = (function (_ref2) {
    var contextProvider = _ref2.contextProvider,
      decisionProvider = _ref2.decisionProvider;
    var run = function run(_ref3) {
      var renderDecisions = _ref3.renderDecisions,
        decisionContext = _ref3.decisionContext,
        applyResponse = _ref3.applyResponse;
      return applyResponse({
        renderDecisions: renderDecisions,
        propositions: decisionProvider.evaluate(contextProvider.getContext(decisionContext))
      });
    };
    var optionsValidator = function optionsValidator(options) {
      return validateOptions({
        options: options
      });
    };
    return {
      optionsValidator: optionsValidator,
      run: run
    };
  });

  var createDecisioningEngine = function createDecisioningEngine(_ref) {
    var config = _ref.config,
      createNamespacedStorage = _ref.createNamespacedStorage,
      consent = _ref.consent;
    var orgId = config.orgId,
      personalizationStorageEnabled = config.personalizationStorageEnabled;
    var storage = createNamespacedStorage(sanitizeOrgIdForCookieName(orgId) + ".decisioning.");
    if (!personalizationStorageEnabled) {
      clearLocalStorage(storage.persistent);
    }
    var eventRegistry = createEventRegistry({
      storage: createInMemoryStorage()
    });
    var decisionProvider = createDecisionProvider({
      eventRegistry: eventRegistry
    });
    var contextProvider = createContextProvider({
      eventRegistry: eventRegistry,
      window: window
    });
    var evaluateRulesetsCommand = createEvaluateRulesetsCommand({
      contextProvider: contextProvider,
      decisionProvider: decisionProvider
    });
    var subscribeRulesetItems = createSubscribeRulesetItems();
    var applyResponse;
    return {
      lifecycle: {
        onDecision: function onDecision(_ref2) {
          var propositions = _ref2.propositions;
          subscribeRulesetItems.refresh(propositions);
        },
        onComponentsRegistered: function onComponentsRegistered(tools) {
          applyResponse = createApplyResponse(tools.lifecycle);
          if (personalizationStorageEnabled) {
            consent.awaitConsent().then(function () {
              eventRegistry.setStorage(storage.persistent);
            }).catch(function () {
              if (storage) {
                clearLocalStorage(storage.persistent);
              }
            });
          }
        },
        onBeforeEvent: function onBeforeEvent(_ref3) {
          var _objectSpread2$1;
          var event = _ref3.event,
            renderDecisions = _ref3.renderDecisions,
            _ref3$personalization = _ref3.personalization,
            personalization = _ref3$personalization === void 0 ? {} : _ref3$personalization,
            _ref3$onResponse = _ref3.onResponse,
            onResponse = _ref3$onResponse === void 0 ? noop$1 : _ref3$onResponse;
          var _personalization$deci = personalization.decisionContext,
            decisionContext = _personalization$deci === void 0 ? {} : _personalization$deci;
          onResponse(createOnResponseHandler({
            renderDecisions: renderDecisions,
            decisionProvider: decisionProvider,
            applyResponse: applyResponse,
            event: event,
            personalization: personalization,
            decisionContext: contextProvider.getContext(_objectSpread2((_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, CONTEXT_KEY.TYPE, CONTEXT_EVENT_TYPE.EDGE), _defineProperty(_objectSpread2$1, CONTEXT_KEY.SOURCE, CONTEXT_EVENT_SOURCE.REQUEST), _objectSpread2$1), decisionContext))
          }));
          eventRegistry.addExperienceEdgeEvent(event);
        }
      },
      commands: {
        evaluateRulesets: {
          run: function run(_ref4) {
            var _objectSpread3;
            var renderDecisions = _ref4.renderDecisions,
              _ref4$personalization = _ref4.personalization,
              personalization = _ref4$personalization === void 0 ? {} : _ref4$personalization;
            var _personalization$deci2 = personalization.decisionContext,
              decisionContext = _personalization$deci2 === void 0 ? {} : _personalization$deci2;
            return evaluateRulesetsCommand.run({
              renderDecisions: renderDecisions,
              decisionContext: _objectSpread2((_objectSpread3 = {}, _defineProperty(_objectSpread3, CONTEXT_KEY.TYPE, CONTEXT_EVENT_TYPE.RULES_ENGINE), _defineProperty(_objectSpread3, CONTEXT_KEY.SOURCE, CONTEXT_EVENT_SOURCE.REQUEST), _objectSpread3), decisionContext),
              applyResponse: applyResponse
            });
          },
          optionsValidator: evaluateRulesetsCommand.optionsValidator
        },
        subscribeRulesetItems: subscribeRulesetItems.command
      }
    };
  };
  createDecisioningEngine.namespace = "DecisioningEngine";
  createDecisioningEngine.configValidators = boundObjectOf({
    personalizationStorageEnabled: boundBoolean().default(false)
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var processResponse = (function (_ref) {
    var response = _ref.response;
    return {
      inferences: response.getPayloadsByType("rtml:inferences")
    };
  });

  /*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createMachineLearning = function createMachineLearning() {
    return {
      lifecycle: {
        onResponse: processResponse
      },
      commands: {}
    };
  };
  createMachineLearning.namespace = "MachineLearning";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // TODO: Register the Components here statically for now. They might be registered differently.
  // TODO: Figure out how sub-components will be made available/registered
  var componentCreators = [createDataCollector, createActivityCollector, createIdentity, createAudiences, createPersonalization, createContext, createPrivacy, createEventMerge, createLibraryInfo, createMachineLearning, createDecisioningEngine];

  var CONFIG_DOC_URI = "https://adobe.ly/3sHh553";
  var transformOptions = function transformOptions(_ref) {
    var combinedConfigValidator = _ref.combinedConfigValidator,
      options = _ref.options,
      logger = _ref.logger;
    try {
      var validator = combinedConfigValidator.noUnknownFields().required();
      return validator.call({
        logger: logger
      }, options);
    } catch (e) {
      throw new Error("Resolve these configuration problems:\n\t - " + e.message.split("\n").join("\n\t - ") + "\nFor configuration documentation see: " + CONFIG_DOC_URI);
    }
  };
  var buildAllOnInstanceConfiguredExtraParams = function buildAllOnInstanceConfiguredExtraParams(config, logger, componentCreators) {
    return componentCreators.reduce(function (memo, _ref2) {
      var buildOnInstanceConfiguredExtraParams = _ref2.buildOnInstanceConfiguredExtraParams;
      if (buildOnInstanceConfiguredExtraParams) {
        reactorObjectAssign(memo, buildOnInstanceConfiguredExtraParams({
          config: config,
          logger: logger
        }));
      }
      return memo;
    }, {});
  };
  var wrapLoggerInQueue = function wrapLoggerInQueue(logger) {
    var queue = [];
    var queuedLogger = {
      get enabled() {
        return logger.enabled;
      },
      flush: function flush() {
        queue.forEach(function (_ref3) {
          var method = _ref3.method,
            args = _ref3.args;
          return logger[method].apply(logger, _toConsumableArray(args));
        });
      }
    };
    Object.keys(logger).filter(function (key) {
      return typeof logger[key] === "function";
    }).forEach(function (method) {
      queuedLogger[method] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        queue.push({
          method: method,
          args: args
        });
      };
    });
    return queuedLogger;
  };
  var buildAndValidateConfig = (function (_ref4) {
    var options = _ref4.options,
      componentCreators = _ref4.componentCreators,
      coreConfigValidators = _ref4.coreConfigValidators,
      createConfig = _ref4.createConfig,
      logger = _ref4.logger,
      setDebugEnabled = _ref4.setDebugEnabled;
    // We wrap the logger in a queue in case debugEnabled is set in the config
    // but we need to log something before the config is created.
    var queuedLogger = wrapLoggerInQueue(logger);
    var combinedConfigValidator = componentCreators.map(function (_ref5) {
      var configValidators = _ref5.configValidators;
      return configValidators;
    }).filter(function (configValidators) {
      return configValidators;
    }).reduce(function (validator, configValidators) {
      return validator.concat(configValidators);
    }, coreConfigValidators);
    var config = createConfig(transformOptions({
      combinedConfigValidator: combinedConfigValidator,
      options: options,
      logger: queuedLogger
    }));
    setDebugEnabled(config.debugEnabled, {
      fromConfig: true
    });
    queuedLogger.flush();
    // eslint-disable-next-line no-underscore-dangle
    var extraParams = buildAllOnInstanceConfiguredExtraParams(config, logger, componentCreators);
    logger.logOnInstanceConfigured(_objectSpread2(_objectSpread2({}, extraParams), {}, {
      config: config
    }));
    return config;
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var initializeComponents = (function (_ref) {
    var componentCreators = _ref.componentCreators,
      lifecycle = _ref.lifecycle,
      componentRegistry = _ref.componentRegistry,
      getImmediatelyAvailableTools = _ref.getImmediatelyAvailableTools;
    componentCreators.forEach(function (createComponent) {
      var namespace = createComponent.namespace;
      // TO-DOCUMENT: Helpers that we inject into factories.
      var tools = getImmediatelyAvailableTools(namespace);
      var component;
      try {
        component = createComponent(tools);
      } catch (error) {
        throw stackError({
          error: error,
          message: "[" + namespace + "] An error occurred during component creation."
        });
      }
      componentRegistry.register(namespace, component);
    });
    return lifecycle.onComponentsRegistered({
      lifecycle: lifecycle
    }).then(function () {
      return componentRegistry;
    });
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createConfig = function createConfig(options) {
    return reactorObjectAssign({}, options);
  };

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var EDGE = "edge.adobedc.net";
  var ID_THIRD_PARTY = "adobedc.demdex.net";

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var EDGE_BASE_PATH = "ee";

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createCoreConfigs = (function () {
    return boundObjectOf({
      debugEnabled: boundBoolean().default(false),
      defaultConsent: boundEnumOf(IN, OUT, PENDING).default(IN),
      datastreamId: boundString().unique().required(),
      edgeDomain: boundString().domain().default(EDGE),
      edgeBasePath: boundString().nonEmpty().default(EDGE_BASE_PATH),
      orgId: boundString().unique().required(),
      onBeforeEventSend: boundCallback().default(noop$1),
      edgeConfigOverrides: validateConfigOverride
    }).deprecated("edgeConfigId", boundString().unique(), "datastreamId");
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectHandleError = (function (_ref) {
    var errorPrefix = _ref.errorPrefix,
      logger = _ref.logger;
    return function (error, operation) {
      var err = toError(error);

      // In the case of declined consent, we've opted to not reject the promise
      // returned to the customer, but instead resolve the promise with an
      // empty result object.
      if (err.code === DECLINED_CONSENT_ERROR_CODE) {
        logger.warn("The " + operation + " could not fully complete. " + err.message);
        return {};
      }
      updateErrorMessage({
        error: err,
        message: errorPrefix + " " + err.message
      });
      throw err;
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var injectSendFetchRequest = (function (_ref) {
    var fetch = _ref.fetch;
    return function (url, body) {
      return fetch(url, {
        method: "POST",
        cache: "no-cache",
        credentials: "include",
        // To set the cookie header in the request.
        headers: {
          "Content-Type": "text/plain; charset=UTF-8"
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: body
      }).then(function (response) {
        return response.text().then(function (responseBody) {
          return {
            statusCode: response.status,
            // We expose headers through a function instead of creating an object
            // with all the headers up front largely because the native
            // request.getResponseHeader method is case-insensitive but also because it prevents
            // us from having to add header parsing logic when using XHR to make requests.
            getHeader: function getHeader(name) {
              return response.headers.get(name);
            },
            body: responseBody
          };
        });
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var injectSendXhrRequest = (function (_ref) {
    var XMLHttpRequest = _ref.XMLHttpRequest;
    return function (url, body) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 0) {
              reject(new Error("Request aborted."));
            } else {
              resolve({
                statusCode: request.status,
                // We expose headers through a function instead of creating an object
                // with all the headers up front because:
                // 1. It avoids having to add header parsing code to get all headers.
                // 2. The native request.getResponseHeader method is case-insensitive.
                getHeader: function getHeader(name) {
                  return request.getResponseHeader(name);
                },
                body: request.responseText
              });
            }
          }
        };
        request.onloadstart = function () {
          request.responseType = "text";
        };
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
        request.withCredentials = true;
        request.onerror = reject;
        request.onabort = reject;
        request.send(body);
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var injectSendBeaconRequest = (function (_ref) {
    var sendBeacon = _ref.sendBeacon,
      sendFetchRequest = _ref.sendFetchRequest,
      logger = _ref.logger;
    return function (url, body) {
      var blob = new Blob([body], {
        type: "text/plain; charset=UTF-8"
      });
      if (!sendBeacon(url, blob)) {
        logger.info("Unable to use `sendBeacon`; falling back to `fetch`.");
        return sendFetchRequest(url, body);
      }

      // Using sendBeacon, we technically don't get a response back from
      // the server, but we'll resolve the promise with an object to maintain
      // consistency with other network strategies.
      return Promise.resolve({
        statusCode: 204,
        getHeader: function getHeader() {
          return null;
        },
        body: ""
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createLogger = (function (_ref) {
    var getDebugEnabled = _ref.getDebugEnabled,
      console = _ref.console,
      getMonitors = _ref.getMonitors,
      context = _ref.context;
    var prefix = "[" + context.instanceName + "]";
    if (context.componentName) {
      prefix += " [" + context.componentName + "]";
    }
    var notifyMonitors = function notifyMonitors(method, data) {
      var monitors = getMonitors();
      if (monitors.length > 0) {
        var dataWithContext = reactorObjectAssign({}, context, data);
        monitors.forEach(function (monitor) {
          if (monitor[method]) {
            monitor[method](dataWithContext);
          }
        });
      }
    };
    var log = function log(level) {
      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }
      notifyMonitors("onBeforeLog", {
        level: level,
        arguments: rest
      });
      if (getDebugEnabled()) {
        console[level].apply(console, [prefix].concat(rest));
      }
    };
    return {
      get enabled() {
        return getMonitors().length > 0 || getDebugEnabled();
      },
      logOnInstanceCreated: function logOnInstanceCreated(data) {
        notifyMonitors("onInstanceCreated", data);
        log("info", "Instance initialized.");
      },
      logOnInstanceConfigured: function logOnInstanceConfigured(data) {
        notifyMonitors("onInstanceConfigured", data);
        log("info", "Instance configured. Computed configuration:", data.config);
      },
      logOnBeforeCommand: function logOnBeforeCommand(data) {
        notifyMonitors("onBeforeCommand", data);
        log("info", "Executing " + data.commandName + " command. Options:", data.options);
      },
      logOnCommandResolved: function logOnCommandResolved(data) {
        notifyMonitors("onCommandResolved", data);
        log("info", data.commandName + " command resolved. Result:", data.result);
      },
      logOnCommandRejected: function logOnCommandRejected(data) {
        notifyMonitors("onCommandRejected", data);
        log("error", data.commandName + " command was rejected. Error:", data.error);
      },
      logOnBeforeNetworkRequest: function logOnBeforeNetworkRequest(data) {
        notifyMonitors("onBeforeNetworkRequest", data);
        log("info", "Request " + data.requestId + ": Sending request.", data.payload);
      },
      logOnNetworkResponse: function logOnNetworkResponse(data) {
        notifyMonitors("onNetworkResponse", data);
        var messagesSuffix = data.parsedBody || data.body ? "response body:" : "no response body.";
        log("info", "Request " + data.requestId + ": Received response with status code " + data.statusCode + " and " + messagesSuffix, data.parsedBody || data.body);
      },
      logOnNetworkError: function logOnNetworkError(data) {
        notifyMonitors("onNetworkError", data);
        log("error", "Request " + data.requestId + ": Network request failed.", data.error);
      },
      /**
       * Outputs informational message to the web console. In some
       * browsers a small "i" icon is displayed next to these items
       * in the web console's log.
       * @param {...*} arg Any argument to be logged.
       */
      info: log.bind(null, "info"),
      /**
       * Outputs a warning message to the web console.
       * @param {...*} arg Any argument to be logged.
       */
      warn: log.bind(null, "warn"),
      /**
       * Outputs an error message to the web console.
       * @param {...*} arg Any argument to be logged.
       */
      error: log.bind(null, "error")
    };
  });

  var _excluded = ["edgeConfigOverrides"];
  var EVENT_CANCELLATION_MESSAGE = "Event was canceled because the onBeforeEventSend callback returned false.";
  var createEventManager = (function (_ref) {
    var config = _ref.config,
      logger = _ref.logger,
      lifecycle = _ref.lifecycle,
      consent = _ref.consent,
      createEvent = _ref.createEvent,
      createDataCollectionRequestPayload = _ref.createDataCollectionRequestPayload,
      createDataCollectionRequest = _ref.createDataCollectionRequest,
      sendEdgeNetworkRequest = _ref.sendEdgeNetworkRequest,
      _applyResponse = _ref.applyResponse;
    var onBeforeEventSend = config.onBeforeEventSend,
      globalConfigOverrides = config.edgeConfigOverrides;
    return {
      createEvent: createEvent,
      /**
       * Sends an event. This includes running the event and payload through the
       * appropriate lifecycle hooks, sending the request to the server, and
       * handling the response.
       * @param {Object} event This will be JSON stringified and used inside the
       * request payload.
       * @param {Object} [options] Options to pass on to the onBeforeEvent
       * lifecycle method
       * @param {Object} [options.edgeConfigOverrides] Settings that take
       * precedence over the global datastream configuration, including which
       * datastream to use.
       * @returns {*}
       */
      sendEvent: function sendEvent(event) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var localConfigOverrides = options.edgeConfigOverrides,
          otherOptions = _objectWithoutProperties(options, _excluded);
        var requestParams = createRequestParams({
          payload: createDataCollectionRequestPayload(),
          localConfigOverrides: localConfigOverrides,
          globalConfigOverrides: globalConfigOverrides
        });
        var request = createDataCollectionRequest(requestParams);
        var onResponseCallbackAggregator = createCallbackAggregator();
        var onRequestFailureCallbackAggregator = createCallbackAggregator();
        return lifecycle.onBeforeEvent(_objectSpread2(_objectSpread2({}, otherOptions), {}, {
          event: event,
          onResponse: onResponseCallbackAggregator.add,
          onRequestFailure: onRequestFailureCallbackAggregator.add
        })).then(function () {
          requestParams.payload.addEvent(event);
          return consent.awaitConsent();
        }).then(function () {
          try {
            // NOTE: this calls onBeforeEventSend callback (if configured)
            event.finalize(onBeforeEventSend);
          } catch (error) {
            var throwError = function throwError() {
              throw error;
            };
            onRequestFailureCallbackAggregator.add(lifecycle.onRequestFailure);
            return onRequestFailureCallbackAggregator.call({
              error: error
            }).then(throwError, throwError);
          }

          // if the callback returns false, the event should not be sent
          if (!event.shouldSend()) {
            onRequestFailureCallbackAggregator.add(lifecycle.onRequestFailure);
            logger.info(EVENT_CANCELLATION_MESSAGE);
            var error = new Error(EVENT_CANCELLATION_MESSAGE);
            return onRequestFailureCallbackAggregator.call({
              error: error
            }).then(function () {
              // Ensure the promise gets resolved with undefined instead
              // of an array of return values from the callbacks.
            });
          }
          return sendEdgeNetworkRequest({
            request: request,
            runOnResponseCallbacks: onResponseCallbackAggregator.call,
            runOnRequestFailureCallbacks: onRequestFailureCallbackAggregator.call
          });
        });
      },
      applyResponse: function applyResponse(event) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var _options$renderDecisi = options.renderDecisions,
          renderDecisions = _options$renderDecisi === void 0 ? false : _options$renderDecisi,
          _options$decisionCont = options.decisionContext,
          decisionContext = _options$decisionCont === void 0 ? {} : _options$decisionCont,
          _options$responseHead = options.responseHeaders,
          responseHeaders = _options$responseHead === void 0 ? {} : _options$responseHead,
          _options$responseBody = options.responseBody,
          responseBody = _options$responseBody === void 0 ? {
            handle: []
          } : _options$responseBody,
          personalization = options.personalization;
        var payload = createDataCollectionRequestPayload();
        var request = createDataCollectionRequest({
          payload: payload
        });
        var onResponseCallbackAggregator = createCallbackAggregator();
        return lifecycle.onBeforeEvent({
          event: event,
          renderDecisions: renderDecisions,
          decisionContext: decisionContext,
          decisionScopes: [PAGE_WIDE_SCOPE],
          personalization: personalization,
          onResponse: onResponseCallbackAggregator.add,
          onRequestFailure: noop$1
        }).then(function () {
          payload.addEvent(event);
          return _applyResponse({
            request: request,
            responseHeaders: responseHeaders,
            responseBody: responseBody,
            runOnResponseCallbacks: onResponseCallbackAggregator.call
          });
        });
      }
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var STATE_STORE_HANDLE_TYPE = "state:store";
  var createCookieTransfer = (function (_ref) {
    var cookieJar = _ref.cookieJar,
      shouldTransferCookie = _ref.shouldTransferCookie,
      apexDomain = _ref.apexDomain,
      dateProvider = _ref.dateProvider;
    return {
      /**
       * When sending to a third-party endpoint, the endpoint won't be able to
       * access first-party cookies, therefore we transfer cookies into
       * the request body so they can be read by the server.
       */
      cookiesToPayload: function cookiesToPayload(payload, endpointDomain) {
        var isEndpointFirstParty = endsWith(endpointDomain, apexDomain);
        var state = {
          domain: apexDomain,
          cookiesEnabled: true
        };

        // If the endpoint is first-party, there's no need to transfer cookies
        // to the payload since they'll be automatically passed through cookie
        // headers.
        if (!isEndpointFirstParty) {
          var cookies = cookieJar.get();
          var entries = Object.keys(cookies).filter(shouldTransferCookie).map(function (qualifyingCookieName) {
            return {
              key: qualifyingCookieName,
              value: cookies[qualifyingCookieName]
            };
          });
          if (entries.length) {
            state.entries = entries;
          }
        }
        payload.mergeState(state);
      },
      /**
       * When receiving from a third-party endpoint, the endpoint won't be able to
       * write first-party cookies, therefore we write first-party cookies
       * as directed in the response body.
       */
      responseToCookies: function responseToCookies(response) {
        response.getPayloadsByType(STATE_STORE_HANDLE_TYPE).forEach(function (stateItem) {
          var options = {
            domain: apexDomain
          };
          var sameSite = stateItem.attrs && stateItem.attrs.SameSite && stateItem.attrs.SameSite.toLowerCase();
          if (stateItem.maxAge !== undefined) {
            // cookieJar expects "expires" as a date object
            options.expires = new Date(dateProvider().getTime() + stateItem.maxAge * 1000);
          }
          if (sameSite !== undefined) {
            options.sameSite = sameSite;
          }
          // When sameSite is set to none, the secure flag must be set.
          // Experience edge will not set the secure flag in these cases.
          if (sameSite === "none") {
            options.secure = true;
          }
          cookieJar.set(stateItem.key, stateItem.value, options);
        });
      }
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var MBOX_EDGE_CLUSTER = "mboxEdgeCluster";
  var AT_QA_MODE = "at_qa_mode";
  var MBOX = "mbox";

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectShouldTransferCookie = (function (_ref) {
    var orgId = _ref.orgId,
      targetMigrationEnabled = _ref.targetMigrationEnabled;
    return function (name) {
      // We have a contract with the server that we will pass
      // all cookies whose names are namespaced according to the
      // logic in isNamespacedCookieName as well as any legacy
      // cookie names (so that the server can handle migrating
      // identities on websites previously using Visitor.js)
      return isNamespacedCookieName(orgId, name) || name === AT_QA_MODE || targetMigrationEnabled && name === MBOX;
    };
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var apiVersion = "v1";

  var mergeLifecycleResponses = (function (returnValues) {
    // Merges all returned objects from all `onResponse` callbacks into
    // a single object that can later be returned to the customer.
    var lifecycleOnResponseReturnValues = returnValues.shift() || [];
    var consumerOnResponseReturnValues = returnValues.shift() || [];
    var lifecycleOnBeforeRequestReturnValues = returnValues;
    return assignConcatArrayValues.apply(void 0, [{}].concat(_toConsumableArray(lifecycleOnResponseReturnValues), _toConsumableArray(consumerOnResponseReturnValues), _toConsumableArray(lifecycleOnBeforeRequestReturnValues)));
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var handleRequestFailure = (function (onRequestFailureCallbackAggregator) {
    return function (error) {
      // Regardless of whether the network call failed, an unexpected status
      // code was returned, or the response body was malformed, we want to call
      // the onRequestFailure callbacks, but still throw the exception.
      var throwError = function throwError() {
        throw error;
      };
      return onRequestFailureCallbackAggregator.call({
        error: error
      }).then(throwError, throwError);
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectSendEdgeNetworkRequest = (function (_ref) {
    var config = _ref.config,
      lifecycle = _ref.lifecycle,
      cookieTransfer = _ref.cookieTransfer,
      sendNetworkRequest = _ref.sendNetworkRequest,
      createResponse = _ref.createResponse,
      processWarningsAndErrors = _ref.processWarningsAndErrors,
      getLocationHint = _ref.getLocationHint,
      getAssuranceValidationTokenParams = _ref.getAssuranceValidationTokenParams;
    var edgeDomain = config.edgeDomain,
      edgeBasePath = config.edgeBasePath,
      datastreamId = config.datastreamId;

    /**
     * Sends a network request that is aware of payload interfaces,
     * lifecycle methods, configured edge domains, response structures, etc.
     */
    return function (_ref2) {
      var request = _ref2.request,
        _ref2$runOnResponseCa = _ref2.runOnResponseCallbacks,
        runOnResponseCallbacks = _ref2$runOnResponseCa === void 0 ? noop$1 : _ref2$runOnResponseCa,
        _ref2$runOnRequestFai = _ref2.runOnRequestFailureCallbacks,
        runOnRequestFailureCallbacks = _ref2$runOnRequestFai === void 0 ? noop$1 : _ref2$runOnRequestFai;
      var onResponseCallbackAggregator = createCallbackAggregator();
      onResponseCallbackAggregator.add(lifecycle.onResponse);
      onResponseCallbackAggregator.add(runOnResponseCallbacks);
      var onRequestFailureCallbackAggregator = createCallbackAggregator();
      onRequestFailureCallbackAggregator.add(lifecycle.onRequestFailure);
      onRequestFailureCallbackAggregator.add(runOnRequestFailureCallbacks);
      return lifecycle.onBeforeRequest({
        request: request,
        onResponse: onResponseCallbackAggregator.add,
        onRequestFailure: onRequestFailureCallbackAggregator.add
      }).then(function () {
        var endpointDomain = request.getUseIdThirdPartyDomain() ? ID_THIRD_PARTY : edgeDomain;
        var locationHint = getLocationHint();
        var edgeBasePathWithLocationHint = locationHint ? edgeBasePath + "/" + locationHint : edgeBasePath;
        var configId = request.getDatastreamIdOverride() || datastreamId;
        var payload = request.getPayload();
        if (configId !== datastreamId) {
          payload.mergeMeta({
            sdkConfig: {
              datastream: {
                original: datastreamId
              }
            }
          });
        }
        var url = "https://" + endpointDomain + "/" + edgeBasePathWithLocationHint + "/" + apiVersion + "/" + request.getAction() + "?configId=" + configId + "&requestId=" + request.getId() + getAssuranceValidationTokenParams();
        cookieTransfer.cookiesToPayload(payload, endpointDomain);
        return sendNetworkRequest({
          requestId: request.getId(),
          url: url,
          payload: payload,
          useSendBeacon: request.getUseSendBeacon()
        });
      }).then(function (networkResponse) {
        processWarningsAndErrors(networkResponse);
        return networkResponse;
      }).catch(handleRequestFailure(onRequestFailureCallbackAggregator)).then(function (_ref3) {
        var parsedBody = _ref3.parsedBody,
          getHeader = _ref3.getHeader;
        // Note that networkResponse.parsedBody may be undefined if it was a
        // 204 No Content response. That's fine.
        var response = createResponse({
          content: parsedBody,
          getHeader: getHeader
        });
        cookieTransfer.responseToCookies(response);

        // Notice we're calling the onResponse lifecycle method even if there are errors
        // inside the response body. This is because the full request didn't actually fail--
        // only portions of it that are considered non-fatal (a specific, non-critical
        // Konductor plugin, for example).
        return onResponseCallbackAggregator.call({
          response: response
        }).then(mergeLifecycleResponses);
      });
    };
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  var NO_CONTENT = 204;
  var TOO_MANY_REQUESTS = 429;
  var BAD_GATEWAY = 502;
  var SERVICE_UNAVAILABLE = 503;
  var GATEWAY_TIMEOUT = 504;

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var MESSAGE_PREFIX = "The server responded with a";
  var injectProcessWarningsAndErrors = (function (_ref) {
    var logger = _ref.logger;
    return function (networkResponse) {
      var statusCode = networkResponse.statusCode,
        body = networkResponse.body,
        parsedBody = networkResponse.parsedBody;
      if (statusCode < 200 || statusCode >= 300 || !parsedBody && statusCode !== NO_CONTENT || parsedBody && !Array.isArray(parsedBody.handle)) {
        var bodyToLog = parsedBody ? JSON.stringify(parsedBody, null, 2) : body;
        var messageSuffix = bodyToLog ? "response body:\n" + bodyToLog : "no response body.";
        throw new Error(MESSAGE_PREFIX + " status code " + statusCode + " and " + messageSuffix);
      }
      if (parsedBody) {
        var _parsedBody$warnings = parsedBody.warnings,
          warnings = _parsedBody$warnings === void 0 ? [] : _parsedBody$warnings,
          _parsedBody$errors = parsedBody.errors,
          errors = _parsedBody$errors === void 0 ? [] : _parsedBody$errors;
        warnings.forEach(function (warning) {
          logger.warn(MESSAGE_PREFIX + " warning:", warning);
        });
        errors.forEach(function (error) {
          logger.error(MESSAGE_PREFIX + " non-fatal error:", error);
        });
      }
    };
  });

  /*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var injectGetLocationHint = (function (_ref) {
    var orgId = _ref.orgId,
      cookieJar = _ref.cookieJar;
    var clusterCookieName = getNamespacedCookieName(orgId, CLUSTER);
    var fromClusterCookie = function fromClusterCookie() {
      return cookieJar.get(clusterCookieName);
    };
    var fromTarget = function fromTarget() {
      var mboxEdgeCluster = cookieJar.get(MBOX_EDGE_CLUSTER);
      if (mboxEdgeCluster) {
        return "t" + mboxEdgeCluster;
      }
      return undefined;
    };
    return function () {
      return fromClusterCookie() || fromTarget();
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var MAX_RETRIES = 3;
  var RETRYABLE_STATUS_CODES = [TOO_MANY_REQUESTS, SERVICE_UNAVAILABLE, BAD_GATEWAY, GATEWAY_TIMEOUT];

  // These rules are in accordance with
  // https://git.corp.adobe.com/pages/experience-edge/konductor/#/apis/errors?id=handling-4xx-and-5xx-responses
  var isRequestRetryable = (function (_ref) {
    var response = _ref.response,
      retriesAttempted = _ref.retriesAttempted;
    return retriesAttempted < MAX_RETRIES && includes(RETRYABLE_STATUS_CODES, response.statusCode);
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */

  // The retry gets incrementally (but not exponentially) longer for each retry.
  var FIRST_DELAY_MILLIS = 1000;
  var INCREMENTAL_DELAY_MILLIS = 1000;

  // When the target delay is randomized, make it within the range of this percentage above or below the target delay.
  var MAX_RANDOM_VARIANCE_PERCENTAGE = 0.3;
  var calculateRetryDelay = function calculateRetryDelay(retriesAttempted) {
    var targetDelay = FIRST_DELAY_MILLIS + retriesAttempted * INCREMENTAL_DELAY_MILLIS;
    var maxVariance = targetDelay * MAX_RANDOM_VARIANCE_PERCENTAGE;
    var minDelay = targetDelay - maxVariance;
    var maxDelay = targetDelay + maxVariance;
    var randomizedDelayWithinRange = Math.round(minDelay + Math.random() * (maxDelay - minDelay));
    return randomizedDelayWithinRange;
  };
  var getDelayFromHeader = function getDelayFromHeader(response) {
    // According to the HTTP spec, if the header is defined, its value will be a string that
    // represents either:
    //  * An integer indicating the number of seconds to delay.
    //  * A date after which a retry may occur. The date would be in HTTP-date
    //    format (https://tools.ietf.org/html/rfc7231#section-7.1.1.1). When debugging, it can
    //    be helpful to know that this is the same format that a JavaScript date's
    //    toGMTString() returns.
    var headerValue = response.getHeader(RETRY_AFTER);
    var delayInMillis;
    if (headerValue) {
      var headerValueInt = parseInt(headerValue, 10);
      if (isInteger(headerValueInt)) {
        delayInMillis = headerValueInt * 1000;
      } else {
        delayInMillis = Math.max(0, new Date(headerValue).getTime() - new Date().getTime());
      }
    }
    return delayInMillis;
  };

  // These rules are in accordance with
  // https://git.corp.adobe.com/pages/experience-edge/konductor/#/apis/errors?id=handling-4xx-and-5xx-responses
  // For retry delays that don't come from a Retry-After response header, we try to stick with the following best
  // practices outlined in https://docs.microsoft.com/en-us/azure/architecture/best-practices/transient-faults:
  //  * Incremental retry
  //  * Random interval
  var getRequestRetryDelay = (function (_ref) {
    var response = _ref.response,
      retriesAttempted = _ref.retriesAttempted;
    // Technically, only 429 or 503 responses should have a Retry-After header, but we'll respect the
    // header if we find it on any response.
    var delayInMillis = getDelayFromHeader(response);

    // Note that the value of delay may be 0 at this point, which would be a valid delay we want to use
    // and not override, which is why we don't do:
    // if (!delay) { ... }
    if (delayInMillis === undefined) {
      delayInMillis = calculateRetryDelay(retriesAttempted);
    }
    return delayInMillis;
  });

  /*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var HTTP_STATUS_OK = 200;
  var injectApplyResponse = (function (_ref) {
    var cookieTransfer = _ref.cookieTransfer,
      lifecycle = _ref.lifecycle,
      createResponse = _ref.createResponse,
      processWarningsAndErrors = _ref.processWarningsAndErrors;
    return function (_ref2) {
      var request = _ref2.request,
        responseHeaders = _ref2.responseHeaders,
        responseBody = _ref2.responseBody,
        _ref2$runOnResponseCa = _ref2.runOnResponseCallbacks,
        runOnResponseCallbacks = _ref2$runOnResponseCa === void 0 ? noop$1 : _ref2$runOnResponseCa,
        _ref2$runOnRequestFai = _ref2.runOnRequestFailureCallbacks,
        runOnRequestFailureCallbacks = _ref2$runOnRequestFai === void 0 ? noop$1 : _ref2$runOnRequestFai;
      var onResponseCallbackAggregator = createCallbackAggregator();
      onResponseCallbackAggregator.add(lifecycle.onResponse);
      onResponseCallbackAggregator.add(runOnResponseCallbacks);
      var onRequestFailureCallbackAggregator = createCallbackAggregator();
      onRequestFailureCallbackAggregator.add(lifecycle.onRequestFailure);
      onRequestFailureCallbackAggregator.add(runOnRequestFailureCallbacks);
      var getHeader = function getHeader(key) {
        return responseHeaders[key];
      };
      return lifecycle.onBeforeRequest({
        request: request,
        onResponse: onResponseCallbackAggregator.add,
        onRequestFailure: onRequestFailureCallbackAggregator.add
      }).then(function () {
        return processWarningsAndErrors({
          statusCode: HTTP_STATUS_OK,
          getHeader: getHeader,
          body: JSON.stringify(responseBody),
          parsedBody: responseBody
        });
      }).catch(handleRequestFailure(onRequestFailureCallbackAggregator)).then(function () {
        var response = createResponse({
          content: responseBody,
          getHeader: getHeader
        });

        // This will clobber any cookies set via HTTP from the server.  So care should be given to remove any state:store handles if that is not desirable
        cookieTransfer.responseToCookies(response);
        return onResponseCallbackAggregator.call({
          response: response
        }).then(mergeLifecycleResponses);
      });
    };
  });

  /*
  Copyright 2019 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  var createNamespacedStorage = injectStorage(window);
  var _window = window,
    console$1 = _window.console,
    fetch = _window.fetch,
    navigator$1 = _window.navigator,
    XMLHttpRequest = _window.XMLHttpRequest;

  // set this up as a function so that monitors can be added at anytime
  // eslint-disable-next-line no-underscore-dangle
  var getMonitors = function getMonitors() {
    return window.__alloyMonitors || [];
  };
  var coreConfigValidators = createCoreConfigs();
  var apexDomain = getApexDomain(window, cookieJar);
  var sendFetchRequest = isFunction(fetch) ? injectSendFetchRequest({
    fetch: fetch
  }) : injectSendXhrRequest({
    XMLHttpRequest: XMLHttpRequest
  });
  var fireReferrerHideableImage = injectFireReferrerHideableImage();
  var getAssuranceValidationTokenParams = createGetAssuranceValidationTokenParams({
    window: window,
    createNamespacedStorage: createNamespacedStorage
  });
  var createExecuteCommand = function createExecuteCommand(_ref) {
    var instanceName = _ref.instanceName,
      _ref$logController = _ref.logController,
      setDebugEnabled = _ref$logController.setDebugEnabled,
      logger = _ref$logController.logger,
      createComponentLogger = _ref$logController.createComponentLogger;
    var componentRegistry = createComponentRegistry();
    var lifecycle = createLifecycle(componentRegistry);
    var setDebugCommand = function setDebugCommand(options) {
      setDebugEnabled(options.enabled, {
        fromConfig: false
      });
    };
    var loggingCookieJar = createLoggingCookieJar({
      logger: logger,
      cookieJar: cookieJar
    });
    var configureCommand = function configureCommand(options) {
      var config = buildAndValidateConfig({
        options: options,
        componentCreators: componentCreators,
        coreConfigValidators: coreConfigValidators,
        createConfig: createConfig,
        logger: logger,
        setDebugEnabled: setDebugEnabled
      });
      var orgId = config.orgId,
        targetMigrationEnabled = config.targetMigrationEnabled;
      var shouldTransferCookie = injectShouldTransferCookie({
        orgId: orgId,
        targetMigrationEnabled: targetMigrationEnabled
      });
      var cookieTransfer = createCookieTransfer({
        cookieJar: loggingCookieJar,
        shouldTransferCookie: shouldTransferCookie,
        apexDomain: apexDomain,
        dateProvider: function dateProvider() {
          return new Date();
        }
      });
      var sendBeaconRequest = isFunction(navigator$1.sendBeacon) ? injectSendBeaconRequest({
        // Without the bind(), the browser will complain about an
        // illegal invocation.
        sendBeacon: navigator$1.sendBeacon.bind(navigator$1),
        sendFetchRequest: sendFetchRequest,
        logger: logger
      }) : sendFetchRequest;
      var sendNetworkRequest = injectSendNetworkRequest({
        logger: logger,
        sendFetchRequest: sendFetchRequest,
        sendBeaconRequest: sendBeaconRequest,
        isRequestRetryable: isRequestRetryable,
        getRequestRetryDelay: getRequestRetryDelay
      });
      var processWarningsAndErrors = injectProcessWarningsAndErrors({
        logger: logger
      });
      var extractEdgeInfo = injectExtractEdgeInfo({
        logger: logger
      });
      var createResponse = injectCreateResponse({
        extractEdgeInfo: extractEdgeInfo
      });
      var getLocationHint = injectGetLocationHint({
        orgId: orgId,
        cookieJar: cookieJar
      });
      var sendEdgeNetworkRequest = injectSendEdgeNetworkRequest({
        config: config,
        lifecycle: lifecycle,
        cookieTransfer: cookieTransfer,
        sendNetworkRequest: sendNetworkRequest,
        createResponse: createResponse,
        processWarningsAndErrors: processWarningsAndErrors,
        getLocationHint: getLocationHint,
        getAssuranceValidationTokenParams: getAssuranceValidationTokenParams
      });
      var applyResponse = injectApplyResponse({
        lifecycle: lifecycle,
        cookieTransfer: cookieTransfer,
        createResponse: createResponse,
        processWarningsAndErrors: processWarningsAndErrors
      });
      var generalConsentState = createConsentStateMachine({
        logger: logger
      });
      var consent = createConsent({
        generalConsentState: generalConsentState,
        logger: logger
      });
      var eventManager = createEventManager({
        config: config,
        logger: logger,
        lifecycle: lifecycle,
        consent: consent,
        createEvent: createEvent,
        createDataCollectionRequestPayload: createDataCollectionRequestPayload,
        createDataCollectionRequest: createDataCollectionRequest,
        sendEdgeNetworkRequest: sendEdgeNetworkRequest,
        applyResponse: applyResponse
      });
      return initializeComponents({
        componentCreators: componentCreators,
        lifecycle: lifecycle,
        componentRegistry: componentRegistry,
        getImmediatelyAvailableTools: function getImmediatelyAvailableTools(componentName) {
          var componentLogger = createComponentLogger(componentName);
          return {
            config: config,
            componentRegistry: componentRegistry,
            consent: consent,
            eventManager: eventManager,
            fireReferrerHideableImage: fireReferrerHideableImage,
            logger: componentLogger,
            lifecycle: lifecycle,
            sendEdgeNetworkRequest: sendEdgeNetworkRequest,
            handleError: injectHandleError({
              errorPrefix: "[" + instanceName + "] [" + componentName + "]",
              logger: componentLogger
            }),
            createNamespacedStorage: createNamespacedStorage,
            apexDomain: apexDomain
          };
        }
      });
    };
    var handleError = injectHandleError({
      errorPrefix: "[" + instanceName + "]",
      logger: logger
    });
    var executeCommand = injectExecuteCommand({
      logger: logger,
      configureCommand: configureCommand,
      setDebugCommand: setDebugCommand,
      handleError: handleError,
      validateCommandOptions: validateCommandOptions
    });
    return executeCommand;
  };
  var core = (function () {
    // eslint-disable-next-line no-underscore-dangle
    var instanceNames = window.__alloyNS;
    if (instanceNames) {
      instanceNames.forEach(function (instanceName) {
        var logController = createLogController({
          console: console$1,
          locationSearch: window.location.search,
          createLogger: createLogger,
          instanceName: instanceName,
          createNamespacedStorage: createNamespacedStorage,
          getMonitors: getMonitors
        });
        var executeCommand = createExecuteCommand({
          instanceName: instanceName,
          logController: logController
        });
        var instance = createInstanceFunction(executeCommand);
        var queue = window[instanceName].q;
        queue.push = instance;
        logController.logger.logOnInstanceCreated({
          instance: instance
        });
        queue.forEach(instance);
      });
    }
  });

  /*
  Copyright 2020 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
  */
  core();

})();
