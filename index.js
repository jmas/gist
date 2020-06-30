function runGistByUrl(gistUrl) {
    if (!validateGistUrl(gistUrl)) {
        alert('Please provide valid Gist URL!');
        return;
    }
    var gist = parseGistUrl(gistUrl);
    runGist(gist);
}

function runGist(gist) {
    var content = requestGistContent(gist);
    content.then(renderGist);
    saveGistToLocationHash(gist);
}

function validateGistUrl(gistUrl) {
    return /https:\/\/gist\.(githubusercontent|github)\.com\/.+?\/raw\/.+?\/.+/.test(gistUrl);
}

function parseGistUrl(gistUrl) {
    var found = String(gistUrl).match(/https:\/\/gist\.(githubusercontent|github)\.com\/(.+?)\/raw\/(.+?)\/(.+)/);
    return {
        username: found[1],
        id: found[2],
        token: found[3],
        file: found[4]
    };
}

function parseGistFromLocationHash(locationHash) {
    var found = String(locationHash).match(/(.+?)\/(.+?)\/(.+)/);
    return {
        username: found[1],
        id: found[2],
        token: found[3]
    };
}

function requestGistFile(gist, file) {
    return fetch('https://gist.githubusercontent.com/'+gist.username+'/'+gist.id+'/raw/'+gist.token+'/'+file+'?'+Math.random()).then(function (response) {
        if (response.status === 200) {
            return response.text();
        }
        return null;
    });
}

function requestGistContent(gist) {
    var files = ['index.js', 'index.css', 'index.html'];
    return Promise.all(files.map(function (file) {
        return requestGistFile(gist, file);
    })).then(function (content) {
        return files.reduce(function (carry, file, index) {
            carry[file] = content[index];
            return carry;
        }, {});
    });
}

function renderGist(content) {
    document.open();
    document.write(content['index.html'] ? content['index.html'] : '<html></html>');
    document.close();
    if (content['index.js']) {
        eval(content['index.js']);
    }
    if (content['index.css']) {
        var style = document.createElement('style');
        style.type = 'text/css';
        document.getElementsByTagName('html')[0].appendChild(style);
        style.innerHTML = content['index.css'];
    }
}

function getGistFromLocationHash() {
    var locationHash = location.hash.substring(1);
    if (locationHash) {
        return parseGistFromLocationHash(locationHash);
    }
    return null;
}

function prepareWelcome() {
    document.getElementById('welcome').style.display = 'block';
    document.forms[0].onsubmit = function(event) {
        event.preventDefault();
        runGistByUrl(event.target.elements.url.value);
    };
}

function saveGistToLocationHash(gist) {
    location.hash = '#'+gist.username+'/'+gist.id+'/'+gist.token;
}

function main() {
    var gist = getGistFromLocationHash();
    if (gist) {
        runGist(gist);
    } else {
        prepareWelcome();
    }
}

main();
