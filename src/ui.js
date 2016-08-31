import * as diff from 'diffhtml';
import { requestGist, extractId, renderGist } from './gist';

const { html, innerHTML } = diff;

function onWelcomeFormSubmit (event) {
  event.preventDefault();
  let urlInputEl = event.currentTarget.querySelector('input[name="url"]');
  let gistId = extractId(urlInputEl.value);
  if (!gistId) {
    alert('You need type something into Gist URL input!');
    urlInputEl.focus();
  } else {
    requestGist(gistId).then((content) => {
      if (!content) {
        alert('Your gist URL or ID is not valid.');
        return;
      }
      if (!content.html || !content.js) {
        alert('Your gist require two files: index.html or index.js.');
        return;
      }
      location.href = '#' + gistId;
      renderGist(content.html, content.js);
    });
  }
}

export function createWelcomeDialog () {
  return html`
    <div class="gist-welcome">
      <div class="gist-welcome-dialog">
        <p>You can use this service to run github gists.</p>
        <p>Your gist require two files: <code>index.html</code> or <code>index.js</code>.</p>
        <form onsubmit=${onWelcomeFormSubmit}>
          <input class="gist-welcome-url" type="text" name="url" placeholder="Gist URL or just ID" />
          <input type="submit" value="Run Gist as HTML page" />
        </form>
      </div>
    </div>
  `;
}

export function createApp () {
  return html`
    ${createWelcomeDialog()}
  `;
}

export function render (rootEl) {
  innerHTML(rootEl, createApp());
  document.querySelector('.gist-welcome-url').focus();
}
