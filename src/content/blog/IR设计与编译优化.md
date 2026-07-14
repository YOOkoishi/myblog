---
title: 编译学习笔记
description: 学习一些常见的编译优化
pubDate: 2026-3-20
image: /image/compliers.png
categories:
  - tech
tags:
  - 编译器
  - compliers
  - 学习笔记
badge: Pin

draft: true
---



---

## 优化概述

本节大部分内容摘抄于 《编译器设计(第二版)》

### 优化的考虑

进行编译优化的时候,可以从安全性,可获利性,风险三个维度进行考虑.

#### 安全性

如果要指出编译器必须满足的一条最重要的准则，那么它就是正确性：编译器所产生代码的语义必须与输入程序相同。

在优化器每次应用变换时，其施加的操作必须保持编译器原有转换过程的正确性。通常，语义（meaning）定义为程序的可观察行为。对于批处理程序，此即该程序停止后的内存状态及其产生的输出。如果程序终止，那么无论编译器使用的是哪种转换方案，在程序停止的前一时刻，所有可见变量的值都应该是相同的。对于交互程序，其行为更为复杂，也更难于描述。

Plotkin形式化了这一概念，称为可观察等价性（observational equivalence）。

对于两个表达式 `M` 和 `N` , 当且仅当在 `M` 和 `N` 均为封闭（即没有自由变量）的上下文 `C` 中，对 `C[M]` 和 `C[N]` 求值，二者或者产生相同的结果或者均不停止时，我们称 `M` 和 `N` 是 **可观察等价** 的。因而，如果两个表达式对可见外部环境的影响是相同的，那么二者就是可观察等价的。

实际上，与Plotkin的定义相比，编译器使用的等价性概念更简单且宽松，即如果在实际的程序上下文中，两个不同表达式 `e` 和 `e'` 产生相同的结果，那么编译器即可用 `e'` 替换 `e`。该标准只处理在程序中实际出现的上下文，而根据上下文来调整代码正是优化的本质。它没有提到计算出错或脱节时应该如何。

实际上，编译器会慎重处理，以免发生脱节的情况：即原来的代码工作正确，而优化后的代码试图除以零或无限循环。而反过来的情形，即原来的代码脱节、而优化后的代码工作正常的情况则很少被提及.

在我写数组初始化列表语义分析的时候就可以感受上述这句话的一些情况.GCC等编译器可以检测不符合语义规范的数组初始化列表,并且成功编译运行.

#### 可获利性

类似循环展开的操作为什么可以提高性能?

- 循环迭代的总数减少.减少了由循环控制带来的开销操作:加法,比较,跳转和分支.
- 数组地址计算包含了很多重复的工作,展开后只需要计算一次,然后复用即可.
- 变换后的循环执行一次内存操作能够执行更多的工作,展开后的循环受限于内存的可能性较小.能够减少 `load` 操作的一些延迟.

其余很多优化最终的目的也是减少访存的延迟,精简指令的数量.

#### 风险

进行类似循环展开的优化时,对寄存器的需求会增加,这对寄存器的分配增加了难度.地址计算的形式也会变化,会引用比原来多得多的不同内存位置,编译器必须谨慎的构造地址计算的形式.以避免重复计算和对寄存器的过多需求.

### 优化的时机

可以从几种不同的来源来考虑可供编译器利用的时机:

1. 减少抽象的开销
2. 利用特例
3. 将代码匹配到系统资源

### 优化的范围

优化的作用范围从小到大通常可以分为：

1. 局部优化
2. 区域性优化
3. 过程内优化
4. 过程间优化

局部优化只在单个 basic block 内进行，不需要考虑复杂的 CFG 信息。

区域性优化的范围大于单个 basic block，但小于整个函数。常见区域包括 EBB、trace、superblock 和 loop。以 EBB 为例，它是一组具有单入口性质的基本块：入口块可以有来自区域外的前驱，而区域内除入口块外的每个基本块都只有一个前驱，并且该前驱也在区域内。

教材中常说的 global optimization 实际上通常指函数内全局优化，也就是在整个函数 CFG 范围内进行分析和变换。为避免和 whole-program optimization 混淆，本文后面称其为过程内优化。

过程间优化会跨越函数边界，可能涉及调用图、函数副作用分析、内联、过程间常量传播、死参数删除等。

---

## 优化（IR设计）实战

下面的内容来自于毕昇杯项目 yoolang 。

