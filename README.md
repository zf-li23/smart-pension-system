# Smart Nursing Home Recommendation System
基于多维健康需求匹配的养老服务智能推荐系统

## 1. 项目简介
本项目旨在通过量化老人的健康需求（医疗、生活、精神、交通、时间五维）和养老院的服务能力（医疗、生活、精神、交通、服务、价格六维），利用加权匹配算法，为老人推荐最合适的养老服务机构。系统由 React 前端和 Python FastAPI 后端组成，支持 Docker 容器化部署以及 Vercel Serverless 部署。

- **GitHub 仓库**: [https://github.com/zf-li23/smart-pension-system](https://github.com/zf-li23/smart-pension-system)
- **在线演示 (Vercel)**: [https://smart-pension-system.vercel.app](https://smart-pension-system.vercel.app)

> **注意**: 在线演示版使用 SQLite 临时数据库，每次重新部署或长时间闲置后数据会重置。

## 2. 功能特点
- **多维量化**: 将模糊的需求转化为结构化的 1-5 分向量。
- **智能匹配**: 基于加权 Euclidean/Cosine 相似度或规则匹配算法，输出 Top3 推荐。
- **可视化**: 使用雷达图（Radar Chart）直观展示需求满足度。
- **可解释性**: 生成详细的匹配报告，说明每一项指标是满足、不足还是溢出。

## 3. 技术栈
- **Frontend**: React, Vite, Ant Design, ECharts, Axios
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite (兼容 Vercel Serverless)
- **Deployment**: Vercel (推荐), Docker

## 4. 部署与运行

### 方式一：Vercel 一键部署 (推荐)
本项目已配置好 `vercel.json`，支持前端静态页面+后端 Serverless 函数的一体化部署。

1. **Fork 本仓库** 到你的 GitHub 账号。
2. 登录 [Vercel](https://vercel.com)，点击 **"New Project"**。
3. 导入刚才 Fork 的仓库。
4. **配置**:
    - **Framework Preset**: 选择 `Vite`。
    - **Root Directory**: 保持默认 `./`。
    - **Build Settings**: 保持默认。
5. 点击 **Deploy** 等待完成。

### 方式二：本地开发运行
#### 后端
确保 Python 3.9+ 已安装。
```bash
cd backend
# 创建虚拟环境 (可选)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动服务 (自动重载)
uvicorn app.main:app --reload
```
后端默认运行在 `http://127.0.0.1:8000`。

#### 前端
确保 Node.js 16+ 已安装。
```bash
cd frontend
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
前端默认运行在 `http://localhost:5173`。

### 方式三：Docker 运行
确保已安装 Docker 和 Docker Compose。

```bash
docker-compose up --build
```
启动后访问 `http://localhost:3000`。

## 5. API 文档
启动后端后，访问 `/docs` 查看 Swagger UI（例如：`http://127.0.0.1:8000/docs` 或在线版的 `/docs`）。

主要接口：
- **POST** `/api/evaluate/elder`: 提交老人需求问卷，获取推荐结果。
- **POST** `/api/evaluate/home_questionnaire`: 提交养老院信息，注册新机构。
- **GET** `/api/homes`: 获取养老院列表。

## 6. 系统默认数据 (测试用)
第一次启动时，系统会自动初始化以下三类典型养老院数据：
1. **Nursing Home A (Comprehensive)**: 医疗强，生活强，价格 ¥4000 (适合重度护理)
2. **Nursing Home B (Spiritual Focus)**: 精神关怀强，价格 ¥3000 (适合认知障碍/孤独老人)
3. **Nursing Home C (Community/Day)**: 交通便利，日间照料，价格 ¥2000 (适合健康托管)

## 7. 测试案例建议
您可以尝试输入以下需求来验证算法：
1. **案例1 [高血压+卧床]**: 
   - 医疗需求高，生活不能自理
   - **预期推荐**: Home A
2. **案例2 [孤独老人]**: 
   - 身体健康但孤独，需要社交
   - **预期推荐**: Home B
3. **案例3 [健康托管]**: 
   - 仅需日间照料，预算有限
   - **预期推荐**: Home C
