import { Card, CardContent} from "../ui/card"

import { Star } from "lucide-react"
export function Testimonials(){
    return(
<section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Institutions</h2>
            <p className="text-lg text-gray-600">See what educators are saying about our platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Academic Director",
                institution: "Metropolitan University",
                content: "EduSchedule Pro transformed our scheduling process. What used to take weeks now takes hours, and conflicts are virtually eliminated.",
                rating: 5
              },
              {
                name: "Prof. Michael Chen",
                role: "Department Head",
                institution: "Tech Institute",
                content: "The automated attendance system has saved us countless hours and improved accuracy significantly. Highly recommended!",
                rating: 5
              },
              {
                name: "Lisa Rodriguez",
                role: "Administrative Manager",
                institution: "City College",
                content: "The analytics dashboard provides insights we never had before. It's helped us identify and address attendance issues proactively.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.institution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>)
}