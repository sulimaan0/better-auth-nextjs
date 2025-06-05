import { Star, Quote } from "lucide-react";

export default function Reviews() {
  const reviews = [
    {
      name: "Emily Chen",
      location: "London, UK",
      rating: 5,
      text: "Scrubly has been a game-changer for our busy family. The cleaners are professional, thorough, and always punctual. I can finally enjoy my weekends!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Rodriguez",
      location: "Manchester, UK",
      rating: 5,
      text: "I was hesitant about hiring a cleaning service, but Scrubly exceeded all expectations. My flat has never looked better, and the pricing is very reasonable.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Jennifer Park",
      location: "Birmingham, UK",
      rating: 5,
      text: "The deep cleaning service was incredible! They got into every corner. The team was friendly and respectful of our home. Highly recommend!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ];

  return (
    <section
      id="reviews"
      className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust Scrubly for their
            cleaning needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="glass p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-600/30 relative group hover:scale-105"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-500 group-hover:text-violet-400 transition-colors" />

              <div className="flex items-center mb-6">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-white">{review.name}</h4>
                  <p className="text-sm text-slate-400">{review.location}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed italic">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-20 text-center">
          <p className="text-sm text-slate-400 mb-8">
            Trusted by over 10,000+ customers across the UK
          </p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-300">4.9★</div>
              <div className="text-sm text-slate-400">Google Reviews</div>
            </div>
            <div className="w-px h-12 bg-slate-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-300">A+</div>
              <div className="text-sm text-slate-400">Trustpilot Rating</div>
            </div>
            <div className="w-px h-12 bg-slate-600"></div>
            <div className="text-center">
              <div className="text-sm text-slate-300 font-medium">
                Fully Insured
              </div>
              <div className="text-sm text-slate-400">& Bonded</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
