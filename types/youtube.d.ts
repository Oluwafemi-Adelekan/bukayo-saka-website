// YouTube IFrame API type declarations
declare namespace YT {
  const PlayerState: {
    readonly ENDED:     0
    readonly PLAYING:   1
    readonly PAUSED:    2
    readonly BUFFERING: 3
    readonly CUED:      5
  }

  interface PlayerEvent {
    target: Player
  }

  interface OnStateChangeEvent {
    target: Player
    data: number
  }

  interface PlayerOptions {
    height?: string | number
    width?: string | number
    videoId?: string
    playerVars?: Record<string, string | number>
    events?: {
      onReady?: (event: PlayerEvent) => void
      onStateChange?: (event: OnStateChangeEvent) => void
      onError?: (event: PlayerEvent) => void
    }
  }

  class Player {
    constructor(element: HTMLIFrameElement | string, options?: PlayerOptions)
    playVideo(): void
    pauseVideo(): void
    seekTo(seconds: number, allowSeekAhead: boolean): void
    mute(): void
    unMute(): void
    getCurrentTime(): number
    getDuration(): number
    destroy(): void
  }
}

interface Window {
  onYouTubeIframeAPIReady?: () => void
}
