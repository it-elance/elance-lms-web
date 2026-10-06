// Subset of the TPStreams player SDK (player_v2.js) that the app uses.
// Every method resolves only after the embedded player has loaded data.
export interface TPStreamsPlayer {
  loaded(): Promise<void>;
  getCurrentTime(): Promise<number>;
  // Starts playback when it hasn't started yet
  setCurrentTime(seconds: number): Promise<number>;
  getPaused(): Promise<boolean>;
  on(event: string, callback: () => void): void;
  off(event: string, callback?: () => void): void;
}

declare global {
  interface Window {
    Testpress?: {
      Player: new (iframe: HTMLIFrameElement) => TPStreamsPlayer;
    };
  }
}
