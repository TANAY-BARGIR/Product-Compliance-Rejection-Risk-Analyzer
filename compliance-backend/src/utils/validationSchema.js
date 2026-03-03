const { z } = require('zod');

// Define the shape of a single ingredient input
const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  concentration: z.number().min(0, "Concentration must be positive"),
  unit: z.enum(["%", "ppm", "mg/kg"], {
    errorMap: () => ({ message: "Unit must be %, ppm, or mg/kg" })
  })
});

// Define the shape of the entire API Request
const submissionSchema = z.object({
  productName: z.string().min(1),
  category: z.literal("soap"), // Locking domain to Soap for now
  ingredients: z.array(ingredientSchema).min(1, "Must provide at least one ingredient")
});

module.exports = { submissionSchema };
