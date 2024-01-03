##CHUỖI HỆ THỐNG NHÀ SÁCH

##Mô Tả
Dự án này là dự được build cho hệ thống nhà sách POS (nền tảng khảo sát dựa trên kiotviet.vn)

##Yêu Cầu Cần Có
Node.js (Nodev16)
MongoDB (Nhóm tụi em sử dụng Mongo Atlas)
Một trình duyệt web hiện đại (ví dụ: Chrome, Firefox, Edge)

##Cài Đặt
Chạy npm install hoặc yarn install để cài đặt tất cả các phụ thuộc cần thiết.

##Khởi Chạy Máy Chủ
Trong thư mục dự án, chạy máy chủ bằng cách sử dụng node server.js hoặc npm start hoặc yarn start
Máy chủ sẽ bắt đầu và lắng nghe ở cổng 3000 hoặc 3001 được định nghĩa trong file .env

##Tài khoản Có Sẵn để Đánh giá
Chúng tôi đã thiết lập các tài khoản sau đây có sẵn chứa dữ liệu để hỗ trợ quá trình đánh giá:

##Truy Cập Ứng Dụng
Mở một trình duyệt web.

Thông tin đăng nhập để truy cập server (nếu có):
	+ Với chạy với localhost: Truy cập http://localhost:port để sử dụng ứng dụng.
	+ Với link deploy: Truy cập https://bookstore-xbz5.onrender.com để sử dụng ứng dụng.
Tên người dùng: 
	+ Với admin: 
		-> Username: admin
		-> Password: admin
	+ Với sale: 
		-> Username: Duane52
		-> Password: abc123@
Sau khi đăng nhập với admin có thể tạo 1 tài khoản SALE để sử dụng

##ENV - The environment example file
SECRET_SESSION=secret
PORT=3001
DB_URI=mongodb+srv://nodejsfinal:RtFYY7qDDrke9WXv@nodejsfinal.9e8oasr.mongodb.net/PhoneSalePersonDatabase?retryWrites=true&w=majority
SECRET_KEY=PHUVINH123
HOST=http://localhost:3001/
FIREBASE_API_KEY=AIzaSyDKljgDwERiDIMY6AAjcNkaJ79rfI7Kv3A
AUTH_DOMAIN=phonesaleperson.firebaseapp.com
PROJECT_ID=phonesaleperson
STORAGE_BUCKET=phonesaleperson.appspot.com
SENDER_ID=961386332024
APP_ID=1:961386332024:web:11447ed3d15658549e528d