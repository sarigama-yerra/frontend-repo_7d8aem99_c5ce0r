import React, { useEffect, useState } from 'react'
import { Play, Pause, Square, Plus, Trash2, Music, Settings, Mic, Video, Download, ChevronUp, ChevronDown, Disc3 } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import VoiceUploader from './VoiceUploader'

// Extensive instrument list (excerpted):
const INSTRUMENTS = [
  'Piano','Grand Piano','Electric Piano','Acoustic Guitar','Electric Guitar','Bass Guitar','Violin','Viola','Cello','Contrabass','Harp','Flute','Clarinet','Oboe','Bassoon','Trumpet','Trombone','French Horn','Tuba','Saxophone','Piccolo','Choir Aah','Choir Ooh','Synth Pad Soft','Synth Pad Warm','Synth Strings','Lead Saw','Lead Square','Pluck','Bells','Marimba','Xylophone','Kalimba','Santoor','Sitar','Tabla','Dholak','Shaker','Cajon','Kick','Snare','Hi-Hat','808 Bass','Sub Bass','FX Sweep','Ambient Texture'
]

const MOODS = ['Romantic','Sad','One-sided','Happy','Melancholic','Energetic','Chill','Cinematic','Dark','Nostalgic','Dreamy','Angry','Hopeful','Epic','Lo-fi','Upbeat']

function Knob({label, value, onChange, min=0, max=1, step=0.01}){
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-400">{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(parseFloat(e.target.value))} className="w-full accent-violet-500"/>
    </div>
  )
}

