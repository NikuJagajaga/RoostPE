const UiCollector = new WindowWithTooltips({

    location: {x: 200, y: 50, width: 600, height: 300},

    params: {slot: "classic_slot"},

    drawing: [
        {type: "frame", x: 0, y: 0, width: 1000, height: 500, bitmap: "classic_frame_bg_light", scale: 4},
        {type: "text", x: 50, y: 60, text: "Roost Collector", font: {color: Color.BLACK, size: 32}}
    ],

    elements: {
        buttonClose: {type: "closeButton", x: 928, y: 12, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 4},
        buttonTake: {type: "button", x: 500 - 96, y: 400, bitmap: "_craft_button_up", bitmap2: "_craft_button_down", scale: 4, clicker: {
            onClick: (position, container: ItemContainer) => {
                container.sendEvent("takeAll", Player.get() + "");
            }
        }},
        textTake: {type: "text", x: 500, y: 410, z: 1, font: {size: 32, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER}, text: "Take All"},
        ...((): UI.ElementSet => {
            const elems: UI.ElementSet = {};
            let x = 0;
            let y = 0;
            for(let i = 0; i < 27; i++){
                x = 50 + (i % 9) * 100;
                y = 70 + (i / 9 | 0) * 100;
                elems["slot" + i] = {type: "slot", x: x, y: y, z: 1, size: 100};
            }
            return elems;
        })()
    }

});