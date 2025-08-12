// import { Badge } from "../components/ui/badge"

export function TechStackSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Engineered with a Modern Tech Stack</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built on a foundation of robust and scalable technologies for enterprise-grade performance.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-center">
            {[
              { name: "React", color: "bg-blue-500" },
              { name: "Node.js", color: "bg-green-600" },
              { name: "MongoDb", color: "bg-blue-700" },
              { name: "TailwindCSS", color: "bg-cyan-500" },
              { name: "Vercel", color: "bg-black" },
            ].map((tech) => (
              <div key={tech.name} className="flex flex-col items-center space-y-2 group">
                <div className={`w-12 h-12 ${tech.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <span className="text-white font-bold text-sm">
                    {tech.name.charAt(0)}
                  </span>
                </div>
                <span className="font-medium text-gray-700 text-sm text-center">{tech.name}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
              <p className="text-sm text-gray-600">React 18 with Next.js App Router, TypeScript, and Tailwind CSS for a modern, responsive UI</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
              <p className="text-sm text-gray-600">Node.js with serverless functions, PostgreSQL with real-time subscriptions, and Redis caching</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Infrastructure</h3>
              <p className="text-sm text-gray-600">Vercel edge network, Docker containers, and automated CI/CD pipelines for scalable deployment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
