class ChickenStack extends ItemStack {

    static getChickenStack(item: ItemInstance): Nullable<ChickenStack> {
        if(ItemChicken.isChicken(item.id)){
            return new ChickenStack(item);
        }
        return null;
    }

    extra: ItemExtraData;

    get growth(): number {
        return this.extra.getInt("status_growth", 0);
    }
    set growth(value: number) {
        this.extra.putInt("status_growth", value);
    }
    get gain(): number {
        return this.extra.getInt("status_gain", 0);
    }
    set gain(value: number) {
        this.extra.putInt("status_gain", value);
    }
    get strength(): number {
        return this.extra.getInt("status_strength", 0);
    }
    set strength(value: number) {
        this.extra.putInt("status_strength", value);
    }

    constructor(item: ItemInstance){
        super(item);
        this.extra ??= new ItemExtraData();
        this.growth = this.growth || 1;
        this.gain = this.gain || 1;
        this.strength = this.strength || 1;
    }

    get instance(): ItemChicken {
        return this.getItemInstance() as ItemChicken;
    }

    getLayTime(): number {
        let time = Math_randomInt(this.instance.getMinLayTime(), this.instance.getMaxLayTime());
        time = Math.max(1, (time * (10 - this.growth + 1)) / 10);
        return time;
    }

    getLayItem(): ItemInstance {
        const products = this.instance.getProducts();
        const item = products[Math.random() * products.length | 0];
        return {...item, count: this.gain >= 10 ? 3 : this.gain >= 5 ? 2 : 1};
    }

    makeBaby(mate: ChickenStack): Nullable<ChickenStack> {

        const babyData = this.instance.getRandomBaby(mate.instance);

        if(!babyData){
            return null;
        }

        const baby = new ChickenStack({id: babyData.id, count: 1, data: 0});

        if(this.instance == mate.instance && this.instance == babyData){
            baby.growth = this.calcNewStatusValue(mate, mate.growth, this.growth);
            baby.gain = this.calcNewStatusValue(mate, mate.gain, this.gain);
            baby.strength = this.calcNewStatusValue(mate, mate.strength, this.strength);
        }
        else if(babyData == this.instance){
            baby.growth = this.growth;
            baby.gain = this.gain;
            baby.strength = this.strength;
        }
        else if(babyData == mate.instance){
            baby.growth = mate.growth;
            baby.gain = mate.gain;
            baby.strength = mate.strength;
        }

        return baby;

    }

    private calcNewStatusValue(mate: ChickenStack, stat1: number, stat2: number): number {
        const mutation = (Math.random() * 2 | 0) + 1;
        const newValue = (stat1 * this.strength + stat2 * mate.strength) / (this.strength + mate.strength) + mutation;
        return Math_clamp(newValue, 1, 10);
    }

}