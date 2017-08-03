class Mesh
{
	constructor(name, gl)
	{
		this.gl 	= gl;
		this.name 	= name;
		this.model 	= mat4.create();
		
		this.dims 	= vec3.fromValues(0, 0, 0);
		
		this.vel 	= vec3.fromValues(0, 0, 0);
		this.pos	= vec3.fromValues(0, 0, 0);
		
		this.rotAxis = vec3.fromValues(0, 0, 1);
		this.rotAngle = 0.0;

		this.obb = new OBB(
			vec3.fromValues(0, 0, 0),
			vec3.fromValues(1, 1, 1)
		); 
	}

	translate(tx)
	{
		var trans 	= mat4.create();
		var scl 	= mat4.create();
		var rot 	= mat4.create();

		mat4.translate(trans, trans, tx);
		mat4.scale(scl, scl, this.dims);
		mat4.fromRotation(rot, this.rotAngle, this.rotAxis);

		mat4.multiply(this.model, rot, scl);
		mat4.multiply(this.model, trans, this.model);

		this.pos 		= tx;
		this.obb.pos 	= tx;
	}

	scale(sclIn)
	{	
		var trans 	= mat4.create();
		var scl 	= mat4.create();
		var rot 	= mat4.create();

		mat4.translate(trans, trans, this.pos);
		mat4.scale(scl, scl, sclIn);
		mat4.fromRotation(rot, this.rotAngle, this.rotAxis);

		mat4.multiply(this.model, rot, scl);
		mat4.multiply(this.model, trans, this.model);

		this.obb.dims = sclIn;
		this.dims = sclIn;
	}

	rotate(axis, angle)
	{
		var trans 	= mat4.create();
		var scl 	= mat4.create();
		var rot 	= mat4.create();

		mat4.translate(trans, trans, this.pos);
		mat4.scale(scl, scl, this.dims);
		mat4.fromRotation(rot, angle, axis);

		mat4.multiply(this.model, rot, scl);
		mat4.multiply(this.model, trans, this.model);

		this.rotAxis = axis;
		this.rotAngle = angle;
		this.obb.rotate(axis, angle);
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
		var dx = vec3.create();
		vec3.scale(dx, this.vel, dt);

		vec3.add(this.pos, this.pos, dx);

		var trans 	= mat4.create();
		var scl 	= mat4.create();
		var rot 	= mat4.create();

		mat4.translate(trans, trans, this.pos);
		mat4.scale(scl, scl, this.dims);
		mat4.fromRotation(rot, this.rotAngle, this.rotAxis);

		mat4.multiply(this.model, rot, scl);
		mat4.multiply(this.model, trans, this.model);

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