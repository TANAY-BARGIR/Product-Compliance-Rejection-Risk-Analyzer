const { z } = require("zod");
const { getAvailableCategories } = require("../services/ruleEngine");

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  concentration: z.number().min(0, "Concentration must be positive"),
  unit: z.enum(["%", "ppm", "mg/kg", "ppb", "mg/L", "µg/kg", "ug/kg"], {
    errorMap: () => ({ message: "Unit must be %, ppm, mg/kg, ppb, mg/L, or µg/kg" }),
  }),
});

const submissionSchema = z
  .object({
    productName: z.string().min(1, "Product name is required"),
    category: z.string().min(1, "Category is required"),
    manufacturer: z.string().optional(),
    ingredients: z
      .array(ingredientSchema)
      .min(1, "Must provide at least one ingredient"),
  })
  .refine(
    (data) => {
      const available = getAvailableCategories();
      return available.includes(data.category);
    },
    {
      message: "Invalid category. No rule file found for this category.",
      path: ["category"],
    }
  );

module.exports = { submissionSchema };
