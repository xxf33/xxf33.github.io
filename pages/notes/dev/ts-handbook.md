---
date: 2023/1/29
title: TypeScript 官网手册
category: 开发
tags:
  - typescript
---

> [!TIP] 💬
>
> 本文是作者在阅读文档 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) 时整理的笔记，主要包含以下内容：
>
> - 文档中的一些使用案例
> - 网络上的一些最佳实践

## 原始类型

### string, number, boolean

- 声明变量时如果能给定初始值，通常可省略显性的类型注解，由 TypeScript 自动推断类型  
  此时需要注意在 JavaScript 中可行的代码，在 TypeScript 中也许会编译不过，举个例子：

```js
let count = 0
/** do something */
count = `合计：${count}` // [!code error]
```

> [!TIP] 💡 避免同时使用原始包装类型 String, Number, Boolean 和 new
>
> - 原因一：原始包装对象实际上是对象，这意味着 typeof 将返回 "object"，而不是 "string"、"number" 或 "boolean"。
> - 原因二：对于布尔型对象，每个对象在涉及到条件判断语句时，总是被解析为 true，即使它的实际值是 false。
>
> 详情可以参考 [no-new-wrappers | eslint](https://zh-hans.eslint.org/docs/latest/rules/no-new-wrappers)

### null, undefined

- 在 **tsconfig.json** 中设置编译选项 [strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks) 为 `true`，能严格区分 `null` 和 `undefined` 类型
- 开发者可以使用非空断言符 `!` 来告知编译器"我"确保非空，从而避免书写额外的类型判断语句

```ts
function liveDangerously(x: number | null) {
  console.log(x!.toFixed())
}

liveDangerously() // 当strictNullChecks=false, 无法编译通过
```

### 类型断言

- 使用此特性可以自由指定变量的类型，但需要开发者自行承担类型风险
- 避免无意义的断言（编译器限定断言前和断言后的两个类型得有非空交集）

```ts
/**
 * 编译器默认 document.getElementById 返回类型是 HTMLElement | null
 * 但开发者确保 #input 的元素一定是一个 <input /> 元素，可以使用类型断言
 * 从而帮助编译器推断 myInput 的类型
 */
const myInput = document.querySelector('#input') as HTMLInputElement

// error string 和 number 的交集为空
const x = 'hello' as number // [!code error]
// 不过可以使用 any 或者 unknown 搭桥
const y = 'world' as any as number
```

### 字面量类型

- 与 **string** 类型的区别

```ts
function printText(s: string, alignment: 'left' | 'right' | 'center') {
  // ...
}

printText('hello world', 'left')
printText('good morning', 'centre') // [!code error]

// 返回值类型被推断成字面量类型 -1 | 0 | 1
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1
}
```

- `as const` 的使用示例

```ts
// 示例一：我们期望 counter 字段是一个字面量类型
const obj = { counter: 0 }
obj.counter = 1
// 对单个字段断言
const obj$2 = { counter: 0 as const }
// 对所有字段断言
const obj$3 = { counter: 0 } as const
// oops: 现在 obj.counter 不接受除 0 以外的其他赋值
obj$2.counter = 1 // [!code error]

// 示例二：限定 method 只接受 GET 或者 POST 请求方法
function handleRequest(url: string, method: 'GET' | 'POST') {
  // ...
}

const req = { url: 'https://example.com', method: 'GET' }
handleRequest(req.url, req.method) // [!code error]
```

### 数组和元组

- 数组：可注解其中元素的类型。比如：使用 `Array<string>` 或者 `string[]` 注解一个字符串类型的数组
- 元组：限定了长度的数组，相比数组，可以更方便地为其中每个元素指定类型

```ts
type SortOptions = [number, number, number]

// 假定输入参数类型限定为三元组
function sort(args: SortOptions) {
  // ...
}

const arg1 = [1, 2, 3]
// oops arg1 类型是 number[]，无法兼容更严格的元组类型
sort(arg1) // [!code error]
// 我们可以使用类型断言
const arg$2 = [1, 2, 3] as SortOptions
sort([...arg$3])
// 或者展开一个字面量数组
let arg$3 = [1, 2, 3] as const
sort([...arg$3])
```

### 类型谓词

- 关键字 `is` 使用示例

```ts
/**
 * 我们知道当 isString 返回 true 时，foo 就是 string 类型
 * 但编译器并不知道这个信息，使用类型谓词可以帮助编译器获取这个信息
 */
function isString(foo: unknown): foo is string {
  return typeof foo === 'string'
}

function example(foo: unknown) {
  if (isString(foo)) {
    // 由于使用了类型谓词，编译器会推断 foo 是 string 类型
    console.log(`it is a string ${foo}`)
    console.log(string.toLowerCase())
  }
  // foo 现在又被视为 unknown 类型了
}
```

总结来看，它很像 `as` 断言（能让开发者自己决断类型），但是不如 `as` 自由， 它需要在函数返回值为 `true` 时才成立

- 另一个例子，在使用数组的 filter 方法时可能面临的困境和解决方案

```ts
// 我们期望 filteredArray 是 number 类型的数组 因为假值被过滤掉了
const filteredArray = [1, 2, undefined].filter(Boolean) // (number | undefined)[]
// 但是很遗憾，上面的代码并不能达到我们的期望
// 不过可以使用类型谓词 或者 类型断言
const filteredArray$2 = [1, 2, undefined].filter((item): item is number => {
  return !!item
}) // number[]
```

### never

从字面意义看，never 表示一个不可能得到的类型（与空集概念类似）  
比如 `type N = string & number`，由于 `string` 和 `number` 没有非空交集，`N` 会编译器被推断为 `never` 类型

- 使用场景一：在分支判断中，确保已列举了所有可能选项

```ts
interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  sideLength: number
}

type Shape = Circle | Square | Triangle

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}

// 如果后续有人为 Shape 添加了一个新的可能选项
// 编译器将在上面的 switch 语句中提示错误
interface Triangle {
  kind: 'triangle'
  sideLength: number
}

type Shape = Circle | Square | Triangle
```

- 使用场景二：表示后续代码不会执行（比如抛出异常时）

```ts
function throwError() {
  throw new Error('error reason')
}

function firstChar(msg: string | undefined) {
  if (msg === undefined) throwError()

  const ch = msg.charAt(1) // [!code error]
}

// 我们可以在 firstChar 函数中使用类型缩窄
function firstChar(msg: string | undefined) {
  if (msg === undefined) {
    throwError()
  } else {
    const ch = msg.charAt(1)
  }
}

// 为了通用，可以将 throwError 返回值类型注解为 never
function throwError(): never {
  throw new Error('error reason')
}
```

## 函数类型

### 类型签名

- 类型注解：为函数的输入参数和返回值两部分提供类型注解
- 可调用签名：如果想表示某个对象类型既支持函数调用，也有特定字段时

```ts
interface DescribableFunction {
  description: string
  (someArg: number): boolean // 添加1个可调用签名，也可以添加多个
}

function doSomething(fn: DescribableFunction) {
  console.log(`${fn.description}`)
  returned`${fn(6)}`
}
```

- 构造签名：需要为构造函数添加类型注解时，在可调用签名的基础上添加关键字 `new`

```ts
interface CallOrConstruct {
  new (s: string): Date
  (n?: number): number
}

const d1 = new Date(1667447141572)
const d2 = new Date()
```

### 可选参数

- 在形参上使用可选参数符 `?`，意味着该位置上的实参可以省略
- 使用 `?` 在调用时能带来便利，但可能需要在函数体中添加类型缩窄语句来处理空值，这时预先给定一个默认值或许会更有用

```ts
function f1(x?: number) {
  console.log(typeof x)
}

function f2(x = 10) {
  console.log(typeof x)
}

f1() // print "undefined"
f2() // print "number"
```

### 泛型

- 使用场景：当需要在输入参数和返回值之间建立类型关联时

```ts
// 返回值类型被推断成 any
function firstElement(arr: any[]) {
  return arr[0]
}

// 返回值类型被推断成 T
function firstElement$2<T>(arr: T[]) {
  return arr[0]
}
```

- 使用 `extends` 关键字为泛型参数添加约束条件

```ts
function longest<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a
  } else {
    return b
  }
}

// 返回值类型是 'number[]'
longest([1, 2], [1, 2, 3])
// 返回值类型是 'alice' | 'bob'
longest('alice', 'bob')
longest(10, 100) // [!code error]
```

- 使用误区：将约束条件和类型本身混淆

```ts
function minimumLength<T extends { length: number }>(
  obj: T,
  minimum: number
): T {
  if (obj.length >= minimum) {
    return obj
  } else {
    // Type '{ length: number }' is not assignable to type 'T'.}
    return { length: minimum } // [!code error]
  }

  const arr = minimumLength([1, 2, 3], 6)
  // 按上面实现，arr 应该是一个对象类型，没有对应的 slice 方法
  console.log(arr.slice(0))
}
```

- 原文中给出如何写好泛型函数的建议(😀 让调用者能愉快调用)

  - Push Type Parameters Down
  - Use Fewer Type Parameters
  - Type Parameters Should Appear Twice

### 重载

- 使用场景：函数调用时需要允许传入不同的输入参数（包括参数个数、参数类型）
- 语法形式：重载签名在前，具体实现在尾(实现中的输入参数需要兼容签名所有签名)

```ts
function fn(x: string): string
function fn(x: number): boolean
function fn(x: string | number): string | boolean {
  return 'hello, typescript'
}
```

个人看法：重载可以让函数的调用更方便(只需要记住一个函数名，输入参数看类型提示)，但对于函数的实现来说，由于需要处理所有可能的输入参数情况，这可能会增加很多类型判断的语句，影响可读性。更建议在写一些公开库时使用重载，业务代码中还是使用不同的函数名来区分。

一个使用示例

```ts
/**
 * 数组 reduce 方法的重载签名
 */
interface Array<T> {
  // ...
  reduce: ((
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ) => T) &
    ((
      callbackfn: (
        previousValue: T,
        currentValue: T,
        currentIndex: number,
        array: T[]
      ) => T,
      initialValue: T
    ) => T) &
    (<U>(
      callbackfn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number,
        array: T[]
      ) => U,
      initialValue: U
    ) => U)
  // ...
}

const A = [1, '2', 3]
// 🤔 我们该如何修正报错？
const str: string = A.reduce((str, a) => `${str} ${a.toString()}`, '') // [!code error]
```

## 对象类型

> 汇总到 [TypeScript 类型体操](./ts-type-gym)

## 类类型

### 构造函数

- 与之前函数签名的区别

  1. 不支持类型参数
  2. 不需要注解返回值类型

- [super](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super) 关键字的使用

```ts
class Base {
  k = 4
}

class Derived extends Base {
  constructor() {
    // 🤔
    console.log(this.k) // [!code error]
    super()
  }
}
```

### 类成员

- 成员字段的类型注解

```ts
class Point {
  // 声明时注解类型
  x: number
  // 也可以给定一个初始值，编译器会自动推断类型
  y = 0 // 相当于 y: number = 0

  constructor() {
    // 在构造函数中初始化成员字段
    this.x = 0
    this.z = 0 // [!code error]
  }
}
```

- [static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static) 关键字

```ts
// 🤔 以下案例报错原因
class Box<T> {
  static defaultValue: T // [!code error]
}
```

- 只读修饰符

```ts
// 以下两种方式均可表示类成员字段只读
class Greeter {
  // 方式一 使用 readonly 修饰符
  readonly name: string = 'world'
  _length = 0

  // 方式二 仅实现 getter 存取器
  get length() {
    return this._length
  }

  foo() {
    this.name = 'world2' // [!code error]
    this.length = 1 // [!code error]
  }
}
```

- 可见性修饰符

|    修饰符     | 类自身 | 子类 | 类实例 |
| :-----------: | :----: | :--: | :----: |
|  **public**   |   ✔️   |  ✔️  |   ✔️   |
| **protected** |   ✔️   |  ✔️  |   ❌   |
|  **private**  |   ✔️   |  ❌  |   ❌   |

📝 以上修饰符不会出现在发出的 JavaScript 文件上，也就是说仅 TypeScript 中有效。如果有相关需要可使用前缀 [#](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) 来表示私有成员

### 类继承

- 使用 `implements` 关键字（JavaScript 不支持）
- 使用 `extends` 关键字，参考 [extends | mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)
- 在实例化类时，子类成员的声明顺序

```ts
class Base {
  name = 'base'
  constructor() {
    console.log(`My name is ${this.name}`)
  }
}

class Derived extends Base {
  name = 'derived'
}

// 🤔 prints "base" or "derived"
const d = new Derived()
```

### this

> ["this" in TypeScript](https://github.com/microsoft/TypeScript/wiki/'this'-in-TypeScript)
