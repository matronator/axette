/**
 * Copyright (c) 2021 Matronator
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import axette from '../index'

const callback = () => { return null }

test('addHook', () => {
  expect(axette.hooks.addAjaxHook({fn: callback, args: []})).toStrictEqual({ fn: callback, args: [] })
})
