//defines which legends have a super-evo
var base = ['261','367','416','459','530','562','669','718','720','748','870','935','1001','1035','1045','1123','1192','1240','1314','1362','1391','1404','1434','1473','1532','1571','1588','1610','1652','1698','1747','1751','1763','1832','1869','1935','2074','2076','2234','2651'];
var final = ['578', '649','1085','1268','1413','1445','1492','1543','1593','1619','1663','1698','1707','1764','1794','1816','1847','1880','1881','1883','1910','1921','1922','1927','1928','1951','1985','2001','2007','2023','2025','2034','2035','2066','2099','2113','2138','2148','2159','2181','2195','2201','2232','2236','2245','2251','2265','2300','2302','2330','2338','2357','2363','2365','2372','2373','2418','2433','2434','2441','2444','2446','2465','2475','2477','2500','2505','2534','2536','2561','2577','2578','2588','2601','2603','2631','2672','2681','2686','2700','5012','5014',]

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
  var final = $(".final.selected").length;
  var diff = $('.base').length;
  var total = $(".flair").length;
  var unique = total - diff;

  //$('#counter').html("<span class='cl'>Unique Legends - </span>" + final + "/" + unique);
  countLegends2();
}

//total legend tracker
function countLegends2() {
  var amount = $(".selected").length;
  var total = $(".flair").length;

  $('#counter2').html("<span class='cl'>Total Legends - </span>" + amount + "/" + total);
}

//rainbow tracker
function countRainbows() {
  var amount = $(".rainbow").length;
  var total = $(".flair").length;

  $('#rainbow').html("<span class='cl'>Rainbowed - </span>" + amount + "/" + total);
}




jQuery(document).ready(function($) {
  //disables right-click which is preserved for rainbow borders
  document.addEventListener('contextmenu', event => event.preventDefault());

  for(var v in base) {
    var item = document.getElementById(base[v]);

    $(item).addClass('base');
  }

  for(var u in final) {
    var item2 = document.getElementById(final[u]);

    $(item2).addClass('final');
  }

  //restore previous state
  updatePage();

  //legend counter
  countLegends();

  //rainbow counter
  countRainbows();

  // Warning- do not target only the selected class
  $("#special span").mousedown(function(e) {
    const $obj = $(this);

    //shift + click toggles rainbow border
    if(e.which == 3){
      if($obj.hasClass("selected")) {
        $obj.toggleClass('rainbow');
      }
      else {
        $obj.toggleClass('rainbow selected');
      }

      //creates object if selected class is present
      const save = $obj.hasClass("selected");
      var rainbow = $obj.hasClass("rainbow");

      //updates the value accordingly
      if(rainbow) {
        updateStorage($obj.attr("id"), "rainbow", save);
      }
      else {
        updateStorage($obj.attr("id"), null, save);
      }
    }
    else {
      //toggles selected class
      $obj.toggleClass("selected");
      $obj.removeClass("rainbow");

      //creates object if selected class is present
      const save = $obj.hasClass("selected");

      //update the key
      updateStorage($obj.attr("id"), null, save);
    }
    countLegends();
    countRainbows();
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
    countRainbows();
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
