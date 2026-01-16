import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisInput } from "../types";

export const analyzeJungianDynamics = async (input: AnalysisInput) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key 未配置，请在环境变量中设置 API_KEY。");
  }

  const ai = new GoogleGenAI({ apiKey });

  const myFunctionsContext = input.myCustomFunctions 
    ? `【我的自定义八维排序】：${input.myCustomFunctions} (请优先基于此排序进行“我的应对策略”分析)`
    : `【我的MBTI】：${input.myMbti} (请基于此MBTI的标准功能序列进行分析)`;

  const prompt = `
    你是一位享誉全球的资深荣格心理分析师。请针对以下提供的复杂信息进行深度、专业且丰富的心理动力学分析：
    
    【对方基本资料】：${input.targetInfo}
    【对方MBTI】：${input.targetMbti}
    【与我的关系】：${input.relationship}
    【事情经过】：${input.incidentDescription}
    ${myFunctionsContext}
    
    分析要求：
    1. 结合事件，分析对方使用的具体八维功能（1-8位），并标注位阶（如：Te(英雄)、Ni(家长)等）。
    2. 深度分析对方的同轴功能（感知轴/判断轴）在事件中是如何共同运作的。
    3. 荣格原型分析：对方在事件中表现出了哪些原型特征（如：阴影、阿尼玛、人格面具等）。
    4. 对付与策略：结合“我”的认知功能，说明我该使用哪些功能来克制对方，请给出具体执行步骤。

    请严格按照指定的 JSON 格式输出结果。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    console.error("Gemini API Error:", error);
    throw new Error(`分析请求失败: ${error.message || "连接服务失败"}`);
  }
};
