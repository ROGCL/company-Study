import Axios from "axios";
export function checkVersion(){
  Axios.get(`./version.json?t${new Date().getTime()}`).then((res) => {
    if (res.data && res.data.v) {
      const version = res.data.v
      const localVersion = localStorage.getItem("version");
      if (localVersion != version) {
        localStorage.setItem("version", version);
        window.location.reload();
      }
    }
  });
}