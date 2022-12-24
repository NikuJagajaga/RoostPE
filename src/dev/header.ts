IMPORT("BlockEngine");
IMPORT("StorageInterface");
IMPORT("VanillaSlots");
IMPORT("EnhancedRecipes");

const Color = android.graphics.Color;

const Math_clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const Math_randomInt = (min: number, max: number): number => min + (Math.random() * (max - min)) | 0;