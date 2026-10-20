let banDangChon = 1;
const soLuongBan = 10;

document.addEventListener("DOMContentLoaded", function () {
  layBanHienTai();
  taoSơDoBan();
  hienThiHoaDon(banDangChon);
});

function layBanHienTai() {
  const banLuu = localStorage.getItem("banDangChon");
  if (banLuu) {
    banDangChon = parseInt(banLuu);
  }
}

function taoSơDoBan() {
  const luoiBan = document.getElementById("luoi-ban-thanh-toan");
  luoiBan.innerHTML = "";

  for (let i = 1; i <= soLuongBan; i++) {
    const nut = document.createElement("button");
    nut.type = "button";
    nut.innerText = i;
    
    // Gán class CSS chung
    nut.className = "nut-ban";

    const daLuu = localStorage.getItem("order-ban-" + i);
    let coMon = false;
    if (daLuu) {
      try {
        let parsed = JSON.parse(daLuu);
        if (parsed.length > 0) coMon = true;
      } catch (e) {}
    }

    if (coMon) {
      nut.classList.add("co-order");
    }

    if (i === banDangChon) {
      nut.classList.add("dang-chon");
    }

    nut.onclick = function () {
      chonBanThanhToan(i);
    };

    luoiBan.appendChild(nut);
  }
}

function chonBanThanhToan(soBan) {
  banDangChon = soBan;
  localStorage.setItem("banDangChon", soBan);
  taoSơDoBan();
  hienThiHoaDon(soBan);
}

function hienThiHoaDon(soBan) {
  document.getElementById("so-ban-tt").innerText = soBan;
  const tbody = document.getElementById("danh-sach-mon-tt");
  const baoTrong = document.getElementById("bao-trong-tt");
  tbody.innerHTML = "";

  const daLuu = localStorage.getItem("order-ban-" + soBan);
  let danhSachMon = [];
  if (daLuu) {
    try {
      danhSachMon = JSON.parse(daLuu);
    } catch (e) {
      danhSachMon = [];
    }
  }

  if (danhSachMon.length === 0) {
    baoTrong.style.display = "block";
    document.getElementById("tong-so-mon-tt").innerText = "0";
    document.getElementById("tong-tien-tt").innerText = "0đ";
    return;
  }

  baoTrong.style.display = "none";

  let tongTien = 0;
  let tongSoLuong = 0;

  danhSachMon.forEach((mon, index) => {
    const thanhTien = mon.gia * mon.soLuong;
    tongTien += thanhTien;
    tongSoLuong += mon.soLuong;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${mon.ten}</td>
      <td>${mon.gia.toLocaleString('vi-VN')}đ</td>
      <td>${mon.soLuong}</td>
      <td>${thanhTien.toLocaleString('vi-VN')}đ</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("tong-so-mon-tt").innerText = tongSoLuong;
  document.getElementById("tong-tien-tt").innerText = tongTien.toLocaleString('vi-VN') + "đ";
}

function xacNhanThanhToan() {
  const daLuu = localStorage.getItem("order-ban-" + banDangChon);
  let danhSachMon = [];
  if (daLuu) {
      danhSachMon = JSON.parse(daLuu);
  }
  
  if (danhSachMon.length === 0) {
    alert(`Bàn ${banDangChon} chưa có món nào để thanh toán!`);
    return;
  }

  const tongTien = document.getElementById("tong-tien-tt").innerText;
  const hinhThuc = document.getElementById("hinh-thuc").selectedOptions[0].text;

  if (confirm(`Xác nhận thanh toán cho Bàn ${banDangChon}\nTổng tiền: ${tongTien}\nHình thức: ${hinhThuc}`)) {
    localStorage.removeItem("order-ban-" + banDangChon);
    localStorage.removeItem("trang-thai-ban-" + banDangChon);
    alert(`Thanh toán thành công cho Bàn ${banDangChon}!`);
    taoSơDoBan();
    hienThiHoaDon(banDangChon);
  }
}