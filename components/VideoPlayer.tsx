'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import './VideoPlayer.css';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    className?: string;
    autoPlay?: boolean;
    muted?: boolean;
    controls?: boolean;
}

export default function VideoPlayer({
    src,
    poster,
    title,
    className = '',
    autoPlay = false,
    muted = true,
    controls = true
}: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Generate Cloudinary optimized URL
    const getOptimizedUrl = (originalUrl: string) => {
        if (!originalUrl.includes('cloudinary.com')) return originalUrl;
        
        // Add Cloudinary transformations for video optimization
        const transformations = 'q_auto,f_auto,c_limit,w_1920,vc_auto';
        const delimiter = originalUrl.includes('/upload/') ? '/upload/' : '/';
        const [before, after] = originalUrl.split(delimiter);
        
        return `${before}${delimiter}${transformations}/${after}`;
    };

    const optimizedSrc = getOptimizedUrl(src);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    useEffect(() => {
        if (autoPlay && videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [autoPlay]);

    const togglePlay = async (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        
        if (!videoRef.current) {
            console.log('No video ref');
            return;
        }
        
        console.log('Toggle play called, isPlaying:', isPlaying);
        console.log('Video readyState:', videoRef.current.readyState);
        console.log('Video src:', optimizedSrc);
        
        try {
            if (isPlaying) {
                console.log('Pausing video');
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                console.log('Playing video');
                // Try to play directly first
                const playPromise = videoRef.current.play();
                console.log('Play promise:', playPromise);
                
                if (playPromise !== undefined) {
                    await playPromise;
                    console.log('Video played successfully');
                    setIsPlaying(true);
                }
            }
        } catch (error) {
            console.error('Video play error:', error);
            setIsPlaying(false);
            
            // If autoplay is prevented, try with muted
            if (error instanceof Error && error.name === 'NotAllowedError') {
                console.log('Autoplay prevented, trying with muted');
                try {
                    videoRef.current!.muted = true;
                    await videoRef.current!.play();
                    setIsPlaying(true);
                    setIsMuted(true);
                } catch (mutedError) {
                    console.error('Even muted play failed:', mutedError);
                }
            }
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            containerRef.current.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const showControlsTemporarily = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            className={`relative bg-black rounded-xl overflow-hidden ${className}`}
            onMouseMove={showControlsTemporarily}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={optimizedSrc}
                poster={poster}
                className="w-full h-full object-cover"
                onClick={togglePlay}
                onPlay={() => {
                    console.log('Video onPlay event fired');
                    setIsPlaying(true);
                }}
                onPause={() => {
                    console.log('Video onPause event fired');
                    setIsPlaying(false);
                }}
                onPlayCapture={() => console.log('Video playing')}
                onErrorCapture={(e) => console.error('Video error:', e)}
                onLoadedData={() => console.log('Video data loaded')}
                onCanPlay={() => console.log('Video can play')}
                playsInline
                muted={muted || false}
                controls={controls}
                preload="metadata"
            />
            
            {/* Play/Pause button overlay */}
            <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
            >
                <div className="bg-white/90 rounded-full p-4 transform hover:scale-110 transition-transform">
                    {isPlaying ? (
                        <Pause className="w-8 h-8 text-gray-900" />
                    ) : (
                        <Play className="w-8 h-8 text-gray-900 ml-1" />
                    )}
                </div>
            </button>

            {/* Controls */}
            {controls && (
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
                        showControls ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {/* Progress bar */}
                    <div className="mb-3">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-white mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Control buttons */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-champagne-400 transition-colors"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5" />
                                ) : (
                                    <Play className="w-5 h-5" />
                                )}
                            </button>
                            
                            <button
                                onClick={toggleMute}
                                className="text-white hover:text-champagne-400 transition-colors"
                            >
                                {isMuted ? (
                                    <VolumeX className="w-5 h-5" />
                                ) : (
                                    <Volume2 className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-champagne-400 transition-colors"
                        >
                            {isFullscreen ? (
                                <Minimize className="w-5 h-5" />
                            ) : (
                                <Maximize className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
