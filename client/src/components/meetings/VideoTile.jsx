
import React, { useEffect, useRef } from 'react';
import {
    MicOffIcon,
    UserIcon,
    VideoOffIcon
} from 'lucide-react';

const VideoTile = ({
    stream,
    name,
    isLocal = false,
    audioEnabled = true,
    videoEnabled = true
}) => {

    const videoRef = useRef(null);

    // Attach video stream
    useEffect(() => {

        const video = videoRef.current;

        if (!video) return;

        video.srcObject = stream || null;

        if (stream) {
            video.play().catch((error) => {
                console.error("Video playback error:", error);
            });
        }

        return () => {
            video.srcObject = null;
        };

    }, [stream]);

    // Get user initials
    const getInitial = () => {
        return name ? name.charAt(0).toUpperCase() : null;
    };

    return (
        <div className="
            relative w-full aspect-video min-h-[200px]
            bg-slate-900 rounded-2xl overflow-hidden
            border border-slate-800 shadow-md
            flex items-center justify-center group
        ">

            {/* Video element */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                className={`
                    absolute inset-0 w-full h-full object-cover
                    transition-opacity duration-300
                    ${videoEnabled && stream ? "opacity-100" : "opacity-0"}
                    ${isLocal ? "-scale-x-100" : ""}
                `}
            />

            {/* Camera off placeholder */}
            {(!videoEnabled || !stream) && (
                <div className="
                    absolute inset-0 flex flex-col
                    items-center justify-center gap-3 z-10
                ">

                    <div className="
                        w-20 h-20 rounded-full
                        bg-indigo-600/20 border-2
                        border-indigo-400/40
                        flex items-center justify-center
                        text-indigo-300 text-2xl font-bold
                        shadow-inner
                    ">
                        {getInitial() || (
                            <UserIcon className="w-8 h-8" />
                        )}
                    </div>

                    <span className="
                        text-xs font-semibold px-3 py-1.5
                        rounded-full bg-slate-800/90
                        text-slate-300 border border-slate-700/60
                        flex items-center gap-2 shadow-md
                    ">
                        <VideoOffIcon className="w-3.5 h-3.5 text-rose-400" />
                        Camera Off
                    </span>

                </div>
            )}

            {/* Participant information */}
            <div className="
                absolute bottom-3 left-3 right-3
                flex items-center justify-between
                z-20 pointer-events-none
            ">

                <div className="
                    flex items-center gap-2
                    bg-slate-900/80 backdrop-blur-md
                    px-3 py-1.5 rounded-xl
                    border border-white/20
                    text-xs font-medium text-white shadow-md
                ">

                    <span>
                        {name || "Participant"} {isLocal ? "(You)" : ""}
                    </span>

                    {/* Microphone off indicator */}
                    {!audioEnabled && (
                        <span className="
                            p-1 rounded-md
                            bg-rose-500/20 text-rose-300
                            border border-rose-500/40
                        ">
                            <MicOffIcon className="w-3 h-3" />
                        </span>
                    )}

                </div>

            </div>

        </div>
    );
};

export default VideoTile;
