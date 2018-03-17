$(document).ready(function() {

    /*
    PREPARATION
     */

    // Cache nodes

    var newLoad = $(".new_load");
    var formContainer = $(".form-container");
    var newLoadInputs = $("input[type='radio']", newLoad);
    var seedInput = $(".seed input[type='text']");
    var playerToggle = $(".player input[type='radio']");

    // Get save list object and parse it. If it doesn't exist, store an empty object.

    var saveList = JSON.parse(localStorage.getItem("saves"));

    if (!saveList) {
        localStorage.setItem("saves", JSON.stringify({}));
    }

    /*
    FUNCTIONS
     */

    // Generate new seed based on the timestamp

    function genSeed() {
        var timestamp = Date.now();
        seed = parseInt((timestamp*2).toString().slice(0,9)).toString(36);
        seedInput.val(seed);
    }

    // reset all fields. Triggered on page refresh, thanks to empty onunload event trigger in html

    function resetFields() {
        $("fieldset.toggle").each(function() {
            $(this).find("input").first().prop("checked", true);
        })
    }

    /*
    START
     */

    // Run initial functions

    genSeed();
    resetFields();

    // Regenerate seed on clicking the icon

    $(".seed_gen").click(function(e) {
        e.preventDefault();
        genSeed();
    });

    // Reset seed input field on focus.

    seedInput.focus(function() {
        $(this).val('');
    });

    // If seed input is empty on blur, regenerate seed

    seedInput.blur(function() {
        if ($(this).val() == "") {
            genSeed();
        }
    });

    // Toggle between new game and load game

    newLoadInputs.change(function() {
        var activeForm = $(this).val();
        formContainer.removeClass("active").filter("." + activeForm).addClass("active");
    });

    // Change the form action depending on the value of player toggle.

    playerToggle.change(function() {
        $(this).parents(".form-container").find('form').attr("action", $(this).val());
    });

    // Start a game and save it in save list. Prevent submitting if game of this code already exists

    $("#new-game").submit(function(e) {
        e.preventDefault();
        var gameCode = seedInput.val() + $(this).find("#set").val() + $(this).find(".mode input:checked").val();
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