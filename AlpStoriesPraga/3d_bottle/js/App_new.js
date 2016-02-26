/**
 * init app variables
 */

//defaultTexture
var cameraLimit = 40;
var currentTexture = ['3d_bottle/data/img/logoimage.jpg', '3d_bottle/data/img/RepenGepolijst.jpg', '3d_bottle/data/img/template_10012.png'];
var file = [
    ['bottle.obj', 'bottle.mtl'],
    ['flaska1_4.obj', 'flaska1_4.mtl'],
    ['flaska1_5.obj', 'flaska1_5.mtl']
];

var curObj = {name: location.href.split('?'), curFile: '', curText: ''};

/*if (curObj.name) {*/
    /*if (curObj.name[1] == 'flash') {
        curObj.curFile = file[1];
        curObj.curText = currentTexture[1];
    } else if (curObj.name[1] == 'bottle') {*/
        curObj.curFile = file[0];
        curObj.curText = currentTexture[0];
    /*} else if (curObj.name[1] == 'flah') {
        curObj.curFile = file[2];
        curObj.curText = currentTexture[2];
    }*/
//}
// DAT.GUI
/*var guiControls = new function () {
    this.loadFile = function () {
        $('#TextureLoader').click();
    }
};
var gui = new dat.GUI();
gui.add(guiControls, 'loadFile').name('Upload image');*/

// THREE.js ini
var area = document.getElementById('product_detail_image');
var camera, scene, gl, controls, hemisphere, container;
var slowingFactor = 0.025, curX, curY, curRY, curRX, curRz;
var ButtonCk = 'none';
var windowHalfX = area.offsetWidth / 2;
var windowHalfY = area.offsetHeight / 2;
var can = {};
can.obj = {};
can.childs = [];
can.animate = 'stop';
var App = {
    ZoomValue: 50,
    mouse: new THREE.Vector2(),
    mousePrev: new THREE.Vector2(),
    mouseGap: new THREE.Vector2()
};

//on document ready
$(document).ready(function () {

    //catch load file
    $('#TextureLoader').on('change', function (e) {
        handleFileSelect();
    });

    //build scene
    if (curObj.name) {
        Init();
        Animate();
    }

    //set events for slider
    /*$("#ZoomSlider").slider({
        animate: "fast",
        orientation: "vertical",
        slide: function (event, ui) {
            if (ui.value < 50) {
                normalized = -1;
            } else {
                normalized = 1;
            }
            App.ZoomValue = ui.value;
        },
        stop: function () {
            var timeStaart = 0;
            if (Modernizr.touch) {
                timeStaart = 100;
            }
            setTimeout(function () {
                App.ZoomValue = 50;
                $("#ZoomSlider").slider("value", 50);
            }, timeStaart);
        }
    });*/
    //set default value for slider
    //$("#ZoomSlider").slider("value", 50);
    //reset view
    $("#THREJS").dblclick(function () {
        controls.reset();
    });

});

/**
 * describe global methods, init app
 */

function Init() {
    //add result of render
    container = document.createElement('div');
    container.id = 'THREJS';
    area.appendChild(container);
    //create render
    gl = new THREE.WebGLRenderer({antialiasing: true, alpha: true, antialias: true});
    gl.setClearColor("#ffffff");
    //gl.setSize(window.innerWidth, window.innerHeight);
    gl.setSize(area.offsetWidth, area.offsetHeight);
    gl.gammaInput = true;
    gl.gammaOutput = true;
    gl.sortObjects = false;
    gl.setPixelRatio(window.devicePixelRatio);
    gl.shadowMapEnabled = true;
    gl.shadowMapType = THREE.PCFSoftShadowMap;
    container.appendChild(gl.domElement);

    //create scene
    scene = new THREE.Scene();

    //add camera
    camera = new THREE.PerspectiveCamera(45, area.offsetWidth / area.offsetHeight, 1, 100);
    camera.position.set(0, 0, 5);
    camera.lookAt(scene.position);

    //add lights
    scene.add(new THREE.AmbientLight("#555555"));
    scene.add(new THREE.AxisHelper(100));
    hemisphere = new THREE.HemisphereLight("#ffffff", "#ffffff", 1);
    hemisphere.position.set(0, 5, 0);
    hemisphere.intensity = 1;
    scene.add(hemisphere);
    var light = new THREE.PointLight("#ffffff", 1, 200);
    light.position.set(5, 10, 5);
    scene.add(light);

    //load .obj
    var loader = new THREE.OBJMTLLoader();
    loader.load("3d_bottle/data/obj/" + curObj.curFile[0], "3d_bottle/data/obj/" + curObj.curFile[1], function (obj) {
        onLoadModel(obj);
        textureChild();
        $("#render").click(function () {
            textureChild();
            hemisphere.intensity = 0.6;
            can.animate = 'fadeOut';
            animateFade();
        });

        can.obj = obj;
        scene.add(obj);
    });
    //add controls
    controls = new THREE.OrbitControls(camera);
    //controls.rotateSpeed = 1.0;
    //controls.zoomSpeed = 1.2;
    //controls.panSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = false;
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.3;
    //controls.keys = [65, 83, 68];
    controls.maxDistance = 8;
    controls.minDistance = 3;

    controls.minPolarAngle = (Math.PI / 2) - (cameraLimit * Math.PI / 180); // radians
    controls.maxPolarAngle = (Math.PI / 2) + (cameraLimit * Math.PI / 180); // radians
    //controls.minAzimuthAngle = -(cameraLimit * Math.PI / 180); // radians
    //controls.maxAzimuthAngle = (cameraLimit * Math.PI / 180); // radians
    //controls.addEventListener('change', render);

    window.addEventListener('resize', onWindowResize, false);
}

