let audioContext: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function decodeAudioData(dataUri: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(dataUri);
  if (cached) return cached;

  const ctx = getAudioContext();
  const base64 = dataUri.split(",")[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
  bufferCache.set(dataUri, audioBuffer);
  return audioBuffer;
}

export interface PlaySoundOptions {
  volume?: number;
  playbackRate?: number;
  onEnd?: () => void;
  /** High-pass cutoff in Hz for a tighter, clickier transient */
  highPassHz?: number;
  /** Peaking EQ center frequency in Hz */
  peakHz?: number;
  /** Peaking EQ gain in dB */
  peakGainDb?: number;
}

export interface SoundPlayback {
  stop: () => void;
}

export async function playSound(
  dataUri: string,
  options: PlaySoundOptions = {}
): Promise<SoundPlayback> {
  const {
    volume = 1,
    playbackRate = 1,
    onEnd,
    highPassHz,
    peakHz,
    peakGainDb,
  } = options;
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const buffer = await decodeAudioData(dataUri);
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();

  source.buffer = buffer;
  source.playbackRate.value = playbackRate;
  gain.gain.value = volume;

  let output: AudioNode = source;

  if (highPassHz !== undefined) {
    const highPass = ctx.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = highPassHz;
    highPass.Q.value = 0.8;
    output.connect(highPass);
    output = highPass;
  }

  if (peakHz !== undefined && peakGainDb !== undefined) {
    const peak = ctx.createBiquadFilter();
    peak.type = "peaking";
    peak.frequency.value = peakHz;
    peak.gain.value = peakGainDb;
    peak.Q.value = 1.1;
    output.connect(peak);
    output = peak;
  }

  output.connect(gain);
  gain.connect(ctx.destination);

  source.onended = () => {
    onEnd?.();
  };

  source.start(0);

  return {
    stop: () => {
      try {
        source.stop();
      } catch {
        // No-op if already stopped.
      }
    },
  };
}
