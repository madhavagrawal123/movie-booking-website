import React from "react";

function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-black via-zinc-900 to-red-900 border-b border-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold text-red-500">
            Theatre Owner Dashboard
          </h1>

          <p className="text-gray-300 mt-2">
            Manage your theatres, screens and movie shows.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto p-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-zinc-900 border border-red-600 rounded-xl p-6 hover:shadow-red-500/30 hover:shadow-lg transition">
            <h2 className="text-gray-400 text-lg">
              My Theatres
            </h2>

            <p className="text-5xl font-bold text-red-500 mt-4">
              0
            </p>
          </div>

          <div className="bg-zinc-900 border border-red-600 rounded-xl p-6 hover:shadow-red-500/30 hover:shadow-lg transition">
            <h2 className="text-gray-400 text-lg">
              Screens
            </h2>

            <p className="text-5xl font-bold text-red-500 mt-4">
              0
            </p>
          </div>

          <div className="bg-zinc-900 border border-red-600 rounded-xl p-6 hover:shadow-red-500/30 hover:shadow-lg transition">
            <h2 className="text-gray-400 text-lg">
              Shows
            </h2>

            <p className="text-5xl font-bold text-red-500 mt-4">
              0
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default OwnerDashboard;