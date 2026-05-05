# 镜像坦白局 (Mirror Heart Sync) 💌

> **打破婚恋市场的“无效沟通”，用 AI 实现底层价值观的精准对齐。**

项目链接[(https://elaborate-khapse-f8d0d7.netlify.app/)] 

### 💡 项目初衷
在当代婚恋/交友市场中，沟通低效和三观错位导致了大量的时间损耗与情感伤害。本项目旨在通过“前置化”的三观博弈测试，在双方投入深度情感成本前，利用 AI 发现并翻译潜在分歧，将“冲突”转化为“理解”。

### 📸 项目视觉与用户共鸣
我们注重工具的“温度”与“仪式感”，设计了极具氛围感的引导视觉。目前在小红书平台已获得垂直用户群体的深度共鸣。

| 引导视觉：来自 2027 的信 | 核心功能：三观灵魂拷问 |
| :---: | :---: |
| ![2027年情书](docs/assets/poster2.png) | ![目前的题目](docs/assets/poster1.png) |

---
核心亮点
- **AI 深度锐评**：接入 DeepSeek-V3 大模型，针对双方分歧最大的题目进行心理动机分析与幽默调解。
- **全栈 Serverless 架构**：前端部署于 Netlify，后端通过 Netlify Functions 实现 API 安全中转。
- **极端值观测**：动态捕捉双方答案中差异等级最高的项，精准定位潜在矛盾点。
- **隐私保护**：采用环境变量加密技术，保护 API 密钥安全。

### 🛠️ 技术栈
- **Frontend**: Vanilla JS, HTML5, CSS3 (Mobile-First Design)
- **Backend**: Node.js (Netlify Functions)
- **AI Engine**: DeepSeek-V3 API
- **Deployment**: Netlify Continuous Deployment (CD)

### 🚀 运行逻辑
1. 用户 A 完成 30 道涉及社交、消费、恋爱的三观题目。
2. 手机递交给用户 B 完成相同题目。
3. 系统对比双方数组，提取差异值 $\Delta \ge 2$ 的项。
4. **AI 模块**调用：将 Top 1 分歧项通过后端 Function 发送至 DeepSeek，返回即时锐评。
*本项目目前正处于快速迭代中，计划未来接入更深度的米家生态与个性化语音合成。*
