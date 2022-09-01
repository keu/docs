(function () {
  const querystring = window.location.search;
  if (!querystring) {
    return;
  }
  // pull groupId from anchor text, which should be equivalent
  const getAnchor = querystring.split("#");
  const groupId = getAnchor[1];

  const entries = querystring
    .slice(1)
    .split("&")
    .reduce((entries, str) => {
      const [key, value] = str.split("=").map((v) => decodeURIComponent(v));
      entries[key] = value;
      return entries;
    }, {});
  if (typeof entries.tab === "string") {
    const tab = entries.tab.toLowerCase();
    window.localStorage.setItem(`docusaurus.tab.${groupId}`, tab);
    }
  }
})();
