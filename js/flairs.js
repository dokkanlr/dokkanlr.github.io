loadPage = function() {

	var flair_class = '';

	//SPECIAL FLAIRS
	loadSpecial = function() {
		var enter = document.getElementById('special');

		var name = [
			1007470,
			1008800,
			1009230,
			1009380,
			1009630,
			1010070,
			1010160,
			1010440,
			1010900,
			1011140,
			1011640,
			1011680,
			1011720,
			1012130,
			1012160,
			1012360,
			1012400,
			1012720,
			1012900,
			1012930,
			1013100,
			1013390,
			1013770,
			1014020,
			1014050,
			1014080,
			1014210,
			1014220,
			1014470,
			1014500,
			1014940,
			1014970,
			1015030,
			1015180,
			1015570,
			1015910,
			1016230,
			1016310,
			1016370,
			1016400,
			1016810,
			1016840,
			1016870,
			1017320,
			1017350,
			1017380,
			1017630,
			1017780,
			1017900,
			1018030,
			1018250,
			1018490,
			1018590,
			1018620,
			1018650,
			1018880,
			1019000,
			1019070,
			1019100,
			1019400,
			1019530,
			1019700,
			1019820,
			1019910,
			1019990,
			1020220,
			1020310,
			1020340,
			1020370,
			1020460,
			1020750,
			1021010,
			1021140,
			1021430,
			1021480,
			1021620,
			1021650,
			1021880,
			1021970,
			1022090,
			1022120,
			1022190,
			1022340,
			1022590,
			1022630,
			1022750,
			1022780,
			1022810,
			1022940,
			1023040,
			1023090,
			1023420
		]

		//creates HTML for special flairs
		for (var v in name) {
				var flair_special = document.createElement('img');
				flair_special.setAttribute('class', 'flair');
				flair_special.setAttribute('id', name[v]);
				flair_special.setAttribute('src', 'images/icons/'+name[v]+'.png');

				enter.appendChild(flair_special);
		}
	}
	loadSpecial();
}

//waits for DOM to load before executing function
document.addEventListener('DOMContentLoaded', loadPage, false);
