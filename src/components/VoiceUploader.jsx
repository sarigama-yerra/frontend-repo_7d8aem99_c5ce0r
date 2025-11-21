import React, { useState } from 'react'

export default function VoiceUploader({baseUrl}){
  const [files, setFiles] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('Custom Voice')
  const [locale, setLocale] = useState('bn')
  const [gender, setGender] = useState('female')
  const [error, setError] = useState('')
  const [voiceProfileId, setVoiceProfileId] = useState('')
  const [consent, setConsent] = useState(false)

  function onSelect(e){
    const list = Array.from(e.target.files || [])
    setFiles(list)
  }

  async function onUpload(){
    setError('')
    if(!consent){ setError('Please confirm consent to use your voice for synthesis.'); return }
    setLoading(true)
    try{
      if(files.length===0){ setError('Select 1–30 clips (.wav, .mp3, .amr, each <10MB).'); setLoading(false); return }
      const fd = new FormData()
      files.forEach(f=> fd.append('files', f))
      fd.append('name', name)
      fd.append('locale', locale)
      fd.append('gender', gender)
      const res = await fetch(`${baseUrl}/api/upload/voice`, { method:'POST', body: fd })
      if(!res.ok){
        const txt = await res.text()
        throw new Error(txt || `Upload failed: ${res.status}`)
      }
      const data = await res.json()
      setReport(data.qualityReport)
      setVoiceProfileId(data.voiceProfileId)
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#0e0e14] p-3 text-slate-200">
      <div className="text-sm text-slate-400 mb-2">Voice Management</div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input className="bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" value={name} onChange={e=>setName(e.target.value)} placeholder="Voice name"/>
        <select className="bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" value={locale} onChange={e=>setLocale(e.target.value)}>
          <option value="bn">Bengali</option>
          <option value="hi">Hindi</option>
          <option value="en">English</option>
        </select>
        <select className="bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-200" value={gender} onChange={e=>setGender(e.target.value)}>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <div className="text-xs text-slate-500 self-center">WAV/MP3/AMR, mono, 16–48kHz, &lt;10MB/clip</div>
      </div>
      <input id="voice-files" type="file" accept=".wav,.mp3,.amr" multiple onChange={onSelect} className="mb-2"/>

      <label className="flex items-center gap-2 text-xs text-slate-400 mb-2">
        <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="accent-violet-500"/>
        I consent to use these clips to adapt a voice for synthesis.
      </label>

      {files.length>0 && (
        <div className="mb-2 max-h-24 overflow-auto border border-white/10 rounded p-2 bg-black/30 text-xs">
          {files.map((f,i)=> (
            <div key={i} className="flex justify-between">
              <div className="truncate pr-2">{f.name}</div>
              <div className="text-slate-400">{(f.size/1024/1024).toFixed(2)} MB</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={onUpload} disabled={loading} className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded disabled:opacity-50">{loading? 'Uploading...':'Upload & Analyze'}</button>
      {error && <div className="text-xs text-rose-400 mt-2">{error}</div>}
      {report && (
        <div className="mt-3 text-xs">
          <div className={`font-medium ${report.quality_ok? 'text-emerald-400':'text-yellow-300'}`}>Quality {report.quality_ok? 'OK':'Issues found'}</div>
          <ul className="list-disc pl-4 max-h-28 overflow-auto">
            {report.clips.map((c,idx)=> (
              <li key={idx}>
                {c.file.split('/').pop()} — {c.mono_ok? 'mono':'stereo'} — {c.sample_rate || '?'} Hz — {c.duration_sec || '?'}s
              </li>
            ))}
          </ul>
          {voiceProfileId && <div className="mt-2">Voice Profile ID: <span className="font-mono">{voiceProfileId}</span></div>}
        </div>
      )}
    </div>
  )
}
