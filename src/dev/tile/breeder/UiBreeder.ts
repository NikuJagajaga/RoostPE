const UiBreeder = new WindowWithTooltips({

    location: ((): UI.WindowLocationParams => {
        const loc: UI.WindowLocationParams = {x: 0, y: 0, width: 0, height: 0};
        const ratio = {w: 4, h: 3};
        loc.height = UI.getScreenHeight();
        loc.width = loc.height / ratio.h * ratio.w;
        if(loc.width > 1000){
            loc.width = 1000;
            loc.height = loc.width / ratio.w * ratio.h;
        }
        loc.x = (1000 - loc.width) / 2;
        return loc;
    })(),

    params: {slot: "classic_slot", inv_slot: "classic_slot"},

    drawing: [
        {type: "frame", x: 0, y: 0, width: 1000, height: 750, bitmap: "classic_frame_bg_light", scale: 4},
        {type: "text", x: 50, y: 60, text: "Chicken Breeder", font: {color: Color.BLACK, size: 32}},
        {type: "text", x: 50, y: 290, text: "Inventory", font: {color: Color.BLACK, size: 32}},
        {type: "bitmap", x: 172, y: 130, bitmap: "roost.plus", scale: 5.5},
        {type: "bitmap", x: 478, y: 120, bitmap: "roost.bar_breeder_bg", scale: 5.5}
    ],

    elements: {
        buttonClose: {type: "closeButton", x: 928, y: 12, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 4},
        barProgress: {type: "scale", x: 478, y: 120, bitmap: "roost.bar_breeder", scale: 5.5, clicker: {
            onClick: () => {
                RV?.RecipeTypeRegistry.openRecipePage("chicken_breeder");
            }
        }},
        slotSeed: {type: "slot", x: 50, y: 110, size: 100, bitmap: "classic_slot"},
        slotBase: {type: "slot", x: 250, y: 110, size: 100, bitmap: "roost.slot"},
        slotMate: {type: "slot", x: 350, y: 110, size: 100, bitmap: "roost.slot"},
        slotOutput0: {type: "slot", x: 650, y: 110, size: 100},
        slotOutput1: {type: "slot", x: 750, y: 110, size: 100},
        slotOutput2: {type: "slot", x: 850, y: 110, size: 100},
        ...((): UI.ElementSet => {
            const elems: UI.ElementSet = {};
            let x = 0;
            let y = 0;
            for(let i = 0; i < 36; i++){
                x = 50 + (i % 9) * 100;
                y = i < 9 ? 620 : 300 + ((i - 9) / 9 | 0) * 100;
                elems["invSlot" + i] = {type: "invSlot", x: x, y: y, z: 1, size: 100, index: i};
            }
            return elems;
        })()
    }

});


UiBreeder.setTooltipFunc("barProgress", elem => (elem.getBinding("value") * 100).toFixed(1) + "%");
