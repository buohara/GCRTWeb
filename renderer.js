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

		var cam = new Camera(
			vec3.fromValues(10.0, 10.0, 10.0),
			vec3.fromValues(0.0, 0.0, 0.0),
			vec3.fromValues(0.0, 0.0, -1.0),
			4.0 / 3.0,
			75.0,
			1.0,
			100.0
		);

		this.scn.setCamera(cam);	
				
		var model 		= new Model('DirtSphere');
		var sphereMesh 	= new Sphere(gl, 20, 20);
		var dirtMat 	= new Material('Dirt', gl);

		dirtMat.diffuseTex 	= 'resources/dirtDiffuse.jpg';
		//dirtMat.normalTex 	= 'resources/dirtNormal.jpg';

		model.material 	= dirtMat;
		model.mesh 		= sphereMesh;
		
		this.scn.addModel(model);

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
		this.scn.update();

		for (var i = 0; i < this.passes.length; i++)
		{
			this.passes[i].render(this.scn);
		}

		window.requestAnimationFrame(this.render.bind(this));
	}
}