/**
 * set new view when window resize
 */
function onWindowResize() {
    camera.aspect = area.offsetWidth / area.offsetHeight;
    //controls.handleResize();
    camera.updateProjectionMatrix();
    gl.setSize(area.offsetWidth, area.offsetHeight);
}

/**
 * get new 2d coordinates
 */
function createVector(x, y, z, camera, width, height) {
    var p = new THREE.Vector3(x, y, z);
    var vector = p.project(camera);

    vector.x = (vector.x + 1) / 2 * width;
    vector.y = -(vector.y - 1) / 2 * height;

    return vector;
}

/**
 * set new view on every changes on scene
 */
function Animate() {
    controls.update();
    var cameraDistance = Math.sqrt(camera.position.x * camera.position.x + camera.position.y * camera.position.y + camera.position.z * camera.position.z);
    if (cameraDistance > 10) {
    } else {
        if (App.ZoomValue > 50) {
            camera.position.z -= 0.1;
        } else if (App.ZoomValue < 50) {
            camera.position.z += 0.1;
        }
    }
    requestAnimationFrame(Animate);
    render();
}
function rotateAroundObjectAxis(object, axis, radians) {
    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.setRotationAxis(axis.normalize(), radians);
    object.matrix.multiplySelf(rotationMatrix);
    object.rotation.setRotationFromMatrix(object.matrix);

}

function rotateAroundWorldAxis(object, axis, radians) {
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.setRotationAxis(axis.normalize(), radians);
    rotationMatrix.multiplySelf(object.matrix);
    object.matrix = rotationMatrix;
    object.rotation.setRotationFromMatrix(object.matrix);

}

/**
 * set texture or mesh
 */
function textureChild() {
    for (var i = 0; i < can.childs.length; i++) {
        var child = can.childs[i];
        child.material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture(curObj.curText),
            overdraw: 0.5
        });
        child.material.map.minFilter = THREE.LinearFilter;
        child.material.needsUpdate = true;
        child.material.opacity = 1;
    }
}

/**
 * set intensity for lights, make model look like real
 */
function animateFade() {
    if (can.animate === 'fadeOut') {
        hemisphere.intensity = hemisphere.intensity > 0.5 ? (hemisphere.intensity - 0.02) : 0;
        can.animate = (hemisphere.intensity >= 0.5) ? 'fadeOut' : 'stop';
    } else if (can.animate === 'fadeIn') {
        hemisphere.intensity = hemisphere.intensity < 1 ? (hemisphere.intensity + 0.02) : 1;
        can.animate = (hemisphere.intensity >= 1) ? 'stop' : 'fadeIn';
    }
    if (can.animate != 'stop') {
        countdown(100, animateFade);
    }
}

/**
 * render scene
 */
var targetRotationY, targetRotationX
function render() {
    //    rotateAroundWorldAxis(can.obj, new THREE.Vector3(0, 1, 0), targetRotationX);
    //    rotateAroundWorldAxis(can.obj, new THREE.Vector3(1, 0, 0), targetRotationY);
    //
    //    targetRotationY = targetRotationY * (1 - slowingFactor);
    //    targetRotationX = targetRotationX * (1 - slowingFactor);
    //        if(can.obj.position){
    //    if(camera.position != new THREE.Vector3(5,5,5)){
    //    var vect={};
    //    vect.x =camera.position.x>5?camera.position.x-5:camera.position.x-5;
    //        controls.target.set(camera.position.x-5,camera.position.y-5,camera.position.z-5);
    //    }
    //        }
    //    camera.lookAt(scene.position);
    gl.render(scene, camera);
}

/**
 * on finish load .obj
 */
function onLoadModel(object) {
    if (can.childs.length === 0) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                if (curObj.name[1] == 'flash' || curObj.name[1] == 'flah') {
                    child.position.y = -1;
                } else {
                    child.position.set(2.7, -1, 2.4);
                }
                if (child.material.name == "wire_115115115" || child.material.name == "etiketa") {
                    child.opacity = 1;
                    can.childs.push(child);
                }
            }
        });
    }
    hemisphere.intensity = 0.6;
    can.animate = 'fadeOut';
    animateFade();
}

/**
 * check and set uploaded file
 */
function handleFileSelect() {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        console.log('The File APIs are not fully supported in this browser.');
        return;
    }
    input = document.getElementById('TextureLoader');
    if (!input) {
        console.log(" !file element");
    }
    else if (!input.files) {
        console.log("!browser not supporty `files` ");
    }
    else if (!input.files[0]) {
        console.log("Please select a file before clicking 'Load'");
    }
    else if (!input.files[0].type.match('image')) {
        console.log("Please select a correct type file'");
    }
    else {
        var file = input.files[0];
        var fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = function () {
            curObj.curText = fr.result;
            $('#render').trigger('click');
        };
    }

}

/**
 * app timer
 */
function countdown(delay, callback) {
    var tmpTimeout = setTimeout(function () {
        clearTimeout(tmpTimeout);
        callback();
    }, delay);
}