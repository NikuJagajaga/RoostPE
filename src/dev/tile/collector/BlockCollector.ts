class BlockCollector extends BlockBase {

    constructor(stringID: string, name: string){
        super(stringID, "wood");
        this.addVariation(name, [["roost_plain", 0], ["roost_plain", 0], ["roost_slat", 0]], true);
        this.registerTileEntity(new TileCollector());
    }

}


BlockRegistry.registerBlock(new BlockCollector("chicken_collector", "Chicken Collector"));
VanillaSlots.registerForTile(BlockID.chicken_collector);
Recipes2.addShaped(BlockID.chicken_collector, "aba:aca:ada", {a: "planks", b: Chicken.$vanilla.id, c: "hopper", d: "chest"});
