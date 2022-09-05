## Notes and Ideas

### Schedules


 * show list of schedules with last runs
   * ✅ show wall assembly info
   * show schedule parameters
 * run button


---

## Todo

* add key for li items
* schedules page
* 


---

 * ✅ rearrange schedule parameters
 * ✅ set defaults for new schedule
 * ✅ show wall assembly info in schedule parameters
 * ✅ seismic options - show max z/h Fp value
 * ✅ vertical presentation of stud sizes and design type checkboxes
 * ✅ fix interior schedules being reset on load of Interior Schedules page
 * 🥶 replace select dropdown w/ button dropdown
 * ✅ error, if there is no design criteria and wall assemblies, tell them to do it first
 * ✅ maintain cfs_tools_interior_schedules state
 * ✅ formik form for adding assemblies with dropdown
   * ✅ adding an assembly schedule will add to the state
   *  ✅ removing will remove from state
* ✅ move autosave to utils
* ✅ Save form to file
* ✅ sLoad form from file
* ✅ seismic parameters
* ✅ update page titles
* ✅ Autosave form
* ✅ Load form
* ✅ Simple layout
* ✅ github repo
* ✅ Tailwind CSS
* ✅ deflection criteria for wall assembly

---

## Developing

```
npx tailwindcss -i ./src/styles/globals.css -o ./styles/globals.css --watch

```

---

## Resources

* Forms
  * [Formik](https://github.com/jaredpalmer/formik) - React form components
  * [Formik-Persist-Values](https://github.com/kolengri/formik-persist-values) - Persist form data
  * [Yup](https://github.com/jquense/yup) - Schema validation
  * Formik [sample form](https://codesandbox.io/s/formik-v2-tutorial-final-ge1pt)

---


Welcome to the NextJS base template bootstrapped using the `create-next-app`. This template supports TypeScript, but you can use normal JavaScript as well.

## Getting Started

Hit the run button to start the development server.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on `/api/hello`. This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Productionizing your Next App

To make your next App run smoothly in production make sure to [turn this repl to an always-on repl.](https://docs.replit.com/hosting/enabling-always-on)

You can also produce a production build by running `npm run build` and [changing the run command](https://docs.replit.com/programming-ide/configuring-repl#run) to `npm run start`.
