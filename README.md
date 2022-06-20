# RAF-mock-timeout
use requestAnimationFrame mock setTimeout and setInterval

# 注意事项
- 比如当切换浏览器 tab 标签时，`requestAnimationFrame` 会进行优化，可能会变慢，所以时间不一定和 `setTimeout` 一致。

# 开发与调试
1. `npm i`
2. `npm run build`
3. vscode 打开 `test/index.html`
4. 右键运行 `Open with Live Server` （安装 `Live Server` 插件）