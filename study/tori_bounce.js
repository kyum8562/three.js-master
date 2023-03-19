import * as THREE from "../build/three.module.js";
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js";

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

	// 창 크기가 변경될 때, App을 바인딩 해줌
	window.onresize = resize.bind(this);
	resize();

	// render: 3차원 그래픽을 만들어주는 메서드
	requestAnimationFrame(render.bind(this));

	const textureLoader = new THREE.TextureLoader();
	const alphaShadow = textureLoader.load("./textures/simpleShadow.jpg");

	const sphereShadow = new THREE.Mesh(
		new THREE.PlaneGeometry(2, 2),
		new THREE.MeshBasicMaterial({
			transparent: true,
			color: 0x000000,
			opacity: 0.9,
			alphaMap: alphaShadow,
		})
	);

	sphereShadow.rotation.x = -Math.PI * 0.5;
	sphereShadow.position.x = 0;
	sphereShadow.position.y = -1.1;

	scene.add(sphereShadow);

	// 카메라의 객체를 생성해주는 메서드
	function setupCamera() {
		const width = divContainer.clientWidth;
		const height = divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.x = 0;
		camera.position.y = 0.35;
		camera.position.z = 3;
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

		// var backLight = new THREE.DirectionalLight(0xffffff, 1);
		// backLight.position.set(-40, 100, 20);
		// scene.add(backLight);

		// const dlHelper = new THREE.DirectionalLightHelper(light, 0.2, 0x0000ff);
		// scene.add(dlHelper);
		// scene.add(light);
		// light.shadow.mapSize.width = 1024;
		// light.shadow.mapSize.height = 1024;
		// light.shadow.camera.near = 0; // default 0.5
		// light.shadow.camera.far = 1000; // default 500
	}

	// 파랑색 계열의 정육면체 mesh	를 생성해주는 메서드
	function setupModel() {
		const group = new THREE.Group();

		// 캐릭터 설정
		const glftLoader = new GLTFLoader();
		glftLoader.load("tori_finish.gltf", (el) => {
			el.scene.position.x = 0.4;
			el.scene.position.y = 0;
			el.scene.position.z = 2;
			// 옆면: -0.7 정면: -0.4
			el.scene.rotation.y = -0.7;
			el.scene.rotation.x = 0.3;

			// scene.add(el.scene);
			group.add(el.scene);

			// el.scene.castShadow = true;

			// 부모 요소에는 castShadow가 true이지만 자식요소의 그림자옵션 false -> true로 변경
			el.scene.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.castShadow = true;
					// child.receiveShadow = true;
				}
			});

			// const group = new THREE.Group();
			// group.add(el.scene);

			// glftLoader.load("bamboo.gltf", (ele) => {
			// 	ele.scene.position.x = -0.7;
			// 	ele.scene.position.y = 0.4;
			// 	ele.scene.position.z = 1;
			// 	ele.scene.rotation.y = -0.9;
			// 	group.add(ele.scene);

			// 	// scene.add(el.scene);
			// 	ele.scene.scale.set(0.2, 0.1, 0.1);
			// });

			// scene.add(group);
			// spotlight;
			// var spotLight = new THREE.SpotLight(0xffffff);
			// spotLight.position.set(0, 80, 0);
			// spotLight.castShadow = true;
			// spotLight.shadowMapHeight = 5000;
			// spotLight.shadowMapWidth = 5000;
			// scene.add(spotLight);

			let step = 0;

			const animate = () => {
				if (el) {
					step += 0.02;
					el.scene.scale.set(0.5, 0.5, 0.5);
					el.scene.position.y = 0.5 * Math.abs(Math.sin(step));
					// el.scene.position.y = Math.sin(elapsedTime * .5) * .1 - 0.1
					sphereShadow.material.opacity =
						(1 - Math.abs(el.scene.position.y)) * 0.5;
				}
				// requestAnimationFrame: 애니메이션을 무한 반복 되도록 하는 메서드
				requestAnimationFrame(animate);
			};
			animate();
		});
		const glftLoader1 = new GLTFLoader();
		glftLoader1.load("acorn.gltf", (ele) => {
			ele.scene.position.x = -1;
			ele.scene.position.y = 1;
			ele.scene.position.z = 1;
			ele.scene.rotation.y = 2;
			ele.scene.rotation.x = 0.3;
			group.add(ele.scene);

			// scene.add(el.scene);
			ele.scene.scale.set(0.7, 0.7, 0.7);
		});
		scene.add(group);
	}

	// 바닥 설정
	// const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);
	// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
	// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	// plane.rotation.x = -0.5 * Math.PI;
	// plane.position.y = -0.5;
	// scene.add(plane);
	// plane.receiveShadow = true;
	// const textureLoader = new THREE.TextureLoader()
	// const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')

	// const plane1 = new THREE.Mesh(
	// 	new THREE.PlaneGeometry(500, 500, 1, 1),
	// 	new THREE.MeshStandardMaterial({ color: 0xffffff })
	// );
	// plane1.material.side = THREE.DoubleSide;
	// plane1.position.y = -100;
	// plane1.position.z = -100;
	// plane1.rotation.x = (90 * Math.PI) / 180;
	// plane1.rotation.y = 0;
	// plane1.rotation.z = 0;
	// plane1.DoubleSide = true;
	// plane1.receiveShadow = true;
	// scene.add(plane1);

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
