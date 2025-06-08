'use client';

import { useState } from 'react';
import Background from '@/components/Background3D';

interface CalculationDetails {
  workout: string;
  duration: number;
  met: number;
}

export default function Home() {
  const [workout, setWorkout] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState<number | null>(null);
  const [details, setDetails] = useState<CalculationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calculate-calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workout, duration }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate calories');
      }

      const data = await response.json();
      setCalories(data.calories);
      setDetails(data.details);
    } catch (err) {
      setError('Failed to calculate calories. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background />
      <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Fitness Tracker</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="workout" className="block text-sm font-medium mb-1 text-gray-700">
                What workout did you do?
              </label>
              <input
                type="text"
                id="workout"
                value={workout}
                onChange={(e) => setWorkout(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Running, Swimming, Weight Training"
                required
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-1 text-gray-700">
                How long did you work out? (minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm"
                placeholder="30"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                loading 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
              }`}
            >
              {loading ? 'Calculating...' : 'Calculate Calories'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100/90 backdrop-blur-sm text-red-700 rounded-md">
              {error}
            </div>
          )}

          {calories !== null && !error && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-100/90 backdrop-blur-sm rounded-md">
                <p className="text-center text-lg text-green-800">
                  You burned approximately <span className="font-bold">{calories}</span> calories!
                </p>
              </div>
              
              {details && (
                <div className="p-4 bg-purple-50/90 backdrop-blur-sm rounded-md space-y-2 border border-purple-200">
                  <h2 className="font-semibold text-purple-800">Calculation Details:</h2>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Workout Type: <span className="font-medium capitalize">{details.workout}</span></li>
                    <li>• Duration: <span className="font-medium">{details.duration} minutes</span></li>
                    <li>• Intensity Level (MET): <span className="font-medium">{details.met}</span></li>
                    <li className="text-xs text-purple-600 mt-2 italic">
                      * Calculations are based on an average adult weight of 70kg (154 lbs)
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
} 