
import { useState } from "react";

import AIChatbot from "./AIChatbot";
import MeetingSummary from "./MeetingSummary";
import MeetingTranscript from "./MeetingTranscript";

import { Bot, FileText, Sparkles, } from "lucide-react";

const MeetingAI = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const tabs = [
    {
      id: "chat",
      label: "AI Chat",
      icon: Bot,
    },
    {
      id: "summary",
      label: "Summary",
      icon: Sparkles,
    },
    {
      id: "transcript",
      label: "Transcript",
      icon: FileText,
    },
  ];

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 p-3 text-sm transition ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeTab === "chat" && <AIChatbot />}
        {activeTab === "summary" && <MeetingSummary />}
        {activeTab === "transcript" && <MeetingTranscript />}
      </div>
    </div>
  );
};

export default MeetingAI;
