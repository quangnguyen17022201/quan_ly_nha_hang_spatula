const KEY = "gourmet_reservations_v1";
const TABLE_COUNT = 10;
const GAP_MIN = 120;
const $ = id => document.getElementById(id);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } };
const save = a => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch(e){} };
const toMs = (d, t) => new Date(d + "T" + t).getTime();
function today(){
  const n = new Date(), p = x => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth()+1)}-${p(n.getDate())}`;
}
function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200);
}
function esc(s){ return s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
for (let i = 1; i <= TABLE_COUNT; i++) $("table").innerHTML += `<option value="${i}">Bàn ${i}</option>`;
$("date").min = $("date").value = today();
function validate(v){
  const e = {};
  if (v.name.trim().length < 2) e.name = "Nhập tên khách (ít nhất 2 ký tự).";
  if (!/^(0|\+84)\d{9}$/.test(v.phone.replace(/[\s.-]/g, ""))) e.phone = "Số điện thoại không hợp lệ.";
  if (!(v.guests >= 1 && v.guests <= 30)) e.guests = "Số người từ 1 đến 30.";
  if (!v.date) e.date = "Chọn ngày.";
  if (!v.time) e.time = "Chọn giờ.";
  if (v.date && v.time && toMs(v.date, v.time) < Date.now()) e.time = "Thời gian đã qua.";
  if (!e.date && !e.time){
    const clash = load().find(r => r.table === v.table &&
      Math.abs(toMs(r.date, r.time) - toMs(v.date, v.time)) < GAP_MIN * 60000);
    if (clash) e.table = `Bàn ${v.table} đã được đặt lúc ${clash.time} ngày ${fmtDate(clash.date)}.`;
  }
  return e;
}
const fmtDate = d => d.split("-").reverse().join("/");
function showErrors(e){
  ["name","phone","guests","table","date","time"].forEach(k => {
    $("e-" + k).textContent = e[k] || "";
    $(k).classList.toggle("bad", !!e[k]);
  });
}
$("form").addEventListener("submit", ev => {
  ev.preventDefault();
  const v = {
    name: $("name").value, phone: $("phone").value, guests: +$("guests").value,
    table: +$("table").value, date: $("date").value, time: $("time").value
  };
  const e = validate(v);
  showErrors(e);
  if (Object.keys(e).length) return;
  const list = load();
  list.push({ id: Date.now(), status: "da-dat", name: v.name.trim(), phone: v.phone.trim(),
              guests: v.guests, table: v.table, date: v.date, time: v.time });
  save(list);
  $("form").reset(); $("date").value = today(); $("time").value = "18:00"; $("guests").value = 2;
  render(); toast(`Đã đặt Bàn ${v.table} lúc ${v.time} ngày ${fmtDate(v.date)}`);
});
function render(){
  const list = load().sort((a, b) => toMs(a.date, a.time) - toMs(b.date, b.time));
  $("count").textContent = list.length;
  $("list").innerHTML = list.length ? list.map(r => `
    <div class="item">
      <div class="tnum">${r.table}</div>
      <div class="info">
        <b>${esc(r.name)}</b> <span class="tag">Đã đặt</span><br>
        ${r.time} · ${fmtDate(r.date)} · ${r.guests} người<br>
        <small>${esc(r.phone)}</small>
      </div>
      <button class="del" data-del="${r.id}">Hủy</button>
    </div>`).join("") : `<p class="empty">Chưa có bàn nào được đặt.</p>`;
}
$("list").addEventListener("click", e => {
  const b = e.target.closest("[data-del]"); if (!b) return;
  if (!confirm("Hủy đặt bàn này?")) return;
  save(load().filter(r => r.id !== +b.dataset.del));
  render(); toast("Đã hủy đặt bàn");
});
render();