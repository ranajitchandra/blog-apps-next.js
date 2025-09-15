# My Blog App

A full-featured **Next.js blog application** with **NextAuth authentication**, **MongoDB database**, **admin dashboard**, and **category-based posts**. Users can browse posts, authors can create posts, and admins can manage users, posts, and categories.  

---

## Features

### Public Features
- View all blog posts with pagination.
- View post details.
- Filter posts by category.
- Search posts by title/content (optional to implement).
- Responsive UI with TailwindCSS.
- Loading indicators and error handling.

### User / Author Features
- Register and login via **NextAuth**.
- Authors can create, edit, and delete their own posts.
- Authors have access to a **dashboard** showing their posts.

### Admin Features
- Manage all posts (view, edit, delete).
- Manage categories (add, edit, delete).
- Manage users (view roles, delete users if necessary).
- Access to admin dashboard (`/admin` routes).
- Role-based access control via middleware.

### Post Features
- Title, content, and category assignment.
- Featured image support.
- URL-friendly slug generation.
- Likes (optional to implement).
- Published/unpublished posts.

### Tech Stack
- **Next.js 15** (App Router, React 19)
- **NextAuth.js** for authentication
- **MongoDB** for database
- **TailwindCSS** for styling
- **SweetAlert2** for alerts and confirmations
- **Vercel** for deployment

---

## Project Structure

/app
/api
/auth/[...nextauth]/route.js
/posts/route.js
/posts/[id]/route.js
/posts/with-categories/route.js
/admin/users/[id]/route.js
/admin
/dashboard/page.jsx
/posts/page.jsx
/categories/page.jsx
/dashboard/page.jsx
/create-post/page.jsx
/lib
mongodb.js
/components
Navbar.js
Loading.js




