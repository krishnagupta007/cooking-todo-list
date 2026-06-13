export interface IngredientItem {
  name: string;
  quantity: string;
  isOwned: boolean;
}

export interface CookingStep {
  step: number;
  instruction: string;
  durationEstimate: string;
}

export interface MealRecipe {
  type: "Breakfast" | "Lunch" | "Dinner";
  recipeName: string;
  tagline: string;
  prepTime: string;
  cookTime: string;
  ingredientsUsed: IngredientItem[];
  cookingTodoList: CookingStep[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface GroceryItem {
  name: string;
  quantity: string;
  estimatedCost: number;
  category: string;
}

export interface SmartSubstitution {
  originalIngredient: string;
  recommendedSubstitute: string;
  reason: string;
}

export interface BudgetSummary {
  totalEstimatedCost: number;
  budgetLimit: number;
  budgetStatus: "under_budget" | "on_budget" | "exceeded_budget";
  percentageUsed: number;
  feasibilityStrategy: string;
}

export interface DailyMealPlan {
  targetDay: string;
  dietaryRestrictions: string;
  mealPlan: {
    Breakfast: MealRecipe;
    Lunch: MealRecipe;
    Dinner: MealRecipe;
  };
  groceryList: GroceryItem[];
  smartSubstitutions: SmartSubstitution[];
  budgetSummary: BudgetSummary;
}

export interface MealPlanRequest {
  targetDay: string;
  availableIngredients: string;
  dailyBudget: number;
  dietaryRestrictions: string;
}
