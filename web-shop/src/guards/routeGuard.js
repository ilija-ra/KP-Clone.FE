// import { router } from "@/router/index.js";
// import store from "@/store";

// // Define a global beforeEnter guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = store.state.authenticated;
//   const userRole = store.state.role;

//   // Check if the route requires authentication
//   if (to.meta.requiresAuth) {
//     // Check if the user is authenticated
//     if (!isAuthenticated) {
//       // If not authenticated, redirect to the login page
//       next("/login");
//     } else {
//       // If authenticated, check if the user has the required role
//       if (to.meta.roles && !to.meta.roles.includes(userRole)) {
//         // If the user does not have the required role, redirect to a 403 page or another appropriate route
//         next("/403");
//       } else {
//         // If authenticated and has the required role, proceed to the route
//         next();
//       }
//     }
//   } else {
//     // If the route does not require authentication, proceed to the route
//     next();
//   }
// });

// export default router;
