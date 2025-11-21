import React, { useMemo, useState, useRef } from 'react'
import VoiceUploader from './VoiceUploader'
import { Play, Pause } from 'lucide-react'

const PRESETS = {
  female: [
    { id: 'bn_f_soft', name: 'Bengali – Soft Female', locale: 'bn', demo: '/assets/voice_demo_f_bn.wav' },
    { id: 'hi_f_airy', name: 'Hindi – Airy Female', locale: 'hi', demo: '/assets/voice_demo_f_hi.wav' },
    { id: 'en_f_bright', name: 'English – Bright Female', locale: 'en', demo: '/assets/voice_demo_f_en.wav' },
  ],
  male: [
    { id: 'bn_m_warm', name: 'Bengali – Warm Male', locale: 'bn', demo: '/assets/voice_demo_m_bn.wav' },
    { id: 'hi_m_deep', name: 'Hindi – Deep Male', locale: 'hi', demo: '/assets/voice_demo_m_hi.wav' },
    { id: 'en_m_clear', name: 'English – Clear Male', locale: 'en', demo: '/assets/voice_demo_m_en.wav' },
  ]
}

export default function VoiceSelector({ baseUrl, onChange }){
  const [mode, setMode] = useState('female') // 'male' | 'female' | 'custom'
  const [presetId, setPresetId] = useState(PRESETS.female[0].id)
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const presets = PRESETS[mode] || []
  const selected = presets.find(p => p.id === presetId)

  function playDemo(){
    if(!selected) return
    const a = audioRef.current
    if(a){
      if(playing){ a.pause(); setPlaying(false) }
      else { a.src = selected.demo; a.play(); setPlaying(true) }
    }
  }

  function onUploaderDone(payload){
    // payload: { voiceProfileId }
    onChange && onChange({ type: 'custom', voiceProfileId: payload.voiceProfileId })
  }

  function emitPreset(){
    onChange && onChange({ type: 'preset', presetId, gender: mode, locale: selected?.locale })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {['female','male','custom'].map(m => (
          <button key={m} onClick={()=>{ setMode(m); if(m!=='custom') emitPreset() }} className={`px-3 py-1 rounded border ${mode===m? 'bg-violet-600 text-white border-violet-500':'bg-white/5 text-slate-300 border-white/10'}`}>{m[0].toUpperCase()+m.slice(1)}</button>
        ))}
      </div>
      {mode !== 'custom' ? (
        <div className="flex items-center gap-2">
          <select value={presetId} onChange={e=>{ setPresetId(e.target.value); emitPreset() }} className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200">
            {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={playDemo} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded flex items-center gap-1">{playing? <Pause size={16}/> : <Play size={16}/>} Demo</button>
          <audio ref={audioRef} onEnded={()=>setPlaying(false)} />
        </div>
      ) : (
        <VoiceUploader baseUrl={baseUrl} onComplete={onUploaderDone} />
      )}
    </div>
  )
}
