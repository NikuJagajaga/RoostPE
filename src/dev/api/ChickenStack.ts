class ChickenStack extends ItemStack {

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

}