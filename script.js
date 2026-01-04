// Cấu hình danh sách tiền và tỉ lệ (GIỮ NGUYÊN)
const prizeData = [
    { value: 10000, img: 'images/10k.png', elementId: 'chk-10k', weight: 15 },
    { value: 20000, img: 'images/20k.png', elementId: 'chk-20k', weight: 70 },
    { value: 50000, img: 'images/50k.png', elementId: 'chk-50k', weight: 15 },
    { value: 100000, img: 'images/100k.png', elementId: 'chk-100k', weight: 2 },
    { value: 200000, img: 'images/200k.png', elementId: 'chk-200k', weight: 1 },
    { value: 500000, img: 'images/500k.png', elementId: 'chk-500k', weight: 0.1 }
];

// ... (Phần khai báo prizeData giữ nguyên) ...

// ... Khai báo biến prizeData ...

const bgMusic = document.getElementById('bg-music');
const winSound = document.getElementById('win-sound');

// --- HÀM MỚI: XỬ LÝ VÀO NHÀ ---
function vaoNha() {
    // 1. Phát nhạc NGAY LẬP TỨC (Lúc này trình duyệt cho phép vì bạn vừa click)
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
        console.log("Nhạc đã lên!");
    }).catch(e => {
        console.log("Vẫn lỗi: " + e);
    });

    // 2. Ẩn màn hình chờ đi
    const overlay = document.getElementById('click-overlay');
    overlay.style.opacity = '0';
    
    // Xóa hẳn khỏi giao diện sau 0.5s
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

// ... Các hàm moLiXi, hienThiKetQua giữ nguyên ...


function moLiXi() {
    // 1. KÍCH HOẠT NHẠC NỀN (Nếu nó chưa chạy)
    // Đây là "mẹo": Khi người dùng click mở bao, tính là đã tương tác, nên ta bật nhạc luôn
    if (bgMusic.paused) {
        bgMusic.play();
    }

    // 2. Logic chọn tiền
    let availablePrizes = prizeData.filter(item => {
        return document.getElementById(item.elementId).checked;
    });

    if (availablePrizes.length === 0) {
        alert("Admin ơi, hãy bật ít nhất một mệnh giá tiền nhé!");
        return;
    }

    const result = getWeightedRandom(availablePrizes);

    // 3. Hiệu ứng hiển thị kết quả
    hienThiKetQua(result);
}

function getWeightedRandom(items) {
    let totalWeight = 0;
    for (let item of items) { totalWeight += item.weight; }
    let randomNum = Math.random() * totalWeight;
    for (let item of items) {
        if (randomNum < item.weight) return item;
        randomNum -= item.weight;
    }
}

function hienThiKetQua(prize) {
    const modal = document.getElementById('result-modal');
    const moneyImg = document.getElementById('money-img');
    const moneyVal = document.getElementById('money-value');

    // Gán dữ liệu
    moneyVal.innerText = prize.value.toLocaleString('vi-VN') + " đ";
    moneyImg.src = prize.img;
    
    // Hiện modal
    modal.classList.remove('hidden');

    // --- PHÁT ÂM THANH CHIẾN THẮNG ---
    winSound.volume = 1.0; // Âm lượng to nhất
    winSound.currentTime = 0; // Tua lại từ đầu (để nếu click liên tục vẫn kêu)
    winSound.play();

    // Bắn pháo hoa
    banPhaoHoa(); 
}

function resetGame() {
    document.getElementById('result-modal').classList.add('hidden');
    // Lưu ý: Không tắt nhạc nền, để nó chạy tiếp cho vui tai
}

// Hàm bắn pháo hoa
function banPhaoHoa() {
    // 1. CHỈNH THỜI GIAN BẮN (Lâu hơn)
    // Sửa số 2 thành số 5 (tức là bắn 5 giây thay vì 2 giây)
    var duration = 5 * 1000; 

    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      // 2. CHỈNH SỐ LƯỢNG HẠT MỖI LẦN BẮN (Nhiều pháo hơn)
      // Sửa số 50 thành 150 hoặc 200 (Càng to càng dày đặc)
      var particleCount = 150 * (timeLeft / duration);

      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
    
    // 3. CÚ NỔ LỚN (Làm cho hoành tráng hơn)
    setTimeout(() => {
         confetti({ 
            particleCount: 300,  // Sửa 100 thành 300 cho nổ to
            spread: 100,         // Sửa 70 thành 100 cho tỏa rộng ra
            origin: { y: 0.6 }, 
            zIndex: 9999 
        });
    }, 500);
}
