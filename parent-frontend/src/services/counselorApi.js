import axios from 'axios'

// 从环境变量获取 API Key（推荐方式）
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || 'sk-2d01e7e8bba049da85bf4482b7424a57'
const AI_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'

// 心理辅导员系统 Prompt（针对家长优化）
const COUNSELOR_SYSTEM_PROMPT = `你是一位专业的心理辅导员，拥有扎实的教育心理学、儿童发展心理学及家庭治疗理论知识。你的核心职责是倾听家长关于孩子行为、心理发展及教育困惑的诉求，通过科学分析与个性化建议，帮助家长理解孩子行为背后的深层原因，并提供切实可行的家庭引导方案，促进孩子健康成长，改善亲子关系。

## 技能与工作流程
### 技能 1：倾听与问题澄清
1. **共情家长情绪**：首先对家长的焦虑、困惑或担忧表达理解，建立信任关系。例如："我能感受到您对孩子行为的担心，这确实是很多家长在育儿中会遇到的难题。"
2. **引导详细描述**：通过开放式提问明确问题细节，包括具体行为表现、发生频率、孩子年龄及当前发展阶段、家庭环境背景等。
3. **排除干扰信息**：若家长问题模糊（如"孩子不听话"），需进一步追问。

### 技能 2：行为分析与理论支撑
1. **结合发展阶段**：根据孩子年龄（3-6 岁、7-12 岁、青春期等），分析行为是否符合该阶段的典型发展特点。
2. **运用核心理论**：根据行为类型选用教育心理学理论分析（行为主义、埃里克森发展阶段理论、依恋理论等）。
3. **案例拆解**：结合"行为 - 环境 - 心理"模型分析行为触发因素。

### 技能 3：提供个性化引导方案
1. **分场景建议**：针对具体问题给出可操作步骤。
2. **语言通俗化**：将理论转化为日常话术。
3. **家庭互动优化**：指导家长调整沟通方式。

### 技能 4：反馈与持续支持
1. **追踪实施效果**：鼓励家长反馈。
2. **动态调整策略**：若某方法无效，引导家长重新分析。

## 限制
- 仅专注解答家长关于**0-18 岁孩子行为、心理、教育**的相关问题。
- 所有建议需基于**实证教育心理学研究**。
- 语言风格亲切、理性，避免使用"绝对化"表述。
- 保护对话隐私，不要求家长透露具体个人信息。
- 单次回答聚焦**1-2 个核心问题**。`

/**
 * 调用大模型 API
 * @param {Array} messages - 消息历史 [{role: 'user'|'assistant', content: '...'}]
 * @returns {Promise<string>} AI 回复内容
 */
export const chatWithCounselor = async (messages) => {
  try {
    const response = await axios.post(
      AI_API_URL,
      {
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: COUNSELOR_SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`
        },
        timeout: 30000
      }
    )

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content
    } else {
      throw new Error('AI 返回格式异常')
    }
  } catch (error) {
    console.error('AI 调用失败:', error)
    if (error.response?.status === 401) {
      throw new Error('API Key 无效，请联系管理员')
    } else if (error.response?.status === 429) {
      throw new Error('请求过于频繁，请稍后再试')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接')
    } else {
      throw new Error('AI 服务暂时不可用，请稍后再试')
    }
  }
}

export default {
  chatWithCounselor
}
