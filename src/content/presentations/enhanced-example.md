---
title: "计算机系统的状态机模型"
author: "YOO_koishi"
date: "2025-01-16"
header: "计算机系统的状态机模型"
footer: "2025 南京大学《操作系统：设计与实现》"
showPageNumber: true
theme: "white"
transition: "slide"
slideSize: "16:9"
---

# 计算机系统的状态机模型

操作系统设计与实现课程

---

## 状态机的基本概念

### 什么是状态机？

- **状态 (State)**: 系统在某个时刻的完整描述
- **转移 (Transition)**: 从一个状态到另一个状态的过程
- **输入 (Input)**: 触发状态转移的外部事件

### 形式化定义

一个状态机可以用五元组表示：$(Q, Σ, δ, q_0, F)$

其中：
- $Q$ 是状态集合
- $Σ$ 是输入字母表
- $δ: Q × Σ → Q$ 是转移函数
- $q_0 ∈ Q$ 是初始状态
- $F ⊆ Q$ 是终止状态集合

---

## 计算机系统的状态

### 系统状态的组成

```c
struct SystemState {
    // CPU状态
    struct {
        uint64_t registers[16];  // 通用寄存器
        uint64_t pc;            // 程序计数器
        uint64_t flags;         // 状态标志
    } cpu;
    
    // 内存状态
    uint8_t memory[MEMORY_SIZE];
    
    // I/O设备状态
    struct IODevice devices[MAX_DEVICES];
};
```

---

## 状态转移的实现

### 指令执行模型

```python
def execute_instruction(state, instruction):
    """执行单条指令，产生新状态"""
    new_state = copy.deepcopy(state)
    
    if instruction.opcode == 'ADD':
        new_state.cpu.registers[instruction.rd] = \
            state.cpu.registers[instruction.rs1] + \
            state.cpu.registers[instruction.rs2]
    elif instruction.opcode == 'LOAD':
        new_state.cpu.registers[instruction.rd] = \
            state.memory[instruction.address]
    # ... 其他指令
    
    new_state.cpu.pc += 4  # 更新程序计数器
    return new_state
```

---

## 状态机模型的应用

### 1. 程序执行

程序执行就是状态机的运行过程：

