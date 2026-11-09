// VL STUDIO — Firebase-powered content manager.
// Add your Firebase web-app configuration in firebase-config.js before running.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, addDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app), storage = getStorage(app);
const $ = id => document.getElementById(id);
const state = { maps:[], products:[], team:[], support:[], editorType:null, editId:null, editImagePath:null };
const collections = {map:"maps", product:"products", team:"team", support:"support"};
const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const toast = msg => { $("toast").textContent=msg; $("toast").classList.add("show"); setTimeout(()=>$("toast").classList.remove("show"),2600); };
const show = id => $(id).classList.remove("hidden"), hide = id => $(id).classList.add("hidden");
$("year").textContent = new Date().getFullYear();

$("menuToggle").onclick = () => $("mainNav").classList.toggle("open");
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("mainNav").classList.remove("open")));
$("openLogin").onclick=()=>show("loginModal");
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>hide(b.dataset.close));
$("viewSite").onclick=()=>{hide("adminShell");window.location.hash="#home";};
$("loginForm").addEventListener("submit", async e=>{
  e.preventDefault(); $("loginMessage").textContent="Memeriksa akun...";
  try { await signInWithEmailAndPassword(auth,$("loginEmail").value.trim(),$("loginPassword").value); $("loginMessage").textContent=""; hide("loginModal"); }
  catch(err){ $("loginMessage").textContent="Login gagal. Periksa email dan kata sandi."; }
});
$("logoutBtn").onclick=()=>signOut(auth);

onAuthStateChanged(auth, async user=>{
  if(user){
    $("ownerEmail").textContent=user.email || "Owner";
    show("adminShell"); await refreshAll();
  } else { hide("adminShell"); }
});

