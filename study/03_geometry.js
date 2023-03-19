import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js";

function App() {
	let _renderer = "";
	let _camera = "";
	let _scene = "";
	let _cube = "";

	const divContainer = document.querySelector("#webgl-container");
	//antialias: true -> 3차원 장면이 렌더링 될때, Obj들의 경계선이 계단현상없이 부드럽게 표현
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	// setPixelRatio(window.devicePixelRatio) -> 픽셀 비율(디스플레이 속성, 배율 및 레이아웃 - 텍스트 크기)
	renderer.setPixelRatio(window.devicePixelRatio);
	divContainer.appendChild(renderer.domElement);
	_renderer = renderer;

	const scene = new THREE.Scene();
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

	function setupControls() {
		new OrbitControls(_camera, divContainer);
	}

	// 카메라의 객체를 생성해주는 메서드
	function setupCamera() {
		const width = divContainer.clientWidth;
		const height = divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2;
		_camera = camera;
	}

	// 광원의 색상, 세기값을 통해 광원을 생성
	function setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		_scene.add(light);
	}

	// 파랑색 계열의 정육면체 mesh를 생성해주는 메서드
	function setupModel() {
		// 박스: 가로 세로 깊이, 가로분할수, 세로분할수, 깊이분할수 의 인자를 가짐
		// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
		// 원: 원판의 크기, 세그먼트(분할) 수, 시작각도(0~2 파이 == 라디안), 연장각도(라디안)
		// const geometry = new THREE.CircleGeometry(0.9, 100, 0, Math.PI * 2);
		// 원뿔: 밑면 원의 반지름, (원뿔의) 높이, 둘레 방향에 대한 분할개수, 높이 방향에 대한 분할개수, 밑면 개방여부, 원뿔의 시작각(라디안), 연장각(라디안)
		// const geometry = new THREE.ConeGeometry(0.5, 1, 3, 5, true);
		// 원통: 윗면 반지름 크기, 밑면 반지름 크기, 원통의 높이, 원통의 둘레 방향에 대한 분할개수
		// const geometry = new THREE.CylinderGeometry(1, 0.5, 1.6, 3);
		// const fillMaterial = new THREE.MeshPhongMaterial({ color: "white" });
		// const cube = new THREE.Mesh(geometry, fillMaterial);

		// const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" }); // 색상
		// const line = new THREE.LineSegments(
		// 	new THREE.WireframeGeometry(geometry),
		// 	lineMaterial
		// );

		const glftLoader = new GLTFLoader();
		glftLoader.load("gomi.gltf", (el) => {
			scene.add(el.scene);
		});

		// const group = new THREE.Group();
		// group.add(cube);
		// group.add(line);

		// _scene.add(group);
		// _cube = group;
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
		update(time);
		requestAnimationFrame(render.bind(this));
	}

	function update(time) {
		time *= 0.001; // 초
		// _cube.rotation.x = time;
		// _cube.rotation.y = time;
	}

	return;
}

window.onload = function () {
	App();
};
