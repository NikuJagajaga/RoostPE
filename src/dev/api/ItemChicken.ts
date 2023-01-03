class ItemChicken extends ItemCommon implements ItemBehavior {

    private static chickens: ItemChicken[] = [];

    static isChicken(id: number): boolean {
        return this.chickens.some(chicken => chicken.id == id);
    }

    static getChickenByIdentifier(identifier: string): ItemChicken {
        return this.chickens.find(chicken => chicken.identifier == identifier);
    }


    identifier: string;
    private skin: string;
    private products: Tile[];
    private parent1: ItemChicken;
    private parent2: ItemChicken;
    private breedableList: {mate: ItemChicken, baby: ItemChicken}[];

    constructor(stringID: string, name: string, products: (number | Tile | Recipes2.VanillaID)[]){
        super(stringID, name, stringID, false);
        Item.addToCreative(this.id, 1, 0, new ItemExtraData().putInt("status_growth", 1).putInt("status_gain", 1).putInt("status_strength", 1));
        Item.addCreativeGroup("roost_chicken", "Item Chickens", [this.id]);
        this.setMaxStack(16);
        this.setSkin(`model/roost_chicken/${stringID}.png`);
        this.products = products.map(product => {
            switch(typeof product){
                case "number":
                    return {id: product, data: 0};
                case "string":
                    return IDConverter.getIDData(product);
            }
            return product;
        });
        this.breedableList = [{mate: this, baby: this}];
        ItemChicken.chickens.push(this);
    }

    onNameOverride(item: ItemInstance, translation: string, name: string): string {
        if(item.extra){
            return name + `\nGrowth: ${item.extra.getInt("status_growth")}\nGain: ${item.extra.getInt("status_gain")}\nStrength: ${item.extra.getInt("status_strength")}`;
        }
        return name;
    }

    setEntityIdentifier(identifier: string): ItemChicken {
        this.identifier = identifier;
        return this;
    }
    getEntityIdentifier(): string {
        return this.identifier;
    }

    setSkin(skin: string): ItemChicken {
        this.skin = skin;
        return this;
    }
    getSkin(): string {
        return this.skin;
    }

    getProducts(): Tile[] {
        return this.products;
    }

    private addBreedableList(mate: ItemChicken, baby: ItemChicken): void {
        this.breedableList.push({mate: mate, baby: baby});
    }

    getBreedableList(): {mate: ItemChicken, baby: ItemChicken}[] {
        return this.breedableList;
    }

    getRandomBaby(mate: ItemChicken): Nullable<ItemChicken> {

        if(mate == this) return this;

        const babies = [this, mate, ...this.breedableList.filter(family => family.mate == mate).map(family => family.baby)];

        if(babies.length == 2) return null;

        const maxChance = babies.reduce((pre, cur) => Math.max(pre, cur.getTier()), 0) + 1;
        const maxDiceValue = babies.reduce((pre, cur) => pre + (maxChance - cur.getTier()), 0);
        const diceValue = Math.random() * maxDiceValue | 0;
        let curValue = 0;

        for(let i = 0; i < babies.length; i++){
            curValue += maxChance - babies[i].getTier();
            if(diceValue < curValue){
                return babies[i];
            }
        }

        return null;

    }

    setParents(parent1: ItemChicken, parent2: ItemChicken): ItemChicken {
        parent1.addBreedableList(parent2, this);
        parent2.addBreedableList(parent1, this);
        this.parent1 = parent1;
        this.parent2 = parent2;
        return this;
    }

    hasParents(): boolean {
        return !!this.parent1 && !!this.parent2;
    }

    isBabyOf(parent1: ItemChicken, parent2: ItemChicken): boolean {
        return this.parent1 == parent1 && this.parent2 == parent2 || this.parent1 == parent2 && this.parent2 == parent1;
    }

    getTier(): number {
        if(this.hasParents()){
            return Math.max(this.parent1.getTier(), this.parent2.getTier()) + 1;
        }
        return 1;
    }

    getMinLayTime(): number {
        return Math.max(this.getTier() * 6000, 1) | 0;
    }
    getMaxLayTime(): number {
        return this.getMinLayTime() * 2;
    }

}