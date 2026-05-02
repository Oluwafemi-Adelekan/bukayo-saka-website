// YouTube IFrame API type declarations
declare namespace YT {
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
