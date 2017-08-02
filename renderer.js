class Renderer
{
	constructor(gl)
	{
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		this.scn = new Scene(gl);
		this.t = Date.now();

		var cam = new Camera(
			vec3.fromValues(25.0, 25.0, 25.0),
			vec3.fromValues(0.0, 0.0, 0.0),
			vec3.fromValues(0.0, 0.0, -1.0),
			4.0 / 3.0,
			75.0,
			1.0,
			100.0
		);

		this.scn.setCamera(cam);	
				
		/*
		var dirtSphere 	= new Model('DirtSphere');
		var sphereMesh 	= new Sphere(gl, 20, 20, false);
		var dirtMat 	= new Material('Dirt', gl);

		dirtMat.diffuseTex 	= 'resources/dirtDiffuse.jpg';
		dirtMat.normalTex 	= 'resources/dirtNormal.jpg';

		dirtSphere.material 	= dirtMat;
		dirtSphere.mesh 		= sphereMesh;
		
		this.scn.addModel(dirtSphere);
		*/

		// Skybox

		var skySphere = new Model('SkySphere');
		var skyMesh = new Sphere(gl, 50, 50, true);
		var skyMat = new Material('Sky', gl);

		skyMat.ambientTex = 'resources/milkyway.jpg';
		skyMat.ai = 1.0;
		skyMat.di = 0.0;

		skySphere.material = skyMat;
		skySphere.mesh = skyMesh;
		skySphere.scale(vec3.fromValues(30.0, 30.0, 30.0));

		this.scn.addModel(skySphere);

		// Particles

		var particles = new Model('Particles');
		var partMesh = new ParticleCloud(gl, 20000);

		var partMat = new Material('Particles', gl);
		partMat.ai = 1.0;
		partMat.di = 0.0;
		partMat.ka = vec3.fromValues(1.0, 1.0, 1.0);

		particles.mesh = partMesh;
		particles.material = partMat;

		this.scn.addModel(particles);

		this.scn.addLight(
			new PointLight(
				vec3.fromValues(8.0, -4.0, 2.0),
				vec3.fromValues(5.0, 5.0, 5.0)
			)
		);

		this.passes = [];
		this.passes.push(new RenderPass(1200, 800, gl));
	}

	handleKeyDown(event)
	{
		this.scn.Cam.handleKeyDown(event);
	}

	handleKeyUp(event)
	{
		this.scn.Cam.handleKeyUp(event);
	}

	handleMouseDown(event)
	{
		this.scn.Cam.handleMouseDown(event);
	}

	handleMouseUp(event)
	{
		this.scn.Cam.handleMouseUp(event);
	}

	handleMouseMove(event)
	{
		this.scn.Cam.handleMouseMove(event);
	}

	render()
	{
		var t2 = Date.now();
		var dt = (t2 - this.t) / 1000.0;
		this.t = t2;

		this.scn.update(dt);

		for (var i = 0; i < this.passes.length; i++)
		{
			this.passes[i].render(this.scn);
		}

		window.requestAnimationFrame(this.render.bind(this));
	}
}