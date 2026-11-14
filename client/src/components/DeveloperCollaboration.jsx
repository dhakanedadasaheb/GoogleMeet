
import Editor from "@monaco-editor/react";
import {
    Circle,
    Code2,
    Copy,
    Download,
    Play,
    Users,
} from "lucide-react";
import { useState } from "react";

export default function DeveloperCollaboration() {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(
`public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to ConnectMeet!");
    }
}`
  );

  const [output, setOutput] = useState(
    "Your code output will appear here..."
  );

  const [showOutput, setShowOutput] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const extensions = {
      java: "java",
      javascript: "js",
      python: "py",
      cpp: "cpp",
      html: "html",
    };

    const blob = new Blob([code], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `ConnectMeet.${extensions[language]}`;

    link.click();

    URL.revokeObjectURL(url);
  };

  const runCode = () => {
    setShowOutput(true);

    setOutput(
      "Code execution is not connected yet. Connect a code execution backend to run programs."
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 text-white shadow-xl">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-700 bg-gray-800 p-4">

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-600 p-3">
            <Code2 size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Developer Collaboration
            </h2>

            <p className="text-sm text-gray-400">
              Collaborative coding workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-2 text-sm text-green-400">
          <Circle size={8} fill="currentColor" />
          Local Editor
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 bg-gray-800/50 p-3">

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2"
          >
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
          </select>

          <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-400">
            <Users size={16} />
            Meeting Workspace
          </div>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            onClick={copyCode}
            className="flex items-center gap-2 rounded-lg bg-gray-700 px-3 py-2 hover:bg-gray-600"
          >
            <Copy size={16} />
            Copy
          </button>

          <button
            onClick={downloadCode}
            className="flex items-center gap-2 rounded-lg bg-gray-700 px-3 py-2 hover:bg-gray-600"
          >
            <Download size={16} />
            Download
          </button>

          <button
            onClick={runCode}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700"
          >
            <Play size={16} />
            Run
          </button>

        </div>
      </div>

      {/* Editor */}
      <Editor
        height="450px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          padding: {
            top: 15,
          },
        }}
      />

      {/* Output */}
      {showOutput && (
        <div className="border-t border-gray-700 bg-black p-4">

          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-green-400">
              Terminal Output
            </h3>

            <button
              onClick={() => setShowOutput(false)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <pre className="whitespace-pre-wrap text-sm text-gray-300">
            {output}
          </pre>
        </div>
      )}

    </div>
  );
}
