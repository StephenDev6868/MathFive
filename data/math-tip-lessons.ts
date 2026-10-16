export type TipLesson = {
  explanation: string
  steps: string[]
  examples: { problem: string; solution: string[]; answer: string; check: string }[]
  mistake: string
}

export const mathTipLessons = {
  order: {
    explanation: 'Dùng khi một biểu thức có nhiều phép tính. Thứ tự tính giúp mọi người tìm được cùng một kết quả. Nhân và chia cùng mức ưu tiên; cộng và trừ cũng cùng mức ưu tiên.',
    steps: ['Tính trong ngoặc trước. Nếu có nhiều lớp ngoặc, làm từ trong ra ngoài.', 'Thực hiện nhân, chia từ trái sang phải.', 'Cuối cùng, thực hiện cộng, trừ từ trái sang phải.'],
    examples: [
      { problem: 'Tính 48 : (2 + 4) × 3 − 5.', solution: ['Trong ngoặc: 2 + 4 = 6. Biểu thức còn 48 : 6 × 3 − 5.', 'Chia trước vì nằm bên trái phép nhân: 48 : 6 = 8.', 'Nhân: 8 × 3 = 24.', 'Trừ: 24 − 5 = 19.'], answer: '19', check: 'Viết lại từng dòng: 48 : 6 × 3 − 5 = 8 × 3 − 5 = 24 − 5 = 19.' },
      { problem: 'Tính 18 − 3 × 4.', solution: ['Nhân trước: 3 × 4 = 12.', 'Sau đó mới trừ: 18 − 12 = 6.'], answer: '6', check: 'Nếu tính (18 − 3) × 4 thì đó là biểu thức khác vì đã thêm ngoặc.' },
    ],
    mistake: 'Không phải lúc nào cũng nhân trước chia hoặc cộng trước trừ. Hai phép cùng mức phải tính từ trái sang phải.',
  },
  average: {
    explanation: 'Số trung bình cộng cho biết nếu chia đều tổng cho các số hạng thì mỗi phần được bao nhiêu. Dùng để tìm mức trung bình của những đại lượng cùng loại, cùng đơn vị.',
    steps: ['Cộng tất cả các giá trị.', 'Đếm đúng số giá trị được cộng.', 'Lấy tổng chia cho số giá trị. Ghi đơn vị của đại lượng.'],
    examples: [{ problem: 'Ba ngày, Lan đọc lần lượt 12, 15 và 18 trang. Trung bình mỗi ngày Lan đọc bao nhiêu trang?', solution: ['Tổng số trang: 12 + 15 + 18 = 45 (trang).', 'Có 3 ngày nên chia tổng cho 3: 45 : 3 = 15 (trang).'], answer: 'Trung bình 15 trang mỗi ngày.', check: '15 × 3 = 45 trang, đúng bằng tổng đã đọc. Số trung bình nằm giữa 12 và 18.' }],
    mistake: 'Không chia cho số lớn nhất hoặc số nhỏ nhất. Phải chia cho số lượng các số hạng; một giá trị bằng 0 vẫn được tính là một số hạng.',
  },
  divisible: {
    explanation: 'Chia hết nghĩa là phép chia có số dư bằng 0. Các dấu hiệu giúp kiểm tra nhanh một số tự nhiên mà chưa cần đặt tính chia.',
    steps: ['Chia hết cho 2: chữ số tận cùng là 0, 2, 4, 6 hoặc 8.', 'Chia hết cho 5: chữ số tận cùng là 0 hoặc 5. Chia hết cho 10: tận cùng là 0.', 'Chia hết cho 3 hoặc 9: tính tổng các chữ số rồi xét tổng đó có chia hết cho 3 hoặc 9 không.'],
    examples: [{ problem: 'Số 315 chia hết cho những số nào trong các số 2, 3, 5, 9?', solution: ['Tận cùng là 5, không phải chữ số chẵn: không chia hết cho 2.', 'Tận cùng là 5: chia hết cho 5.', 'Tổng chữ số: 3 + 1 + 5 = 9.', '9 chia hết cho cả 3 và 9 nên 315 chia hết cho cả 3 và 9.'], answer: '315 chia hết cho 3, 5 và 9; không chia hết cho 2.', check: '315 : 3 = 105; 315 : 5 = 63; 315 : 9 = 35, đều không dư.' }],
    mistake: 'Chia hết cho 3 chưa chắc chia hết cho 9. Ví dụ 12 có tổng chữ số bằng 3 nên chia hết cho 3 nhưng không chia hết cho 9.',
  },
  'fraction-simplify': {
    explanation: 'Rút gọn là viết phân số bằng một phân số có tử và mẫu nhỏ hơn nhưng giá trị không đổi. Phân số tối giản có tử và mẫu không cùng chia hết cho số tự nhiên nào lớn hơn 1.',
    steps: ['Tìm một số lớn hơn 1 mà cả tử và mẫu cùng chia hết.', 'Chia cả tử và mẫu cho đúng số đó.', 'Tiếp tục nếu còn rút gọn được.'],
    examples: [{ problem: 'Rút gọn 18/24 về phân số tối giản.', solution: ['18 và 24 cùng chia hết cho 2: 18/24 = 9/12.', '9 và 12 cùng chia hết cho 3: 9/12 = 3/4.', '3 và 4 không có ước chung lớn hơn 1 nên dừng lại. Có thể chia ngay cả 18 và 24 cho 6.'], answer: '18/24 = 3/4.', check: 'Nhân cả tử và mẫu của 3/4 với 6 được 18/24.' }],
    mistake: 'Không chỉ chia tử hoặc chỉ chia mẫu. Không trừ cùng một số ở tử và mẫu để rút gọn.',
  },
  'fraction-compare': {
    explanation: 'Muốn so sánh, hãy đưa các phần về cùng kích thước. Khi hai phân số có cùng mẫu số dương, tử lớn hơn nghĩa là có nhiều phần hơn.',
    steps: ['Nếu cùng mẫu, so sánh ngay hai tử số.', 'Nếu khác mẫu, chọn một mẫu chung và nhân cả tử, mẫu của từng phân số với số phù hợp.', 'So sánh các tử mới rồi kết luận cho hai phân số ban đầu.'],
    examples: [{ problem: 'So sánh 3/4 và 5/6.', solution: ['Chọn mẫu chung 12 vì 12 chia hết cho cả 4 và 6.', '3/4 = (3 × 3)/(4 × 3) = 9/12.', '5/6 = (5 × 2)/(6 × 2) = 10/12.', '9 < 10 nên 9/12 < 10/12.'], answer: '3/4 < 5/6.', check: 'Cả hai đều nhỏ hơn 1. 3/4 còn thiếu 1/4, còn 5/6 chỉ thiếu 1/6 để bằng 1, nên 5/6 lớn hơn.' }],
    mistake: 'Không so sánh riêng tử số khi hai mẫu khác nhau. Với cùng tử số dương, mẫu càng lớn thì mỗi phần càng nhỏ.',
  },
  'fraction-add': {
    explanation: 'Chỉ cộng hoặc trừ trực tiếp số phần khi các phần cùng kích thước, tức là cùng mẫu số. Mẫu số cho biết kích thước phần nên được giữ nguyên sau khi quy đồng.',
    steps: ['Quy đồng mẫu nếu cần.', 'Cộng hoặc trừ tử số, giữ nguyên mẫu chung.', 'Rút gọn kết quả.'],
    examples: [
      { problem: 'Tính 1/2 + 1/3.', solution: ['Mẫu chung là 6: 1/2 = 3/6 và 1/3 = 2/6.', 'Cộng các phần cùng loại: 3/6 + 2/6 = (3 + 2)/6 = 5/6.'], answer: '5/6', check: '5/6 lớn hơn mỗi số hạng và nhỏ hơn 1, phù hợp với phép cộng này.' },
      { problem: 'Tính 5/6 − 1/4.', solution: ['Mẫu chung là 12: 5/6 = 10/12 và 1/4 = 3/12.', '10/12 − 3/12 = 7/12.'], answer: '7/12', check: '7/12 + 1/4 = 7/12 + 3/12 = 10/12 = 5/6.' },
    ],
    mistake: '1/2 + 1/3 không bằng 2/5. Cộng tử và cộng mẫu là sai quy tắc.',
  },
  'fraction-multiply': {
    explanation: 'Nhân phân số: nhân các tử với nhau, các mẫu với nhau. Chia cho một phân số khác 0: nhân với phân số đảo ngược của số chia.',
    steps: ['Với phép nhân, có thể rút gọn một tử với một mẫu bằng cách chia cả hai cho cùng một ước chung.', 'Nhân tử với tử, mẫu với mẫu.', 'Với phép chia, giữ số bị chia, đổi dấu chia thành nhân và đảo riêng phân số chia. Sau đó nhân, rút gọn.'],
    examples: [
      { problem: 'Tính 2/3 × 9/10.', solution: ['Rút gọn 2 và 10 cho 2 được 1 và 5; rút gọn 9 và 3 cho 3 được 3 và 1.', 'Tích bằng (1 × 3)/(1 × 5) = 3/5.'], answer: '3/5', check: 'Nhân trực tiếp được 18/30, rút gọn cho 6 cũng được 3/5.' },
      { problem: 'Tính 2/3 : 4/5.', solution: ['Phân số đảo của 4/5 là 5/4.', '2/3 : 4/5 = 2/3 × 5/4 = 10/12 = 5/6.'], answer: '5/6', check: 'Lấy thương nhân số chia: 5/6 × 4/5 = 20/30 = 2/3.' },
    ],
    mistake: 'Không đảo cả hai phân số khi chia. Không được chia cho phân số bằng 0; mẫu số của một phân số cũng phải khác 0.',
  },
  'fraction-of-number': {
    explanation: 'Tìm a/b của một số nghĩa là chia số đó thành b phần bằng nhau rồi lấy a phần. Vì vậy ta lấy số đã cho chia b rồi nhân a, hoặc nhân với a/b.',
    steps: ['Xác định số chỉ toàn bộ và phân số cần lấy.', 'Tìm một phần bằng cách chia cho mẫu số.', 'Nhân một phần với tử số.'],
    examples: [{ problem: 'Lớp có 35 học sinh, 3/5 số học sinh tham gia câu lạc bộ. Có bao nhiêu bạn tham gia?', solution: ['Toàn bộ là 35 học sinh; chia thành 5 phần bằng nhau.', 'Một phần có: 35 : 5 = 7 (học sinh).', 'Ba phần có: 7 × 3 = 21 (học sinh).'], answer: '21 học sinh.', check: '21/35 rút gọn bằng 3/5. Vì 3/5 < 1 nên kết quả phải nhỏ hơn 35.' }],
    mistake: 'Phải phân biệt tìm 3/5 của 35 với biết 3/5 của một số là 35. Bài thứ hai là tìm toàn bộ, cần lấy 35 : 3 × 5.',
  },
  'decimal-add': {
    explanation: 'Cộng, trừ số thập phân vẫn là cộng, trừ các hàng tương ứng: đơn vị với đơn vị, phần mười với phần mười. Dấu phẩy thẳng cột giúp đặt đúng các hàng.',
    steps: ['Đặt các dấu phẩy thẳng cột. Có thể thêm 0 vào bên phải phần thập phân.', 'Cộng hoặc trừ từ phải sang trái như số tự nhiên, nhớ hoặc mượn khi cần.', 'Đặt dấu phẩy của kết quả thẳng cột với các dấu phẩy đã viết.'],
    examples: [
      { problem: 'Tính 8,5 + 2,35.', solution: ['Viết 8,5 thành 8,50 để có cùng hai chữ số thập phân.', 'Ở các hàng phần trăm, phần mười, đơn vị và chục, cộng như 850 + 235 = 1085.', 'Giữ hai chữ số thập phân: 8,50 + 2,35 = 10,85.'], answer: '10,85', check: '10,85 − 2,35 = 8,50 = 8,5.' },
      { problem: 'Tính 12 − 3,75.', solution: ['Viết 12 = 12,00 và đặt thẳng dấu phẩy.', 'Trừ như 1200 − 375 = 825 rồi giữ hai chữ số thập phân.'], answer: '8,25', check: '8,25 + 3,75 = 12,00.' },
    ],
    mistake: 'Không căn theo chữ số cuối cùng của hai số. Ví dụ 8,5 và 2,35 phải căn dấu phẩy, không căn chữ số 5.',
  },
  'decimal-10': {
    explanation: 'Mỗi hàng có giá trị gấp 10 lần hàng liền bên phải. Nhân hoặc chia với 10, 100, 1000 làm thay đổi giá trị các chữ số tương ứng 1, 2 hoặc 3 hàng.',
    steps: ['Đếm số chữ số 0 của 10, 100 hoặc 1000.', 'Nhân: chuyển dấu phẩy sang phải đúng số hàng đó.', 'Chia: chuyển dấu phẩy sang trái. Nếu thiếu chữ số, thêm 0 vào vị trí cần thiết.'],
    examples: [
      { problem: 'Tính 4,25 × 100 và 4,25 : 100.', solution: ['100 có hai chữ số 0.', 'Nhân: chuyển dấu phẩy sang phải 2 hàng, 4,25 → 425.', 'Chia: chuyển sang trái 2 hàng, 4,25 → 0,0425.'], answer: '425 và 0,0425.', check: '425 : 100 = 4,25; 0,0425 × 100 = 4,25.' },
      { problem: 'Tính 0,7 × 1000.', solution: ['Cần chuyển dấu phẩy sang phải 3 hàng.', 'Viết 0,7 = 0,700; chuyển dấu phẩy được 700.'], answer: '700', check: '700 : 1000 = 0,7.' },
    ],
    mistake: 'Không chỉ thêm 0 vào cuối phần thập phân: 4,2500 vẫn bằng 4,25, không bằng 4,25 × 100.',
  },
  'decimal-multiply': {
    explanation: 'Có thể bỏ dấu phẩy để nhân như số tự nhiên, nhưng phải bù lại bằng cách đặt dấu phẩy đúng vị trí trong tích.',
    steps: ['Nhân như hai số tự nhiên, tạm bỏ dấu phẩy.', 'Đếm tổng số chữ số ở phần thập phân của cả hai thừa số.', 'Từ phải sang trái trong tích, tách ra đúng số chữ số vừa đếm. Nếu thiếu, thêm 0 bên trái.'],
    examples: [
      { problem: 'Tính 1,25 × 0,4.', solution: ['Nhân số tự nhiên: 125 × 4 = 500.', '1,25 có 2 chữ số thập phân; 0,4 có 1. Tổng cộng 3 chữ số.', 'Tách 3 chữ số từ bên phải: 0,500 = 0,5.'], answer: '0,5', check: '0,4 = 4/10 nên 1,25 × 0,4 = 1,25 × 4 : 10 = 5 : 10 = 0,5.' },
      { problem: 'Tính 0,2 × 0,3.', solution: ['2 × 3 = 6.', 'Hai thừa số có tổng cộng 2 chữ số thập phân. Viết tích là 0,06.'], answer: '0,06', check: '2/10 × 3/10 = 6/100 = 0,06.' },
    ],
    mistake: 'Nhân với số dương nhỏ hơn 1 làm số ban đầu nhỏ đi. Không mặc định kết quả phép nhân luôn lớn hơn các thừa số.',
  },
  'decimal-divide': {
    explanation: 'Thương không đổi khi cùng nhân số bị chia và số chia với một số khác 0. Ta dùng tính chất này để biến số chia thập phân thành số tự nhiên.',
    steps: ['Đếm số chữ số thập phân của số chia.', 'Chuyển dấu phẩy của cả hai số sang phải bấy nhiêu hàng.', 'Chia cho số tự nhiên vừa nhận được. Có thể thêm 0 ở phần thập phân của số bị chia để chia tiếp.'],
    examples: [
      { problem: 'Tính 7,5 : 0,5.', solution: ['0,5 có 1 chữ số thập phân, nên nhân cả hai số với 10.', '7,5 : 0,5 = 75 : 5.', '75 : 5 = 15.'], answer: '15', check: '15 × 0,5 = 7,5.' },
      { problem: 'Tính 4,2 : 0,12.', solution: ['0,12 có 2 chữ số thập phân nên nhân cả hai số với 100.', 'Viết 4,2 = 4,20. Khi chuyển dấu phẩy: 420 : 12.', '420 : 12 = 35.'], answer: '35', check: '35 × 0,12 = 4,20 = 4,2.' },
    ],
    mistake: 'Không chuyển dấu phẩy chỉ ở số chia. Cả hai số phải cùng nhân với 10, 100 hoặc 1000. Không được chia cho 0.',
  },
  'percent-find': {
    explanation: 'Phần trăm là số phần trên 100 phần bằng nhau. Tỉ số phần trăm của A so với B cho biết nếu coi B là 100 phần thì A chiếm bao nhiêu phần.',
    steps: ['Xác định đại lượng được so sánh và đại lượng làm mốc 100%.', 'Chia đại lượng được so sánh cho đại lượng làm mốc.', 'Nhân thương với 100 rồi viết kí hiệu % vào bên phải.'],
    examples: [{ problem: 'Lớp có 40 học sinh, trong đó có 18 học sinh nữ. Học sinh nữ chiếm bao nhiêu phần trăm cả lớp?', solution: ['Cả lớp là mốc 100%, nên lấy 18 chia 40.', '18 : 40 = 0,45.', '0,45 × 100 = 45, viết thành 45%.'], answer: '45% số học sinh cả lớp.', check: '40 × 45 : 100 = 18 học sinh, đúng với đề bài.' }],
    mistake: 'Không đảo thành 40 : 18. Luôn hỏi “so với tổng nào?” để chọn mẫu đúng. Mốc so sánh phải khác 0.',
  },
  'percent-value': {
    explanation: 'Dùng khi biết toàn bộ và muốn tìm một phần chiếm p%. Vì p% = p/100 nên lấy toàn bộ nhân p rồi chia 100.',
    steps: ['Xác định giá trị tương ứng với 100%.', 'Tính phần cần tìm: toàn bộ × số phần trăm : 100.', 'Nếu hỏi giá sau giảm, lấy giá ban đầu trừ phần giảm; nếu hỏi sau tăng, cộng phần tăng.'],
    examples: [{ problem: 'Một chiếc cặp giá 150 000 đồng, được giảm 20%. Hỏi giảm bao nhiêu tiền và phải trả bao nhiêu?', solution: ['Giá ban đầu 150 000 đồng là 100%.', 'Tiền giảm: 150 000 × 20 : 100 = 30 000 (đồng).', 'Tiền phải trả: 150 000 − 30 000 = 120 000 (đồng).'], answer: 'Giảm 30 000 đồng; phải trả 120 000 đồng.', check: 'Sau giảm còn 80% giá ban đầu: 150 000 × 80 : 100 = 120 000 đồng.' }],
    mistake: 'Tiền giảm không phải tiền phải trả. Đọc kĩ câu hỏi để biết cần tìm phần giảm hay phần còn lại.',
  },
  'percent-total': {
    explanation: 'Dùng khi biết một phần chiếm p% và cần tìm toàn bộ 100%. Trước hết tìm giá trị của 1%, sau đó nhân 100.',
    steps: ['Xác định giá trị đã biết tương ứng với bao nhiêu phần trăm.', 'Giá trị của 1% = giá trị đã biết : số phần trăm.', 'Giá trị của 100% = giá trị của 1% × 100.'],
    examples: [{ problem: 'Một lớp có 12 học sinh tham gia đội văn nghệ, chiếm 30% cả lớp. Lớp có bao nhiêu học sinh?', solution: ['12 học sinh tương ứng với 30%, chưa phải toàn bộ.', '1% tương ứng: 12 : 30 = 0,4.', '100% tương ứng: 0,4 × 100 = 40 (học sinh). Số 0,4 ở bước giữa chỉ là giá trị tính toán của 1%, không phải số học sinh thực tế trong một nhóm.'], answer: '40 học sinh.', check: '40 × 30 : 100 = 12 học sinh.' }],
    mistake: 'Không lấy 12 × 30 : 100 vì đó là tìm 30% của 12. Muốn tìm toàn bộ phải chia cho tỉ lệ đã biết; tỉ lệ này phải khác 0.',
  },
  'unit-length': {
    explanation: 'Hai đơn vị liền nhau trong bảng độ dài hoặc khối lượng hơn kém nhau 10 lần. Cùng một lượng, khi dùng đơn vị nhỏ hơn thì số đo lớn hơn.',
    steps: ['Độ dài: km → hm → dam → m → dm → cm → mm. Khối lượng: tấn → tạ → yến → kg → hg → dag → g.', 'Đổi sang đơn vị nhỏ hơn: nhân 10 cho mỗi bậc.', 'Đổi sang đơn vị lớn hơn: chia 10 cho mỗi bậc. Với số đo gồm hai đơn vị, đổi từng phần rồi cộng.'],
    examples: [
      { problem: 'Đổi 2,5 m ra cm.', solution: ['Từ m đến cm qua 2 bậc: m → dm → cm.', 'Mỗi bậc nhân 10 nên nhân 100: 2,5 × 100 = 250.'], answer: '2,5 m = 250 cm.', check: '250 : 100 = 2,5 m.' },
      { problem: 'Đổi 3 kg 50 g ra kg.', solution: ['1 kg = 1000 g nên 50 g = 50 : 1000 = 0,05 kg.', 'Cộng hai phần: 3 + 0,05 = 3,05 kg.'], answer: '3 kg 50 g = 3,05 kg.', check: '3,05 × 1000 = 3050 g = 3000 g + 50 g.' },
    ],
    mistake: '3 kg 50 g không bằng 3,50 kg. Cần đổi theo quan hệ 1 kg = 1000 g, không ghép các chữ số.',
  },
  'unit-area': {
    explanation: 'Diện tích đo phần mặt phẳng được phủ kín. Vì 1 m = 10 dm nên một hình vuông 1 m² có 10 × 10 = 100 ô 1 dm².',
    steps: ['Bảng đơn vị: km² → hm² → dam² → m² → dm² → cm² → mm².', 'Mỗi bậc sang đơn vị nhỏ hơn nhân 100; sang đơn vị lớn hơn chia 100.', 'Nhớ thêm: 1 ha = 1 hm² = 10 000 m²; 1 km² = 100 ha.'],
    examples: [
      { problem: 'Đổi 3,25 m² ra cm².', solution: ['m² → dm² → cm² là 2 bậc.', 'Nhân 100 × 100 = 10 000.', '3,25 × 10 000 = 32 500.'], answer: '32 500 cm².', check: '32 500 : 10 000 = 3,25 m².' },
      { problem: 'Đổi 25 000 m² ra ha.', solution: ['1 ha = 10 000 m².', '25 000 : 10 000 = 2,5.'], answer: '2,5 ha.', check: '2,5 × 10 000 = 25 000 m².' },
    ],
    mistake: 'Không dùng hệ số 10 của độ dài cho diện tích. Mỗi bậc diện tích ứng với hai chữ số, không phải một chữ số.',
  },
  'unit-volume': {
    explanation: 'Thể tích đo phần không gian vật chiếm chỗ. Một khối lập phương cạnh 1 dm có cạnh 10 cm, nên chứa 10 × 10 × 10 = 1000 khối 1 cm³.',
    steps: ['Với m³ → dm³ → cm³, mỗi bậc sang phải nhân 1000, sang trái chia 1000.', 'Liên hệ dung tích: 1 dm³ = 1 lít; 1 cm³ = 1 ml; 1 lít = 1000 ml.', 'Chọn một đơn vị chung trước khi cộng hoặc so sánh.'],
    examples: [{ problem: 'Một bình có 2,5 dm³ nước. Rót ra 750 ml. Bình còn bao nhiêu lít?', solution: ['2,5 dm³ = 2,5 lít = 2500 ml.', 'Lượng nước còn lại: 2500 − 750 = 1750 (ml).', 'Đổi sang lít: 1750 : 1000 = 1,75 (lít).'], answer: '1,75 lít.', check: '1,75 lít + 0,75 lít = 2,5 lít ban đầu.' }],
    mistake: 'Không nhầm 1 m³ với 1 lít: 1 m³ = 1000 dm³ = 1000 lít. Không trừ trực tiếp số đo bằng lít với số đo bằng ml.',
  },
  'unit-time': {
    explanation: 'Các đơn vị thời gian không theo hệ 10. Cần nhớ 1 ngày = 24 giờ, 1 giờ = 60 phút, 1 phút = 60 giây.',
    steps: ['Đổi sang đơn vị nhỏ hơn bằng cách nhân với 24 hoặc 60 theo từng quan hệ.', 'Đổi số phút sang giờ và phút: chia cho 60, thương là giờ, dư là phút.', 'Khi viết giờ dưới dạng thập phân, lấy số phút chia 60 rồi cộng vào số giờ.'],
    examples: [
      { problem: 'Đổi 2 giờ 15 phút ra phút và ra giờ thập phân.', solution: ['2 giờ = 2 × 60 = 120 phút; cộng 15 được 135 phút.', '15 phút = 15 : 60 = 0,25 giờ.', '2 giờ 15 phút = 2 + 0,25 = 2,25 giờ.'], answer: '135 phút = 2,25 giờ.', check: '2,25 × 60 = 135 phút.' },
      { problem: 'Từ 8 giờ 45 phút đến 10 giờ 10 phút là bao lâu?', solution: ['8 giờ 45 phút → 9 giờ: 15 phút.', '9 giờ → 10 giờ: 60 phút; 10 giờ → 10 giờ 10 phút: 10 phút.', 'Tổng: 15 + 60 + 10 = 85 phút.'], answer: '1 giờ 25 phút.', check: '8 giờ 45 phút cộng 1 giờ 25 phút bằng 10 giờ 10 phút.' },
    ],
    mistake: '2 giờ 15 phút không bằng 2,15 giờ. Phần phút phải chia cho 60, không chia cho 100.',
  },
  rectangle: {
    explanation: 'Chu vi là độ dài đường bao quanh hình; diện tích là phần mặt phẳng bên trong. Kí hiệu P là chu vi, S là diện tích.',
    steps: ['Đổi chiều dài và chiều rộng về cùng đơn vị.', 'Hình chữ nhật: P = (dài + rộng) × 2; S = dài × rộng.', 'Hình vuông cạnh a: P = a × 4; S = a × a. Chu vi dùng cm, m…; diện tích dùng cm², m²…'],
    examples: [
      { problem: 'Vườn hình chữ nhật dài 8 m, rộng 5 m. Tính chu vi và diện tích.', solution: ['Nửa chu vi: 8 + 5 = 13 (m).', 'Chu vi: 13 × 2 = 26 (m).', 'Diện tích: 8 × 5 = 40 (m²).'], answer: 'P = 26 m; S = 40 m².', check: 'Cộng bốn cạnh: 8 + 5 + 8 + 5 = 26 m. Diện tích gồm 5 hàng, mỗi hàng 8 ô 1 m².' },
      { problem: 'Hình vuông có chu vi 24 cm. Tìm diện tích.', solution: ['Cạnh: 24 : 4 = 6 (cm).', 'Diện tích: 6 × 6 = 36 (cm²).'], answer: '36 cm².', check: '6 × 4 = 24 cm, đúng chu vi đề bài.' },
    ],
    mistake: 'Không lấy chu vi nhân chu vi để tìm diện tích hình vuông. Phải tìm cạnh trước.',
  },
  triangle: {
    explanation: 'Hai tam giác bằng nhau có thể ghép thành một hình bình hành cùng đáy và chiều cao. Vì thế diện tích tam giác bằng một nửa tích đáy và chiều cao tương ứng.',
    steps: ['Chọn đáy và chiều cao vuông góc với đáy đó.', 'Đổi hai số đo về cùng đơn vị.', 'Nhân đáy với chiều cao rồi chia 2.'],
    examples: [{ problem: 'Tam giác có đáy 8 cm, chiều cao tương ứng 5 cm. Tính diện tích.', solution: ['Hai số đo đã cùng đơn vị cm.', 'Tích đáy và chiều cao: 8 × 5 = 40.', 'Diện tích: 40 : 2 = 20 (cm²).'], answer: '20 cm².', check: 'Hai tam giác như vậy có tổng diện tích 40 cm², đúng bằng 8 × 5.' }],
    mistake: 'Không lấy cạnh xiên làm chiều cao nếu cạnh đó không vuông góc với đáy. Đừng quên chia 2.',
  },
  trapezoid: {
    explanation: 'Hai đáy là hai cạnh song song; chiều cao là khoảng cách vuông góc giữa chúng. Diện tích bằng trung bình cộng hai đáy nhân chiều cao.',
    steps: ['Xác định hai đáy và chiều cao, đổi về cùng đơn vị.', 'Cộng hai đáy rồi nhân chiều cao.', 'Chia kết quả cho 2 và ghi đơn vị diện tích.'],
    examples: [{ problem: 'Hình thang có đáy lớn 10 m, đáy bé 6 m, chiều cao 4 m. Tính diện tích.', solution: ['Tổng hai đáy: 10 + 6 = 16 (m).', 'Diện tích: 16 × 4 : 2 = 32 (m²).', 'Cũng có thể tính đáy trung bình: 16 : 2 = 8 (m), rồi 8 × 4 = 32 (m²).'], answer: '32 m².', check: '32 nằm giữa 6 × 4 = 24 và 10 × 4 = 40, phù hợp với hai kích thước đáy.' }],
    mistake: 'Phải có ngoặc trong (đáy lớn + đáy bé) × cao : 2. Chiều cao không phải cạnh bên nghiêng.',
  },
  circle: {
    explanation: 'Bán kính r nối tâm với đường tròn; đường kính d đi qua tâm và dài bằng hai bán kính. Chu vi C đo đường bao; diện tích S đo phần bên trong. Trong các ví dụ này dùng số gần đúng 3,14.',
    steps: ['Nếu biết đường kính, tìm bán kính bằng d : 2.', 'Chu vi: C = d × 3,14 hoặc r × 2 × 3,14.', 'Diện tích: S = r × r × 3,14.'],
    examples: [{ problem: 'Hình tròn có đường kính 6 cm. Tính chu vi và diện tích.', solution: ['Bán kính: 6 : 2 = 3 (cm).', 'Chu vi: 6 × 3,14 = 18,84 (cm).', 'Diện tích: 3 × 3 × 3,14 = 28,26 (cm²).'], answer: 'C = 18,84 cm; S = 28,26 cm² (dùng 3,14).', check: 'Tính chu vi bằng bán kính: 3 × 2 × 3,14 = 18,84 cm, trùng kết quả trên.' }],
    mistake: 'Không thay đường kính vào vị trí bán kính trong công thức diện tích. C = d × 3,14 nhưng S không bằng d × d × 3,14.',
  },
  cuboid: {
    explanation: 'Hình hộp chữ nhật có 6 mặt. Thể tích đo không gian bên trong; diện tích xung quanh gồm 4 mặt bên; diện tích toàn phần gồm cả hai đáy.',
    steps: ['Chọn đáy có chiều dài a, chiều rộng b; chiều cao h vuông góc với đáy. Đổi về cùng đơn vị.', 'Thể tích V = a × b × h.', 'Diện tích xung quanh = (a + b) × 2 × h. Diện tích toàn phần = diện tích xung quanh + 2 × a × b.'],
    examples: [{ problem: 'Hộp chữ nhật dài 5 cm, rộng 3 cm, cao 2 cm. Tính thể tích, diện tích xung quanh và toàn phần.', solution: ['Thể tích: 5 × 3 × 2 = 30 (cm³).', 'Chu vi đáy: (5 + 3) × 2 = 16 (cm).', 'Diện tích xung quanh: 16 × 2 = 32 (cm²).', 'Hai đáy: 2 × 5 × 3 = 30 (cm²). Toàn phần: 32 + 30 = 62 (cm²).'], answer: 'V = 30 cm³; S xung quanh = 32 cm²; S toàn phần = 62 cm².', check: 'Tổng diện tích 6 mặt: 2 × (5 × 3 + 5 × 2 + 3 × 2) = 62 cm².' }],
    mistake: 'Diện tích toàn phần tính cả nắp và đáy. Hộp không có nắp chỉ có 5 mặt nên phải bớt diện tích một mặt đáy.',
  },
  cube: {
    explanation: 'Hình lập phương có 6 mặt đều là hình vuông bằng nhau và 12 cạnh bằng nhau. Kí hiệu a² nghĩa là a × a; a³ nghĩa là a × a × a.',
    steps: ['Tính diện tích một mặt: a × a.', 'Nhân diện tích một mặt với 4 để tìm diện tích xung quanh, với 6 để tìm diện tích toàn phần.', 'Thể tích = a × a × a.'],
    examples: [{ problem: 'Khối lập phương cạnh 3 cm. Tính diện tích xung quanh, toàn phần và thể tích.', solution: ['Diện tích một mặt: 3 × 3 = 9 (cm²).', 'Diện tích xung quanh: 9 × 4 = 36 (cm²).', 'Diện tích toàn phần: 9 × 6 = 54 (cm²).', 'Thể tích: 3 × 3 × 3 = 27 (cm³).'], answer: '36 cm²; 54 cm²; 27 cm³.', check: 'Khối có 3 lớp, mỗi lớp 3 × 3 = 9 khối 1 cm³; tổng là 27 khối.' }],
    mistake: 'a³ không phải a × 3. Không dùng cm² cho thể tích hoặc cm³ cho diện tích.',
  },
  'sum-difference': {
    explanation: 'Khi biết tổng và hiệu của hai số, có thể bỏ phần chênh lệch để còn hai phần bằng số bé. Vì vậy số bé = (tổng − hiệu) : 2.',
    steps: ['Xác định tổng và hiệu, nhận biết số nào lớn hơn.', 'Tìm số bé = (tổng − hiệu) : 2.', 'Tìm số lớn = số bé + hiệu, hoặc (tổng + hiệu) : 2.'],
    examples: [{ problem: 'Hai bạn có tất cả 40 viên bi. An nhiều hơn Bình 8 viên. Mỗi bạn có bao nhiêu viên?', solution: ['Nếu bớt 8 viên của An, hai bạn có số bi bằng nhau.', 'Hai lần số bi của Bình: 40 − 8 = 32 (viên).', 'Bình có: 32 : 2 = 16 (viên).', 'An có: 16 + 8 = 24 (viên).'], answer: 'An 24 viên, Bình 16 viên.', check: '24 + 16 = 40 và 24 − 16 = 8, đúng cả hai dữ kiện.' }],
    mistake: 'Phải cộng hoặc trừ trong ngoặc trước khi chia 2. Không nhầm số bé với số lớn khi ghi đáp số.',
  },
  'sum-ratio': {
    explanation: 'Tỉ số cho biết hai số gồm bao nhiêu phần bằng nhau. Khi biết tổng, lấy tổng chia tổng số phần để tìm giá trị một phần.',
    steps: ['Biểu diễn hai số bằng các phần bằng nhau theo tỉ số.', 'Cộng số phần của hai số.', 'Tổng : tổng số phần = giá trị một phần. Nhân với số phần của từng số để tìm kết quả.'],
    examples: [{ problem: 'Có 35 quyển sách Toán và Tiếng Việt. Số sách Toán bằng 2/5 số sách Tiếng Việt. Tìm số sách mỗi loại.', solution: ['Sách Toán là 2 phần, sách Tiếng Việt là 5 phần.', 'Tổng số phần: 2 + 5 = 7 (phần).', 'Một phần: 35 : 7 = 5 (quyển).', 'Sách Toán: 5 × 2 = 10 (quyển). Sách Tiếng Việt: 5 × 5 = 25 (quyển).'], answer: '10 quyển Toán và 25 quyển Tiếng Việt.', check: '10 + 25 = 35 và 10/25 = 2/5.' }],
    mistake: '2/5 ở đây là tỉ số sách Toán so với sách Tiếng Việt, không phải so với tổng. Vì thế không lấy 35 × 2/5.',
  },
  'difference-ratio': {
    explanation: 'Khi biết hiệu và tỉ số, phần chênh lệch giữa hai số ứng với hiệu số phần. Chia hiệu đã biết cho hiệu số phần sẽ tìm được một phần.',
    steps: ['Biểu diễn số bé và số lớn theo tỉ số.', 'Hiệu số phần = số phần lớn − số phần bé.', 'Một phần = hiệu : hiệu số phần. Nhân để tìm từng số.'],
    examples: [{ problem: 'Số cây của lớp 5A bằng 2/5 số cây của lớp 5B. Lớp 5B trồng nhiều hơn 15 cây. Mỗi lớp trồng bao nhiêu cây?', solution: ['Lớp 5A có 2 phần, lớp 5B có 5 phần.', 'Chênh lệch: 5 − 2 = 3 (phần), ứng với 15 cây.', 'Một phần: 15 : 3 = 5 (cây).', 'Lớp 5A: 5 × 2 = 10 (cây). Lớp 5B: 5 × 5 = 25 (cây).'], answer: '5A trồng 10 cây; 5B trồng 25 cây.', check: '25 − 10 = 15 và 10/25 = 2/5.' }],
    mistake: 'Biết hiệu thì chia cho hiệu số phần, không chia cho tổng số phần. Nếu hai số phần bằng nhau thì không áp dụng cách chia này.',
  },
  'unit-method': {
    explanation: 'Rút về đơn vị là tìm giá trị của một đơn vị trước rồi suy ra nhiều đơn vị. Áp dụng khi mỗi đơn vị có cùng giá trị, ví dụ các quyển vở có cùng giá.',
    steps: ['Kiểm tra điều kiện: cùng loại, cùng đơn giá hoặc cùng năng suất.', 'Lấy giá trị đã biết chia số đơn vị để tìm giá trị của một đơn vị.', 'Nhân với số đơn vị cần tìm; nếu cần tìm số đơn vị thì lấy tổng giá trị chia giá trị một đơn vị.'],
    examples: [{ problem: '5 quyển vở cùng loại giá 40 000 đồng. Mua 8 quyển hết bao nhiêu? Có 56 000 đồng mua được bao nhiêu quyển?', solution: ['Giá một quyển: 40 000 : 5 = 8 000 (đồng).', 'Giá 8 quyển: 8 000 × 8 = 64 000 (đồng).', 'Với 56 000 đồng, số vở mua được: 56 000 : 8 000 = 7 (quyển).'], answer: '8 quyển giá 64 000 đồng; 56 000 đồng mua được 7 quyển.', check: '8 000 × 5 = 40 000 đồng, khớp dữ kiện ban đầu.' }],
    mistake: 'Không áp dụng máy móc nếu đơn giá thay đổi khi mua nhiều, hoặc các vật có giá khác nhau.',
  },
  'motion-formula': {
    explanation: 'Vận tốc v cho biết quãng đường đi được trong một đơn vị thời gian. Với chuyển động đều: quãng đường s = vận tốc v × thời gian t.',
    steps: ['Ghi rõ dữ kiện và đại lượng cần tìm: s, v hay t.', 'Đổi thời gian và quãng đường cho phù hợp đơn vị vận tốc.', 'Dùng s = v × t; v = s : t; t = s : v. Nếu có thời gian nghỉ, phân biệt với thời gian đang chuyển động.'],
    examples: [{ problem: 'Xe đi đều với vận tốc 40 km/giờ trong 1 giờ 30 phút. Xe đi bao xa?', solution: ['30 phút = 30 : 60 = 0,5 giờ.', 'Thời gian: 1 + 0,5 = 1,5 giờ.', 'Quãng đường: 40 × 1,5 = 60 (km).'], answer: '60 km.', check: '60 : 40 = 1,5 giờ. Hoặc: 1 giờ đi 40 km, nửa giờ đi 20 km, tổng 60 km.' }],
    mistake: 'Không lấy 40 × 1,30. 1 giờ 30 phút là 1,5 giờ. Khi tính vận tốc hoặc thời gian bằng phép chia, số chia phải khác 0.',
  },
  'motion-meet': {
    explanation: 'Hai xe đi về phía nhau thì mỗi giờ khoảng cách giảm bằng tổng quãng đường hai xe đi được. Công thức dùng khi hai xe đi đều, cùng lúc từ hai đầu và hướng về nhau.',
    steps: ['Xác định khoảng cách ban đầu và đổi vận tốc về cùng đơn vị.', 'Tốc độ thu hẹp khoảng cách = vận tốc xe thứ nhất + vận tốc xe thứ hai.', 'Thời gian gặp = khoảng cách ban đầu : tổng vận tốc. Nếu hỏi giờ gặp, cộng thời gian đi vào giờ xuất phát.'],
    examples: [{ problem: 'Lúc 8 giờ, hai xe xuất phát từ A và B cách nhau 120 km, đi về phía nhau với vận tốc 50 và 30 km/giờ. Khi nào gặp?', solution: ['Mỗi giờ hai xe thu hẹp khoảng cách: 50 + 30 = 80 (km).', 'Thời gian gặp: 120 : 80 = 1,5 giờ = 1 giờ 30 phút.', 'Giờ gặp: 8 giờ + 1 giờ 30 phút = 9 giờ 30 phút.'], answer: 'Gặp lúc 9 giờ 30 phút.', check: 'Xe thứ nhất đi 50 × 1,5 = 75 km; xe thứ hai đi 30 × 1,5 = 45 km; 75 + 45 = 120 km.' }],
    mistake: 'Không lấy hiệu vận tốc khi hai xe đang đi về phía nhau. Nếu xuất phát khác giờ, cần tính lại khoảng cách tại lúc cả hai cùng bắt đầu di chuyển.',
  },
  'motion-catch': {
    explanation: 'Hai xe cùng chiều: xe sau chỉ đuổi kịp nếu nhanh hơn xe trước. Mỗi giờ, khoảng cách giảm bằng hiệu hai vận tốc.',
    steps: ['Xác định khoảng cách giữa hai xe tại lúc bắt đầu tính thời gian đuổi.', 'Tốc độ rút ngắn khoảng cách = vận tốc xe sau − vận tốc xe trước.', 'Thời gian đuổi kịp = khoảng cách : hiệu vận tốc.'],
    examples: [
      { problem: 'Xe trước cách xe sau 20 km. Hai xe đi cùng chiều với vận tốc lần lượt 40 và 50 km/giờ. Bao lâu xe sau đuổi kịp?', solution: ['Mỗi giờ xe sau rút ngắn: 50 − 40 = 10 (km).', 'Thời gian đuổi: 20 : 10 = 2 (giờ).'], answer: 'Sau 2 giờ kể từ lúc bắt đầu đuổi.', check: 'Xe sau đi 100 km; xe trước đi thêm 80 km. Tính cả 20 km đi trước thì 20 + 80 = 100 km.' },
      { problem: 'Xe đạp đi trước 30 phút với vận tốc 12 km/giờ. Xe máy cùng điểm xuất phát đuổi theo với vận tốc 36 km/giờ. Sau bao lâu xe máy đuổi kịp?', solution: ['Đổi 30 phút = 0,5 giờ. Khoảng cách khi xe máy xuất phát: 12 × 0,5 = 6 (km).', 'Hiệu vận tốc: 36 − 12 = 24 (km/giờ).', 'Thời gian đuổi: 6 : 24 = 0,25 giờ = 15 phút.'], answer: '15 phút sau khi xe máy xuất phát.', check: 'Xe máy đi 36 × 0,25 = 9 km. Xe đạp đi tổng 0,75 giờ: 12 × 0,75 = 9 km.' },
    ],
    mistake: 'Thời gian đuổi tính từ lúc xe sau xuất phát. Nếu xe sau không nhanh hơn, khoảng cách ban đầu dương sẽ không giảm về 0.',
  },
} satisfies Record<string, TipLesson>
