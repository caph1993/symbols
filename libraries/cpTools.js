//@ts-check
/// <reference path="./put.js" />


const cp = (() => {
  const events = (() => {

    /** @template T */
    class Signal {
      /** @type {T|undefined} */ value;

      /** @param {T} [value]*/
      constructor(value = undefined) {
        this.value = value;
        this._eventTarget = new EventTarget();
      }

      /** @param {T} [value] */
      emit(value = undefined) {
        this.value = value;
        this._eventTarget.dispatchEvent(new Event(''));
      }

      /** 
       * @overload
       * @param {((value:T) => any)|(() => any)} listener
       * @returns {Function}
       *
       * @overload
       * @param {{fire?:boolean, maxTimes?:number, minDuration?:number, mode?:string}|null} settings
       * @param {((value:T) => any)|(() => any)} listener
       * @returns {Function}
       * Function that subscribes a listener to the signal emissions.
       * Returns the unsubscribe callable.
       * Optional settings:
       *  - fire: if true, the listener is immediately called as well
       *  - maxTimes: if positive integer, unsubscribe will trigger automatically after the listener is called maxTimes
       *  - minDuration: (milliseconds) debounces the listener to ensure that no two successive (resolved or failed) calls occur in a time lapse of at most minDuration.
       *  - mode (useful when the signal emits at a higher rate than the listener can process):
       *     - queue: ensures a single execution of the listener at a time, putting incoming values in a queue
       *     - last: (default) ensures a single execution of the listener at a time, discarding all previous attempts to run except the last one
       *     - brute: just calls, possibly having concurrent executions
       * 
       */
      subscribe(...args) {
        if (args.length == 1) return this.subscribeLast(args[0]);
        const [settings, listener] = args;
        let { fire, maxTimes, minDuration, mode } = settings || {};
        fire = fire || false;
        maxTimes = maxTimes || 0;
        minDuration = minDuration || 0;
        mode = mode || "last";
        if (mode == 'queue') {
          return this.subscribeQueue(listener, fire, maxTimes, minDuration);
        }
        if (mode == 'brute') {
          if (minDuration) console.warn("minDuration is useless for brute subscription")
          return this.subscribeBrute(listener, fire, maxTimes);
        }
        if (mode != 'last') console.warn(`unknown mode "${mode}" setting to last`);
        return this.subscribeLast(listener, fire, maxTimes, minDuration);
      }

      /**
       * Similar to addEventListener, but if the event is fired many
       * times while onEvent is running, it will wait and fire only
       * the last call.
       * @param {((value:T) => any)|(() => any)} listener
       */
      subscribeLast(listener, fire = false, maxTimes = 0, minDuration = 0) {
        let awaiting = false;
        let unsubscribed = false;
        let pendingCall = false;
        if (maxTimes == 0) maxTimes = -1;
        const listenerWrapper = async () => {
          if (unsubscribed) return;
          if (awaiting) return pendingCall = true;
          while (true) {
            awaiting = true;
            pendingCall = false;
            let start = Date.now();
            try {
              let last = /** @type {T}*/(this.value);
              let promise = listener(last);
              promise = Promise.resolve(promise);
              await promise;
            } finally {
              awaiting = false;
            }
            if (minDuration) {
              let remaining = minDuration - (Date.now() - start);
              if (remaining > 0) await sleep(minDuration);
            }
            if (maxTimes > 0) maxTimes -= 1;
            if (maxTimes == 0) unsubscribe();
            if (!pendingCall) break;
            if (unsubscribed) break;
          }
        }
        const unsubscribe = () => {
          unsubscribed = true;
          this._eventTarget.removeEventListener('', listenerWrapper);
        }
        this._eventTarget.addEventListener('', listenerWrapper);
        if (fire) listenerWrapper();
        return unsubscribe;
      }

      /**
       * @param {((value:T) => any)|(() => any)} listener
       */
      subscribeQueue(listener, fire = false, maxTimes = 0, minDuration = 0) {
        let awaiting = false;
        let unsubscribed = false;
        let pendingCalls = [];
        if (maxTimes == 0) maxTimes = -1;
        const listenerWrapper = async () => {
          if (unsubscribed) return;
          pendingCalls.push(this.value);
          if (awaiting) return;
          while (true) {
            awaiting = true;
            let first = /** @type {T}*/(pendingCalls.shift());
            let start = Date.now();
            try {
              let promise = listener(first);
              promise = Promise.resolve(promise);
              await promise;
            } finally {
              awaiting = false;
            }
            if (minDuration) {
              let remaining = minDuration - (Date.now() - start);
              if (remaining > 0) await sleep(minDuration);
            }
            if (maxTimes > 0) maxTimes -= 1;
            if (maxTimes == 0) unsubscribe();
            if (!pendingCalls.length) break;
            if (unsubscribed) break;
          }
        }
        const unsubscribe = () => {
          unsubscribed = true;
          this._eventTarget.removeEventListener('', listenerWrapper);
        }
        this._eventTarget.addEventListener('', listenerWrapper);
        if (fire) listenerWrapper();
        return unsubscribe;
      }

      /**
       * @param {((value:T) => any)|(() => any)} listener
       */
      subscribeBrute(listener, fire = false, maxTimes = 0) {
        let unsubscribed = false;
        if (maxTimes == 0) maxTimes = -1;
        const listenerWrapper = async () => {
          if (unsubscribed) return;
          let last = /** @type {T}*/(this.value);
          try {
            let promise = listener(last);
            promise = Promise.resolve(promise);
            await promise;
          } finally { }
          if (maxTimes > 0) maxTimes -= 1;
          if (maxTimes == 0) unsubscribe();
        }
        const unsubscribe = () => {
          unsubscribed = true;
          this._eventTarget.removeEventListener('', listenerWrapper);
        }
        this._eventTarget.addEventListener('', listenerWrapper);
        if (fire) listenerWrapper();
        return unsubscribe;
      }

      /** Wait until the event is fired and callable() returns true
       * @param {number} [timeout]
       * @returns {Promise<T>}
       */
      untilTrue(timeout) {
        return this.until(() => this.value, timeout);
      }

      /** Wait until the event is fired and callable() returns true
       * @template T2
       * @param {(T)=>T2} callable
       * @param {number} [timeout]
       * @returns {Promise<NonNullable<T2>>}
       */
      until(callable, timeout) {
        return new Promise((resolve, reject) => {
          let out = callable(this.value);
          if (out) return resolve(out);
          const onLoad = () => {
            out = callable(this.value);
            if (!out) return;
            this._eventTarget.removeEventListener('', onLoad);
            resolve(out);
          }
          this._eventTarget.addEventListener('', onLoad);
          if (timeout) setTimeout(() => {
            this._eventTarget.removeEventListener('', onLoad);
            reject('timeout');
          }, timeout);
        });
      }
    }

    /**
     * @template T
     * @param {()=>T} callable
     * @param {Node=} parent
     * @returns {Promise<NonNullable<T>>}
      }
    */
    function untilDom(callable, parent) {
      // https://stackoverflow.com/a/61511955/3671939
      const _parent = parent || document.body;
      return new Promise(resolve => {
        let out = callable();
        if (out) return resolve(out);
        const observer = new MutationObserver(() => {
          const out = callable();
          if (!out) return;
          resolve(out);
          observer.disconnect();
        });
        observer.observe(_parent, { childList: true, subtree: true });
      });
    }
    // https://stackoverflow.com/a/61511955/3671939
    /** @param {string} selector @param {Node=} parent*/
    function untilQuery(selector, parent) {
      const callable = () => document.querySelector(selector);
      return untilDom(callable, parent);
    }
    const events = { Signal, untilDom, untilQuery };
    return events;
  })();

  const put = (() => {
    //https://github.com/kriszyp/put-selector/blob/master/LICENSE
    let forDocument, fragmentFasterHeuristic = /[-+,> ]/;
    // let selectorParse = /(?:\s*([-+ ,<>]))?\s*(\.|!\.?|#)?([-\w\u00A0-\uFFFF%$|]+)?(?:\[([^\]=]+)=?('(?:\\.|[^'])*'|"(?:\\.|[^"])*"|[^\]]*)\])?/g;
    // @caph1993:
    let selectorParse = /(?:\s*([-+ ,<>]))?\s*(\.|!\.?|#)?([-\w\u00A0-\uFFFF%$|@]+)?(?:\[([^\]=]+)=?('(?:\\.|[^'])*'|"(?:\\.|[^"])*"|[^\]]*)\])?/g;
    let namespaceIndex, namespaces = /**@type {*}*/(false),
      doc = document,
      ieCreateElement = typeof doc.createElement == "object"; // telltale sign of the old IE behavior with createElement that does not support later addition of name 
    function insertTextNode(element, text) {
      element.appendChild(doc.createTextNode(text));
    }
    /** @type {(...args)=>HTMLElement}*/
    function put(_topReferenceElement) {
      let topReferenceElement = /**@type {any}*/(_topReferenceElement);
      let fragment, lastSelectorArg, nextSibling, referenceElement, current,
        args = arguments,
        returnValue = args[0]; // use the first argument as the default return value in case only an element is passed in
      function insertLastElement() {
        // we perform insertBefore actions after the element is fully created to work properly with 
        // <input> tags in older versions of IE that require type attributes
        //	to be set before it is attached to a parent.
        // We also handle top level as a document fragment actions in a complex creation 
        // are done on a detached DOM which is much faster
        // Also if there is a parse error, we generally error out before doing any DOM operations (more atomic) 
        if (current && referenceElement && current != referenceElement) {
          (referenceElement == topReferenceElement &&
            // top level, may use fragment for faster access 
            (fragment ||
              // fragment doesn't exist yet, check to see if we really want to create it 
              (fragment = fragmentFasterHeuristic.test(argument) && doc.createDocumentFragment()))
            // any of the above fails just use the referenceElement  
            ? fragment : referenceElement).
            insertBefore(current, nextSibling || null); // do the actual insertion
        }
      }
      for (let i = 0; i < args.length; i++) {
        var argument = args[i];
        if (typeof argument == "object") {
          lastSelectorArg = false;
          if (argument instanceof Array) {
            // an array
            current = doc.createDocumentFragment();
            for (let key = 0; key < argument.length; key++) {
              current.appendChild(put(argument[key]));
            }
            argument = current;
          }
          if (argument.nodeType) {
            current = argument;
            insertLastElement();
            referenceElement = argument;
            nextSibling = 0;
          } else {
            // an object hash
            for (let key in argument) {
              current[key] = argument[key];
            }
          }
        } else if (lastSelectorArg) {
          // a text node should be created
          // take a scalar value, use createTextNode so it is properly escaped
          // createTextNode is generally several times faster than doing an escaped innerHTML insertion: http://jsperf.com/createtextnode-vs-innerhtml/2
          lastSelectorArg = false;
          insertTextNode(current, argument);
        } else {
          if (i < 1) {
            // if we are starting with a selector, there is no top element
            topReferenceElement = null;
          }
          lastSelectorArg = true;
          let leftoverCharacters = argument.replace(selectorParse, function (t, combinator, prefix, value, attrName, attrValue) {
            if (combinator) {
              // insert the last current object
              insertLastElement();
              if (combinator == '-' || combinator == '+') {
                // + or - combinator, 
                // TODO: add support for >- as a means of indicating before the first child?
                referenceElement = (nextSibling = (current || referenceElement)).parentNode;
                current = null;
                if (combinator == "+") {
                  nextSibling = nextSibling.nextSibling;
                }// else a - operator, again not in CSS, but obvious in it's meaning (create next element before the current/referenceElement)
              } else {
                if (combinator == "<") {
                  // parent combinator (not really in CSS, but theorized, and obvious in it's meaning)
                  referenceElement = current = (current || referenceElement).parentNode;
                } else {
                  if (combinator == ",") {
                    // comma combinator, start a new selector
                    referenceElement = topReferenceElement;
                  } else if (current) {
                    // else descendent or child selector (doesn't matter, treated the same),
                    referenceElement = current;
                  }
                  current = null;
                }
                nextSibling = 0;
              }
              if (current) {
                referenceElement = current;
              }
            }
            let tag = !prefix && value;
            if (tag || (!current && (prefix || attrName))) {
              if (tag == "$") {
                // this is a variable to be replaced with a text node
                insertTextNode(referenceElement, args[++i]);
              } else if (tag == "@") {
                // @caph1993: run function with this element
                const callable = args[++i];
                callable(referenceElement);
              } else if (tag.startsWith("@")) {
                // @caph1993: add event listener
                const callable = args[++i];
                const key = tag.slice(1);
                const handler = (...args) => callable(referenceElement, ...args);
                referenceElement.addEventListener(key, handler);
              } else {
                // Need to create an element
                tag = tag || put.defaultTag;
                let ieInputName = ieCreateElement && args[i + 1] && args[i + 1].name;
                if (ieInputName) {
                  // in IE, we have to use the crazy non-standard createElement to create input's that have a name 
                  tag = '<' + tag + ' name="' + ieInputName + '">';
                }
                // we switch between creation methods based on namespace usage
                current = namespaces && ~(namespaceIndex = tag.indexOf('|')) ?
                  doc.createElementNS(namespaces[tag.slice(0, namespaceIndex)], tag.slice(namespaceIndex + 1)) :
                  doc.createElement(tag);
              }
            }
            if (prefix) {
              if (value == "$") value = args[++i];
              if (prefix == "#") current.id = value;
              else {
                let currentClassName = current.className;
                let removed = currentClassName && (" " + currentClassName + " ").replace(" " + value + " ", " ");
                if (prefix == ".") {
                  current.className = currentClassName ? (removed + value).substring(1) : value;
                } else {
                  // else a '!' class removal
                  if (argument == "!") {
                    let parentNode;
                    // special signal to delete this element
                    if (ieCreateElement) {
                      // use the ol' innerHTML trick to get IE to do some cleanup
                      put("div", current, '<').innerHTML = "";
                    } else if (parentNode = current.parentNode) { // intentional assigment
                      // use a faster, and more correct (for namespaced elements) removal (http://jsperf.com/removechild-innerhtml)
                      parentNode.removeChild(current);
                    }
                  } else {
                    // we already have removed the class, just need to trim
                    removed = removed.substring(1, removed.length - 1);
                    // only assign if it changed, this can save a lot of time
                    if (removed != currentClassName) {
                      current.className = removed;
                    }
                  }
                }
                // CSS class removal
              }
            }
            if (attrName) {
              if (attrValue && (attrValue.charAt(0) === '"' || attrValue.charAt(0) === "'")) {
                // quoted string
                attrValue = attrValue.slice(1, -1).replace(/\\/g, '')
              }
              if (attrValue == "$") {
                attrValue = args[++i];
              }
              // [name=value]
              if (attrName == "style") {
                // handle the special case of setAttribute not working in old IE
                current.style.cssText = attrValue;
              } else {
                let method = attrName.charAt(0) == "!" ? (attrName = attrName.substring(1)) && 'removeAttribute' : 'setAttribute';
                // determine if we need to use a namespace
                namespaces && ~(namespaceIndex = attrName.indexOf('|')) ?
                  current[method + "NS"](namespaces[attrName.slice(0, namespaceIndex)], attrName.slice(namespaceIndex + 1), attrValue) :
                  current[method](attrName, attrValue);
              }
            }
            return '';
          });
          if (leftoverCharacters) {
            throw new SyntaxError("Unexpected char " + leftoverCharacters + " in " + argument);
          }
          insertLastElement();
          referenceElement = returnValue = current || referenceElement;
        }
      }
      if (topReferenceElement && fragment) {
        // we now insert the top level elements for the fragment if it exists
        topReferenceElement.appendChild(fragment);
      }
      return returnValue;
    }
    put.addNamespace = function (name, uri) {
      // @ts-ignore
      if (doc.createElementNS) {
        (namespaces || (namespaces = {}))[name] = uri;
      }
      // @ts-ignore for old IE
      else doc.namespaces.add(name, uri);
    };
    put.defaultTag = "div";
    put.forDocument = forDocument;
    return put;
  })();

  const elems = (() => {
    const head = put(document.head, 'div#cpTools-head');
    const body = put('div#cpTools-body');
    const popUp = put('div#cpTools-popUp.cpHidden');
    events.untilQuery('body', document).then(() => {
      put(document.body, popUp);
      put(document.body, body);
    });
    return { head, body, popUp };
  })();

  const sleep = async (/** @type {number} */ ms) => (
    await new Promise(resolve => setTimeout(resolve, ms))
  );

  const html = (() => {
    const parsers = {
      katex: [/(\$\$.*?\$\$|\$.*?\$)/gs, async m => {
        const displayMode = m.startsWith("$$");
        const skip = displayMode ? 2 : 1;
        const formula = m.slice(skip, -skip);
        const e = put('div');
        const katex = await cp.load('katex');
        katex.render(formula, e, { throwOnError: false, displayMode });
        return e.firstChild;
      }],
      code: [/\\\`\\\`\\\`(.*?)\\\`\\\`\\\`/gs, async m => {
        const code = m.slice(6, -6).trim().replace(/^.*?\n(.*)$/gs, '$1');
        const options = { mode: 'text/javascript' };
        const putCodemirror = await cp.load('putCodemirror');
        return putCodemirror(code, options);
      }],
      codeInline: [/\\\`(.*?)\\\`/g, m => html`<code>${m[1]}</code>`]
    }

    /** @typedef {string|number|boolean|{[key:string]:any}} _T0 */
    /** @typedef {_T0|Node} _T1 */
    /** @typedef {_T1|Promise<_T1>} _T2 */
    /** @typedef {_T2} _T3 */
    /** @typedef {_T3|_T3[]} _T4 */

    const parseText = (/** @type {_T0} */ v) => {
      if (typeof v === 'string') return v;
      if (v instanceof String) return v.toString();
      if (Number.isFinite(v)) return `${v}`;
      if (!v) '';
      return JSON.stringify(v);
    }

    /** @param {string} text @returns {Text}*/
    function putText(text) {
      const elem = document.createTextNode('');
      elem.textContent = text;
      return elem;
    }

    const parseValue = (/** @type {_T3} */v) => {
      if (v instanceof Promise) {
        const tmpDiv = document.createElement('div');
        tmpDiv.classList.add('cpTmp');
        v.then(value => tmpDiv.replaceWith(...putHtml`${value}`));
        return tmpDiv;
      }
      if (v instanceof Node) return v;
      if (v instanceof events.Signal) {
        if (v.value instanceof Node) {

        } else {
          let elem = putText(parseText(v.value));
          v.subscribeLast(text => elem.textContent = parseText(text));
          return elem;
        }
      }
      return putText(parseText(v));
    }

    /**  DOES NOT WORK for td nor th!!!
     * @param {TemplateStringsArray} htmlTemplateString
     * @param {_T4[]} variables
     * @returns {Node[]}
     * */
    function putHtml(htmlTemplateString, ...variables) {
      let wrapper = document.createElement('div');
      let /** @type {readonly string[]}*/ htmlSeq = (htmlTemplateString.raw || htmlTemplateString);
      let varKey = 'placeholderForPutVariable';
      let html = htmlSeq.join(`<div ${varKey}></div>`)
      // Comments shift placeholder replacements
      html = html.replace(/<!--.*?-->/gs, '');
      const values = {};
      const valuesIdx = {};
      for (let key of Object.keys(parsers)) {
        const [reg, elemFactory] = parsers[key];
        values[key] = [];
        valuesIdx[key] = 0;
        html = html.replace(reg, m => {
          values[key].push(elemFactory(m));
          return `<div ${varKey}="${key}"></div>`
        });
      }
      html = html.replace(/\s*\n(\s*\n)+/g, '<div class="parBreak"></div>');
      wrapper.innerHTML = html;
      values[''] = variables;
      valuesIdx[''] = 0;
      let replacements = [];
      const dfs = (/** @type {Node}*/root) => {
        for (let child of root.childNodes) {
          const isPlaceholder = (
            child.nodeName == "DIV"
            && child instanceof HTMLElement
            && child.attributes[varKey]
          );
          if (!isPlaceholder) dfs(child);
          else {
            const key = isPlaceholder.value;
            const value = values[key][valuesIdx[key]++];
            replacements.push({ element: child, value });
          }
        }
      }
      dfs(wrapper);
      for (let { element, value } of replacements) {
        let values = (Array.isArray(value) ? value : [value]).map(parseValue);
        element.replaceWith(.../**@type {*}*/(values));
      }
      return [...wrapper.childNodes];
    }

    return putHtml;
  })();

  const utils = (() => {
    const getUrl = (/** @type {string}*/path) => {
      return new URL(path, document.baseURI).href;
    }
    /** https://github.com/Microsoft/TypeScript/issues/23405#issuecomment-873331031 */
    /** @template T  @param {T} value @param {string} [valueName] @returns {T extends undefined ? never : T} */
    function assertDef(value, valueName) {
      if (value === undefined) {
        throw new Error(`Encountered unexpected undefined value${valueName ? ` for '${valueName}'` : ""}`);
      }
      return /** @type {*} */ (value);
    }
    /** @template T @param {T} value @returns {T extends null ? never : T} */
    function assertNonNull(value) {
      if (!value && (value === null || value === undefined)) throw new Error(`Encountered unexpected undefined value`);
      return /** @type {*} */ (value);
    }
    /** @template T @param {T} value @returns {T extends null ? never : T} */
    function nonNull(value) { return /** @type {*} */ (value); }
    /** @type {(n: number) => number[]} */
    function range(n) {
      return [...Array(n).fill(0)].map((x, i) => i);
    }
    /** @type {(obj: any) => obj is String} */
    function isString(obj) {
      return Object.prototype.toString.call(obj) === "[object String]";
    }
    function rand32() {
      const rand = new Uint32Array(1);
      window.crypto.getRandomValues(rand);
      return rand[0];
    }
    /** random string of letters only */
    const randAZ = (/** @type {number} */ length) => {
      const rand = crypto.getRandomValues(new Uint8Array(length * 2));
      let out = btoa(String.fromCharCode(...rand)).replace(/[+/]|\d/g, "");
      if (out.length < length) out += randAZ(length);
      return out.substring(0, length);
    }
    /** @template T @param {()=>(T|Promise<T>)} func @returns {Promise<NonNullable<T>>} */
    async function untilTimed(func, { ms = 200, timeout = 0 } = {}) {
      if (timeout && ms > timeout) ms = timeout / 10;
      let t0 = (new Date()).getTime();
      let value;
      while (!(value = await func())) {
        if (timeout && (new Date()).getTime() - t0 > timeout)
          throw 'timeout';
        await sleep(ms);
      }
      return value;
    }
    /** @template T @param {T[]} arrA @param {any[]} arrB @returns {T[]}*/
    const arrDiff = (arrA, arrB) => {
      const setB = new Set(arrB);
      return [...new Set(arrA)].filter(x => !setB.has(x));
    }
    /** @template T @param {T[]} arr @returns {boolean}*/
    const all = (arr) => {
      for (let x of arr) if (!x) return false;
      return true;
    }
    /** @template T @param {T[]} arr @returns {boolean}*/
    const any = (arr) => {
      for (let x of arr) if (x) return true;
      return false;
    }
    /** @template T, T2 @param {T[]|{[key:PropertyKey]:T}} obj @param {(val: T, key?: any, obj?: any)=>T2} func @returns {T2[]}*/
    const map = (obj, func) => {
      return keys(obj).map(key => func(obj[key], key, obj));
    }
    const keys = function (obj) {
      return Array.isArray(obj) ? range(obj.length) : Object.keys(obj);
    }
    /** @template T @param {T[]|{[key:PropertyKey]:T}} obj @param {(val: T, key?: any, obj?: any)=>void} func*/
    const each = function (obj, func) {
      Object.keys(obj).forEach(key => func(obj[key], key));
      return obj;
    }
    /** @template T @param {{[key:PropertyKey]:T}} tgt @param {({[key:PropertyKey]:T}|[PropertyKey,T][])[]} objects @returns {{[key:PropertyKey]:T}} */
    const assign = function (tgt, ...objects) {
      for (let obj of objects) {
        if (Array.isArray(obj)) obj = Object.fromEntries(obj);
        Object.assign(tgt, obj);
      }
      return tgt;
    }

    const utils = { getUrl, sleep, assertDef, assertNonNull, nonNull, range, isString, rand32, randAZ, untilTimed, arrDiff, all, any, map, keys, each, assign };
    return utils;
  })();

  const scripts = (() => {
    const getScriptUrl = (/** @type {string?}*/path) => {
      // if(url.startsWith('./')) url += `?${_randomSessionSuffix}`;
      let src = path;
      if (!src) {
        const script = document.currentScript;
        if (!script) throw '';
        src = script['src'];
        if (!src) throw '';
      }
      let url = utils.getUrl(src);
      if (!url.endsWith('.js')) throw 'only .js files can be loaded';
      return url;
    }
    const _loaded = new events.Signal();
    const _declared = {};
    const _scriptPromises = {};
    /** @param {()=>(any|Promise<any>)} code */
    const define = async (code) => {
      const key = getScriptUrl();
      _declared[key] = true;
      const codePromise = (async () => await code());
      _scriptPromises[key] = _scriptPromises[key] || codePromise();
      const value = await _scriptPromises[key];
      _loaded.emit();
      // console.log('Defined', key);
      return value;
    }
    const load = async (/** @type {string} */ path) => {
      const key = getScriptUrl(path);
      // console.log('Loading', key);
      if (!_declared[key]) {
        _declared[key] = true;
        const script = put(elems.head, 'script[src=$]', key);
        if (!script) throw '';
        // console.log('Injected', script);
      }
      const value = await _loaded.until(() => _scriptPromises[key]);
      // console.log('Loaded', key);
      return await value;
    }
    /**
     * Loads from localStorage cache and pulls data
     * for next page reload. The module must be a JSON constant
     * @template T
     * @param {string} path
     * @param {(obj:any)=>(T|Promise<T>)} [beforeSave] data parser to compress the data
     */
    const cacheLoad = async (/** @type {string} */ path, beforeSave) => {
      const key = getScriptUrl(path);
      const cached = ls.get(key);
      // for next page load
      const fresh = (async () => {
        let data = await load(key);
        if (beforeSave) data = await beforeSave(data);
        return ls.set(key, data);
      })();
      return cached || await fresh;
    }
    const scripts = { define, load, _scriptPromises, _loaded, cacheLoad };
    return scripts;
  })();

  const styles = (() => {
    /** @typedef {(id: string) => string} StyleTemplate */
    /**
     * @type {{
     * (length: number, styleTemplate:StyleTemplate) : string;
     * (styleTemplate:StyleTemplate) : string;
     * (textCss: string) : string;
    * }}
    */
    // @ts-ignore
    const add = (first, second) => {
      let uid, length = 20, styleTemplate = second, textCss = '';
      //@ts-ignore
      if (utils.isString(first)) uid = '', textCss = first;
      else {
        if (typeof first === 'number') length = first;
        else styleTemplate = first;
        uid = utils.randAZ(length);
        textCss = styleTemplate(uid);
      }
      put(elems.head, 'style $', textCss);
      return uid;
    }
    const _styles = {};
    /** @param {string} path */
    function load(path) {
      const url = utils.getUrl(path);
      if (_styles[url]) return;
      if (!url.endsWith('.css')) throw 'only .css can be loaded';
      _styles[url] = true;
      put(elems.head, 'link[href=$][rel=stylesheet]', url);
    }
    const styles = { load, add };
    return styles;
  })();

  /** @param {HTMLElement} e @param {string} className @param {boolean?} value */
  const toggle = (e, className, value = null) => {
    const after = value !== null ? value : !e.classList.contains(className);
    put(e, `${after ? '.' : '!'}${className}`);
    return after;
  }
  const ls = (() => {
    /** @template T @param {T} [_default] @returns {T} */
    const get = (/** @type {string} */key, _default) => {
      const str = localStorage.getItem(key);
      let value = _default;
      if (str) {
        try { value = JSON.parse(str); }
        catch (e) { console.error(e); }
      }
      // @ts-ignore
      return value;
    }
    const clear = () => localStorage.clear();
    const pop = (/** @type {string} */key) => {
      const value = get(key);
      localStorage.removeItem(key);
      return value;
    }
    const set = (/** @type {string} */key, value) => {
      if (value === undefined) return pop(key);
      const str = JSON.stringify(value);
      localStorage.setItem(key, str);
      return value;
    }
    const keys = () => Object.keys(localStorage);
    return { set, get, pop, clear, keys };
  })();

  const ui = (() => {
    styles.add(`
    .cpTools-popUpOuter{
      /* background: var(--background-empty); */
      backdrop-filter: blur(4px);
      padding: 3vh 0em;
    }
    .cpTools-popUpInner{
      max-width: calc(80vw - 2em);
      max-height: calc(90vh - 5.5em);
      overflow-y: auto;
      color: black;
      background: white;
      margin:auto;
      padding: 1.5em 2em 4em 2em;
      border-radius: 1em;
    }    
    .cpTools-box-shadow{
      box-shadow: 0px 0px 0.3rem 0.05rem;
    }
    .cpTools-box-shadow:hover{
      box-shadow: 0px 0px 0.3rem 0.2rem;
    }
    .cpTools-fullscreen-layer{
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
    }`);
    put(elems.popUp, '.cpTools-popUpOuter.cpTools-fullscreen-layer');
    const _popUpInner = put(elems.popUp, 'div.cpTools-popUpInner.cpTools-box-shadow');
    _popUpInner.onclick = (e) => e.stopPropagation();
    /** @param {(()=>HTMLElement)|((out:any)=>HTMLElement)} mkContent */
    const popUp = (mkContent) => new Promise(resolve => {
      const _close = (out) => {
        put(elems.popUp, '.cpHidden');
        _popUpInner.removeChild(content);
        resolve(out);
      }
      elems.popUp.onclick = (e) => (e.stopPropagation(), _close(null));
      const content = mkContent(_close);
      put(_popUpInner, content);
      put(elems.popUp, '!cpHidden');
    });
    const vspace = (height) => put('div[style=$]', `height: ${height}`);
    const hspace = (width) => put('div.cpInline[style=$]', `padding-right: ${width}`);

    // styling: https://stackoverflow.com/a/10148189/3671939
    styles.add(`
    div.cpTools-radio-group{
      display: flex;
      flex-wrap: wrap;
    }
    div.cpTools-radio-group > label{
      margin-left:0.25em;
      margin-right:0.25em;
      white-space: nowrap;
    }
    div.cpTools-radio-group > label > span{
      white-space: normal;
    }
    `);
    /**
     * @param {string[]} options
     */
    function fixedRadioGroup(options) {
      // fixed because the list can not be made larger interactively
      // to select from parent, use a click
      const zEntries = options.map((key) => {
        const input = put('input[type="radio"]');
        const container = put('label', [input, ...cp.html`${key}`]);
        put(container, '@click', () => onClick(key));
        return { key, input, container };
      });
      const parent = put(
        'div.cpTools-radio-group',
        zEntries.map(({ container }) => container),
      );
      function onClick(/** @type {string} */choice) {
        for (let { key, input } of zEntries) if (choice != key) {
          // @ts-ignore
          input.checked = false;
        }
        parent.dispatchEvent(new CustomEvent('choice'));
      }
      return parent;
    };
    const ui = { popUp, _popUpInner, vspace, hspace, fixedRadioGroup };
    return ui;
  })();

  const cp = {
    sel: (args) => document.querySelector(args),
    all: (args) =>/**@type {HTMLElement[]}*/([...document.querySelectorAll(args)]),
    sleep,
    ls,
    ui,
    elems,
    scripts,
    utils,
    styles,
    events,
    put,
    html,
    toggle,
  };
  return cp;
})();

cp.styles.add(`
.cpHidden{ display: none; }
.cpLeft{ text-align: left; }
.cpCenter{ text-align: center; }
.cpRight{ text-align: right; }
.cpBold{ font-weight: bold; }
.cpHBox{ display: flex; flex-direction: row; }
.cpVBox{ display: flex; flex-direction: column; }
.cpInline{ display: inline; }
.cpBlock{ display: block; }
.cpCode {
  padding: 0em 0.2em;
  background-color: #e8e9ea;
  color: #000;
  border: 1px solid #caccd0;
  border-radius: 2px;
}
span.cpKaTex.display.formula{
  text-align: center;
}
span.cpKaTex{
  font-size: 1em;
}
.cpKaTexDisplayParent{
  width:100%;
  text-align:center;
  overflow-x: scroll;
}
`);