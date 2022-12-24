class ItemCatcher extends ItemCommon implements ToolParams {

    private static chickens: {[identifier: string]: ItemChicken} = {};

    static registerChicken(identifier: string, chicken: ItemChicken): void {
        this.chickens[identifier] = chicken;
    }

    static getChickenData(identifier: string): ItemChicken {
        return this.chickens[identifier] || null;
    }

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

        Game.message(type);

        const chicken = ItemCatcher.getChickenData(type.split("<")[0]);

        if(chicken){

            //const age = Entity.getAge(entity);
            const pos = Entity.getPosition(entity);
            const extra = new ItemExtraData();

            extra.putInt("status_growth", 1)
                .putInt("status_gain", 1)
                .putInt("status_strength", 1);

            Entity.addVelocity(World.drop(pos.x, pos.y, pos.z, chicken.id, 1, 0, extra), 0, 0.2, 0);
            Entity.remove(entity);

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

const vanilla = new ItemChicken("chicken_vanilla", "Vanilla Chicken", [VanillaItemID.feather, VanillaItemID.egg]);
ItemRegistry.registerItem(vanilla);

ItemCatcher.registerChicken("minecraft:chicken", vanilla);