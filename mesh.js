class Mesh
{
	constructor(name, gl)
	{
		this.gl 	= gl;
		this.name 	= name;
		this.model 	= mat4.create();
		this.vel 	= vec3.fromValues(0, 0, 0);
		this.pos	= vec3.fromValues(0, 0, 0);
		
		this.obb = new OBB(
			vec3.fromValues(0, 0, 0),
			vec3.fromValues(1, 1, 1)
		); 
	}

	translate(tx)
	{
		mat4.translate(this.model, this.model, tx);
		this.obb.pos = tx;
	}

	scale(scl)
	{	
		mat4.scale(this.model, this.model, scl);
		this.obb.dims = scl;
	}

	accel(a)
	{
		vec3.add(this.vel, this.vel, a);
	}

	get Model()
	{
		return this.model;
	}

	get bbox()
	{
		return this.obb;
	}

	update(dt)
	{
		vec3.scaleAndAdd(this.pos, this.pos, this.vel, dt);
		mat4.translate(this.model, this.model, this.pos);
		this.obb.pos = this.pos;
	}

	setMeshUniforms(prog)
	{
		var modelInv = mat4.create();
		var modelInvT = mat4.create();
		mat4.invert(modelInv, this.model);
		mat4.transpose(modelInvT, modelInv);

		var modelID = this.gl.getUniformLocation(prog, "model");
		this.gl.uniformMatrix4fv(modelID, false, this.model);

		var modelInvID = this.gl.getUniformLocation(prog, "modelInv");
		this.gl.uniformMatrix4fv(modelInvID, false, modelInvT);
	}
}