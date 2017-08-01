class Mesh
{
	constructor(name, gl)
	{
		this.gl = gl;
		this.name = name;
		this.model = mat4.create();
	}

	get Model()
	{
		return this.model;
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