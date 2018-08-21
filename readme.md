[![Build Status](https://img.shields.io/travis/little-saga/schedule/master.svg?style=flat-square)](https://travis-ci.org/little-saga/schedule) [![NPM Package](https://img.shields.io/npm/v/@little-saga/schedule.svg?style=flat-square)](https://www.npmjs.org/package/@little-saga/schedule)

# @little-saga/schedule

@littl-saga/schedule 是一个简单的类库，提供了一些简单的 API 来管理定时任务。注意该类库只能和 little-saga 一起使用。

**目录：**

<!-- toc -->

- [`wait(pattern)`](#waitpattern)
- [pattern 样例](#pattern-%E6%A0%B7%E4%BE%8B)
- [`schedule(pattern, worker, ...args)`](#schedulepattern-worker-args)
- [`waitWithPredicate(pattern, predicate)`](#waitwithpredicatepattern-predicate)
- [`scheduleWithPredicate(pattern, predicate, worker, ...args)`](#schedulewithpredicatepattern-predicate-worker-args)

<!-- tocstop -->

## `wait(pattern)`

`wait` 用来等到下一个满足 pattern 的时刻。wait 是一个生成器函数，一般像下面这样在 little-saga 中使用：

```javascript
import { runSaga } from 'little-saga'
import { wait } from '@little-saga/schedule'

function* gen() {
  yield io.call(wait, pattern)
}

runSaga(options, gen)
```

参数 `pattern` 是一个普通 JavaScript 对象，用来描述目标时刻需要满足的条件，包含以下四个字段： `hour / minute / second / millisecond`，分别描述不同时间粒度所需满足的条件。每个字段可以是以下三种类型之一：

- 字符串 `'*'`，表示该时间粒度可以为任意值；
- 数字，表示该时间粒度需要对应某个数值；
- 一个**递增**的数字数组，表示该时间粒度可以对应若干数值。

**注意： 每个字段的默认值都为 `'*'`，但当一个粒度较粗的字段被指定时，更细的时间粒度的默认值会变为数字零 `0`。**

## pattern 样例

| 含义                            | 写法                                 | 说明                                                                   |
| ------------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| 任意时刻                        | `{}`                                 | 不提供任何一个字段，所有时间粒度都对应 `'*'`                           |
| 每分钟的开始                    | `{ minute: '*' }` 或 `{ second: 0 }` | 两种写法均对应 `{ hour: '*', minute: '*', second: 0, millisecond: 0 }` |
| 每一个小时的第 0 / 20 / 40 分钟 | `{ minute: [0, 20, 40] }`            | 对应 `{ hour: '*', minute: [0, 20, 40], second: 0, millisecond: 0 }`   |
| 每天 9/15 点的第 55 分钟        | `{ hour: [9, 15], minute: 55 }`      | 对应 `{ hour: [9, 15], minute: 55, second: 0, millisecond: 0 }`        |

## `schedule(pattern, worker, ...args)`

启动一个定时任务，在接下来每一个满足 `pattern` 的时刻，`worker` 都将被执行。`schedule` 是一个 sagaHelper（和 `takeEvery` 类似），调用 `schedule` 将返回一个 fork effect，而 yield fork effect 可以得到一个 task 对象，我们可以通过 task 对象来取消任务。调用 `schedule` 时，我们可以通过参数 `args` 来指定 `worker` 被调用的所使用的参数。

```javascript
function* gen() {
  const task = yield schedule({ hour: '*' }, worker, ...args)
  // 在接下来每个小时的开头，worker 都会像这样被调用：worker(...args)
  // 我们可以像这样来取消任务：yield io.cancel(task)
}
```

## `waitWithPredicate(pattern, predicate)`

`wait` 的 `pattern` 参数比较简单，这样 @little-saga/schedule 可以**根据目标时刻直接计算出还需要等待多少时间**；而 `waitWithPredicate` 则允许我们指定更加灵活的条件，其接受参数 `predicate`，用来判断某个时刻是否满足时间条件。 `predicate` 被调用时会接受一个参数 `date`，类型为 JavaScript 内置的 `Date` 类，该函数需要返回一个布尔值表示 `date` 是否满足了条件。如果 `date` 不满足 `predicate`，则 `waitWithPredicate` 会等到下一个满足 `pattern` 的时刻，然后再重新进行判断，直到满足 `predicate`。

```javascript
function* gen() {
  const isWed = date => date.getDay() === 3
  // 在每天「早上 8 点」，isWed 都会被调用来判断当前日期是否满足条件
  // ...直到下一个「周三的早上 8 点」
  yield io.call(waitWithPredicate, { hour: 8 }, isWed)
}
```

## `scheduleWithPredicate(pattern, predicate, worker, ...args)`

与 `schedule` 类似，但接受 `predicate` 用于指定额外的条件。
