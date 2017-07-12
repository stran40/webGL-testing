// self executing function
// ideal to use graphics card to render images as opposed to javascript/software

(function(){
    
    
    /**
     * The ThreeJS renderer object that will
     * output the scene into the browser window.
     * @private
     */
    var renderer = null;
    
    // vr-related variables
    var stereo = null;
    var container = null;
    var clock = new THREE.Clock();
    
    var scene = null;
    
    var camera=null;

    var ball = null;
    var box = null;
    
    var FOV = 90;
    var NEAR = 0.5;
    var FAR = 1000;
    
    var aspectRatio = 0;
    var controls = null;
    var ambient
    var directionalOne
    var directionalTwo
    var frameCounter = null;
    
    function init(){
        
        console.log( 'init()' );
        // hide the support message if everything's ok
        document.getElementById( 'support-message' ).style.display = 'none';
        
        
        container = document.body;
        
        // using Detector
        renderer = Detector.webgl ? 
            new THREE.WebGLRenderer({ alpha : true, antialias : true }) : new THREE.CanvasRenderer() ;
        
        // create the stereoscopic view
        stereo = new THREE.StereoEffect( renderer );
        
        renderer.setClearColor( 0xffffff, 0 );
        
        document.body.appendChild( renderer.domElement );
        
		
       // click on page will make it fullscreen
		renderer.domElement.addEventListener( 'click', fullscreen );
        
        resize();
        
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera( FOV, aspectRatio, NEAR, FAR );
        camera.position.set( 20, 10, 20 );
        camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
        
        
        scene.add( camera );
        
        scene.add( new THREE.GridHelper( 1000, 1 ) );
        scene.add( new THREE.AxisHelper( 1000 ) );
        
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        
		// device orientation determines tilt of the image
        
        window.addEventListener( 'deviceorientation', detectTiltControls );
        
        var diffuseTwo = THREE.ImageUtils.loadTexture( 'images/textures/diffuse-brown-rock.jpg' );
        
        var diffuse = THREE.ImageUtils.loadTexture( 'images/textures/earth/diffuse-earth-10k.jpg' );
        diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
        diffuse.repeat.set( 1, 1 );
        
        var normal = THREE.ImageUtils.loadTexture( 'images/patterns/yellowbluelogo.png' );
   
    
  
        
        ambient = new THREE.AmbientLight( 0xffffff, .5 );
        scene.add( ambient );
        directionalOne = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalOne.position.set( 5 , 5, 0);
        
        scene.add( directionalOne );
        
        directionalTwo = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalTwo.position.set( 1 , 0.1, 1);
        
        scene.add( directionalTwo );
        
       
        
        ball = new THREE.Mesh( 
            new THREE.SphereGeometry( 5, 50, 50 ),
            new THREE.MeshPhongMaterial( { 
                color : 0xffffff,
                map : normal,
            shininess : 160} )
        );
        ball.position.y = 6;
        ball.position.x = 10;
        scene.add( ball );
		
		box = new THREE.Mesh( 
            new THREE.BoxGeometry( 20, 10, 3 ),
            new THREE.MeshPhongMaterial( { 
                 color : 0xffffff,
                map : normal,
                shininess: 60
            
            } )
        );
       box.position.y = 5;
		box.position.x = -10;
        
        scene.add( box );
        
        
        
        update();
    }
    
     
    
    function detectTiltControls( e ){
        
        if( !e.alpha ){
            return false;
        }
        
        controls = new THREE.DeviceOrientationControls( camera, true );
        controls.connect();
        controls.update();
        
        window.removeEventListener( 'deviceorientation', detectTiltControls );
    }
    
    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }
   
    
    function update(){
        frameCounter++;
        
        var currentPosition = 1 - ( frameCounter / 600 );
       
        
        controls.update( clock.getDelta );

        ball.rotation.y += (Math.PI * 2) * 0.01;
        stereo.render( scene, camera );
        requestAnimationFrame( update );
    }
    
    function resize(){
        
        console.log( 'resize()' );
        
        aspectRatio = window.innerWidth /
        window.innerHeight;
        
        // dimensions between scroll bars and edges of browser; search bar and bottom. 
        renderer.setSize( window.innerWidth, window.innerHeight );
        stereo.setSize( window.innerWidth, window.innerHeight );
        
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