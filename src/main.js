var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
IMPORT("BlockEngine");
IMPORT("StorageInterface");
IMPORT("VanillaSlots");
IMPORT("EnhancedRecipes");
var Color = android.graphics.Color;
var Math_clamp = function (value, min, max) { return Math.min(Math.max(value, min), max); };
var ChickenItem = /** @class */ (function (_super) {
    __extends(ChickenItem, _super);
    function ChickenItem(stringID, name, products) {
        var _this = _super.call(this, stringID, name, stringID) || this;
        _this.products = products;
        return _this;
    }
    ChickenItem.prototype.onNameOverride = function (item, translation, name) {
        if (item.extra) {
            //item.extra.getInt("status_growth");
            //item.extra.getInt("status_gain");
            //item.extra.getInt("status_strength");
        }
        return name;
    };
    ChickenItem.prototype.getProducts = function () {
        return this.products;
    };
    ChickenItem.prototype.addBreedableList = function (mate, baby) {
        this.breedableList.push({ mate: mate, baby: baby });
    };
    ChickenItem.prototype.getBreedableList = function () {
        return this.breedableList;
    };
    ChickenItem.prototype.setParents = function (parent1, parent2) {
        parent1.addBreedableList(parent2, this);
        parent2.addBreedableList(parent1, this);
        this.parent1 = parent1;
        this.parent2 = parent2;
    };
    ChickenItem.prototype.hasParents = function () {
        return !!this.parent1 && !!this.parent2;
    };
    ChickenItem.prototype.isChildOf = function (parent1, parent2) {
        return this.parent1 == parent1 && this.parent2 == parent2 || this.parent1 == parent2 && this.parent2 == parent1;
    };
    ChickenItem.prototype.getTier = function () {
        if (this.hasParents()) {
            return Math.max(this.parent1.getTier(), this.parent2.getTier()) + 1;
        }
        return 1;
    };
    ChickenItem.prototype.getMinLayTime = function () {
        return Math.max(this.getTier() * 6000, 1) | 0;
    };
    ChickenItem.prototype.getMaxLayTime = function () {
        return this.getMinLayTime() * 2;
    };
    return ChickenItem;
}(ItemCommon));
var ChickenStack = /** @class */ (function (_super) {
    __extends(ChickenStack, _super);
    function ChickenStack(item) {
        var _this = this;
        var _a;
        _this = _super.call(this, item) || this;
        (_a = _this.extra) !== null && _a !== void 0 ? _a : (_this.extra = new ItemExtraData());
        _this.growth = _this.growth || 1;
        _this.gain = _this.gain || 1;
        _this.strength = _this.strength || 1;
        return _this;
    }
    Object.defineProperty(ChickenStack.prototype, "growth", {
        get: function () {
            return this.extra.getInt("status_growth", 0);
        },
        set: function (value) {
            this.extra.putInt("status_growth", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChickenStack.prototype, "gain", {
        get: function () {
            return this.extra.getInt("status_gain", 0);
        },
        set: function (value) {
            this.extra.putInt("status_gain", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChickenStack.prototype, "strength", {
        get: function () {
            return this.extra.getInt("status_strength", 0);
        },
        set: function (value) {
            this.extra.putInt("status_strength", value);
        },
        enumerable: false,
        configurable: true
    });
    return ChickenStack;
}(ItemStack));
/*
namespace ChickenRegistry {

    const chickenData: {[entityType: string]: ChickenClass} = {};

    export const registerChicken = (entityType: string, chicken: ChickenClass): void => {
        chickenData[entityType] = chicken;
    }

    export const existsChicken = (entityType: string): boolean =>
        entityType in chickenData;

    export const getChicken = (entityType: string): ChickenClass =>
        chickenData[entityType];

}
*/ 
var ChickenRender;
(function (ChickenRender) {
    var renders = [
        new Render(),
        new Render(),
        new Render(),
        new Render()
    ];
    renders.forEach(function (render, i) {
        render.getPart("body").addPart("chicken");
        render.setPart("chicken", [
            {
                uv: { x: 0, y: 0 },
                coords: { x: 0, y: 23, z: -4.5 },
                size: { x: 4, y: 6, z: 3 }
            },
            {
                uv: { x: 14, y: 0 },
                coords: { x: 0, y: 23, z: -7 },
                size: { x: 4, y: 2, z: 2 }
            },
            {
                uv: { x: 14, y: 4 },
                coords: { x: 0, y: 25, z: -6 },
                size: { x: 2, y: 2, z: 2 }
            },
            {
                uv: { x: 0, y: 9 },
                coords: { x: 0, y: 27, z: 0 },
                size: { x: 6, y: 6, z: 8 }
            },
            {
                uv: { x: 24, y: 13 },
                coords: { x: -3.5, y: 26, z: 0 },
                size: { x: 1, y: 4, z: 6 }
            },
            {
                uv: { x: 24, y: 13 },
                coords: { x: 3.5, y: 26, z: 0 },
                size: { x: 1, y: 4, z: 6 }
            }
        ], { rotation: { x: 0, y: [Math.PI, 0, -Math.PI / 2, Math.PI / 2][i], z: 0 }, width: 64, height: 32 });
    });
    ChickenRender.getRenderId = function (rotation) {
        if (rotation === 0 || rotation === 1 || rotation === 2 || rotation === 3) {
            return renders[rotation].getId();
        }
        alert(rotation);
        return -1;
    };
})(ChickenRender || (ChickenRender = {}));
var WindowWithTooltips = /** @class */ (function () {
    function WindowWithTooltips(content) {
        var _this = this;
        var _b;
        (_b = content.location) !== null && _b !== void 0 ? _b : (content.location = { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() });
        content.elements["_frameForTouch"] = {
            type: "frame",
            x: 0,
            y: 0,
            z: -1,
            width: 1000,
            height: content.location.height / content.location.width * 1000,
            bitmap: "_default_slot_empty",
            onTouchEvent: function (elem, event) {
                var eventX = event.x;
                var eventY = event.y;
                var eventType = event.type;
                var elems = elem.window.getElements();
                var it = elems.values().iterator();
                var e;
                while (it.hasNext()) {
                    e = it.next();
                    if (e.source) {
                        event.preparePosition(e.window, e.elementRect);
                        if (event.localX > 0 && event.localY > 0 && event.localX < 1 && event.localY < 1) {
                            _this.showTooltips(Item.getName(e.source.id, e.source.data), e, eventX, eventY, eventType);
                            break;
                        }
                    }
                }
            }
        };
        this.winGroup = new UI.WindowGroup();
        this.winMain = new UI.Window(content);
        this.winOvl = new UI.Window({
            location: { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() },
            elements: {
                _ttText: { type: "text", x: 0, y: -1000, z: 1, font: { color: Color.WHITE, size: 16, shadow: 0.5 }, multiline: true },
                _ttFrame: { type: "image", x: 0, y: -1000, width: 64, height: 64, scale: 1, bitmap: "workbench_frame3" },
                _highlight: { type: "image", x: -1000, y: -1000, z: -1, width: 64, height: 64, scale: 1, bitmap: "_selection" }
            }
        });
        this.winMain.setBackgroundColor(Color.TRANSPARENT);
        this.winOvl.setBackgroundColor(Color.TRANSPARENT);
        this.winMain.setInventoryNeeded(true);
        this.winMain.setBlockingBackground(true);
        this.winOvl.setTouchable(false);
        this.winOvl.setAsGameOverlay(true);
        this.winGroup.addWindowInstance("main", this.winMain);
        this.winGroup.addWindowInstance("ovl", this.winOvl);
        this.winGroup.setCloseOnBackPressed(true);
    }
    WindowWithTooltips.prototype.getWindow = function () {
        return this.winGroup;
    };
    WindowWithTooltips.createHighlightBmp = function (w, h) {
        var bitmap = new android.graphics.Bitmap.createBitmap(w | 0, h | 0, android.graphics.Bitmap.Config.ARGB_8888);
        var canvas = new android.graphics.Canvas(bitmap);
        canvas.drawARGB(127, 255, 255, 255);
        return bitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
    };
    WindowWithTooltips.prototype.showTooltips = function (str, elem, eventX, eventY, eventType) {
        var location = elem.window.getLocation();
        var ovlElems = this.winOvl.getElements();
        var ttText = ovlElems.get("_ttText");
        var ttFrame = ovlElems.get("_ttFrame");
        var highlight = ovlElems.get("_highlight");
        var MOVEtoLONG_CLICK = eventType == "LONG_CLICK" && ttFrame.x !== -1000 && ttFrame.y !== -1000;
        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;
        if (str && (eventType == "MOVE" || MOVEtoLONG_CLICK)) {
            try {
                x = location.x + location.windowToGlobal(elem.x) | 0;
                y = location.y + location.windowToGlobal(elem.y) | 0;
                w = location.windowToGlobal(elem.elementRect.width()) | 0;
                h = location.windowToGlobal(elem.elementRect.height()) | 0;
                if (highlight.elementRect.width() !== w || highlight.elementRect.height() !== h) {
                    highlight.texture = new UI.Texture(WindowWithTooltips.createHighlightBmp(w, h));
                    highlight.setSize(w, h);
                }
                highlight.setPosition(x, y);
                var split = str.split("\n");
                w = Math.max.apply(Math, split.map(function (s) { return WindowWithTooltips.McFontPaint.measureText(s); })) + 20;
                h = split.length * 18 + 16;
                x = location.x + location.windowToGlobal(eventX);
                y = location.y + location.windowToGlobal(eventY) - h - 50;
                if (y < -10) {
                    y = location.y + location.windowToGlobal(eventY) + 70;
                }
                if (ttFrame.elementRect.width() !== w || ttFrame.elementRect.height() !== h) {
                    ttFrame.texture = new UI.Texture(WindowWithTooltips.FrameTex.expandAndScale(w, h, 1, WindowWithTooltips.FrameTexCentralColor));
                    ttFrame.setSize(w, h);
                }
                ttText.setPosition(Math_clamp(x - w / 2, 0, 1000 - w) + 10, y + 7);
                ttText.setBinding("text", str);
                ttFrame.setPosition(Math_clamp(x - w / 2, 0, 1000 - w), y);
                if (!Threading.getThread("wwt_showTooltips")) {
                    Threading.initThread("wwt_showTooltips", function () {
                        while (elem.isTouched) {
                            java.lang.Thread.sleep(200);
                        }
                        ttText.setPosition(-1000, -1000);
                        ttFrame.setPosition(-1000, -1000);
                        highlight.setPosition(-1000, -1000);
                    });
                }
            }
            catch (e) {
                alert("touch\n" + e);
            }
        }
        else {
            ttText.setPosition(-1000, -1000);
            ttFrame.setPosition(-1000, -1000);
            highlight.setPosition(-1000, -1000);
        }
    };
    var _a;
    _a = WindowWithTooltips;
    WindowWithTooltips.McFontPaint = (function () {
        var paint = new android.graphics.Paint();
        paint.setTypeface(WRAP_JAVA("com.zhekasmirnov.innercore.utils.FileTools").getMcTypeface());
        paint.setTextSize(16);
        return paint;
    })();
    WindowWithTooltips.FrameTex = UI.FrameTextureSource.get("workbench_frame3");
    WindowWithTooltips.FrameTexCentralColor = _a.FrameTex.getCentralColor();
    return WindowWithTooltips;
}());
var UiRoost = new WindowWithTooltips({
    location: (function () {
        var loc = { x: 0, y: 0, width: 0, height: 0 };
        var ratio = { w: 4, h: 3 };
        loc.height = UI.getScreenHeight();
        loc.width = loc.height / ratio.h * ratio.w;
        if (loc.width > 1000) {
            loc.width = 1000;
            loc.height = loc.width / ratio.w * ratio.h;
        }
        loc.x = (1000 - loc.width) / 2;
        return loc;
    })(),
    params: { slot: "classic_slot", inv_slot: "classic_slot" },
    drawing: [
        { type: "frame", x: 0, y: 0, width: 1000, height: 750, bitmap: "classic_frame_bg_light", scale: 4 },
        { type: "text", x: 50, y: 60, text: "Roost", font: { color: Color.BLACK, size: 32 } },
        { type: "text", x: 50, y: 290, text: "Inventory", font: { color: Color.BLACK, size: 32 } },
        { type: "bitmap", x: 278, y: 116, bitmap: "roost.bar_roost_bg", scale: 5.5 }
    ],
    elements: __assign({ buttonClose: { type: "closeButton", x: 928, y: 12, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 4 }, barProgress: { type: "scale", x: 278, y: 116, bitmap: "roost.bar_roost", scale: 5.5 }, slotChicken: { type: "slot", x: 150, y: 110, size: 100, bitmap: "roost.slot" }, slotOutput0: { type: "slot", x: 450, y: 110, size: 100 }, slotOutput1: { type: "slot", x: 550, y: 110, size: 100 }, slotOutput2: { type: "slot", x: 650, y: 110, size: 100 }, slotOutput3: { type: "slot", x: 750, y: 110, size: 100 } }, (function () {
        var elems = {};
        var x = 0;
        var y = 0;
        for (var i = 0; i < 36; i++) {
            x = 50 + (i % 9) * 100;
            y = i < 9 ? 620 : 300 + ((i - 9) / 9 | 0) * 100;
            elems["invSlot" + i] = { type: "invSlot", x: x, y: y, z: 1, size: 100, index: i };
        }
        return elems;
    })())
});
var TileRoost = /** @class */ (function (_super) {
    __extends(TileRoost, _super);
    function TileRoost() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TileRoost.prototype.getScreenByName = function (screenName) {
        return UiRoost.getWindow();
    };
    TileRoost.prototype.onInit = function () {
        this.networkData.putInt("facing", this.blockSource.getBlockData(this.x, this.y, this.z));
        this.networkData.sendChanges();
        delete this.liquidStorage;
    };
    TileRoost.prototype.renderChickenModel = function (show) {
        var _a;
        (_a = this.chickenAnim) === null || _a === void 0 ? void 0 : _a.destroy();
        if (show) {
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
    };
    TileRoost.prototype.clientLoad = function () {
        var _this = this;
        this.renderChickenModel(true);
        this.networkData.addOnDataChangedListener(function (data, isExternal) {
            _this.renderChickenModel(true);
        });
    };
    TileRoost.prototype.clientUnload = function () {
        this.renderChickenModel(false);
    };
    __decorate([
        BlockEngine.Decorators.ClientSide
    ], TileRoost.prototype, "renderChickenModel", null);
    return TileRoost;
}(TileEntityBase));
var BlockRoost = /** @class */ (function (_super) {
    __extends(BlockRoost, _super);
    function BlockRoost(stringID, name) {
        var _this = _super.call(this, stringID, "wood") || this;
        _this.addVariation(name, [["roost_plain", 0]], true);
        _this.createRoostModel();
        _this.registerTileEntity(new TileRoost());
        return _this;
    }
    BlockRoost.prototype.createRoostModel = function () {
        var boxes = [
            { vartexes: [0, 0, 0, 1, 3 / 16, 1], texture: ["plain", "floor", "plain", "curtain", "plain", "plain"].map(function (str) { return ["roost_" + str, 0]; }) },
            { vartexes: [0, 13 / 16, 0, 1, 1, 1], texture: ["plain", "plain", "plain", "curtain", "plain", "plain"].map(function (str) { return ["roost_" + str, 0]; }) },
            { vartexes: [13 / 16, 3 / 16, 0, 1, 13 / 16, 1], texture: ["plain", "plain", "plain", "curtain", "plain", "inside"].map(function (str) { return ["roost_" + str, 0]; }) },
            { vartexes: [0, 3 / 16, 0, 3 / 16, 13 / 16, 1], texture: ["plain", "plain", "plain", "curtain", "inside", "plain"].map(function (str) { return ["roost_" + str, 0]; }) },
            { vartexes: [3 / 16, 3 / 16, 13 / 16, 13 / 16, 13 / 16, 1], texture: ["plain", "plain", "plain", "inside", "plain", "plain"].map(function (str) { return ["roost_" + str, 0]; }) }
        ];
        var model;
        var _loop_1 = function (i) {
            model = BlockRenderer.createModel();
            boxes.forEach(function (box) {
                var textures = [
                    [box.texture[0], box.texture[1], box.texture[3], box.texture[2], box.texture[5], box.texture[4]],
                    [box.texture[0], box.texture[1], box.texture[2], box.texture[3], box.texture[4], box.texture[5]],
                    [box.texture[0], box.texture[1], box.texture[4], box.texture[5], box.texture[3], box.texture[2]],
                    [box.texture[0], box.texture[1], box.texture[5], box.texture[4], box.texture[2], box.texture[3]]
                ];
                model.addBox.apply(model, __spreadArray(__spreadArray([], BlockModeler.getRotatedBoxVertexes(box.vartexes, i), false), [textures[i]], false));
            });
            BlockRenderer.setStaticICRender(this_1.id, i + 2, new ICRender.Model(model));
            if (i === 1) {
                BlockModeler.setInventoryModel(this_1.id, model);
            }
        };
        var this_1 = this;
        for (var i = 0; i < 4; i++) {
            _loop_1(i);
        }
    };
    BlockRoost.prototype.onPlace = function (coords, item, block, player, region) {
        var place = BlockRegistry.getPlacePosition(coords, block, region);
        if (!place) {
            return;
        }
        region.setBlock(place.x, place.y, place.z, item.id, BlockRegistry.getBlockRotation(player));
        return place;
    };
    BlockRoost.prototype.getDrop = function (coords, block, level, enchant, item, region) {
        return [[block.id, 1, 0]];
    };
    return BlockRoost;
}(BlockBase));
BlockRegistry.registerBlock(new BlockRoost("chicken_roost", "Roost"));
VanillaSlots.registerForTile(BlockID.chicken_roost);
