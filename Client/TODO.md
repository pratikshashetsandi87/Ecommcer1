# TODO: Fix 401 Error on Create Category (Updated Plan)

## Steps from Analysis:
- [x] Analyzed frontend/backend files: Confirmed backend uses `/api/auth/category/create-category`
- [x] Frontend api.js calls `/category/create-category` → resolves to `/api/category/create-category` (❌ **Wrong path!**)
- [x] Login.js hardcoded URL gets 404 (path correct, likely Render sleep)

## Implementation Steps:
- [ ] 1. Fix api.js: Update category endpoints to `/auth/category/create-category`
- [ ] 2. Update Login.js to use api instance (consistent token handling)
- [ ] 3. Update TODO after fixes
- [ ] 4. Test: npm start, login as admin, create category
- [ ] 5. Backend local run if needed: `cd ../Server && npm i && npm start`

**Next**: Edit src/api.js category calls + Login.js
