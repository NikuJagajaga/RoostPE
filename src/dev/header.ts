IMPORT("BlockEngine");
IMPORT("StorageInterface");
IMPORT("VanillaSlots");
IMPORT("EnhancedRecipes");

const Color = android.graphics.Color;

const Math_clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const Math_randomInt = (min: number, max: number): number => min + (Math.random() * (max - min)) | 0;

const Cfg = {
    vanilla_slots: __config__.getBool("vanilla_slots"),
    roost_speed: __config__.getNumber("roost_speed").intValue(),
    breeder_speed: __config__.getNumber("breeder_speed").intValue()
};