function InstrumentPanel({tracks, addTrack, removeTrack, toggleMute, toggleSolo, updateCtrl}){
  const [sel, setSel] = useState(INSTRUMENTS[0])
  const [search, setSearch] = useState('')
  const filtered = INSTRUMENTS.filter(i=> i.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="p-3 space-y-3">
      <div className="bg-[#121218] rounded-xl border border-white/10 p-3">
        <div className="flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search instrument" className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200 placeholder:text-slate-500"/>
          <select value={sel} onChange={e=>setSel(e.target.value)} className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200">
            {filtered.map(i=> <option key={i} value={i}>{i}</option>)}
          </select>
          <button onClick={()=>addTrack(sel)} className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded flex items-center gap-1"><Plus size={16}/>Add</button>
        </div>
      </div>

      {tracks.map(t=> (
        <div key={t.id} className="bg-[#121218] rounded-xl border border-white/10 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium flex items-center gap-2 text-slate-200"><Music size={16}/>{t.name}</div>
            <div className="flex items-center gap-2">
              <button onClick={()=>toggleMute(t.id)} className={`text-xs px-2 py-1 rounded ${t.muted? 'bg-yellow-400/20 text-yellow-300 border border-yellow-300/30':'bg-white/5 text-slate-300 border border-white/10'}`}>Mute</button>
              <button onClick={()=>toggleSolo(t.id)} className={`text-xs px-2 py-1 rounded ${t.solo? 'bg-emerald-400/20 text-emerald-300 border border-emerald-300/30':'bg-white/5 text-slate-300 border border-white/10'}`}>Solo</button>
              <button onClick={()=>removeTrack(t.id)} className="p-1 text-rose-400 hover:bg-rose-400/10 rounded border border-white/10"><Trash2 size={16}/></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Knob label="Volume" value={t.controls.volume} onChange={v=>updateCtrl(t.id,'volume',v)} />
            <Knob label="Pan" min={-1} max={1} step={0.01} value={t.controls.pan} onChange={v=>updateCtrl(t.id,'pan',v)} />
            <Knob label="Reverb" value={t.controls.reverb} onChange={v=>updateCtrl(t.id,'reverb',v)} />
            <Knob label="Attack" value={t.controls.attack} onChange={v=>updateCtrl(t.id,'attack',v)} />
            <Knob label="Release" value={t.controls.release} onChange={v=>updateCtrl(t.id,'release',v)} />
            <Knob label="Humanize" value={t.controls.humanize} onChange={v=>updateCtrl(t.id,'humanize',v)} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Timeline({lyricsMap, position, setPosition, bpm}){
  return (
    <div className="p-3">
      <div className="bg-[#121218] rounded-xl border border-white/10 p-3 h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"/>
        <div className="space-y-2 relative">
          {lyricsMap.map((l, idx)=> (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-24 text-xs text-slate-400">{l.start.toFixed(1)}s</div>
              <div className="flex-1 h-6 bg-cyan-400/10 rounded overflow-hidden relative border border-cyan-400/20">
                <div className="absolute left-0 top-0 h-full bg-cyan-500/30" style={{width: `${Math.max(8,(l.end-l.start)*20)}px`}}></div>
                <div className="absolute left-2 top-0 text-xs text-cyan-200 leading-6 truncate">{l.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-violet-500" style={{left: `${position}%`}}/>
        <input type="range" min={0} max={100} value={position} onChange={e=>setPosition(parseFloat(e.target.value))} className="absolute bottom-3 left-3 right-3 accent-violet-500"/>
        <div className="absolute top-3 right-3 text-xs text-slate-400">Grid: {bpm} BPM</div>
      </div>
    </div>
  )
}

function Inspector({project, setProject, onGenerateMelody, onGenerateInst, onMix, onVideo, onCreate, baseUrl}){
  const [lyrics, setLyrics] = useState(project.lyrics||'')
  const [expanded, setExpanded] = useState({lyrics:true, voice:true, export:true})
  useEffect(()=>setLyrics(project.lyrics||''),[project.lyrics])
  const toggle = (k)=> setExpanded(s=>({...s,[k]:!s[k]}))
  return (
    <div className="p-3 space-y-3">
      <div className="bg-[#121218] rounded-xl border border-white/10 p-3">
        <div className="text-sm text-slate-400 mb-2">Project</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" value={project.name} onChange={e=>setProject({...project, name:e.target.value})} placeholder="Project name"/>
          <input className="bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" value={project.key} onChange={e=>setProject({...project, key:e.target.value})} placeholder="Key"/>
          <input className="bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" type="number" min={60} max={140} value={project.tempo} onChange={e=>setProject({...project, tempo:Math.min(140,Math.max(60, parseInt(e.target.value||0)))})} placeholder="BPM"/>
          <select className="bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" value={project.style} onChange={e=>setProject({...project, style:e.target.value})}>
            {MOODS.map(m=> <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={onGenerateInst} className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded">Generate Instrumental</button>
          <button onClick={()=>onGenerateMelody(lyrics)} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded">Lyrics → Melody</button>
        </div>
      </div>

      <div className="bg-[#121218] rounded-xl border border-white/10">
        <button className="w-full flex items-center justify-between p-3 text-slate-300" onClick={()=>toggle('lyrics')}>
          <span>Lyrics</span>
          {expanded.lyrics? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>
        {expanded.lyrics && (
          <div className="p-3 pt-0">
            <textarea className="w-full h-40 bg-black/30 border border-white/10 rounded p-2 text-slate-200 placeholder:text-slate-500" value={lyrics} onChange={e=>setLyrics(e.target.value)} placeholder="Paste lyrics in Bengali / Hindi / English"/>
          </div>
        )}
      </div>

      <div className="bg-[#121218] rounded-xl border border-white/10">
        <button className="w-full flex items-center justify-between p-3 text-slate-300" onClick={()=>toggle('voice')}>
          <span>Voice Options</span>
          {expanded.voice? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>
        {expanded.voice && (
          <div className="p-3 pt-0">
            <VoiceUploader baseUrl={baseUrl}/>
          </div>
        )}
      </div>

      <div className="bg-[#121218] rounded-xl border border-white/10">
        <button className="w-full flex items-center justify-between p-3 text-slate-300" onClick={()=>toggle('export')}>
          <span>Export</span>
          {expanded.export? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>
        {expanded.export && (
          <div className="p-3 pt-0 space-y-2">
            <div className="text-xs text-slate-400">Exports: WAV/MP3, stems, MP4 video, promo clip</div>
            <div className="flex gap-2">
              <button onClick={onMix} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center gap-1"><Settings size={16}/>Mix & Master</button>
              <button onClick={onVideo} className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded flex items-center gap-1"><Video size={16}/>Generate Video</button>
            </div>
          </div>
        )}
      </div>

      <button onClick={()=>onCreate(lyrics)} className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl flex items-center justify-center gap-2">
        <Disc3 className="animate-spin-slow" size={16}/> Create
      </button>
    </div>
  )
}

export default function Studio(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [project, setProject] = useState({name:'New Song', tempo:80, key:'C minor', style:'Romantic', instruments:[]})
  const [tracks, setTracks] = useState([])
  const [position, setPosition] = useState(0)
  const [lyricsMap, setLyricsMap] = useState([])
  const [status, setStatus] = useState('Ready')
  const [resultUrls, setResultUrls] = useState({})

  const addTrack = (name)=>{
    const id = Math.random().toString(36).slice(2)
    setTracks(t=>[...t, {id, name, controls:{volume:0.8, pan:0, reverb:0.2, attack:0.01, release:0.2, humanize:0.3}, muted:false, solo:false}])
  }
  const removeTrack = (id)=> setTracks(t=>t.filter(x=>x.id!==id))
  const toggleMute = (id)=> setTracks(t=>t.map(x=> x.id===id? {...x, muted:!x.muted}:x))
  const toggleSolo = (id)=> setTracks(t=>t.map(x=> x.id===id? {...x, solo:!x.solo}:x))
  const updateCtrl = (id, k, v)=> setTracks(t=>t.map(x=> x.id===id? {...x, controls:{...x.controls, [k]:v}}:x))

  async function ensureProject(){
    if(!project.id){
      const res = await fetch(`${baseUrl}/api/projects`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
        name: project.name, tempo: project.tempo, key: project.key, style: project.style, duration_sec: 120, instruments: tracks.map(t=>t.name), lyrics: project.lyrics||''
      })})
      const data = await res.json()
      setProject(p=>({...p, id: data.projectId}))
      return data.projectId
    }
    return project.id
  }

  async function onGenerateMelody(lyrics){
    const pid = await ensureProject()
    setStatus('Generating melody...')
    const res = await fetch(`${baseUrl}/api/generate/melody`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, lyrics, style: project.style, tempo: project.tempo, key: project.key })})
    const {jobId} = await res.json()
    await pollJob(jobId, (j)=>{
      setStatus(`${j.progress}% - ${j.message}`)
      if(j.status==='done'){
        setStatus('Melody ready')
        const ts = j.result.timestamps || j.result.lyricTimestamps || []
        setLyricsMap(ts)
        setProject(p=>({...p, lyrics}))
        setResultUrls(r=>({...r, midiUrl: j.result.midiUrl, guideAudioUrl: j.result.guideAudioUrl }))
      }
    })
  }

  async function onGenerateInst(){
    const pid = await ensureProject()
    setStatus('Generating instrumental...')
    const res = await fetch(`${baseUrl}/api/generate/instrumental`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, tempo: project.tempo, key: project.key, instruments: tracks.map(t=>t.name), length_sec: 30, style: project.style })})
    const {jobId} = await res.json()
    await pollJob(jobId, (j)=> setStatus(`${j.progress}% - ${j.message}`))
  }

  async function onMix(){
    const pid = await ensureProject()
    setStatus('Mixing...')
    const res = await fetch(`${baseUrl}/api/mix`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, stems: [], masterTargetLUFS: -14 })})
    const {jobId} = await res.json()
    await pollJob(jobId, (j)=> {
      if(j.status==='done'){
        setStatus(`Master ready`)
        setResultUrls(r=>({...r, masterUrl: j.result.masterUrl}))
      } else {
        setStatus(`${j.progress}% - ${j.message}`)
      }
    })
  }

  async function onVideo(){
    const pid = await ensureProject()
    setStatus('Generating video...')
    const res = await fetch(`${baseUrl}/api/generate/video`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, audioUrl: resultUrls.masterUrl || '', style: project.style, aspectRatio: '16:9' })})
    const {jobId} = await res.json()
    await pollJob(jobId, (j)=> {
      if(j.status==='done'){
        setStatus('Video ready')
        setResultUrls(r=>({...r, videoUrl: j.result.videoUrl, thumbnails: j.result.thumbnails }))
      } else {
        setStatus(`${j.progress}% - ${j.message}`)
      }
    })
  }

  async function onCreate(lyrics){
    const pid = await ensureProject()
    setStatus('Running full pipeline...')
    const res = await fetch(`${baseUrl}/api/generate/create`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, tempo: project.tempo, key: project.key, style: project.style, lyrics, instruments: tracks.map(t=>t.name) })})
    const {jobId} = await res.json()
    await pollJob(jobId, (j)=>{
      if(j.status==='done'){
        setStatus('Done')
        setResultUrls({ masterUrl: j.result.masterUrl, videoUrl: j.result.videoUrl, midiUrl: j.result.midiUrl, vocalUrl: j.result.vocalUrl })
      } else {
        setStatus(`${j.progress}% - ${j.message}`)
      }
    })
  }

  async function pollJob(jobId, onUpdate){
    let done=false
    while(!done){
      const r = await fetch(`${baseUrl}/api/job/${jobId}/status`)
      const j = await r.json()
      onUpdate(j)
      done = j.status==='done' || j.status==='error'
      if(!done) await new Promise(res=>setTimeout(res, 700))
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <div className="relative h-56">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width:'100%', height:'100%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/60 to-transparent pointer-events-none"/>
      </div>

      <div className="px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button className="p-2 rounded bg-violet-600 text-white"><Play size={18}/></button>
          <button className="p-2 rounded bg-white/10 text-slate-300"><Pause size={18}/></button>
          <button className="p-2 rounded bg-white/10 text-slate-300"><Square size={18}/></button>
          <div className="ml-4 text-sm text-slate-400">BPM</div>
          <input type="number" min={60} max={140} className="w-20 bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" value={project.tempo} onChange={e=>setProject({...project, tempo:Math.min(140,Math.max(60, parseInt(e.target.value||0)))})}/>
          <div className="ml-4 text-sm text-slate-400">Key</div>
          <input className="w-24 bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" value={project.key} onChange={e=>setProject({...project, key:e.target.value})}/>
          <div className="ml-4 font-medium text-slate-200">{project.name}</div>
          <div className="ml-auto text-sm text-slate-400">{status}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
        <div>
          <InstrumentPanel tracks={tracks} addTrack={addTrack} removeTrack={removeTrack} toggleMute={toggleMute} toggleSolo={toggleSolo} updateCtrl={updateCtrl}/>
        </div>
        <div>
          <Timeline bpm={project.tempo} lyricsMap={lyricsMap} position={position} setPosition={setPosition}/>
          {resultUrls.masterUrl && (
            <div className="px-3">
              <div className="bg-[#121218] rounded-xl border border-white/10 p-3 flex items-center justify-between">
                <div className="text-sm text-slate-300">Results ready</div>
                <div className="flex gap-2">
                  <a className="px-3 py-1 bg-white/10 text-slate-200 rounded border border-white/10" href={resultUrls.masterUrl} download>Download MP3/WAV</a>
                  {resultUrls.videoUrl && <a className="px-3 py-1 bg-white/10 text-slate-200 rounded border border-white/10" href={resultUrls.videoUrl} download>Download MP4</a>}
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <Inspector baseUrl={baseUrl} project={project} setProject={setProject} onGenerateMelody={onGenerateMelody} onGenerateInst={onGenerateInst} onMix={onMix} onVideo={onVideo} onCreate={onCreate}/>
        </div>
      </div>

      <div className="py-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="text-sm text-slate-500">Master controls, export options</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/10 text-slate-200 rounded border border-white/10 flex items-center gap-1"><Download size={16}/>Export</button>
          </div>
        </div>
      </div>
    </div>
  )
}
