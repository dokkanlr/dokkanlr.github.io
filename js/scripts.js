//SPECIAL FLAIRS
loadFlairs = function() {
  let enter = document.getElementById('special');

  let eza = [
    1,2,3,4,5,6,7,8,9,
    10,11,12,13,14,15,16,17,18,19,
    20,21,22,23,24,25,26,27,28,29,
    30,31,32,33,34,35,36,37,38,39,
    40,41,42,43,44,45,46,47,48,49,
    50,51,52,53,54,55,56,57,58,59,
    60,61,62,63,64,65,66,67,68,69,
    70,71,72,74,75,76,77,
    82,84,87,88,89,
    90,95,98,
    116,
    135
  ]

  let eza2 = [
    1
  ]

  //changelog items
  const updateItems = [
  "10th Anni Pt.1 LRs",
  ]

  // Append changelog items
  const changelog = document.getElementById('changelog-item');
  updateItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    changelog.appendChild(listItem);
  });

  // Fetch the latest commit date from GitHub API
  const fetchLatestCommitDate = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/dokkanlr/dokkanlr.github.io/commits');
      if (!response.ok) throw new Error('Failed to fetch commit data');
      const commits = await response.json();

      // Get the date of the latest commit
      const latestCommitDate = commits[0].commit.committer.date;
      const formattedDate = new Date(latestCommitDate).toLocaleDateString("en-GB", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Update the changelog date dynamically
      document.querySelector('.changelog h3').textContent = `Last Update: ${formattedDate}`;
    } catch (error) {
      console.error('Error fetching the latest commit date:', error);
    }
  };

  // Call the function during initialization
  fetchLatestCommitDate();

  // Create special flairs dynamically
  for (let i = 1; i <= total; i++) {
    const flairSpecial = document.createElement('div');
    flairSpecial.className = 'flair';
    flairSpecial.id = i;
    flairSpecial.style.backgroundImage = `url(../images/icons/${i}.webp)`;
    enter.appendChild(flairSpecial);
  }

  // Assign EZA and SUPER EZA classes
  eza.forEach(id => document.getElementById(id)?.classList.add('eza'));
  eza2.forEach(id => document.getElementById(id)?.classList.add('eza2'));
}

// <----------------------------------------------------------------->

// updates local storage values
function updateStorage(key, value, save) {
  if (save) {
    localStorage.setItem(key, value);
  }
  else {
    localStorage.removeItem(key);
  }
}

// reads local storage based on key
function readStorageValue(key) {
  return localStorage.getItem(key);
}

