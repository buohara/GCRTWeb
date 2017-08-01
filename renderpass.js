class RenderPass
{
	constructor(w, h, glIn)
	{
		this.gl = glIn;
		this.fboW = w;
		this.fboH = h;
		
		this.shader = new Shader(
			this.gl, 
			"RenderPass", 
			renderShaderVS, 
			renderShaderPS
		);

		this.shaderProg = this.shader.Program;
	}

	render(scn)
	{
		this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		this.gl.useProgram(this.shaderProg);
		this.gl.viewport(0, 0, this.fboW, this.fboH);

		scn.setCameraUniforms(this.shaderProg);
		scn.setLightingUniforms(this.shaderProg);

		var models = scn.Models;

		for (var i = 0; i < models.length; i++)
		{
			models[i].setMeshUniforms(this.shaderProg);
			models[i].setMaterialUniforms(this.shaderProg);
			models[i].draw();
		}
	}
}