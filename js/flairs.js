var xhr = new XMLHttpRequest();

xhr.open("GET", "https://api.github.com/repos/dokkan-lr/dokkan-lr.github.io/contents/images/icons?ref=master", true);

xhr.onload = function() {
	if (xhr.readyState === xhr.DONE) {
		if (xhr.status === 200) {
			// match strictly against the XML containing the file URL elements in server directory
			var n = (xhr.response.match(/"name": "[0-9]{1,3}.png/g).length);

			var enter = document.getElementById('special');

			// loop to generate flairs based on file count
			for (var i = 1; i <= n; i++) {
				var flair_special = document.createElement('img');
				flair_special.setAttribute('class', 'flair');
				flair_special.setAttribute('id', i);
				flair_special.setAttribute('src', 'images/icons/'+i+'.png');
				enter.appendChild(flair_special);
			}
		}
	}
};

xhr.send();
