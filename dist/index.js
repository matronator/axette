var axette=function(n){"use strict";function t(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),e.push.apply(e,r)}return e}function e(n){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?t(Object(r),!0).forEach((function(t){i(n,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):t(Object(r)).forEach((function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(r,t))}))}return n}function r(n,t,e,r,o,a,i){try{var u=n[a](i),c=u.value}catch(n){return void e(n)}u.done?t(c):Promise.resolve(c).then(r,o)}function o(n){return function(){var t=this,e=arguments;return new Promise((function(o,a){var i=n.apply(t,e);function u(n){r(i,o,a,u,c,"next",n)}function c(n){r(i,o,a,u,c,"throw",n)}u(void 0)}))}}function a(n,t){for(var e=0;e<t.length;e++){var r=t[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function i(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function u(n,t){return function(n){if(Array.isArray(n))return n}(n)||function(n,t){var e=null==n?null:"undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(null==e)return;var r,o,a=[],i=!0,u=!1;try{for(e=e.call(n);!(i=(r=e.next()).done)&&(a.push(r.value),!t||a.length!==t);i=!0);}catch(n){u=!0,o=n}finally{try{i||null==e.return||e.return()}finally{if(u)throw o}}return a}(n,t)||f(n,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(n){return function(n){if(Array.isArray(n))return l(n)}(n)||function(n){if("undefined"!=typeof Symbol&&null!=n[Symbol.iterator]||null!=n["@@iterator"])return Array.from(n)}(n)||f(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(n,t){if(n){if("string"==typeof n)return l(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);return"Object"===e&&n.constructor&&(e=n.constructor.name),"Map"===e||"Set"===e?Array.from(n):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?l(n,t):void 0}}function l(n,t){(null==t||t>n.length)&&(t=n.length);for(var e=0,r=new Array(t);e<t;e++)r[e]=n[e];return r}var s=function(){function n(){!function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),i(this,"onAjax",[]),i(this,"onInit",[])}var t,e,r;return t=n,(e=[{key:"addInitHook",value:function(n){return this.addHook("onInit",n)}},{key:"addAjaxHook",value:function(n){return this.addHook("onAjax",n)}},{key:"addHook",value:function(n,t){switch(n){case"onAjax":return this.onAjax.push(t),t;case"onInit":return this.onInit.push(t),t;default:return this[n]instanceof Array?(Array.prototype.push.call(this[n],t),t):null}}}])&&a(t.prototype,e),r&&a(t,r),n}(),d={init:function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ajax",t=document.querySelectorAll("a.".concat(n));t&&t.forEach((function(n){n.addEventListener("click",(function(n){n.preventDefault(),d.run(n.target.href)}))}));var e=document.querySelectorAll("form.".concat(n));e&&e.forEach((function(n){n instanceof HTMLFormElement&&n.addEventListener("submit",(function(t){t.preventDefault();var e=new FormData(n),r=new URLSearchParams(String(e)).toString();"post"===n.method.toLowerCase()?d.run(n.action,r,"application/x-www-form-urlencoded").catch((function(n){return console.error(n)})):d.run("".concat(n.action,"?").concat(r)).catch((function(n){return console.error(n)}))}))}));d.hooks.onInit.forEach((function(n){n.fn instanceof Function&&n.fn.apply(n,c(n.args))}))},run:function(n){return h.apply(this,arguments)},hooks:new s,on:function(n,t){for(var e=arguments.length,r=new Array(e>2?e-2:0),o=2;o<e;o++)r[o-2]=arguments[o];return d.hooks.addHook(n,{fn:t,args:r})},onInit:function(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];d.on("onInit",n,e)},onAjax:function(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];d.on("onAjax",n,e)},fixURL:function(){var n=window.location.toString(),t=n.indexOf("_fid=");if(-1!==t){var e=n.substr(0,t)+n.substr(t+10);"?"!==e.substr(e.length-1)&&"&"!==e.substr(e.length-1)||(e=e.substr(0,e.length-1)),window.history.replaceState("",document.title,e)}}};function h(){return(h=o(regeneratorRuntime.mark((function n(t){var r,o,a,i,f,l,s,h,p=arguments;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r=p.length>1&&void 0!==p[1]?p[1]:null,o=p.length>2&&void 0!==p[2]?p[2]:"application/json",n.next=4,fetch(t,e({method:r?"POST":"GET",headers:e({"X-Requested-With":"XMLHttpRequest"},r&&{"Content-Type":o})},r&&{body:r}));case 4:return a=n.sent,n.next=7,a.json();case 7:i=n.sent,f=i.snippets,l=void 0===f?{}:f,s=i.redirect,""!==(h=void 0===s?"":s)&&window.location.replace(h),Object.entries(l).forEach((function(n){var t=u(n,2),e=t[0],r=t[1],o=document.getElementById(e);o&&(o.innerHTML=r)})),d.hooks.onAjax.forEach((function(n){n.fn instanceof Function&&n.fn.apply(n,c(n.args))})),d.init();case 16:case"end":return n.stop()}}),n)})))).apply(this,arguments)}return n.Hooks=s,n.default=d,Object.defineProperty(n,"__esModule",{value:!0}),n}({});
