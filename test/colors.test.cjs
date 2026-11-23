const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = readFileSync(path.join(root, 'js/code.js'), 'utf8');

function createPage(elements) {
  const requests = [];
  const paragraph = { innerHTML: '' };
  class MockRequest {
    open(method, url) {
      this.method = method;
      this.url = url;
    }

    setRequestHeader(name, value) {
      this.contentType = [name, value];
    }

    send(body) {
      this.body = body;
      requests.push(this);
    }

    respond(body) {
      this.readyState = 4;
      this.status = 200;
      this.responseText = body;
      this.onreadystatechange();
    }
  }
  const context = vm.createContext({
    XMLHttpRequest: MockRequest,
    document: {
      getElementById: (id) => elements[id],
      getElementsByTagName: (tag) => tag === 'p' ? [paragraph] : [],
    },
  });
  vm.runInContext(source, context);
  vm.runInContext('userId = 17', context);
  return { context, requests, paragraph };
}

test('unit: addColor serializes the entered color and current user', () => {
  const { context, requests } = createPage({
    colorText: { value: 'Ocean Blue' },
    colorAddResult: { innerHTML: 'old message' },
  });
  vm.runInContext('addColor()', context);
  assert.equal(requests.length, 1);
  assert.deepEqual(JSON.parse(requests[0].body), { color: 'Ocean Blue', userId: 17 });
});

test('integration: search sends a PHP API request and renders its JSON response', () => {
  const elements = {
    searchText: { value: 'bl' },
    colorSearchResult: { innerHTML: '' },
  };
  const html = readFileSync(path.join(root, 'color.html'), 'utf8');
  assert.match(html, /onclick=["']searchColor\(\);?["']/);
  for (const id of Object.keys(elements)) {
    assert.ok(html.includes('id="' + id + '"'));
  }
  const { context, requests, paragraph } = createPage(elements);
  vm.runInContext('searchColor()', context);
  assert.equal(requests.length, 1);
  const [request] = requests;
  assert.equal(request.method, 'POST');
  assert.match(request.url, /\/SearchColors\.php$/);
  assert.deepEqual(JSON.parse(request.body), { search: 'bl', userId: 17 });
  request.respond(JSON.stringify({ results: ['Blue', 'Black'], error: '' }));
  assert.equal(elements.colorSearchResult.innerHTML, 'Color(s) has been retrieved');
  assert.equal(paragraph.innerHTML, 'Blue<br />\r\nBlack');
});
