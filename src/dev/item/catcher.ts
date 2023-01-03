class ItemCatcher extends ItemCommon implements ToolParams {

    isWeapon: boolean;

    constructor(){
        super("chicken_catcher", "Chicken Catcher", "chicken_catcher", true);
        this.setMaxStack(1);
        this.setMaxDamage(64);
        this.setHandEquipped(true);
        this.setCategory(ItemCategory.EQUIPMENT);
        this.isWeapon = true;
        ToolAPI.registerTool(this.id, {efficiency: 0, damage: 0, durability: this.maxDamage, level: 0}, [], this);
    }

    onAttack(item: ItemInstance, entity: number, player: number): boolean {

        const type = Entity.getTypeName(entity);
        const chicken = ItemChicken.getChickenByIdentifier(type.split("<")[0]);

        if(chicken){

            //const age = Entity.getAge(entity);
            const pos = Entity.getPosition(entity);
            const extra = new ItemExtraData();

            extra.putInt("status_growth", 1)
                .putInt("status_gain", 1)
                .putInt("status_strength", 1);

            Entity.remove(entity);
            Entity.addVelocity(World.drop(pos.x, pos.y, pos.z, chicken.id, 1, 0, extra), 0, 0.2, 0);

            for(let i = 0; i < 20; i++){
                Particles.addParticle(EParticleType.REDSTONE,
                    pos.x + Math.random() * 0.6 - 0.3,
                    pos.y + Math.random() * 0.6,
                    pos.z + Math.random() * 0.6 - 0.3,
                    Math.random() * 0.02,
                    Math.random() * 0.2,
                    Math.random() * 0.02
                );
            }

            return false;

        }

        return true;

    }

}


ItemRegistry.registerItem(new ItemCatcher());
Recipes2.addShaped(ItemID.chicken_catcher, "a:b:c", {a: "egg", b: "stick", c: "feather"});