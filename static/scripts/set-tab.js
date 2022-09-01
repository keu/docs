(function () {
  const querystring = window.location.search;
  if (!querystring) {
    return;
  }

  const entries = querystring
    .slice(1)
    .split("&")
    .reduce((entries, str) => {
      const [key, value] = str.split("=").map((v) => decodeURIComponent(v));
      entries[key] = value;
      return entries;
    }, {});

  // for app dev guide
  if (typeof entries.tab === "string") {
    const tab = entries.tab.toLowerCase();
    window.localStorage.setItem(`docusaurus.tab.${groupId}`, tab);
    }
  }
})();