// reads entire local storage array
function readAllStorage() {
  let nbItem = localStorage.length;
  let store = [];
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

// reads storage and updates the page accordingly
function updatePage() {
  //check local storage
  const store = readAllStorage();
  //restore the selected class
  $.each(store, function(index, elem) {
    if(elem['value'] == 'hidden')
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

// select all icons on page
function selectPage() {
    //adds selected class to every icon
    $("#special .flair:not(.disabled)").addClass("selected");

  const className = document.getElementsByClassName('selected');
  let idStore = new Array();


  //loops every ID and stores key into array
  for(var i = 0; i < className.length; i++) {
    idStore.push({"key" : className[i].id, "value" : className[i].className});
  }

  //add IDs from array to local storage
  for(var j=0; j<idStore.length; j++) {
      updateStorage(idStore[j]['key'], null, true);
    }
}

// remove all selections on page
function resetPage() {
  //check local storage
  const store = readAllStorage();
  //delete the selected class
  $.each(store, function(index, elem) {
    $("#" + elem.key).removeClass("selected");
    $("#" + elem.key).removeClass("disabled");
  });
  //clears local storage
  localStorage.clear();
}

//total legend tracker
function countLegends() {
  const amount = $(".selected").length;
  const total = $("#special .flair").length;
  const disabled = $('.disabled').length;

  $('#counter').html("<span class='cl'>Total LRs - </span>" + amount + "/" + (total-disabled));
}

//unhides specific Legends
function listHidden() {
  toggleModal('removed-modal');
  $(".modal-content2").empty();
  $("#hide-lr").prop("checked", false);

  const disabled = $(".disabled");
  const box = $('.modal-content2');

  //creates new images for hidden legends
  for(var i = 0; i < disabled.length; i++) {
    const flair = document.createElement('img');
    flair.setAttribute('class', 'flair');
    flair.setAttribute('name', disabled[i].id);
    flair.setAttribute('src', 'images/icons/'+disabled[i].id+'.webp');

    box.append(flair);
  }

  //unhide legends in checklist when clicked
  $(".modal-content2 img").mousedown(function(e) {
    let $obj = $(this);
    let id = $obj[0].name;

    $("#"+id).removeClass('disabled');
    //removes from modal display
    $obj.hide();
    //removes from local storage
    localStorage.removeItem(id);
    //updates counters
    countLegends();
  });
}

//toggles popup window
function toggleModal(e) {
  let modal = document.querySelector("#"+e);
  let closeBtn = document.querySelector("#"+e+" .close-btn")

  modal.style.visibility = "visible";
  modal.style.opacity = "100";

  closeBtn.onclick = function(){
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    $('#import-text').val('');
  }
  window.onclick = function(e){
    if(e.target == modal){
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";
      $('#import-text').val('');
    }
  }
}

function windowOnClick(event) {
  const modal = document.querySelector(".modal");
   if (event.target === modal) {
       toggleModal();
   }
}

//export image function
function generateImage() {
  toggleModal('image-modal');

  $(".modal-content").empty();

   domtoimage.toPng($('.icon-container')[0]).then(function (dataUrl) {
           const img = new Image();
           img.src = dataUrl;
           $(".modal-content").append(img);
   });
}


//download feature
function download() {
  domtoimage.toBlob($('.icon-container')[0]).then(function (blob) {
        window.saveAs(blob, 'checklist.png');
    });
}

//export localStorage
function exportSelection() {
  let raw = JSON.stringify(localStorage);
  container = document.getElementById("export-text");
  container.setAttribute("style", "transform: translateY(0); opacity: 1; z-index: 1;");
  container.value = LZString.compressToEncodedURIComponent(raw);
}

//copy exported data
function copySelection() {
  container = document.getElementById("export-text");
  container.select();
  document.execCommand("copy");
  $('#display-copied').fadeIn().delay(1000).fadeOut();
}

//apply imported data
function importSelection() {
  let text = document.getElementById("import-text").value;

  plaintext = LZString.decompressFromEncodedURIComponent(text);

  //clears local storage
  localStorage.clear();

  try {
    // Convert to a JSON object
    data = JSON.parse(plaintext);

    console.log(data);

    // Iterate over the JSON object and save to localstorage
    Object.keys(data).map(function(key, index) {
        const value = data[key];
        localStorage.setItem(key, value);
    });

    $('#imported').fadeIn().delay(1000).fadeOut();
  }
  //if error
  catch {
    $('#undefined').fadeIn().delay(1000).fadeOut();
  }

  coreFunctions();
}

function coreFunctions() {
  //restore previous state
  updatePage();

  //legend counter
  countLegends();
}

$(document).ready(function() {

  fetch('https://api.github.com/repos/dokkanlr/dokkanlr.github.io/contents/images/icons?ref=master')
  .then(response => response.json()) // convert API to json format
  .then(function (response) {
    total = Object.values(response).length;

    // generate icons
    loadFlairs();

    coreFunctions();
  });

  //main function for selecting icons
  $("#special").on("click", "div", function(e) {
    const isChecked = document.getElementById('hide-lr').checked;

    const $obj = $(this);

    //hide LRs toggle
    if(isChecked){
      $obj.toggleClass("disabled");
      $obj.removeClass("selected");

      const save = $obj.hasClass("disabled");

      updateStorage($obj.attr("id"), "hidden", save);
      countLegends();
    }
    //if not checked
    else {
      //toggles selected classes
      $obj.toggleClass("selected");

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
    if (confirm("Are you sure you want to reset the checklist?")){
      resetPage();
      countLegends();
    }
  });

  //unhide specific legends
  $("#list-hidden").on("click", function() {
    listHidden();
    countLegends();
  });

  //generate image window
  $("#generate").on("click", function() {
    generateImage();
    countLegends();
  });

  //import code window
  $("#import").on("click", function() {
    toggleModal('import-modal');
  });

  //import code button
  $("#import-btn").on("click", function() {
    importSelection();
    countLegends();
  });

  //export code window
  $("#export").on("click", function() {
    toggleModal('export-modal');
    exportSelection();
  });

  //copy code button
  $("#copy-export").on("click", function() {
    copySelection();
  });
});
