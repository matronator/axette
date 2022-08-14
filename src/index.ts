interface Hook {
  callback: Function;
  args: any[];
}

interface GlobalHooks {
  onInitHooks: Hook[];
  onAjaxHooks: Hook[];
  initialized: boolean;
}

declare global {
  interface Window {
    __AxetteGlobalHooks: GlobalHooks;
  }
}

export class Axette {
  constructor(ajaxClass: string = `ajax`) {
    let globalCallbacks: GlobalHooks = {
      onInitHooks: [],
      onAjaxHooks: [],
      initialized: true,
    };
    if (!window.__AxetteGlobalHooks || !window.__AxetteGlobalHooks.initialized) {
      window.__AxetteGlobalHooks = globalCallbacks;
    }

    this.init(ajaxClass);
  }

  init(ajaxClass: string = `ajax`) {
    const links = document.querySelectorAll(`a.${ajaxClass}`)
    links?.forEach((link: Element) => {
      link.addEventListener(`click`, (e: Event) => {
        e.preventDefault()
        this.run((e.target as HTMLAnchorElement).href)
      })
    })

    const forms = document.querySelectorAll(`form.${ajaxClass}`)
    forms?.forEach(form => {
      const htmlForm = form as HTMLFormElement;
      form.addEventListener(`submit`, async (e) => {
        e.preventDefault()
        const body = new FormData(htmlForm)
        if (htmlForm.method.toLowerCase() === `post`) {
          this.run(htmlForm.action, body, `application/form-multipart`, form, `POST`)
            .catch(err => console.error(err))
        } else {
          const params = (new URLSearchParams(String(body))).toString()
          this.run(`${htmlForm.action}?${params}`)
            .catch(err => console.error(err))
        }

        htmlForm.reset()
      })
    })

    window.__AxetteGlobalHooks.onInitHooks.forEach((hook: Hook) => {
      if (hook.callback instanceof Function) {
        hook.callback(...hook.args)
      }
    })
  }

  async run(link: string, requestBody: BodyInit | null = null, contentType: string = `application/json`, element: Element | null = null, method: string = `POST`) {
    const formParent = element ? element.closest("form[data-ajax-parent]") : null
    const response = await fetch(link, {
      method: formParent ? "POST" : method,
      headers: { "X-Requested-With": "XMLHttpRequest" },
      body: requestBody as BodyInit,
    })

    const { snippets = {}, redirect = `` } = await response.json()
    if (redirect !== ``) {
      window.location.replace(redirect)
    }
    Object.entries(snippets).forEach(([id, html]) => {
      const elem = document.getElementById(id)
      if (elem) elem.innerHTML = html as string
    })

    window.__AxetteGlobalHooks.onAjaxHooks.forEach((hook: Hook) => {
      if (hook.callback instanceof Function) {
        hook.callback(...hook.args)
      }
    })

    this.init();
  }
}
