import * as THREE from "../build/three.module.js";
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

function App() {
	let _renderer = "";
	let _camera = "";
	let _scene = "";
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
	const divContainer = document.querySelector("#webgl-container");
	//antialias: true -> 3차원 장면이 렌더링 될때, Obj들의 경계선이 계단현상없이 부드럽게 표현
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	});

	divContainer.appendChild(renderer.domElement);
	// 그림자를 사용하기 위한 준비
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// setPixelRatio(window.devicePixelRatio) -> 픽셀 비율(디스플레이 속성, 배율 및 레이아웃 - 텍스트 크기)
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(window.devicePixelRatio);
	_renderer = renderer;

	const scene = new THREE.Scene();
	scene.background = new THREE.Color("#FDE4CF");
	_scene = scene;

	setupCamera();
	setupLight();
	setupModel();
	setupControls();

	// 창 크기가 변경될 때, App을 바인딩 해줌
	window.onresize = resize.bind(this);
	resize();

	// render: 3차원 그래픽을 만들어주는 메서드
	requestAnimationFrame(render.bind(this));

	const textureLoader = new THREE.TextureLoader();
	const alphaShadow = textureLoader.load("./textures/simpleShadow.jpg");

	// const sphereShadow = new THREE.Mesh(
	// 	new THREE.PlaneGeometry(2, 2),
	// 	new THREE.MeshBasicMaterial({
	// 		transparent: true,
	// 		color: 0x000000,
	// 		opacity: 0.9,
	// 		alphaMap: alphaShadow,
	// 	})
	// );

	// sphereShadow.rotation.x = -Math.PI * 0.5;
	// sphereShadow.position.x = 0;
	// sphereShadow.position.y = -1.1;

	// scene.add(sphereShadow);

	function setupControls() {
		new OrbitControls(_camera, divContainer);
	}

	// 카메라의 객체를 생성해주는 메서드
	function setupCamera() {
		const width = divContainer.clientWidth;
		const height = divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.x = -0.35;
		camera.position.y = 0.5;
		camera.position.z = 2.5;

		_camera = camera;
	}

	// 광원의 색상, 세기값을 통해 광원을 생성
	function setupLight() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
		// light.position.set(-2, 1.5, 0.5);
		// light.position.set(-5, 12, 12);
		// light.position.set(60, 100, 20);
		directionalLight.position.set(0, 1, 4);
		directionalLight.castShadow = true;
		// shadowLight.shadowDarkness = 0.1;
		scene.add(directionalLight);
	}

	// 파랑색 계열의 정육면체 mesh를 생성해주는 메서드
	function setupModel() {
		// 캐릭터 설정
		const glftLoader = new GLTFLoader();
		glftLoader.load("tori_finish.gltf", (el) => {
			el.scene.position.x = 0.2;
			el.scene.position.y = 0.3;
			el.scene.position.z = 2;
			// 옆면: -0.7 정면: -0.4
			el.scene.rotation.y = -0.6;
			el.scene.rotation.x = 0.1;

			scene.add(el.scene);
			// el.scene.castShadow = true;

			// 부모 요소에는 castShadow가 true이지만 자식요소의 그림자옵션 false -> true로 변경
			// el.scene.traverse(function (child) {
			// 	if (child instanceof THREE.Mesh) {
			// 		child.castShadow = true;
			// 		// child.receiveShadow = true;
			// 	}
			// });

			let step = 0;
			let stepOdd = true;
			const animate = () => {
				if (el) {
					el.scene.scale.set(0.5, 0.5, 0.5);
					// 속도
					step += 0.02;
					// 길이
					// if (stepOdd) el.scene.position.x = 0.1 * Math.abs(Math.sin(step));
					// else el.scene.position.x = -0.1 * Math.abs(Math.sin(step));
					// stepOdd = !stepOdd;
					// sphereShadow.position.x = el.scene.position.x - 0.3;
					// sphereShadow.material.opacity =
					// 	(1 - Math.abs(el.scene.position.y)) * 0.5;
				}
				// if (el) {
				// 	el.scene.scale.set(0.5, 0.5, 0.5);
				// 	// 속도
				// 	step += 0.01;
				// 	// 길이
				// 	el.scene.position.x = -0.1 * Math.abs(Math.sin(step));
				// 	// el.scene.position.y = Math.sin(elapsedTime * .5) * .1 - 0.1
				// 	sphereShadow.position.x = el.scene.position.x - 0.3;
				// 	sphereShadow.material.opacity =
				// 		(1 - Math.abs(el.scene.position.y)) * 0.5;
				// }
				// requestAnimationFrame: 애니메이션을 무한 반복 되도록 하는 메서드
				requestAnimationFrame(animate);
			};
			animate();
		});
	}

	function resize() {
		const width = divContainer.clientWidth;
		const height = divContainer.clientHeight;

		_camera.aspect = width / height;
		_camera.updateProjectionMatrix();
		_renderer.setSize(width, height);
	}

	function render(time) {
		_renderer.render(_scene, _camera);
		// update(time);
		requestAnimationFrame(render.bind(this));
	}

	return;
}

window.onload = function () {
	App();
};
