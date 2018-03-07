var wordArray = ["żelazo","płot","kiwi","kaptur","stopień","czas","czapa","egipt","grzmot","kamień","niebo","wojna","dno","anglia","sznur","krzesło","szafa","holender","meksyk","napad","tokio","zmywacz","szmugiel","golf","oliwa","koń","połączenie","siekacz","ameryka","lina","drzewo","gołąb","blok","rzut","policja","samochód","karawan","kręgi","żabka","rama","szczęście","poczta","piramida","pole","soczewka","masa","diament","ława","prawnik","pociąg","robak","podkład","mamut","zieleń","tusz","korzenie","chiny","limuzyna","maks","europa","choroba","butelka","igła","czujka","spadek","gotyk","but","zwoje","wiatr","pasta","łożysko","fartuch","czekolada","plastik","helikopter","gładki","królowa","złodziej","laser","aztek","samolot","geniusz","żołnierz","ząb","szpieg","noc","ciało","woda","niedźwiedź","muszla","sieć","strumień","księżyc","ręka","pojazd","belka","król","truteń","nektar","ziemia","polska","dzięcioł","gaz","ogon","awaria","gigant","usta","kciuk","pochodnia","flet","nora","bal","waszyngton","serce","kość","zmiana","trucizna","model","paleta","bermudy","chochlik","figura","wiosna","lew","kontrakt","klawisz","niemcy","gwiazda","splot","miedź","wydech","dzwon","wachlarz","zebra","donice","ośmiornica","lody","grecja","orzech","ambulans","ślimak","łuk","strzał","guzik","mysz","pazur","doktor","komórka","plaża","wkład","karta","róg","róża","rzym","pierścień","taniec","marchew","wiedźma","śmierć","szekspir","pupil","mucha","jowisz","koncert","hollywood","praca","klamka","żuraw","grzyb","podkowa","promień","moskwa","kasyno","rewolucja","strona","plik","opoka","talia","trąba","skorpion","dinozaur","żuk","kalosz","obsada","anioł","funt","znak","ambasada","grabarz","film","francuz","pekin","ryba","świnia","olimp","prawo","pingwin","stadion","ekran","rękawica","cebula","gniazdko","pistolet","hak","dwór","kasa","humor","lakier","duch","pas","placek","kostium","feniks","szpital","torebka","nóż","widelec","kangur","wieżowiec","maj","nowy jork","kozioł","australia","hotel","dzień","pokrywka","dywan","olej","żebro","most","stan","nurek","organy","merkury","bicz","ruletka","rura","bomba","żubr","statek","śnieg","szpilka","czar","perła","las","loch ness","góra","zespół","oko","życie","pająk","obcy","pudło","twarz","łódź","wieża","pilot","trawa","pielęgniarka","afryka","rekin","pustka","lot","tusza","wstęp","mur","papier","gnat","nauczyciel","mikroskop","smok","kucharz","ruda","satelita","szkocja","powietrze","pies","materiał","wieloryb","jagoda","talerz","skorupa","kolec","sukienka","linia","paluszki","lód","londyn","krzyż","orzeł","antarktyka","trójkąt","stopa","centaur","ucho","sztuka","złoto","zamek","waga","opera","atlantyda","kod","język","punkt","konar","nos","kropka","beczka","miód","kot","francja","korona","siano","teleskop","pan","babka","tchórz","krasnal","krówka","sokół","koło","pirat","ninja","rząd","przewodnik","dusza","jatka","jabłko","stół","północ","himalaje","stołek","superbohater","spadochron","bałwan","amazonka","dania","jednorożec","księżniczka","wąż","mistrz","berlin","nić","lis","port","dziura","siła","kaczor","rycerz","głowa","keczup","dziobak","milioner","królik","klucz","groszek","silnik","kret","bąk","słup","ogier","rzęsa","tablica","płyta","guma","jaja","teatr","bar","gra","toaleta","laska","kraków","rak","fala","bank","budowa","tuba","wybuch","szczyt","foka","kwadrat","gracja","świerszcz","klatka","rakieta","szkoła","naukowiec","noga","centrum","kościół","pociecha","cień","basen","bawełna","szkło","robot","kontakt","ogień","saturn"];

var newGame, loadGame, saveGame, clearGame, pickItem, newBossArray, debug, init, gameObject, doMove, updateScores, updateWordList, changeTeam;

var dupa = function() {
    console.log('dupa')
};

