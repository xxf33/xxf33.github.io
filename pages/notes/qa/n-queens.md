---
date: 2023/2/26
title: 八皇后问题
category: 问答
tags:
  - 算法
---

> [!WARNING] ❓
>
> 如何能够在 8×8 的国际象棋棋盘上放置八个皇后，使得任何一个皇后都无法直接吃掉其他的皇后？
>
> 即要求任两个皇后都不能处于同一条横行、纵行或对角线上。

## 问题说明

这个问题可以细分成以下三个问题：

1. 找到任意一种具体摆法
2. 找到总共有多少种摆法
3. 找到所有具体摆法

## 摆法演示

<DemoWrapper :loader="() => import('@/demos/n-queens/main.vue')" />

## 代码示例

## 参考链接

- [Eight_queens_puzzle | 维基百科](https://en.wikipedia.org/wiki/Eight_queens_puzzle)
- [51. N 皇后 | 力扣](https://leetcode.cn/problems/n-queens/solution/)
- [八皇后 + 位运算 | GitHub](https://github.com/MaigoAkisame/Queens)
