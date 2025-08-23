import { ChevronRight, Zap } from 'lucide-react'
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useEffect, useState } from 'react'


interface HeroSectionProps {
  setAttendanceModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setTimetableModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HeroSection({ setAttendanceModalOpen, setTimetableModalOpen }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="hero-cursor relative min-h-screen flex items-center justify-center overflow-hidden cursor-none">

      {/* Custom Cursor */}
      <div
        className="fixed w-6 h-6 bg-cyan-400 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: isHovering ? 'scale(2)' : 'scale(1)',
        }}
      />
      
      {/* Cursor Trail */}
      <div
        className="fixed w-1 h-1 bg-cyan-300 rounded-full pointer-events-none z-40 opacity-60"
        style={{
          left: mousePosition.x - 2,
          top: mousePosition.y - 2,
          transition: 'all 0.3s ease-out',
        }}
      />

      {/* Ultra Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Subtle Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 via-gray-800/30 to-slate-800/20 animate-gradient-shift"></div>
        
        {/* Mouse-Following Spotlight */}
        <div
          className="absolute w-96 h-96 bg-gradient-radial from-cyan-500/10 via-blue-500/5 to-transparent rounded-full pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />

        {/* Interactive Ripples */}
        <div
          className="absolute w-64 h-64 border border-cyan-400/20 rounded-full pointer-events-none animate-ping"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
            animationDuration: '2s',
          }}
        />
      </div>

      {/* Floating School Elements with Mouse Interaction */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Interactive Blackboards */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`blackboard-${i}`}
            className="absolute bg-slate-800 border-4 border-amber-600/60 rounded-lg shadow-2xl transition-all duration-500 ease-out"
            style={{
              width: `${60 + Math.random() * 40}px`,
              height: `${40 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px) rotate(${Math.sin(Date.now() * 0.001 + i) * 5}deg)`,
            }}
          >
            <div className="p-2 text-green-300 text-xs font-mono opacity-70">
              {['E=mc²', 'a²+b²=c²', 'f(x)=y', 'H₂O', 'DNA', 'π=3.14'][Math.floor(Math.random() * 6)]}
            </div>
          </div>
        ))}

        {/* Mouse-Reactive Academic Tools */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`tool-${i}`}
            className="absolute text-3xl opacity-30 transition-all duration-700 ease-out hover:opacity-60 hover:scale-125"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate(${(mousePosition.x - window.innerWidth / 2) * (0.01 + i * 0.002)}px, ${(mousePosition.y - window.innerHeight / 2) * (0.01 + i * 0.002)}px)`,
            }}
          >
            {['📐', '📏', '✏️', '🖊️', '📝', '📋', '🔬', '🧪', '⚗️', '🎒', '📖', '📚', '🗂️', '📊', '🖥️'][i]}
          </div>
        ))}

        {/* Cursor-Following Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full transition-all duration-1000 ease-out"
            style={{
              left: mousePosition.x + Math.sin(Date.now() * 0.001 + i) * 100,
              top: mousePosition.y + Math.cos(Date.now() * 0.001 + i) * 100,
              transform: `scale(${0.5 + Math.sin(Date.now() * 0.002 + i) * 0.5})`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto text-center relative z-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Subtle Badge */}
          <div className="animate-slideInDown">
            <Badge 
              className="mb-8 bg-slate-800/80 text-gray-300 hover:bg-slate-700/80 transform hover:scale-110 transition-all duration-500 shadow-2xl border border-slate-600 px-6 py-2 text-lg relative overflow-hidden group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -skew-x-12 group-hover:animate-shimmer"></div>
              <Zap className="w-5 h-5 mr-2 animate-electric" />
              Powered by a Serverless Architecture
            </Badge>
          </div>

          {/* Elegant Main Heading */}
          <div className="animate-slideInUp animation-delay-300">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none tracking-tight">
              <span className="inline-block text-gray-100 hover:text-cyan-300 transition-all duration-1000 cursor-default">
                SMART
              </span>
              <br />
              <span className="inline-block text-gray-200 hover:text-slate-300 transition-all duration-1000 cursor-default">
                ACADEMIC
              </span>
              <br />
              <span className="inline-block text-gray-300 hover:text-gray-100 transition-all duration-1000 cursor-default">
                SYSTEM
              </span>
            </h1>
          </div>

          {/* Subtle Subheading */}
          <div className="animate-slideInUp animation-delay-600">
            <p className="text-2xl md:text-3xl text-gray-400 mb-4 font-light tracking-wide">
              <span className="text-cyan-400 font-medium">Scheduling Engine</span> & 
              <span className="text-slate-300 font-medium"> Automated Attendance</span>
            </p>
          </div>

          {/* Clean Description */}
          <div className="animate-slideInUp animation-delay-900">
            <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              Leveraging <span className="text-gray-300 font-medium">genetic algorithms</span> and 
              <span className="text-gray-300 font-medium"> real-time data streams</span> to build a 
              <span className="text-gray-300 font-medium"> fault-tolerant academic operating system</span>.
              <br />
              <span className="text-gray-200 font-semibold text-2xl">
                Eliminate conflicts. Automate workflows. Unlock predictive insights.
              </span>
            </p>
          </div>

          {/* Interactive Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slideInUp animation-delay-1200">
            <Button
              size="lg"
              className="relative bg-slate-800 hover:bg-slate-700 text-white text-xl px-12 py-6 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/20 border border-slate-600 hover:border-cyan-400/50 overflow-hidden group font-bold tracking-wide"
              onClick={() => setTimetableModalOpen(true)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 -skew-x-12 group-hover:animate-sweep"></div>
              <span className="relative z-10">REQUEST DEMO</span>
              <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300 relative z-10" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="relative text-xl px-12 py-6 border-2 border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-slate-500/20 bg-transparent hover:bg-slate-800/50 overflow-hidden group font-bold tracking-wide"
              onClick={() => setAttendanceModalOpen(true)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-400/10 to-transparent animate-electric-sweep opacity-0 group-hover:opacity-100"></div>
              <span className="relative z-10">VIEW ARCHITECTURE</span>
            </Button>
          </div>

          {/* Minimalist Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-slideInUp animation-delay-1500">
            {[
              { emoji: '⚡', label: 'RESPONSE TIME', value: '<50ms', color: 'hover:bg-slate-800/50' },
              { emoji: '🎯', label: 'UPTIME', value: '99.9%', color: 'hover:bg-slate-800/50' },
              { emoji: '👥', label: 'STUDENTS', value: '10K+', color: 'hover:bg-slate-800/50' },
              { emoji: '🏫', label: 'INSTITUTIONS', value: '500+', color: 'hover:bg-slate-800/50' },
            ].map((stat, index) => (
              <div
                key={index}
                className={`relative bg-slate-900/50 ${stat.color} border border-slate-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer group overflow-hidden backdrop-blur-sm`}
                style={{ animationDelay: `${1.7 + index * 0.2}s` }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/5 to-cyan-500/0 -skew-x-12 group-hover:animate-card-shine"></div>
                
                <div className="relative z-10">
                  <div className="text-3xl mb-3 group-hover:animate-bounce group-hover:scale-110 transition-all duration-300">
                    {stat.emoji}
                  </div>
                  <div className="text-xl font-bold mb-1 tracking-wider text-gray-200">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium opacity-70 tracking-wide text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS with Cursor Effects */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-100px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(100px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes electric {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(3deg) scale(1.05); }
          75% { transform: rotate(-3deg) scale(0.95); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes sweep {
          0% { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%) skewX(-12deg); opacity: 0; }
        }

        @keyframes electric-sweep {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes card-shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .animate-gradient-shift { animation: gradient-shift 12s ease infinite; background-size: 400% 400%; }
        .animate-slideInDown { animation: slideInDown 1s ease-out forwards; }
        .animate-slideInUp { animation: slideInUp 1s ease-out forwards; }
        .animate-electric { animation: electric 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 1s ease-out; }
        .animate-sweep { animation: sweep 1.2s ease-out; }
        .animate-electric-sweep { animation: electric-sweep 3s ease-in-out infinite; }
        .animate-card-shine { animation: card-shine 1s ease-out; }

        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-900 { animation-delay: 0.9s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1500 { animation-delay: 1.5s; }

        /* new - only hide cursor inside the hero section */
.hero-cursor, .hero-cursor * {
  cursor: none !important;
}

        }
      `}</style>
    </section>
  )
}