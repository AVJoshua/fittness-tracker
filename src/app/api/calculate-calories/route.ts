import { NextResponse } from 'next/server';

// MET (Metabolic Equivalent of Task) values for different exercises
const MET_VALUES: { [key: string]: number } = {
  running: 9.8,      // Running (8 mph)
  jogging: 7.0,      // Jogging (5 mph)
  walking: 3.5,      // Walking (3.5 mph)
  swimming: 8.0,     // Swimming laps
  cycling: 7.5,      // Cycling (12-14 mph)
  'weight training': 3.5,  // Weight training
  yoga: 2.5,         // Yoga
  dancing: 4.8,      // Dancing
  hiking: 5.3,       // Hiking
  'jumping rope': 12.3,    // Jumping rope
  'basketball': 6.5,       // Basketball
  'soccer': 7.0,          // Soccer
  'tennis': 7.3,          // Tennis
  default: 5.0,      // Default value for unknown exercises
};

// Average weight in kg (using 70kg or ~154 lbs as default)
const DEFAULT_WEIGHT = 70;

export async function POST(request: Request) {
  try {
    const { workout, duration } = await request.json();

    if (!workout || !duration) {
      return NextResponse.json(
        { error: 'Workout and duration are required' },
        { status: 400 }
      );
    }

    // Clean the workout input (lowercase and trim)
    const cleanWorkout = workout.toLowerCase().trim();

    // Get MET value for the workout (use default if not found)
    const met = MET_VALUES[cleanWorkout] || MET_VALUES.default;

    // Calculate calories burned using the formula:
    // Calories = MET × Weight (kg) × Time (hours)
    const timeInHours = Number(duration) / 60;
    const caloriesBurned = Math.round(met * DEFAULT_WEIGHT * timeInHours);

    return NextResponse.json({ 
      calories: caloriesBurned,
      details: {
        workout: cleanWorkout,
        duration: Number(duration),
        met: met
      }
    });
  } catch (error) {
    console.error('Error in calculate-calories:', error);
    return NextResponse.json(
      { error: 'Failed to calculate calories' },
      { status: 500 }
    );
  }
} 