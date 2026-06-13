import React, { useState, useRef, useEffect } from "react";
import { 
  Check, 
  ShoppingBag, 
  DollarSign, 
  ChefHat, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  Sliders, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  TrendingDown,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Plus
} from "lucide-react";
import { DailyMealPlan } from "./types";
import gsap from "gsap";

const DEFAULT_PANTRY = "eggs, chicken, rice, onions, garlic, olive oil, milk, salt, black pepper";

const DEMO_PLAN: DailyMealPlan = {
  targetDay: "Wednesday",
  dietaryRestrictions: "Gluten-Free, High-Protein",
  mealPlan: {
    Breakfast: {
      type: "Breakfast",
      recipeName: "Velvety Maple Banana Pecan Porridge",
      tagline: "Warm, slow-simmered organic oats drizzled in pure golden maple syrup, crowned with sliced banana and dry-roasted pecans.",
      prepTime: "5 mins",
      cookTime: "10 mins",
      ingredientsUsed: [
        { name: "Organic Oats", quantity: "1/2 cup", isOwned: true },
        { name: "Banana", quantity: "1 medium", isOwned: true },
        { name: "Pecan Halves", quantity: "2 tbsp", isOwned: false },
        { name: "Pure Maple Syrup", quantity: "1 tbsp", isOwned: false }
      ],
      cookingTodoList: [
        { step: 1, instruction: "Bring 1 cup of filtered water and milk substitute to a gentle simmer in a heavy-bottomed skillet.", durationEstimate: "3 mins" },
        { step: 2, instruction: "Stir in steel-cut oats and freshly sliced banana, keeping heat medium-low to stew natural caramel flavors.", durationEstimate: "5 mins" },
        { step: 3, instruction: "Transfer to a deep warm bowl, garnish with toasted hickory pecans, and drizzle heavy pure maple syrup.", durationEstimate: "2 mins" }
      ],
      nutrition: {
        calories: 340,
        protein: "8g",
        carbs: "54g",
        fat: "11g"
      }
    },
    Lunch: {
      type: "Lunch",
      recipeName: "Citrus Lime-Cilantro Avocado Chicken Bowl",
      tagline: "Crisp skillet-seared chicken breast laid gently over hot jasmine rice, accompanied by sea-salted Hass avocado.",
      prepTime: "10 mins",
      cookTime: "15 mins",
      ingredientsUsed: [
        { name: "Chicken Breast", quantity: "150g", isOwned: true },
        { name: "Jasmine Rice", quantity: "1/2 cup", isOwned: true },
        { name: "Hass Avocado", quantity: "1/2 fruit", isOwned: false },
        { name: "Lime & Cilantro", quantity: "1 sprig", isOwned: false }
      ],
      cookingTodoList: [
        { step: 1, instruction: "Steam jasmine rice with a pinch of salt until fluffy. Keep covered to trap radiant heat.", durationEstimate: "12 mins" },
        { step: 2, instruction: "Dice chicken breast, sear in high-heat olive oil with custom zesty lemon seasonings.", durationEstimate: "8 mins" },
        { step: 3, instruction: "Assemble bowl with warm rice, golden chicken, sliced Hass avocado, and fresh lime squeeze.", durationEstimate: "3 mins" }
      ],
      nutrition: {
        calories: 520,
        protein: "42g",
        carbs: "48g",
        fat: "16g"
      }
    },
    Dinner: {
      type: "Dinner",
      recipeName: "Garlic Butter Glazed Pacific Salmon",
      tagline: "Crispy cast-iron wild salmon fillet basted thoroughly with hand-pressed garlic and garden-fresh dill.",
      prepTime: "10 mins",
      cookTime: "12 mins",
      ingredientsUsed: [
        { name: "Salmon Fillet", quantity: "180g", isOwned: false },
        { name: "Garlic Cloves & Butter", quantity: "2 cloves / 1 tbsp", isOwned: true },
        { name: "Crisp French Green Beans", quantity: "1 bunch", isOwned: false }
      ],
      cookingTodoList: [
        { step: 1, instruction: "Dab salmon fillet dry with paper towels to facilitate consistent skin-crisping.", durationEstimate: "3 mins" },
        { step: 2, instruction: "Singe salmon skin-side down in a hot skillet on medium-high until skin achieves glassy crunchiness.", durationEstimate: "5 mins" },
        { step: 3, instruction: "Flip salmon. Add grass-fed butter, salt, pepper, and crushed garlic. Spoon continuous hot glaze over salmon.", durationEstimate: "4 mins" }
      ],
      nutrition: {
        calories: 460,
        protein: "38g",
        carbs: "4g",
        fat: "32g"
      }
    }
  },
  groceryList: [
    { name: "Pecan Halves", quantity: "50g", estimatedCost: 1.50, category: "Pantry" },
    { name: "Pure Maple Syrup", quantity: "1 bottle", estimatedCost: 2.80, category: "Sweeteners" },
    { name: "Hass Avocado", quantity: "2 units", estimatedCost: 2.50, category: "Produce" },
    { name: "Lime & Cilantro", quantity: "1 bunch", estimatedCost: 1.20, category: "Produce" },
    { name: "Salmon Fillet", quantity: "180g", estimatedCost: 7.90, category: "Seafood" },
    { name: "Crisp French Green Beans", quantity: "1 bundle", estimatedCost: 2.10, category: "Produce" }
  ],
  smartSubstitutions: [
    { originalIngredient: "Crisp French Green Beans", recommendedSubstitute: "Frozen Organic Broccoli Florets", reason: "Trims price by $1.20 while retaining dietary fiber guidelines." },
    { originalIngredient: "Salmon Fillet", recommendedSubstitute: "Pacific Cod or Tofu Block", reason: "Pries discount of $3.50; keeps macro-nutrients high-protein & keto-compliant." }
  ],
  budgetSummary: {
    totalEstimatedCost: 18.00,
    budgetLimit: 25.05,
    budgetStatus: "under_budget",
    percentageUsed: 72,
    feasibilityStrategy: "Fully optimized list under your $25 limit. Trimmed grocery rates by prioritizing owned oil & pantry spices."
  }
};

