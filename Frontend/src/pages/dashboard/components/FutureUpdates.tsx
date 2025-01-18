import { Info, Rocket, Bell, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const FutureUpdatesCard = () => {
  return (
    <div className="mx-auto p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-xl text-white">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          🚀 Upcoming Updates
        </h2>
        <Info className="w-6 h-6" />
      </div>

      {/* Highlighted Content */}
      <p className="mt-4 text-lg leading-relaxed">
        Our inventory system is evolving! Here's what you can look forward to:
      </p>

      {/* Feature Highlights */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <Rocket className="w-8 h-8 text-yellow-300" />
          <div>
            <h4 className="font-semibold text-xl">AI-Powered Forecasting</h4>
            <p className="text-sm text-blue-100">
              Use machine learning to predict stock trends and demands.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Bell className="w-8 h-8 text-green-300" />
          <div>
            <h4 className="font-semibold text-xl">Real-Time Alerts</h4>
            <p className="text-sm text-blue-100">
              Stay updated with notifications for low stock and critical levels.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-pink-300" />
          <div>
            <h4 className="font-semibold text-xl">Advanced Analytics</h4>
            <p className="text-sm text-blue-100">
              Gain insights into supplier performance and inventory trends.
            </p>
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="mt-8 flex justify-center">
        <Link
          to={"/about"}
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default FutureUpdatesCard;
