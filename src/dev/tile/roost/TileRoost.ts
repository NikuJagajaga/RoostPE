class TileRoost extends TileEntityBase {

    private chickenAnim: Animation.Base;

    getScreenByName(screenName: string): UI.IWindow {
        return UiRoost.getWindow();
    }

    onInit(): void {
        this.networkData.putInt("facing", this.blockSource.getBlockData(this.x, this.y, this.z));
        this.networkData.sendChanges();
        delete this.liquidStorage;
    }

    @BlockEngine.Decorators.ClientSide
    renderChickenModel(show: boolean): void {
        this.chickenAnim?.destroy();
        if(show){
            this.chickenAnim = new Animation.Base(this.x + 0.5, this.y + 0.5, this.z + 0.5);
            this.chickenAnim.describe({
                render: ChickenRender.getRenderId(this.networkData.getInt("facing") - 2),
                skin: "model/roost_chicken/vanilla.png",
                scale: 1
            });
            //this.chickenAnim.setSkylightMode();
            //this.chickenAnim.setIgnoreLightMode();
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

}


