---
date: 2023/4/6
title: Git 撤销操作
category: 开发
tags:
  - git
---

在我刚接触 Git 时，听到过这么一种说法：Git 很强，只要文件被追踪，就不用担心出现丢失问题。

后续使用时，我确实感受到了 Git 的强大功能，但时不时也会面临一些困境。究其原因，一方面是相关的命令太多，操作起来有一定的心智负担；另一方面还是担心会把历史提交或者已有改动给弄没了。

本文尝试列举一些常见的撤销命令，以作备忘。

## reset 和 revert

### 辨析 git reset 的选项

`git reset` 用于将 HEAD 指针重置到指定的提交，根据传入选项的不同，会有不同的结果。常见有以下三种选项：

- `--mixed` （默认选项）
- `--soft`
- `--hard`

关于它们的区别，这里我动手实践了下：用以下 4 个文件来模拟某个工作目录下文件可能的状态，然后执行 `git reset HEAD`，分别记录传入不同选项时的执行结果。

```bash [每次操作前的状态]
$ git status -s
A  new.md        # 新添加到暂存区的文件
M  package.json  # 有修改并且暂存的文件
 M readme.md     # 有修改但未暂存的文件
?? untracked.md  # 新添加的还没有被追踪的文件
```

::: code-group

```bash [--mixed]
$ git reset HEAD
Unstaged changes after reset:
M       package.json
M       readme.md

$ git status -s
 M package.json
 M readme.md
?? new.md
?? untracked.md
```

```bash [--soft]
$ git reset --soft HEAD

$ git status -s
A  new.md
M  package.json
 M readme.md
?? untracked.md
```

```bash [--hard]
$ git reset --hard HEAD
HEAD is now at ...

$ git status -s
?? untracked.md
```

:::

将结果汇总如下：

| 文件名       | 操作前状态   | `--mixed`       | `--soft` | `--hard`       |
| ------------ | ------------ | --------------- | -------- | -------------- |
| package.json | 修改后已暂存 | 🧹 修改后未暂存 | 无变化   | ✂️ 修改会被删  |
| readme.md    | 修改后未暂存 | 无变化          | 无变化   | ✂️ 修改会被删  |
| new.md       | 新添加已暂存 | 🧹 新添加未暂存 | 无变化   | ❌️ 文件会被删 |
| untracked.md | 新添加未暂存 | 无变化          | 无变化   | 无变化         |

简而言之：

- 从影响范围看，这三者都只影响已经被 git 追踪的文件，更具体点，它们影响的是已暂存和还未暂存的改动
- 从操作风险看，只有 `--hard` 选项会导致改动或者文件被删，默认选项 `--mixed` 会清空暂存区

另外，还有两种不太常见的选项： `--keep` 和 `--merge`

顾名思义， `--keep` 选项会保留工作目录的修改，举个例子，假设当前分支有未提交的修改（不管是否暂存），执行 `git reset --keep HEAD~1`，会尝试将 HEAD 移动到父提交（假设是 B），若 B 中的文件与工作目录修改无冲突，则重置成功, 如果有冲突，则会终止重置，报错提示冲突文件。

而 `--merge` 选项则会在重置时保留解决冲突时的临时改动，举个例子，我们在合并出现冲突后，如果已经解决了部分冲突，但是又想取消合并，此时就可以使用 `git reset --merge` 选项，它会保留解决冲突时的临时改动，然后重置到父提交。

总结一下，这两个选项提供了比 `git reset --hard` 更安全的替代方案，避免意外丢失工作成果。

- 使用 `git reset --keep`：当你想重置分支但保留工作目录的修改，同时不影响暂存区的改动。
- 使用 `git reset --merge`：当合并失败后想取消操作，但保留解决冲突时的部分临时改动。

### git revert 的使用

`git revert` 用于撤销一个或多个提交，但不会删除历史记录，而是在反转指定的提交后，再创建一个新的提交记录，像是在提交记录上打了一个新的补丁，可能不美观但是稳定可靠。

相关命令：

```bash
# 撤销一个或多个指定提交，然后编辑新的提交信息
git revert <commit-hash1> <commit-hash2> <commit-hash3>

# 如果想直接使用默认的信息提交，不重新编辑，可以添加 --no-edit 选项
git revert --no-edit <commit-hash1> <commit-hash2> <commit-hash3>

# 如果想阻止撤销后的立即自动提交，可以添加 -n 选项
git revert -n <commit-hash1> <commit-hash2> <commit-hash3>
```

## clean 和 rm

二者都可以用来删除工作目录下的文件，区别在于它们的操作对象不同。

`git clean` 仅针对未被 git 追踪的文件，而 `git rm` 则针对已被 git 追踪的文件。

相关命令：

