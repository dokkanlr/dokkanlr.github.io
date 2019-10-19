//Credits to onepiecetreasurecruise.fr for the Local Storage base code, which I have tweaked for my needs|
//-------------------------------------------------------------------------------------------------------|
function updateStorage(key, save) {
  if (save) {
    localStorage.setItem(key, null);
  }
  else {
    localStorage.removeItem(key);
  }
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
    updateStorage(idStore[j]['key'], true);
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


jQuery(document).ready(function($) {

  //defines which legends have a super-evo
  var base = ['261','367','416','459','530','562','669','718','720','748','870','935','1001','1035','1045','1085','1123','1192','1240','1314','1362','1391','1404','1434','1532','1571','1588','1610','1652','1698','1747','1751','1763','1869','1935','2074','2076','2234','2651'];

  for(var v in base) {
    var item = document.getElementById(base[v]);

    $(item).addClass('base');
  }

  //restore previous state
  updatePage();

  // Warning- do not target only the selected class
  $("#special span").on("click", function() {
    const $obj = $(this);
    //toggles selected class
    $obj.toggleClass("selected");
    //creates object if selected class is present
    const save = $obj.hasClass("selected");
    //update the key
    updateStorage($obj.attr("id"), save);
  });

  //select all button
  $("#select-all").on("click", function() {
    selectPage();
  });

  //clear button
  $("#select-none").on("click", function() {
    resetPage();
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
