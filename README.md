# README

## 框架介紹
- 使用 fastify 框架
- 使用 awilix 實現 Dependency Injection 
- 使用 RabbitMQ 派發任務 (目前只有一條API有使用)
- 使用 worker1 and worker2 進行RabbitMQ message處理

## 目前開放API
please see routes for details.


1. zip 
2. git clone

## 初始化
### Initialize
```
git remote add upstream https://github.com/ALPHACamp/forum-express-grading.git  # 建立上游連線
npm install
```

### 設定資料庫
- 創建.env
- 將你的mongoDB_URI 貼上

```
create database fastify;
可自行命名, 需與URI database_name對應
```

### 執行
於專案路徑下

npm run dev 
或是
node server.js


