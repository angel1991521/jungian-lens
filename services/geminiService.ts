
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
    
    【对方信息】：${input.targetInfo}
    【对方MBTI】：${input.targetMbti}
    【与我的关系】：${input.relationship}
    【事件经过】：${input.incidentDescription}
    ${myFunctionsContext}
    
    分析要求：
    1. 必须展示双方完整的八维功能（1-8位）。
    2. 请在功能名称后的括号内标注该功能的荣格原型位阶名称。
       - 对方/我的阳面（1-4位）：主导功能(英雄)、辅助功能(家长/慈母)、永恒少年(孩子)、劣势功能(阿尼玛/阿尼姆斯)。
       - 对方/我的阴面（5-8位）：对立功能(敌手)、盲点功能(挑剔者/老智者)、魔鬼功能(欺诈者)、破坏功能(魔鬼)。
    3. 详尽性：结合情境深度推导每一个功能的运作逻辑。
    4. 同轴功能动力分析：深入分析对方的同轴功能（感知轴Se-Ni/Ne-Si，判断轴Te-Fi/Fe-Ti）在事件中的表现，并与“我”的同轴功能对比分析。
    5. 策略精准：基于“我”的认知功能序列，提供博弈策略，说明如何利用我的功能来克制对方。

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