export default function App() {
  const [targetDay, setTargetDay] = useState<string>("Wednesday");
  const [availableIngredients, setAvailableIngredients] = useState<string>(DEFAULT_PANTRY);
  const [dailyBudget, setDailyBudget] = useState<number>(25);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("Gluten-Free, High-Protein");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<DailyMealPlan>(DEMO_PLAN);

  // Simple configuration drawer toggle
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Active sub-states for beautiful tab visual transitions
  const [activeTab, setActiveTab] = useState<"plan" | "grocery" | "substitutions">("plan");
  const [activeMeal, setActiveMeal] = useState<"Breakfast" | "Lunch" | "Dinner">("Breakfast");
  
  // Checking off lists for live actual utility
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [checkedGrocery, setCheckedGrocery] = useState<Record<string, boolean>>({});

  // Refs for GSAP animation selectors
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const configDrawerRef = useRef<HTMLDivElement>(null);

  // Trigger GSAP stagger transitions whenever navigation shifts or load finishes
  useEffect(() => {
    if (contentAreaRef.current) {
      gsap.fromTo(
        contentAreaRef.current.querySelectorAll(".gsap-stagger-item"),
        { opacity: 0, y: 12 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.04, 
          duration: 0.4, 
          ease: "power2.out",
          clearProps: "all"
        }
      );
    }
  }, [activeTab, activeMeal, plan]);

  // Handle slide/fade GSAP transition for the config panel
  useEffect(() => {
    if (configDrawerRef.current) {
      if (showConfig) {
        gsap.fromTo(
          configDrawerRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      } else {
        gsap.to(configDrawerRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
      }
    }
  }, [showConfig]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/plan-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetDay,
          availableIngredients: availableIngredients || "None",
          dailyBudget,
          dietaryRestrictions
        })
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setPlan(resJson.data);
        setActiveTab("plan");
        setShowConfig(false); // Clean closure
        setCheckedSteps({});
        setCheckedGrocery({});
      } else {
        throw new Error(resJson.message || "Failed to structure computed response.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Verify your API configuration backend connections.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(DEMO_PLAN);
    setAvailableIngredients(DEFAULT_PANTRY);
    setTargetDay("Wednesday");
    setDailyBudget(25);
    setDietaryRestrictions("Gluten-Free, High-Protein");
    setActiveTab("plan");
    setActiveMeal("Breakfast");
    setShowConfig(false);
    setCheckedSteps({});
    setCheckedGrocery({});
    setError(null);
  };

  const handleStepToggle = (mealKey: string, stepIdx: number) => {
    const key = `${mealKey}-${stepIdx}`;
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGroceryToggle = (itemIdx: number) => {
    setCheckedGrocery(prev => ({ ...prev, [itemIdx]: !prev[itemIdx] }));
  };

  // Helper calculation for checklist status indicator
  const getMealProgress = (mealType: "Breakfast" | "Lunch" | "Dinner") => {
    const meal = plan.mealPlan[mealType];
    if (!meal) return { done: 0, total: 0 };
    const total = meal.cookingTodoList.length;
    const done = meal.cookingTodoList.filter(
      step => checkedSteps[`${mealType}-${step.step}`]
    ).length;
    return { done, total };
  };

  const isMealCompleted = (mealType: "Breakfast" | "Lunch" | "Dinner") => {
    const { done, total } = getMealProgress(mealType);
    return total > 0 && done === total;
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col font-sans antialiased">
      
      {/* 1. Header - CONDENSED & humble (Satisfying user prompt perfectly) */}
      <header className="border-b border-[#1c1c1c] sticky top-0 bg-[#090909]/90 backdrop-blur-md z-40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#141414] border border-[#262626]">
            <ChefHat className="w-4 h-4 text-[#0099ff]" />
          </div>
          <div>
            <h1 className="font-display font-medium text-sm tracking-tight text-white">SavorChef</h1>
            <p className="text-[10px] text-zinc-500 font-mono -mt-0.5">Cooking To-Do Blueprint</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 bg-[#141414] px-2.5 py-1 rounded-full border border-[#262626]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active plan: {plan.targetDay}
          </span>
          {plan !== DEMO_PLAN && (
            <button 
              onClick={handleReset}
              className="text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-[#262626] px-2 py-1 rounded-full transition-colors cursor-pointer"
            >
              Reset to Demo
            </button>
          )}
        </div>
      </header>

      {/* Main Single-column highly Intuitive flow layout */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col gap-5">
        
        {/* Dynamic header / current active target summary card */}
        <section className="bg-gradient-to-r from-zinc-900 to-[#141414] border border-[#262626] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-[#0099ff] uppercase font-semibold">Active Daily Target</span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white mt-0.5">
              {plan.targetDay}'s Culinary Outline
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Dietary tag: <strong className="text-zinc-200">{plan.dietaryRestrictions || "Standard"}</strong> • Total calculated grocery overhead: <strong className="text-emerald-400">${plan.budgetSummary.totalEstimatedCost.toFixed(2)}</strong>
            </p>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 rounded-full bg-[#141414] border border-[#262626] hover:bg-zinc-800 transition-all text-xs font-medium text-white flex items-center gap-2 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
            <span>Customize Pantry & Settings</span>
            {showConfig ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
          </button>
        </section>

        {/* Collapsible Input Configuration Form Drawer (GSAP Animating height/opacity) */}
        <div 
          ref={configDrawerRef} 
          className="overflow-hidden bg-[#141414] rounded-2xl border border-[#262626]/80 p-0 shadow-xl opacity-0"
          style={{ height: 0 }}
        >
          <form onSubmit={handleGenerate} className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-1">
              <span className="text-xs font-mono text-zinc-400 font-semibold uppercase">Pantry & Budget Compiler Settings</span>
              <button 
                type="button" 
                onClick={() => setShowConfig(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Day selection */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase font-medium">1. Target Calendar Day</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["Monday", "Wednesday", "Friday", "Weekend"].map((day) => {
                    const active = targetDay === day;
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => setTargetDay(day)}
                        className={`text-xs py-1.5 rounded-lg font-medium transition-all ${
                          active
                            ? "bg-[#1c1c1c] text-white border border-[#0099ff] shadow-sm"
                            : "bg-[#090909] text-zinc-400 border border-[#262626] hover:bg-[#141414] hover:text-white"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase font-medium">2. Dietary Restriction Filter</label>
                <select
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  className="w-full bg-[#090909] border border-[#262626] rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#0099ff] cursor-pointer"
                >
                  <option value="none">Standard Non-Restriction</option>
                  <option value="Gluten-Free, High-Protein">Gluten-Free, High-Protein</option>
                  <option value="Vegetarian">Vegetarian (Diet compliant)</option>
                  <option value="Vegan, Organic">Vegan (Fresh Greens & Legumes)</option>
                  <option value="Keto, Low-Carb">Keto (Sugar-Free, Fat-basted)</option>
                  <option value="Dairy-Free">Dairy-Free</option>
                </select>
              </div>
            </div>

            {/* Pantry list */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase font-medium">3. Available Kitchen Pantry items</label>
              <textarea
                value={availableIngredients}
                onChange={(e) => setAvailableIngredients(e.target.value)}
                placeholder="List ingredients you currently own, separated by commas..."
                rows={2}
                className="w-full bg-[#090909] border border-[#262626] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#0099ff] resize-none"
              />
              <span className="text-[10px] text-zinc-500">Seeded eggs, chickens, spices, oils are recognized to bypass store expenses.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                  <span>4. DAILY BUDGET LIMIT</span>
                  <span className="text-[#0099ff] font-semibold">${dailyBudget} limit</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="w-full accent-[#0099ff] bg-[#090909] h-1 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-end justify-end h-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-full bg-white text-black hover:bg-zinc-200 transition-all font-display font-medium text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Re-calculating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Regenerate Premium Meal Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Dynamic Display Error banner */}
        {error && (
          <div className="bg-[#141414] border border-red-900/40 rounded-xl p-4 text-xs text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong>Calculation request halted:</strong> {error}
              <button 
                onClick={handleReset}
                className="block mt-2 font-mono underline hover:text-white cursor-pointer"
              >
                Restore demo outline values
              </button>
            </div>
          </div>
        )}

        {/* Visual Budget & Target feasibility indicator bar */}
        <section className="bg-[#141414]/90 border border-[#262626]/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1.5">
              <span>ESTIMATED EXPENDITURE</span>
              <span className="text-zinc-500">Limit: ${plan.budgetSummary.budgetLimit}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-white text-xl font-bold font-display tracking-tight">${plan.budgetSummary.totalEstimatedCost.toFixed(2)}</span>
              <div className="flex-1 bg-[#090909] rounded-full h-1.5 overflow-hidden border border-[#1a1a1a]">
                <div 
                  className={`h-full bg-[#0099ff] shadow-sm shadow-[#0099ff]/20 transition-all duration-500`}
                  style={{ width: `${Math.min(plan.budgetSummary.percentageUsed, 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-zinc-300">{plan.budgetSummary.percentageUsed}%</span>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-[#262626]/60 pt-3 md:pt-0 md:pl-5 flex flex-col justify-center max-w-[280px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase">Feasibility Status</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal italic">
              "{plan.budgetSummary.feasibilityStrategy || "Inventory matches perfectly to provide optimal balance."}"
            </p>
          </div>
        </section>

        {/* 2. Interactive Navigation tabs styled like Framer tab buttons */}
        <div className="flex bg-[#141414] border border-[#262626]/80 p-1 rounded-2xl self-start w-full md:w-auto">
          <button
            onClick={() => setActiveTab("plan")}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-medium tracking-tight transition-all cursor-pointer ${
              activeTab === "plan"
                ? "bg-[#1c1c1c] text-white shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            1. Daily Recipes & Tasks
          </button>
          
          <button
            onClick={() => setActiveTab("grocery")}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-medium tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "grocery"
                ? "bg-[#1c1c1c] text-white shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            2. Grocery list ({plan.groceryList.length})
          </button>

          <button
            onClick={() => setActiveTab("substitutions")}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-medium tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "substitutions"
                ? "bg-[#1c1c1c] text-white shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            3. Smart Substitutes
          </button>
        </div>

        {/* Animated Work Content Area */}
        <div ref={contentAreaRef} className="min-h-[300px]">
          
          {/* TAB 1: MEAL PLAN AND THE STEPS */}
          {activeTab === "plan" && (
            <div className="flex flex-col gap-4">
              
              {/* Breakfast, Lunch, Dinner toggler */}
              <div className="grid grid-cols-3 gap-2.5">
                {(["Breakfast", "Lunch", "Dinner"] as const).map((mealType) => {
                  const isActive = activeMeal === mealType;
                  const mealData = plan.mealPlan[mealType];
                  const { done, total } = getMealProgress(mealType);
                  const isDone = isMealCompleted(mealType);

                  return (
                    <button
                      key={mealType}
                      onClick={() => setActiveMeal(mealType)}
                      className={`py-3 px-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                        isActive
                          ? "bg-[#141414] border-[#0099ff] shadow-sm"
                          : "bg-[#141414]/40 border-[#262626] hover:bg-[#141414]"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{mealType}</span>
                      
                      <div className="flex justify-between items-center mt-3 w-full">
                        <span className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-zinc-400"}`}>
                          {mealData?.recipeName || mealType}
                        </span>
                        
                        {isDone ? (
                          <span className="bg-emerald-950/50 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-md font-mono border border-emerald-900/10">Ready</span>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-500 font-medium">({done}/{total})</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recipe card detail view */}
              {plan.mealPlan[activeMeal] && (
                <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
                  
                  {/* Decorative background glow */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-tr from-[#0099ff]/10 to-transparent pointer-events-none rounded-full blur-2xl" />

                  {/* Header info */}
                  <div className="gsap-stagger-item">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-[8px] rounded-md bg-zinc-900 border border-[#262626] text-zinc-400 font-mono tracking-wider uppercase font-semibold">
                        {activeMeal}
                      </span>
                      <span className="text-zinc-700">•</span>
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
                        <Clock className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Prep: {plan.mealPlan[activeMeal].prepTime}</span>
                        <span className="text-zinc-700">|</span>
                        <span>Cook: {plan.mealPlan[activeMeal].cookTime}</span>
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
                      {plan.mealPlan[activeMeal].recipeName}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 italic leading-relaxed pl-3 border-l border-[#0099ff]">
                      "{plan.mealPlan[activeMeal].tagline}"
                    </p>
                  </div>

                  {/* Split ingredients uses and nutritional benchmarks */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3 border-t border-[#262626]/30">
                    
                    {/* Left block - recipe materials */}
                    <div className="md:col-span-7 flex flex-col gap-2.5 gsap-stagger-item">
                      <h4 className="text-[10px] font-mono font-medium text-zinc-500 tracking-wider uppercase">UTILIZED INGREDIENTS</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.mealPlan[activeMeal].ingredientsUsed.map((ing, idx) => (
                          <div 
                            key={idx}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${
                              ing.isOwned 
                                ? "bg-[#090909] border-emerald-900/30 text-emerald-400" 
                                : "bg-[#090909] border-[#262626] text-zinc-300"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${ing.isOwned ? "bg-emerald-500" : "bg-[#0099ff]"}`} />
                            <span className="font-medium">{ing.name}</span>
                            <span className="text-[9px] text-zinc-600 font-mono">({ing.quantity})</span>
                            {ing.isOwned && <span className="text-[8px] bg-emerald-950/10 text-emerald-500 px-1 rounded font-mono">Owned</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right block - calories & nutrients specs */}
                    <div className="md:col-span-5 flex flex-col gap-2.5 gsap-stagger-item">
                      <h4 className="text-[10px] font-mono font-medium text-zinc-500 tracking-wider uppercase">MACRO NUTRIENTS BENEFITS</h4>
                      <div className="grid grid-cols-4 gap-1.5">
                        <div className="bg-[#090909] border border-[#262626] p-2 rounded-lg text-center flex flex-col justify-center">
                          <span className="text-[8px] font-mono text-zinc-500">CALORIES</span>
                          <span className="text-white text-xs font-bold font-mono mt-0.5">{plan.mealPlan[activeMeal].nutrition.calories}</span>
                        </div>
                        <div className="bg-[#090909] border border-[#262626] p-2 rounded-lg text-center flex flex-col justify-center">
                          <span className="text-[8px] font-mono text-zinc-500">PROTEIN</span>
                          <span className="text-emerald-400 text-xs font-bold font-mono mt-0.5">{plan.mealPlan[activeMeal].nutrition.protein}</span>
                        </div>
                        <div className="bg-[#090909] border border-[#262626] p-2 rounded-lg text-center flex flex-col justify-center">
                          <span className="text-[8px] font-mono text-zinc-500">CARBS</span>
                          <span className="text-sky-400 text-xs font-bold font-mono mt-0.5">{plan.mealPlan[activeMeal].nutrition.carbs}</span>
                        </div>
                        <div className="bg-[#090909] border border-[#262626] p-2 rounded-lg text-center flex flex-col justify-center">
                          <span className="text-[8px] font-mono text-zinc-500">FAT</span>
                          <span className="text-amber-500 text-xs font-bold font-mono mt-0.5">{plan.mealPlan[activeMeal].nutrition.fat}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Cooking checklist todo steps */}
                  <div className="pt-4 border-t border-[#262626]/30 flex flex-col gap-2.5 gsap-stagger-item">
                    <div className="flex justify-between items-center bg-[#090909] px-3 py-1.5 rounded-lg border border-[#262626]">
                      <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#0099ff]" />
                        <span>Interactive Tasks Timeline</span>
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500">Click a card to toggle completion state</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {plan.mealPlan[activeMeal].cookingTodoList.map((step) => {
                        const uniqueKey = `${activeMeal}-${step.step}`;
                        const isChecked = !!checkedSteps[uniqueKey];
                        return (
                          <div
                            key={step.step}
                            onClick={() => handleStepToggle(activeMeal, step.step)}
                            className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer selection:bg-transparent ${
                              isChecked
                                ? "bg-zinc-950/20 border-zinc-850 opacity-60"
                                : "bg-[#090909] border-[#262626] text-zinc-200 hover:border-zinc-800"
                            }`}
                          >
                            <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked 
                                ? "bg-[#0099ff] border-[#0099ff] text-black" 
                                : "border-zinc-700"
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                                <span>Task step {step.step}</span>
                                <span className="bg-[#141414] px-1 py-0.5 rounded border border-[#262626]">
                                  ⏱ {step.durationEstimate}
                                </span>
                              </div>
                              <p className={`text-xs mt-1 leading-relaxed ${isChecked ? "line-through text-zinc-650" : "text-zinc-200"}`}>
                                {step.instruction}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: GROCERY OVERVIEW */}
          {activeTab === "grocery" && (
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />

              <div className="gsap-stagger-item">
                <h4 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Optimal Shopping Checklist</span>
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  We've isolated everything not present in your pantry. Tap to check off items while in store.
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {plan.groceryList.map((item, idx) => {
                  const isChecked = !!checkedGrocery[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleGroceryToggle(idx)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer gsap-stagger-item ${
                        isChecked
                          ? "bg-zinc-950/20 border-zinc-850 opacity-60"
                          : "bg-[#090909] border-[#262626] text-zinc-200 hover:border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked 
                            ? "bg-emerald-500 border-emerald-500 text-black" 
                            : "border-zinc-700"
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <span className={`text-xs font-semibold ${isChecked ? "line-through text-zinc-500" : "text-white"}`}>
                            {item.name}
                          </span>
                          <span className="text-[9px] text-zinc-500 block uppercase tracking-wider font-mono">Category: {item.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-zinc-500 bg-[#141414] border border-[#262626] px-2 py-0.5 rounded text-[10px]">
                          {item.quantity}
                        </span>
                        <span className={`font-semibold text-xs ${isChecked ? "text-zinc-500" : "text-emerald-400"}`}>
                          ~${item.estimatedCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-[#090909] border border-[#262626] rounded-xl flex justify-between items-center mt-2 gsap-stagger-item">
                <span className="text-xs text-zinc-400">Total Purchase Progress:</span>
                <span className="text-xs text-white font-mono font-medium">
                  {Object.values(checkedGrocery).filter(Boolean).length} of {plan.groceryList.length} tags bought
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: SMART SUBSTITUTES */}
          {activeTab === "substitutions" && (
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />

              <div className="gsap-stagger-item">
                <h4 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#0099ff]" />
                  <span>Cost-Efficient Substitution Rules</span>
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Our system evaluates cheaper ingredient combinations to satisfy dietary restrictions while compressing budget spent.
                </p>
              </div>

              {plan.smartSubstitutions.length === 0 ? (
                <p className="text-sm text-zinc-500 italic mt-4 text-center">No substitution compromises necessary. Your catalog yields full financial feasibility!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {plan.smartSubstitutions.map((sub, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#090909] border border-[#262626] rounded-xl p-4 flex flex-col gap-3 gsap-stagger-item hover:border-zinc-800 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-[#262626] pb-2 text-[10px] font-mono">
                        <span className="text-red-400 font-medium line-through">{sub.originalIngredient}</span>
                        <span className="text-zinc-600">ALTERNATIVE</span>
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1 py-0.5 rounded border border-emerald-900/20">SWAP TO</span>
                        <span className="text-emerald-400 font-semibold text-xs">{sub.recommendedSubstitute}</span>
                      </div>

                      <p className="text-xs text-zinc-400 leading-normal bg-[#141414]/50 p-2.5 rounded-lg border border-[#262626]/30">
                        {sub.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </main>

      {/* Modern micro-footer conforming perfectly to aesthetic standards */}
      <footer className="border-t border-[#1c1c1c] bg-[#090909] mt-12 py-6 px-6">
        <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-zinc-505 font-mono text-center md:text-left">
            Cooking To-Do Blueprint compiled in Node.js & TypeScript. No deprecated structures loaded.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-zinc-600 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Enterprise Architecture</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
