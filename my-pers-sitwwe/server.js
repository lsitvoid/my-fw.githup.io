const express = require('express');
const path = require('path');
const app = express();

// 配置静态文件服务（关键修复点）
app.use(express.static(path.join(__dirname, 'public')));

// 显式定义根路由（备用方案）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 错误处理中间件
app.use((req, res) => {
  res.status(404).send('页面不存在');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});