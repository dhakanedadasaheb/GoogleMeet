
import {
  ArrowRightIcon,
  KeyboardIcon,
  PlusIcon,
  ShieldCheckIcon
} from 'lucide-react'

import { useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { dummyStats } from '../assets/asset'

// LocalStorage key for storing meetings
const MEETINGS_KEY = 'connectmeet_meetings'

const Dashboard = () => {

  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  const userName = user?.fullName || user?.firstName || 'User'
  const userEmail = user?.primaryEmailAddress?.emailAddress || ''

  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [joinId, setJoinId] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  const stats = dummyStats

  // Update time every second
  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)

  }, [])

  // Get meetings from localStorage
  const getMeetings = () => {

    try {
      return JSON.parse(localStorage.getItem(MEETINGS_KEY)) || []
    } catch {
      return []
    }

  }

  // Save meetings in localStorage
  const saveMeetings = (meetings) => {

    localStorage.setItem(
      MEETINGS_KEY,
      JSON.stringify(meetings)
    )

  }

  // Create a new meeting
  const handleCreateMeeting = async () => {

    if (!isLoaded || !user) {
      toast.error('User information is not loaded')
      return
    }

    setIsCreating(true)

    try {

      // Generate meeting code
      const chars = 'abcdefghijklmnopqrstuvwxyz'

      const seg = () =>
        Array.from(
          { length: 3 },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join('')

      const newMeetingId = `${seg()}-${seg()}-${seg()}`

      // Get existing meetings
      const meetings = getMeetings()

      // Prevent duplicate meeting codes
      if (meetings.some(m => m.meetingId === newMeetingId)) {
        throw new Error('Meeting ID already exists. Try again.')
      }

      // Create meeting object
      const newMeeting = {
        meetingId: newMeetingId,
        title: 'Instant Meeting',
        host: {
          id: user.id,
          name: userName,
          email: userEmail,
          image: user.imageUrl
        },
        status: 'active',
        createdAt: new Date().toISOString()
      }

      // Save meeting locally
      meetings.push(newMeeting)

      saveMeetings(meetings)

      toast.success('Meeting created successfully!')

      // Navigate to meeting room
      navigate(`/meeting/${newMeetingId}`)

    } catch (error) {

      console.error('Meeting creation error:', error)

      toast.error(error.message || 'Failed to create meeting')

    } finally {

      setIsCreating(false)

    }

  }

  // Join an existing meeting
  const handleJoinMeeting = async (e) => {

    e.preventDefault()

    const cleanId = joinId.trim().toLowerCase()

    // Validate meeting code
    if (!/^[a-z]{3}(?:-[a-z]{3}){2}$/.test(cleanId)) {

      toast.error('Please enter a valid meeting ID')

      return

    }

    setIsJoining(true)

    try {

      // Find meeting in localStorage
      const meetings = getMeetings()

      const meeting = meetings.find(
        m => m.meetingId === cleanId
      )

      if (!meeting) {

        throw new Error(
          'Meeting not found. Please check the meeting code.'
        )

      }

      if (meeting.status !== 'active') {

        throw new Error('This meeting has already ended')

      }

      toast.success('Joining meeting...')

      navigate(`/meeting/${encodeURIComponent(meeting.meetingId)}`)

    } catch (error) {

      console.error('Join meeting error:', error)

      toast.error(error.message || 'Unable to join meeting')

    } finally {

      setIsJoining(false)

    }

  }

  return (

    <div className='flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center'>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>

        {/* Left Section */}

        <div className='lg:col-span-7 space-y-8'>

          <div className='space-y-3'>

            <div className='inline-flex items-center gap-2 px-3.5 pr-6 py-2 rounded-full bg-white/25 font-medium'>

              <ShieldCheckIcon size={16} />

              Secure Peer-to-Peer Encryption

            </div>

            <h1 className='text-4xl sm:text-5xl text-slate-800 leading-tight font-medium'>

              High quality video calls.

              <br />

              <span className='text-primary'>
                Built for everyone.
              </span>

            </h1>

            <p className='text-slate-700 text-base sm:text-lg max-w-xl leading-relaxed'>

              Connect, collaborate, and celebrate from anywhere
              with ultra-low latency video, screen sharing,
              and real-time chat.

            </p>

            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2'>

              {/* New Meeting */}

              <button
                onClick={handleCreateMeeting}
                disabled={isCreating || !isLoaded}
                className='bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3.5 rounded-full shadow-md shadow-primary/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50'
              >

                <PlusIcon className='w-5 h-5' />

                <span>
                  {isCreating ? 'Creating...' : 'New Meeting'}
                </span>

              </button>

              {/* Join Meeting */}

              <form
                onSubmit={handleJoinMeeting}
                className='flex-1 flex items-center gap-2'
              >

                <div className='relative flex-1'>

                  <KeyboardIcon className='w-5 h-5 text-primary/90 absolute left-4 top-1/2 -translate-y-1/2' />

                  <input
                    type='text'
                    placeholder='Enter Meeting code (e.g. abc-def-ghi)'
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    className='w-full bg-white/75 border border-primary-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 rounded-full pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all'
                  />

                </div>

                <button
                  type='submit'
                  disabled={!joinId.trim() || isJoining}
                  className='bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-white font-medium px-6 py-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-xs'
                >

                  <span>
                    {isJoining ? 'Checking...' : 'Join'}
                  </span>

                  <ArrowRightIcon className='w-4 h-4 ml-1.5' />

                </button>

              </form>

            </div>

          </div>

        </div>

        {/* Right Section */}

        <div className='lg:col-span-5 flex flex-col items-center justify-center space-y-4'>

          <div className='w-full bg-white/25 backdrop-blur rounded-4xl p-8 border border-slate-200 text-center space-y-6 relative overflow-hidden'>

            <div className='space-y-1'>

              <p className='mb-5 text-xl text-left'>

                Hi, <span className='font-medium'>{userName}</span>

              </p>

              <h2 className='text-4xl xl:text-7xl my-4 text-slate-900 tracking-wide'>

                {currentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}

              </h2>

              <p className='font-medium tracking-wider text-primary'>

                {currentTime.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}

              </p>

            </div>

            <div className='pt-4 border-t border-white/30 text-sm text-slate-600'>

              <div className='flex items-center justify-between py-6 px-4'>

                <p>
                  Logged in as:

                  <span className='text-slate-900'>
                    {userEmail}
                  </span>
                </p>

                <span className={`px-4 py-1 rounded-full font-semibold text-xs uppercase ${
                  stats.plan === 'premium'
                    ? 'bg-blue-700 text-white'
                    : 'bg-white/70 text-slate-800'
                }`}>

                  {stats.plan || 'Free'}

                </span>

              </div>

              {stats && (

                <div className='w-full bg-white/50 rounded-2xl px-5 py-4 border border-slate-100'>

                  <div className='flex items-center justify-between text-sm'>

                    <span>Monthly Meetings</span>

                    <span className='text-xs text-slate-600 font-mono'>

                      {stats.monthlyLimit
                        ? `${stats.monthlyCount} / ${stats.monthlyLimit}`
                        : `${stats.monthlyCount} Created (Unlimited)`}

                    </span>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Dashboard
