$evui.testAsync({
    name: "Events - Basic Event Triggering",
    test: function (testArgs)
    {
        var eventName = $evui.guid();

        $evui.on(eventName, function (args)
        {
            testArgs.pass();
        });

        $evui.trigger(eventName);
    },
    options: {
        timeout: 50,
    },
});

$evui.testAsync({
    name: "Events - Multiple Event Listeners",
    test: async function (testArgs)
    {
        var eventName = $evui.guid();
        var hitCount = 0;

        $evui.on(eventName, function (args)
        {
            hitCount++;
        });

        $evui.on(eventName, function (args)
        {
            hitCount++;
        });

        $evui.on(eventName, function (args)
        {
            hitCount++;
        });

        await $evui.triggerAsync(eventName);
        $evui.assert(hitCount).is(3);
    }
});

$evui.testAsync({
    name: "Events - Event Triggering with Data",
    test: async function (testArgs)
    {
        var eventName = $evui.guid();

        $evui.on(eventName, function (args)
        {
            args.data.hitCount++;
        });

        var eventData = { hitCount: 0 };

        await $evui.triggerAsync(eventName, eventData);
        $evui.assert(eventData.hitCount).is(1);
    }
});

$evui.testAsync({
    name: "Events - Priortity",
    test: async function (testArgs)
    {
        var eventName = $evui.guid();
        var order = [];
        $evui.on(eventName, function (args)
        {
            order.push(1);
        }, 3);
        $evui.on(eventName, function (args)
        {
            order.push(3);
        }, 1);
        $evui.on(eventName, function (args)
        {
            order.push(2);
        }, 2);

        await $evui.triggerAsync(eventName);

        $evui.assert(order).isEquivalentTo([1, 2, 3]);
    }
});

$evui.testAsync({
    name: "Events - Once",
    test: async function (testArgs)
    {
        var eventName = $evui.guid();
        var hitCount = 0;

        $evui.once(eventName, function ()
        {
            hitCount++
        });

        await $evui.triggerAsync(eventName);
        await $evui.triggerAsync(eventName);

        $evui.assert(hitCount).is(1);
    }
});

$evui.testAsync({
    name: "Events - Simple On/Off",
    test: async function (testArgs)
    {
        var eventName = $evui.guid();
        var hitCount = 0;
        var handler = function ()
        {
            hitCount++;
        };

        $evui.on(eventName, handler);

        await $evui.triggerAsync(eventName);

        $evui.off(eventName, handler);

        await $evui.triggerAsync(eventName);

        $evui.assert(hitCount).is(1);
    }
});

$evui.testAsync({
    name: "Events - Specific On/Off",
    test: async function (testArgs)
    {
        var eventName = $evui.guid();
        var hitCount = 0;

        var handler = function ()
        {
            hitCount++;
        };

        $evui.on(eventName, handler);
        $evui.on(eventName, function ()
        {
            hitCount++;
        });

        await $evui.triggerAsync(eventName);

        $evui.assert(hitCount).is(2);

        $evui.off(eventName, handler);

        await $evui.triggerAsync(eventName);

        $evui.assert(hitCount).is(3);
    }
})