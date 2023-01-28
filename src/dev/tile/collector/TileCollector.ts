class TileCollector extends TileEntityBase {

    private searchOffset = 0;

    getScreenByName(screenName: string): UI.IWindow {
        return UiCollector.getWindow();
    }

    onInit(): void {
        this.setupContainer();
        delete this.liquidStorage;
    }

    setupContainer(): void {
        StorageInterface.setGlobalValidatePolicy(this.container, () => true);
    }

    getNextCoordsList(): Vector[] {

        const coordsList: Vector[] = [];

        for(let x = -4; x <= 4; x++){
            coordsList.push({
                x: this.x + x,
                y: this.y + (this.searchOffset / 9 | 0),
                z: this.z + (this.searchOffset % 9 - 4)
            });
        }

        this.searchOffset++;
        this.searchOffset %= 27;

        return coordsList;

    }

    onTick(): void {

        if((World.getThreadTime() & 3) == 0){

            this.getNextCoordsList().forEach(coords => {

                if(this.blockSource.getBlockId(coords.x, coords.y, coords.z) == BlockID.chicken_roost){

                    const storage = StorageInterface.getStorage(this.blockSource, coords.x, coords.y, coords.z);

                    if(storage){
                        StorageInterface.extractItemsFromStorage(StorageInterface.getInterface(this), storage, -1);
                    }

                }

            });

            this.container.sendChanges();

        }

    }

    @BlockEngine.Decorators.ContainerEvent(Side.Server)
    takeAll(data: string): void {
        StorageInterface.extractItemsFromStorage(new PlayerInventoryInterface(+data), StorageInterface.getInterface(this), -1);
        this.container.sendChanges();
    }

}


StorageInterface.createInterface(BlockID.roost_collector, {
    slots: (() => {
        const slots: {[key: string]: SlotData} = {};
        for(let i = 0; i < 27; i++){
            slots["slot" + i] = {input: true, output: true};
        }
        return slots;
    })()
});


class PlayerInventoryInterface implements Storage {

    readonly container: Container = null;
    readonly isNativeContainer = false;

    readonly player: PlayerEntity;

    constructor(playerUid: number){
        this.player = new PlayerEntity(playerUid);
    }

    getSlot(index: number): ItemInstance {
        return this.player.getInventorySlot(index);
    }

    setSlot(index: number, id: number, count: number, data: number, extra?: ItemExtraData): void {
        this.player.setInventorySlot(index, id, count, data, extra);
    }

    getContainerSlots(): number[] {
        const slots: number[] = [];
        for(let i = 0; i < 36; i++){
            slots.push(i);
        }
        return slots;
    }

    getInputSlots(side?: number): number[] {
        return this.getContainerSlots();
    }

    getOutputSlots(side?: number): number[] {
        return this.getContainerSlots();
    }

    getReceivingItemCount(item: ItemInstance, side?: number): number {
        return 0;
    }

    addItemToSlot(index: number, item: ItemInstance, maxCount?: number): number {
        const slot = this.getSlot(index);
        const added = StorageInterface.addItemToSlot(item, slot, maxCount);
        added > 0 && this.setSlot(index, slot.id, slot.count, slot.data, slot.extra);
        return added;
    }

    addItem(item: ItemInstance, side?: number, maxCount?: number): number {
        const slots = this.getInputSlots(side);
        let count = 0;
        for(let i = 0; i < slots.length; i++){
            count += this.addItemToSlot(i, item, maxCount);
            if(item.count == 0 || count >= maxCount){
                break;
            }
        }
        return count;
    }

    clearContainer(): void {
        const slots = this.getContainerSlots();
        for(let i = 0; i < slots.length; i++){
            this.setSlot(slots[i], 0, 0, 0);
        }
    }

}