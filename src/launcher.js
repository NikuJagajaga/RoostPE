ConfigureMultiplayer({
    name: "Roost",
    version: "3.0",
    isClientOnly: false
});

Launch();
/*
ModAPI.addAPICallback("KernelExtension", function(api){
    if(typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 300){
        Launch({KEX: api});
    }
});
*/