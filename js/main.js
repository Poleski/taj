// Set up public variables and functions. Will be made private once v1.0 is deployed

var wordArray = ["żelazo","płot","kiwi","kaptur","stopień","czas","czapa","egipt","grzmot","kamień","niebo","wojna","dno","anglia","sznur","krzesło","szafa","holender","meksyk","napad","tokio","zmywacz","szmugiel","golf","oliwa","koń","połączenie","siekacz","ameryka","lina","drzewo","gołąb","blok","rzut","policja","samochód","karawan","kręgi","żabka","rama","szczęście","poczta","piramida","pole","soczewka","masa","diament","ława","prawnik","pociąg","robak","podkład","mamut","zieleń","tusz","korzenie","chiny","limuzyna","maks","europa","choroba","butelka","igła","czujka","spadek","gotyk","but","zwoje","wiatr","pasta","łożysko","fartuch","czekolada","plastik","helikopter","gładki","królowa","złodziej","laser","aztek","samolot","geniusz","żołnierz","ząb","szpieg","noc","ciało","woda","niedźwiedź","muszla","sieć","strumień","księżyc","ręka","pojazd","belka","król","truteń","nektar","ziemia","polska","dzięcioł","gaz","ogon","awaria","gigant","usta","kciuk","pochodnia","flet","nora","bal","waszyngton","serce","kość","zmiana","trucizna","model","paleta","bermudy","chochlik","figura","wiosna","lew","kontrakt","klawisz","niemcy","gwiazda","splot","miedź","wydech","dzwon","wachlarz","zebra","donice","ośmiornica","lody","grecja","orzech","ambulans","ślimak","łuk","strzał","guzik","mysz","pazur","doktor","komórka","plaża","wkład","karta","róg","róża","rzym","pierścień","taniec","marchew","wiedźma","śmierć","szekspir","pupil","mucha","jowisz","koncert","hollywood","praca","klamka","żuraw","grzyb","podkowa","promień","moskwa","kasyno","rewolucja","strona","plik","opoka","talia","trąba","skorpion","dinozaur","żuk","kalosz","obsada","anioł","funt","znak","ambasada","grabarz","film","francuz","pekin","ryba","świnia","olimp","prawo","pingwin","stadion","ekran","rękawica","cebula","gniazdko","pistolet","hak","dwór","kasa","humor","lakier","duch","pas","placek","kostium","feniks","szpital","torebka","nóż","widelec","kangur","wieżowiec","maj","nowy jork","kozioł","australia","hotel","dzień","pokrywka","dywan","olej","żebro","most","stan","nurek","organy","merkury","bicz","ruletka","rura","bomba","żubr","statek","śnieg","szpilka","czar","perła","las","loch ness","góra","zespół","oko","życie","pająk","obcy","pudło","twarz","łódź","wieża","pilot","trawa","pielęgniarka","afryka","rekin","pustka","lot","tusza","wstęp","mur","papier","gnat","nauczyciel","mikroskop","smok","kucharz","ruda","satelita","szkocja","powietrze","pies","materiał","wieloryb","jagoda","talerz","skorupa","kolec","sukienka","linia","paluszki","lód","londyn","krzyż","orzeł","antarktyka","trójkąt","stopa","centaur","ucho","sztuka","złoto","zamek","waga","opera","atlantyda","kod","język","punkt","konar","nos","kropka","beczka","miód","kot","francja","korona","siano","teleskop","pan","babka","tchórz","krasnal","krówka","sokół","koło","pirat","ninja","rząd","przewodnik","dusza","jatka","jabłko","stół","północ","himalaje","stołek","superbohater","spadochron","bałwan","amazonka","dania","jednorożec","księżniczka","wąż","mistrz","berlin","nić","lis","port","dziura","siła","kaczor","rycerz","głowa","keczup","dziobak","milioner","królik","klucz","groszek","silnik","kret","bąk","słup","ogier","rzęsa","tablica","płyta","guma","jaja","teatr","bar","gra","toaleta","laska","kraków","rak","fala","bank","budowa","tuba","wybuch","szczyt","foka","kwadrat","gracja","świerszcz","klatka","rakieta","szkoła","naukowiec","noga","centrum","kościół","pociecha","cień","basen","bawełna","szkło","robot","kontakt","ogień","saturn"];

var newGame, loadGame, saveGame, clearGame, newBossArray, init, gameObject, doBossMove, doMove, updateScores, changeTeam, endGame;


