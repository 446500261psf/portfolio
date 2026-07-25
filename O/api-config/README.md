# 外部 API 配置（秘书 O）

## 平台

- 供应商：随风 AI / sfkey
- Base URL：`https://api.sfkey.cn/v1`
- 激活页：https://sfkey.cn/renew/
- 限额查询：https://sfkey.cn/query/
- 文档：https://api.sfkey.cn/#docs

## 当前状态（2026-07-13）

| 项目 | 状态 |
|------|------|
| Key 已写入本地 `.env`（不进 Git） | ✅ |
| `GET /v1/models` | ✅ 可用，目前仅开放 **`glm-5`** |
| `POST /v1/chat/completions` | ❌ 返回 **HTTP 429**，`authorization failed`（code **11210**） |

## 本地调用方式

```bash
python3 O/bin/sfkey_chat.py "用一句话介绍你自己"
```

密钥文件：`O/api-config/.env`（已 gitignore）

## 说明

Cursor 本体模型额度耗尽时，我可以用这个脚本**按任务临时调用**外部 API，但不能用它替换 Cursor 对话里的模型本身。

若 chat 一直 429/11210：请在 https://sfkey.cn/query/ 确认额度与激活状态后告诉我，再重试。
