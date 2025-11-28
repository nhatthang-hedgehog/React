# My Fruit Shop React

Dự án **My Fruit Shop** là một ứng dụng web bán trái cây được xây dựng bằng **React**.
Ứng dụng này cung cấp giao diện quản lý sản phẩm, giỏ hàng, chi tiết sản phẩm và các tương tác trực quan.

---

## 🔹 Công nghệ sử dụng

* React 18.x
* JavaScript / TypeScript
* Node.js & NPM / Yarn
* HTML, CSS, SCSS
* React Router, Redux , Next.js 

---

## 🔹 Cài đặt

1. Clone repository:

```bash
git clone https://github.com/nhatthang-hedgehog/Project.git
cd Project
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc nếu dùng yarn
yarn install
```

3. Chạy ứng dụng trong môi trường development:

```bash
npm start
# hoặc
yarn start
```

Mở trình duyệt: [http://localhost:3000](http://localhost:3000)

---

## 🔹 Cấu trúc thư mục chính

```
Project/
├── src/                 # Source code React
│   ├── components/      # Component UI
│   ├── pages/           # Page-level components (Next.js)
│   ├── context/         # Context API (nếu dùng)
│   ├── redux/           # Redux store & slices (nếu dùng)
│   └── assets/          # Hình ảnh và tài nguyên
├── public/              # Tài nguyên tĩnh
├── node_modules/        # Packages (ignored)
├── .next/               # Build folder Next.js (ignored)
├── dist/                # Build output (ignored)
├── package.json
├── README.md
└── .gitignore
```

---

## 🔹 Quy tắc Git

* Không commit các thư mục `node_modules`, `.next`, `dist`, hoặc file `.env`.
* Sử dụng `.gitignore` để tránh commit file lớn hoặc nhạy cảm.
* Nếu cần push file lớn, sử dụng **Git LFS**.

---

## 🔹 Hướng dẫn build và deploy

```bash
npm run build
# hoặc
yarn build
```

* Build ra thư mục `build/` hoặc `.next/`
* Triển khai lên Vercel, Netlify, GitHub Pages, hoặc server tùy chọn.

---

## 🔹 Liên hệ

* GitHub: [nhatthang-hedgehog](https://github.com/nhatthang-hedgehog)
