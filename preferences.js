const setPreference = (preference) => {
  document.cookie = `comicSansAppreciation=${preference ? "true" : "false"}`;
};

const getCookie = (name) => {
  function escape(s) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1");
  }
  let match = document.cookie.match(
    RegExp("(?:^|;\\s*)" + escape(name) + "=([^;]*)")
  );
  return match ? match[1] : null;
};

const getPreference = () =>
  getCookie("comicSansAppreciation") == "true" ? true : false;
const setButtonText = (preference) =>
  (document.getElementById("urlSubmit").innerText = preference
    ? "Make it beautiful"
    : "Ruin it");
const onCheckboxChange = (ele) => {
  setPreference(ele.checked);
  setButtonText(ele.checked);
};

if (getPreference()) {
  setButtonText(true);
  document.querySelector('input[name="comicSansCheckbox"]').checked = true;
}
