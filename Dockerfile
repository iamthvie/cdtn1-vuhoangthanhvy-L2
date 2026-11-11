FROM node:20-alpine

WORKDIR /app

# Sao chép file khóa để tận dụng cache
COPY package.json package-lock.json ./

# Cài đặt đầy đủ dependencies (bao gồm cả devDependencies nếu cần chạy test)
RUN npm install

# Sao chép mã nguồn ứng dụng
COPY src/ ./src/

# Sử dụng user non-root để đảm bảo bảo mật
USER node

EXPOSE 3000

CMD ["node", "src/index.js"]

# Sao chép mã nguồn ứng dụng
COPY src/ ./src/

# Sao chép thư mục chứa file giao diện tĩnh (HTML/CSS)
COPY public/ ./public/