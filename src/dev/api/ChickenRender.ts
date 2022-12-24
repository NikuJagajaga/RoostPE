namespace ChickenRender {

    const renders = [
        new Render(),
        new Render(),
        new Render(),
        new Render()
    ];

    renders.forEach((render, i) => {
        render.getPart("body").addPart("chicken");
        render.setPart("chicken", [
            {//head
                uv: {x: 0, y: 0},
                coords: {x: 0, y: 23, z: -4.5},
                size: {x: 4, y: 6, z: 3}
            },
            {//nose
                uv: {x: 14, y: 0},
                coords: {x: 0, y: 23, z: -7},
                size: {x: 4, y: 2, z: 2}
            },
            {//jowl
                uv: {x: 14, y: 4},
                coords: {x: 0, y: 25, z: -6},
                size: {x: 2, y: 2, z: 2}
            },
            {//body
                uv: {x: 0, y: 9},
                coords: {x: 0, y: 27, z: 0},
                size: {x: 6, y: 6, z: 8}
            },
            {//wing1
                uv: {x: 24, y: 13},
                coords: {x: -3.5, y: 26, z: 0},
                size: {x: 1, y: 4, z: 6}
            },
            {//wing2
                uv: {x: 24, y: 13},
                coords: {x: 3.5, y: 26, z: 0},
                size: {x: 1, y: 4, z: 6}
            }
        ], {rotation: {x: 0, y: [Math.PI, 0, -Math.PI / 2, Math.PI / 2][i], z: 0}, width: 64, height: 32});
    });

    export const getRenderId = (rotation: number): number => {
        if(rotation == 0 || rotation == 1 || rotation == 2 || rotation == 3){
            return renders[rotation].getId();
        }
        return -1;
    }

}