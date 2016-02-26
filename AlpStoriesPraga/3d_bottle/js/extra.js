// EXTRA
var Extra = {
    Each: function (obj, callback, onEachAll) {
        var arr = [];
        if (typeof obj == "object") {
            for (var key in obj) {
                arr.push(obj[key]);
            }
        } else {
            arr = obj;
        }

        for (var i = 0, l = arr.length; i < l; i++) {
            if (callback) {
                callback(i, arr[i]);
            }
            if (i == l - 1 && onEachAll) {
                onEachAll();
            }
        }
    },
    Repeat: function (l, callback, onRepeatAll) {
        if (l && callback) {
            for (var i = 0; i < l; i++) {
                if (callback) {
                    callback(i);
                }
                if (i == l - 1 && onRepeatAll) {
                    onRepeatAll(i);
                }
            }
        }
    },
    RepeatT: function (l, timeout, callback, onRepeatAll) {
        if (l && callback) {
            var i = 0;
            var timer = {};

            function iteration() {
                if (i < l - 1) {
                    if (callback) {
                        callback(i);
                    }
                    i++;
                    timer = setTimeout(iteration, timeout);
                } else if (i >= l - 1 && onRepeatAll) {
                    var timer2 = setTimeout(function () {
                        onRepeatAll(i)
                        clearTimeout(timer2);
                    }, timeout);
                    clearTimeout(timer);
                }
            }

            iteration();
        }
    },
    Foreach: function (object, callback) {
        if (typeof object == "object" && typeof callback == "function") {
            var count = 0;
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    callback(key, object[key], count);
                    count++;
                }
            }
        }
    },
    Extend: function (destination, source) {
        for (var key in source) {
            destination[key] = source[key];
        }
    },
    MergeFunctions: function (function1, function2) {
        if (function1) {
            return function (arg, flag) {
                var arg = arg || {};
                var flag = flag || false;
                if (!flag) {
                    function1(arg);
                }
                if (function2) {
                    function2(arg);
                }
            }
        } else {
            return false;
        }
    },
    Preset: function (obj, opt) {
        var options = opt.split(',');
        var settings = [];
        var newObj = new function () {
            var self = this;
            for (var i = 0; i < options.length; i++) {
                var newOption = options[i].replace(/(^\s+|\s+$)/g, '');
                self[newOption] = {};
            }
        }
        Extra.Extend(obj, newObj);
        return obj;
    },
    Loader: function (pointModel, setup, onload) {
        var mesh = new THREE.Mesh();
        var Loader = new THREE.JSONLoader();

        Loader.load(pointModel, function (geometry, materials) {

            material = new THREE.MeshFaceMaterial(materials);

            if (setup && setup.materials) {

                Extra.Foreach(materials, function (i, material) {
                    Extra.Foreach(setup.materials, function (j, item) {

                        if (material.name == item.name) {
                            texture = THREE.ImageUtils.loadTexture(item.map);
                            texture.minFilter = THREE.LinearFilter;
                            material.map = texture;
                        }

                    });
                });

            }

            mesh = new THREE.Mesh(geometry, material);

            if (onload) {
                onload(mesh);
            }
        });
        Loader.onLoadComplete(function () {
            console.log('complete');
        });
        return mesh;
    },
    NodeVector2: function (source, destination) {
        var deltaX = destination.position.x - source.position.x;
        var deltaY = destination.position.z - source.position.z;
        var rad = Math.atan2(deltaY, deltaX);
        return (Math.PI - rad);
    },
    Line: function (vstart, vend, cPlane) {

        var newLine3 = new THREE.Line3(vstart.position, vend.position);
        var geometry = new THREE.CylinderGeometry(1, 1, newLine3.distance(), 8);
        var material = new THREE.MeshLambertMaterial({color: cPlane.linesColor, ambient: 0x333333});
        var line = new THREE.Mesh(geometry, material);
        line.rotation.z = Math.PI * -0.5;
        line.rotation.y = Extra.NodeVector2(vstart, vend);

        vstart.lines.push(line);
        vend.lines.push(line);
        cPlane.add(line);

        return line;
    },
    roundRect: function (ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    RND: function (num, num2) {
        if (num && !num2) {
            return Math.round(Math.random() * num);
        }
        if (num && num2) {
            return Math.round((Math.random() * (num2 - num)) + num);
        }
    },
    EventObject: function () {
        var self = this;
        self.drop = function (num) {
            self._.s2 = [];
        };
        self.set = function (func) {
            self.drop();
            self._.s2.push(func);
        };
        self.add = function (func) {
            self._.s2.push(func);
        };
        self.run = function (test) {
            Extra.Each(self._.s1, function (i, func) {
                if (func) {
                    func(test)
                }
            });
            Extra.Each(self._.s2, function (i, func) {
                if (func) {
                    func(test)
                }
            });
        }
        self._ = {
            s1: [],
            s2: [],
            add: function (func) {
                self._.s1.push(func);
            },
            set: function (func) {
                self._.drop();
                self._.s1.push(func);
            },
            drop: function (num) {
                self._.s1 = [];
            }
        };
    },
    FileLoader: function (selector, callback) {
        var fileData;

        function handleFileSelect() {
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                console.log('The File APIs are not fully supported in this browser.');
                return;
            }

            input = document.getElementById(selector);

            if (!input) {
                console.log(" !file element");
            }
            else if (!input.files) {
                console.log("!browser not supporty `files` ");
            }
            else if (!input.files[0]) {
                console.log("Please select a file before clicking 'Load'");
            }
            else {
                var file = input.files[0];
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = function () {
                    fileData = fr.result;
                    // console.log(fileData);
                    if (callback) {
                        callback(fileData)
                    }
                };
            }
        }

        handleFileSelect();
    },
    FileLoaderOnChange: function (selector, callback) {
        var fileData;
        $('#' + selector).on('change', function (e) {
            handleFileSelect();
        });
        function handleFileSelect() {
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                console.log('The File APIs are not fully supported in this browser.');
                return;
            }

            input = document.getElementById(selector);

            if (!input) {
                console.log(" !file element");
            }
            else if (!input.files) {
                console.log("!browser not supporty `files` ");
            }
            else if (!input.files[0]) {
                console.log("Please select a file before clicking 'Load'");
            }
            else {
                var file = input.files[0];
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = function () {
                    fileData = fr.result;
                    if (callback) {
                        callback(fileData)
                    }
                };
            }
        }
    }
};