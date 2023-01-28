class TileRoost extends TileEntityBase {

    private chickenAnim: Animation.Base;

    defaultValues = {
        progress: 0,
        layTime: 0
    };

    data: this["defaultValues"];

    getScreenByName(screenName: string): UI.IWindow {
        return UiRoost.getWindow();
    }

    onInit(): void {
        this.networkData.putInt("facing", this.blockSource.getBlockData(this.x, this.y, this.z));
        this.networkData.sendChanges();
        this.setupContainer();
        delete this.liquidStorage;
    }

    setupContainer(): void {
        StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
            if(name == "slotChicken") return ItemChicken.isChicken(id);
            return false;
        });
    }

    @BlockEngine.Decorators.ClientSide
    renderChickenModel(show: boolean): void {
        const skin = this.networkData.getString("chicken_skin");
        const render = ChickenRender.getRenderId(this.networkData.getInt("facing") - 2);
        this.chickenAnim?.destroy();
        if(show && skin != "" && render != -1){
            this.chickenAnim = new Animation.Base(this.x + 0.5, this.y + 0.5, this.z + 0.5);
            this.chickenAnim.describe({render: render, skin: skin, scale: 1});
            this.chickenAnim.load();
        }
    }

    clientLoad(): void {
        this.renderChickenModel(true);
        this.networkData.addOnDataChangedListener((data: SyncedNetworkData, isExternal: boolean) => {
            this.renderChickenModel(true);
        });
    }

    clientUnload(): void {
        this.renderChickenModel(false);
    }

    onTick(): void {

        const slotChicken = this.container.getSlot("slotChicken");
        const chickenStack = ChickenStack.getChickenStack(slotChicken);

        if(chickenStack){

            this.networkData.putString("chicken_skin", chickenStack.instance.getSkin());

            if(this.data.layTime == 0){
                this.data.progress = 0;
                this.data.layTime = chickenStack.getLayTime();
            }
            else{
                this.data.progress += slotChicken.count * Cfg.roost_speed;
                if(this.data.progress >= this.data.layTime && this.putResult(chickenStack.getLayItem())){
                    this.data.progress = 0;
                    this.data.layTime = 0;
                }
            }

        }
        else{

            this.networkData.putString("chicken_skin", "");
            this.data.progress = 0;
            this.data.layTime = 0;

        }

        StorageInterface.checkHoppers(this);

        this.container.setScale("barProgress", this.data.layTime > 0 ? this.data.progress / this.data.layTime : 0);

        this.networkData.sendChanges();
        this.container.sendChanges();

    }

    putResult(item: ItemInstance): boolean {
        let slot: ItemContainerSlot;
        for(let i = 0; i < 4; i++){
            slot = this.container.getSlot("slotOutput" + i);
            if(slot.id == 0 || slot.id == item.id && slot.data == item.data && slot.count + item.count <= Item.getMaxStack(item.id)){
                slot.id = item.id;
                slot.data = item.data;
                slot.count += item.count;
                slot.markDirty();
                return true;
            }
        }
        return false;
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
        if(!Entity.getSneaking(player) && ItemChicken.isChicken(item.id)){
            const slotChicken = this.container.getSlot("slotChicken");
            if(slotChicken.id == 0){
                Entity.setCarriedItem(player, 0, 0, 0);
                slotChicken.setSlot(item.id, item.count, item.data, item.extra);
                slotChicken.markDirty();
                this.container.sendChanges();
                return true;
            }
        }
        return false;
    }

}


StorageInterface.createInterface(BlockID.chicken_roost, {
    slots: {
        slotChicken: {input: true, isValid: item => ItemChicken.isChicken(item.id)},
        slotOutput0: {output: true},
        slotOutput1: {output: true},
        slotOutput2: {output: true},
        slotOutput3: {output: true}
    }
});