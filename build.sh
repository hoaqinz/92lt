#!/bin/bash

# Cài đặt dependencies với npm install thay vì npm ci
export CI=false
export NPM_CONFIG_LEGACY_PEER_DEPS=true
export NPM_CONFIG_FORCE=true

# Cài đặt dependencies
npm install --force --legacy-peer-deps

# Build dự án
npm run build