- `git clean -n`： 展示给用户看哪些文件会被删除，并不会真的执行
- `git clean -f`： 请谨慎使用任何一个 `-f` 选项，防止误删
- `git clean -df`： `-d` 表示目录，即强制删除未被追踪的空目录
- `git clean -dfx`：删除所有没有被跟踪的文件和目录，包括那些被忽略的文件

<hr />

- `git rm <filepath>`： 将文件从工作目录中删除，仅当文件没有更改时有效
- `git rm -f <filepath>`： 强制将文件从工作区和暂存区中删除，即使文件有未提交的修改
- `git rm --cached <filepath>`： 将文件从暂存区中删除，但保留在工作目录中
- `git rm -r <dir-path>`： 递归地将目录及其子目录下的所有文件从工作目录和暂存区中删除

## checkout 和 restore

使用 `git checkout <filepath>` 可以将工作目录下已经改动的指定文件恢复成上次提交的状态，这意味着它会丢失其中未暂存的更改，有一定风险。

另外考虑到 checkout 命令还有操作分支的用法，Git 在 2.23 版本（2019 年 8 月发布）新增了 `git restore` 命令专门用于文件恢复操作。

相关命令：

- `git restore <filepath> --staged`：将文件从暂存区域移出
- `git restore <filepath>`：将文件恢复到上次提交时的状态，同 git checkout
- `git restore .`：还原工作目录下所有未暂存的文件
- `git restore '*.js`：还原所有扩展名为 .js 的文件的内容
- `git restore --source=<commit> <filepath>`：还原文件到指定的某次提交

## 小结

### 撤销 git add 的备选方案

- `git restore --staged <filepath>`： 将暂存区指定文件恢复到工作目录
- `git restore --staged .`： 将暂存区所有文件恢复到工作目录
- `git reset <filepath>`： 将暂存区指定文件移除
- `git reset .`： 将暂存区所有文件移除
- `git rm --cached <filepath>`： 将暂存区指定文件移除

### 撤销 git commit 的备选方案

- `git revert <commit-hash>`： 创建一个新的提交，用于撤销指定提交的修改
- `git reset --soft <commit-hash>`： 将当前分支重置到指定提交，并将修改放到暂存区
- `git reset <commit-hash>`： 将当前分支重置到指定提交，并将修改放到工作目录
- `git reset --hard <commit-hash>`： 将当前分支重置到指定提交，并丢弃所有修改

### 撤销 git push 的备选方案

- `git revert <commit-hash>`： 创建一个新的提交，用于撤销指定的提交，并将其推送到远程分支
- `git reset --hard <commit-hash>`： 将当前分支重置到指定提交，并丢弃所有修改，然后强制推送，但这会影响远程分支的提交记录历史，不建议在有多人协作的仓库上使用
- `git rebase -i <commit-hash>`： 将当前分支的提交记录重新排序、编辑或删除，然后强制推送，这会改变提交记录的顺序，还是不建议在多人协作的仓库上使用

## 情景模拟

### 情景一：误删除

> 我修改一些了文件并且添加到暂存区，但没有提交，后续误操作将这些文件从硬盘上删除了，那么我的修改记录还能找回吗？

如果暂存区域没有重置的话，那么可以从暂存区恢复，参考命令：

```bash
# 列出所有已被添加到暂存区的文件
git ls-files

# 恢复暂存区的指定文件到工作目录
git checkout -- <file-path>
```

如果暂存区域已经重置了，那么可以尝试从 git 的悬空对象找回。

1. 执行命令 `git fsck --lost-found` 会列出所有悬空对象
2. 执行 `git show <blob hash>` 查看具体内容
3. 如果内容是你要找的文件，那么可以执行 `git show <blob hash> > <file-path>` 恢复到工作目录。

或者在执行第 1 步后直接进入 .git/lost-found 目录，上述所有悬空对象内容都会被写入到该目录下。

> [!TIP]
>
> 本地分支可以及时提交，不用担心会有冗长的提交记录，正式推送前稍微 "打平" 即可

### 情景二：误推送

> 我误将一些敏感文件推送到了远程仓库，该如何撤回，且不留痕迹？

撤回可参考小结中 git push 的备选方案。但想要做到不留痕迹，意味着需要重写提交历史，得使用强制推送。这其实相当麻烦，特别时当这个仓库还有其他协作者，同时还得考虑自己有没有强推的权限，这些都需要额外的沟通成本。

参考：

- [git-filter-repo](https://github.com/newren/git-filter-repo) 工具可用来重写提交历史
- GitHub 参考文档 [清除敏感数据](https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

> [!TIP]
>
> 在向公共仓库 push 代码前，相比于为可能出现的错误的提交买单，多检查一下要提交的文件总是值得的。

## 后记

我发现在日常使用中，遇到问题时向 `ChatGPT` 或者 `new bing` 求助，也能获得一些不错的解决方案，尤其是当自己毫无头绪的时候 🤔。
