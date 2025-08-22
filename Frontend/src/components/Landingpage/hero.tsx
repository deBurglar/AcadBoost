import { ChevronRight, Zap } from 'lucide-react'
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

interface HeroSectionProps {
  setAttendanceModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setTimetableModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HeroSection({ setAttendanceModalOpen, setTimetableModalOpen }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ultra Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/40 to-indigo-900/30 animate-gradient-shift"></div>
        
        {/* Darker Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-cyan-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-6000"></div>
        </div>
      </div>

      {/* Floating School Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Mini Blackboards */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`blackboard-${i}`}
            className="absolute bg-slate-800 border-4 border-amber-600 rounded-lg shadow-2xl animate-float-school"
            style={{
              width: `${60 + Math.random() * 40}px`,
              height: `${40 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            {/* Chalk writing on blackboard */}
            <div className="p-2 text-green-300 text-xs font-mono opacity-80">
              {['E=mc²', 'a²+b²=c²', 'f(x)=y', 'H₂O', 'DNA', 'π=3.14'][Math.floor(Math.random() * 6)]}
            </div>
          </div>
        ))}

        {/* School Signs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`sign-${i}`}
            className="absolute bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg shadow-xl border-2 border-amber-500 animate-sway-sign"
            style={{
              width: `${80 + Math.random() * 60}px`,
              height: `${30 + Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 3}s`,
            }}
          >
            <div className="p-2 text-white text-xs font-bold text-center">
              {['LIBRARY', 'LAB', 'OFFICE', 'HALL', 'EXAM', 'CLASS'][Math.floor(Math.random() * 6)]}
            </div>
          </div>
        ))}

        {/* Floating Academic Tools */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`tool-${i}`}
            className="absolute text-4xl opacity-20 animate-drift-tools"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
            }}
          >
            {['📐', '📏', '✏️', '🖊️', '📝', '📋', '🔬', '🧪', '⚗️', '🎒', '📖', '📚', '🗂️', '📊', '🖥️'][i]}
          </div>
        ))}

        {/* School Building Silhouettes */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`building-${i}`}
            className="absolute bottom-0 opacity-10 animate-building-glow"
            style={{
              left: `${i * 25}%`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <svg width="120" height="200" viewBox="0 0 120 200" className="fill-cyan-400">
              <rect x="10" y="50" width="100" height="150" />
              <rect x="20" y="60" width="15" height="20" className="fill-yellow-300 opacity-60" />
              <rect x="40" y="60" width="15" height="20" className="fill-yellow-300 opacity-60" />
              <rect x="65" y="60" width="15" height="20" className="fill-yellow-300 opacity-60" />
              <rect x="85" y="60" width="15" height="20" className="fill-yellow-300 opacity-60" />
              <rect x="20" y="90" width="15" height="20" className="fill-yellow-300 opacity-40" />
              <rect x="40" y="90" width="15" height="20" className="fill-yellow-300 opacity-40" />
              <rect x="65" y="90" width="15" height="20" className="fill-yellow-300 opacity-40" />
              <rect x="85" y="90" width="15" height="20" className="fill-yellow-300 opacity-40" />
              <polygon points="5,50 60,10 115,50" className="fill-red-600 opacity-80" />
            </svg>
          </div>
        ))}

        {/* Chalk Dust Particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute w-1 h-1 bg-gray-300 rounded-full opacity-30 animate-chalk-dust"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Academic Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-16 grid-rows-12 h-full w-full">
          {[...Array(192)].map((_, i) => (
            <div
              key={`grid-${i}`}
              className="border border-cyan-400/20 animate-pulse"
              style={{
                animationDelay: `${(i * 0.05) % 4}s`,
                animationDuration: `${3 + (i % 2)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto text-center relative z-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Glowing Badge */}
          <div className="animate-slideInDown">
            <Badge className="mb-8 bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:from-cyan-500 hover:to-blue-600 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50 border-0 px-6 py-2 text-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer"></div>
              <Zap className="w-5 h-5 mr-2 animate-electric" />
              Powered by a Serverless Architecture
            </Badge>
          </div>

          {/* Dominating Main Heading */}
          <div className="animate-slideInUp animation-delay-300">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none tracking-tight">
              <span className="inline-block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-text-glow hover:from-purple-300 hover:via-pink-400 hover:to-red-400 transition-all duration-1000 cursor-default">
                HYPER
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-text-glow-delayed hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-1000 cursor-default">
                ACADEMIC
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent animate-text-pulse hover:from-green-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-1000 cursor-default">
                DOMINANCE
              </span>
            </h1>
          </div>

          {/* Subheading with Neon Effect */}
          <div className="animate-slideInUp animation-delay-600">
            <p className="text-2xl md:text-3xl text-gray-200 mb-4 font-light tracking-wide">
              <span className="text-cyan-300 font-semibold animate-neon-pulse">Scheduling Engine</span> & 
              <span className="text-pink-300 font-semibold animate-neon-pulse animation-delay-1000"> Automated Attendance</span>
            </p>
          </div>

          {/* Epic Description */}
          <div className="animate-slideInUp animation-delay-900">
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              Leveraging <span className="text-purple-300 font-semibold">genetic algorithms</span> and 
              <span className="text-cyan-300 font-semibold"> real-time data streams</span> to build a 
              <span className="text-pink-300 font-semibold"> fault-tolerant academic operating system</span>.
              <br />
              <span className="text-yellow-300 font-bold text-2xl animate-pulse">
                Eliminate conflicts. Automate workflows. Unlock predictive insights.
              </span>
            </p>
          </div>

          {/* Ultra-Sexy Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slideInUp animation-delay-1200">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-800 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white text-xl px-12 py-6 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50 border-0 overflow-hidden group font-bold tracking-wide"
              onClick={() => setTimetableModalOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 -skew-x-12 group-hover:animate-sweep"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/50 to-purple-600/50 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">REQUEST DEMO</span>
              <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300 relative z-10" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="relative text-xl px-12 py-6 border-2 border-cyan-300 text-cyan-300 hover:text-white hover:border-pink-300 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-pink-500/50 bg-transparent hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-700 overflow-hidden group font-bold tracking-wide"
              onClick={() => setAttendanceModalOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent animate-electric-sweep opacity-0 group-hover:opacity-100"></div>
              <span className="relative z-10">VIEW ARCHITECTURE</span>
            </Button>
          </div>

          {/* Floating Power Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-slideInUp animation-delay-1500">
            {[
              { emoji: '⚡', label: 'LIGHTNING FAST', value: '<50ms', color: 'from-yellow-500 to-orange-700' },
              { emoji: '🚀', label: 'ROCKET POWERED', value: '99.9%', color: 'from-blue-500 to-purple-700' },
              { emoji: '🔥', label: 'BLAZING HOT', value: '10K+', color: 'from-red-500 to-pink-700' },
              { emoji: '💎', label: 'DIAMOND TIER', value: '500+', color: 'from-cyan-500 to-blue-700' },
            ].map((stat, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${stat.color} rounded-3xl p-6 text-white shadow-2xl hover:shadow-xl transform hover:scale-110 hover:rotate-3 transition-all duration-500 cursor-pointer group overflow-hidden`}
                style={{ animationDelay: `${1.7 + index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 group-hover:animate-card-shine"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-3 group-hover:animate-bounce group-hover:scale-125 transition-all duration-300">
                    {stat.emoji}
                  </div>
                  <div className="text-2xl font-black mb-1 tracking-wider">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold opacity-90 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Ultra-Sexy CSS with School Animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float-school {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-15px) translateX(5px) rotate(2deg); }
          50% { transform: translateY(-8px) translateX(-8px) rotate(-1deg); }
          75% { transform: translateY(-20px) translateX(3px) rotate(1deg); }
        }

        @keyframes sway-sign {
          0%, 100% { transform: rotate(0deg) translateY(0px); }
          25% { transform: rotate(2deg) translateY(-5px); }
          50% { transform: rotate(0deg) translateY(-10px); }
          75% { transform: rotate(-2deg) translateY(-5px); }
        }

        @keyframes drift-tools {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-30px) translateX(20px) rotate(90deg); opacity: 0.3; }
          50% { transform: translateY(-60px) translateX(-10px) rotate(180deg); opacity: 0.2; }
          75% { transform: translateY(-40px) translateX(15px) rotate(270deg); opacity: 0.3; }
          100% { transform: translateY(-80px) translateX(0px) rotate(360deg); opacity: 0.1; }
        }

        @keyframes building-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.3)); }
          50% { filter: drop-shadow(0 0 30px rgba(34, 211, 238, 0.6)); }
        }

        @keyframes chalk-dust {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          100% { transform: translateY(-40px) translateX(-5px); opacity: 0; }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-100px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(100px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes text-glow {
          0%, 100% { filter: drop-shadow(0 0 20px currentColor); }
          50% { filter: drop-shadow(0 0 40px currentColor) drop-shadow(0 0 60px currentColor); }
        }

        @keyframes text-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes neon-pulse {
          0%, 100% { text-shadow: 0 0 10px currentColor, 0 0 20px currentColor; }
          50% { text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor; }
        }

        @keyframes electric {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(5deg) scale(1.1); }
          75% { transform: rotate(-5deg) scale(0.9); }
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

        .animate-gradient-shift { animation: gradient-shift 8s ease infinite; background-size: 400% 400%; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float-school { animation: float-school 8s ease-in-out infinite; }
        .animate-sway-sign { animation: sway-sign 6s ease-in-out infinite; }
        .animate-drift-tools { animation: drift-tools 12s linear infinite; }
        .animate-building-glow { animation: building-glow 4s ease-in-out infinite; }
        .animate-chalk-dust { animation: chalk-dust 6s ease-out infinite; }
        .animate-slideInDown { animation: slideInDown 1s ease-out forwards; }
        .animate-slideInUp { animation: slideInUp 1s ease-out forwards; }
        .animate-text-glow { animation: text-glow 3s ease-in-out infinite; }
        .animate-text-glow-delayed { animation: text-glow 3s ease-in-out infinite 1s; }
        .animate-text-pulse { animation: text-pulse 2s ease-in-out infinite; }
        .animate-neon-pulse { animation: neon-pulse 2s ease-in-out infinite; }
        .animate-electric { animation: electric 0.5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 0.8s ease-out; }
        .animate-sweep { animation: sweep 1s ease-out; }
        .animate-electric-sweep { animation: electric-sweep 2s ease-in-out infinite; }
        .animate-card-shine { animation: card-shine 1s ease-out; }

        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-900 { animation-delay: 0.9s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
      `}</style>
    </section>
  )
}