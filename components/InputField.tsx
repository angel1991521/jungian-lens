
import React, { useState } from 'react';
import { Mic, MicOff } from '@mui/icons-material';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: 'text' | 'textarea' | 'select';
  options?: string[];
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, value, onChange, type = 'text', options }) => {
  const [isListening, setIsListening] = useState(false);
  const baseClasses = "w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white shadow-sm text-sm";
  
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert("您的浏览器不支持语音识别功能。");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onChange(value ? value + " " + transcript : transcript);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
      {type === 'textarea' ? (
        <div className="relative">
          <textarea
            className={`${baseClasses} min-h-[120px] resize-none pr-12`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            onClick={handleVoiceInput}
            title="点击开始语音输入"
            className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${
              isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-indigo-600'
            }`}
          >
            {isListening ? <MicOff fontSize="small" /> : <Mic fontSize="small" />}
          </button>
        </div>
      ) : type === 'select' ? (
        <select
          className={baseClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>{placeholder}</option>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type="text"
          className={baseClasses}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default InputField;
