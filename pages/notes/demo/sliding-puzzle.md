---
date: 2023/6/27
title: 滑动拼图
category: 练习
tags:
  - 小游戏
  - 算法
---

有次在便利店排队结账时，看到有小朋友在玩一个拼图相关的玩具，通过借助地图上的一个空位来不断挪动拼图的位置，最终复原出被打乱的拼图。

想起自己小时候也玩过类似的玩具，不过那时候怎么都拼不出来，后来发现可以大力出奇迹，只要先把拼图用蛮力抠出来，再重新按顺序装进去就可以了...

现在我尝试做了一个网页版本，终于是能够正常拼出来了 😎。

## 试玩

<DemoWrapper :loader="() => import('@/demos/sliding-puzzle/main.vue')"></DemoWrapper>

## 日志

### 开局乱序

最开始我是直接用随机的方法打乱滑块位置，但是试玩后，我感觉有些局面压根无解。例如下面这两组拼图开局, 移动几次后，你也会发现存在一些无解的局面。

<DemoWrapper :loader="() => import('@/demos/sliding-puzzle/non-solution.vue')" :center="false"></DemoWrapper>

也就是说，要使这个游戏能正常进行下去，我们需要确保给玩家的开局一定是有解的。

一种简单的思路是考虑到每次滑动都是“可逆”的，于是可以采用从终点开始“倒着滑”的方式，即每次从上下左右四个方向随机一个方向进行滑动，这样重复一定次数后，得到的开局肯定是有解的。其中，设定的滑动次数应该与棋盘规格正相关，比如设定成线性关系 `长 * 宽 * 20`。

另一种思路就比较复杂，但更有挑战性。如果我们能尝试找出棋盘局面与其是否有解之间的关系，应该就可以任意构造一种有解的局面。

### 自动完成

## 后记

感觉自己小时候拼不出来的很大原因是滑动的是图片，因为滑动数字时，我可以很轻松的获取到如下信息：

- 任一数字滑动块最终的位置
- 两个数字滑块最终的相对位置：谁在上、谁在下、谁在左、谁在右

而切换到图片滑块，就需要在时刻在脑海中做一层转换——图片对应的数字，难度自然增加了不少（至少对我来说）。

## 参考链接

- [15 puzzle | 维基百科](https://en.wikipedia.org/wiki/15_Puzzle)
- [773. 滑动谜题 | 力扣](https://leetcode.cn/problems/sliding-puzzle/)
- [Implementing A-star(A\*) to solve N-Puzzle](https://algorithmsinsight.wordpress.com/graph-theory-2/a-star-in-general/implementing-a-star-to-solve-n-puzzle/)
