
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import { dummyMeetingDetails, dummyUser } from '../assets/asset'

import ChatPanel from '../components/meetings/ChatPanel'
import ControlBar from '../components/meetings/ControlBar'
import MeetingToolsPanel from '../components/meetings/MeetingTiilsPanel'
import ParticipantList from '../components/meetings/ParticipantList'
import VideoGrid from '../components/meetings/VideoGrid'

import DeveloperCollaboration from '../components/DeveloperCollaboration'
import MeetingAI from '../components/MeetingAI'
import MeetingAssistant from '../components/MeetingAssistant'

import { useChat } from '../hooks/useChat'
import useWebRTC from '../hooks/useWebRTC'

const MeetingRoom = () => {
  const { meetingId } = useParams()
  const navigate = useNavigate()

  const userData = dummyUser

  const currentMeetingId =
    meetingId || dummyMeetingDetails.meetingId

  const [isParticipantOpen, setIsParticipantOpen] =
    useState(false)

  // Available panels:
  // null, notes, whiteboard, assistant, developer

  const [activeTool, setActiveTool] = useState(null)

  const [isMeetingAIOpen, setIsMeetingAIOpen] =
    useState(true)

  const handleMeetingEnded = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])

  const {
    localStream,
    remoteUsers,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    endMeeting,
  } = useWebRTC(
    currentMeetingId,
    userData,
    handleMeetingEnded
  )

  const {
    messages,
    sendMessage,
    unreadCount,
    isChatOpen,
    toggleChat,
  } = useChat(currentMeetingId, userData)

  const isHost = true

  // Leave meeting
  const handleLeave = () => {
    toast('You left the meeting')
    navigate('/dashboard')
  }

  // End meeting
  const handleEndMeeting = () => {
    endMeeting()
    toast('Meeting ended for all participants')
    navigate('/dashboard')
  }

  // Toggle meeting tools
  const toggleTool = (tool) => {
    setActiveTool((current) =>
      current === tool ? null : tool
    )
  }

  const handleOpenNotes = () => {
    toggleTool('notes')
  }

  const handleOpenWhiteboard = () => {
    toggleTool('whiteboard')
  }

  const handleOpenAssistant = () => {
    toggleTool('assistant')
  }

  const handleOpenDeveloperMode = () => {
    toggleTool('developer')
  }

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-900">

      {/* Top Meeting Bar */}
      <header className="z-30 flex w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6">

        <div className="flex min-w-0 items-center gap-3">

          <h2 className="truncate text-base font-semibold tracking-tight text-slate-900">
            {dummyMeetingDetails.title}
          </h2>

          <span className="hidden text-sm text-slate-500 sm:block">
            ({currentMeetingId})
          </span>

          <span
            className="size-2 animate-pulse rounded-full bg-emerald-500"
            title="Meeting active"
          />

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              setIsMeetingAIOpen((prev) => !prev)
            }
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isMeetingAIOpen ? 'Hide AI' : 'Show AI'}
          </button>

        </div>

      </header>

      {/* Main Meeting Content */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">

        {/* Video Grid */}
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">

          <VideoGrid
            localStream={localStream}
            localUser={userData}
            remoteUsers={remoteUsers}
            audioEnabled={audioEnabled}
            videoEnabled={videoEnabled}
          />

        </div>

        {/* Meeting AI Sidebar */}
        {isMeetingAIOpen && (
          <aside className="hidden w-[380px] shrink-0 overflow-y-auto border-l border-slate-200 bg-white lg:block">

            <MeetingAI />

          </aside>
        )}

        {/* Tool Panels */}
        {activeTool && (
          <div className="absolute inset-0 z-40 flex justify-end bg-black/20">

            {activeTool === 'notes' ||
            activeTool === 'whiteboard' ? (

              <MeetingToolsPanel
                key={`${currentMeetingId}-${activeTool}`}
                roomId={currentMeetingId}
                mode={activeTool}
                onClose={() => setActiveTool(null)}
              />

            ) : (

              <div className="h-full w-full overflow-y-auto bg-slate-950 p-4 sm:w-[700px]">

                <div className="mb-4 flex items-center justify-between">

                  <h2 className="text-lg font-semibold text-white">
                    {activeTool === 'assistant'
                      ? 'Marathi-English Meeting Assistant'
                      : 'Developer Collaboration'}
                  </h2>

                  <button
                    onClick={() => setActiveTool(null)}
                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
                  >
                    Close
                  </button>

                </div>

                {activeTool === 'assistant' && (
                  <MeetingAssistant
                    key={currentMeetingId}
                    roomId={currentMeetingId}
                  />
                )}

                {activeTool === 'developer' && (
                  <DeveloperCollaboration
                    key={currentMeetingId}
                    roomId={currentMeetingId}
                  />
                )}

              </div>

            )}

          </div>
        )}

        {/* Chat Drawer */}
        <ChatPanel
          isOpen={isChatOpen}
          onClose={toggleChat}
          messages={messages}
          onSendMessage={sendMessage}
          currentUser={userData}
        />

        {/* Participant Drawer */}
        <ParticipantList
          isOpen={isParticipantOpen}
          onClose={() => setIsParticipantOpen(false)}
          localUser={userData}
          localAudio={audioEnabled}
          localVideo={videoEnabled}
          remoteUsers={remoteUsers}
          meetingHostId={dummyUser.id}
        />

      </div>

      {/* Bottom Meeting Controls */}
      <ControlBar
        roomId={currentMeetingId}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleChat={toggleChat}
        onToggleParticipants={() =>
          setIsParticipantOpen((prev) => !prev)
        }
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantOpen}
        unreadCount={unreadCount}
        participantCount={1 + remoteUsers.length}
        isHost={isHost}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
        activeTool={activeTool}
        onOpenNotes={handleOpenNotes}
        onOpenWhiteboard={handleOpenWhiteboard}
        onOpenAssistant={handleOpenAssistant}
        onOpenDeveloperMode={handleOpenDeveloperMode}
      />

    </div>
  )
}

export default MeetingRoom
