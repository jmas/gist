export function loadGist (id) {
  return window.fetch('https://api.github.com/gists/'+id+'?'+Math.random()).then((res) => {
    return res.json();
  });
}

export function requestGist (id) {
  return loadGist(id).then((content) => {
    var html;
    var js;
    if (!content.files) {
      return null;
    }
    if (content.files['index.html']) {
      html = content.files['index.html'].content;
    }
    if (content.files['index.js']) {
      js = content.files['index.js'].content;
    }
    return {
      html, js
    };
  });
}

export function extractId (str) {
  if (str.indexOf('http') !== -1) {
    if (str.indexOf('gist.github.com') === -1) {
      return null;
    }
    return str.substring(str.lastIndexOf('/')+1, str.length);
  }
  return str;
}

export function renderGist(html, js) {
  if (html) {
    document.body.innerHTML = html;
  }
  if (js) {
    eval(js);
  }
}
