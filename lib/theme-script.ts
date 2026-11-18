/**
 * Runs before paint so the stored theme (or, failing that, the system one) is
 * applied without a flash. Light is the default in the static HTML.
 */
export const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
