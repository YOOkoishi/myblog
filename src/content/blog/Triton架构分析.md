---
title: triton架构分析 序 
description: triton 
pubDate: 2026-10-22
image: /image/triton.png
categories:
  - tech
tags:
  - blog
  - triton
  - mlir
---

最近找到了实习，主要进行flag-tree的开发。 flag-tree是一个triton的拓展版本，主要加入了tle（triton extended language），支持了很多国产第三方GPGPU。 比如昇腾，海光，天数，沐曦，平头哥等。本文主要研究分析一下triton的整体架构，定位等等。

## Triton 是什么

Triton 是一个嵌入式在 Python 中的 GPU 内核 DSL。用户用被 @triton.jit 装饰的 Python 函数、以块（Block/Tile）为单位编写内核；Triton 复用 CPython 的 Parser 得到 AST，但接管 AST 之后的语义解释，将其编译为 Triton IR（MLIR dialect），再经 Triton GPU IR、LLVM IR，最终生成 PTX 并编译为设备二进制。它在抽象层级上介于 PyTorch 张量级与 CUDA 线程级之间，让用户能在 kernel 级做算子融合与调优，同时由编译器自动处理线程调度、共享内存分配和内存合并。

我们可以用三个视角看待 Triton. 即 Triton是 python 的 DSL、编译器 ，Triton 是一个中间层抽象。他提供了一个介于 Pytorch 和 CUDA 中间的抽象等级，以供算子工程师进行方便的优化。

Triton 是由 MLIR 构建的。 实际上，早期的 Triton 并没有使用 MLIR。 Triton 最初源于 Philippe Tillet 在哈佛大学的博士研究，相关论文[《Triton: An Intermediate Language and Compiler for Tiled Neural Network Computations》](https://dl.acm.org/doi/10.1145/3315508.3329973)发表于 2019 年的 MAPL 会议。这个原始版本的编译架构是自成一体的，包含几个自研组件：

- Triton-C：一种类似 C 的语言，用于表达参数化的 tile 张量程序。
- Triton-IR：一个基于 LLVM 的中间表示，用于 tile 级程序的分析、变换和优化。注意，这里是“基于 LLVM”，而不是 MLIR。
- Triton-JIT：一个即时编译器，负责将 Triton-IR 编译为高效的 LLVM 位码，最终生成 GPU 代码。

当时的 Triton-IR 是独立设计的，并没有采用 MLIR 框架。

2020年后，原作者 Philippe Tillet 加入 OpenAI，OpenAI 接手并重写，2021 年发布 1.0 版本，编译器架构迁移到 MLIR 之上,作为一个开源项目发展至今。

## Triton 和其他 AI 编译器的区别

