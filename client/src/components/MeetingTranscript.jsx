import { Clock, FileText } from "lucide-react";
const MeetingTranscript = () => {

  const transcript = [
    {
      time: "00:00",
      speaker: "Dadasaheb",
      message: "Let's discuss the progress of our Google Meet project.",
    },
    {
      time: "00:30",
      speaker: "Member 2",
      message: "The frontend is almost completed.",
    },
    {
      time: "01:15",
      speaker: "Dadasaheb",
      message: "We need to integrate Spring Boot and Gemini AI.",
    },
    {
      time: "02:00",
      speaker: "Member 3",
      message: "We will work on the meeting summary feature.",
    },
  ];

  return (
    <div className="rounded-xl bg-slate-900 p-5 text-white">
      <div className="mb-5 flex items-center gap-3">
        <FileText className="text-blue-400" size={22} />
        <div>
          <h2 className="text-xl font-bold">
            Meeting Transcript
          </h2>
          <p className="text-sm text-slate-400">
            Meeting conversation
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {transcript.map((item, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Clock size={16} className="text-slate-500" />
              <span className="mt-1 text-xs text-slate-500">{item.time}</span>
            </div>
            <div className="flex-1 rounded-lg bg-slate-800 p-3">
              <p className="mb-1 text-sm font-semibold text-blue-400">{item.speaker}</p>
              <p className="text-sm text-slate-300">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingTranscript;
