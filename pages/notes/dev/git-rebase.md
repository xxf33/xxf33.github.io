---
date: 2023/8/19
title: Git 变基操作
category: 开发
tags:
  - git
---

在查看 GitHub 上某些开源项目提交历史时，我发现它们的主分支提交历史记录虽然有数千次之多，但基本都是“线性”的（很难看到有网状交叉的地方），比如 [react](https://github.com/facebook/react)、[vue](https://github.com/vuejs/core) 等，使得整个提交记录看起来相当的干净清爽。

经过一番研究后，我发现了 git rebase，也就是变基这个命令。本文就变基相关操作和应用场景做一些个人总结。
