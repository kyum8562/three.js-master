import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js";
// import SceanInit from "../examples/jsm/libs/"

function App() {
	const divContainer = document.querySelector("#webgl-container");

	const scene = new THREE.Scene();
	const glftLoader = new GLTFLoader();
	glftLoader.load("./haru_finish.gltf", (el) => {
		scene.add(el.scene);
	});
}
window.onload = function () {
	App();
};
