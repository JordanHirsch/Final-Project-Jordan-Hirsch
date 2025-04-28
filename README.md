# Web Development Final Project - Fitness Freaks

Submitted by: Jordan Hirsch

This web app: This web app is designed for fellow gym-lovers to talk about anything fitness related!!
Time spent: 16 hours

## Required Features

The following **required** functionality is completed:


- [X] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [X] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [X] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [X] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [X] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:


- [X] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [ ] Users can add more characterics to their posts
  - Users can share and view web videos
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
  - Users can upload images directly from their local machine as an image file
- [ ] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [ ] List anything else that you added to improve the site's functionality!

## Video Walkthrough

Here's a walkthrough of implemented user stories:

![Gym](https://github.com/user-attachments/assets/1dd0877a-dab0-4fe6-8520-4b72a91fd936)


[Kap](https://getkap.co/) for macOS

## Notes

Describe any challenges encountered while building the app.

- Directory & file path confusion: Running node test-connection.js in the wrong folder, missing or mis-named files, mis-imported modules in models/index.js.

- Database setup hiccups: “Unknown database” errors until we aligned our .env and MySQL Workbench settings.

- 404/“Cannot GET/POST /api/posts”: Express routes not matching due to wrong base URL or missing authentication middleware.

- JWT/token woes: Invalid/malformed signature errors when signing/verifying tokens, forgetting to attach the Authorization header, then hard-coding full URLs bypassing axios.defaults.

- Upvote logic: Needed to enforce one-click toggle (add/remove) rather than unlimited increments.

- Comment-posting failures: Hard-coded localhost calls bypassed baseURL and JWT, leading to 401/404 until switched to relative /api paths.

- Tailwind/PostCSS build errors: Mis-configured plugin usage, missing @tailwindcss/postcss, causing build failures.

- Background image loading: Webpack couldn’t resolve assets in public/ from CSS, requiring moving the image into src/assets/.

- NavBar state: Logout button only showing on hover or not at all until we derived isLoggedIn fresh from localStorage and unified menu-item styling.

- Styling iterations: Switching in custom fonts, gym-themed colors, light/dark experiments, then rolling back to stable CSS.

Still cannot start Netlify after trying for a few hours. extremely confused, will continue trying again tomorrow even if it is not worth anything for project...
=======
# final-project-JordanHirsch
final-project-JordanHirsch created by GitHub Classroom
>>>>>>> 630e460 (Create README.md)
