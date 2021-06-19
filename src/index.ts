/**
* Copyright (c) 2021 Matronator
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/

type Hook = {
    fn: Function,
    args: any[],
}

class Hooks extends Array {
    onAjax: Array<Hook> = []
    onInit: Array<Hook> = []
}

export const hooks = new Hooks

export function init(ajaxClass: string = `ajax`) {
  const links = document.querySelectorAll(`a.${ajaxClass}`)
  if (links) {
      links.forEach((link: Element) => {
          link.addEventListener(`click`, (e: Event) => {
              e.preventDefault()
              onAjax((e.target as HTMLAnchorElement).href)
          })
      })
  }

  const forms = document.querySelectorAll(`form.${ajaxClass}`)
  if (forms) {
      forms.forEach(form => {
        if (form instanceof HTMLFormElement) {
          form.addEventListener(`submit`, e => {
              e.preventDefault()
              const formData = new FormData(form)
              const params = (new URLSearchParams(String(formData))).toString()
              if (form.method.toLowerCase() === `post`) {
                  onAjax(form.action, params, `application/x-www-form-urlencoded`)
                      .catch(err => console.error(err))
              } else {
                onAjax(`${form.action}?${params}`)
                      .catch(err => console.error(err))
              }
          })
        }
      })
  }
  hooks.onInit.forEach((hook: Hook) => {
      if (hook.fn instanceof Function) {
          hook.fn(...hook.args)
      }
  })
}

export async function onAjax(link: string, data: BodyInit|null = null, contentType = `application/json`) {
  const response = await fetch(link, {
      method: data ? `POST` : `GET`,
      headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(data && { 'Content-Type': contentType }),
      },
      ...(data && { body: data })
  })
  const { snippets = {}, redirect = `` } = await response.json()
  if (redirect !== ``) {
      window.location.replace(redirect)
  }
  Object.entries(snippets).forEach(([id, html]) => {
      const elem = document.getElementById(id)
      if (elem) elem.innerHTML = html as string
  })
  init()

  hooks.onAjax.forEach(hook => {
      if (hook.fn instanceof Function) {
          hook.fn(...hook.args)
      }
  })
}

/**
 * Removes `?_fid=xxxx` from the URL that Nette adds there whenever it shows a FlashMessage.
 */
 export function noFlashURL() {
  let l = window.location.toString()
  let fid = l.indexOf(`_fid=`)
  if(fid !== -1) {
      let uri: string = l.substr(0, fid) + l.substr(fid + 10)
      if ((uri.substr(uri.length - 1) === `?`) || (uri.substr(uri.length - 1) === `&`)) {
          uri = uri.substr(0, uri.length - 1)
      }
      window.history.replaceState(``, document.title, uri)
  }
}

export function onAjaxHook(callback: Function, ...args: any[]) {
  onHook(`onAjax`, callback, args)
}

export function onInitHook(callback: Function, ...args: any[]) {
  onHook(`onInit`, callback, args)
}

export function onHook(event: keyof Hooks, callback: Function, ...args: any[]) {
  if ((hooks[event] as Array<Hook>) instanceof Array) {
      hooks[event].push({ fn: callback, args: args })
  }
}

// const ajaxette = { init, onAjax, hooks, onAjaxHook, onInitHook, onHook }

// export default ajaxette
