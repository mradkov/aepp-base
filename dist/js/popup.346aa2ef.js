(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["popup"],{"13bf":function(e,t,n){"use strict";var a=n("5e9b"),r=n.n(a);r.a},"13d9":function(e,t){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],a=0;a<e.rangeCount;a++)n.push(e.getRangeAt(a));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null;break}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach(function(t){e.addRange(t)}),t&&t.focus()}}},"46e6":function(e,t,n){"use strict";var a=n("acab"),r=n.n(a);r.a},5399:function(e,t,n){"use strict";n.r(t);var a=n("cebc"),r=n("2b0e"),s=n("2f62"),o=(n("be8c"),n("4360")),c=n("1f1e"),i=n("c53a");r["default"].use(s["a"]);var l=function(){window.reject(new Error("Rejected by user"))};window.addEventListener("beforeunload",l);var u=function(e){return function(){e.apply(void 0,arguments),window.removeEventListener("beforeunload",l),window.close()}};new r["default"]({store:o["a"],i18n:c["c"],render:function(e){return e(i["a"],{props:Object(a["a"])({},window.props,{resolve:u(window.props.resolve),reject:u(window.props.reject)})})}}).$mount("#app")},5499:function(e,t,n){"use strict";var a=n("6e00"),r=n.n(a);r.a},"5e9b":function(e,t,n){},6033:function(e,t,n){"use strict";var a=n("8395"),r=n.n(a);r.a},"6e00":function(e,t,n){},"717b":function(e,t,n){},8395:function(e,t,n){},"85d4":function(e,t,n){},8647:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"details-item"},[e._t("default")],2)},r=[],s=(n("c098"),n("2877")),o={},c=Object(s["a"])(o,a,r,!1,null,"1a4ee5aa",null);t["a"]=c.exports},"9aea":function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("canvas",{staticClass:"ae-identicon"})},r=[],s=(n("6b54"),n("6c7b"),new Array(4));function o(e){s.fill(0);for(var t=0;t<e.length;t++)s[t%4]=(s[t%4]<<5)-s[t%4]+e.charCodeAt(t)}function c(){var e=s[0]^s[0]<<11;return s[0]=s[1],s[1]=s[2],s[2]=s[3],s[3]=s[3]^s[3]>>19^e^e>>8,(s[3]>>>0)/(1<<31>>>0)}function i(){var e=Math.floor(360*c()),t=60*c()+40+"%",n=25*(c()+c()+c()+c())+"%";return"hsl("+e+","+t+","+n+")"}function l(e){for(var t=e,n=e,a=Math.ceil(t/2),r=t-a,s=[],o=0;o<n;o++){for(var i=[],l=0;l<a;l++)i[l]=Math.floor(2.3*c());var u=i.slice(0,r);u.reverse(),i=i.concat(u);for(var d=0;d<i.length;d++)s.push(i[d])}return s}function u(e){var t={};return t.seed=e.seed||Math.floor(Math.random()*Math.pow(10,16)).toString(16),o(t.seed),t.size=e.size||8,t.scale=e.scale||4,t.color=e.color||i(),t.bgcolor=e.bgcolor||i(),t.spotcolor=e.spotcolor||i(),t}function d(e,t){e=u(e||{});var n=l(e.size),a=Math.sqrt(n.length);t.width=t.height=e.size*e.scale;var r=t.getContext("2d");r.fillStyle=e.bgcolor,r.fillRect(0,0,t.width,t.height),r.fillStyle=e.color;for(var s=0;s<n.length;s++)if(n[s]){var o=Math.floor(s/a),c=s%a;r.fillStyle=1==n[s]?e.color:e.spotcolor,r.fillRect(c*e.scale,o*e.scale,e.scale,e.scale)}return t}var p={props:{address:{type:String,required:!0}},mounted:function(){var e=this;this.$watch(function(e){var t=e.address;return t},function(){return e.render()},{immediate:!0})},methods:{render:function(){d({seed:this.address},this.$el)}}},f=p,m=(n("46e6"),n("2877")),v=Object(m["a"])(f,a,r,!1,null,"6db54f36",null);t["a"]=v.exports},acab:function(e,t,n){},af79:function(e,t,n){"use strict";var a=n("717b"),r=n.n(a);r.a},b8ba:function(e,t,n){"use strict";n("4917");t["a"]=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"full",n=e.match(/.{1,3}/g);switch(t){case"full":return n.join(" ");case"short":return"".concat(n.slice(0,2).join(" "),"···").concat(e.slice(-3));default:throw new Error("Invalid length")}}},c098:function(e,t,n){"use strict";var a=n("85d4"),r=n.n(a);r.a},c53a:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"confirm-account-access"},[n("Guide",{attrs:{template:e.$t("app.browser.confirm-account-access.guide")}},[n("template",{slot:"app"},[e.app.icon?n("img",{attrs:{src:e.app.icon}}):e._e(),e._v(" "+e._s(e.app.name)+"\n    ")]),n("AccountInline",{attrs:{slot:"account",address:e.activeAccount.address},slot:"account"})],2),n("DetailsAccountAccessPermission",{attrs:{"app-name":e.app.name}}),n("AeButtonGroup",[n("AeButton",{attrs:{fill:"secondary"},on:{click:e.denyHandler}},[e._v("\n      "+e._s(e.$t("deny"))+"\n    ")]),n("AeButton",{on:{click:e.allowHandler}},[e._v("\n      "+e._s(e.$t("allow"))+"\n    ")])],1)],1)},r=[],s=n("cebc"),o=n("2f62"),c=n("eef4"),i=n("f908"),l=n("ee2a"),u=n("5d12"),d=n("eb6e"),p={components:{Guide:i["a"],AccountInline:l["a"],DetailsAccountAccessPermission:c["a"],AeButtonGroup:d["a"],AeButton:u["a"]},props:{appHost:{type:String,required:!0},resolve:{type:Function,required:!0},reject:{type:Function,required:!0}},computed:Object(s["a"])({},Object(o["c"])({activeAccount:"accounts/active"}),{app:function(){return this.$store.getters.getAppMetadata(this.appHost)}}),methods:{denyHandler:function(){this.reject(new Error("Rejected by user"))},allowHandler:function(){this.resolve()}}},f=p,m=(n("5499"),n("2877")),v=Object(m["a"])(f,a,r,!1,null,"24439569",null);t["a"]=v.exports},ee2a:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("span",{directives:[{name:"copy-on-click",rawName:"v-copy-on-click",value:e.address,expression:"address"}],staticClass:"account-inline",class:{address:!e.name}},[n("AeIdenticon",{attrs:{address:e.address}}),e._v("\n  "+e._s(e.name?e.name:e.formatAddress(e.address,"short"))+"\n")],1)},r=[],s=n("2f62"),o=n("b8ba"),c=n("efae"),i=n("9aea"),l={components:{AeIdenticon:i["a"]},directives:{copyOnClick:c["a"]},props:{address:{type:String,required:!0}},computed:Object(s["e"])("names",{name:function(e,t){var n=t.get;return n(this.address)}}),methods:{formatAddress:o["a"]}},u=l,d=(n("af79"),n("2877")),p=Object(d["a"])(u,a,r,!1,null,"658e4f94",null);t["a"]=p.exports},eef4:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"details-account-access-permission"},[n("DetailsPermission",{attrs:{name:e.$t("app.browser.confirm-account-access.address.name")}},[e._v("\n    "+e._s(e.$t("app.browser.confirm-account-access.address.explanation"))+"\n  ")]),n("DetailsPermission",{attrs:{name:e.$t("app.browser.confirm-account-access.transactions.name")}},[e._v("\n    "+e._s(e.$t("app.browser.confirm-account-access.transactions.explanation",{appName:e.appName}))+"\n  ")])],1)},r=[],s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("DetailsItem",{staticClass:"details-permission"},[n("div",{staticClass:"name"},[e._v("\n    "+e._s(e.name)+"\n  ")]),n("div",{staticClass:"description"},[e._t("default")],2)])},o=[],c=n("8647"),i={components:{DetailsItem:c["a"]},props:{name:{type:String,required:!0}}},l=i,u=(n("6033"),n("2877")),d=Object(u["a"])(l,s,o,!1,null,"7bedff8a",null),p=d.exports,f={components:{DetailsPermission:p},props:{appName:{type:String,required:!0}}},m=f,v=Object(u["a"])(m,a,r,!1,null,null,null);t["a"]=v.exports},efae:function(e,t,n){"use strict";n("96cf");var a=n("f684"),r=n("f904"),s=n.n(r),o=n("1f1e");t["a"]=function(e,t){"copyOnClick"in e.dataset||e.addEventListener("click",Object(a["coroutine"])(regeneratorRuntime.mark(function t(){var n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.dataset.copyOnClick,n){t.next=3;break}return t.abrupt("return");case 3:if(s()(n)){t.next=5;break}return t.abrupt("return");case 5:e.dataset.copiedText=o["c"].t("copied"),e.classList.add("v-copied"),setTimeout(function(){return e.classList.remove("v-copied")},500);case 8:case"end":return t.stop()}},t)}))),e.dataset.copyOnClick=t.value}},f904:function(e,t,n){"use strict";var a=n("13d9"),r="Copy to clipboard: #{key}, Enter";function s(e){var t=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}function o(e,t){var n,o,c,i,l,u,d=!1;t||(t={}),n=t.debug||!1;try{c=a(),i=document.createRange(),l=document.getSelection(),u=document.createElement("span"),u.textContent=e,u.style.all="unset",u.style.position="fixed",u.style.top=0,u.style.clip="rect(0, 0, 0, 0)",u.style.whiteSpace="pre",u.style.webkitUserSelect="text",u.style.MozUserSelect="text",u.style.msUserSelect="text",u.style.userSelect="text",u.addEventListener("copy",function(n){n.stopPropagation(),t.format&&(n.preventDefault(),n.clipboardData.clearData(),n.clipboardData.setData(t.format,e))}),document.body.appendChild(u),i.selectNodeContents(u),l.addRange(i);var p=document.execCommand("copy");if(!p)throw new Error("copy command was unsuccessful");d=!0}catch(f){n&&console.error("unable to copy using execCommand: ",f),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),d=!0}catch(f){n&&console.error("unable to copy using clipboardData: ",f),n&&console.error("falling back to prompt"),o=s("message"in t?t.message:r),window.prompt(o,e)}}finally{l&&("function"==typeof l.removeRange?l.removeRange(i):l.removeAllRanges()),u&&document.body.removeChild(u),c()}return d}e.exports=o},f908:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"guide",class:[e.fill,e.size,{"has-icon":e.$slots.icon}]},[e.$slots.icon?n("span",{staticClass:"icon"},[e._t("icon")],2):e._e(),e.template?n("TemplateRenderer",{staticClass:"content",attrs:{node:e.templateRootNode,slots:e.$slots}}):n("div",{staticClass:"content"},[e._t("default")],2)],1)},r=[],s=(n("6762"),n("2fdb"),n("5df3"),n("1c4c"),function e(t,n,a){return n.childNodes.length?Array.from(n.childNodes).filter(function(e){return[Node.ELEMENT_NODE,Node.TEXT_NODE].includes(e.nodeType)}).map(function(n){switch(n.tagName){case"primary":return t("em",e(t,n,a));case"secondary":return t("mark",e(t,n,a));case"alternative":return t("strong",e(t,n,a));case"br":return t("br");case"p":return t("p",e(t,n,a));case void 0:return n.textContent;default:return a[n.tagName]}}):n.textContent}),o={functional:!0,props:{node:{type:Node,required:!0},slots:{type:Object,required:!0}},render:function(e,t){var n=t.data,a=t.props;return e("div",{class:n.staticClass},s(e,a.node,a.slots))}},c={components:{TemplateRenderer:o},props:{fill:{type:String,validator:function(e){return["primary","alternative","neutral"].includes(e)},default:"primary"},size:{type:String,validator:function(e){return["small","medium","big"].includes(e)},default:"medium"},template:{type:String,default:""}},computed:{templateRootNode:function(){return(new DOMParser).parseFromString("<root>".concat(this.template,"</root>"),"text/xml").childNodes[0]}}},i=c,l=(n("13bf"),n("2877")),u=Object(l["a"])(i,a,r,!1,null,"70a4b400",null);t["a"]=u.exports}}]);
//# sourceMappingURL=popup.346aa2ef.js.map