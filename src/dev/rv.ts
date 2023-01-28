var RV: RecipeViewerAPI;

ModAPI.addAPICallback("RecipeViewer", (api: RecipeViewerAPI): void => {

    RV = api;


    class RoostRecipe extends api.RecipeType {

        constructor(){
            super("Roost", BlockID.chicken_roost, {
                drawing: [
                    {type: "bitmap", x: 278, y: 116, bitmap: "roost.bar_roost", scale: 5.5}
                ],
                elements: {
                    input0: {x: 150, y: 110, size: 100},
                    output0: {x: 450, y: 110, size: 100},
                    output1: {x: 550, y: 110, size: 100},
                    output2: {x: 650, y: 110, size: 100},
                    output3: {x: 750, y: 110, size: 100},
                    textInfo: {type: "text", x: 150, y: 240, font: {size: 32, color: Color.WHITE, shadow: 0.5}, multiline: true},
                    textTips1: {type: "text", x: 150, y: 380, font: {size: 24, color: Color.LTGRAY, shadow: 0.5}, multiline: true, text: [
                        "[Lay Time Multiplier]",
                        "Growth _1: 100%",
                        "Growth _2: _90%",
                        "Growth 10: _10%"
                    ].join("\n").replace(/_/g, "  ")},
                    textTips2: {type: "text", x: 550, y: 380, font: {size: 24, color: Color.LTGRAY, shadow: 0.5}, multiline: true, text: [
                        "[Lay Count]",
                        "Gain 1-4: 1",
                        "Gain 5-9: 2",
                        "Gain _10: 3"
                    ].join("\n").replace(/_/g, "  ")}
                }
            });
        }

        getAllList(): RecipePattern[] {
            return ItemChicken.getRoostRecipeListForRV();
        }

        onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
            const chicken = ItemRegistry.getInstanceOf(recipe.input[0].id) as ItemChicken;
            if(!chicken){
                elements.get("textInfo").setBinding("text", "");
                return;
            }
            const info = [
                "Tier: " + chicken.getTier(),
                "Lay Time: " + chicken.getMinLayTime() + " - " + chicken.getMaxLayTime() + " tick"
            ];
            elements.get("textInfo").setBinding("text", info.join("\n"));
        }

    }


    class BreederRecipe extends api.RecipeType {

        constructor(){
            super("Crossbreeding", BlockID.chicken_breeder, {
                drawing: [
                    {type: "bitmap", x: 172, y: 130, bitmap: "roost.plus", scale: 5.5},
                    {type: "bitmap", x: 478, y: 120, bitmap: "roost.bar_breeder", scale: 5.5}
                ],
                elements: {
                    input0: {x: 50, y: 110, size: 100},
                    input1: {x: 250, y: 110, size: 100},
                    input2: {x: 350, y: 110, size: 100},
                    output0: {x: 650, y: 110, size: 100},
                    output1: {x: 750, y: 110, size: 100},
                    output2: {x: 850, y: 110, size: 100}
                }
            });
        }

        getAllList(): RecipePattern[] {
            return ItemChicken.getBreederRecipeListForRV();
        }

        slotTooltip(name: string, item: ItemInstance, tips: {chance?: number}): string {
            if(tips?.chance){
                return name + "\n(" + (tips.chance * 100).toFixed(1) + "%)";
            }
            return name;
        }

    }


    api.RecipeTypeRegistry.register("chicken_roost", new RoostRecipe());
    api.RecipeTypeRegistry.register("chicken_breeder", new BreederRecipe());

});