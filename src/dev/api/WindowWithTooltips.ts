class WindowWithTooltips {

    private static McFontPaint: android.graphics.Paint = (() => {
        const paint = new android.graphics.Paint();
        paint.setTypeface(WRAP_JAVA("com.zhekasmirnov.innercore.utils.FileTools").getMcTypeface());
        paint.setTextSize(16);
        return paint;
    })();

    private static  FrameTex = UI.FrameTextureSource.get("workbench_frame3");
    private static  FrameTexCentralColor = this.FrameTex.getCentralColor();

    private static createHighlightBmp (w: number, h: number): android.graphics.Bitmap  {
        const bitmap = new android.graphics.Bitmap.createBitmap(w | 0, h | 0, android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(bitmap);
        canvas.drawARGB(127, 255, 255, 255);
        return bitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
    }

    private content: UI.WindowContent;
    private winGroup: UI.WindowGroup;
    private winMain: UI.Window;
    private winOvl: UI.Window;
    private isReady: boolean;

    constructor(content: UI.WindowContent){

        content.location ??= {x: 0, y: 0, width: 1000, height: UI.getScreenHeight()};

        content.elements["_wwtTouch"] = {
            type: "frame",
            x: 0,
            y: 0,
            z: -100,
            width: 1000,
            height: content.location.height / content.location.width * 1000,
            bitmap: "_default_slot_empty",
            onTouchEvent: (elem, event) => {
                const eventX = event.x;
                const eventY = event.y;
                const eventType = event.type;
                const elems = elem.window.getElements();
                const it = elems.values().iterator();
                let e: UI.Element;
                while(it.hasNext()){
                    e = it.next();
                    if(e.source){
                        event.preparePosition(e.window, e.elementRect);
                        if(event.localX > 0 && event.localY > 0 && event.localX < 1 && event.localY < 1){
                            this.showTooltip(this.slotTooltip(e), e, eventX, eventY, eventType);
                            break;
                        }
                    }
                }
            }
        };

        this.content = content;
        this.isReady = false;

    }

    create(): void {

        this.winGroup = new UI.WindowGroup();
        this.winMain = new UI.Window(this.content);

        this.winOvl = new UI.Window({
            location: {x: 0, y: 0, width: 1000, height: UI.getScreenHeight()},
            elements: {
                _wwtText: {type: "text", x: 0, y: -1000, z: 1, font: {color: Color.WHITE, size: 16, shadow: 0.5}, multiline: true},
                _wwtFrame: {type: "image", x: 0, y: -1000, width: 64, height: 64, scale: 1, bitmap: "workbench_frame3"},
                _wwtHighlight: {type: "image", x: -1000, y: -1000, z: -1, width: 64, height: 64, scale: 1, bitmap: "_selection"}
            }
        });

        this.winMain.setBackgroundColor(Color.TRANSPARENT);
        this.winOvl.setBackgroundColor(Color.TRANSPARENT);

        for(let key in this.content.elements){
            if(this.content.elements[key].type == "invSlot"){
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

    }

    setTooltipFunc(elemName: string, tooltipFunc: (elem: UI.Element) => string): void {
        if(elemName in this.content.elements){
            this.content.elements[elemName].onTouchEvent = (el, ev) => {
                this.showTooltip(tooltipFunc(el), el, ev.x, ev.y, ev.type);
            }
        }
    }

    slotTooltip(slotElem: UI.Element): string {
        if(slotElem.source.id != 0){
            return Item.getName(slotElem.source.id, slotElem.source.data, slotElem.source.extra);
        }
        return "";
    }

    showTooltip(str: string, elem: UI.Element, eventX: number, eventY: number, eventType: UI.TouchEventType): void {
        const location = elem.window.getLocation();
        const ovlElems = this.winOvl.getElements();
        const wwtText: UI.Element = ovlElems.get("_wwtText");
        const wwtFrame: UI.Element = ovlElems.get("_wwtFrame");
        const wwtHighlight: UI.Element = ovlElems.get("_wwtHighlight");
        const MOVEtoLONG_CLICK = eventType == "LONG_CLICK" && wwtFrame.x != -1000 && wwtFrame.y != -1000;
        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        if(str && (eventType == "MOVE" || MOVEtoLONG_CLICK)){

            x = location.x + location.windowToGlobal(elem.x) | 0;
            y = location.y + location.windowToGlobal(elem.y) | 0;
            w = location.windowToGlobal(elem.elementRect.width()) | 0;
            h = location.windowToGlobal(elem.elementRect.height()) | 0;
            if(wwtHighlight.elementRect.width() != w || wwtHighlight.elementRect.height() != h){
                wwtHighlight.texture = new UI.Texture(WindowWithTooltips.createHighlightBmp(w, h));
                wwtHighlight.setSize(w, h);
            }
            wwtHighlight.setPosition(x, y);

            const split = str.split("\n");
            w = Math.max(...split.map(s => WindowWithTooltips.McFontPaint.measureText(s))) + 20;
            h = split.length * 18 + 16;
            x = location.x + location.windowToGlobal(eventX);
            y = location.y + location.windowToGlobal(eventY) - h - 50;
            if(y < -10){
                y = location.y + location.windowToGlobal(eventY) + 70;
            }
            if(wwtFrame.elementRect.width() != w || wwtFrame.elementRect.height() != h){
                wwtFrame.texture = new UI.Texture(WindowWithTooltips.FrameTex.expandAndScale(w, h, 1, WindowWithTooltips.FrameTexCentralColor));
                wwtFrame.setSize(w, h);
            }
            wwtText.setPosition(Math_clamp(x - w / 2, 0, 1000 - w) + 10, y + 7);
            wwtText.setBinding("text", str);
            wwtFrame.setPosition(Math_clamp(x - w / 2, 0, 1000 - w), y);

            if(!Threading.getThread("wwt_showTooltip")){
                Threading.initThread("wwt_showTooltip", () => {
                    while(elem.isTouched){
                        java.lang.Thread.sleep(200);
                    }
                    wwtText.setPosition(-1000, -1000);
                    wwtFrame.setPosition(-1000, -1000);
                    wwtHighlight.setPosition(-1000, -1000);
                });
            }

        }
        else{
            wwtText.setPosition(-1000, -1000);
            wwtFrame.setPosition(-1000, -1000);
            wwtHighlight.setPosition(-1000, -1000);
        }
    }

    getWindow(): UI.WindowGroup {
        this.isReady || this.create();
        this.winGroup.moveOnTop("ovl");
        return this.winGroup;
    }

}