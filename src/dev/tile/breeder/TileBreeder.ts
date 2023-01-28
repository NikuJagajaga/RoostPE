class TileBreeder extends TileEntityBase {

    static seeds: {[id: number]: true} = {
        [VanillaItemID.wheat_seeds]: true,
        [VanillaItemID.pumpkin_seeds]: true,
        [VanillaItemID.melon_seeds]: true,
        [VanillaItemID.beetroot_seeds]: true
    };

    defaultValues = {
        progress: 0,
        layTime: 0
    };

    data: this["defaultValues"];

    getScreenByName(screenName: string): UI.IWindow {
        return UiBreeder.getWindow();
    }

    onInit(): void {
        this.setupContainer();
        delete this.liquidStorage;
    }

    setupContainer(): void {
        StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
            if(name == "slotSeed") return TileBreeder.seeds[id];
            if(name == "slotBase" || name == "slotMate") return ItemChicken.isChicken(id);
            return false;
        });
    }

    @BlockEngine.Decorators.ClientSide
    renderModel(): void {
        const mode = this.networkData.getInt("mode");
        if(mode == BlockBreeder.MODE_DEACTIVE){
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        }
        else{
            BlockRenderer.mapAtCoords(this.x, this.y, this.z, BlockBreeder.models[mode]);
        }
    }

    clientLoad(): void {
        this.renderModel();
        this.networkData.addOnDataChangedListener((data: SyncedNetworkData, isExternal: boolean) => {
            this.renderModel();
        });
    }

    clientUnload(): void {
        this.renderModel();
    }

    onTick(): void {

        const slotBase = this.container.getSlot("slotBase");
        const slotMate = this.container.getSlot("slotMate");
        const baseStack = ChickenStack.getChickenStack(slotBase);
        const mateStack = ChickenStack.getChickenStack(slotMate);
        let mode: 0 | 1 | 2 = BlockBreeder.MODE_DEACTIVE;

        if(baseStack && mateStack){

            const slotSeed = this.container.getSlot("slotSeed");

            if(TileBreeder.seeds[slotSeed.id] && slotSeed.count >= 2){

                if(this.data.layTime == 0){
                    this.data.progress = 0;
                    this.data.layTime = Math.max(baseStack.getLayTime(), mateStack.getLayTime());
                }
                else{
                    this.data.progress += Math.min(slotBase.count, slotMate.count) * Cfg.breeder_speed;
                    if(this.data.progress >= this.data.layTime){
                        const babyStack = baseStack.makeBaby(mateStack);
                        if(babyStack){
                            if(this.putResult(babyStack)){
                                slotSeed.count -= 2;
                                slotSeed.markDirty();
                                slotSeed.validate();
                                this.data.progress = 0;
                                this.data.layTime = 0;
                            }
                        }
                        else{
                            this.data.progress = 0;
                            this.data.layTime = 0;
                        }
                    }
                }

                mode = BlockBreeder.MODE_ACTIVE;

            }
            else{
                mode = BlockBreeder.MODE_ERROR;
            }
        }

        if(mode != BlockBreeder.MODE_ACTIVE){
            this.data.progress = 0;
            this.data.layTime = 0;
        }

        StorageInterface.checkHoppers(this);

        this.networkData.putInt("mode", mode);
        this.container.setScale("barProgress", this.data.layTime > 0 ? this.data.progress / this.data.layTime : 0);

        this.networkData.sendChanges();
        this.container.sendChanges();

    }

    putResult(item: ItemInstance): boolean {
        let slot: ItemContainerSlot;
        for(let i = 0; i < 3; i++){
            slot = this.container.getSlot("slotOutput" + i);
            if(slot.id == 0){
                slot.id = item.id;
                slot.count = item.count;
                slot.data = item.data;
                slot.extra = item.extra;
                slot.markDirty();
                return true;
            }
        }
        return false;
    }

}


StorageInterface.createInterface(BlockID.chicken_breeder, {
    slots: {
        slotSeed: {input: true, isValid: item => TileBreeder.seeds[item.id]},
        slotBase: {input: true, isValid: item => ItemChicken.isChicken(item.id)},
        slotMate: {input: true, isValid: item => ItemChicken.isChicken(item.id)},
        slotOutput0: {output: true},
        slotOutput1: {output: true},
        slotOutput2: {output: true}
    }
});