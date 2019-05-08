/**
 * Load raw html from url
 * @param {string} url
 * @returns {Promise<string>}
 */
const load = async (url) => {
  const req = await fetch(url);
  const html = await req.text();
  return html;
};

export default load;
