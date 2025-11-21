import React from 'react'
import { Music } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import Studio from './components/Studio'

export default function App(){
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="h-[300px]">
          <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width:'100%', height:'100%' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/70 to-transparent pointer-events-none"/>
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 shadow backdrop-blur mb-3"><Music/></div>
            <h1 className="text-4xl font-semibold tracking-tight">AI Song Generator</h1>
            <p className="text-slate-400 mt-2">Dark, Suno-style studio with tempo-aware generation.</p>
          </div>
        </div>
      </header>
      <main>
        <Studio/>
      </main>
      <footer className="py-10 text-center text-xs text-slate-500">By Blue Flame • Mock mode demo</footer>
    </div>
  )
}
