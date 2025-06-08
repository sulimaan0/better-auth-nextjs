import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Clock, Star } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Vetted Professionals",
      description:
        "All cleaners are background-checked, insured, and highly rated by customers",
      icon: Shield,
      color: "green",
    },
    {
      title: "Flexible Scheduling",
      description:
        "Book same-day or schedule weeks in advance. Choose times that work for you",
      icon: Clock,
      color: "blue",
    },
    {
      title: "Satisfaction Guaranteed",
      description:
        "Not happy? We'll send someone back within 24 hours at no extra cost",
      icon: Star,
      color: "green",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CleanPro?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We make booking professional cleaning services simple, reliable, and
            affordable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <CardHeader>
                <div
                  className={`h-12 w-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 shadow-md`}
                >
                  <feature.icon
                    className={`h-6 w-6 text-${feature.color}-600`}
                  />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
