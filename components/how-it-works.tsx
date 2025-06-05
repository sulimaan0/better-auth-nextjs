import { Calendar, Home, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Calendar,
      title: "Choose Your Service",
      description:
        "Select from standard cleaning, deep clean, or specialized services. Customize with add-ons.",
      color: "from-violet-500 to-violet-600",
    },
    {
      icon: Home,
      title: "Book Your Slot",
      description:
        "Pick your preferred date and time. Flexible scheduling with same-day availability.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Sparkles,
      title: "Relax & Enjoy",
      description:
        "Our vetted professionals arrive on time and leave your space spotless. Guaranteed satisfaction.",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            How Scrubly Works
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Getting your home professionally cleaned has never been easier.
            Three simple steps to a spotless space.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div
                  className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-700 rounded-full shadow-md flex items-center justify-center text-sm font-bold text-white border-2 border-slate-600">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
