
import {
  BookOpenIcon,
  CheckIcon,
  Code2Icon,
  CopyIcon,
  LanguagesIcon,
  MessageSquareIcon,
  MicIcon,
  MicOffIcon,
  PenToolIcon,
  PhoneOffIcon,
  UserIcon,
  VideoIcon,
  VideoOffIcon,
} from 'lucide-react'

import { useState } from 'react'
import toast from 'react-hot-toast'

const ControlBar = ({
  roomId,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onToggleChat,
  onToggleParticipants,
  isChatOpen,
  isParticipantsOpen,
  unreadCount,
  participantCount,
  isHost,
  onLeave,
  onEndMeeting,

  // Existing tools
  activeTool,
  onOpenNotes,
  onOpenWhiteboard,

  // New tools
  onOpenAssistant,
  onOpenDeveloperMode,
}) => {
  const [copied, setCopied] = useState(false)

  const copyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)

      setCopied(true)
      toast.success('Meeting link copied!')

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Unable to copy meeting link')
    }
  }

  // Common button styling
  const getToolClass = (tool) =>
    `relative cursor-pointer rounded-2xl border p-3 transition-all sm:p-3.5 ${
      activeTool === tool
        ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
        : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
    }`

  return (
    <footer className="relative z-40 flex w-full items-center justify-between border-t border-slate-200/80 bg-white/90 px-3 py-3 shadow-lg shadow-slate-200/50 backdrop-blur-md sm:px-6 sm:py-4">

      {/* Left section: Meeting ID and Copy Link */}
      <div className="hidden items-center gap-3 sm:flex">

        <span className="font-mono text-xs font-medium tracking-wide text-slate-600">
          ID: {roomId}
        </span>

        <button
          onClick={copyMeetingId}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 p-2 text-xs font-medium text-slate-700 transition-all hover:bg-slate-200 hover:text-slate-900"
          title="Copy meeting link"
        >
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}

          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>

      </div>

      {/* Center section: Meeting controls */}
      <div className="mx-auto flex items-center gap-1.5 sm:mx-0 sm:gap-3">

        {/* Meeting Notes */}
        <button
          onClick={onOpenNotes}
          className={getToolClass('notes')}
          title="Meeting Notes"
          aria-label="Open Meeting Notes"
          aria-pressed={activeTool === 'notes'}
        >
          <BookOpenIcon className="h-5 w-5" />
        </button>

        {/* Teaching Whiteboard */}
        <button
          onClick={onOpenWhiteboard}
          className={getToolClass('whiteboard')}
          title="Teaching Whiteboard"
          aria-label="Open Teaching Whiteboard"
          aria-pressed={activeTool === 'whiteboard'}
        >
          <PenToolIcon className="h-5 w-5" />
        </button>

        {/* Marathi-English Assistant */}
        <button
          onClick={onOpenAssistant}
          className={getToolClass('assistant')}
          title="Marathi-English Meeting Assistant"
          aria-label="Open Language Assistant"
          aria-pressed={activeTool === 'assistant'}
        >
          <LanguagesIcon className="h-5 w-5" />
        </button>

        {/* Developer Collaboration */}
        <button
          onClick={onOpenDeveloperMode}
          className={getToolClass('developer')}
          title="Developer Collaboration"
          aria-label="Open Developer Collaboration"
          aria-pressed={activeTool === 'developer'}
        >
          <Code2Icon className="h-5 w-5" />
        </button>

        {/* Microphone toggle */}
        <button
          onClick={onToggleAudio}
          className={`cursor-pointer rounded-2xl border p-3 transition-all sm:p-3.5 ${
            audioEnabled
              ? 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
              : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
          }`}
          title={audioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
          aria-label={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {audioEnabled ? (
            <MicIcon className="h-5 w-5" />
          ) : (
            <MicOffIcon className="h-5 w-5" />
          )}
        </button>

        {/* Camera toggle */}
        <button
          onClick={onToggleVideo}
          className={`cursor-pointer rounded-2xl border p-3 transition-all sm:p-3.5 ${
            videoEnabled
              ? 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
              : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
          }`}
          title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          aria-label={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {videoEnabled ? (
            <VideoIcon className="h-5 w-5" />
          ) : (
            <VideoOffIcon className="h-5 w-5" />
          )}
        </button>

        {/* Chat toggle */}
        <button
          onClick={onToggleChat}
          className={`relative cursor-pointer rounded-2xl border p-3 transition-all sm:p-3.5 ${
            isChatOpen
              ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
              : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
          title="Toggle In-Meeting Chat"
          aria-label="Toggle meeting chat"
          aria-pressed={isChatOpen}
        >
          <MessageSquareIcon className="h-5 w-5" />

          {unreadCount > 0 && !isChatOpen && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Participants */}
        <button
          onClick={onToggleParticipants}
          className={`relative cursor-pointer rounded-2xl border p-3 transition-all sm:p-3.5 ${
            isParticipantsOpen
              ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
              : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
          title="Toggle Participant List"
          aria-label="Toggle participant list"
          aria-pressed={isParticipantsOpen}
        >
          <UserIcon className="h-5 w-5" />

          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-primary px-1 text-[10px] font-bold text-white">
            {participantCount}
          </span>
        </button>

        {/* End or Leave Meeting */}
        {isHost ? (
          <button
            onClick={onEndMeeting}
            className="ml-1 flex cursor-pointer items-center gap-1.5 rounded-2xl border border-red-500 bg-red-600 p-3 text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-700 sm:ml-2 sm:p-3.5"
            title="End Meeting for All"
            aria-label="End meeting for all"
          >
            <PhoneOffIcon className="h-5 w-5" />

            <span className="hidden text-xs font-medium md:inline">
              End
            </span>
          </button>
        ) : (
          <button
            onClick={onLeave}
            className="ml-1 cursor-pointer rounded-2xl border border-red-500 bg-red-600 p-3 text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-700 sm:ml-2 sm:p-3.5"
            title="Leave Meeting"
            aria-label="Leave meeting"
          >
            <PhoneOffIcon className="h-5 w-5" />
          </button>
        )}

      </div>

      {/* Right section */}
      <div className="hidden w-32 text-right sm:block">
        <span className="font-medium text-slate-400">
          ConnectMeet
        </span>
      </div>

    </footer>
  )
}

export default ControlBar