$(document).ready(function() {

    var url = new URL(window.location.href);
    var seed = url.searchParams.get("seed");

    if (!seed) {
        window.location = "start.html";
    }

    var words = url.searchParams.get("set");
    var mode = url.searchParams.get("mode");

    var board = $("#board");
    var teamToggle = $("#team-toggle");
    var controlPanel = $("#controls");
    var controls = controlPanel.children("div");
    var boardItems = board.children(".board-item");
    var scoreBoard = $("#scores");
    var activeColor = "";
    var scores = {"red": 8, "blue": 8};

    newBossArray = function(seed) {
        var boss = {};
        boss.start = Math.floor(Math.random()*2) ? "red" : "blue";

        intArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
        boss.bossArray = SeededShuffle.shuffle(intArray,seed,false);

        typeArray = [];

        for (var k in boss.bossArray) {
            if (k == 0) {
                typeArray.push("killer");
            } else if (k <= 7) {
                typeArray.push("neutral")
            } else if (k <= 15) {
                typeArray.push("red")
            } else if (k <= 23) {
                typeArray.push("blue")
            } else {
                typeArray.push(boss.start);
            }
        }

        boss.typeArray = typeArray;

        return boss;
    };

    newGame = function(seed) {
        Math.seedrandom(seed);

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

        for (var j in agents) {
            var itemBlock = boardItems.filter("[data-item-id='"+j+"']");
            itemBlock.find("span").html(agents[j]);
        }

        return agents;
    };

    doMove = function(color, field) {
        var fieldNode = boardItems.filter("[data-item-id='"+field+"']");
        var correctColor = gameObject.boss.typeArray[gameObject.boss.bossArray.indexOf(field)];
        var word = gameObject.agents[field];
        var otherColor = (activeColor == "blue") ? "red" : "blue";

        fieldNode.addClass(correctColor).off("click");

        updateWordList(activeColor, correctColor, word);

        if (correctColor == activeColor) {
            scores[activeColor]--;
        } else if (correctColor == 'killer') {
            // end game
        } else if (correctColor == 'neutral') {
            changeTeam();
        } else {
            scores[otherColor]--;
            changeTeam();
        }

        updateScores();
    };

    updateWordList = function(team, color, word) {
        var listItem = "<li class='"+color+"'>"+word+"</li>";
        $(".scores-"+team+" .word-list").append(listItem);
    };

    updateScores = function() {
        $(".scores-red .scores-num").html(scores.red);
        $(".scores-blue .scores-num").html(scores.blue);
    };

    changeTeam = function() {
        activeColor = (activeColor == "blue") ? "red" : "blue";
        teamToggle.prop("checked", (activeColor == "blue"));
    };

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

        instance.find(".modal-close").off("click").click(function(e){
            e.preventDefault();
            self.modalClose();
        });
        instance.find("a.button").off("click").click(function(e){
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

    init = function(seed, words, mode) {
        var saveId = seed + words + mode;
        //var saveFile = eval(localStorage.getItem("game-"+saveId));
        var saveFile = [["red", 23], ["red", 14], ["blue", 13]];

        gameObject = {};

        gameObject.agents = newGame(seed);
        gameObject.boss = newBossArray(seed);

        activeColor = gameObject.boss.start;
        changeTeam();
        scores[activeColor] = 9;
        updateScores();

        if (saveFile) {
            for(var i in saveFile) {
                var color = saveFile[i][0];
                var field = saveFile[i][1]
                //doMove(color, field);
            }
        } else {
            saveFile = [];
        }
    };

    init(seed, words, mode);

    boardItems.click(function() {
        var field = $(this).data("item-id");
        var moveModal = new Modal($("#move-modal"), function() {
            doMove(activeColor, field);
        });
        moveModal.modalOpen();
    });

    teamToggle.change(function(e) {
        e.preventDefault();
        changeTeam();
    });



    /* SHIT CODE */

    debug = function() {
        console.log(Modal);

    };

    saveGame = function() {
        if (seed) {
            var saveFile = [];

            boardItems.each(function() {

                var item = {};
                item.id = $(this).data("item-id");

                if ($(this).hasClass("blue")) {
                    item.status = "blue";
                } else if ($(this).hasClass("red")) {
                    item.status = "red";
                } else if ($(this).hasClass("neutral")) {
                    item.status = "neutral";
                } else {
                    item.status = 0;
                }

                saveFile.push(item);
            });

            localStorage.setItem(seed, JSON.stringify(saveFile));
        }
    };

    loadGame = function() {
        var saveFile = JSON.parse(localStorage.getItem(seed));

        if (!saveFile) {
            return false
        } else {
            for (var item in saveFile) {
                boardItems.filter("[data-item-id='"+saveFile[item].id+"']").addClass(saveFile[item].status);
            }
        }
    };

    //loadGame();

    clearGame = function() {
        localStorage.removeItem(seed);
        boardItems.removeClass("active blue red neutral killer");
    };

    pickItem = function(item, type) {
        item.removeClass("active blue red neutral killer").addClass(type).addClass("selected");
        controlPanel.removeClass("active");
    };

    controls.click(function() {
        if (controlPanel.hasClass("active")) {
            var activeItem = boardItems.filter(".active");
            var type = $(this).data("id");

            pickItem(activeItem, type);
            saveGame();
        }
    });
});