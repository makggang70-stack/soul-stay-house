export type Levels = { piano: number; rain: number; wind: number; volume: number };
export const DEFAULT_LEVELS: Levels = { piano: 45, rain: 15, wind: 25, volume: 65 };
export const clamp = (value: number): number => Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
export function isLevels(value: unknown): value is Levels {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (['piano','rain','wind','volume'] as const).every(k => typeof v[k] === 'number' && Number.isFinite(v[k]) && v[k] >= 0 && v[k] <= 100);
}
function noise(ctx: AudioContext): AudioBufferSourceNode {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const channel = buffer.getChannelData(0);
  for(let i=0;i<channel.length;i++) channel[i] = Math.random()*2-1;
  const source = ctx.createBufferSource(); source.buffer=buffer; source.loop=true; return source;
}
export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private tone: GainNode | null = null;
  private rain: GainNode | null = null;
  private wind: GainNode | null = null;
  private playing = false;
  private levels: Levels = { ...DEFAULT_LEVELS };
  get isPlaying(): boolean { return this.playing; }
  private setup(): void {
    if(this.ctx) return;
    const ctx = new AudioContext(); this.ctx = ctx;
    const master = ctx.createGain(); master.connect(ctx.destination); this.master=master;
    const tone=ctx.createGain(); tone.connect(master); this.tone=tone;
    [174.61,220,261.63].forEach((freq,index)=>{const o=ctx.createOscillator(); const gain=ctx.createGain();o.type='sine';o.frequency.value=freq;gain.gain.value=index===0?.12:.065;o.connect(gain).connect(tone);o.start();});
    const createNoiseLayer=(cutoff:number):GainNode=>{const src=noise(ctx), filter=ctx.createBiquadFilter(),gain=ctx.createGain();filter.type='lowpass';filter.frequency.value=cutoff;src.connect(filter).connect(gain).connect(master);src.start();return gain;};
    this.rain=createNoiseLayer(1100);this.wind=createNoiseLayer(220);this.setLevels(this.levels);
  }
  setLevels(levels: Levels): void {
    this.levels={...levels}; if(!this.ctx) return;
    const now=this.ctx.currentTime;
    const change=(node:GainNode|null,value:number)=>node?.gain.setTargetAtTime(value,now,.1);
    change(this.tone,levels.piano/100);change(this.rain,levels.rain/100*.24);change(this.wind,levels.wind/100*.36);change(this.master,levels.volume/100);
  }
  async play(): Promise<void> { this.setup(); if(!this.ctx) throw new Error('오디오 초기화 실패'); await this.ctx.resume(); if(this.ctx.state!=='running') throw new Error('브라우저에서 오디오가 차단되었습니다'); this.playing=true; }
  async pause(): Promise<void> { if(this.ctx) await this.ctx.suspend(); this.playing=false; }
  async toggle(): Promise<void> { if(this.playing) await this.pause(); else await this.play(); }
  async dispose(): Promise<void> { if(this.ctx) await this.ctx.close(); this.ctx=null;this.playing=false; }
}
