# TODO: Fix Home.js "No token found" error

**Approved Plan Steps:**
1. [x] Create TODO.md with steps 
2. [x] Update src/Pages/Home.js:
   - Add import { useAuth } from "../Context/auth";
   - Add const { auth } = useAuth(); near other hooks.
   - Modify useEffect(() => { if(auth?.token){ getAllCategory(); } getTotal(); getAllProducts(); }, [auth?.token]);
3. [x] Verify changes applied (Home.js updated successfully)
4. [x] Task complete

**Progress:** Starting edits...

