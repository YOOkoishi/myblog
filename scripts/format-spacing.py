#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动在中英文之间添加空格
用法: python3 format-spacing.py <文件路径>
"""

import re
import sys

def add_space_between_chinese_and_english(text):
    """
    在中文和英文之间自动添加空格
    """
    # 中文字符后面跟英文、数字
    text = re.sub(r'([\u4e00-\u9fa5])([a-zA-Z0-9])', r'\1 \2', text)
    
    # 英文、数字后面跟中文字符
    text = re.sub(r'([a-zA-Z0-9])([\u4e00-\u9fa5])', r'\1 \2', text)
    
    # 中文字符后面跟左括号
    text = re.sub(r'([\u4e00-\u9fa5])(\()', r'\1 \2', text)
    
    # 右括号后面跟中文字符
    text = re.sub(r'(\))([\u4e00-\u9fa5])', r'\1 \2', text)
    
    # 中文后面跟左方括号
    text = re.sub(r'([\u4e00-\u9fa5])(\[)', r'\1 \2', text)
    
    # 右方括号后面跟中文
    text = re.sub(r'(\])([\u4e00-\u9fa5])', r'\1 \2', text)
    
    # 处理反引号（代码标记）
    # 中文后面跟反引号
    text = re.sub(r'([\u4e00-\u9fa5])(`)', r'\1 \2', text)
    # 反引号后面跟中文
    text = re.sub(r'(`)([^`]*?`)([\u4e00-\u9fa5])', r'\1\2 \3', text)
    
    return text

def preserve_code_blocks(text):
    """
    保护代码块不被修改
    """
    # 匹配代码块
    code_block_pattern = r'```[\s\S]*?```'
    code_blocks = []
    
    def save_code_block(match):
        code_blocks.append(match.group(0))
        return f'<<<CODE_BLOCK_{len(code_blocks) - 1}>>>'
    
    # 保存代码块
    text = re.sub(code_block_pattern, save_code_block, text)
    
    # 处理文本
    text = add_space_between_chinese_and_english(text)
    
    # 恢复代码块
    for i, block in enumerate(code_blocks):
        text = text.replace(f'<<<CODE_BLOCK_{i}>>>', block)
    
    return text

def format_file(filepath):
    """
    格式化文件
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 处理内容
        formatted_content = preserve_code_blocks(content)
        
        # 写回文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(formatted_content)
        
        print(f"✅ 成功格式化: {filepath}")
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("用法: python3 format-spacing.py <文件路径>")
        print("示例: python3 format-spacing.py ../src/content/blog/编译学习记录.md")
        sys.exit(1)
    
    filepath = sys.argv[1]
    format_file(filepath)
