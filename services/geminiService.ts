import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisInput } from "../types";

export const analyzeJungianDynamics = async (input: AnalysisInput) => {
  // 严格从 process.env.API_KEY 获取
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key 未配置，请在部署环境的环境变量中设置 API_KEY。");
  }

  // 使用命名参数初始化
  const ai = new GoogleGenAI({ apiKey });

  const myFunctionsContext = input.myCustomFunctions 
    ? `【我的自定义八维排序】：${input.myCustomFunctions}`
    : `【我的MBTI】：${input.myMbti}`;

  const prompt = `你是一位精通荣格八维与原型的资深分析师。请分析以下情境：
    对方资料：${input.targetInfo}
    对方MBTI：${input.targetMbti}
    关系：${input.relationship}
    事件：${input.incidentDescription}
    ${myFunctionsContext}

    分析要求：
    1. 对方在此事件中展现的荣格八维功能（阳面与阴面）。
    2. 对方使用的同轴功能（判断轴/感知轴）动力学分析。
    3. 对方展现的荣格原型特征。
    4. 我该如何利用我的功能位阶来制约、克制对方的策略分析。
    
    必须以 JSON 格式输出。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // 确保使用指定的模型
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetCognitiveFunctions: {
              type: Type.OBJECT,
              properties: {
                light: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      function: { type: Type.STRING },
                      description: { type: Type.STRING },
                      evidence: { type: Type.STRING }
                    },
                    required: ["function", "description", "evidence"]
                  }
                },
                shadow: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      function: { type: Type.STRING },
                      description: { type: Type.STRING },
                      evidence: { type: Type.STRING }
                    },
                    required: ["function", "description", "evidence"]
                  }
                }
              },
              required: ["light", "shadow"]
            },
            axisAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  axis: { type: Type.STRING },
                  dynamics: { type: Type.STRING }
                },
                required: ["axis", "dynamics"]
              }
            },
            targetArchetypeAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  archetype: { type: Type.STRING },
                  interpretation: { type: Type.STRING }
                },
                required: ["archetype", "interpretation"]
              }
            },
            myStrategy: {
              type: Type.OBJECT,
              properties: {
                light: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      function: { type: Type.STRING },
                      why: { type: Type.STRING },
                      howToApply: { type: Type.STRING }
                    },
                    required: ["function", "why", "howToApply"]
                  }
                },
                shadow: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      function: { type: Type.STRING },
                      why: { type: Type.STRING },
                      howToApply: { type: Type.STRING }
                    },
                    required: ["function", "why", "howToApply"]
                  }
                }
              },
              required: ["light", "shadow"]
            },
            summary: { type: Type.STRING }
          },
          required: ["targetCognitiveFunctions", "axisAnalysis", "targetArchetypeAnalysis", "myStrategy", "summary"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
