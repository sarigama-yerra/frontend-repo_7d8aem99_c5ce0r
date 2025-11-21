import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, Square, Plus, Trash2, Music, Settings, Mic, Video, Download } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import VoiceUploader from './VoiceUploader'

const INSTRUMENTS = ['Piano','Acoustic Guitar','Violin','Cello','Soft Pad','Kick','Snare','Shaker','Santoor','Flute']

function Knob({label, value, onChange, min=0, max=1, step=0.01}){
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(parseFloat(e.target.value))} className="w-full"/>
    </div>
  )
}

function InstrumentPanel({tracks, addTrack, removeTrack, toggleMute, toggleSolo, updateCtrl}){
  const [sel, setSel] = useState(INSTRUMENTS[0])
  return (
    <div className="p-3 space-y-3">
      <div className="bg-white rounded-xl shadow p-3">
        <div className="flex gap-2">
          <select value={sel} onChange={e=>setSel(e.target.value)} className="flex-1 border rounded px-2 py-1">
            {INSTRUMENTS.map(i=> <option key={i} value={i}>{i}</option>)}
          </select>
          <button onClick={()=>addTrack(sel)} className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-1"><Plus size={16}/>Add</button>
        </div>
      </div>

      {tracks.map(t=> (
        <div key={t.id} className="bg-white rounded-xl shadow p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium flex items-center gap-2"><Music size={16}/>{t.name}</div>
            <div className="flex items-center gap-2">
              <button onClick={()=>toggleMute(t.id)} className={`text-xs px-2 py-1 rounded ${t.muted? 'bg-yellow-100 text-yellow-700':'bg-gray-100'}`}>Mute</button>
              <button onClick={()=>toggleSolo(t.id)} className={`text-xs px-2 py-1 rounded ${t.solo? 'bg-green-100 text-green-700':'bg-gray-100'}`}>Solo</button>
              <button onClick={()=>removeTrack(t.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
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

function Timeline({lyricsMap, position, setPosition}){
  return (
    <div className="p-3">
      <div className="bg-white rounded-xl shadow p-3 h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 pointer-events-none"/>
        <div className="space-y-2 relative">
          {lyricsMap.map((l, idx)=> (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-24 text-xs text-gray-500">{l.start.toFixed(1)}s</div>
              <div className="flex-1 h-6 bg-blue-50 rounded overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full bg-blue-200" style={{width: `${(l.end-l.start)*20}px`}}></div>
                <div className="absolute left-2 top-0 text-xs text-blue-900 leading-6">{l.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" style={{left: `${position}%`}}/>
        <input type="range" min={0} max={100} value={position} onChange={e=>setPosition(parseFloat(e.target.value))} className="absolute bottom-3 left-3 right-3"/>
      </div>
    </div>
  )
}

function Inspector({project, setProject, onGenerateMelody, onGenerateInst, onMix, onVideo, baseUrl}){
  const [lyrics, setLyrics] = useState(project.lyrics||'')
  useEffect(()=>setLyrics(project.lyrics||''),[project.lyrics])
  return (
    <div className="p-3 space-y-3">
      <div className="bg-white rounded-xl shadow p-3">
        <div className="text-sm text-gray-600 mb-2">Project</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border rounded px-2 py-1" value={project.name} onChange={e=>setProject({...project, name:e.target.value})} placeholder="Project name"/>
          <input className="border rounded px-2 py-1" value={project.key} onChange={e=>setProject({...project, key:e.target.value})} placeholder="Key"/>
          <input className="border rounded px-2 py-1" type="number" value={project.tempo} onChange={e=>setProject({...project, tempo:parseInt(e.target.value||0)})} placeholder="BPM"/>
          <select className="border rounded px-2 py-1" value={project.style} onChange={e=>setProject({...project, style:e.target.value})}>
            <option>Romantic</option>
            <option>Sad</option>
            <option>One-sided</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={onGenerateInst} className="px-3 py-1 bg-indigo-600 text-white rounded">Generate Instrumental</button>
          <button onClick={()=>onGenerateMelody(lyrics)} className="px-3 py-1 bg-blue-600 text-white rounded">Lyrics → Melody</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-3">
        <div className="text-sm text-gray-600 mb-2">Lyrics</div>
        <textarea className="w-full h-40 border rounded p-2" value={lyrics} onChange={e=>setLyrics(e.target.value)} placeholder="Paste lyrics in Bengali / Hindi / English"/>
      </div>

      <VoiceUploader baseUrl={baseUrl}/>

      <div className="bg-white rounded-xl shadow p-3 space-y-2">
        <div className="flex gap-2">
          <button onClick={onMix} className="px-3 py-1 bg-emerald-600 text-white rounded flex items-center gap-1"><Settings size={16}/>Mix & Master</button>
          <button onClick={onVideo} className="px-3 py-1 bg-pink-600 text-white rounded flex items-center gap-1"><Video size={16}/>Generate Video</button>
        </div>
        <div className="text-xs text-gray-500">Exports: WAV/MP3, stems, MP4 video, promo clip</div>
      </div>
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
        setLyricsMap(j.result.lyricTimestamps||[])
        setProject(p=>({...p, lyrics}))
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
    await pollJob(jobId, (j)=> setStatus(j.status==='done'? `Master ready: ${j.result.masterUrl}`: `${j.progress}% - ${j.message}`))
  }

  async function onVideo(){
    const pid = await ensureProject()
    setStatus('Generating video...')
    const res = await fetch(`${baseUrl}/api/generate/video`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, audioUrl: '', style: project.style, aspectRatio: '16:9' })})
    const {jobId} = await res.json()
    await pollJob(jobId, (j)=> setStatus(j.status==='done'? `Video ready`: `${j.progress}% - ${j.message}`))
  }

  async function pollJob(jobId, onUpdate){
    let done=false
    while(!done){
      const r = await fetch(`${baseUrl}/api/job/${jobId}/status`)
      const j = await r.json()
      onUpdate(j)
      done = j.status==='done' || j.status==='error'
      if(!done) await new Promise(res=>setTimeout(res, 600))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-56">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width:'100%', height:'100%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none"/>
      </div>

      <div className="px-4 py-3 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button className="p-2 rounded bg-blue-600 text-white"><Play size={18}/></button>
          <button className="p-2 rounded bg-gray-200"><Pause size={18}/></button>
          <button className="p-2 rounded bg-gray-200"><Square size={18}/></button>
          <div className="ml-4 text-sm text-gray-600">BPM</div>
          <input type="number" className="w-20 border rounded px-2 py-1" value={project.tempo} onChange={e=>setProject({...project, tempo:parseInt(e.target.value||0)})}/>
          <div className="ml-4 text-sm text-gray-600">Key</div>
          <input className="w-24 border rounded px-2 py-1" value={project.key} onChange={e=>setProject({...project, key:e.target.value})}/>
          <div className="ml-4 font-medium">{project.name}</div>
          <div className="ml-auto text-sm text-gray-500">{status}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
        <div>
          <InstrumentPanel tracks={tracks} addTrack={addTrack} removeTrack={removeTrack} toggleMute={toggleMute} toggleSolo={toggleSolo} updateCtrl={updateCtrl}/>
        </div>
        <div>
          <Timeline lyricsMap={lyricsMap} position={position} setPosition={setPosition}/>
        </div>
        <div>
          <Inspector baseUrl={baseUrl} project={project} setProject={setProject} onGenerateMelody={onGenerateMelody} onGenerateInst={onGenerateInst} onMix={onMix} onVideo={onVideo}/>
        </div>
      </div>

      <div className="py-4 border-t">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="text-sm text-gray-500">Master controls, export options</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-100 rounded flex items-center gap-1"><Download size={16}/>Export</button>
          </div>
        </div>
      </div>
    </div>
  )
}
