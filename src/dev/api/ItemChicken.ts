class ItemChicken extends ItemCommon implements ItemBehavior {

    private static chickens: {[id: number]: true} = {};

    static isExists(id: number): boolean {
        return this.chickens[id] || false;
    }

    private skin: string;
    private products: Tile[];
    private parent1: ItemChicken;
    private parent2: ItemChicken;
    private breedableList: {mate: ItemChicken, baby: ItemChicken}[];

    constructor(stringID: string, name: string, products: (number | Tile)[]){
        super(stringID, name, stringID);
        this.setMaxStack(16);
        this.setSkin(`model/roost_chicken/${stringID}.png`);
        this.products = products.map(product => typeof product == "number" ? {id: product, data: 0} : product);
        this.breedableList = [{mate: this, baby: this}];
        ItemChicken.chickens[this.id] = true;
    }

    onNameOverride(item: ItemInstance, translation: string, name: string): string {
        if(item.extra){
            return name + `\nGrowth: ${item.extra.getInt("status_growth")}\nGain: ${item.extra.getInt("status_gain")}\nStrength: ${item.extra.getInt("status_strength")}`;
        }
        return name;
    }

    setSkin(skin: string): void {
        this.skin = skin;
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

    private getBreedableList(): {mate: ItemChicken, baby: ItemChicken}[] {
        return this.breedableList;
    }

    getBabies(mate: ItemChicken): ItemChicken[] {
        return this.breedableList.filter(family => family.mate == mate).map(family => family.baby);
    }

    getRandomBaby(mate: ItemChicken): Nullable<ItemChicken> {

        const families = this.getBabies(mate);

        if(families.length == 0) return null;
        if(families.length == 1) return families[0];

        const maxChance = families.reduce((pre, cur) => Math.max(pre, cur.getTier()), 0) + 1;
        const maxDiceValue = families.reduce((pre, cur) => pre + (maxChance - cur.getTier()), 0);
        const diceValue = Math.random() * maxDiceValue | 0;
        let curValue = 0;

        for(let i = 0; i < families.length; i++){
            curValue += maxChance - families[i].getTier();
            if(diceValue < curValue){
                return families[i];
            }
        }

        return null;

    }

    setParents(parent1: ItemChicken, parent2: ItemChicken): void {
        parent1.addBreedableList(parent2, this);
        parent2.addBreedableList(parent1, this);
        this.parent1 = parent1;
        this.parent2 = parent2;
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