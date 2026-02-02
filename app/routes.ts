import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  //Main layout
  layout("./layouts/HomeLayout.tsx", [
    //Home route
    index("./routes/home.tsx"),

    //Privacy policy
    route("privacy-policy", "./routes/privacyPolicy.tsx"),
  ]),

  //Login route
  route("/login", "./routes/login.tsx"),

  //Feedback form handle (From clients)
  route("/feedback", "./routes/feedbackFormSubmissionHandle.ts"),

  //Process request for a service
  route("/service/request", "./routes/processServiceRequest.ts"),

  route("robots.txt", "./routes/robots.txt.ts"),

  route("sitemap.xml", "./routes/sitemap.xml.ts"),

  //Admin routes
  ...prefix("/admin", [
    layout("./layouts/AdminLayout.tsx", [
      //Index route (Display pending requests)
      index("./routes/admin.tsx"),
      //(Completed requests)
      route("requests/completed", "./routes/completedRequests.tsx"),

      //Logout
      route("logout", "./routes/logout.ts"),

      //Services
      route("services", "./routes/adminServices.tsx", [
        //Selected service route
        route(
          ":selectedServiceCategory",
          "./routes/adminSelectedServiceCategory.tsx",
          [
            //Rename selected category
            route("rename", "./routes/adminSelectedServiceCategoryRename.tsx"),

            //Delete selected category
            route("delete", "./routes/adminSelectedServiceCategoryDelete.ts"),

            //Add new service in category
            route("new", "./routes/adminSelectedServiceCategoryNewService.tsx"),

            //Delete service in category
            route(
              ":itemId/delete",
              "./routes/adminSelectedServiceCategoryContentItemDelete.ts",
            ),
          ],
        ),

        //Rename selected service item
        route(
          ":selectedServiceCategory/:selectedServiceCategoryItem/change",
          "./routes/adminSelectedServiceCategoryContentItemChange.tsx",
        ),
      ]),

      //Gallery
      route("gallery", "./routes/adminGallery.tsx", [
        //Selected gallery route
        route(
          ":selectedGalleryCategory",
          "./routes/adminSelectedGalleryCategory.tsx",
          [
            //Rename selected category
            route("rename", "./routes/adminSelectedGalleryCategoryRename.tsx"),

            //Delete selected category
            route("delete", "./routes/adminSelectedGalleryCategoryDelete.ts"),

            //Add new images in category
            route("new", "./routes/adminSelectedGalleryCategoryNewImages.tsx"),

            //Delete image from category
            route(
              ":image/delete",
              "./routes/adminSelectedGalleryCategoryDeleteImage.ts",
            ),
          ],
        ),
      ]),

      //Contact info
      route("contact", "./routes/adminContact.tsx"),

      //Feedback (Unred)
      route("feedback/unred", "./routes/adminFeedbackUnred.tsx"),
      //Feedback (Red)
      route("feedback/red", "./routes/adminFeedbackRed.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
