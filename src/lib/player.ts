export class Player {
  private audioContext: AudioContext | null = null;
  private sampleRate: number = 24000;
  private queue: Float32Array[] = [];
  private isPlaying: boolean = false;

  init(sampleRate: number) {
    this.sampleRate = sampleRate;
    this.audioContext = new AudioContext({ sampleRate });
  }

  play(pcmData: Int16Array) {
    if (!this.audioContext) return;

    const floatArray = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatArray[i] = pcmData[i] / 0x7fff;
    }

    this.queue.push(floatArray);
    if (!this.isPlaying) {
      this.playNextBuffer();
    }
  }

  private async playNextBuffer() {
    if (!this.audioContext || this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const buffer = this.audioContext.createBuffer(1, this.queue[0].length, this.sampleRate);
    buffer.getChannelData(0).set(this.queue[0]);
    this.queue.shift();

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.onended = () => this.playNextBuffer();
    source.start();
  }

  clear() {
    this.queue = [];
    this.isPlaying = false;
  }
}