[yoolang](https://github.com/YOOkoishi/yoolang)

### IR设计

这次的编译器我设计了三层IR.

分别是：

负责循环优化，参考 mlir 保留 Region 的高层 IR , yir.

负责常规 SSA 形式编译优化的类 llvm ir, oir.

负责平台相关内容，贴近RISCV汇编的 machine IR, mir.

我将分别叙述一下他们的细节。

#### yir

yir 使用 `Module` `Function` `Region` `Operation` 来表示代码结构

```text
Module (模块)
  ├── Golbal Value
  └── Function (函数)
        └── Region (区域/函数体)
              ├── Operation (普通op，如 Add, Assign)
              └── Operation (高级op，包含嵌套结构，如 IfOp, WhileOp)
                    ├── Region (如 then_region)
                    │     └── Operation (内部指令...)
                    └── Region (如 else_region)
```

参考了 mlir 中关于 `Operation` 的一些设计。

**参考程序**:

```c
int count;

int main() {
  int a = 7;
  while (a != 1) {
    count = count + 1;
    if (a % 2 == 0) {
      a = a / 2;
    } else {
      a = a * 3 + 1;
    }
  }
  return count;
}
```

编译器会将以上程序翻译成以下的 yir 形式:

```ir
module {
  yir.global @count : i32 = zero
  yir.func @main() -> i32 {
    %v0 = yir.const.i32 7 : i32
    %a = yir.var : i32 = %v0
    yir.while {
      ^cond:
        %v1 = yir.const.i32 1 : i32
        %v2 = yir.icmp ne %a, %v1 : i1
        yir.cond %v2
      ^body:
        %v3 = yir.const.i32 1 : i32
        %v4 = yir.addi @count, %v3 : i32
        yir.assign @count, %v4
        %v5 = yir.const.i32 2 : i32
        %v6 = yir.remsi %a, %v5 : i32
        %v7 = yir.const.i32 0 : i32
        %v8 = yir.icmp eq %v6, %v7 : i1
        yir.if %v8 {
          %v9 = yir.const.i32 2 : i32
          %v10 = yir.divsi %a, %v9 : i32
          yir.assign %a, %v10
        } else {
          %v11 = yir.const.i32 3 : i32
          %v12 = yir.muli %a, %v11 : i32
          %v13 = yir.const.i32 1 : i32
          %v14 = yir.addi %v12, %v13 : i32
          yir.assign %a, %v14
        }
    }
    yir.return @count
  }
}
```

**Module**

`Module` 代表了整个编译单元，对应一个 `.sy` 或 `.c` 源代码文件。其包含了所有全局对象（`globals_`）和函数（`functions_`）。

**Region**

`Region` 对应了高级语言中的 **代码块 `{ ... }` 作用域** 。 每个函数包含一个 `body_` Region，其中含有多个 `Operation` ,顺序执行。

**Operation**

`Operation` 是 yir 的地基，其包含了两种类型。

一种是普通的类型，比如二元运算（`AddIOp`），赋值（`AssignOp`），变量（`VarOp`）等。

另一种 `Operation` 中会包含若干 `Region` ，比如 `IfOp` `WhileOp` `ForOp` 等。

---

有了以上的这些结构化设计，`while`，`for` 等循环的边界变得很清晰，不会出现类似llvm ir这种扁平化ir中先推导支配树，再进行分析的情况。

以及保留了变量常量声明中的形式，变量声明会以类似`%x = yir.var : i32 = %v2`的 `Operation` 形式存储。这样可以简化信息。

所以，在yir中做循环分析(LoopAnalysis)，循环展开融合(LoopUnroll&Jam)或者多面体(Polyhedral) 都是很合适的。



---

#### oir

oir 是我设计的一层中层 SSA IR. 其将yir中结构化的控制流降成显示的 cfg,同时保留类型,SSA value和相对高层的内存操作。

实现上，oir有自己的类型系统，`Value/User/Instruction` ，use-def 关系，`BasicBlock` 前驱后继， terminator 和 `phi`. YIR lowering的时候，标量和变量尽量SSA化，数组和内存对象用 `alloca/gep/load/store` 表达.后续优化包括 `Mem2Reg`、`SROA`、`SCCP`、`GVN`、`LICM`、`DSE`、`DLE`、`ADCE`、`JumpThreading` 等，分析部分也有 `DominatorTree`、`LoopInfo`、`SCEV`、`AliasAnalysis`、`FunctionModRef` 和 `MemorySSA`。

其结构如下图所示


```text
Module
  ├── GlobalValue...
  └── Function...
        ├── Argument...
        └── BasicBlock...
              ├── PhiInst...        
              ├── Instruction...
              └── terminator        
                    ├── ReturnInst
                    └── BranchInst  

```

对于上述测试文件，会输出以下IR形式(未启用优化)

```oir
; module: yoolang.oir

@count = global i32 zero

define i32 @main() {
entry.0:
  br %while.cond.1
while.cond.1:
  %a.loop = phi [7, %entry.0], [%a.phi, %if.end.6]
  %v2 = icmp ne i32 %a.loop, 1
  br i1 %v2, %while.body.2, %while.end.3
while.body.2:
  %count.load = load i32, i32* @count
  %v4 = add i32 %count.load, 1
  store i32 %v4, i32* @count
  %v6 = srem i32 %a.loop, 2
  %v8 = icmp eq i32 %v6, 0
  br i1 %v8, %if.then.4, %if.else.5
while.end.3:
  %count.load.1 = load i32, i32* @count
  ret i32 %count.load.1
if.then.4:
  %v10 = sdiv i32 %a.loop, 2
  br %if.end.6
if.else.5:
  %v12 = mul i32 %a.loop, 3
  %v14 = add i32 %v12, 1
  br %if.end.6
if.end.6:
  %a.phi = phi [%v10, %if.then.4], [%v14, %if.else.5]
  br %while.cond.1
}
```

其形式参考了 `LLVM IR`, 见贤思齐。

使用了无条件的`br`代替`jump`

#### mir

mir 是贴近 RiscV 汇编的一层 machine IR,其设计的目的是为了方便后端的 Instcombine RA peephole 等优化。