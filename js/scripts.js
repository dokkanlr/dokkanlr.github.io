//defines which legends have a super-evo
var base = ['261','367','416','459','530','562','669','718','720','748','870','935','1001','1035','1045','1123','1192','1240','1314','1362','1391','1404','1434','1473','1532','1571','1588','1610','1652','1698','1747','1751','1763','1832','1869','1935','2074','2076','2234','2651'];

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

function countLegends() {
  var amount = $(".selected").length;
  var diff = $(".base").length;
  var total = $(".flair").length;
  var unique = total - diff;

  $('#counter').html("<span class='cl'>Unique Legends - </span>" + amount + "/" + unique);
  countLegends2();
}

function countLegends2() {
  var amount = $(".selected").length;
  var total = $(".flair").length;

  $('#counter2').html("<span class='cl'>Total Legends - </span>" + amount + "/" + total);
}

function countRainbows() {
  var amount = $(".rainbow").length;
  var total = $(".flair").length;

  $('#rainbow').html("<span class='cl'>Rainbowed - </span>" + amount + "/" + total);
}




jQuery(document).ready(function($) {
  for(var v in base) {
    var item = document.getElementById(base[v]);

    $(item).addClass('base');
  }

  //restore previous state
  updatePage();

  //legend counter
  countLegends();

  //rainbow counter
  countRainbows();

  // Warning- do not target only the selected class
  $("#special span").on("click", function(e) {
    const $obj = $(this);

    //shift + click toggles rainbow border
    if(e.shiftKey){
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
