class Scene
{
	constructor(gl)
	{
		this.gl = gl;
		this.models = [];
		this.lights = [];
		this.meshes = [];
		this.materials = [];
	}

	setCamera(camIn)
	{
		this.cam = camIn;
	}

	get Cam()
	{
		return this.cam;
	}

	get Lights()
	{
		return this.lights;
	}

	get Models()
	{
		return this.models;
	}

	addLight(newLight)
	{
		this.lights.push(newLight);
	}

	addModel(newModel)
	{
		this.models.push(newModel);
	}

	addMaterial(newMaterial)
	{
		this.materials.push(newMaterial);
	}

	addmeshes(newMesh)
	{
		this.meshes.push(newMesh);
	}

	update(dt)
	{
		for (var i = 0; i < this.models.length; i++)
		{
			this.models[i].update(dt);
		}

		this.cam.update();
	}

	setCameraUniforms(prog)
	{
		var viewID = this.gl.getUniformLocation(prog, "view");
		var view = this.cam.View;
		this.gl.uniformMatrix4fv(viewID, false, view);

		var projID = this.gl.getUniformLocation(prog, "proj");
		var proj = this.cam.projection;
		this.gl.uniformMatrix4fv(projID, false, proj);
	}

	setLightingUniforms(prog)
	{
		var lightPosID = this.gl.getUniformLocation(prog, "lightPos");
		var lightPos = this.lights[0].pos;
		this.gl.uniform3fv(lightPosID, lightPos);

		var lightColID = this.gl.getUniformLocation(prog, "lightColor");
		var lightCol = this.lights[0].color;
		this.gl.uniform3fv(lightColID, lightCol);
	}
}