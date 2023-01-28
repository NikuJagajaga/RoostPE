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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
IMPORT("BlockEngine");
IMPORT("StorageInterface");
IMPORT("VanillaSlots");
IMPORT("EnhancedRecipes");
var Color = android.graphics.Color;
var Math_clamp = function (value, min, max) { return Math.min(Math.max(value, min), max); };
var Math_randomInt = function (min, max) { return min + (Math.random() * (max - min)) | 0; };
var Cfg = {
    vanilla_slots: __config__.getBool("vanilla_slots"),
    roost_speed: __config__.getNumber("roost_speed").intValue(),
    breeder_speed: __config__.getNumber("breeder_speed").intValue()
};
var ItemChicken = /** @class */ (function (_super) {
    __extends(ItemChicken, _super);
    function ItemChicken(stringID, name, products) {
        var _this = _super.call(this, stringID, name, stringID, false) || this;
        Item.addToCreative(_this.id, 1, 0, new ItemExtraData().putInt("status_growth", 1).putInt("status_gain", 1).putInt("status_strength", 1));
        Item.addCreativeGroup("roost_chicken", "Item Chickens", [_this.id]);
        _this.setMaxStack(16);
        _this.setSkin("model/roost_chicken/".concat(stringID, ".png"));
        _this.products = products.map(function (product) {
            switch (typeof product) {
                case "number":
                    return { id: product, data: 0 };
                case "string":
                    return IDConverter.getIDData(product);
            }
            return product;
        });
        _this.breedableList = [];
        ItemChicken.chickens.push(_this);
        return _this;
    }
    ItemChicken.isChicken = function (id) {
        return this.chickens.some(function (chicken) { return chicken.id == id; });
    };
    ItemChicken.getChickenByIdentifier = function (identifier) {
        return this.chickens.find(function (chicken) { return chicken.identifier == identifier; });
    };
    ItemChicken.getRoostRecipeListForRV = function () {
        return this.chickens.map(function (chicken) { return ({
            input: [{ id: chicken.id, count: 1, data: 0 }],
            output: chicken.getProducts().map(function (product) { return (__assign(__assign({}, product), { count: 1 })); })
        }); });
    };
    ItemChicken.getBreederRecipeListForRV = function () {
        return this.chickens.filter(function (chicken) { return chicken.hasParents(); }).map(function (chicken) {
            var babies = __spreadArray([
                chicken.parent1,
                chicken.parent2
            ], chicken.parent1.getBreedableList().filter(function (family) { return family.mate == chicken.parent2; }).map(function (family) { return family.baby; }), true);
            var maxChance = babies.reduce(function (max, baby) { return Math.max(max, baby.getTier()); }, 0) + 1;
            var maxDiceValue = babies.reduce(function (sum, baby) { return sum + (maxChance - baby.getTier()); }, 0);
            return {
                input: [
                    { id: VanillaItemID.wheat_seeds, count: 1, data: 0 },
                    { id: chicken.parent1.id, count: 1, data: 0, tips: { chance: (maxChance - chicken.parent1.getTier()) / maxDiceValue } },
                    { id: chicken.parent2.id, count: 1, data: 0, tips: { chance: (maxChance - chicken.parent2.getTier()) / maxDiceValue } }
                ],
                output: [
                    { id: chicken.id, count: 1, data: 0, tips: { chance: (maxChance - chicken.getTier()) / maxDiceValue } }
                ]
            };
        });
    };
    ItemChicken.prototype.onNameOverride = function (item, translation, name) {
        if (item.extra) {
            return name + "\nGrowth: ".concat(item.extra.getInt("status_growth"), "\nGain: ").concat(item.extra.getInt("status_gain"), "\nStrength: ").concat(item.extra.getInt("status_strength"));
        }
        return name;
    };
    ItemChicken.prototype.onItemUse = function (coords, item, block, player) {
        if (this.identifier && Entity.getSneaking(player)) {
            var chickenStack = new ChickenStack(item);
            if (chickenStack.growth == 1 && chickenStack.gain == 1 && chickenStack.strength == 1) {
                Entity.setCarriedItem(player, item.id, item.count - 1, item.data, item.extra);
                Commands.exec("/summon ".concat(this.identifier, " ").concat(coords.relative.x, " ").concat(coords.relative.y, " ").concat(coords.relative.z));
            }
        }
    };
    ItemChicken.prototype.setEntityIdentifier = function (identifier) {
        this.identifier = identifier;
        return this;
    };
    ItemChicken.prototype.getEntityIdentifier = function () {
        return this.identifier;
    };
    ItemChicken.prototype.setSkin = function (skin) {
        this.skin = skin;
        return this;
    };
    ItemChicken.prototype.getSkin = function () {
        return this.skin;
    };
    ItemChicken.prototype.getProducts = function () {
        return this.products;
    };
    ItemChicken.prototype.addBreedableList = function (mate, baby) {
        this.breedableList.push({ mate: mate, baby: baby });
    };
    ItemChicken.prototype.getBreedableList = function () {
        return this.breedableList;
    };
    ItemChicken.prototype.getRandomBaby = function (mate) {
        if (mate == this)
            return this;
        var babies = __spreadArray([this, mate], this.breedableList.filter(function (family) { return family.mate == mate; }).map(function (family) { return family.baby; }), true);
        if (babies.length == 2)
            return null;
        var maxChance = babies.reduce(function (max, baby) { return Math.max(max, baby.getTier()); }, 0) + 1;
        var maxDiceValue = babies.reduce(function (sum, baby) { return sum + (maxChance - baby.getTier()); }, 0);
        var diceValue = Math.random() * maxDiceValue | 0;
        var curValue = 0;
        for (var i = 0; i < babies.length; i++) {
            curValue += maxChance - babies[i].getTier();
            if (diceValue < curValue) {
                return babies[i];
            }
        }
        return null;
    };
    ItemChicken.prototype.setParents = function (parent1, parent2) {
        parent1.addBreedableList(parent2, this);
        parent2.addBreedableList(parent1, this);
        this.parent1 = parent1;
        this.parent2 = parent2;
        return this;
    };
    ItemChicken.prototype.hasParents = function () {
        return !!this.parent1 && !!this.parent2;
    };
    ItemChicken.prototype.isBabyOf = function (parent1, parent2) {
        return this.parent1 == parent1 && this.parent2 == parent2 || this.parent1 == parent2 && this.parent2 == parent1;
    };
    ItemChicken.prototype.getTier = function () {
        if (this.hasParents()) {
            return Math.max(this.parent1.getTier(), this.parent2.getTier()) + 1;
        }
        return 1;
    };
    ItemChicken.prototype.getMinLayTime = function () {
        return Math.max(this.getTier() * 6000, 1) | 0;
    };
    ItemChicken.prototype.getMaxLayTime = function () {
        return this.getMinLayTime() * 2;
    };
    ItemChicken.chickens = [];
    return ItemChicken;
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
    ChickenStack.getChickenStack = function (item) {
        if (ItemChicken.isChicken(item.id)) {
            return new ChickenStack(item);
        }
        return null;
    };
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
    Object.defineProperty(ChickenStack.prototype, "instance", {
        get: function () {
            return this.getItemInstance();
        },
        enumerable: false,
        configurable: true
    });
    ChickenStack.prototype.getLayTime = function () {
        var time = Math_randomInt(this.instance.getMinLayTime(), this.instance.getMaxLayTime());
        time = Math.max(1, (time * (10 - this.growth + 1)) / 10);
        return time;
    };
    ChickenStack.prototype.getLayItem = function () {
        var products = this.instance.getProducts();
        var item = products[Math.random() * products.length | 0];
        return __assign(__assign({}, item), { count: this.gain >= 10 ? 3 : this.gain >= 5 ? 2 : 1 });
    };
    ChickenStack.prototype.makeBaby = function (mate) {
        var babyData = this.instance.getRandomBaby(mate.instance);
        if (!babyData) {
            return null;
        }
        var baby = new ChickenStack({ id: babyData.id, count: 1, data: 0 });
        if (this.instance == mate.instance && this.instance == babyData) {
            baby.growth = this.calcNewStatusValue(mate, mate.growth, this.growth);
            baby.gain = this.calcNewStatusValue(mate, mate.gain, this.gain);
            baby.strength = this.calcNewStatusValue(mate, mate.strength, this.strength);
        }
        else if (babyData == this.instance) {
            baby.growth = this.growth;
            baby.gain = this.gain;
            baby.strength = this.strength;
        }
        else if (babyData == mate.instance) {
            baby.growth = mate.growth;
            baby.gain = mate.gain;
            baby.strength = mate.strength;
        }
        return baby;
    };
    ChickenStack.prototype.calcNewStatusValue = function (mate, stat1, stat2) {
        var mutation = (Math.random() * 2 | 0) + 1;
        var newValue = (stat1 * this.strength + stat2 * mate.strength) / (this.strength + mate.strength) + mutation;
        return Math_clamp(newValue, 1, 10);
    };
    return ChickenStack;
}(ItemStack));
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
        if (rotation == 0 || rotation == 1 || rotation == 2 || rotation == 3) {
            return renders[rotation].getId();
        }
        return -1;
    };
})(ChickenRender || (ChickenRender = {}));
var WindowWithTooltips = /** @class */ (function () {
    function WindowWithTooltips(content) {
        var _this = this;
        var _b;
        (_b = content.location) !== null && _b !== void 0 ? _b : (content.location = { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() });
        content.elements["_wwtTouch"] = {
            type: "frame",
            x: 0,
            y: 0,
            z: -100,
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
                            _this.showTooltip(_this.slotTooltip(e), e, eventX, eventY, eventType);
                            break;
                        }
                    }
                }
            }
        };
        this.content = content;
        this.isReady = false;
    }
    WindowWithTooltips.createHighlightBmp = function (w, h) {
        var bitmap = new android.graphics.Bitmap.createBitmap(w | 0, h | 0, android.graphics.Bitmap.Config.ARGB_8888);
        var canvas = new android.graphics.Canvas(bitmap);
        canvas.drawARGB(127, 255, 255, 255);
        return bitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
    };
    WindowWithTooltips.prototype.create = function () {
        this.winGroup = new UI.WindowGroup();
        this.winMain = new UI.Window(this.content);
        this.winOvl = new UI.Window({
            location: { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() },
            elements: {
                _wwtText: { type: "text", x: 0, y: -1000, z: 1, font: { color: Color.WHITE, size: 16, shadow: 0.5 }, multiline: true },
                _wwtFrame: { type: "image", x: 0, y: -1000, width: 64, height: 64, scale: 1, bitmap: "workbench_frame3" },
                _wwtHighlight: { type: "image", x: -1000, y: -1000, z: -1, width: 64, height: 64, scale: 1, bitmap: "_selection" }
            }
        });
        this.winMain.setBackgroundColor(Color.TRANSPARENT);
        this.winOvl.setBackgroundColor(Color.TRANSPARENT);
        for (var key in this.content.elements) {
            if (this.content.elements[key].type == "invSlot") {
                this.winMain.setInventoryNeeded(true);
                break;
            }
        }
        this.winMain.setBlockingBackground(true);
        this.winOvl.setTouchable(false);
        this.winOvl.setAsGameOverlay(true);
        this.winGroup.addWindowInstance("main", this.winMain);
        this.winGroup.addWindowInstance("ovl", this.winOvl);
        this.winGroup.setCloseOnBackPressed(true);
        this.isReady = true;
    };
    WindowWithTooltips.prototype.setTooltipFunc = function (elemName, tooltipFunc) {
        var _this = this;
        if (elemName in this.content.elements) {
            this.content.elements[elemName].onTouchEvent = function (el, ev) {
                _this.showTooltip(tooltipFunc(el), el, ev.x, ev.y, ev.type);
            };
        }
    };
    WindowWithTooltips.prototype.slotTooltip = function (slotElem) {
        if (slotElem.source.id != 0) {
            return Item.getName(slotElem.source.id, slotElem.source.data, slotElem.source.extra);
        }
        return "";
    };
    WindowWithTooltips.prototype.showTooltip = function (str, elem, eventX, eventY, eventType) {
        var location = elem.window.getLocation();
        var ovlElems = this.winOvl.getElements();
        var wwtText = ovlElems.get("_wwtText");
        var wwtFrame = ovlElems.get("_wwtFrame");
        var wwtHighlight = ovlElems.get("_wwtHighlight");
        var MOVEtoLONG_CLICK = eventType == "LONG_CLICK" && wwtFrame.x != -1000 && wwtFrame.y != -1000;
        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;
        if (str && (eventType == "MOVE" || MOVEtoLONG_CLICK)) {
            x = location.x + location.windowToGlobal(elem.x) | 0;
            y = location.y + location.windowToGlobal(elem.y) | 0;
            w = location.windowToGlobal(elem.elementRect.width()) | 0;
            h = location.windowToGlobal(elem.elementRect.height()) | 0;
            if (wwtHighlight.elementRect.width() != w || wwtHighlight.elementRect.height() != h) {
                wwtHighlight.texture = new UI.Texture(WindowWithTooltips.createHighlightBmp(w, h));
                wwtHighlight.setSize(w, h);
            }
            wwtHighlight.setPosition(x, y);
            var split = str.split("\n");
            w = Math.max.apply(Math, split.map(function (s) { return WindowWithTooltips.McFontPaint.measureText(s); })) + 20;
            h = split.length * 18 + 16;
            x = location.x + location.windowToGlobal(eventX);
            y = location.y + location.windowToGlobal(eventY) - h - 50;
            if (y < -10) {
                y = location.y + location.windowToGlobal(eventY) + 70;
            }
            if (wwtFrame.elementRect.width() != w || wwtFrame.elementRect.height() != h) {
                wwtFrame.texture = new UI.Texture(WindowWithTooltips.FrameTex.expandAndScale(w, h, 1, WindowWithTooltips.FrameTexCentralColor));
                wwtFrame.setSize(w, h);
            }
            wwtText.setPosition(Math_clamp(x - w / 2, 0, 1000 - w) + 10, y + 7);
            wwtText.setBinding("text", str);
            wwtFrame.setPosition(Math_clamp(x - w / 2, 0, 1000 - w), y);
            if (!Threading.getThread("wwt_showTooltip")) {
                Threading.initThread("wwt_showTooltip", function () {
                    while (elem.isTouched) {
                        java.lang.Thread.sleep(200);
                    }
                    wwtText.setPosition(-1000, -1000);
                    wwtFrame.setPosition(-1000, -1000);
                    wwtHighlight.setPosition(-1000, -1000);
                });
            }
        }
        else {
            wwtText.setPosition(-1000, -1000);
            wwtFrame.setPosition(-1000, -1000);
            wwtHighlight.setPosition(-1000, -1000);
        }
    };
    WindowWithTooltips.prototype.getWindow = function () {
        this.isReady || this.create();
        this.winGroup.moveOnTop("ovl");
        return this.winGroup;
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
var ItemCatcher = /** @class */ (function (_super) {
    __extends(ItemCatcher, _super);
    function ItemCatcher() {
        var _this = _super.call(this, "chicken_catcher", "Chicken Catcher", "chicken_catcher", true) || this;
        _this.setMaxStack(1);
        _this.setMaxDamage(64);
        _this.setHandEquipped(true);
        _this.setCategory(ItemCategory.EQUIPMENT);
        _this.isWeapon = true;
        ToolAPI.registerTool(_this.id, { efficiency: 0, damage: 0, durability: _this.maxDamage, level: 0 }, [], _this);
        return _this;
    }
    ItemCatcher.prototype.onAttack = function (item, entity, player) {
        var type = Entity.getTypeName(entity);
        var chicken = ItemChicken.getChickenByIdentifier(type.split("<")[0]);
        if (chicken) {
            //const age = Entity.getAge(entity);
            var pos = Entity.getPosition(entity);
            var extra = new ItemExtraData();
            extra.putInt("status_growth", 1)
                .putInt("status_gain", 1)
                .putInt("status_strength", 1);
            Entity.remove(entity);
            Entity.addVelocity(World.drop(pos.x, pos.y, pos.z, chicken.id, 1, 0, extra), 0, 0.2, 0);
            for (var i = 0; i < 20; i++) {
                Particles.addParticle(EParticleType.REDSTONE, pos.x + Math.random() * 0.6 - 0.3, pos.y + Math.random() * 0.6, pos.z + Math.random() * 0.6 - 0.3, Math.random() * 0.02, Math.random() * 0.2, Math.random() * 0.02);
            }
            return false;
        }
        return true;
    };
    return ItemCatcher;
}(ItemCommon));
ItemRegistry.registerItem(new ItemCatcher());
Recipes2.addShaped(ItemID.chicken_catcher, "a:b:c", { a: "egg", b: "stick", c: "feather" });
var Chicken;
(function (Chicken) {
    Chicken.$vanilla = new ItemChicken("chicken_vanilla", "Vanilla Chicken", ["feather", "egg"]);
    Chicken.$vanilla.setEntityIdentifier("minecraft:chicken");
    ItemRegistry.registerItem(Chicken.$vanilla);
})(Chicken || (Chicken = {}));
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
    elements: __assign({ buttonClose: { type: "closeButton", x: 928, y: 12, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 4 }, barProgress: { type: "scale", x: 278, y: 116, bitmap: "roost.bar_roost", scale: 5.5, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("chicken_roost");
                }
            } }, slotChicken: { type: "slot", x: 150, y: 110, size: 100, bitmap: "roost.slot" }, slotOutput0: { type: "slot", x: 450, y: 110, size: 100 }, slotOutput1: { type: "slot", x: 550, y: 110, size: 100 }, slotOutput2: { type: "slot", x: 650, y: 110, size: 100 }, slotOutput3: { type: "slot", x: 750, y: 110, size: 100 } }, (function () {
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
UiRoost.setTooltipFunc("barProgress", function (elem) { return (elem.getBinding("value") * 100).toFixed(1) + "%"; });
var TileRoost = /** @class */ (function (_super) {
    __extends(TileRoost, _super);
    function TileRoost() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultValues = {
            progress: 0,
            layTime: 0
        };
        return _this;
    }
    TileRoost.prototype.getScreenByName = function (screenName) {
        return UiRoost.getWindow();
    };
    TileRoost.prototype.onInit = function () {
        this.networkData.putInt("facing", this.blockSource.getBlockData(this.x, this.y, this.z));
        this.networkData.sendChanges();
        this.setupContainer();
        delete this.liquidStorage;
    };
    TileRoost.prototype.setupContainer = function () {
        StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
            if (name == "slotChicken")
                return ItemChicken.isChicken(id);
            return false;
        });
    };
    TileRoost.prototype.renderChickenModel = function (show) {
        var _a;
        var skin = this.networkData.getString("chicken_skin");
        var render = ChickenRender.getRenderId(this.networkData.getInt("facing") - 2);
        (_a = this.chickenAnim) === null || _a === void 0 ? void 0 : _a.destroy();
        if (show && skin != "" && render != -1) {
            this.chickenAnim = new Animation.Base(this.x + 0.5, this.y + 0.5, this.z + 0.5);
            this.chickenAnim.describe({ render: render, skin: skin, scale: 1 });
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
    TileRoost.prototype.onTick = function () {
        var slotChicken = this.container.getSlot("slotChicken");
        var chickenStack = ChickenStack.getChickenStack(slotChicken);
        if (chickenStack) {
            this.networkData.putString("chicken_skin", chickenStack.instance.getSkin());
            if (this.data.layTime == 0) {
                this.data.progress = 0;
                this.data.layTime = chickenStack.getLayTime();
            }
            else {
                this.data.progress += slotChicken.count * Cfg.roost_speed;
                if (this.data.progress >= this.data.layTime && this.putResult(chickenStack.getLayItem())) {
                    this.data.progress = 0;
                    this.data.layTime = 0;
                }
            }
        }
        else {
            this.networkData.putString("chicken_skin", "");
            this.data.progress = 0;
            this.data.layTime = 0;
        }
        StorageInterface.checkHoppers(this);
        this.container.setScale("barProgress", this.data.layTime > 0 ? this.data.progress / this.data.layTime : 0);
        this.networkData.sendChanges();
        this.container.sendChanges();
    };
    TileRoost.prototype.putResult = function (item) {
        var slot;
        for (var i = 0; i < 4; i++) {
            slot = this.container.getSlot("slotOutput" + i);
            if (slot.id == 0 || slot.id == item.id && slot.data == item.data && slot.count + item.count <= Item.getMaxStack(item.id)) {
                slot.id = item.id;
                slot.data = item.data;
                slot.count += item.count;
                slot.markDirty();
                return true;
            }
        }
        return false;
    };
    TileRoost.prototype.onItemUse = function (coords, item, player) {
        if (!Entity.getSneaking(player) && ItemChicken.isChicken(item.id)) {
            var slotChicken = this.container.getSlot("slotChicken");
            if (slotChicken.id == 0) {
                Entity.setCarriedItem(player, 0, 0, 0);
                slotChicken.setSlot(item.id, item.count, item.data, item.extra);
                slotChicken.markDirty();
                this.container.sendChanges();
                return true;
            }
        }
        return false;
    };
    __decorate([
        BlockEngine.Decorators.ClientSide
    ], TileRoost.prototype, "renderChickenModel", null);
    return TileRoost;
}(TileEntityBase));
StorageInterface.createInterface(BlockID.chicken_roost, {
    slots: {
        slotChicken: { input: true, isValid: function (item) { return ItemChicken.isChicken(item.id); } },
        slotOutput0: { output: true },
        slotOutput1: { output: true },
        slotOutput2: { output: true },
        slotOutput3: { output: true }
    }
});
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
            if (i == 1) {
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
Cfg.vanilla_slots && VanillaSlots.registerForTile(BlockID.chicken_roost);
Recipes2.addShaped(BlockID.chicken_roost, "aaa:a_a:bbb", { a: "planks", b: "hay_block" });
var UiBreeder = new WindowWithTooltips({
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
        { type: "text", x: 50, y: 60, text: "Chicken Breeder", font: { color: Color.BLACK, size: 32 } },
        { type: "text", x: 50, y: 290, text: "Inventory", font: { color: Color.BLACK, size: 32 } },
        { type: "bitmap", x: 172, y: 130, bitmap: "roost.plus", scale: 5.5 },
        { type: "bitmap", x: 478, y: 120, bitmap: "roost.bar_breeder_bg", scale: 5.5 }
    ],
    elements: __assign({ buttonClose: { type: "closeButton", x: 928, y: 12, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 4 }, barProgress: { type: "scale", x: 478, y: 120, bitmap: "roost.bar_breeder", scale: 5.5, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("chicken_breeder");
                }
            } }, slotSeed: { type: "slot", x: 50, y: 110, size: 100, bitmap: "classic_slot" }, slotBase: { type: "slot", x: 250, y: 110, size: 100, bitmap: "roost.slot" }, slotMate: { type: "slot", x: 350, y: 110, size: 100, bitmap: "roost.slot" }, slotOutput0: { type: "slot", x: 650, y: 110, size: 100 }, slotOutput1: { type: "slot", x: 750, y: 110, size: 100 }, slotOutput2: { type: "slot", x: 850, y: 110, size: 100 } }, (function () {
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
UiBreeder.setTooltipFunc("barProgress", function (elem) { return (elem.getBinding("value") * 100).toFixed(1) + "%"; });
var _a;
var TileBreeder = /** @class */ (function (_super) {
    __extends(TileBreeder, _super);
    function TileBreeder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultValues = {
            progress: 0,
            layTime: 0
        };
        return _this;
    }
    TileBreeder.prototype.getScreenByName = function (screenName) {
        return UiBreeder.getWindow();
    };
    TileBreeder.prototype.onInit = function () {
        this.setupContainer();
        delete this.liquidStorage;
    };
    TileBreeder.prototype.setupContainer = function () {
        StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
            if (name == "slotSeed")
                return TileBreeder.seeds[id];
            if (name == "slotBase" || name == "slotMate")
                return ItemChicken.isChicken(id);
            return false;
        });
    };
    TileBreeder.prototype.renderModel = function () {
        var mode = this.networkData.getInt("mode");
        if (mode == BlockBreeder.MODE_DEACTIVE) {
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        }
        else {
            BlockRenderer.mapAtCoords(this.x, this.y, this.z, BlockBreeder.models[mode]);
        }
    };
    TileBreeder.prototype.clientLoad = function () {
        var _this = this;
        this.renderModel();
        this.networkData.addOnDataChangedListener(function (data, isExternal) {
            _this.renderModel();
        });
    };
    TileBreeder.prototype.clientUnload = function () {
        this.renderModel();
    };
    TileBreeder.prototype.onTick = function () {
        var slotBase = this.container.getSlot("slotBase");
        var slotMate = this.container.getSlot("slotMate");
        var baseStack = ChickenStack.getChickenStack(slotBase);
        var mateStack = ChickenStack.getChickenStack(slotMate);
        var mode = BlockBreeder.MODE_DEACTIVE;
        if (baseStack && mateStack) {
            var slotSeed = this.container.getSlot("slotSeed");
            if (TileBreeder.seeds[slotSeed.id] && slotSeed.count >= 2) {
                if (this.data.layTime == 0) {
                    this.data.progress = 0;
                    this.data.layTime = Math.max(baseStack.getLayTime(), mateStack.getLayTime());
                }
                else {
                    this.data.progress += Math.min(slotBase.count, slotMate.count) * Cfg.breeder_speed;
                    if (this.data.progress >= this.data.layTime) {
                        var babyStack = baseStack.makeBaby(mateStack);
                        if (babyStack) {
                            if (this.putResult(babyStack)) {
                                slotSeed.count -= 2;
                                slotSeed.markDirty();
                                slotSeed.validate();
                                this.data.progress = 0;
                                this.data.layTime = 0;
                            }
                        }
                        else {
                            this.data.progress = 0;
                            this.data.layTime = 0;
                        }
                    }
                }
                mode = BlockBreeder.MODE_ACTIVE;
            }
            else {
                mode = BlockBreeder.MODE_ERROR;
            }
        }
        if (mode != BlockBreeder.MODE_ACTIVE) {
            this.data.progress = 0;
            this.data.layTime = 0;
        }
        StorageInterface.checkHoppers(this);
        this.networkData.putInt("mode", mode);
        this.container.setScale("barProgress", this.data.layTime > 0 ? this.data.progress / this.data.layTime : 0);
        this.networkData.sendChanges();
        this.container.sendChanges();
    };
    TileBreeder.prototype.putResult = function (item) {
        var slot;
        for (var i = 0; i < 3; i++) {
            slot = this.container.getSlot("slotOutput" + i);
            if (slot.id == 0) {
                slot.id = item.id;
                slot.count = item.count;
                slot.data = item.data;
                slot.extra = item.extra;
                slot.markDirty();
                return true;
            }
        }
        return false;
    };
    TileBreeder.seeds = (_a = {},
        _a[VanillaItemID.wheat_seeds] = true,
        _a[VanillaItemID.pumpkin_seeds] = true,
        _a[VanillaItemID.melon_seeds] = true,
        _a[VanillaItemID.beetroot_seeds] = true,
        _a);
    __decorate([
        BlockEngine.Decorators.ClientSide
    ], TileBreeder.prototype, "renderModel", null);
    return TileBreeder;
}(TileEntityBase));
StorageInterface.createInterface(BlockID.chicken_breeder, {
    slots: {
        slotSeed: { input: true, isValid: function (item) { return TileBreeder.seeds[item.id]; } },
        slotBase: { input: true, isValid: function (item) { return ItemChicken.isChicken(item.id); } },
        slotMate: { input: true, isValid: function (item) { return ItemChicken.isChicken(item.id); } },
        slotOutput0: { output: true },
        slotOutput1: { output: true },
        slotOutput2: { output: true }
    }
});
var BlockBreeder = /** @class */ (function (_super) {
    __extends(BlockBreeder, _super);
    function BlockBreeder(stringID, name) {
        var _this = _super.call(this, stringID, "wood") || this;
        _this.addVariation(name, [["roost_plain", 0]], true);
        _this.createBreederModel();
        _this.registerTileEntity(new TileBreeder());
        return _this;
    }
    BlockBreeder.prototype.createBreederModel = function () {
        var boxes = [
            { vartexes: [0, 0, 0, 1, 3 / 16, 1], texture: ["plain", "floor", "plain"].map(function (str) { return ["roost_" + str, 0]; }) },
            { vartexes: [0, 13 / 16, 0, 1, 1, 1], texture: [["roost_plain", 0]] },
            { vartexes: [0, 3 / 16, 0, 3 / 16, 13 / 16, 3 / 16], texture: [["roost_curtain", 0]] },
            { vartexes: [0, 3 / 16, 13 / 16, 3 / 16, 13 / 16, 1], texture: [["roost_curtain", 0]] },
            { vartexes: [13 / 16, 3 / 16, 0, 1, 13 / 16, 3 / 16], texture: [["roost_curtain", 0]] },
            { vartexes: [13 / 16, 3 / 16, 13 / 16, 1, 13 / 16, 1], texture: [["roost_curtain", 0]] }
        ];
        var model;
        for (var i = 0; i < 3; i++) {
            model = BlockRenderer.createModel();
            boxes.forEach(function (box) {
                model.addBox.apply(model, __spreadArray(__spreadArray([], box.vartexes, false), [box.texture], false));
            });
            switch (i) {
                case 1:
                    model.addBox(3 / 16, 3 / 16, 3 / 16, 13 / 16, 13 / 16, 13 / 16, [["roost_empty", 0]]);
                    break;
                case 2:
                    model.addBox(3 / 16, 3 / 16, 3 / 16, 13 / 16, 13 / 16, 13 / 16, [["roost_curtain", 0]]);
                    break;
            }
            BlockBreeder.models[i] = new ICRender.Model(model);
        }
        BlockRenderer.enableCoordMapping(this.id, -1, BlockBreeder.models[0]);
    };
    BlockBreeder.MODE_DEACTIVE = 0;
    BlockBreeder.MODE_ERROR = 1;
    BlockBreeder.MODE_ACTIVE = 2;
    BlockBreeder.models = [null, null, null];
    return BlockBreeder;
}(BlockBase));
BlockRegistry.registerBlock(new BlockBreeder("chicken_breeder", "Chicken Breeder"));
Cfg.vanilla_slots && VanillaSlots.registerForTile(BlockID.chicken_breeder);
Recipes2.addShaped(BlockID.chicken_breeder, "aaa:aba:ccc", { a: "planks", b: "wheat_seeds", c: "hay_block" });
var UiCollector = new WindowWithTooltips({
    location: { x: 200, y: 50, width: 600, height: 300 },
    params: { slot: "classic_slot" },
    drawing: [
        { type: "frame", x: 0, y: 0, width: 1000, height: 500, bitmap: "classic_frame_bg_light", scale: 4 },
        { type: "text", x: 50, y: 60, text: "Roost Collector", font: { color: Color.BLACK, size: 32 } }
    ],
    elements: __assign({ buttonClose: { type: "closeButton", x: 928, y: 12, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 4 }, buttonTake: { type: "button", x: 500 - 96, y: 400, bitmap: "_craft_button_up", bitmap2: "_craft_button_down", scale: 4, clicker: {
                onClick: function (position, container) {
                    container.sendEvent("takeAll", Player.get() + "");
                }
            } }, textTake: { type: "text", x: 500, y: 410, z: 1, font: { size: 32, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER }, text: "Take All" } }, (function () {
        var elems = {};
        var x = 0;
        var y = 0;
        for (var i = 0; i < 27; i++) {
            x = 50 + (i % 9) * 100;
            y = 70 + (i / 9 | 0) * 100;
            elems["slot" + i] = { type: "slot", x: x, y: y, z: 1, size: 100 };
        }
        return elems;
    })())
});
var TileCollector = /** @class */ (function (_super) {
    __extends(TileCollector, _super);
    function TileCollector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.searchOffset = 0;
        return _this;
    }
    TileCollector.prototype.getScreenByName = function (screenName) {
        return UiCollector.getWindow();
    };
    TileCollector.prototype.onInit = function () {
        this.setupContainer();
        delete this.liquidStorage;
    };
    TileCollector.prototype.setupContainer = function () {
        StorageInterface.setGlobalValidatePolicy(this.container, function () { return true; });
    };
    TileCollector.prototype.getNextCoordsList = function () {
        var coordsList = [];
        for (var x = -4; x <= 4; x++) {
            coordsList.push({
                x: this.x + x,
                y: this.y + (this.searchOffset / 9 | 0),
                z: this.z + (this.searchOffset % 9 - 4)
            });
        }
        this.searchOffset++;
        this.searchOffset %= 27;
        return coordsList;
    };
    TileCollector.prototype.onTick = function () {
        var _this = this;
        if ((World.getThreadTime() & 3) == 0) {
            this.getNextCoordsList().forEach(function (coords) {
                if (_this.blockSource.getBlockId(coords.x, coords.y, coords.z) == BlockID.chicken_roost) {
                    var storage = StorageInterface.getStorage(_this.blockSource, coords.x, coords.y, coords.z);
                    if (storage) {
                        StorageInterface.extractItemsFromStorage(StorageInterface.getInterface(_this), storage, -1);
                    }
                }
            });
            this.container.sendChanges();
        }
    };
    TileCollector.prototype.takeAll = function (data) {
        StorageInterface.extractItemsFromStorage(new PlayerInventoryInterface(+data), StorageInterface.getInterface(this), -1);
        this.container.sendChanges();
    };
    __decorate([
        BlockEngine.Decorators.ContainerEvent(Side.Server)
    ], TileCollector.prototype, "takeAll", null);
    return TileCollector;
}(TileEntityBase));
StorageInterface.createInterface(BlockID.roost_collector, {
    slots: (function () {
        var slots = {};
        for (var i = 0; i < 27; i++) {
            slots["slot" + i] = { input: true, output: true };
        }
        return slots;
    })()
});
var PlayerInventoryInterface = /** @class */ (function () {
    function PlayerInventoryInterface(playerUid) {
        this.container = null;
        this.isNativeContainer = false;
        this.player = new PlayerEntity(playerUid);
    }
    PlayerInventoryInterface.prototype.getSlot = function (index) {
        return this.player.getInventorySlot(index);
    };
    PlayerInventoryInterface.prototype.setSlot = function (index, id, count, data, extra) {
        this.player.setInventorySlot(index, id, count, data, extra);
    };
    PlayerInventoryInterface.prototype.getContainerSlots = function () {
        var slots = [];
        for (var i = 0; i < 36; i++) {
            slots.push(i);
        }
        return slots;
    };
    PlayerInventoryInterface.prototype.getInputSlots = function (side) {
        return this.getContainerSlots();
    };
    PlayerInventoryInterface.prototype.getOutputSlots = function (side) {
        return this.getContainerSlots();
    };
    PlayerInventoryInterface.prototype.getReceivingItemCount = function (item, side) {
        return 0;
    };
    PlayerInventoryInterface.prototype.addItemToSlot = function (index, item, maxCount) {
        var slot = this.getSlot(index);
        var added = StorageInterface.addItemToSlot(item, slot, maxCount);
        added > 0 && this.setSlot(index, slot.id, slot.count, slot.data, slot.extra);
        return added;
    };
    PlayerInventoryInterface.prototype.addItem = function (item, side, maxCount) {
        var slots = this.getInputSlots(side);
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            count += this.addItemToSlot(i, item, maxCount);
            if (item.count == 0 || count >= maxCount) {
                break;
            }
        }
        return count;
    };
    PlayerInventoryInterface.prototype.clearContainer = function () {
        var slots = this.getContainerSlots();
        for (var i = 0; i < slots.length; i++) {
            this.setSlot(slots[i], 0, 0, 0);
        }
    };
    return PlayerInventoryInterface;
}());
var BlockCollector = /** @class */ (function (_super) {
    __extends(BlockCollector, _super);
    function BlockCollector(stringID, name) {
        var _this = _super.call(this, stringID, "wood") || this;
        _this.addVariation(name, [["roost_plain", 0], ["roost_plain", 0], ["roost_slat", 0]], true);
        _this.registerTileEntity(new TileCollector());
        return _this;
    }
    return BlockCollector;
}(BlockBase));
BlockRegistry.registerBlock(new BlockCollector("roost_collector", "Roost Collector"));
Cfg.vanilla_slots && VanillaSlots.registerForTile(BlockID.roost_collector);
Recipes2.addShaped(BlockID.roost_collector, "aba:aca:ada", { a: "planks", b: Chicken.$vanilla.id, c: "hopper", d: "chest" });
var RV;
ModAPI.addAPICallback("RecipeViewer", function (api) {
    RV = api;
    var RoostRecipe = /** @class */ (function (_super) {
        __extends(RoostRecipe, _super);
        function RoostRecipe() {
            return _super.call(this, "Roost", BlockID.chicken_roost, {
                drawing: [
                    { type: "bitmap", x: 278, y: 116, bitmap: "roost.bar_roost", scale: 5.5 }
                ],
                elements: {
                    input0: { x: 150, y: 110, size: 100 },
                    output0: { x: 450, y: 110, size: 100 },
                    output1: { x: 550, y: 110, size: 100 },
                    output2: { x: 650, y: 110, size: 100 },
                    output3: { x: 750, y: 110, size: 100 },
                    textInfo: { type: "text", x: 150, y: 240, font: { size: 32, color: Color.WHITE, shadow: 0.5 }, multiline: true },
                    textTips1: { type: "text", x: 150, y: 380, font: { size: 24, color: Color.LTGRAY, shadow: 0.5 }, multiline: true, text: [
                            "[Lay Time Multiplier]",
                            "Growth _1: 100%",
                            "Growth _2: _90%",
                            "Growth 10: _10%"
                        ].join("\n").replace(/_/g, "  ") },
                    textTips2: { type: "text", x: 550, y: 380, font: { size: 24, color: Color.LTGRAY, shadow: 0.5 }, multiline: true, text: [
                            "[Lay Count]",
                            "Gain 1-4: 1",
                            "Gain 5-9: 2",
                            "Gain _10: 3"
                        ].join("\n").replace(/_/g, "  ") }
                }
            }) || this;
        }
        RoostRecipe.prototype.getAllList = function () {
            return ItemChicken.getRoostRecipeListForRV();
        };
        RoostRecipe.prototype.onOpen = function (elements, recipe) {
            var chicken = ItemRegistry.getInstanceOf(recipe.input[0].id);
            if (!chicken) {
                elements.get("textInfo").setBinding("text", "");
                return;
            }
            var info = [
                "Tier: " + chicken.getTier(),
                "Lay Time: " + chicken.getMinLayTime() + " - " + chicken.getMaxLayTime() + " tick"
            ];
            elements.get("textInfo").setBinding("text", info.join("\n"));
        };
        return RoostRecipe;
    }(api.RecipeType));
    var BreederRecipe = /** @class */ (function (_super) {
        __extends(BreederRecipe, _super);
        function BreederRecipe() {
            return _super.call(this, "Crossbreeding", BlockID.chicken_breeder, {
                drawing: [
                    { type: "bitmap", x: 172, y: 130, bitmap: "roost.plus", scale: 5.5 },
                    { type: "bitmap", x: 478, y: 120, bitmap: "roost.bar_breeder", scale: 5.5 }
                ],
                elements: {
                    input0: { x: 50, y: 110, size: 100 },
                    input1: { x: 250, y: 110, size: 100 },
                    input2: { x: 350, y: 110, size: 100 },
                    output0: { x: 650, y: 110, size: 100 },
                    output1: { x: 750, y: 110, size: 100 },
                    output2: { x: 850, y: 110, size: 100 }
                }
            }) || this;
        }
        BreederRecipe.prototype.getAllList = function () {
            return ItemChicken.getBreederRecipeListForRV();
        };
        BreederRecipe.prototype.slotTooltip = function (name, item, tips) {
            if (tips === null || tips === void 0 ? void 0 : tips.chance) {
                return name + "\n(" + (tips.chance * 100).toFixed(1) + "%)";
            }
            return name;
        };
        return BreederRecipe;
    }(api.RecipeType));
    api.RecipeTypeRegistry.register("chicken_roost", new RoostRecipe());
    api.RecipeTypeRegistry.register("chicken_breeder", new BreederRecipe());
});
ModAPI.registerAPI("RoostAPI", {
    ItemChicken: ItemChicken,
    Chicken: Chicken
});
