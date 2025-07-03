$evui.init(async function ()
{
    var topDiv = document.createElement("div");
    topDiv.id = "top";
    topDiv.style.height = "300px";
    topDiv.style.backgroundColor = "red";
    document.body.append(topDiv);

    var bottomDiv = document.createElement("div");
    bottomDiv.id = "bottom";
    bottomDiv.style.height = "300px";
    bottomDiv.style.backgroundColor = "blue";
    document.body.append(bottomDiv);

    var model = {
        title: "abc",
        children: [
            {
                title: "def"
            },
            {
                title: "ghi",
                children: [
                    { title: 1 },
                    { title: 2 },
                    { title: 3 }
                ]
            },
        ]
    };

    var template = `
    <li>
        <strong>{{title}}</strong>
        <ul evui-binder-source="children"></ul>
    <li>
    `

    var binding = await $evui.bindAsync({
        source: model,
        htmlContent: template,
        element: topDiv
    });

    var button = document.createElement("button");
    button.textContent = "Move";
    document.body.prepend(button);

    button.onclick = function ()
    {
        if (binding.element === topDiv)
        {
            binding.element = bottomDiv;
        }
        else
        {
            binding.element = topDiv;
        }

        binding.updateAsync();
    };
});
