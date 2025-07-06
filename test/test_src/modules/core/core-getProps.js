$evui.testAsync({
    name: "Get Object Properties",
    testArgs: CoreTest.makeGetPropertyNamesArgs,
    test: function (hostArgs, name, source, result)
    {
        hostArgs.outputWriter.logDebug(name);
        var props = $evui.props(source);

        $evui.assert(props).isEquivalentTo(result, {ignoreOrder: true});
    }
});