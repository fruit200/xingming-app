#!/bin/bash
# 星命趣学 - GitHub Pages 部署脚本
# GitHub用户名: fruit200
# 仓库: xingming-app

cd "C:/Users/PC/WorkBuddy/2026-06-12-14-06-31/xingming-app"

# 1. 初始化Git仓库
git init

# 2. 添加所有文件
git add .

# 3. 首次提交
git commit -m "初始化星命趣学应用 - 八字星盘/紫微斗数/MBTI/趣味国学"

# 4. 关联远程仓库
git remote add origin https://github.com/fruit200/xingming-app.git

# 5. 设置主分支并推送
git branch -M main
git push -u origin main

echo "============================================"
echo "部署完成！请按以下步骤开启 GitHub Pages："
echo "1. 打开 https://github.com/fruit200/xingming-app"
echo "2. 点击 Settings → Pages"
echo "3. Source: Deploy from a branch"
echo "4. Branch: main, 目录: /(root)"
echo "5. 点击 Save"
echo "6. 等待1-2分钟后访问："
echo "   https://fruit200.github.io/xingming-app/"
echo "============================================"