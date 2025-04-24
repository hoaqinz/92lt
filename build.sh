#!/bin/bash

# Xóa package-lock.json nếu tồn tại
rm -f package-lock.json

# Cài đặt dependencies với --force
npm install --force

# Build dự án
npm run build
