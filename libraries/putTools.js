

//@ts-check
/// <reference path="./put.js" />


/** @typedef {string|number|boolean|object} RenderConstant0 */
/** @typedef {RenderConstant0|RX<RenderConstant0>} RenderConstant1 */
/** @typedef {Node|RenderConstant1} RenderConstant2 */
/** @typedef {RenderConstant2|RenderConstant2[]} RenderConstant3 */

async function sleep(ms) {
  await new Promise((ok, err) => setTimeout(ok, ms));
}
async function until(/** @type {()=>any}*/ func, { ms = 200, timeout = 0 } = {}) {
  if (timeout && ms > timeout) ms = timeout / 10;
  let t0 = (new Date()).getTime();
  let value;
  while (!(value = await func())) {
    if (timeout && (new Date()).getTime()-t0 > timeout)
      throw 'timeout';
    await sleep(ms);
  }
  return value;
}


var /** @type {(...args)=>HTMLElement}*/ put = eval("window['put']");
var /** @type {*}*/ katex = eval("window['katex']");
var /** @type {*}*/ d3 = eval("window['d3']");

document.head.append(put('style', `
.parBreak { margin-top:1em; }
`));

/** 
 * @param {TemplateStringsArray} htmlTemplateString
 * @param {RenderConstant3[]} variables
 * @returns {Node[]}
 * */
