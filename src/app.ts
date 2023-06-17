import "./_colors.scss";
import "./style.scss";

const word = document.querySelector(".word")! as HTMLInputElement;
const error = document.querySelector(".error")! as HTMLParagraphElement;
const search = document.querySelector(".search-icon")! as HTMLDivElement;

const selectFonts = document.querySelector('.font')!;
const body = document.querySelector('body')!;

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


selectFonts.addEventListener('click', (e:Event) => {
	let value = (e.target! as HTMLOptionElement).value
	if (+value == 1) {
		body.style.fontFamily = 'serif';
	} else if (+value == 2) {
		body.style.fontFamily = 'sans-serif'
	} else {
		body.style.fontFamily = 'Monospace'
	}
})

search.addEventListener("click", getRequest);
getRequest();

