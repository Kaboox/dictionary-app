import "./_colors.scss";
import "./style.scss";

const word = document.querySelector(".word")! as HTMLInputElement;
const error = document.querySelector(".error")! as HTMLParagraphElement;
const search = document.querySelector(".search-icon")! as HTMLDivElement;

const selectFonts = document.querySelector('.font')!;
const body = document.querySelector('body')!;


const themeCheckbox = document.querySelector('.theme-checkbox')! as HTMLInputElement;
const themeIcon = document.querySelector('.theme-icon')!;

const audioBox = document.querySelector('.audio')! as HTMLDivElement;
let audio = document.querySelector('.speech')! as HTMLAudioElement;

const searchedWord = document.querySelector(
	".searched-word"
)! as HTMLParagraphElement;
const phoneticWord = document.querySelector(
	".phonetic"
)! as HTMLParagraphElement;
const descriptionArea = document.querySelector(
	".description"
)! as HTMLDivElement;

const source = document.querySelector(".source")! as HTMLDivElement;

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

type paths = {
	0: {
		word: string;
		phonetic: string;
		sourceUrls: Array<string>;
		meanings: Array<{
			definitions: Array<{ definition: string, example: string }>;
			partOfSpeech: string;
			synonyms: Array<string>;
		}>;
		phonetics: Array<{text: string, audio: string}>;
	};
};

async function getRequest() {
	try {
		let wordToSearch = word.value || "keyboard";
		const req = await fetch(API_URL + wordToSearch);
		const data = await req.json();
		word.value = "";

		if (req.status != 200) {
			error.style.display = "flex";
		} else {
			error.style.display = "none";
			handleChanges(data);
		}
	} catch {
		alert("Internal server error, try again later.");
	}
}

const handleChanges = (data: paths) => {
	console.log(data);
	handleTop(data);
	handleSource(data);
	handleDescription(data);
	handleAudio(data);
};

const handleTop = (data: paths) => {
	searchedWord.textContent = data[0].word;
	phoneticWord.textContent = data[0].phonetic;
};


const handleDescription = (data: paths) => {
	let allDesc: string = "";
    
	for (let i = 0; i < data[0].meanings.length; i++) {
        console.log(data);
        let synonyms = '';
        let synonymsBox = document.createElement('p');
        synonymsBox.classList.add('synonyms')
        let ulList = document.createElement('ul');
        ulList.classList.add('meanings')
        let maxL = data[0].meanings[i].definitions.length;
        if (data[0].meanings[i].synonyms.length != 0) {
            synonymsBox.textContent = 'Synonyms'
            synonyms += data[0].meanings[i].synonyms[0]
            
        }
        if (data[0].meanings[i].definitions.length > 3) {
            maxL = 3;
        }
		for (let j = 0; j < maxL; j++) {
            
            const liEl = document.createElement('li');
            const ex = document.createElement('p');
            
            ex.classList.add('example')
            liEl.classList.add('definition');
            liEl.textContent = data[0].meanings[i].definitions[j].definition;
            if (data[0].meanings[i].definitions[j].example) {
                ex.textContent = data[0].meanings[i].definitions[j].example
            }
            liEl.appendChild(ex);
            ulList.appendChild(liEl)
		}
		const descElement = `<div class="part-of-speech">
    <div class="part-of-speech__title">
     <p>${data[0].meanings[i].partOfSpeech}</p>
     <div class="line"></div>
    </div>
    <p class="meaning">Meaning</p>
    <ul class="meanings">
    ${ulList.innerHTML}
    
    </ul>
    <p class="synonyms">${synonymsBox.textContent}
     <span class="synonym">${synonyms}</span>
    </p>
 </div>`;
		allDesc += descElement;
	}
	descriptionArea.innerHTML = allDesc;
};

const handleSource = (data: paths) => {
	source.textContent = "";
	for (const sr of data[0].sourceUrls) {
		source.append((document.createElement("p").textContent = "Source"));
		const src = document.createElement("a");
		src.setAttribute("href", sr);
		src.textContent = sr;
		src.classList.add("source__link");
		source?.appendChild(src);
	}
};

const toggleTheme = () => {
	if (themeCheckbox.checked) {
		body.classList.add('dark')
		themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moon theme-icon"
		width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
		stroke-linecap="round" stroke-linejoin="round">
		<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
		<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
	</svg>`
	} else {
		body.classList.remove('dark')
		themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sun-high" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
		<path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656z"></path>
		<path d="M6.343 17.657l-1.414 1.414"></path>
		<path d="M6.343 6.343l-1.414 -1.414"></path>
		<path d="M17.657 6.343l1.414 -1.414"></path>
		<path d="M17.657 17.657l1.414 1.414"></path>
		<path d="M4 12h-2"></path>
		<path d="M12 4v-2"></path>
		<path d="M20 12h2"></path>
		<path d="M12 20v2"></path>
	 </svg>`
	}
}

const toggleFonts = (e:Event) => {
	let value = (e.target! as HTMLOptionElement).value
	if (+value == 1) {
		body.style.fontFamily = 'serif';
	} else if (+value == 2) {
		body.style.fontFamily = 'sans-serif'
	} else {
		body.style.fontFamily = 'Monospace'
	}
}

const handleAudio = (data: paths) => {
	
	for (const phon of data[0].phonetics) {
		if (phon.audio.length != 0) {
			audio.src = phon.audio
		}
	}
	
}

const playAudio = () => {
	audio.play()
}

const handleEnter = (e:KeyboardEvent) => {
	if (e.code === 'Enter') {
		getRequest();
	}
}


selectFonts.addEventListener('click', toggleFonts)

themeCheckbox.addEventListener('click', toggleTheme)

audioBox?.addEventListener('click', playAudio);

search.addEventListener("click", getRequest);
document.addEventListener('keydown', handleEnter);
getRequest();

