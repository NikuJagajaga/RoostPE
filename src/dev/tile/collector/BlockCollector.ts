class BlockCollector extends BlockBase {

    constructor(stringID: string, name: string){
        super(stringID, "wood");
        this.addVariation(name, [["roost_plain", 0], ["roost_plain", 0], ["roost_slat", 0]], true);
        this.registerTileEntity(new TileCollector());
    }

}


BlockRegistry.registerBlock(new BlockCollector("roost_collector", "Roost Collector"));
Cfg.vanilla_slots && VanillaSlots.registerForTile(BlockID.roost_collector);
Recipes2.addShaped(BlockID.roost_collector, "aba:aca:ada", {a: "planks", b: Chicken.$vanilla.id, c: "hopper", d: "chest"});
