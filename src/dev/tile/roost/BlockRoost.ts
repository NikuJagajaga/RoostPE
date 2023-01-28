class BlockRoost extends BlockBase {

    constructor(stringID: string, name: string){
        super(stringID, "wood");
        this.addVariation(name, [["roost_plain", 0]], true);
        this.createRoostModel();
        this.registerTileEntity(new TileRoost());
    }

    private createRoostModel(): void {
        const boxes: {vartexes: BlockModeler.BoxVertexes, texture: [string, number][]}[] = [
            {vartexes: [0, 0, 0, 1, 3/16, 1], texture: ["plain", "floor", "plain", "curtain", "plain", "plain"].map(str => ["roost_" + str, 0])},
            {vartexes: [0, 13/16, 0, 1, 1, 1], texture: ["plain", "plain", "plain", "curtain", "plain", "plain"].map(str => ["roost_" + str, 0])},
            {vartexes: [13/16, 3/16, 0, 1, 13/16, 1], texture: ["plain", "plain", "plain", "curtain", "plain", "inside"].map(str => ["roost_" + str, 0])},
            {vartexes: [0, 3/16, 0, 3/16, 13/16, 1], texture: ["plain", "plain", "plain", "curtain", "inside", "plain"].map(str => ["roost_" + str, 0])},
            {vartexes: [3/16, 3/16, 13/16, 13/16, 13/16, 1], texture: ["plain", "plain", "plain", "inside", "plain", "plain"].map(str => ["roost_" + str, 0])}
        ];
        let model: BlockRenderer.Model;
        for(let i = 0; i < 4; i++){
            model = BlockRenderer.createModel();
            boxes.forEach(box => {
                const textures = [
                    [box.texture[0], box.texture[1], box.texture[3], box.texture[2], box.texture[5], box.texture[4]],
                    [box.texture[0], box.texture[1], box.texture[2], box.texture[3], box.texture[4], box.texture[5]],
                    [box.texture[0], box.texture[1], box.texture[4], box.texture[5], box.texture[3], box.texture[2]],
                    [box.texture[0], box.texture[1], box.texture[5], box.texture[4], box.texture[2], box.texture[3]]
                ];
                model.addBox(...BlockModeler.getRotatedBoxVertexes(box.vartexes, i), textures[i]);
            });
            BlockRenderer.setStaticICRender(this.id, i + 2, new ICRender.Model(model));
            if(i == 1){
                BlockModeler.setInventoryModel(this.id, model);
            }
        }
    }

    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector {
        const place = BlockRegistry.getPlacePosition(coords, block, region);
        if(!place){
            return;
        }
        region.setBlock(place.x, place.y, place.z, item.id, BlockRegistry.getBlockRotation(player));
        return place;
    }

    getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
        return [[block.id, 1, 0]];
    }

}


BlockRegistry.registerBlock(new BlockRoost("chicken_roost", "Roost"));
Cfg.vanilla_slots && VanillaSlots.registerForTile(BlockID.chicken_roost);
Recipes2.addShaped(BlockID.chicken_roost, "aaa:a_a:bbb", {a: "planks", b: "hay_block"});
