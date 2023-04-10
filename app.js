const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#search + button");
const userName = document.querySelector("#username");
const userAvatar = document.querySelector("#avatar");
const userFollowers = document.querySelector("#followers");
const userFollowing = document.querySelector("#following");
const userPublicRepos = document.querySelector("#public-repos");
const userCompany = document.querySelector("#company");
const userLocation = document.querySelector("#location");
const userProfileLink = document.querySelector("#profile-link");
const info = document.querySelector("#info");
const reposContainer = document.querySelector("#repos");
const pagination = document.querySelector("#pagination");
const CLIENT_ID = "00846d991c108086334f";
const CLIENT_SECRET = "70790f0f99edc910a3b36767dbc9d18ccbd0e4de";

const displayReposData = (pageNumber, repos) => {
  reposContainer.innerHTML = "";
  pagination.innerHTML = "";
  const pagesAmount = Math.ceil(repos.length / 6);
  const start = (pageNumber - 1) * 6;
  repos
    .slice(start, start + 6)
    .forEach(({ name, language, html_url, forks_count, stargazers_count }) => {
      const repo = `<a class="repo" href="${html_url}" target="_blank">
    <header>
      <i class="fa-regular fa-folder"></i>
      <h4>${name}</h4>
    </header>
    <footer>
      <div class="status">
        <span class="icon">
          <i class="fa-regular fa-star"></i>
        </span>
        <span class="number">${stargazers_count}</span>
      </div>
      <div class="status">
        <span class="icon">
          <i class="fa-solid fa-code-branch"></i>
        </span>
        <span class="number">${forks_count}</span>
      </div>
      <div class="language">
        <span class="color" style="background-color: ${
          languageColors[language]
        };"></span>
        ${language ?? "Desconhecido"}
      </div>
    </footer>
  </a>`;
      reposContainer.innerHTML += repo;
    });

  if (pagesAmount === 1) return;

  for (let i = 1; i <= pagesAmount; i++) {
    const page = document.createElement("button");
    page.classList.add("page-number", pageNumber === i ? "active" : "default");
    page.addEventListener("click", () => displayReposData(i, repos));
    page.textContent = i;
    pagination.append(page);
  }
};

const displayProfileData = ({
  login,
  avatar_url,
  followers,
  following,
  public_repos,
  company,
  location,
  html_url,
}) => {
  userName.textContent = login;
  userAvatar.src = avatar_url;
  userFollowers.textContent = followers;
  userFollowing.textContent = following;
  userPublicRepos.textContent = public_repos;
  userCompany.textContent = company ?? "Não informado";
  userLocation.textContent = location ?? "Não informado";
  userProfileLink.classList.remove("hide");
  userProfileLink.href = html_url;
};

const removeNotFoundError = () => {
  info.querySelector("ul").classList.remove("hide");
  info.querySelector("#not-found-img").remove();
  userProfileLink.classList.remove("hide");
};

const displayNotFoundError = () => {
  userName.textContent = "Usuário não encontrado";
  userAvatar.src =
    "https://cdn3.iconfinder.com/data/icons/flat-pro-user-management-set-4/32/user-unknown-512.png";

  const notFoundImage =
    '<img id="not-found-img" width="100" height="100" class="not-found-img" src="https://icon-library.com/images/404-error-icon/404-error-icon-6.jpg" />';
  info.innerHTML += notFoundImage;
  info.querySelector("ul").classList.add("hide");
  userProfileLink.classList.add("hide");
  reposContainer.innerHTML =
    '<p class="repos-not-found">Nenhum repositório encontrado</p>';
  pagination.innerHTML = "";
};

const orderRepos = (a, b) => {
  const starsCompare = b.stargazers_count - a.stargazers_count;
  if (starsCompare !== 0) return starsCompare;

  const createdAtA = new Date(a.created_at);
  const createdAtB = new Date(b.created_at);
  return createdAtB - createdAtA;
};

const removeLoaders = () => {
  const loaders = document.querySelectorAll(".lazy-loading");
  loaders.forEach((loader) => loader.classList.remove("lazy-loading"));
};

