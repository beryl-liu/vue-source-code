/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0
// Dep是个可观察对象，可以有多个指令订阅它
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  // 静态属性 watcher对象
  static target: ?Watcher;
  // dep实例id
  id: number;
  // dep实例对应的watcher对象/订阅者数组
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }
  // 添加新的订阅者watcher对象
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  // 移除订阅者
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.

Dep.target = null
const targetStack = []
// 入栈并将当前的watcher赋值给Dep.target
// 父子组件嵌套的时候先把父组件对应的watcher入栈，再去处理子组件的watcher，子组件的处理完毕后，再把父组件对应的watcher出栈，继续操作
export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  // 出栈
  Dep.target = targetStack.pop()
}
