class BlockBreeder extends BlockBase {

    static readonly MODE_DEACTIVE = 0;
    static readonly MODE_ERROR = 1;
    static readonly MODE_ACTIVE = 2;

    static models: [ICRender.Model, ICRender.Model, ICRender.Model] = [null, null, null];

    constructor(stringID: string, name: string){
        super(stringID, "wood");
        this.addVariation(name, [["roost_plain", 0]], true);
        this.createBreederModel();
        this.registerTileEntity(new TileBreeder());
    }

    private createBreederModel(): void {
        const boxes: {vartexes: BlockModeler.BoxVertexes, texture: [string, number][]}[] = [
            {vartexes: [0, 0, 0, 1, 3/16, 1], texture: ["plain", "floor", "plain"].map(str => ["roost_" + str, 0])},
            {vartexes: [0, 13/16, 0, 1, 1, 1], texture: [["roost_plain", 0]]},
            {vartexes: [0, 3/16, 0, 3/16, 13/16, 3/16], texture: [["roost_curtain", 0]]},
            {vartexes: [0, 3/16, 13/16, 3/16, 13/16, 1], texture: [["roost_curtain", 0]]},
            {vartexes: [13/16, 3/16, 0, 1, 13/16, 3/16], texture: [["roost_curtain", 0]]},
            {vartexes: [13/16, 3/16, 13/16, 1, 13/16, 1], texture: [["roost_curtain", 0]]}
        ];
        let model: BlockRenderer.Model;
        for(let i = 0; i < 3; i++){
            model = BlockRenderer.createModel();
            boxes.forEach(box => {
                model.addBox(...box.vartexes, box.texture);
            });
            switch(i){
                case 1: model.addBox(3/16, 3/16, 3/16, 13/16, 13/16, 13/16, [["roost_empty", 0]]); break;
                case 2: model.addBox(3/16, 3/16, 3/16, 13/16, 13/16, 13/16, [["roost_curtain", 0]]); break;
            }
            BlockBreeder.models[i] = new ICRender.Model(model);
        }
        BlockRenderer.enableCoordMapping(this.id, -1, BlockBreeder.models[0]);
    }

}


BlockRegistry.registerBlock(new BlockBreeder("chicken_breeder", "Chicken Breeder"));
Cfg.vanilla_slots && VanillaSlots.registerForTile(BlockID.chicken_breeder);
Recipes2.addShaped(BlockID.chicken_breeder, "aaa:aba:ccc", {a: "planks", b: "wheat_seeds", c: "hay_block"});
