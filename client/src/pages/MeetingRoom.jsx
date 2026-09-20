import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyMeetingDetails, dummyUser } from '../assets/asset'
import ChatPanel from '../components/meetings/ChatPanel'
import ControlBar from '../components/meetings/ControlBar'
import ParticipantList from '../components/meetings/ParticipantList'
import VideoGrid from '../components/meetings/VideoGrid'
import { useChat } from '../hooks/useChat'
import useWebRTC from '../hooks/useWebRTC'

const MeetingRoom = () => {

  const {meetingId} = useParams()
  const navigate = useNavigate()
  const userData = dummyUser;

  const [isParticipantOpen, setIsParticipantOpen] = useState(false)

  const handleMeetingEnded = useCallback(()=>{
    navigate("/dashboard")
  }, [navigate])

  const {localStream,remoteUsers,audioEnabled,videoEnabled,toggleAudio,toggleVideo,endMeeting} = useWebRTC(meetingId, userData, handleMeetingEnded)

  const {messages, sendMessage, unreadCount, isChatOpen, toggleChat} = useChat(meetingId, userData)

  const isHost = true;

  const handleLeave = () =>{
    toast("You Left the meeting")
    navigate("/dashboard")
  }

  const handleEndMeeting = () =>{
    endMeeting()
     toast("Meeting ended for all participants")
    navigate("/dashboard")
  }

  return (
    <div className=' h-screen w-screen bg-slate-100 text-slate-100 flex flex-col overflow-hidden relative font-sans'>
      {/* top bar  */}
      <header className=' w-full bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200 flex items-center justify-between z-30 shadow-xs'>
        <div className=' flex items-center gap-3'>
          <h2 className=' text-base font-semibold text-slate-900 tracking-tight'>
            {dummyMeetingDetails.title} ({meetingId ||  dummyMeetingDetails.meetingId})
          </h2>
          <span className=' size-1.5 rounded-full bg-emerald-500 animate-pulse'></span>
        </div>
      </header>

      {/* main content area  */}
      <div className=' flex-1 flex overflow-hidden relative '>

        {/* video grid center  */}
        <VideoGrid localStream={localStream} localUser={userData} remoteUsers={remoteUsers} audioEnabled={audioEnabled} videoEnabled={videoEnabled}/>

        {/* in-meeting chat drawer  */}
        <ChatPanel isOpen={isChatOpen} onClose={toggleChat} messages={messages} onSendMessage={sendMessage} currentUser={userData}/>

        {/* participant drawer  */}
        <ParticipantList isOpen={isParticipantOpen} onClose={()=> setIsParticipantOpen(false)} localUser={userData} localAudio={audioEnabled} localVideo={videoEnabled} remoteUsers={remoteUsers} meetingHostId={dummyUser.id}/>

       
      </div>
       {/* bottom floating control bar  */}
        <ControlBar roomId={meetingId || dummyMeetingDetails.meetingId} audioEnabled={audioEnabled} videoEnabled={videoEnabled} onToggleAudio={toggleAudio} onToggleVideo={toggleVideo} onToggleChat={toggleChat} onToggleParticipants={()=> setIsParticipantOpen((prev)=> !prev)} isChatOpen={isChatOpen} isParticipantsOpen={isParticipantOpen} unreadCount={unreadCount} participantCount={1 + remoteUsers.length} isHost={isHost} onLeave={handleLeave} onEndMeeting={handleEndMeeting}/>
    </div>
  )
}

export default MeetingRoom
