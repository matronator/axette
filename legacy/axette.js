/**
* Copyright (c) 2021 Matronator
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/

var axette = function() {
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
                    _axette.run(e.currentTarget.href)
                })
            })
        }

        var forms = document.querySelectorAll('form.' + String(ajaxClass))
        if (forms) {
            forms.forEach(function(form) {
                if (form instanceof HTMLFormElement) {
                    form.addEventListener('submit', function(e) {
                        e.preventDefault()
                        var formData = new FormData(form)
                        var params = (new URLSearchParams(String(formData))).toString()
                        if (form.method.toLowerCase() === 'post') {
                            _axette.run(form.action, params, 'application/x-www-form-urlencoded')
                                .catch(function(err) { console.error(err) })
                        } else {
                            _axette.run(String(form.action) + String(params))
                                .catch(function(err) { console.error(err) })
                        }
                    })
                }
            })
        }

        _axette.hooks.onInit.forEach(function(hook) {
            if (hook.fn instanceof Function) {
                hook.fn(...hook.args)
            }
        })
    }

    /**
    * Handles Nette response by updating snippets and/or redirecting if necessary
    * @param link Target URL
    * @param data Request body
    * @param contentType 'Content-Type' header
    */
    async function onAjax(link, data, contentType) {
        if (data === undefined) data = null
        if (contentType === undefined) contentType = 'application/json'

        var response = await fetch(link, {
            method: data ? 'POST' : 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...(data && { 'Content-Type': contentType }),
            },
            ...(data && { body: data })
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

        _axette.hooks.onAjax.forEach(function(hook) {
            if (hook.fn instanceof Function) {
                hook.fn(...hook.args)
            }
        })

        _axette.init()
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
        _axette.on('onAjax', callback, ...args)
    }

    function onInitHook(callback, ...args) {
        _axette.on('onInit', callback, ...args)
    }

    /**
    * Add new callback to the specified event to be run every time that event is triggered
    * @param event Name of the event to add hook to ('onInit', 'onAjax', ...)
    * @param callback Function to call
    * @param args Function arguments
    * @returns Hook or null if event name is invalid
    */
    function onHook(event, callback, ...args) {
        return _axette.hooks.addHook(event, { fn: callback, args: args })
    }

    var _axette = {
        init: init,
        run: onAjax,
        hooks: hooks,
        on: onHook,
        onInit: onInitHook,
        onAjax: onAjaxHook,
        fixURL: noFlashURL
    }

    return _axette
}()
