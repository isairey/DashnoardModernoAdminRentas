#!/bin/bash

# Email Verification System - Installation Script
# This script installs and configures the email verification system

echo "🚀 Installing Email Verification System..."
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Install nodemailer
echo "📦 Installing nodemailer..."
npm install nodemailer

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please edit .env and configure your SMTP settings:"
    echo "   - SMTP_HOST"
    echo "   - SMTP_PORT"
    echo "   - SMTP_USER"
    echo "   - SMTP_PASS"
    echo "   - EMAIL_FROM"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Edit .env and configure SMTP settings"
echo "   2. Run: npm run dev"
echo "   3. Test registration: POST /api/auth/register"
echo "   4. Check console for verification code"
echo "   5. Test verification: POST /api/email-verification/verify"
echo ""
echo "📖 Documentation:"
echo "   - EMAIL_VERIFICATION_SYSTEM.md - Complete documentation"
echo "   - EMAIL_VERIFICATION_SETUP.md - Quick setup guide"
echo "   - EMAIL_VERIFICATION_ARCHITECTURE.md - Architecture details"
echo ""
echo "🎉 Happy coding!"