$(document).ready(function() {

    /*
    PREPARATION
     */

    // Parse url parameters. Redirect back to start if no seed is specified.

    var url = location.href;
    var params = url.split("?")[1].split("&");
    var paramObject = {};

    for (var x in params) {
        var splitValue = params[x].split("=");
        var key = splitValue[0];
        var paramValue = splitValue[1];

        paramObject[key] = paramValue;
    }

    var seed = paramObject.seed;
    var words = paramObject.words;


    if (!seed) {
        window.location = "start.html";
    }

    if (!words) {
        words = "s"
    }

    // Prepare all future randomizations with seed

    Math.seedrandom(seed);

    // Cache nodes

    var bossBool = ($("body").hasClass("boss-screen"));
    var board = $("#board");
    var bossBoard = $("#boss-board");
    var teamToggle = $("#team-toggle");
    var boardItems = board.children(".board-item");
    var bossGridToggle = $("#boss-grid-toggle");
    var bossGrid = $(".boss-screen #board-container");

    // Set up variables that should be private but in high scope.

    var saveId,saveFile;
    var activeColor = "";
    var scores = {"red": 8, "blue": 8};

    // Modal constructor

    var Modal = function(instance,task) {
        this.instance = instance;
        this.task = task;
        this.modalOpen = function() {
            instance.fadeIn();
        };
        this.modalClose = function() {
            instance.fadeOut();
        };

        var self = this;

        instance.find(".modal-close,a.button.cancel").off("click").click(function(e){
            e.preventDefault();
            self.modalClose();
        });
        instance.find("a.button.approve").off("click").click(function(e){
            e.preventDefault();
            $(this).off("click");
            self.modalClose();
            self.task();
        });
        instance.find(".modal-content").off("click").click(function(e) {
            e.stopPropagation();
        });

        instance.off("click").click(this.modalClose);
    };

    /*
    FUNCTIONS
     */


    // Initial setup of the game. Runs on each page reload for both boards

    init = function(seed, words) {

        // Prepare save info

        saveId = seed + words;
        saveFile = eval(localStorage.getItem("game-"+saveId));

        // Prepare main game object

        gameObject = {};
        gameObject.agents = newGame(seed);
        gameObject.boss = newBossArray(seed);

        // Set up initial values of important variables

        activeColor = gameObject.boss.start;
        teamToggle.prop("checked", (activeColor == "blue"));
        scores[activeColor] = 9;
        updateScores();

        // Load game if it exists

        if (saveFile && !bossBool) {
            loadGame();
        } else {
            saveFile = [];
            saveGame();
        }
    };

    // Create set of words and populate agent board, return an array with them. SEEDRANDOM RUN #1

    newGame = function(seed) {

        // Get 25 random words based into an array

        var agents = [];
        var i = 0;

        while (i < 25) {
            var wordArrayLen = wordArray.length;
            var num = Math.floor(Math.random()*wordArrayLen);
            var word = wordArray[num];

            if (agents.indexOf(word) < 0) {
                agents.push(word);
                i++;
            }
        }

        // Add those words to agents board.

        for (var j in agents) {
            var itemBlock = boardItems.filter("[data-item-id='"+j+"']");
            itemBlock.attr("data-item-word", agents[j]).find("span").html(agents[j]);
        }

        // Assign click handlers to each board item. For boss boards, just toggle classes. For agents board, deploy modal with doMove() callback

        boardItems.click(function() {
            if (bossBool) {
                doBossMove($("span", this).html());
            } else {
                var field = $(this).data("item-id");
                var modal = $("#move-modal");
                modal.find(".word").html($(this).find("span").html());
                var moveModal = new Modal(modal, function() {
                    doMove(activeColor, field, true);
                });
                moveModal.modalOpen();
            }
        });

        return agents;
    };

    // Create set of colors and populate boss board and word list, return an object with boss board info. Assign click event handlers to boss board items and make the word list sortable. SEEDRANDOM RUN #2

    newBossArray = function(seed) {

        // Separate function for creating the word array and coloring the words in boss board grid

        var bossListBuild = function(word, type, index) {
            bossBoard.find(".word-container."+type).append("<li class='boss-word "+type+"' data-word='"+word+"' data-color='"+type+"'>"+word+"</li>");
            if (bossBool) {
                var field = boardItems.filter("[data-item-id='"+index+"']");
                field.addClass(type);
            }
        };

        // Set up an object. Pick random color and shuffle an integer array.

        var boss = {};
        boss.start = Math.floor(Math.random()*2) ? "red" : "blue";

        intArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
        boss.bossArray = SeededShuffle.shuffle(intArray,seed,false);

        // Assign each integer a corresponding color. Match with agents data to get words.

        typeArray = [];

        for (var k in boss.bossArray) {
            var word = gameObject.agents[boss.bossArray[k]];

            if (k == 0) {
                typeArray.push("killer");
                bossListBuild(word, "killer", boss.bossArray[k]);
            } else if (k <= 7) {
                typeArray.push("neutral");
                bossListBuild(word, "neutral", boss.bossArray[k]);
            } else if (k <= 15) {
                typeArray.push("red");
                bossListBuild(word, "red", boss.bossArray[k]);
            } else if (k <= 23) {
                typeArray.push("blue");
                bossListBuild(word, "blue", boss.bossArray[k]);
            } else {
                typeArray.push(boss.start);
                bossListBuild(word, boss.start, boss.bossArray[k]);
            }
        }

        boss.typeArray = typeArray;

        // Assign click handlers to boss grid and make word list sortable, if we are in a boss screen

        if (bossBool) {
            bossBoard.find(".boss-word").click(function() {
                doBossMove($(this).data("word"));
            });

            bossBoard.find(".word-container").sortable({
                stop: function(e, ui) {
                    ui.item.trigger("click");
                }
            });
        }

        // Return boss object (gameObject.boss)

        return boss;
    };

    // Toggle classes on clicking words in boss board grid and boss word list. Triggered on click.

    doBossMove = function(word) {
        boardItems.filter("[data-item-word='"+word+"']").toggleClass("found");
        bossBoard.find(".boss-word[data-word='"+word+"']").toggleClass("found");
    };

    // Check color, change apply changes to score, check if game should be ended. Save state in localStorage. Triggered on moveModal confirmation and on loading game.

    doMove = function(color, field, save) {

        // Inner function for updating the list of words

        var updateWordList = function(team, color, word) {
            var listItem = "<li class='"+color+"'>"+word+"</li>";
            $(".scores-"+team+" .word-list").append(listItem);
        };

        // Prepare variables

        var fieldNode = boardItems.filter("[data-item-id='"+field+"']");
        var word = gameObject.agents[field];
        var correctColor = gameObject.boss.typeArray[gameObject.boss.bossArray.indexOf(field)];
        var otherColor = (activeColor == "blue") ? "red" : "blue";

        // Prepare save part and perform a game save

        if (save) {
            var savePart = {};
            savePart[color] = field;
            saveFile.push(savePart);
            saveGame();
        }

        // Remove click handler from the field node

        fieldNode.addClass(correctColor).off("click");

        // Update word list with

        updateWordList(activeColor, correctColor, word);

        // Change the score, change team and/or end game, depending on what has been clicked

        if (correctColor == activeColor) {
            scores[activeColor]--;
        } else if (correctColor == 'killer') {
            endGame(otherColor, 1);
        } else if (correctColor == 'neutral') {
            changeTeam();
        } else {
            scores[otherColor]--;
            changeTeam();
        }

        // Update score in case it changed

        updateScores();
    };

    // Update score board based on current values of score object. If any score is now 0, end game

    updateScores = function() {
        $(".scores-red .scores-num").html(scores.red);
        $(".scores-blue .scores-num").html(scores.blue);

        if (scores.red == 0 || scores.blue == 0) {
            if (scores.red == 0) {
                endGame("red");
            } else {
                endGame("blue");
            }
        }
    };

    // Change team to the opposite color. Triggered on failed move and on clicking the team change toggle

    changeTeam = function() {
        activeColor = (activeColor == "blue") ? "red" : "blue";
        teamToggle.prop("checked", (activeColor == "blue"));
    };

    // End game. Triggered on finding the killer and on score reaching 0.

    endGame = function(team, killer) {

        // Prepare variables

        var teamName = (team == "red") ? "Czerwoni" : "Niebiescy";
        var reason = (killer) ? "przeciwnicy odkryli mordercę!" : "odnaleźli wszystkich swoich agentów";

        // Modify modal html

        var modal = $("#end-modal");
        modal.find(".team").addClass("team").html(teamName);
        modal.find(".reason").html(reason);

        // Construct endModal with dummy callback and open it

        var endModal = new Modal($("#end-modal"), function() {
            return true;
        });

        endModal.modalOpen();

        // Unregister all click handlers from the board

        boardItems.off("click");

        // Show end game notice

        $("#team-toggle-container h3").show();
    };

    // Save game state to localStorage

    saveGame = function() {
        localStorage.setItem("game-"+saveId, JSON.stringify(saveFile));
    };

    // Load game state from localStorage and perform each move descibed. Triggered on init when game save is registered.

    loadGame = function() {
        for(var i in saveFile) {
            var color = Object.keys(saveFile[i]);
            var field = saveFile[i][color];
            doMove(color, field);
        }
    };

    // Function for toggling between word list and boss grid. Triggered on changing checkbox

    function bossGridChange(check) {
        if (check) {
            bossGrid.show();
            bossBoard.hide()
        } else {
            bossGrid.hide();
            bossBoard.show();
        }
    }

    /*
    START THE GAME
    */

    init(seed, words);

    // Change team toggle handling

    teamToggle.change(function(e) {
        e.preventDefault();
        changeTeam();
    });

    // Toggle between word list and boss grid

    bossGridChange(bossGridToggle.prop("checked"))

    bossGridToggle.change(function() {
        bossGridChange($(this).prop("checked"));
    })
});