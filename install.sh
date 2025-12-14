#!/bin/bash

echo "========================================"
echo "  AI Content Generator - Installation"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "Node.js found: $(node -v)"
echo ""

echo "Installing server dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install server dependencies"
    exit 1
fi

echo ""
echo "Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install client dependencies"
    exit 1
fi
cd ..

echo ""
echo "========================================"
echo "  Installation Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Add your OpenAI API key to .env"
echo "3. Run: npm run dev"
echo ""
