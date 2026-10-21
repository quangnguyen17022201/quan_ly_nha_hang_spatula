var soBan = localStorage.getItem("banDangChon");
if (!soBan) soBan = "1";
var order = [];
function tien(so) {
  return so.toLocaleString("vi-VN") + "đ";
}
function docOrder() {
  var daLuu = localStorage.getItem("order-ban-" + soBan);
  try {
    order = daLuu ? JSON.parse(daLuu) : [];
  } catch (e) {
    order = [];
  }
}
function luuOrder() {
  localStorage.setItem("order-ban-" + soBan, JSON.stringify(order));
}
function hienThongBao(chu) {
  var o = document.getElementById("thong-bao");
  o.innerText = chu;
  o.className = "thong-bao hien";
  setTimeout(function () {
    o.className = "thong-bao";
  }, 1500);
}
function chonBan(n) {
  soBan = String(n);
  localStorage.setItem("banDangChon", soBan);
  docOrder();
  veLai();
}
function themMon(nut) {
  var ten = nut.getAttribute("data-ten");
  var gia = Number(nut.getAttribute("data-gia"));
  var daCo = false;
  for (var i = 0; i < order.length; i++) {
    if (order[i].ten === ten) {
      order[i].soLuong++;
      daCo = true;
      break;
    }
  }
  if (!daCo) {
    order.push({ ten: ten, gia: gia, soLuong: 1 });
  }
  localStorage.setItem("trang-thai-ban-" + soBan, "co-khach");
  veLai();
  hienThongBao("Đã thêm " + ten + " vào bàn " + soBan);
}
function doiSoLuong(vitri, thay) {
  order[vitri].soLuong += thay;
  if (order[vitri].soLuong <= 0) {
    order.splice(vitri, 1);
  }
  veLai();
}
function xoaMon(vitri) {
  order.splice(vitri, 1);
  veLai();
}
function xoaOrder() {
  order = [];
  localStorage.setItem("trang-thai-ban-" + soBan, "trong");
  veLai();
}
function xacNhan() {
  if (order.length === 0) {
    hienThongBao("Chưa có món nào để xác nhận");
  } else {
    hienThongBao("Đã gửi order bàn " + soBan + " cho bếp");
  }
}
function veLai() {
  var html = "";
  var tong = 0;
  var tongMon = 0;
  for (var i = 0; i < order.length; i++) {
    var thanhTien = order[i].gia * order[i].soLuong;
    tong += thanhTien;
    tongMon += order[i].soLuong;
    html += '<div class="dong-order">' +
              '<div class="thong-tin">' +
                '<p class="ten-mon-order">' + order[i].ten + '</p>' +
                '<p class="gia-order">' + tien(order[i].gia) + ' x ' + order[i].soLuong + ' = <strong>' + tien(thanhTien) + '</strong></p>' +
                '<div class="so-luong">' +
                  '<button type="button" class="nut-sl" onclick="doiSoLuong(' + i + ', -1)">−</button>' +
                  '<span class="sl">' + order[i].soLuong + '</span>' +
                  '<button type="button" class="nut-sl" onclick="doiSoLuong(' + i + ', 1)">+</button>' +
                '</div>' +
              '</div>' +
              '<button type="button" class="nut-xoa" onclick="xoaMon(' + i + ')">✕</button>' +
            '</div>';
  }
  document.getElementById("danh-sach-order").innerHTML = html;
  document.getElementById("bao-trong").hidden = (order.length > 0);
  document.getElementById("tong-tien").innerText = tien(tong);
  document.getElementById("so-mon").innerText = tongMon;
  document.getElementById("tong-tren").innerText = tien(tong);
  document.getElementById("so-mon-tren").innerText = tongMon;
  document.getElementById("ten-ban-tren").innerText = soBan;
  document.getElementById("tieu-de-order").innerText = "Order - Bàn " + soBan;
  luuOrder();
  capNhatNutBan();
}
function capNhatNutBan() {
  for (var n = 1; n <= 10; n++) {
    var nut = document.getElementById("nut-ban-" + n);
    if (!nut) continue;
    var daLuu = localStorage.getItem("order-ban-" + n);
    var coMon = false;
    if (daLuu) {
      try {
        var parsed = JSON.parse(daLuu);
        coMon = parsed.length > 0;
      } catch(e) {}
    }
    var lop = "nut-ban";
    if (coMon) lop += " co-order";
    if (String(n) === soBan) lop += " dang-chon";
    nut.className = lop;
  }
}
docOrder();
veLai();