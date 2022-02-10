loadPage = function() {

	var flair_class = '';

	//SPECIAL FLAIRS
	loadSpecial = function() {
		var enter = document.getElementById('special');

		for (i=1; i<=95; i++) {
			//creates HTML for special flairs
			var flair_special = document.createElement('img');
			flair_special.setAttribute('class', 'flair');
			flair_special.setAttribute('id', i);
			flair_special.setAttribute('src', 'images/icons/'+i+'.png');

			enter.appendChild(flair_special);
		}
	}
	loadSpecial();
}

//waits for DOM to load before executing function
document.addEventListener('DOMContentLoaded', loadPage, false);
