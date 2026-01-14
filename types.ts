
export interface AnalysisInput {
  targetInfo: string;
  relationship: string;
  targetMbti: string;
  incidentDescription: string;
  myMbti: string;
  myCustomFunctions?: string; // Optional custom stacking input
}

export interface CognitiveFunc {
  function: string;
  description: string;
  evidence: string;
}

export interface StrategyFunc {
  function: string;
  why: string;
  howToApply: string;
}

export interface AnalysisResponse {
  targetCognitiveFunctions: {
    light: CognitiveFunc[];
    shadow: CognitiveFunc[];
  };
  axisAnalysis: {
    axis: string;
    dynamics: string;
  }[];
  targetArchetypeAnalysis: {
    archetype: string;
    interpretation: string;
  }[];
  myStrategy: {
    light: StrategyFunc[];
    shadow: StrategyFunc[];
  };
  summary: string;
}

export enum MBTIType {
  INTJ = 'INTJ', INTP = 'INTP', ENTJ = 'ENTJ', ENTP = 'ENTP',
  INFJ = 'INFJ', INFP = 'INFP', ENFJ = 'ENFJ', ENFP = 'ENFP',
  ISTJ = 'ISTJ', ISFJ = 'ISFJ', ESTJ = 'ESTJ', ESFJ = 'ESFJ',
  ISTP = 'ISTP', ISFP = 'ISFP', ESTP = 'ESTP', ESFP = 'ESFP'
}
