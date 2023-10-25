/**Copyright (c) 2023 Richard H Stannard
 
This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.*/

EVUIUnit.TestRunner = class
{
    get #isChildWindow()  { return window.parent != window; }
    
    #runnerArgs = null;
    #testRunning = false;
    #initialized = false;
    #functionName = null;
    #timeout = 10;

    initialize(testRunnerArgs)
    {
        if (testRunnerArgs == null || typeof testRunnerArgs !== "object") throw Error("Object expected.");
        if (this.#initialized === true) throw Error("Already initialized.");

        this.#initialized = true;
        this.#runnerArgs = this.#cloneRunnerArgs(testRunnerArgs);
        this.#functionName = "TEST_CODE";

        EVUITest.Settings.outputWriter.writeOutput = (outputMessage) =>
        {
            this.writeOutput(outputMessage);
        }
    }

    writeOutput(output, outputLevel)
    {
        if (output == null) return;

        if (this.#isChildWindow === false)
        {
            var message = output;
            var level = outputLevel;
            var timestamp = null;

            if (typeof output === "object")
            {
                message = output.message;

                if (output.logLevel != null) level = output.logLevel;
                if (output.timestamp != null) timestamp = output.timestamp;
            }

            if (typeof level !== "string") level = EVUITest.LogLevel.Info;
            if (typeof timestamp !== "string") timestamp = new Date(Date.now()).toISOString();

            console.log(`${timestamp} - [${level.toUpperCase()}]: ${message}`);

            return;
        }

        var message = output;
        if (typeof output !== "object")
        {
            message = new EVUITest.OutputWiterMessage();
            message.message = output;

            if (typeof outputLevel !== "string") outputLevel = EVUITest.LogLevel.Info;
            message.level = outputLevel;
        }

        var pushMessage = new EVUIUnit.OuputPushMessage();
        pushMessage.testSessionId = this.#runnerArgs.testSessionId;
        pushMessage.message = message;

        window.parent.postMessage(pushMessage);
    }

    async run()
    {
        if (this.#testRunning === true) return;
        this.#testRunning = true;

        try
        {
            if (typeof this.#runnerArgs.testFilePath !== "string") throw Error("No file path specified.");

            var script = await this.#getScriptText();
            var injectionResult = await this.#injectScript(script, this.#runnerArgs.debug);
            if (injectionResult === false) throw Error("Failed to inject test code.");

            this.#sendTestStartMessage();

            await window[this.#functionName]();
            var now = Date.now();

            while ($evui.testHost.executing === true)
            {
                await this.#waitAsync(10);
                if (Date.now() - now > (this.#timeout * 1000)) throw Error("Test timeout hit.")
            }
        }
        catch (ex)
        {
            var outputMessage = new EVUITest.OutputWiterMessage();
            outputMessage.logLevel = EVUITest.LogLevel.Critical;
            outputMessage.message = "Error executing test function wrapper: " + ex.stack;

            this.writeOutput(outputMessage);
        }
        finally
        {
            this.#sendTestEndMessage($evui.testHost.getResults());
            this.#testRunning = false;
        }
    }

    async #getScriptText()
    {
        var url = this.#runnerArgs?.testFilePath;
        if (typeof url !== "string") throw Error("No testFilePath to pull test code from.");

        var qsExtension = url.indexOf("?") !== -1 ? "&" : "?";
        url += qsExtension + "rand=" + (Math.random() * 10000).toString(36);

        var response = await fetch(url, {
            headers: {
                "Content-Type": "text/plain",
                "Accept": "text/plain"
            }
        });

        var responseText = await response.text();
        if (typeof responseText !== "string" || responseText.trim().length === 0)
        {
            this.#sendTestStartMessage();
            throw Error("No code found for test file " + this.#runnerArgs.testFilePath);
        }
        if (this.#runnerArgs.debug === true) responseText = "debugger;" + responseText;

        var finalScript = `window["${this.#functionName}"] = async function() {${responseText}};`

        return finalScript;
    };

    #injectScript(scriptText)
    {
        var success = true;
        var errorHandler = (errorArgs) =>
        {
            if (success === false) this.writeOutput("CODE INJECTION PARSE ERROR:" + errorArgs.error.stack, EVUITest.LogLevel.Critical);
            success = false;           
        };

        window.addEventListener("error", errorHandler);

        var scriptTag = document.createElement("script");
        scriptTag.innerHTML = scriptText;

        try
        {
            document.body.append(scriptTag);
        }
        catch (ex)
        {
            errorHandler({ error: ex });
        }

        return new Promise((resolve) =>
        {
            setTimeout(function ()
            {
                window.removeEventListener("error", errorHandler);
                resolve(success);
            }, 10);
        });
    };

    #cloneRunnerArgs(serverArgs)
    {
        var newArgs = new EVUIUnit.TestRunnerServerArgs();
        newArgs.testFilePath = serverArgs.testFilePath;
        newArgs.debug = typeof serverArgs.debug === "boolean" ? serverArgs.debug : false; 
        newArgs.testSessionId = serverArgs.testSessionId;

        return newArgs;
    }

    #sendTestStartMessage()
    {
        if (this.#isChildWindow === false)
        {
            return this.writeOutput("Test starting!");
        }

        var pushMessage = new EVUIUnit.TestStatusUpdate();
        pushMessage.messageCode = EVUIUnit.MessageCodes.TestReady;
        pushMessage.testSessionId = this.#runnerArgs.testSessionId;

        window.parent.postMessage(pushMessage);
    }

    #sendTestEndMessage(results)
    {
        if (this.#isChildWindow === false)
        {
            return this.writeOutput("Test complete!");
        }

        var pushMessage = new EVUIUnit.TestCompleteMessage();
        pushMessage.testResults = (Array.isArray(results) === false) ? [] : results;
        pushMessage.testSessionId = this.#runnerArgs.testSessionId;

        window.parent.postMessage(pushMessage);
    }

    #waitAsync(duration)
    {
        return new Promise((resolve) =>
        {
            setTimeout(function ()
            {
                resolve();
            }, duration);
        });
    }
}

EVUIUnit.TestRunnerServerArgs = class
{
    testFilePath = null;
    testSessionId = null;
    debug = false;
};