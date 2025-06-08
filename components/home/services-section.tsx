import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ServicesSection() {
  const services = [
    { name: "Regular Cleaning", price: "From £15/hour", popular: false },
    { name: "Deep Cleaning", price: "From £25/hour", popular: true },
    { name: "End of Tenancy", price: "From £200", popular: false },
    { name: "Office Cleaning", price: "Custom Quote", popular: false },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600">
            Professional cleaning solutions for every need
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`relative border-0 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                service.popular
                  ? "ring-2 ring-green-500 shadow-xl"
                  : "shadow-lg hover:shadow-xl"
              }`}
            >
              {service.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription className="text-2xl font-bold text-green-600">
                  {service.price}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