function putNodes(htmlTemplateString, ...variables){
  let wrapper = document.createElement('div');
  let /** @type {readonly string[]}*/ htmlSeq = (htmlTemplateString.raw||htmlTemplateString);
  let html = htmlSeq.join('<div placeholderForPutVariable></div>')

  html = html.replace(/<!--.*?-->/gs, ''); // Comments shift placeholder replacements

  const codes = [];
  html = html.replace(/\\\`\\\`\\\`(.*?)\\\`\\\`\\\`/gs, m=>{
    codes.push(m.slice(6,-6).trim());
    return '<div placeholderForPutVariable="code"></div>'
  });
  html = html.replace(/\\\`(.*?)\\\`/g, '<code>$1</code>');

  const formulas = [];
  html = html.replace(/(\$\$.*?\$\$|\$.*?\$)/gs, m=>{
    const displayMode = m.startsWith("$$");
    const skip = displayMode?2:1;
    formulas.push({displayMode, formula:m.slice(skip, -skip)});
    return '<div placeholderForPutVariable="formula"></div>'
  });

  html = html.replace(/\s*\n(\s*\n)+/g, '<div class="parBreak"></div>');

  wrapper.innerHTML = html;
  let varIndex = 0;
  let formulaIndex = 0;
  let codeIndex = 0;
  let replacements = [];
  let mathReplacements = [];
  let codeReplacements = [];
  const dfs = (/** @type {Node}*/root)=>{
    for(let child of root.childNodes){
      const isPlaceholder = (
        child.nodeName=="DIV"
        && child instanceof HTMLElement
        && child.attributes['placeholderForPutVariable']
      );
      if(!isPlaceholder) dfs(child);
      else if(isPlaceholder.value=='formula'){
        mathReplacements.push({element:child, value: formulas[formulaIndex++]})
      } else if(isPlaceholder.value=='code'){
        codeReplacements.push({element:child, value: codes[codeIndex++]})
      } else {
        replacements.push({element:child, value: variables[varIndex++]});
      }
    }
  }
  dfs(wrapper);

  for(let {element, value} of replacements){
    let values = (Array.isArray(value)? value:[value]).map(v=>{
      if(v instanceof Promise){
        const tmpDiv = put('div');
        v.then(value=>tmpDiv.replaceWith(...putNodes`${value}`));
        return tmpDiv;
      }
      if(v instanceof Node) return v;
      if(v instanceof RX) return putText(v);
      return putText(v);
    });
    element.replaceWith(.../**@type {*}*/(values));
  }
  for(let {element, value} of mathReplacements){
    let {displayMode, formula} = value;
    katex.render(formula, element, {throwOnError: false, displayMode});
    element.replaceWith(element.firstChild);
  }
  for(let {element, value} of codeReplacements){
    const options = {mode:'text/javascript'};
    const code = value.replace(/^.*?\n(.*)$/gs, '$1');
    element.replaceWith(putCodemirror(code, options));
  }
  // DOES NOT WORK for td nor th!!!
  return [...wrapper.childNodes];
}
/** 
 * @param {TemplateStringsArray} htmlTemplateString
 * @param {RenderConstant3[]} variables
 * @returns {HTMLElement}
 * */
var putElem = (htmlTemplateString, ...variables) =>{
  const nodes = putNodes(htmlTemplateString, ...variables);
  for(let node of nodes){
    if(node instanceof HTMLElement) return node;
  }
  console.log(nodes);
  throw `no element in template: ${htmlTemplateString.join('{{VAR}}')}}`;
}


/** 
 * @param {RenderConstant1} text$
 * @returns {Text}
 * */
function putText(text$){
  const parseText = (v)=>{
    if (typeof v === 'string') return v;
    if(v instanceof String) return v.toString();
    if(Number.isFinite(v)) return `${v}`;
    if(!v) '';
    return JSON.stringify(v);
  }
  const elem = document.createTextNode('');
  if(text$ instanceof RX) text$.subscribe(text => elem.textContent=parseText(text));
  else elem.textContent=parseText(text$);
  return elem;
}





/** @template T */
class RX {
  value;
  actions;
  /** @param {T} value*/
  constructor(value){
    this.value = value;
    this.actions = /** @type {((arg:T)=>*)[]}*/([]);
  }
  /** @param {(arg:T)=>*} action*/
  silentSubscribe(action){
    this.actions.push(action);
  }
  /** @param {(arg:T)=>*} action*/
  subscribe(action){
    this.silentSubscribe(action);
    action(this.value);
  }
  /** @param {T} value*/
  set(value){ this._set(value); }
  /** @param {T} value*/
  _set(value){
    if(value!==this.value){
      this.value = value;
      for(let action of this.actions) action(value);
    }
    return value;
  }

  /**
   * @template T2 
   * @param {(arg:T)=>T2} f
   * @returns {RX_readonly<T2>}
   */
  map(f){
    const out = new RX_readonly(f(this.value));
    this.silentSubscribe(value=>out._set(f(value)));
    return out;
  }
  /** @param {RX<*>} rxs*/
  /** @returns {RX<*[]>}*/
  static or(...rxs){
    const obj = new RX(rxs.map(x=>x.value));
    for(let i in rxs) rxs[i].silentSubscribe(x=>obj.set((obj.value[i]=x, [...obj.value])))
    return obj;
  }
  /** @param {RX|*} rxs*/
  /** @returns {RX<*>} */
  static asRX(rx_or_constant){
    return (rx_or_constant instanceof RX)? rx_or_constant: new RX_constant(rx_or_constant);
  }

  /** @template T2
   * @param {string} key
   * @param {T2} defaultValue
   * @returns {RX<T2>}
  */
  static locallyStored(key, defaultValue){
    const value = JSON.parse(localStorage.getItem(key)||JSON.stringify(defaultValue));
    const rx = new RX(value);
    rx.silentSubscribe((newValue)=>localStorage.setItem(key, JSON.stringify(newValue)))
    return rx;
  }
}

/** @template T */
class RX_readonly extends RX{
  set(value){ throw 'readonly object' };
}
/** @template T */
class RX_constant extends RX{
  silentSubscribe(action){ }
}


document.head.append(put('style', `
.switch-hidden{
  display: none
}`));
const Switch = ({key$}, ...children)=>{
  children = (children||[...this.children]).map(child=>({
    caseKey: child.attributes['case']?.value,
    isDefault: !!child.attributes['default'],
    elem: child,
  }));
  key$.subscribe(key => {
    const anyMatch = children.filter(({caseKey})=>caseKey==key).length > 0;
    for(let {caseKey, isDefault, elem} of children){
      let show;
      if(key===true) show=true;
      else if(key===false) show=false;
      else if(!caseKey || caseKey==key) show=true;
      else if(!anyMatch && isDefault) show=true;
      else show=false;
      put(elem, show?`!switch-hidden`:`.switch-hidden`);
    }
  });
  return children.map(({elem})=>elem);
}


// tab effects: https://alvarotrigo.com/blog/html-css-tabs/
document.head.append(put('style', `
.tabs-header>label>input { display: none; }
.tabs-parent { width: 100%; }
.tabs-header {
  margin-top: 0.1em;
  border-bottom: 1px solid;
}
.tab-label:hover {
  top: -0.25rem;
  transition: top 0.25s;
}
.tabs{
  border: solid 1px;
  border-top: none;
}
.tab-label {
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 0.3em 0.3em 0 0;
  background: unset;
  border: solid 1px;
  white-space:nowrap;
  cursor: pointer;
}
/* https://stackoverflow.com/a/10148189/3671939 */
.tab-label { white-space:nowrap; }
.tab-label > span{ white-space: normal; }
.tab-label-true {
  font-weight: bold;
  border-bottom: solid 2px #EBEBEB;
}
.tab-content-false { display:none; }
.tab-content-true {
  display: true;
  opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.15s;
}
@keyframes fadeInOpacity {
	0% { opacity: 0; }
	100% { opacity: 1;}
}
.tab-content-true { padding: 1vw; }
`));
/** @param {{entries: [string,string][], defaultKey?:string, localStorageKey?:string}} settings */
const Tabs = ({entries, defaultKey, localStorageKey}, ...children)=>{
  const option$ = localStorageKey?
    RX.locallyStored(localStorageKey, defaultKey||entries[0][0])
    : new RX(defaultKey||entries[0][0]);
  let zEntries = entries.map(([key, value])=>(
    {key, label$: RX.asRX(value), elem:put('input[type="radio"]')}
  ));
  const head = zEntries.map(({key, label$})=>{
    let input, span;
    const elem = put('label.tab-label', [
      input=put('input[type=radio]'),
      span=put('span'),
    ]);
    label$.subscribe(label=>span.textContent=label);
    elem.onclick = ()=>option$.set(key);
    return {key, label$, elem, input};
  });
  children = children.map(child=>({
    key: child.attributes['tab']?.value,
    elem: child,
  }));
  option$.subscribe((option)=>{
    for(let {elem, key, input} of head){
      put(input, option==key?'[checked]':'[!checked]')
      put(elem, `.tab-label-${option==key}!tab-label-${option!=key}`)
    }
    for(let {elem, key} of children){
      put(elem, `.tab-content-${option==key}!tab-content-${option!=key}`)
    }
  });
  return putNodes`
  <div class="tabs-parent">
    <div class="tabs-header">
      ${head.map(({elem})=>elem)}
    </div>
    <div class="tabs">
      ${children.map(({elem})=>elem)}
    </div>
  </>`;
}



// styling: https://stackoverflow.com/a/10148189/3671939
document.head.append(put('style', `
div.radio-group{
  display: flex;
  flex-wrap: wrap;
}
div.radio-group > label{
  margin-left:0.25em;
  margin-right:0.25em;
  white-space: nowrap;
}
div.radio-group > label > span{
  white-space: normal;
}
`));
/**
 * 
 * @param {[string, string][]} entries 
 * @param {RX<string>?} choice$ 
 * @returns 
 */
function RadioGroup(entries, choice$=null){
  let _choice$ = choice$ || new RX(entries[0][0]);
  const zEntries = entries.map(([key, value])=>{
    const label$ = RX.asRX(value);
    const input = put('input[type="radio"]');
    const container = put('label', [input, putText(label$)])
    container.onclick = (()=>_choice$.set(key));
    return {key, input, container};
  });
  _choice$.subscribe(choice=>{
    for(let {key, input} of zEntries){
      put(input, choice==key?'[checked]':'[!checked]');
    }
  })
  return put('div.radio-group', zEntries.map(({container})=>container));
}
