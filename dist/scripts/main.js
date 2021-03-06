function openJSON (json, callback) {
    let request = new XMLHttpRequest()
    request.open('GET', json, true)
    
    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText)
            if (callback) callback(data);
        } else {                
            console.log('Falha na requisição http: ', request.status, request.statusText)
        }            
    };

    request.onerror = () => {
        console.log("ERRO ao retornar conteúdo JSON")
    };
    
    request.send()
}

function back() {
    fillDogList()
}

function fillDogList() {
    
    openJSON('json/breeds.json', (data) => {
        let list = `<div class="dog-list">`

        data.forEach(element => {
            list += `<div class="dog-list-item" data-dog-id="${element.id}">
                            <img src="images/${element.id}.jpg" alt="Foto do ${element.name}" class="dog-photo">
                            <div class="dog-name">${element.name}</div>
                            <div class="dog-temperament">${element.temperament}</div>
                        </div>`    
        });

        list += `</div>`
        document.querySelector(".dog-container").innerHTML = list
        document.querySelector(".dog-header").style.display = "block"

        document.querySelectorAll('.dog-list-item').forEach(item => {
            item.addEventListener('click', (e) => {
                let id = e.target.getAttribute('data-dog-id')
                showDogDescription(id)
            })
        });
    })
}

function showDogDescription(id) {
    
    openJSON(`json/breed/${id}.json`, (dog) => {
        let description = `<div class="dog-description">
                                <img src="images/${id}.jpg" alt="Foto do ${dog.name}" class="dog-image">
                                <div class="dog-name">${dog.name}</div>
                                <div class="dog-information">`

        for (let key in dog) {
            let value = "";

            if (typeof dog[key] === 'string' || typeof dog[key] === 'number') {
                value = dog[key];
            }
            else if (typeof dog[key] === 'object') {
                for (let childKey in dog[key]) {
                    value += `<div class="dog-information-subitem">
                                <span class="dog-information-item--label">${childKey}: </span> ${dog[key][childKey]}
                              </div>`;
                }
            }
            else {
                value = dog[key];
            }

            description += `<div class="dog-information-item">
                                <span class="dog-information-item--label">${key}: </span> ${value}
                            </div>`
        }
        
        description += `<a href="#" class="back">Voltar</a>`
        description += '</div>'
        document.querySelector(".dog-container").innerHTML = description
        document.querySelector(".dog-header").style.display = "none"
        document.querySelector(".back").addEventListener('click', back)
    })
}

document.addEventListener('DOMContentLoaded', function() {
    fillDogList()
}, false);