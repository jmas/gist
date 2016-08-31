import { render } from './ui';
import { requestGist, extractId, renderGist } from './gist';

function tryGistFromUrl() {
  let gistId = location.hash.substring(1);
  if (gistId) {
    return requestGist(gistId).then((content) => {
      if (!content) {
        location.href = '#';
        return null;
      }
      if (!content.html || !content.js) {
        location.href = '#';
        return null;
      }
      location.href = '#' + gistId;
      renderGist(content.html, content.js);
      return true;
    });
  } else {
    return new Promise((resolve) => resolve(null));
  }
}

tryGistFromUrl().then((isSuccess) => {
  if (!isSuccess) {
    render(document.getElementById('root'));
  }
});