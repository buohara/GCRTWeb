function OOBIntersect(
	asize,
	pa,
	abasis,
	bsize,
	pb,
	bbasis,
)
{
	var v = vec3.create();
	vec3.subtract(v, pb, pa);
	
	var T = vec3.fromValues(
		dot(v, abasis[0]), 
		dot(v, abasis[1]), 
		dot(v, abasis[2])
	);

	var R = mat3.create();
	
	var ra;
	var rb;
	var t;

	for (var i = 0; i < 3 ; i++)
	{
		for (var k = 0; k < 3; k++)
		{ 
			R[i][k] = vec3.dot(abasis[i], bbasis[k]);
		}
	}

	// Six separating axes along faces of A and B

	for (var i = 0; i < 3 ; i++)
	{
		ra = asize[i];
		rb = bsize[0] * Math.abs(R[i][0]) + bsize[1] * Math.abs(R[i][1]) + bsize[2] * Math.abs(R[i][2]);
		t = Math.abs(T[i]);

		if (t > ra + rb)
		{ 
			return false;
		}
	}

	for (var k = 0; k < 3; k++)
	{

		ra = asize[0] * Math.abs(R[0][k]) + asize[1] * Math.abs(R[1][k]) + asize[2] * Math.abs(R[2][k]);
		rb = bsize[k];
		t = Math.abs(T[0] * R[0][k] + T[1] * R[1][k] + T[2] * R[2][k]);

		if (t > ra + rb)
		{
			return false;
		}
	}

	// Separating axes formed by 9 planes spanned by
	// edges of A and B

	ra = asize[1] * Math.abs(R[2][0]) + asize[2] * Math.abs(R[1][0]);
	rb = bsize[1] * Math.abs(R[0][2]) + bsize[2] * Math.abs(R[0][1]);
	t = Math.abs(T[2] * R[1][0] - T[1] * R[2][0]);

	if (t > ra + rb)
	{
		return false;
	}

	ra = asize[1] * Math.abs(R[2][1]) + asize[2] * Math.abs(R[1][1]);
	rb = bsize[0] * Math.abs(R[0][2]) + bsize[2] * Math.abs(R[0][0]);
	t = Math.abs(T[2] * R[1][1] - T[1] * R[2][1]);

	if (t > ra + rb)
	{
		return false;
	}

	ra = asize[1] * Math.abs(R[2][2]) + asize[2] * Math.abs(R[1][2]);
	rb = bsize[0] * Math.abs(R[0][1]) + bsize[1] * Math.abs(R[0][0]);
	t = Math.abs(T[2] * R[1][2] - T[1] * R[2][2]);

	if (t > ra + rb)
	{
		return false;
	}

	ra = asize[0] * Math.abs(R[2][0]) + asize[2] * Math.abs(R[0][0]);
	rb = bsize[1] * Math.abs(R[1][2]) + bsize[2] * Math.abs(R[1][1]);
	t = Math.abs(T[0] * R[2][0] - T[2] * R[0][0]);

	if (t > ra + rb)
	{
		return false;
	}

	ra = asize[0] * Math.abs(R[2][1]) + asize[2] * Math.abs(R[0][1]);
	rb = bsize[0] * Math.abs(R[1][2]) + bsize[2] * Math.abs(R[1][0]);
	t = Math.abs(T[0] * R[2][1] - T[2] * R[0][1]);

	if (t > ra + rb)
	{
		return false;
	}

	ra = asize[0] * Math.abs(R[2][2]) + asize[2] * Math.abs(R[0][2]);
	rb = bsize[0] * Math.abs(R[1][1]) + bsize[1] * Math.abs(R[1][0]);
	t = Math.abs(T[0] * R[2][2] - T[2] * R[0][2]);

	if (t > ra + rb)
	{
		return false;
	}

	ra = asize[0] * Math.abs(R[1][0]) + asize[1] * Math.abs(R[0][0]);
	rb = bsize[1] * Math.abs(R[2][2]) + bsize[2] * Math.abs(R[2][1]);
	t = Math.abs(T[1] * R[0][0] - T[0] * R[1][0]);

	if (t > ra + rb)
	{
		return false;
	}

	ra = asize[0] * Math.abs(R[1][1]) + asize[1] * Math.abs(R[0][1]);
	rb = bsize[0] * Math.abs(R[2][2]) + bsize[2] * Math.abs(R[2][0]);
	t = Math.abs(T[1] * R[0][1] - T[0] * R[1][1]);

	if (t > ra + rb)
	{
		return false;
	}

	ra = asize[0] * Math.abs(R[1][2]) + asize[1] * Math.abs(R[0][2]);
	rb = bsize[0] * Math.abs(R[2][1]) + bsize[1] * Math.abs(R[2][0]);
	t = Math.abs(T[1] * R[0][2] - T[0] * R[1][2]);

	if (t > ra + rb)
	{
		return false;
	}

	return true;
}

class Box extends Mesh
{
	constructor(glIn)
	{
		super('Box', glIn);

		this.vaoID = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.vaoID);
		this.kd = vec3.fromValues(0.1, 0.1, 0.2);

		this.nVerts = 36;

