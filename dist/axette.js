(function (root, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.axette = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.axette = factory();
  }

}(this, function () {
// UMD Definition above, do not remove this line

// To get to know more about the Universal Module Definition
// visit: https://github.com/umdjs/umd

  'use strict';

  if (!Object.entries) {
    Object.entries = function( obj ){
        var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
        while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
  }

  var hooks = {
    onInit: [],
    onAjax: [],
    addInitHook: function(hook) {
        return this.addHook('onInit', hook)
    },
    addAjaxHook: function(hook) {
        return this.addHook('onAjax', hook)
    },
    addHook: function(event, hook) {
        switch(event) {
            case 'onAjax':
                this.onAjax.push(hook)
            return hook

            case 'onInit':
                this.onInit.push(hook)
            return hook

            default:
                if (this[event] instanceof Array) {
                    Array.prototype.push.call(this[event], hook)
                    return hook
                }
            return null
        }
    },
  }

  /**
  * Registers AJAX handlers
  * @param ajaxClass CSS class to be used as selector for links and forms to be handled by AJAX
  */
  function init(ajaxClass) {
    if (ajaxClass === undefined) ajaxClass = 'ajax'
    var links = document.querySelectorAll('a.' + String(ajaxClass))
    if (links) {
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault()
                axette.run(e.currentTarget.href)
            })
        })
    }

    var forms = document.querySelectorAll('form.' + String(ajaxClass))
    if (forms) {
        forms.forEach(function(form) {
            if (form instanceof HTMLFormElement) {
                form.addEventListener('submit', function(e) {
                    formSubmitted(e, form)
                })
            }
        })
    }

    axette.hooks.onInit.forEach(function(hook) {
        if (hook.fn instanceof Function) {
            hook.fn(...hook.args)
        }
    })
  }

  async function formSubmitted(e, form) {
      e.preventDefault()
      var body = new FormData(form)
      if (form.method.toLowerCase() === 'post') {
          axette.run(form.action, body, 'application/form-multipart', form, 'POST')
              .catch(function(err) { console.error(err) })
      } else {
          const formData = new FormData(form)
          const params = (new URLSearchParams(String(formData))).toString()
          axette.run(String(form.action) + '?' + String(params))
              .catch(function(err) { console.error(err) })
      }

      form.reset()
  }

  /**
  * Handles Nette response by updating snippets and/or redirecting if necessary
  * @param link (string) Target URL
  * @param requestBody (any) Request body
  * @param contentType (string) `Content-Type` header (default: `application/json`)
  * @param element (Element) The element that sent the event
  * @param method (string) HTTP method (default: `POST`)
  */
  async function onAjax(link, data, contentType, element, method) {
    if (data === undefined) data = null
    if (contentType === undefined) contentType = 'application/json'
    if (element === undefined) element = null
    if (method === undefined) method = 'POST'

    var formParent
    if (element) {
      formParent = element.closest("form[data-ajax-parent]")
    } else {
      formParent = null
    }

    if (formParent) {
      method = "POST"
    }

    var response = await fetch(link, {
        method: method,
        headers: { "X-Requested-With": "XMLHttpRequest" },
        body: requestBody
    })
    var res = await response.json()
    var snippets = (res.snippets !== null && res.snippets !== undefined) ? res.snippets : []
    var redirect = (res.redirect !== null && res.redirect !== undefined) ? res.redirect : ''
    if (redirect !== '') {
        window.location.replace(redirect)
    }
    Object.entries(snippets).forEach(function([id, html]) {
        var elem = document.getElementById(id)
        if (elem) elem.innerHTML = html
    })

    axette.hooks.onAjax.forEach(function(hook) {
        if (hook.fn instanceof Function) {
            hook.fn(...hook.args)
        }
    })

    axette.init()
  }

  /**
  * Removes '?_fid=xxxx' from the URL that Nette adds there whenever it shows a FlashMessage.
  */
  function noFlashURL() {
    var l = window.location.toString()
    var fid = l.indexOf('_fid=')
    if(fid !== -1) {
        var uri = l.substr(0, fid) + l.substr(fid + 10)
        if ((uri.substr(uri.length - 1) === '?') || (uri.substr(uri.length - 1) === '&')) {
            uri = uri.substr(0, uri.length - 1)
        }
        window.history.replaceState('', document.title, uri)
    }
  }

  function onAjaxHook(callback, ...args) {
    axette.on('onAjax', callback, ...args)
  }

  function onInitHook(callback, ...args) {
    axette.on('onInit', callback, ...args)
  }

  /**
  * Add new callback to the specified event to be run every time that event is triggered
  * @param event Name of the event to add hook to ('onInit', 'onAjax', ...)
  * @param callback Function to call
  * @param args Function arguments
  * @returns Hook or null if event name is invalid
  */
  function onHook(event, callback, ...args) {
    return axette.hooks.addHook(event, { fn: callback, args: args })
  }

  var axette = {
    init: init,
    run: onAjax,
    hooks: hooks,
    on: onHook,
    onInit: onInitHook,
    onAjax: onAjaxHook,
    fixURL: noFlashURL
  }

  return axette;

}));
