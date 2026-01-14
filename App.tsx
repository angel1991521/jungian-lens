
import React, { useState } from 'react';
import InputField from './components/InputField';
import { analyzeJungianDynamics } from './services/geminiService';
import { AnalysisInput, AnalysisResponse, MBTIType } from './types';
import { 
  Psychology, 
  Handshake, 
  AutoFixHigh, 
  HistoryEdu, 
  Shield, 
  AccountCircle,
  TrendingUp,
  Bolt,
  Description,
  WbSunny,
  Brightness2,
  CompareArrows
} from '@mui/icons-material';

const MBTI_OPTIONS = Object.values(MBTIType);

const App: React.FC = () => {
  const [formData, setFormData] = useState<AnalysisInput>({
    targetInfo: '',
    relationship: '',
    targetMbti: '',
    incidentDescription: '',
    myMbti: '',
    myCustomFunctions: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleSubmit = async () => {
    const { myCustomFunctions, ...mandatoryFields } = formData;
    if (Object.values(mandatoryFields).some(val => !val)) {
      alert("请填写所有必要输入框（基本资料、MBTI、关系及事情经过）以获取准确分析");
      return;
    }
    setLoading(true);
    try {
      const data = await analyzeJungianDynamics(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("分析失败，请检查网络或重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
            <AutoFixHigh className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            荣格八维分析实验室
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            基于分析心理学与认知功能理论，深度拆解人际互动中的潜意识动力。
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          {/* Target Info Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
              <AccountCircle className="text-indigo-500" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">对方信息</h2>
            </div>
            <InputField 
              label="对方基本资料" 
              placeholder="性别、年龄、学历、专业、职位、工作经历、家庭背景、主要事迹等" 
              value={formData.targetInfo} 
              onChange={(val) => setFormData({...formData, targetInfo: val})} 
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="对方 MBTI" 
                type="select"
                options={MBTI_OPTIONS}
                placeholder="选择类型" 
                value={formData.targetMbti} 
                onChange={(val) => setFormData({...formData, targetMbti: val})} 
              />
              <InputField 
                label="与我的关系" 
                placeholder="例如：直接主管" 
                value={formData.relationship} 
                onChange={(val) => setFormData({...formData, relationship: val})} 
              />
            </div>
          </div>

          {/* My Info Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
              <AccountCircle className="text-indigo-500" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">我的信息</h2>
            </div>
            <div className="space-y-6">
              <InputField 
                label="我的 MBTI" 
                type="select"
                options={MBTI_OPTIONS}
                placeholder="选择类型" 
                value={formData.myMbti} 
                onChange={(val) => setFormData({...formData, myMbti: val})} 
              />
              
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="text-sm font-semibold text-slate-700">我的荣格八维排序 (选填)</label>
                </div>
                <InputField 
                  label=""
                  placeholder="例如: Ni Te Fi Se ... (若不填将基于MBTI自动推导)" 
                  value={formData.myCustomFunctions || ''} 
                  onChange={(val) => setFormData({...formData, myCustomFunctions: val})} 
                />
              </div>
            </div>
          </div>

          {/* Incident Description Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
              <Description className="text-indigo-500" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">事情经过</h2>
            </div>
            <InputField 
              label="事情详细描述" 
              type="textarea"
              placeholder="请详细描述要分析的事件，你与对方之间发生的事情，支持语音输入..." 
              value={formData.incidentDescription} 
              onChange={(val) => setFormData({...formData, incidentDescription: val})} 
            />
          </div>

          <div className="lg:col-span-2 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-lg shadow-indigo-200'
              }`}
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Bolt />
                  开始深度分析
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 pb-24">
            {/* Summary Insight */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Psychology sx={{ fontSize: 80 }} />
               </div>
               <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
                 <HistoryEdu /> 分析师核心洞察
               </h3>
               <p className="text-indigo-800 leading-relaxed italic">{result.summary}</p>
            </div>

            {/* Target 8 Functions Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <TrendingUp className="text-emerald-500" /> 对方的荣格八维使用分析
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Light Functions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <WbSunny className="text-yellow-500 text-sm" /> 阳面功能 (意识主导)
                  </h4>
                  {result.targetCognitiveFunctions.light.map((f, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-400">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{f.function}</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-sm mb-1">{f.description}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{f.evidence}</p>
                    </div>
                  ))}
                </div>

                {/* Shadow Functions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Brightness2 className="text-indigo-400 text-sm" /> 阴面功能 (潜意识表现)
                  </h4>
                  {result.targetCognitiveFunctions.shadow.map((f, i) => (
                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-slate-400">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">{f.function}</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-sm mb-1">{f.description}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{f.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamics & Archetypes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <CompareArrows className="text-orange-500" /> 双方同轴功能对比分析
                </h3>
                {result.axisAnalysis.map((a, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-orange-500">
                    <p className="font-bold text-slate-800 mb-2">{a.axis}</p>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{a.dynamics}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Psychology className="text-purple-500" /> 对方的荣格原型分析
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {result.targetArchetypeAnalysis.map((arc, i) => (
                    <div key={i} className="bg-purple-50 p-5 rounded-2xl border border-purple-100 relative group">
                      <h4 className="text-purple-900 font-bold mb-1 text-sm">{arc.archetype}</h4>
                      <p className="text-purple-800 text-xs leading-relaxed">{arc.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* My Strategy Section */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="absolute -bottom-8 -right-8 opacity-10">
                  <Shield sx={{ fontSize: 240 }} />
               </div>
               <div className="relative z-10 space-y-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Shield className="text-indigo-400" /> 我的应对策略 (基于我的认知序列)
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* My Light Side */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <WbSunny fontSize="small" /> 阳面功能克制与防御
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {result.myStrategy.light.map((s, i) => (
                          <div key={i} className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-indigo-300 font-bold">{s.function}</span>
                            </div>
                            <p className="text-slate-200 text-sm mb-2"><span className="text-indigo-200/60 mr-1">策略:</span>{s.why}</p>
                            <p className="text-slate-400 text-xs italic"><span className="text-indigo-200/40 mr-1">执行:</span>{s.howToApply}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* My Shadow Side */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Brightness2 fontSize="small" /> 阴面功能博弈与反击
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {result.myStrategy.shadow.map((s, i) => (
                          <div key={i} className="bg-black/20 backdrop-blur-md p-5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-slate-400 font-bold">{s.function}</span>
                            </div>
                            <p className="text-slate-300 text-sm mb-2"><span className="text-slate-500 mr-1">策略:</span>{s.why}</p>
                            <p className="text-slate-500 text-xs italic"><span className="text-slate-600 mr-1">执行:</span>{s.howToApply}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
