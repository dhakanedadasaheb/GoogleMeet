
import {
    ArrowRightLeft,
    Copy,
    Languages,
    Mic,
    MicOff,
    Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

export default function MeetingAssistant() {
  const [language, setLanguage] = useState("mr-IN");
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  
const startListening = async () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    toast.error("Speech recognition is not supported. Use Chrome.");
    return;
  }

  try {
    // Request microphone permission first
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // Release this temporary stream.
    // SpeechRecognition manages its own microphone session.
    stream.getTracks().forEach((track) => track.stop());

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          text += event.results[i][0].transcript + " ";
        }
      }

      if (text) {
        setTranscript((prev) => prev + text);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      setListening(false);

      if (event.error === "not-allowed") {
        toast.error("Please allow microphone access in Chrome.");
      } else if (event.error === "no-speech") {
        toast.error("No speech detected. Try speaking again.");
      } else if (event.error === "network") {
        toast.error("Speech recognition network error.");
      } else {
        toast.error(`Speech error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
    setListening(true);

  } catch (error) {
    console.error("Microphone permission error:", error);
    toast.error("Microphone access denied. Please check browser settings.");
  }
};


  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const clearText = () => {
    setTranscript("");
    setTranslation("");
  };

  return (
    <div className="w-full rounded-2xl border border-gray-700 bg-gray-900 p-5 text-white shadow-xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3">
            <Languages size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Meeting Language Assistant
            </h2>
            <p className="text-sm text-gray-400">
              Marathi-English communication
            </p>
          </div>
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
          Live Assistant
        </span>
      </div>

      {/* Language selection */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={listening}
          className="flex-1 rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
        >
          <option value="mr-IN">Marathi → English</option>
          <option value="en-IN">English → Marathi</option>
        </select>

        <div className="flex items-center justify-center gap-2 text-blue-400">
          <ArrowRightLeft size={20} />
          <span className="text-sm">Translation</span>
        </div>
      </div>

      {/* Microphone */}
      <div className="mb-5 flex justify-center">
        <button
          onClick={listening ? stopListening : startListening}
          className={`flex items-center gap-3 rounded-xl px-6 py-3 font-medium transition ${
            listening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {listening ? <MicOff /> : <Mic />}

          {listening ? "Stop Listening" : "Start Listening"}
        </button>
      </div>

      {/* Transcript and translation */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Original */}
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">
              Original Speech
            </h3>

            <button
              onClick={() => copyText(transcript)}
              className="text-gray-400 hover:text-white"
              title="Copy transcript"
            >
              <Copy size={17} />
            </button>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken words will appear here..."
            className="h-48 w-full resize-none bg-transparent text-gray-200 outline-none"
          />
        </div>

        {/* Translation */}
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">
              Translated Speech
            </h3>

            <button
              onClick={() => copyText(translation)}
              className="text-gray-400 hover:text-white"
              title="Copy translation"
            >
              <Copy size={17} />
            </button>
          </div>

          <textarea
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Translation will appear here..."
            className="h-48 w-full resize-none bg-transparent text-gray-200 outline-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={clearText}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
        >
          <Trash2 size={16} />
          Clear
        </button>
      </div>
    </div>
  );
}
