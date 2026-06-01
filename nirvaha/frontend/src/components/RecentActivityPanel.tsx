import { Waves, Heart, Music, BookOpen, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: "meditation" | "sound" | "guidance" | "reflection";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "meditation",
    title: "Morning Meditation",
    description: "Completed a 10-minute breathing meditation session",
    timestamp: "2 hours ago",
    icon: <Waves className="w-5 h-5 text-gray-500" />,
  },
  {
    id: "2",
    type: "sound",
    title: "Sound Healing Session",
    description: "Enjoyed a 15-minute chakra balancing session",
    timestamp: "Yesterday",
    icon: <Music className="w-5 h-5 text-gray-500" />,
  },
  {
    id: "3",
    type: "guidance",
    title: "AI Guidance",
    description: "Received personalized wellness recommendation",
    timestamp: "3 days ago",
    icon: <Heart className="w-5 h-5 text-lime-500" />,
  },
  {
    id: "4",
    type: "reflection",
    title: "Daily Reflection",
    description: "Completed your wellness check-in",
    timestamp: "1 week ago",
    icon: <BookOpen className="w-5 h-5 text-gray-400" />,
  },
];

export function RecentActivityPanel() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-gray-50 to-white">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/50 rounded-full border border-gray-300/30">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Your Wellness Journey</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Your Recent Activity
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed">
              Track your wellness journey with NIRVAHA. Every meditation, sound healing 
              session, and moment of reflection brings you closer to inner peace and balance.
            </p>

            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-4 font-medium">
                Keep going on your path! Your consistency creates lasting transformation.
              </p>
            </div>
          </div>

          {/* Recent Activity Panel */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden p-8">
              {/* Panel Header */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Recent Activities</h3>
                <p className="text-sm text-gray-600 mt-1">Your last 4 wellness moments</p>
              </div>

              {/* Activity List */}
              {mockActivities.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {mockActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-50 border border-gray-100/50 transition-all hover:bg-gray-100/30"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {activity.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {(activity.type === "meditation" || activity.type === "guidance") ? (
                          <div className="animated-gradient-text with-border mb-1"
                            style={{
                              background: activity.type === "meditation"
                                ? "linear-gradient(135deg, #a78bfa, #818cf8, #38bdf8)"
                                : "linear-gradient(135deg, #f472b6, #fb923c, #facc15)",
                              margin: 0,
                            }}
                          >
                            <div className="gradient-overlay" />
                            <span
                              className="text-content text-sm font-semibold"
                              style={{
                                backgroundImage: activity.type === "meditation"
                                  ? "linear-gradient(135deg, #a78bfa, #818cf8, #38bdf8)"
                                  : "linear-gradient(135deg, #f472b6, #fb923c, #facc15)",
                              }}
                            >
                              {activity.title}
                            </span>
                          </div>
                        ) : (
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {activity.title}
                          </h4>
                        )}
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Waves className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Your journey begins here</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Start your first practice to see activities here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
