declare const Color: typeof globalAndroid.graphics.Color;
declare const Math_clamp: (value: number, min: number, max: number) => number;
declare const Math_randomInt: (min: number, max: number) => number;
declare class ItemChicken extends ItemCommon implements ItemBehavior {
    private static chickens;
    static isChicken(id: number): boolean;
    static getChickenByIdentifier(identifier: string): ItemChicken;
    static getRoostRecipeListForRV(): RecipePattern[];
    identifier: string;
    private skin;
    private products;
    private parent1;
    private parent2;
    private breedableList;
    constructor(stringID: string, name: string, products: (number | Tile | Recipes2.VanillaID)[]);
    onNameOverride(item: ItemInstance, translation: string, name: string): string;
    setEntityIdentifier(identifier: string): ItemChicken;
    getEntityIdentifier(): string;
    setSkin(skin: string): ItemChicken;
    getSkin(): string;
    getProducts(): Tile[];
    private addBreedableList;
    getBreedableList(): {
        mate: ItemChicken;
        baby: ItemChicken;
    }[];
    getRandomBaby(mate: ItemChicken): Nullable<ItemChicken>;
    setParents(parent1: ItemChicken, parent2: ItemChicken): ItemChicken;
    hasParents(): boolean;
    isBabyOf(parent1: ItemChicken, parent2: ItemChicken): boolean;
    getTier(): number;
    getMinLayTime(): number;
    getMaxLayTime(): number;
}
declare class ChickenStack extends ItemStack {
    static getChickenStack(item: ItemInstance): Nullable<ChickenStack>;
    extra: ItemExtraData;
    get growth(): number;
    set growth(value: number);
    get gain(): number;
    set gain(value: number);
    get strength(): number;
    set strength(value: number);
    constructor(item: ItemInstance);
    get instance(): ItemChicken;
    getLayTime(): number;
    makeBaby(mate: ChickenStack): Nullable<ChickenStack>;
    private calcNewStatusValue;
}
declare namespace ChickenRender {
    const getRenderId: (rotation: number) => number;
}
declare class WindowWithTooltips {
    private static McFontPaint;
    private static FrameTex;
    private static FrameTexCentralColor;
    private static createHighlightBmp;
    private content;
    private winGroup;
    private winMain;
    private winOvl;
    private isReady;
    constructor(content: UI.WindowContent);
    create(): void;
    setTooltipFunc(elemName: string, tooltipFunc: (elem: UI.Element) => string): void;
    slotTooltip(slotElem: UI.Element): string;
    showTooltip(str: string, elem: UI.Element, eventX: number, eventY: number, eventType: UI.TouchEventType): void;
    getWindow(): UI.WindowGroup;
}
declare class ItemCatcher extends ItemCommon implements ToolParams {
    isWeapon: boolean;
    constructor();
    onAttack(item: ItemInstance, entity: number, player: number): boolean;
}
declare namespace Chicken {
    const $vanilla: ItemChicken;
}
declare const UiRoost: WindowWithTooltips;
declare class TileRoost extends TileEntityBase {
    private chickenAnim;
    defaultValues: {
        progress: number;
        layTime: number;
    };
    data: this["defaultValues"];
    getScreenByName(screenName: string): UI.IWindow;
    onInit(): void;
    setupContainer(): void;
    renderChickenModel(show: boolean): void;
    clientLoad(): void;
    clientUnload(): void;
    onTick(): void;
    putResult(item: ItemInstance): boolean;
}
declare class BlockRoost extends BlockBase {
    constructor(stringID: string, name: string);
    private createRoostModel;
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector;
    getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];
}
declare const UiBreeder: WindowWithTooltips;
declare class TileBreeder extends TileEntityBase {
    static seeds: {
        [id: number]: true;
    };
    defaultValues: {
        progress: number;
        layTime: number;
    };
    data: this["defaultValues"];
    getScreenByName(screenName: string): UI.IWindow;
    onInit(): void;
    setupContainer(): void;
    renderModel(): void;
    clientLoad(): void;
    clientUnload(): void;
    onTick(): void;
    putResult(item: ItemInstance): boolean;
}
declare class BlockBreeder extends BlockBase {
    static readonly MODE_DEACTIVE = 0;
    static readonly MODE_ERROR = 1;
    static readonly MODE_ACTIVE = 2;
    static models: [ICRender.Model, ICRender.Model, ICRender.Model];
    constructor(stringID: string, name: string);
    private createBreederModel;
}
declare class TileCollector extends TileEntityBase {
}
declare class BlockCollector extends BlockBase {
    constructor(stringID: string, name: string);
}
declare var RV: RecipeViewerAPI;
