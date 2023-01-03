namespace Chicken {

    export const $vanilla = new ItemChicken("chicken_vanilla", "Vanilla Chicken", ["feather", "egg"]);

    $vanilla.setEntityIdentifier("minecraft:chicken");
    ItemRegistry.registerItem($vanilla);

}