		this.genPositions();
		this.genNormals();
		this.genUVs();
		this.genTans();
	}

	genPositions()
	{
		var pos = [];

		var hx = 0.5;
	    var hy = 0.5;
	    var hz = 0.5;

	    // Front

	    pos.push(vec3.fromValues(hx, hy, hz));
	    pos.push(vec3.fromValues(hx, -hy, hz));
	    pos.push(vec3.fromValues(hx, -hy, -hz));
	    pos.push(vec3.fromValues(hx, hy, hz));
	    pos.push(vec3.fromValues(hx, -hy, -hz));
	    pos.push(vec3.fromValues(hx, hy, -hz));
	    pos.push(vec3.fromValues(-hx, -hy, hz));
	    pos.push(vec3.fromValues(-hx, hy, hz));
	    pos.push(vec3.fromValues(-hx, hy, -hz));
	    pos.push(vec3.fromValues(-hx, -hy, hz));
	    pos.push(vec3.fromValues(-hx, hy, -hz));
	    pos.push(vec3.fromValues(-hx, -hy, -hz));
	    pos.push(vec3.fromValues(-hx, hy, hz));
	    pos.push(vec3.fromValues(hx, hy, hz));
	    pos.push(vec3.fromValues(hx, hy, -hz));
	    pos.push(vec3.fromValues(-hx, hy, hz));
	    pos.push(vec3.fromValues(hx, hy, -hz));
	    pos.push(vec3.fromValues(-hx, hy, -hz));
	    pos.push(vec3.fromValues(hx, -hy, hz));
	    pos.push(vec3.fromValues(-hx, -hy, hz));
	    pos.push(vec3.fromValues(-hx, -hy, -hz));
	    pos.push(vec3.fromValues(hx, -hy, hz));
	    pos.push(vec3.fromValues(-hx, -hy, -hz));
	    pos.push(vec3.fromValues(hx, -hy, -hz));
	    pos.push(vec3.fromValues(hx, hy, hz));
	    pos.push(vec3.fromValues(-hx, hy, hz));
	    pos.push(vec3.fromValues(-hx, -hy, hz));
	    pos.push(vec3.fromValues(hx, hy, hz));
	    pos.push(vec3.fromValues(-hx, -hy, hz));
	    pos.push(vec3.fromValues(hx, -hy, hz));
	    pos.push(vec3.fromValues(-hx, hy, -hz));
	    pos.push(vec3.fromValues(hx, hy, -hz));
	    pos.push(vec3.fromValues(hx, -hy, -hz));
	    pos.push(vec3.fromValues(-hx, hy, -hz));
	    pos.push(vec3.fromValues(hx, -hy, -hz));
	    pos.push(vec3.fromValues(-hx, -hy, -hz));

	    var pos32 = new Float32Array(pos.length * 3);

	    for(var i = 0; i < pos.length; i++)
	    {
	    	pos32[3 * i] = pos[i][0];
	    	pos32[3 * i + 1] = pos[i][1];
	    	pos32[3 * i + 2] = pos[i][2];
	    }

	    this.posVboID = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posVboID);
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, pos32, gl.STATIC_DRAW, 0, pos32.length);

	    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(0);
	}

	genNormals()
	{
		var norms = [];

	    norms.push(vec3.fromValues(1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    norms.push(vec3.fromValues(0.0, 1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, 1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, 1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, 1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, 1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, 1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, -1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, -1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, -1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, -1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, -1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, -1.0, 0.0));
	    norms.push(vec3.fromValues(0.0, 0.0, 1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, 1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, 1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, 1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, 1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, 1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, -1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, -1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, -1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, -1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, -1.0));
	    norms.push(vec3.fromValues(0.0, 0.0, -1.0));

	    var norms32 = new Float32Array(norms.length * 3);

	    for(var i = 0; i < norms.length; i++)
	    {
	    	norms32[3 * i]     = norms[i][0];
	    	norms32[3 * i + 1] = norms[i][1];
	    	norms32[3 * i + 2] = norms[i][2];
	    }

	    this.normVboID = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normVboID);
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, norms32, this.gl.STATIC_DRAW, 0, norms32.length);

	    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(1);
	}

	genUVs()
	{
		var uvs = [];

	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 0.0));
	    uvs.push(vec2.fromValues(0.0, 1.0));
	    uvs.push(vec2.fromValues(1.0, 1.0));

	    var uvs32 = new Float32Array(uvs.length * 2);

	    for(var i = 0; i < uvs.length; i++)
	    {
	    	uvs32[2 * i]     = uvs[i][0];
	    	uvs32[2 * i + 1] = uvs[i][1];
	    }

	    this.uvVboID = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvVboID);
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, uvs32, this.gl.STATIC_DRAW, 0, uvs32.length);

	    this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(2);
	}

	genTans()
	{
		var tans = [];

	    tans.push(vec3.fromValues(0.0, 1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, 1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, 1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, 1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, 1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, 1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, -1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, -1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, -1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, -1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, -1.0, 0.0));
	    tans.push(vec3.fromValues(0.0, -1.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));
	    tans.push(vec3.fromValues(-1.0, 0.0, 0.0));

	    var tans32 = new Float32Array(tans.length * 3);

	    for(var i = 0; i < tans.length; i++)
	    {
	    	tans32[3 * i]     = tans[i][0];
	    	tans32[3 * i + 1] = tans[i][1];
	    	tans32[3 * i + 2] = tans[i][2];
	    }

	    this.tanVboID = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tanVboID);
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, tans32, this.gl.STATIC_DRAW, 0, tans32.length);

	    this.gl.vertexAttribPointer(3, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(3);
	}

	draw()
	{
		this.gl.bindVertexArray(this.vaoID);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 36);
	}
}