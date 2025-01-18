import {
  CheckCircle,
  ClipboardList,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const Starter = () => {
  const steps = [
    {
      icon: <User className="w-6 h-6 text-blue-600" />,
      title: "Create Your Profile",
      description:
        "Set up your profile to personalize your experience and ensure secure access.",
    },
    {
      icon: <Package className="w-6 h-6 text-green-600" />,
      title: "Add Your Inventory",
      description:
        "Add products to your inventory with detailed information like stock, price, and more.",
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-yellow-600" />,
      title: "Place Your Orders",
      description: "Create and manage sales or purchase orders effortlessly.",
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-purple-600" />,
      title: "Track Orders",
      description:
        "Monitor the status of orders, from processing to completion.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-red-600" />,
      title: "Analyze Your Data",
      description:
        "Use analytics to gain insights into your inventory and order trends.",
    },
  ];

  return (
    <div className="bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60 min-h-screen">
      <section className="border-b pb-6">
        <header className="space-y-4 text-center px-6">
          <h1 className="text-3xl font-semibold text-neutral-800">
            Welcome to Medic Inventory
          </h1>
          <p className="text-lg text-gray-500">
            Get started with our complete online inventory management solution.
            Follow the steps below to set up and start managing your stocks
            effectively.
          </p>
        </header>
      </section>

      <section className="mt-8 px-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-3 bg-gray-100 rounded-full">{step.icon}</div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <Link
          to={"/admin/settings/orgprofile"}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          Start Now
        </Link>
      </section>
    </div>
  );
};

export default Starter;
