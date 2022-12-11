class ChickenItem extends ItemCommon implements ItemBehavior {

    private products: Tile[];
    private parent1: ChickenItem;
    private parent2: ChickenItem;
    private breedableList: {mate: ChickenItem, baby: ChickenItem}[];

    constructor(stringID: string, name: string, products: Tile[]){
        super(stringID, name, stringID);
        this.products = products;
    }

    onNameOverride(item: ItemInstance, translation: string, name: string): string {
        if(item.extra){
            //item.extra.getInt("status_growth");
            //item.extra.getInt("status_gain");
            //item.extra.getInt("status_strength");
        }
        return name;
    }

    getProducts(): Tile[] {
        return this.products;
    }

    private addBreedableList(mate: ChickenItem, baby: ChickenItem): void {
        this.breedableList.push({mate: mate, baby: baby});
    }

    private getBreedableList(): {mate: ChickenItem, baby: ChickenItem}[] {
        return this.breedableList;
    }

    setParents(parent1: ChickenItem, parent2: ChickenItem): void {
        parent1.addBreedableList(parent2, this);
        parent2.addBreedableList(parent1, this);
        this.parent1 = parent1;
        this.parent2 = parent2;
    }

    hasParents(): boolean {
        return !!this.parent1 && !!this.parent2;
    }

    isChildOf(parent1: ChickenItem, parent2: ChickenItem): boolean {
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