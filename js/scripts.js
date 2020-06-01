//effectively links super-evos with their base forms
var base = [
  {base: 261, evo: 1413},
  {base: 367, evo: 1619},
  {base: 416, evo: 1445},
  {base: 459, evo: 1847},
  {base: 530, evo: 1707},
  {base: 562, evo: 1816},
  {base: 649, evo: 2868},
  {base: 669, evo: 1492},
  {base: 718, evo: 1881},
  {base: 720, evo: 1927},
  {base: 748, evo: 1663},
  {base: 870, evo: 2444},
  {base: 935, evo: 2066},
  {base: 1001, evo: 2195},
  {base: 1035, evo: 1928},
  {base: 1045, evo: 2001},
  {base: 1085, evo: 2954},
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
  {base: 1763, evo: 2784},
  {base: 1794, evo: 2814},
  {base: 1832, evo: 2138},
  {base: 1869, evo: 2505},
  {base: 1935, evo: 2300},
  {base: 1951, evo: 2830},
  {base: 2074, evo: 2363},
  {base: 2076, evo: 2588},
  {base: 2113, evo: 2739},
  {base: 2234, evo: 2500},
  {base: 2251, evo: 2991},
  {base: 2651, evo: 2681},
  {base: 2686, evo: 2909},
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
    if(elem['value'] == 'rainbow')
      $("#" + elem.key).addClass("rainbow selected");
    else if(elem['value'] == 'hidden')
      $("#" + elem.key).addClass("disabled");
    else if (elem['value'] == 'true'){
      $('.base').toggleClass('hidden');
      $('#hide-base').css('display', 'none');
      $('#show-base').css('display', 'inline-block');
    }
    else
      $("#" + elem.key).addClass("selected");
  });
}

function selectPage() {
  //adds selected class to every icon
  $(".flair:not(.disabled)").addClass("selected");

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
    $("#" + elem.key).removeClass("disabled");
  });
  //clears local storage
  localStorage.clear();
  $('#show-hidden').html('Show Removed Legends (' + $('.disabled').length + ')');
}

//unique legend tracker
function countLegends() {
  var disabled = $('.disabled');
  var unique = $('.flair:not(.base)');

  var selected = $('.selected');
  var pairs = [];
  var baseArray = [];
  var disabledArray = [];

  //maps evos with base
  var baseMap = base.reduce(function(map, obj) {
      map[obj.evo] = obj.base;
      return map;
  }, {});

  //pushes IDs to new array
  for(var i = 0; i < selected.length; i++) {
    pairs.push(selected[i].id);
  }

  for(var k = 0; k < base.length; k++) {
    baseArray.push(base[k]['base']);
    baseArray.push(base[k]['evo']);
  }

  //push IDs to disabled array to pass as argument later
  for(var j = 0; j < disabled.length; j++) {
    if(baseArray.includes(parseInt(disabled[j].id)))
      disabledArray.push(disabled[j].id);
  }

  //creates new set and returns size
  function countUnique(arg) {
    return new Set(arg.map (x => baseMap.hasOwnProperty(x)? baseMap[x].toString() : x)).size;
  }

  $('#counter').html("<span class='cl'>Unique Legends - </span>" + countUnique(pairs) + "/" + (countUnique(unique) - (disabled.length - countUnique(disabledArray))));
  countLegends2();
}

//total legend tracker
function countLegends2() {
  var amount = $(".selected").length;
  var total = $(".flair").length;
  var disabled = $('.disabled').length;

  $('#counter2').html("<span class='cl'>Total Legends - </span>" + amount + "/" + (total-disabled));
  countRainbows();
}

//rainbow tracker
function countRainbows() {
  var amount = $(".rainbow").length;
  var total = $(".flair").length;
  var disabled = $('.disabled').length;

  $('#rainbow').html("<span class='cl'>Rainbowed - </span>" + amount + "/" + (total-disabled));
}

//un-hides all hidden legends
function showHidden() {
  var disabled = $(".disabled");

  for(var i = 0; i < disabled.length; i++) {
    localStorage.removeItem(disabled[i].id);
  }
  $(".disabled").toggleClass("disabled");
  $('#show-hidden').html('Show Removed Legends (' + $('.disabled').length + ')');
}

//toggles popup window
function toggleModal() {

  let modal = document.querySelector(".modal")
  let closeBtn = document.querySelector(".close-btn")

  modal.style.display = "block"

  closeBtn.onclick = function(){
    modal.style.display = "none"
  }
  window.onclick = function(e){
    if(e.target == modal){
      modal.style.display = "none"
    }
  }
}

function windowOnClick(event) {
  var modal = document.querySelector(".modal");
   if (event.target === modal) {
       toggleModal();
   }
}

//export image function
function generateImage() {
  toggleModal();

  $('canvas').remove();

  html2canvas($('.container2')[0]).then(function(canvas) {
    $(".modal-content").append(canvas);
  });
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//download feature
function download() {
  html2canvas($('.container2')[0]).then(function(canvas) {
    var fileName = 'checklist.png';

    if ('msToBlob' in canvas) { // IE10+
      var blob = canvas.msToBlob();
      navigator.msSaveBlob(blob, fileName);
    } else {
      var a = document.createElement('a');
      var imgData = canvas.toDataURL({    format: 'png',
        multiplier: 4});
      var blob = dataURLtoBlob(imgData);
      var objurl = URL.createObjectURL(blob);

      a.download = "checklist.png";

      a.href = objurl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
}


jQuery(document).ready(function($) {

  //adds base class to pre-defined elements
  for(var v in base) {
    var item = document.getElementById(base[v]['base']);

    $(item).addClass('base');
  }

  var modal = document.querySelector(".modal");
  var trigger = document.querySelector(".trigger");
  var closeButton = document.querySelector(".close-button");

  //restore previous state
  updatePage();

  //legend counter
  countLegends();

  //restores hidden legend counter upon page load - must be placed under updatePage()
  $('#show-hidden').html('Show Removed Legends (' + $('.disabled').length + ')');

  //makes sure only one toggle can be flipped at a time
  $("#switch").on("change", function(){
    $("#hide-legends").prop("checked", false);
  });

  $("#hide-legends").on("change", function(){
    $("#switch").prop("checked", false);
  });

  //main function for selecting icons
  $("#special img").mousedown(function(e) {
    var isChecked = document.getElementById('switch').checked;
    var isChecked2 = document.getElementById('hide-legends').checked;

    const $obj = $(this);

    //rainbow toggle must be checked
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
    //hide legends toggle
    else if(isChecked2){
      $obj.toggleClass("disabled");
      $obj.removeClass("rainbow");
      $obj.removeClass("selected");

      const save = $obj.hasClass("disabled");

      updateStorage($obj.attr("id"), "hidden", save);
      countLegends();

      //shows counter of hidden legends
      $('#show-hidden').html('Show Removed Legends (' + $('.disabled').length + ')');
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

  //unhide legends
  $("#show-hidden").on("click", function() {
    showHidden();
    countLegends();
  });

  //hides base forms of legends with super-evos
  $("#show-base").on("click", function() {
    $('.base').toggleClass('hidden');
    $('#show-base').css('display', 'none');
    $('#hide-base').css('display', 'inline-block');
    updateStorage("evohidden", null, false);
  });

  //shows base forms of legends with super-evos
  $("#hide-base").on("click", function() {
    $('.base').toggleClass('hidden');
    $('#hide-base').css('display', 'none');
    $('#show-base').css('display', 'inline-block');
    updateStorage("evohidden", 'true', true);
  });
});
