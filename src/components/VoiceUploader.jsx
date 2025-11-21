import React, { useMemo, useState } from 'react'

export default function VoiceUploader({baseUrl}){
  const [files, setFiles] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('Custom Voice')
  const [locale, setLocale] = useState('bn')
  const [gender, setGender] = useState('female')
  const [error, setError] = useState('')
  const [voiceProfileId, setVoiceProfileId] = useState('')

  async function clientCheck(file){
    // Quick client-side checks: type, size, name, extension
    const okType = file.type === 'audio/wav' || file.name.toLowerCase().endsWith('.wav')
    const sizeOk = file.size <= 10*1024*1024
    return { name: file.name, size: file.size, okType, sizeOk }
  }

  async function onSelect(e){
    const list = Array.from(e.target.files || [])
    const checks = await Promise.all(list.map(clientCheck))
    setFiles(checks)
  }

  async function onUpload(){
    setError('')
    setLoading(true)
    try{
      const input = document.getElementById('voice-files')
      if(!input || !input.files || input.files.length===0){ setError('Please select WAV files first.'); setLoading(false); return }
      const fd = new FormData()
      Array.from(input.files).forEach(f=> fd.append('files', f))
      fd.append('name', name)
      fd.append('locale', locale)
      fd.append('gender', gender)
      const res = await fetch(`${baseUrl}/api/upload/voice`, { method:'POST', body: fd })
      if(!res.ok){ throw new Error(`Upload failed: ${res.status}`) }
      const data = await res.json()
      setReport(data.quality)
      setVoiceProfileId(data.voiceProfileId)
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="text-sm text-gray-600 mb-2">Voice Management</div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input className="border rounded px-2 py-1" value={name} onChange={e=>setName(e.target.value)} placeholder="Voice name"/>
        <select className="border rounded px-2 py-1" value={locale} onChange={e=>setLocale(e.target.value)}>
          <option value="bn">Bengali</option>
          <option value="hi">Hindi</option>
          <option value="en">English</option>
        </select>
        <select className="border rounded px-2 py-1" value={gender} onChange={e=>setGender(e.target.value)}>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <div className="text-xs text-gray-500 self-center">WAV, mono, 16–48kHz, &lt; 10MB/clip</div>
      </div>
      <input id="voice-files" type="file" accept="audio/wav" multiple onChange={onSelect} className="mb-2"/>
      {files.length>0 && (
        <div className="mb-2 max-h-24 overflow-auto border rounded p-2 bg-gray-50 text-xs">
          {files.map((f,i)=> (
            <div key={i} className="flex justify-between">
              <div>{f.name}</div>
              <div className={`${f.okType && f.sizeOk? 'text-green-600':'text-red-600'}`}>{(f.size/1024/1024).toFixed(2)} MB</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={onUpload} disabled={loading} className="px-3 py-1 bg-purple-600 text-white rounded disabled:opacity-50">{loading? 'Uploading...':'Upload & Analyze'}</button>
      {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
      {report && (
        <div className="mt-3 text-xs">
          <div className={`font-medium ${report.quality_ok? 'text-green-700':'text-yellow-700'}`}>Quality {report.quality_ok? 'OK':'Issues found'}</div>
          <ul className="list-disc pl-4 max-h-28 overflow-auto">
            {report.clips.map((c,idx)=> (
              <li key={idx}>
                {c.file.split('/').pop()} — {c.mono_ok? 'mono':'stereo'} — {c.sample_rate} Hz — {c.duration_sec}s
              </li>
            ))}
          </ul>
          {voiceProfileId && <div className="mt-2">Voice Profile ID: <span className="font-mono">{voiceProfileId}</span></div>}
        </div>
      )}
    </div>
  )
}
