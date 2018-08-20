# schedule

用 saga 来管理定时任务。该类库提供了以下 4 个 API。

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

**注意：** 每个字段的默认值都为 `'*'`，但当一个粒度较粗的字段被指定时，更细的时间粒度的默认值会变为数字零 `0`。

### pattern 举例

| 含义                            | 写法                                 | 说明                                                                   |
| ------------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| 任意时刻                        | `{}`                                 | 不提供任何一个字段，所有时间粒度都对应 `'*'`                           |
| 每分钟的开始                    | `{ minute: '*' }` 或 `{ second: 0 }` | 两种写法均对应 `{ hour: '*', minute: '*', second: 0, millisecond: 0 }` |
| 每一个小时的第 0 / 20 / 40 分钟 | `{ minute: [0, 20, 40] }`            | 对应 `{ hour: '*', minute: [0, 20, 40], second: 0, millisecond: 0 }`   |
| 每天 9/15 点的第 55 分钟        | `{ hour: [9, 15], minute: 55 }`      | 对应 `{ hour: [9, 15], minute: 55, second: 0, millisecond: 0 }`        |

## `schedule(pattern, worker, ...args)`

(todo)

## `waitWithPredicate(pattern, predicate)`

(todo)

## `scheduleWithPredicate(pattern, predicate, worker, ...args)`

(todo)
