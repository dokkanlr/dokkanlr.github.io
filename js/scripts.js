//Credits to onepiecetreasurecruise.fr for the Local Storage base code, which I have tweaked for my needs|
//-------------------------------------------------------------------------------------------------------|
function updateStorage(key, value, save) {
  if (save) {
    localStorage.setItem(key, value);
  }
  else {
    localStorage.removeItem(key);
  }
}

function readStorageValue(key) {
  return localStorage.getItem(value);
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
  });
}

function selectPage() {
  //adds selected class to every icon
  $(".flair").addClass("selected");

  var className = document.getElementsByClassName('selected');
  var idStore = new Array();

  //loops every ID and stores key into array
  for(var i = 0; i < className.length; i++) {
    idStore.push({"key" : className[i].id});
  }

  //add IDs from array to local storage
  for(var j=0; j<idStore.length; j++) {
    updateStorage(idStore[j]['key'], null, true);
  }
}

function resetPage() {
  //check local storage
  const store = readAllStorage();
  //delete the selected class
  $.each(store, function(index, elem) {
    $("#" + elem.key).removeClass("selected");
  });
  //clears local storage
  localStorage.clear();
}

function countLegends() {
  var amount = $(".selected").length;
  var total = $(".flair").length;

  $('#counter').html("<span class='cl'>Unique Legends Owned - </span>" + amount + "/" + total);
}



jQuery(document).ready(function($) {
  //defines which legends have a super-evo
  var base = ['261','367','416','459','530','562','669','718','720','748','870','935','1001','1035','1045','1123','1192','1240','1314','1362','1391','1404','1434','1473','1532','1571','1588','1610','1652','1698','1747','1751','1763','1869','1935','2074','2076','2234','2651'];

  for(var v in base) {
    var item = document.getElementById(base[v]);

    $(item).addClass('base');
  }

  //restore previous state
  updatePage();

  //adds counter
  countLegends();


  // Warning- do not target only the selected class
  $("#special span").on("click", function(e) {
    const $obj = $(this);

    //shift + click toggles rainbow border
    if(e.shiftKey){
      $obj.toggleClass('rainbow selected');

      //creates object if selected class is present
      const save = $obj.hasClass("selected");

      //update the key
      updateStorage($obj.attr("id"), "rainbow", save);
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
