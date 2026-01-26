// Lightweight in-browser editor: login -> assign editable IDs -> save to server
(function(){
  const USERNAME = 'admin';
  const PASSWORD = 'admin'; // change to secure credentials in production
  let state = { loggedIn: false, assignMode: false, clickEditMode: false };

  // Utility: create element with class
  function el(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html) e.innerHTML = html; return e; }

  // Inject UI
  function createUI(){
    // Login button
    const btn = el('button','editor-login-btn','Login to Edit');
    btn.addEventListener('click', openLoginModal);
    document.body.appendChild(btn);

    // Toolbar (hidden until login)
    const toolbar = el('div','editor-toolbar','');
    toolbar.id = 'editorToolbar';
    toolbar.innerHTML = `
      <button id="editorAssign">Assign ID</button>
      <button id="editorToggleEdit">Toggle Click-Edit</button>
      <button id="editorSave">Save</button>
      <button id="editorExit">Exit Edit</button>
    `;
    toolbar.style.display = 'none';
    document.body.appendChild(toolbar);

    document.getElementById('editorAssign').addEventListener('click', ()=>{ state.assignMode = !state.assignMode; updateToolbar(); });
    document.getElementById('editorToggleEdit').addEventListener('click', ()=>{ state.clickEditMode = !state.clickEditMode; updateToolbar(); });
    document.getElementById('editorSave').addEventListener('click', saveAll);
    document.getElementById('editorExit').addEventListener('click', exitEditMode);

    // Login modal
    const modal = el('div','editor-modal');
    modal.id = 'editorModal';
    modal.innerHTML = `
      <div class="editor-modal-card">
        <h3>Admin Login</h3>
        <input id="editorUsername" type="text" placeholder="Username" />
        <input id="editorPassword" type="password" placeholder="Password" />
        <div class="editor-modal-actions">
          <button id="editorLoginBtn">Login</button>
          <button id="editorCancelBtn">Cancel</button>
        </div>
      </div>
    `;
    modal.style.display = 'none';
    document.body.appendChild(modal);

    document.getElementById('editorLoginBtn').addEventListener('click', doLogin);
    document.getElementById('editorCancelBtn').addEventListener('click', ()=>{ modal.style.display='none'; });

    // Click handlers
    document.addEventListener('click', pageClickHandler, true);
  }

  function openLoginModal(){ document.getElementById('editorModal').style.display='flex'; document.getElementById('editorPassword').focus(); }

  function doLogin(){
    const user = (document.getElementById('editorUsername') || {}).value || '';
    const pass = (document.getElementById('editorPassword') || {}).value || '';
    if(user === USERNAME && pass === PASSWORD){
      state.loggedIn = true;
      document.getElementById('editorModal').style.display='none';
      const loginBtn = document.querySelector('.editor-login-btn'); if(loginBtn) loginBtn.style.display='none';
      const toolbar = document.getElementById('editorToolbar'); if(toolbar) toolbar.style.display='flex';
      loadContent();
    } else {
      alert('Wrong username or password');
    }
  }

  function updateToolbar(){
    const t = document.getElementById('editorToolbar');
    t.querySelector('#editorAssign').style.background = state.assignMode ? '#007bff' : '';
    t.querySelector('#editorToggleEdit').style.background = state.clickEditMode ? '#007bff' : '';
  }

  function pageClickHandler(e){
    if(!state.loggedIn) return;
    // If assign mode, set data-edit-id on clicked element
    if(state.assignMode){
      e.preventDefault(); e.stopPropagation();
      const id = prompt('Enter edit id for this element (e.g. hero_title):');
      if(id){
        e.target.setAttribute('data-edit-id', id);
        e.target.classList.add('editable-highlight');
      }
      return;
    }

    // If click-edit mode, toggle contentEditable on clicked element
    if(state.clickEditMode){
      e.preventDefault(); e.stopPropagation();
      const target = e.target;
      if(target.isContentEditable){
        target.contentEditable = 'false';
        target.classList.remove('editing');
      } else {
        target.contentEditable = 'true';
        target.classList.add('editing');
      }
      return;
    }
  }

  async function saveAll(){
    // find all elements with data-edit-id
    const nodes = document.querySelectorAll('[data-edit-id]');
    for(const n of nodes){
      const id = n.getAttribute('data-edit-id');
      const content = n.innerHTML;
      try{
        await fetch('/api/content/text', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, content })
        });
        n.classList.add('editable-saved');
        setTimeout(()=>n.classList.remove('editable-saved'), 1200);
      }catch(err){ console.error('Save failed', err); alert('Save failed for '+id); }
    }
    alert('Save completed');
  }

  function exitEditMode(){
    state = { loggedIn:false, assignMode:false, clickEditMode:false };
    const toolbar = document.getElementById('editorToolbar'); if(toolbar) toolbar.style.display='none';
    const btn = document.querySelector('.editor-login-btn'); if(btn) btn.style.display='block';
    document.querySelectorAll('[contenteditable="true"]').forEach(e=>{ e.contentEditable='false'; e.classList.remove('editing'); });
  }

  async function loadContent(){
    try{
      const res = await fetch('/api/content');
      const data = await res.json();
      const text = data.text||{};
      Object.keys(text).forEach(id=>{
        const el = document.querySelector('[data-edit-id="'+id+'"]');
        if(el) el.innerHTML = text[id];
      });
    }catch(err){ console.warn('Unable to load content', err); }
  }

  // Init
  document.addEventListener('DOMContentLoaded', ()=>{
    createUI();
    // mark existing elements with data-edit-id as editable-highlight
    document.querySelectorAll('[data-edit-id]').forEach(e=>e.classList.add('editable-highlight'));
  });

})();
