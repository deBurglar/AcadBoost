import { ChevronRight, Zap } from 'lucide-react'
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

interface HeroSectionProps {
  setAttendanceModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setTimetableModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HeroSection({ setAttendanceModalOpen, setTimetableModalOpen }: HeroSectionProps) {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Academic Icons */}
        {['📚', '🎓', '📝', '🏫', '⏰', '📊', '👨‍🏫', '🔬'].map((emoji, index) => (
          <div
            key={index}
            className="absolute text-4xl opacity-10 animate-float"
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${20 + (index % 3) * 25}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            {emoji}
          </div>
        ))}

        {/* Geometric Shapes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className={`absolute w-${4 + (i % 3) * 2} h-${4 + (i % 3) * 2} border-2 border-blue-200 opacity-20 animate-spin`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              borderRadius: i % 2 === 0 ? '50%' : '0%',
            }}
          />
        ))}

        {/* Particle System */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Animated Badge */}
          <div className="animate-slideInDown">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Zap className="w-4 h-4 mr-1 animate-pulse" />
              Powered by a Serverless Architecture
            </Badge>
          </div>

          {/* Main Heading with Staggered Animation */}
          <div className="animate-slideInUp">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="inline-block animate-fadeInLeft">Hyper-Efficient</span>{' '}
              <span className="inline-block animate-fadeInLeft animation-delay-200">Scheduling</span>{' '}
              <span className="inline-block animate-fadeInLeft animation-delay-400">Engine</span>{' '}
              <span className="inline-block animate-fadeInLeft animation-delay-600">&</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block animate-fadeInRight animation-delay-800 hover:from-indigo-600 hover:to-purple-600 transition-all duration-500">
                Automated Attendance
              </span>
            </h1>
          </div>

          {/* Description with Typewriter Effect */}
          <div className="animate-slideInUp animation-delay-1000">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed hover:text-gray-700 transition-colors duration-300">
              Leveraging genetic algorithms and real-time data streams to build a fault-tolerant academic operating system.
              <br />
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Eliminate conflicts, automate workflows, and unlock predictive insights.
              </span>
            </p>
          </div>

          {/* Enhanced Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideInUp animation-delay-1200">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group relative overflow-hidden"
              onClick={() => setTimetableModalOpen(true)}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-shine"></div>
              Request Demo
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group relative overflow-hidden"
              onClick={() => setAttendanceModalOpen(true)}
            >
              {/* Button pulse effect */}
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 animate-pulse"></div>
              View Architecture
            </Button>
          </div>

          {/* Academic Stats Floating Cards */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideInUp animation-delay-1400">
            {[
              { emoji: '🎯', label: '99.9% Uptime', color: 'from-green-400 to-emerald-500' },
              { emoji: '⚡', label: '<100ms Response', color: 'from-yellow-400 to-orange-500' },
              { emoji: '🚀', label: '10K+ Students', color: 'from-purple-400 to-pink-500' },
              { emoji: '🏆', label: '500+ Institutions', color: 'from-blue-400 to-indigo-500' },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg hover:shadow-2xl transform hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer group`}
                style={{ animationDelay: `${1.6 + index * 0.1}s` }}
              >
                <div className="text-2xl mb-2 group-hover:animate-bounce">{stat.emoji}</div>
                <div className="text-sm font-semibold opacity-90 group-hover:opacity-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-slideInDown {
          animation: slideInDown 0.8s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 0.6s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        .animation-delay-1400 {
          animation-delay: 1.4s;
        }
      `}</style>
    </section>
  )
}