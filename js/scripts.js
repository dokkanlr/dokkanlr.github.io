//effectively links super-evos with their base forms
var base = [
  {base: 261, evo: 1413},
  {base: 367, evo: 1619},
  {base: 416, evo: 1445},
  {base: 459, evo: 1847},
  {base: 530, evo: 1707},
  {base: 562, evo: 1816},
  {base: 669, evo: 1492},
  {base: 718, evo: 1881},
  {base: 720, evo: 1927},
  {base: 748, evo: 1663},
  {base: 870, evo: 2444},
  {base: 935, evo: 2066},
  {base: 1001, evo: 2195},
  {base: 1035, evo: 1928},
  {base: 1045, evo: 2001},
  {base: 1123, evo: 2357},
  {base: 1192, evo: 1764},
  {base: 1240, evo: 2034},
  {base: 1314, evo: 2578},
  {base: 1362, evo: 1921},
  {base: 1391, evo: 2035},
  {base: 1404, evo: 1593},
  {base: 1434, evo: 1880},
  {base: 1473, evo: 2631},
  {base: 1532, evo: 1543},
  {base: 1571, evo: 2372},
  {base: 1588, evo: 2245},
  {base: 1610, evo: 2232},
  {base: 1652, evo: 2373},
  {base: 1698, evo: 2159},
  {base: 1747, evo: 2434},
  {base: 1751, evo: 1922},
  {base: 1763, evo: 5012},
  {base: 1832, evo: 2138},
  {base: 1869, evo: 2505},
  {base: 1935, evo: 2300},
  {base: 2074, evo: 2363},
  {base: 2076, evo: 2588},
  {base: 2234, evo: 2500},
  {base: 2651, evo: 2681},
];

function updateStorage(key, value, save) {
  if (save) {
    localStorage.setItem(key, value);
  }
  else {
    localStorage.removeItem(key);
  }
}

function readStorageValue(key) {
  return localStorage.getItem(key);
}

function readAllStorage() {
  const nbItem = localStorage.length;
  const store = [];
  let i;
  let storeKey;
  for (i = 0; i < nbItem; i += 1) {
    storeKey = localStorage.key(i);
    store.push({
      "key" : storeKey,
      "value" : readStorageValue(storeKey)
    });
  }
  return store;
}

function updatePage() {
  //check local storage
  const store = readAllStorage();
  //restore the selected class
  $.each(store, function(index, elem) {
    $("#" + elem.key).addClass("selected");
    if(elem['value'] == 'rainbow')
      $("#" + elem.key).addClass("rainbow");
  });
}

function selectPage() {
  //adds selected class to every icon
  $(".flair").addClass("selected");

  var className = document.getElementsByClassName('selected');
  var idStore = new Array();

  //loops every ID and stores key into array
  for(var i = 0; i < className.length; i++) {
    idStore.push({"key" : className[i].id, "value" : className[i].className});
  }

  //add IDs from array to local storage
  for(var j=0; j<idStore.length; j++) {
    if(idStore[j]['value'].includes('rainbow')) {
      updateStorage(idStore[j]['key'], "rainbow", true);
    }
    else {
      updateStorage(idStore[j]['key'], null, true);
    }
  }
}

function resetPage() {
  //check local storage
  const store = readAllStorage();
  //delete the selected class
  $.each(store, function(index, elem) {
    $("#" + elem.key).removeClass("selected");
    $("#" + elem.key).removeClass("rainbow");
  });
  //clears local storage
  localStorage.clear();
}

//unique legend tracker
function countLegends() {
  var total = $(".flair").length - $(".base").length;

  var selected = $('.selected');
  var pairs = [];

  //maps evos with base
  var baseMap = base.reduce(function(map, obj) {
      map[obj.evo] = obj.base;
      return map;
  }, {});

  //pushes IDs to new array
  for(var i = 0; i < selected.length; i++) {
    pairs.push(selected[i].id);
  }

  //creates new set and returns size
  function countUnique(iterable) {
    return new Set(pairs.map (x => baseMap.hasOwnProperty(x)? baseMap[x].toString() : x)).size;
  }

  $('#counter').html("<span class='cl'>Unique Legends - </span>" + countUnique() + "/" + total);
  countLegends2();
}

//total legend tracker
function countLegends2() {
  var amount = $(".selected").length;
  var total = $(".flair").length;

  $('#counter2').html("<span class='cl'>Total Legends - </span>" + amount + "/" + total);
  countRainbows();
}

//rainbow tracker
function countRainbows() {
  var amount = $(".rainbow").length;
  var total = $(".flair").length;

  $('#rainbow').html("<span class='cl'>Rainbowed - </span>" + amount + "/" + total);
}




jQuery(document).ready(function($) {

  //adds base class to pre-defined elements
  for(var v in base) {
    var item = document.getElementById(base[v]['base']);

    $(item).addClass('base');
  }

  //restore previous state
  updatePage();

  //legend counter
  countLegends();

  //main function for selecting icons
  $("#special span").mousedown(function(e) {
    var isChecked = document.getElementById('switch').checked;
    const $obj = $(this);

    //toggle must be checked first
    if(isChecked) {
      if($obj.hasClass("selected")) {
        $obj.toggleClass('rainbow');
      }
      else {
        $obj.toggleClass('rainbow selected');
      }

      //creates object if selected class is present
      const save = $obj.hasClass("selected");
      var rainbow = $obj.hasClass("rainbow");

      //updates the storage value accordingly
      if(rainbow) {
        updateStorage($obj.attr("id"), "rainbow", save);
      }
      else {
        updateStorage($obj.attr("id"), null, save);
      }
      countLegends();
    }
    //if not checked
    else {
      //toggles selected classes
      $obj.toggleClass("selected");
      $obj.removeClass("rainbow");

      //creates object if selected class is present
      const save = $obj.hasClass("selected");

      //update the key
      updateStorage($obj.attr("id"), null, save);

      countLegends();
    }
  });

  //select all button
  $("#select-all").on("click", function() {
    selectPage();
    countLegends();
  });

  //clear button
  $("#select-none").on("click", function() {
    resetPage();
    countLegends();
  });

  //shows base forms of legends with super-evos
  $("#show-base").on("click", function() {
    $('.base').css('display', 'inline-block');
    $('#show-base').css('display', 'none');
    $('#hide-base').css('display', 'inline-block');
  });

  //shows base forms of legends with super-evos
  $("#hide-base").on("click", function() {
    $('.base').css('display', 'none');
    $('#hide-base').css('display', 'none');
    $('#show-base').css('display', 'inline-block');
  });
});
