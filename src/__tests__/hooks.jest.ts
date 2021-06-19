/**
 * Copyright (c) 2021 Matronator
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { onHook } from '../index'

const callback = () => { return null }

test('addHook', () => {
  expect(onHook('onAjax', callback)).toStrictEqual({fn: callback, args: []})
})
