# API接口文档

X交易所的API接口设计遵循RESTful规范，提供完整的交易所功能支持。

## 📡 接口概览

### 基础信息
- **Base URL**: `https://api.x-exchange.com/v1`
- **认证方式**: JWT Token
- **数据格式**: JSON
- **字符编码**: UTF-8

### 接口分类
```
API结构/
├── 🔐 认证接口 (auth)
│   ├── 用户登录/注册
│   ├── Token刷新
│   └── 密码管理
├── 👤 用户接口 (user)
│   ├── 个人信息
│   ├── 安全设置
│   └── 偏好设置
├── 📈 行情接口 (market)
│   ├── 实时行情
│   ├── K线数据
│   └── 深度数据
├── 💰 交易接口 (trade)
│   ├── 下单/撤单
│   ├── 订单查询
│   └── 交易历史
└── 💎 资产接口 (asset)
    ├── 账户余额
    ├── 充值/提现
    └── 转账记录
```

## 🔐 认证机制

### JWT Token
```typescript
// 请求头格式
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

### Token获取
```typescript
// POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires": 1640995200,
    "user": {
      "id": "user123",
      "email": "user@example.com"
    }
  }
}
```

## 📊 通用响应格式

### 成功响应
```typescript
{
  "code": 200,
  "message": "操作成功",
  "data": any,
  "timestamp": 1640995200
}
```

### 错误响应
```typescript
{
  "code": 400,
  "message": "参数错误",
  "error": "INVALID_PARAMETER",
  "timestamp": 1640995200
}
```

### 状态码说明
- `200` - 请求成功
- `400` - 请求参数错误
- `401` - 未授权访问
- `403` - 权限不足
- `404` - 资源不存在
- `429` - 请求频率过高
- `500` - 服务器内部错误

## 🚀 快速开始

### 1. 在项目中使用
```typescript
import { request } from '@/utils'

// GET请求
const marketData = await request.get('/market/ticker/BTCUSDT')

// POST请求
const orderResult = await request.post('/trade/order', {
  symbol: 'BTCUSDT',
  side: 'buy',
  type: 'limit',
  amount: '0.001',
  price: '43000'
})
```

### 2. 错误处理
```typescript
try {
  const response = await request.get('/user/info')
  return response.data
} catch (error) {
  if (error.code === 401) {
    // Token过期，跳转登录
    uni.navigateTo({ url: '/pages/auth/login' })
  } else {
    // 显示错误信息
    uni.showToast({
      title: error.message,
      icon: 'error'
    })
  }
}
```

## 📈 主要接口示例

### 行情数据
```typescript
// 获取交易对行情
GET /market/ticker/BTCUSDT

Response:
{
  "code": 200,
  "data": {
    "symbol": "BTCUSDT",
    "price": "43125.67",
    "change": "3.45",
    "changePercent": "0.0345",
    "volume": "1567.89",
    "high": "44000.00",
    "low": "42500.00"
  }
}
```

### 用户资产
```typescript
// 获取账户余额
GET /asset/balance

Response:
{
  "code": 200,
  "data": {
    "total": "125683.45",
    "available": "123456.78",
    "frozen": "2226.67",
    "balances": [
      {
        "asset": "BTC",
        "free": "1.25643789",
        "locked": "0.00000000"
      }
    ]
  }
}
```

### 交易下单
```typescript
// 提交订单
POST /trade/order

Request:
{
  "symbol": "BTCUSDT",
  "side": "buy",
  "type": "limit",
  "amount": "0.001",
  "price": "43000"
}

Response:
{
  "code": 200,
  "data": {
    "orderId": "order123456",
    "symbol": "BTCUSDT",
    "side": "buy",
    "type": "limit",
    "amount": "0.001",
    "price": "43000",
    "status": "pending",
    "timestamp": 1640995200
  }
}
```

## 📋 接口文档说明

由于项目当前处于开发阶段，具体的API接口还在设计中。以上示例仅供参考，实际接口以最终实现为准。

### 待完善内容
- [ ] 详细的接口参数说明
- [ ] 完整的错误码列表
- [ ] WebSocket接口文档
- [ ] 接口限频说明
- [ ] 签名验证机制

## 🔗 相关链接

- [认证接口详细说明](./auth.md)
- [市场数据接口](./market.md)
- [交易接口说明](./trade.md)
- [用户接口文档](./user.md)

---

_📅 最后更新: 2025年9月27日_  
_📡 API版本: v1.0 (设计中)_
