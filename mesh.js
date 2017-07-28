class Mesh
{
	constructor(glIn, meshData)
	{
		this.gl = glIn;
		this.vaoID = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.vaoID);
		this.model = mat4.create();
		this.kd = vec3.fromValues(0.3, 0.1, 0.1);

		// Positions

		this.posVboID = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posVboID);
		var pos = new Float32Array(meshData.vertices.length);

		for (var i = 0; i < pos.length; i++)
		{
			pos[i] = meshData.vertices[i];
		}

		this.gl.bufferData(this.gl.ARRAY_BUFFER, pos, this.gl.STATIC_DRAW, 0, pos.length);
	    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(0);

    	// Normals

    	this.normVboID = this.gl.createBuffer();
    	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normVboID);
    	var norm = new Float32Array(meshData.normals.length);

    	for (var i = 0; i < norm.length; i++)
		{
			norm[i] = meshData.normals[i];
		}

		this.gl.bufferData(this.gl.ARRAY_BUFFER, norm, this.gl.STATIC_DRAW, 0, norm.length);
	    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(1);

    	// Faces

		this.idxVboID = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.idxVboID);
		var faces = new Uint32Array(meshData.faces.length);
		this.numElements = faces.length;

		for (var i = 0; i < faces.length; i++)
		{
			faces[i] = meshData.faces[i];
		}

		this.gl.bufferData(
			this.gl.ELEMENT_ARRAY_BUFFER,
			faces,
			this.gl.STATIC_DRAW,
			0,
			faces.length
		);
	}

	setModel(modelIn)
	{
		this.model = modelIn;
	}

	get Model()
	{
		return this.model;
	}

	draw()
	{
		this.gl.bindVertexArray(this.vaoID);
		this.gl.drawElements(this.gl.TRIANGLES, 100, gl.UNSIGNED_INT, 0);
	}
}