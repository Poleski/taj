$(document).ready(function() {
    var newLoad = $(".new_load");
    var formContainer = $(".form-container");
    var newLoadInputs = $("input[type='radio']", newLoad);
    var seedInput = $(".seed input[type='text']");
    var playerToggle = $(".player input[type='radio']");
    var saveList = localStorage.getItem("saves");

    if (!saveList) {
        localStorage.setItem("saves", JSON.stringify({}));
    }

    function genSeed() {
        var timestamp = Date.now();
        seed = timestamp.toString(16).slice(0,8);
        seedInput.val(seed);
    }

    genSeed();

    function resetFields() {
        $("fieldset.toggle").each(function() {
            $(this).find("input").first().prop("checked", true);
        })
    }

    resetFields();

    $(".seed_gen").click(function(e) {
        e.preventDefault();
        genSeed();
    });

    seedInput.focus(function() {
        $(this).val('');
    });

    seedInput.blur(function() {
        if ($(this).val() == "") {
            genSeed();
        }
    });

    newLoadInputs.change(function() {
        var activeForm = $(this).val();
        formContainer.removeClass("active").filter("." + activeForm).addClass("active");
    });

    playerToggle.change(function() {
        $(this).parents(".form-container").find('form').attr("action", $(this).val());
    });

    $("#new-game").submit(function(e) {
        e.preventDefault();
        var gameCode = seedInput.val() + $(this).find("#set").val() + $(this).find(".mode input:checked").val();
        console.log(gameCode);
        saveList = JSON.parse(localStorage.getItem("saves"));

        if (saveList[gameCode]) {
            alert("Gra już istnieje.");
        } else {
            var timestamp = Date.now();
            saveList[gameCode] = timestamp;
            localStorage.setItem("saves", JSON.stringify(saveList));
            $(this).off("submit").submit();
        }
    });

});