async function getItems(name){
  try { const snap=await getDocs(collection(db,name)); return snap.docs.map(d=>({id:d.id,...d.data()})); }
  catch(e){ console.error(e); return []; }
}
async function refreshAll(){
  [state.maps,state.products,state.team,state.support]=await Promise.all(["maps","products","team","support"].map(getItems));
  renderPublic(); renderAdmin();
  const home=await getDoc(doc(db,"settings","home"));
  if(home.exists()){ $("homeHeadline").value=home.data().headline||"WE BUILD YOUR VISION."; $("homeDescription").value=home.data().description||"Selamat datang di VL STUDIO — ruang kreatif untuk membangun pengalaman Roblox, menghadirkan desain pakaian, dan mewujudkan ide digital."; }
}
function renderPublic(){
  $("mapCount").textContent=`${state.maps.length} PROJECTS`; $("productCount").textContent=`${state.products.length} ITEMS`;
  $("mapGrid").innerHTML=state.maps.length?state.maps.map(x=>`<article class="project-card">${x.imageUrl?`<img src="${safe(x.imageUrl)}" alt="${safe(x.title)}">`:""}<div class="card-body"><span class="card-tag">${safe(x.category||"ROBLOX MAP")}</span><h3>${safe(x.title)}</h3><p>${safe(x.description)}</p>${x.link?`<a class="card-link" href="${safe(x.link)}" target="_blank" rel="noopener">OPEN MAP ↗</a>`:""}</div></article>`).join(""):`<div class="empty-state">Map akan ditampilkan di sini setelah ditambahkan oleh owner.</div>`;
  $("productGrid").innerHTML=state.products.length?state.products.map(x=>`<article class="product-card">${x.imageUrl?`<img src="${safe(x.imageUrl)}" alt="${safe(x.title)}">`:""}<div class="card-body"><span class="card-tag">${safe(x.category||"PRODUCT")}</span><h3>${safe(x.title)}</h3><p>${safe(x.description)}</p><div class="product-price">${safe(x.price||"Hubungi kami")}</div>${x.link?`<a class="card-link" href="${safe(x.link)}" target="_blank" rel="noopener">ORDER / DETAILS ↗</a>`:""}</div></article>`).join(""):`<div class="empty-state">Produk dan layanan akan ditampilkan di sini.</div>`;
  $("teamGrid").innerHTML=state.team.length?state.team.map(x=>`<article class="team-card"><div class="avatar">${safe((x.name||"VL").slice(0,2).toUpperCase())}</div><h3>${safe(x.name)}</h3><span>${safe(x.role)}</span></article>`).join(""):`<div class="empty-state">Struktur team akan ditampilkan di sini.</div>`;
  $("supportLinks").innerHTML=state.support.length?state.support.map(x=>`<a class="support-link" href="${safe(x.link)}" target="_blank" rel="noopener">${safe(x.title)} ↗</a>`).join(""):`<span class="muted">Link support akan diatur melalui Owner Panel.</span>`;
}
function renderAdmin(){
  $("dashMaps").textContent=state.maps.length; $("dashProducts").textContent=state.products.length; $("dashTeam").textContent=state.team.length;
  renderList("adminMaps",state.maps,"map"); renderList("adminProducts",state.products,"product"); renderList("adminTeam",state.team,"team"); renderList("adminSupport",state.support,"support");
}
function renderList(target,items,type){
  $(target).innerHTML=items.length?items.map(x=>`<div class="admin-row">${x.imageUrl?`<img src="${safe(x.imageUrl)}" alt="">`:`<div class="avatar">${safe((x.title||x.name||"VL").slice(0,2).toUpperCase())}</div>`}<div class="admin-row-info"><b>${safe(x.title||x.name)}</b><span>${safe(x.category||x.role||x.price||x.link||"")}</span></div><div class="row-actions"><button data-edit="${type}" data-id="${x.id}">EDIT</button><button class="delete" data-delete="${type}" data-id="${x.id}">DELETE</button></div></div>`).join(""):`<div class="empty-state">Belum ada data. Klik tombol tambah untuk membuat item pertama.</div>`;
}
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("[data-tab]").forEach(x=>x.classList.remove("selected")); b.classList.add("selected");
  document.querySelectorAll(".admin-tab").forEach(x=>x.classList.add("hidden")); $("tab-"+b.dataset.tab).classList.remove("hidden");
  $("adminTitle").textContent=b.textContent.trim().toUpperCase();
});
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add)openEditor(add.dataset.add);
  const edit=e.target.closest("[data-edit]"); if(edit)openEditor(edit.dataset.edit,edit.dataset.id);
  const del=e.target.closest("[data-delete]"); if(del)removeItem(del.dataset.delete,del.dataset.id);
});
const field=(name,label,placeholder="",type="text",required=false)=>`<label>${label}<input name="${name}" type="${type}" placeholder="${placeholder}" ${required?"required":""}></label>`;
function openEditor(type,id=null){
  state.editorType=type; state.editId=id; const list=state[ type==="map"?"maps":type==="product"?"products":type==="team"?"team":"support" ];
  const item=id?list.find(x=>x.id===id):{};
  $("editorTitle").textContent=(id?"EDIT ":"ADD ")+type.toUpperCase();
  let html="";
  if(type==="map"||type==="product"){
    html+=field("title","Nama / judul","Contoh: BLACK FOREST","text",true);
    html+=`<label>Kategori<select name="category"><option>${type==="map"?"Roblox Map":"Roblox Clothing"}</option><option>Roblox Clothing</option><option>Robux</option><option>Map Service</option><option>Design Service</option><option>Digital Product</option></select></label>`;
    html+=`<label>Deskripsi<textarea name="description" rows="3" placeholder="Jelaskan item ini..."></textarea></label>`;
    if(type==="product")html+=field("price","Harga","Contoh: Rp50.000");
    html+=field("link","Link tujuan / pemesanan","https://...");
    html+=`<label>Gambar ${id&&item.imageUrl?"(unggah baru untuk mengganti)":""}<input name="image" type="file" accept="image/*"></label>`;
  } else if(type==="team"){html+=field("name","Nama anggota","Nama","text",true)+field("role","Jabatan","Contoh: OWNER","text",true);}
  else {html+=field("title","Nama tautan","Contoh: Discord Community","text",true)+field("link","URL","https://...","url",true);}
  $("editorFields").innerHTML=html;
  const form=$("editorForm");
  Object.entries(item||{}).forEach(([k,v])=>{const el=form.elements[k];if(el&&el.type!=="file")el.value=v||"";});
  $("editorMessage").textContent=""; show("editorModal");
}
$("editorForm").addEventListener("submit",async e=>{
  e.preventDefault(); const form=e.currentTarget, type=state.editorType, data={};
  ["title","category","description","price","link","name","role"].forEach(k=>{if(form.elements[k])data[k]=form.elements[k].value.trim();});
  try{
    const file=form.elements.image?.files?.[0];
    if(file){
      if(!file.type.startsWith("image/"))throw new Error("File harus berupa gambar.");
      if(file.size>8*1024*1024)throw new Error("Ukuran gambar maksimal 8 MB.");
      const path=`${type}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
      const storageRef=ref(storage,path); await uploadBytes(storageRef,file); data.imageUrl=await getDownloadURL(storageRef); data.imagePath=path;
    }
    const col=collections[type];
    if(state.editId){await setDoc(doc(db,col,state.editId),data,{merge:true});}
    else {await addDoc(collection(db,col),data);}
    hide("editorModal"); await refreshAll(); toast("Konten berhasil disimpan.");
  }catch(err){$("editorMessage").textContent=err.message||"Gagal menyimpan data.";}
});
async function removeItem(type,id){
  if(!confirm("Hapus item ini? Tindakan ini tidak dapat dibatalkan."))return;
  try{
    const list=state[type==="map"?"maps":type==="product"?"products":type==="team"?"team":"support"], item=list.find(x=>x.id===id);
    await deleteDoc(doc(db,collections[type],id));
    if(item?.imagePath){try{await deleteObject(ref(storage,item.imagePath));}catch(e){console.warn("Gambar tidak dapat dihapus:",e);}}
    await refreshAll();toast("Item berhasil dihapus.");
  }catch(e){toast("Gagal menghapus item. Periksa Firebase Rules.");}
}
$("homeForm").addEventListener("submit",async e=>{
  e.preventDefault();
  try{await setDoc(doc(db,"settings","home"),{headline:$("homeHeadline").value.trim(),description:$("homeDescription").value.trim()});$("homeMessage").textContent="Berhasil disimpan.";}
  catch(e){$("homeMessage").textContent="Gagal menyimpan. Periksa Firebase Rules.";}
});
