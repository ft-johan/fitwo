"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { WeightChart } from "@/components/ui/chart-line";
import { BodyCompositionChart, BMIChart } from "@/components/ui/chart-raddial";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Weight, Ruler, Activity, Target, Heart, Droplets, Scale } from "lucide-react";

const supabase = createClient();

export default function Bento() {
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [waist, setWaist] = useState<number | null>(null);
  const [hip, setHip] = useState<number | null>(null);
  const [neck, setNeck] = useState<number | null>(null);
  const [activityLevel, setActivityLevel] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        // Fetch user profile (gender and date of birth)
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("gender, date_of_birth")
          .eq("user_id", session.user.id)
          .single();

        if (!profileError && profileData) {
          setGender(profileData.gender);
          setDateOfBirth(profileData.date_of_birth);
        }

        // Fetch weight
        const { data: weightData, error: weightError } = await supabase
          .from("user_measurements")
          .select("weight")
          .eq("user_id", session.user.id)
          .not("weight", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!weightError && weightData) {
          setWeight(weightData.weight);
        }

        // Fetch height
        const { data: heightData, error: heightError } = await supabase
          .from("user_measurements")
          .select("height")
          .eq("user_id", session.user.id)
          .not("height", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!heightError && heightData) {
          setHeight(heightData.height);
        }

        // Fetch waist
        const { data: waistData, error: waistError } = await supabase
          .from("user_measurements")
          .select("waist")
          .eq("user_id", session.user.id)
          .not("waist", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!waistError && waistData) {
          setWaist(waistData.waist);
        }

        // Fetch hip
        const { data: hipData, error: hipError } = await supabase
          .from("user_measurements")
          .select("hip")
          .eq("user_id", session.user.id)
          .not("hip", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!hipError && hipData) {
          setHip(hipData.hip);
        }

        // Fetch neck
        const { data: neckData, error: neckError } = await supabase
          .from("user_measurements")
          .select("neck")
          .eq("user_id", session.user.id)
          .not("neck", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!neckError && neckData) {
          setNeck(neckData.neck);
        }

        // Fetch activity level with better error handling
        const { data: activityData, error: activityError } = await supabase
          .from("user_measurements")
          .select("activity_level")
          .eq("user_id", session.user.id)
          .not("activity_level", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        console.log("Activity level fetch result:", { activityData, activityError });

        if (!activityError && activityData) {
          setActivityLevel(activityData.activity_level);
        } else {
          console.log("No activity level found or error:", activityError?.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    let status = "";
    if (bmi < 18.5) status = "Underweight";
    else if (bmi < 25) status = "Normal weight";
    else if (bmi < 30) status = "Overweight";
    else status = "Obese";
    return { bmi: Math.round(bmi * 10) / 10, status };
  };

  // Calculate BMR
  const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  };

  // Calculate Body Fat
  const calculateBodyFat = (height: number, neck: number, waist: number, hip: number | null, gender: string): number | null => {
    if (!height || !neck || !waist) return null;

    let bodyFat: number;
    if (gender === 'male') {
      if (waist <= neck) return null;
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      if (!hip || (waist + hip) <= neck) return null;
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
    }
    return bodyFat > 0 ? Math.round(bodyFat * 10) / 10 : null;
  };

  // Calculate TDEE with numeric activity levels
  const calculateTDEE = (bmr: number, activityLevel: number): number => {
    const activityFactors: { [key: number]: number } = {
      1: 1.2,    // Sedentary
      2: 1.375,  // Lightly Active
      3: 1.55,   // Moderately Active
      4: 1.725,  // Very Active
    };
    return Math.round(bmr * (activityFactors[activityLevel] || 1.2));
  };

  // Function to convert numeric activity level to text
  const getActivityLevelText = (level: number): string => {
    const levelTexts: { [key: number]: string } = {
      1: "Sedentary",
      2: "Lightly Active",
      3: "Moderately Active",
      4: "Very Active"
    };
    return levelTexts[level] || "Unknown";
  };

  // Calculate Macros
  const calculateMacros = (tdee: number) => {
    const protein = Math.round(tdee * 0.25 / 4); // 25% of calories from protein
    const fat = Math.round(tdee * 0.30 / 9); // 30% of calories from fat
    const carbs = Math.round(tdee * 0.45 / 4); // 45% of calories from carbs
    return { protein, fat, carbs };
  };

  // Calculate Lean Body Mass
  const calculateLBM = (weight: number, bodyFat: number | null): number | null => {
    if (!bodyFat) return null;
    return Math.round((weight * (100 - bodyFat) / 100) * 10) / 10;
  };

  // Calculate Ideal Body Weight (Devine Formula)
  const calculateIdealBodyWeight = (height: number, gender: string): number => {
    if (gender === 'male') {
      return Math.round((50 + 2.3 * ((height / 2.54) - 60)) * 10) / 10;
    } else {
      return Math.round((45.5 + 2.3 * ((height / 2.54) - 60)) * 10) / 10;
    }
  };

  // Calculated data
  const age = dateOfBirth ? calculateAge(dateOfBirth) : null;
  const bmiData = weight && height ? calculateBMI(weight, height) : null;
  const bmr = weight && height && age && gender ? calculateBMR(weight, height, age, gender) : null;
  const bodyFat = height && neck && waist && gender ? calculateBodyFat(height, neck, waist, hip, gender) : null;
  const tdee = bmr && activityLevel ? calculateTDEE(bmr, activityLevel) : null;
  const macros = tdee ? calculateMacros(tdee) : null;
  const lbm = weight && bodyFat ? calculateLBM(weight, bodyFat) : null;
  const waterIntake = weight ? Math.round(weight * 35) : null;
  const idealBodyWeight = height && gender ? calculateIdealBodyWeight(height, gender) : null;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-min p-4">
      {/* Weight Card with real data */}
      <MetricCard
        title="Weight"
        value={loading ? "Loading..." : weight ? `${weight} kg` : "No data"}
        description="Current weight"
        icon={<Weight className="h-4 w-4" />}
        className="self-start"
      />

      {/* Height Card with real data */}
      <MetricCard
        title="Height"
        value={loading ? "Loading..." : height ? `${height} cm` : "No data"}
        description="Current height"
        icon={<Ruler className="h-4 w-4" />}
        className="self-start"
      />
      {/* Enhanced Calorie Requirements Card */}
      <Card className="col-span-1 sm:col-span-2 self-start group hover:shadow-md transition-all duration-200 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            Calorie Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">BMR</p>
              <p className="text-2xl font-bold tracking-tight">
                {loading ? "Loading..." : bmr ? `${bmr.toLocaleString()}` : "No data"}
              </p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">TDEE</p>
              <p className="text-2xl font-bold tracking-tight">
                {loading ? "Loading..." : tdee ? `${tdee.toLocaleString()}` : "No data"}
              </p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waist Card with real data */}
      <MetricCard
        title="Waist"
        value={loading ? "Loading..." : waist ? `${waist} cm` : "No data"}
        description="Waist measurement"
        icon={<Target className="h-4 w-4" />}
        className="self-start"
      />

      {/* Hip Card with real data */}
      <MetricCard
        title="Hip"
        value={loading ? "Loading..." : hip ? `${hip} cm` : "No data"}
        description="Hip measurement"
        icon={<Target className="h-4 w-4" />}
        className="self-start"
      />

      {/* Neck Card with real data */}
      <MetricCard
        title="Neck"
        value={loading ? "Loading..." : neck ? `${neck} cm` : "No data"}
        description="Neck measurement"
        icon={<Target className="h-4 w-4" />}
        className="self-start"
      />

      {/* Activity Level Card with real data */}
      <MetricCard
        title="Activity Level"
        value={loading ? "Loading..." : activityLevel ? getActivityLevelText(activityLevel) : "No data"}
        description="Current activity level"
        icon={<Activity className="h-4 w-4" />}
        className="self-start"
      />

      <MetricCard
        title="BMI"
        value={loading ? "Loading..." : bmiData ? bmiData.bmi.toString() : "No data"}
        description={bmiData?.status || "Cannot calculate"}
        progressValue={bmiData ? (bmiData.bmi / 40) * 100 : 0}
        icon={<Scale className="h-4 w-4" />}
        className="self-start"
      />

      <MetricCard
        title="Body Fat %"
        value={loading ? "Loading..." : bodyFat ? `${bodyFat}%` : "No data"}
        description={bodyFat ? "Estimated" : "Cannot calculate"}
        progressValue={bodyFat ?? 0}
        icon={<Heart className="h-4 w-4" />}
        className="self-start"
      />


      {/* Enhanced Macronutrients Card */}
      <Card className="self-start group hover:shadow-md transition-all duration-200 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            Macronutrients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Protein</span>
              <span className="font-semibold">
                {loading ? "Loading..." : macros ? `${macros.protein}g` : "No data"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Fat</span>
              <span className="font-semibold">
                {loading ? "Loading..." : macros ? `${macros.fat}g` : "No data"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Carbs</span>
              <span className="font-semibold">
                {loading ? "Loading..." : macros ? `${macros.carbs}g` : "No data"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <MetricCard
        title="Lean Body Mass"
        value={loading ? "Loading..." : lbm ? `${lbm} kg` : "No data"}
        description={lbm ? "Fat-free weight" : "Cannot calculate"}
        icon={<Target className="h-4 w-4" />}
        className="self-start"
      />

      <MetricCard
        title="Water Requirement"
        value={loading ? "Loading..." : waterIntake ? `${waterIntake} ml` : "No data"}
        description="Recommended per day"
        icon={<Droplets className="h-4 w-4" />}
        className="self-start"
      />

      <MetricCard
        title="Ideal Body Weight"
        value={loading ? "Loading..." : idealBodyWeight ? `${idealBodyWeight} kg` : "No data"}
        description="Based on Devine Formula"
        icon={<Scale className="h-4 w-4" />}
        className="self-start"
      />

      {/* Weight Chart - spans 2 columns */}
      <div className="col-span-1 sm:col-span-1 self-start">
        <WeightChart
          title="Weight Progress"
          description="Your weight journey over time"
          showLabels={true}
          className="h-fit max-h-[150px]"
        />
      </div>

   
    </div>
  );
}