# Smart Nursing Home Recommendation System
基于多维健康需求匹配的养老服务智能推荐系统

## 1. 项目简介
本项目旨在通过量化老人的健康需求（医疗、生活、精神、交通、时间五维）和养老院的服务能力（医疗、生活、精神、交通、服务、价格六维），利用加权匹配算法，为老人推荐最合适的养老服务机构。系统由 React 前端和 Python FastAPI 后端组成，支持 Docker 容器化部署。

## 2. 功能特点
- **多维量化**: 将模糊的需求转化为结构化的 1-5 分向量。
- **智能匹配**: 基于加权 Euclidean/Cosine 相似度或规则匹配算法，输出 Top3 推荐。
- **可视化**: 使用雷达图（Radar Chart）直观展示需求满足度。
- **可解释性**: 生成详细的匹配报告，说明每一项指标是满足、不足还是溢出。

## 3. 技术栈
- **Frontend**: React, Vite, Ant Design, ECharts, Axios
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **Deployment**: Docker, Docker Compose, Nginx

## 4. 安装与运行
### 方式一：Docker 一键启动 (推荐)
确保已安装 Docker 和 Docker Compose。

```bash
docker-compose up --build
```

启动后访问：
- 前端应用: `http://localhost:3000`
- 后端文档: `http://localhost:8000/docs`

### 方式二：本地开发运行
#### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### 前端
```bash
cd frontend
npm install
npm run dev
```

## 5. API 文档
启动后端后，访问 `/docs` 查看 Swagger UI。
主要接口：
- `POST /api/evaluate/elder`: 提交老人需求问卷，获取推荐结果。
- `POST /api/evaluate/home_questionnaire`: 提交养老院信息，注册新机构。
- `GET /api/homes`: 获取养老院列表。

## 6. 系统默认数据 (测试用)
第一次启动时，系统会预种子以下数据：
1. **Nursing Home A (Comprehensive)**: 医疗强，生活强，价格 ¥4000
2. **Nursing Home B (Spiritual Focus)**: 精神关怀强，价格 ¥3000
3. **Nursing Home C (Community/Day)**: 交通便利，日间照料，价格 ¥2000

## 7. 测试案例建议
1. **高血压+卧床老人**: 预期推荐 Home A。
2. **孤独老人**: 预期推荐 Home B。
3. **健康需托管老人**: 预期推荐 Home C。
