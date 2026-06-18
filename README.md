# 发布到 GitHub Pages

这份说明是给第一次发布用的。你只需要有一个 GitHub 账号。

## 第一次发布

1. 打开 GitHub 新建仓库页面：
   https://github.com/new

2. 仓库名建议填：
   `qingfei-plan`

3. 选择 `Public`。

4. 不要勾选 `Add a README file`，直接创建仓库。

5. 进入新仓库后，点击 `uploading an existing file` 或 `Add file` -> `Upload files`。

6. 上传这些文件和文件夹：
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.webmanifest`
   - `service-worker.js`
   - `README.md`
   - `assets` 文件夹

7. 点击页面底部的 `Commit changes`。

8. 打开仓库的 `Settings` -> `Pages`。

9. 在 `Build and deployment` 里选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`

10. 点击 `Save`。

几分钟后，GitHub 会给你一个网址，通常长这样：

`https://你的用户名.github.io/qingfei-plan/`

用 iPhone Safari 打开这个网址，点分享按钮，选择“添加到主屏幕”。

## 以后完善功能怎么操作

你以后可以这样做：

1. 在这个文件夹里告诉 Codex 想加什么功能。
2. Codex 修改本地文件。
3. 你打开 GitHub 仓库页面。
4. 进入对应文件，点击编辑按钮。
5. 把新内容更新进去，点击 `Commit changes`。

如果后面安装了 Git 或 GitHub Desktop，就可以变得更简单：Codex 改完以后，直接同步到 GitHub，不需要你一个文件一个文件复制。

## 建议下一批功能

- 每天固定时间提醒
- 破戒记录
- 戒烟原因清单
- 健康恢复时间线
- 戒烟日记
- 数据导出和备份
