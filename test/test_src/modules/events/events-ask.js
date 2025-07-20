$evui.testAsync({
    name: "Events - Ask Basic",
    test: async function ()
    {
        var eventName = $evui.guid();
        var askResults = [1];

        $evui.on(eventName, function (args)
        {
            return 1;
        });

        var results = await $evui.askAsync(eventName);
        $evui.assert(askResults).isEquivalentTo(results.map((r => r.response)));
    }
});

$evui.testAsync({
    name: "Events - Ask Priority",
    test: async function ()
    {
        var eventName = $evui.guid();
        var askResults = [2, 1];

        $evui.on(eventName, async function (args)
        {
            await $evui.waitAsync(25);
            return 1;
        }, 0);

        $evui.on(eventName, function (args)
        {
            return 2;
        }, 1);

        var results = await $evui.askAsync(eventName);
        $evui.assert(askResults).isEquivalentTo(results.map((r => r.response)));
    }
});

$evui.testAsync({
    name: "Events - Ask Once",
    test: async function ()
    {
        var eventName = $evui.guid();
        var askResults = [2];

        $evui.once(eventName, function (args)
        {
            return 2;
        }, 1);

        var results = await $evui.askAsync(eventName);
        $evui.assert(askResults).isEquivalentTo(results.map((r => r.response)));

        results = await $evui.askAsync(eventName);
        $evui.assert(results).isEquivalentTo([]);
    }
});