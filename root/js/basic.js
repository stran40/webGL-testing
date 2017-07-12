// self executing function
// ideal to use graphics card to render images as opposed to javascript/software

(function(){
    
    
    /**
     * The ThreeJS renderer object that will
     * output the scene into the browser window.
     * @private
     */
    var renderer = null;
    
    var scene = null;
    
    var camera=null;
    
    var subject = null;
    var pants,legOne,legTwo,shoeOne,shoeTwo,ball,iss;
    
    var FOV = 90;
    var NEAR = 0.5;
    var FAR = 1000;
    
    var aspectRatio = 0;
    var controls = null;
    var ambient,directionalOne,directionalTwo;
    var frameCounter = null;
    
    function init(){
        
        console.log( 'init()' );
        // hide the support message if everything's ok
        document.getElementById( 'support-message' ).style.display = 'none';
        
        // using Detector
        renderer = Detector.webgl ? 
            new THREE.WebGLRenderer({ alpha : true, antialias : true }) : new THREE.CanvasRenderer() ;
        renderer.setClearColor( 0x000000, 1 );
        
        
        document.body.appendChild( renderer.domElement );
        
        resize();
        
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera( FOV, aspectRatio, NEAR, FAR );
        camera.position.set( 10, 10, 10 );
        camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
        
        
        scene.add( camera );
        
        scene.add( new THREE.GridHelper( 1000, 1, 0x444444 , 0x11b12f ) );
        scene.add( new THREE.AxisHelper( 1000 ) );
        
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        
        var diffuseTwo = THREE.ImageUtils.loadTexture( 'images/textures/diffuse-brown-rock.jpg' );
        
        var diffuse = THREE.ImageUtils.loadTexture( 'images/textures/earth/diffuse-earth-10k.jpg' );
        diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
        diffuse.repeat.set( 1, 1 );
        
        var normal = THREE.ImageUtils.loadTexture( 'images/textures/normal-chesterfield.jpg' );
        normal.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
        normal.repeat.set( 10, 10 );
        
        var bump = THREE.ImageUtils.loadTexture( 'images/textures/earth/bump-earth-10k.jpg' );
        var specular = THREE.ImageUtils.loadTexture( 'images/textures/earth/specular-earth-10k.jpg' );
        
        subject = new THREE.Mesh( 
            new THREE.BoxGeometry( 7, 8, 3 ),
            new THREE.MeshPhongMaterial( { 
                 color : 0xffe51e,
                map : diffuseTwo,
                shininess: 60
            
            } )
        );
        subject.position.y = 11;
        
        scene.add( subject );
        
        ambient = new THREE.AmbientLight( 0xffffff, .5 );
        scene.add( ambient );
        directionalOne = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalOne.position.set( 5 , 5, 0);
        
        scene.add( directionalOne );
        
        directionalTwo = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalTwo.position.set( 1 , 0.1, 1);
        
        scene.add( directionalTwo );
        
        pants = new THREE.Mesh( 
            new THREE.BoxGeometry( 7, 3, 3 ),
            new THREE.MeshPhongMaterial( { color : 0x5c4e39 } )
        );
        pants.position.y = 5.5;
        scene.add( pants );
        
        legOne = new THREE.Mesh( 
            new THREE.BoxGeometry( .5, 3.5, .5 ),
            new THREE.MeshPhongMaterial( { color : 0xffe51e, map : diffuseTwo } )
        );
        legOne.position.y = 2.5;
        legOne.position.x = 2;
        scene.add( legOne );
        
        legTwo = new THREE.Mesh( 
            new THREE.BoxGeometry( .5, 3.5, .5 ),
            new THREE.MeshPhongMaterial( { color : 0xffe51e, map : diffuseTwo } )
        );
        legTwo.position.y = 2.5;
        legTwo.position.x = -2;
        scene.add( legTwo );
        
         shoeOne = new THREE.Mesh( 
         new THREE.BoxGeometry( 1, 1, 2 ),
         new THREE.MeshPhongMaterial( { color : 0x000000 } )
        );
        shoeOne.position.y = .5;
        shoeOne.position.x = 2.2;
        scene.add( shoeOne );
        
        shoeTwo = new THREE.Mesh( 
            new THREE.BoxGeometry( 1, 1, 2 ),
            new THREE.MeshPhongMaterial( { color : 0x000000 } )
        );
       shoeTwo.position.y = .5;
       shoeTwo.position.x = -2;
        scene.add( shoeTwo );
        
        ball = new THREE.Mesh( 
            new THREE.SphereGeometry( 5, 50, 50 ),
            new THREE.MeshPhongMaterial( { 
                // color : 0xffe51e,
                map : diffuse,
            bumpMap: bump,
                specularMap: specular,
            shininess : 160} )
        );
        ball.position.y = 6;
        ball.position.x = 10;
        scene.add( ball );
        
        var loader = new THREE.JSONLoader();
        loader.load( 'models/iss.json', loadedModel );
        
        update();
    }
    
    function loadedModel( geometry, materials ){
        
        iss = new THREE.Mesh
            ( geometry, 
              new THREE.MeshFaceMaterial( materials )
              );
        
        scene.add( iss );
        iss.position.set( 10, 2.5, 3 );
    }
    
    function update(){
        frameCounter++;
        
        var currentPosition = 1 - ( frameCounter / 600 );
        
        if( iss ){
            iss.position.x = Math.cos( (Math.PI * 2) * currentPosition ) * 10 ;
            iss.position.z = Math.sin( (Math.PI * 2) * currentPosition ) * 10 ;
        }
        
        subject.rotation.y += (Math.PI * 2) * 0.01;
        pants.rotation.y += (Math.PI * 2) * 0.01;
        legOne.rotation.y += (Math.PI * 2) * 0.01;
        legTwo.rotation.y += (Math.PI * 2) * 0.01;
        shoeOne.rotation.y += (Math.PI * 2) * 0.01;
        shoeTwo.rotation.y += (Math.PI * 2) * 0.01;
        

        ball.rotation.y += (Math.PI * 2) * 0.01;
        renderer.render( scene, camera );
        requestAnimationFrame( update );
    }
    
    function resize(){
        
        console.log( 'resize()' );
        
        aspectRatio = window.innerWidth / window.innerHeight;
        
        // dimensions between scroll bars and edges of browser; search bar and bottom. 
        renderer.setSize( window.innerWidth, window.innerHeight );
        
        if( camera ){
            camera.aspect = aspectRatio;
            camera.updateProjectionMatrix();
        }
    }
    
    // start init function once window loads
    window.addEventListener( 'load', init );
    // run resize function when the browser window is resize
    window.addEventListener( 'resize', resize );
    
    
})();