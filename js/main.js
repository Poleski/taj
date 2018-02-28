var wordArray = ["żelazo","płot","kiwi","kaptur","stopień","czas","czapa","egipt","grzmot","kamień","niebo","wojna","dno","anglia","sznur","krzesło","szafa","holender","meksyk","napad","tokio","zmywacz","szmugiel","golf","oliwa","koń","połączenie","siekacz","ameryka","lina","drzewo","gołąb","blok","rzut","policja","samochód","karawan","kręgi","żabka","rama","szczęście","poczta","piramida","pole","soczewka","masa","diament","ława","prawnik","pociąg","robak","podkład","mamut","zieleń","tusz","korzenie","chiny","limuzyna","maks","europa","choroba","butelka","igła","czujka","spadek","gotyk","but","zwoje","wiatr","pasta","łożysko","fartuch","czekolada","plastik","helikopter","gładki","królowa","złodziej","laser","aztek","samolot","geniusz","żołnierz","ząb","szpieg","noc","ciało","woda","niedźwiedź","muszla","sieć","strumień","księżyc","ręka","pojazd","belka","król","truteń","nektar","ziemia","polska","dzięcioł","gaz","ogon","awaria","gigant","usta","kciuk","pochodnia","flet","nora","bal","waszyngton","serce","kość","zmiana","trucizna","model","paleta","bermudy","chochlik","figura","wiosna","lew","kontrakt","klawisz","niemcy","gwiazda","splot","miedź","wydech","dzwon","wachlarz","zebra","donice","ośmiornica","lody","grecja","orzech","ambulans","ślimak","łuk","strzał","guzik","mysz","pazur","doktor","komórka","plaża","wkład","karta","róg","róża","rzym","pierścień","taniec","marchew","wiedźma","śmierć","szekspir","pupil","mucha","jowisz","koncert","hollywood","praca","klamka","żuraw","grzyb","podkowa","promień","moskwa","kasyno","rewolucja","strona","plik","opoka","talia","trąba","skorpion","dinozaur","żuk","kalosz","obsada","anioł","funt","znak","ambasada","grabarz","film","francuz","pekin","ryba","świnia","olimp","prawo","pingwin","stadion","ekran","rękawica","cebula","gniazdko","pistolet","hak","dwór","kasa","humor","lakier","duch","pas","placek","kostium","feniks","szpital","torebka","nóż","widelec","kangur","wieżowiec","maj","nowy jork","kozioł","australia","hotel","dzień","pokrywka","dywan","olej","żebro","most","stan","nurek","organy","merkury","bicz","ruletka","rura","bomba","żubr","statek","śnieg","szpilka","czar","perła","las","loch ness","góra","zespół","oko","życie","pająk","obcy","pudło","twarz","łódź","wieża","pilot","trawa","pielęgniarka","afryka","rekin","pustka","lot","tusza","wstęp","mur","papier","gnat","nauczyciel","mikroskop","smok","kucharz","ruda","satelita","szkocja","powietrze","pies","materiał","wieloryb","jagoda","talerz","skorupa","kolec","sukienka","linia","paluszki","lód","londyn","krzyż","orzeł","antarktyka","trójkąt","stopa","centaur","ucho","sztuka","złoto","zamek","waga","opera","atlantyda","kod","język","punkt","konar","nos","kropka","beczka","miód","kot","francja","korona","siano","teleskop","pan","babka","tchórz","krasnal","krówka","sokół","koło","pirat","ninja","rząd","przewodnik","dusza","jatka","jabłko","stół","północ","himalaje","stołek","superbohater","spadochron","bałwan","amazonka","dania","jednorożec","księżniczka","wąż","mistrz","berlin","nić","lis","port","dziura","siła","kaczor","rycerz","głowa","keczup","dziobak","milioner","królik","klucz","groszek","silnik","kret","bąk","słup","ogier","rzęsa","tablica","płyta","guma","jaja","teatr","bar","gra","toaleta","laska","kraków","rak","fala","bank","budowa","tuba","wybuch","szczyt","foka","kwadrat","gracja","świerszcz","klatka","rakieta","szkoła","naukowiec","noga","centrum","kościół","pociecha","cień","basen","bawełna","szkło","robot","kontakt","ogień","saturn"];

var newGame, loadGame, saveGame, clearGame, pickItem, newBossArray, debug;

$(document).ready(function() {

    var url = new URL(window.location.href);
    var seed = url.searchParams.get("seed");

    if (!seed) {
        var timestamp = Date.now();
        seed = timestamp.toString(16).slice(0,8);
        window.location.href = window.location.href + "?seed=" + seed;
    }

    var board = $("#board");
    var controlPanel = $("#controls");
    var controls = controlPanel.children("div");
    var boardItems = board.children(".board-item")
    var gameArray = [];
    var boss = {};

    newBossArray = function(seed) {
        var boss = {};
        boss.start = Math.floor(Math.random()*2) ? "red" : "blue";

        intArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
        boss.bossArray = SeededShuffle.shuffle(intArray,seed,false);

        typeArray = [];

        for (var k in boss.bossArray) {
            if (k === 0) {
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

        gameArray = [];
        var i = 0;

        while (i < 25) {
            var wordArrayLen = wordArray.length;
            var num = Math.floor(Math.random()*wordArrayLen);
            var word = wordArray[num];

            if (gameArray.indexOf(word) < 0) {
                gameArray.push(word);
                i++;
            }
        }

        for (var j in gameArray) {
            var itemBlock = boardItems.filter("[data-item-id='"+j+"']");
            itemBlock.find("span").html(gameArray[j]);
        }

        boss = newBossArray(seed);
    };

    debug = function() {
        console.log(boss);

        boardItems.each(function() {
            $(this).removeClass("active blue red neutral killer");

            var currentId = $(this).data("item-id");
            var bossArrayIndex = boss.bossArray.indexOf(currentId);

            $(this).addClass(boss.typeArray[bossArrayIndex]);
        })
    };

    newGame(seed);

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

    loadGame();

    clearGame = function() {
        localStorage.removeItem(seed);
        boardItems.removeClass("active blue red neutral killer");
    };

    pickItem = function(item, type) {
        item.removeClass("active blue red neutral killer").addClass(type).addClass("selected");
        controlPanel.removeClass("active");
    };

    boardItems.click(function() {
        if (!$(this).hasClass("active")) {
            boardItems.filter(".active").removeClass("active");
            $(this).addClass("active");
            controlPanel.addClass("active");
        }
    });

    controls.click(function() {
        if (controlPanel.hasClass("active")) {
            var activeItem = boardItems.filter(".active");
            var type = $(this).data("id");

            pickItem(activeItem, type);
            saveGame();
        }
    });
});