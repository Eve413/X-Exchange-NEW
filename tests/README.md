# 🧪 X交易所测试系统

## 测试架构

本项目采用 Jest + TypeScript 的测试框架，覆盖单元测试和集成测试。

### 📁 测试目录结构

```
tests/
├── setup.ts              # 测试环境配置
├── utils/                 # 工具类测试
│   ├── format.test.ts    # 格式化工具测试
│   └── storage.test.ts   # 存储工具测试
├── store/                 # 状态管理测试
│   └── user.test.ts      # 用户状态测试
├── integration/           # 集成测试
│   └── api.test.ts       # API集成测试
└── README.md             # 测试说明文档
```

## 🚀 运行测试

### 安装依赖
```bash
npm install
```

### 测试命令

| 命令 | 描述 |
|------|------|
| `npm test` | 运行所有测试 |
| `npm run test:watch` | 监听模式运行测试 |
| `npm run test:coverage` | 运行测试并生成覆盖率报告 |
| `npm run test:ci` | CI环境运行测试 |

### 测试示例

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- format.test.ts

# 运行测试并生成覆盖率
npm run test:coverage

# 监听文件变化自动运行测试
npm run test:watch
```

## 📊 测试覆盖率

测试覆盖率报告会生成在 `coverage/` 目录下：

- **文本报告**: 控制台输出
- **HTML报告**: `coverage/lcov-report/index.html`
- **LCOV报告**: `coverage/lcov.info`

### 覆盖率目标

| 类型 | 目标覆盖率 |
|------|-----------|
| **工具类 (Utils)** | ≥ 90% |
| **状态管理 (Store)** | ≥ 85% |
| **API模块** | ≥ 80% |
| **组件** | ≥ 75% |

## 🧪 测试类型

### 1. 单元测试 (Unit Tests)

测试单个函数或类的功能：

```typescript
// utils/format.test.ts
describe('NumberFormat', () => {
  it('should format price correctly', () => {
    expect(NumberFormat.formatPrice(123.456)).toBe('¥123.46')
  })
})
```

### 2. 集成测试 (Integration Tests)

测试多个模块间的交互：

```typescript
// integration/api.test.ts  
describe('API Integration', () => {
  it('should handle complete user journey', async () => {
    const loginResult = await authApi.login(credentials)
    expect(loginResult.data.token).toBeDefined()
  })
})
```

### 3. 组件测试 (Component Tests)

测试Vue组件的渲染和交互：

```typescript
// components/GlassButton.test.ts
describe('GlassButton', () => {
  it('should emit click event', async () => {
    const wrapper = mount(GlassButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## 🔧 测试工具和Mock

### 全局Mock

在 `setup.ts` 中配置了以下全局Mock：

- **uni对象**: 模拟uniapp的全局API
- **console方法**: 避免测试中的日志输出
- **fetch**: 模拟网络请求
- **定时器**: 使用Jest的假定时器

### 工具函数

```typescript
// 创建mock响应
const mockResponse = mockUniResponse(data, 0, 'success')

// 创建mock错误
const mockError = mockUniError('Network Error', 500)

// 等待异步操作
await waitFor(100)

// 创建组件挂载选项
const options = createMountOptions()
```

## 📝 编写测试的最佳实践

### 1. 测试结构

```typescript
describe('功能模块名称', () => {
  beforeEach(() => {
    // 每个测试前的setup
  })

  describe('子功能', () => {
    it('should 具体行为描述', () => {
      // Arrange - 准备测试数据
      // Act - 执行被测试的操作  
      // Assert - 验证结果
    })
  })
})
```

### 2. 测试命名

- ✅ **描述性**: `should format price with currency symbol`
- ❌ **模糊**: `test format function`

### 3. Mock原则

- 只Mock外部依赖
- 保持Mock的简单性
- 验证Mock的调用

### 4. 断言原则

- 一个测试一个断言主题
- 使用具体的匹配器
- 测试边界情况

## 🚨 测试调试

### 调试单个测试

```bash
# 运行单个测试文件
npm test -- --testPathPattern=format.test.ts

# 运行特定测试用例
npm test -- --testNamePattern="should format price"

# 详细输出
npm test -- --verbose
```

### 常见问题

#### 1. Mock没有生效
```typescript
// ❌ 错误
import { mockFunction } from './module'
jest.mock('./module')

// ✅ 正确
jest.mock('./module')
import { mockFunction } from './module'
```

#### 2. 异步测试超时
```typescript
// ✅ 正确处理async
it('should handle async operation', async () => {
  await expect(asyncFunction()).resolves.toBe(expectedValue)
})
```

#### 3. 定时器测试
```typescript
// ✅ 使用fake timers
it('should handle timeout', () => {
  jest.useFakeTimers()
  const callback = jest.fn()
  setTimeout(callback, 1000)
  jest.advanceTimersByTime(1000)
  expect(callback).toHaveBeenCalled()
})
```

## 📈 持续集成

### CI配置 (.github/workflows/test.yml)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### 质量门槛

- ✅ 所有测试必须通过
- ✅ 代码覆盖率达标
- ✅ 没有lint错误
- ✅ TypeScript类型检查通过

## 🎯 测试清单

开发新功能时的测试检查清单：

### 工具函数
- [ ] 正常情况测试
- [ ] 边界值测试  
- [ ] 异常情况测试
- [ ] 类型安全测试

### API模块
- [ ] 成功响应测试
- [ ] 错误处理测试
- [ ] 参数验证测试
- [ ] 网络异常测试

### 状态管理
- [ ] 初始状态测试
- [ ] 状态变更测试
- [ ] 计算属性测试
- [ ] 异步操作测试

### 组件
- [ ] 渲染测试
- [ ] 属性传递测试
- [ ] 事件触发测试
- [ ] 生命周期测试

---

## 💡 提示

- 测试不仅是验证代码正确性，更是文档和设计工具
- 好的测试应该易读、易维护、运行快速
- 定期review和重构测试代码
- 遇到问题先检查测试，再检查业务代码

**让测试成为开发的好伙伴，而不是负担！** 🎉
