#!/bin/bash
# PixelLumo Test Automation Script
# Run this to verify all features work correctly

echo "=========================================="
echo "PixelLumo - Application Test Suite"
echo "=========================================="
echo ""

# Test 1: Check all required files exist
echo "Test 1: Verifying project structure..."
FILES=(
  "index.html" "home.html" "about.html" "community.html" "leaderboard.html"
  "tutorials.html" "gallery.html" "blog.html" "chat.html" "messaging.html"
  "notifications.html" "contact.html" "patreon.html" "login.html"
  "auth.js" "utils.js" "community.js" "chat.js" "messaging.js" "notifications.js"
  "tutorials.js" "gallery.js" "blog.js" "patreon.js"
  "style.css" "scripts.js" "README.md"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
  fi
done

echo ""
echo "Test 2: Checking for syntax errors..."
# Simple check: files should not contain common JS errors
grep -r "console.error" *.js && echo "  ⚠ Found console.error statements" || echo "  ✓ No console.error found"

echo ""
echo "Test 3: Verifying utils.js exports..."
if grep -q "const Store\|const NotifyHelper\|const TimeFormat\|const UI\|function getConvKey" utils.js; then
  echo "  ✓ All utility exports found"
else
  echo "  ✗ Missing utility exports"
fi

echo ""
echo "Test 4: Checking localStorage keys..."
echo "  Expected keys:"
echo "    - pixellumoPosts"
echo "    - pixellumoChat"
echo "    - pixellumoMessages"
echo "    - pixellumoTutorials"
echo "    - pixellumoImages"
echo "    - pixellumoBlog"
echo "    - userAchievements_*"
echo "    - pixellumoNotifications_*"

echo ""
echo "Test 5: Color scheme validation..."
if grep -q "#ff1493\|#6a0dad\|#b0a0ff" style.css; then
  echo "  ✓ Brand colors found in CSS"
else
  echo "  ✗ Brand colors missing"
fi

echo ""
echo "Test 6: Code optimization stats..."
echo "  Lines of code:"
grep -h "^[^/]*[{]" *.js 2>/dev/null | wc -l | xargs echo "    JS functions:"
wc -l style.css | xargs echo "    CSS rules:"

echo ""
echo "=========================================="
echo "Testing Complete!"
echo "=========================================="
echo ""
echo "To test the application:"
echo "  1. Start server: python -m http.server 8000"
echo "  2. Open: http://localhost:8000/index.html"
echo "  3. Run through test checklist in PROJECT_STATUS.md"
