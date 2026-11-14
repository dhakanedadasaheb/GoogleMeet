import { CheckCircle2, Clock, ListChecks, Sparkles, Users, } from "lucide-react";

const MeetingSummary = () => {

  const summary = {
    title: "Project Discussion",
    duration: "45 minutes",
    participants: 4,
    overview:
      "The team discussed the development progress, frontend integration, and upcoming project deadlines.",
    keyPoints: [
      "Frontend development is almost completed.",
      "Spring Boot backend integration is pending.",
      "The team discussed AI chatbot functionality.",
      "Meeting summary feature needs to be implemented.",
    ],
    decisions: [
      "Use Spring Boot for backend development.",
      "Integrate Gemini AI for meeting assistance.",
    ],
    actionItems: [
      {
        task: "Complete Spring Boot backend",
        assignedTo: "Dadasaheb",
      },
      {
        task: "Implement AI chatbot frontend",
        assignedTo: "Frontend Team",
      },
      {
        task: "Integrate meeting summary API",
        assignedTo: "Backend Team",
      },
    ],
  };

  return (
    <div className="space-y-5 rounded-xl bg-slate-900 p-5 text-white">

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-purple-600 p-3">
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold">AI Meeting Summary</h2>
          <p className="text-sm text-slate-400"> {summary.title} </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-800 p-3">
          <Clock size={18} className="mb-2 text-blue-400" />
          <p className="text-xs text-slate-400">Duration</p>
          <p className="font-semibold">{summary.duration}</p>
        </div>

        <div className="rounded-lg bg-slate-800 p-3">
          <Users size={18} className="mb-2 text-green-400" />
          <p className="text-xs text-slate-400">Participants</p>
          <p className="font-semibold">{summary.participants}</p>
        </div>
      </div>

      <section>
        <h3 className="mb-2 font-semibold">Overview</h3>
        <p className="text-sm leading-6 text-slate-300">{summary.overview}</p>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <ListChecks size={18} className="text-blue-400" />
          Key Points
        </h3>

        <ul className="space-y-2">
          {summary.keyPoints.map((point, index) => (
            <li key={index} className="flex gap-2 text-sm text-slate-300" >
              <span className="text-blue-400">•</span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 font-semibold">Decisions Made</h3>
        <ul className="space-y-2">
          {summary.decisions.map((decision, index) => (
            <li  key={index} className="rounded-lg bg-slate-800 p-3 text-sm"> {decision} </li>
          ))}
        </ul>
      </section>

      {/* Action Items */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <CheckCircle2 size={18} className="text-green-400" />
          Action Items
        </h3>

        <div className="space-y-3">
          {summary.actionItems.map((item, index) => (
            <div  key={index} className="rounded-lg bg-slate-800 p-3">
              <p className="text-sm font-medium">{item.task}</p>
              <p className="mt-1 text-xs text-slate-400">Assigned to: {item.assignedTo}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MeetingSummary;