const activeLoading = () => {
  const loader =
    '<img id="loader" class="loader" width="75" height="75" src="https://manifestoglauber.com.br/frontend/assets/images/loader.gif" />';
  reposContainer.innerHTML = loader;
};

const searchUser = async (username) => {
  if (!username) return;
  activeLoading();

  try {
    const [responseProfileData, responseReposData] = await Promise.all([
      fetch(
        `https://api.github.com/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      ),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=created:ascclient_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      ),
    ]);

    if (!responseProfileData.ok) throw new Error(responseProfileData.status);

    const profileData = await responseProfileData.json();
    const reposData = await responseReposData.json();
    const orderedRepos = [...reposData].sort(orderRepos);

    if (info.querySelector("#not-found-img")) removeNotFoundError();
    displayProfileData(profileData);
    displayReposData(1, orderedRepos);
    searchInput.value = "";
    searchInput.focus();
  } catch (error) {
    console.log(error.message);
    if (error.message === "404") {
      displayNotFoundError();
    }
  } finally {
    removeLoaders();
  }
};

searchInput.addEventListener("keydown", ({ key }) => {
  if (key === "Enter") searchUser(searchInput.value);
});
searchButton.addEventListener("click", () => searchUser(searchInput.value));
searchUser("JohnPetros");

const languageColors = {
  ABAP: "#E8274B",
  ActionScript: "#882B0F",
  Ada: "#02f88c",
  Agda: "#315665",
  "AGS Script": "#B9D9FF",
  Alloy: "#64C800",
  AMPL: "#E6EFBB",
  ANTLR: "#9DC3FF",
  "API Blueprint": "#2ACCA8",
  APL: "#5A8164",
  Arc: "#aa2afe",
  Arduino: "#bd79d1",
  ASP: "#6a40fd",
  AspectJ: "#a957b0",
  Assembly: "#6E4C13",
  ATS: "#1ac620",
  AutoHotkey: "#6594b9",
  AutoIt: "#1C3552",
  BlitzMax: "#cd6400",
  Boo: "#d4bec1",
  Brainfuck: "#2F2530",
  "C Sharp": "#178600",
  C: "#555555",
  Chapel: "#8dc63f",
  Cirru: "#ccccff",
  Clarion: "#db901e",
  Clean: "#3F85AF",
  Click: "#E4E6F3",
  Clojure: "#db5855",
  CoffeeScript: "#244776",
  "ColdFusion CFC": "#ed2cd6",
  ColdFusion: "#ed2cd6",
  "Common Lisp": "#3fb68b",
  "Component Pascal": "#b0ce4e",
  cpp: "#f34b7d",
  Crystal: "#776791",
  CSS: "#563d7c",
  D: "#ba595e",
  Dart: "#00B4AB",
  Diff: "#88dddd",
  DM: "#447265",
  Dogescript: "#cca760",
  Dylan: "#6c616e",
  E: "#ccce35",
  Eagle: "#814C05",
  eC: "#913960",
  ECL: "#8a1267",
  edn: "#db5855",
  Eiffel: "#946d57",
  Elixir: "#6e4a7e",
  Elm: "#60B5CC",
  "Emacs Lisp": "#c065db",
  EmberScript: "#FFF4F3",
  Erlang: "#B83998",
  "F#": "#b845fc",
  Factor: "#636746",
  Fancy: "#7b9db4",
  Fantom: "#dbded5",
  FLUX: "#88ccff",
  Forth: "#341708",
  FORTRAN: "#4d41b1",
  FreeMarker: "#0050b2",
  Frege: "#00cafe",
  "Game Maker Language": "#8fb200",
  Glyph: "#e4cc98",
  Gnuplot: "#f0a9f0",
  Go: "#375eab",
  Golo: "#88562A",
  Gosu: "#82937f",
  "Grammatical Framework": "#79aa7a",
  Groovy: "#e69f56",
  Handlebars: "#01a9d6",
  Harbour: "#0e60e3",
  Haskell: "#29b544",
  Haxe: "#df7900",
  HTML: "#e44b23",
  Hy: "#7790B2",
  IDL: "#a3522f",
  Io: "#a9188d",
  Ioke: "#078193",
  Isabelle: "#FEFE00",
  J: "#9EEDFF",
  Java: "#b07219",
  JavaScript: "#f1e05a",
  JFlex: "#DBCA00",
  JSONiq: "#40d47e",
  Julia: "#a270ba",
  "Jupyter Notebook": "#DA5B0B",
  Kotlin: "#F18E33",
  KRL: "#28431f",
  Lasso: "#999999",
  Latte: "#A8FF97",
  Lex: "#DBCA00",
  LFE: "#004200",
  LiveScript: "#499886",
  LOLCODE: "#cc9900",
  LookML: "#652B81",
  LSL: "#3d9970",
  Lua: "#000080",
  Makefile: "#427819",
  Mask: "#f97732",
  Matlab: "#bb92ac",
  Max: "#c4a79c",
  MAXScript: "#00a6a6",
  Mercury: "#ff2b2b",
  Metal: "#8f14e9",
  Mirah: "#c7a938",
  MTML: "#b7e1f4",
  NCL: "#28431f",
  Nemerle: "#3d3c6e",
  nesC: "#94B0C7",
  NetLinx: "#0aa0ff",
  "NetLinx+ERB": "#747faa",
  NetLogo: "#ff6375",
  NewLisp: "#87AED7",
  Nimrod: "#37775b",
  Nit: "#009917",
  Nix: "#7e7eff",
  Nu: "#c9df40",
  "Objective-C": "#438eff",
  "Objective-C++": "#6866fb",
  "Objective-J": "#ff0c5a",
  OCaml: "#3be133",
  Omgrofl: "#cabbff",
  ooc: "#b0b77e",
  Opal: "#f7ede0",
  Oxygene: "#cdd0e3",
  Oz: "#fab738",
  Pan: "#cc0000",
  Papyrus: "#6600cc",
  Parrot: "#f3ca0a",
  Pascal: "#b0ce4e",
  PAWN: "#dbb284",
  Perl: "#0298c3",
  Perl6: "#0000fb",
  PHP: "#4F5D95",
  PigLatin: "#fcd7de",
  Pike: "#005390",
  PLSQL: "#dad8d8",
  PogoScript: "#d80074",
  Processing: "#0096D8",
  Prolog: "#74283c",
  "Propeller Spin": "#7fa2a7",
  Puppet: "#302B6D",
  "Pure Data": "#91de79",
  PureBasic: "#5a6986",
  PureScript: "#1D222D",
  Python: "#3572A5",
  QML: "#44a51c",
  R: "#198ce7",
  Racket: "#22228f",
  "Ragel in Ruby Host": "#9d5200",
  RAML: "#77d9fb",
  Rebol: "#358a5b",
  Red: "#ee0000",
  "Ren'Py": "#ff7f7f",
  Rouge: "#cc0088",
  Ruby: "#701516",
  Rust: "#dea584",
  SaltStack: "#646464",
  SAS: "#B34936",
  Scala: "#DC322F",
  Scheme: "#1e4aec",
  Self: "#0579aa",
  Shell: "#89e051",
  Shen: "#120F14",
  Slash: "#007eff",
  Slim: "#ff8f77",
  Smalltalk: "#596706",
  SourcePawn: "#5c7611",
  SQF: "#3F3F3F",
  Squirrel: "#800000",
  Stan: "#b2011d",
  "Standard ML": "#dc566d",
  SuperCollider: "#46390b",
  Swift: "#ffac45",
  SystemVerilog: "#DAE1C2",
  Tcl: "#e4cc98",
  TeX: "#3D6117",
  Turing: "#45f715",
  TypeScript: "#2b7489",
  "Unified Parallel C": "#4e3617",
  "Unity3D Asset": "#ab69a1",
  UnrealScript: "#a54c4d",
  Vala: "#fbe5cd",
  Verilog: "#b2b7f8",
  VHDL: "#adb2cb",
  VimL: "#199f4b",
  "Visual Basic": "#945db7",
  Volt: "#1F1F1F",
  Vue: "#2c3e50",
  "Web Ontology Language": "#9cc9dd",
  wisp: "#7582D1",
  X10: "#4B6BEF",
  xBase: "#403a40",
  XC: "#99DA07",
  XQuery: "#5232e7",
  Zephir: "#118f9e",
};
