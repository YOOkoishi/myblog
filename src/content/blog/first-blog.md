---
title: hexo配置踩坑
description: first blog
pubDate: 2024-11-11
image: /image/image2.jpg
categories:
  - tech
tags:
  - blog  
---

无法使用npm下载hexo-deployer-git
已经使用**hexo g**和**hexo s**命令完成了本地的部署,但是因为npm下不了hexo git相关组件,**hexo d**无法实现.

---
这个时候只需要用npm下载cnpm,再用cnpm下载hexo-deployer-git就好了
