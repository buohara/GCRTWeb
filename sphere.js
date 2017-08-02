class Sphere extends Mesh
{
	constructor(glIn, rings, sectors, invert)
	{
		super('Sphere', glIn);

		this.invert = invert;
		this.vaoID = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.vaoID);
		this.kd = vec3.fromValues(0.1, 0.1, 0.2);

		this.genPositions(rings, sectors);
		this.genNormals(rings, sectors);
		this.genUVs(rings, sectors);
		this.genTans(rings, sectors);
	}

	genPositions(rings, sectors)
	{
		var dtheta = Math.PI / (rings + 2);
	    var dphi = 2 * Math.PI / sectors;
	    var pos = [];

	    for (var i = 0; i < rings; i++)
	    {
	        var x = Math.sin(dtheta * (i + 1));
	        var y = 0;
	        var z = Math.cos(dtheta * (i + 1));

	        pos.push(vec3.fromValues(x, y, z));

	        for (var j = 0; j < sectors; j++)
	        {
	            x = Math.sin(dtheta * (i + 2)) * Math.cos(dphi * j);
	            y = Math.sin(dtheta * (i + 2)) * Math.sin(dphi * j);
	            z = Math.cos(dtheta * (i + 2));

	            pos.push(vec3.fromValues(x, y, z));

	            x = Math.sin(dtheta * (i + 1)) * Math.cos(dphi * (j + 1));
	            y = Math.sin(dtheta * (i + 1)) * Math.sin(dphi * (j + 1));
	            z = Math.cos(dtheta * (i + 1));

	            pos.push(vec3.fromValues(x, y, z));
	        }

	        x = Math.sin(dtheta * (i + 2));
	        y = 0;
	        z = Math.cos(dtheta * (i + 2));

	        pos.push(vec3.fromValues(x, y, z));
	    }

	    // Caps as a pair of triangle fans.

	    this.numSideVerts = pos.length;
	    this.topOffset = pos.length;

	    pos.push(vec3.fromValues(0.0, 0.0, 1.0));

	    for (var i = 0; i < sectors + 1; i++)
	    {
	        var x = Math.sin(dtheta) * Math.cos(i * dphi);
	        var y = Math.sin(dtheta) * Math.sin(i * dphi);
	        var z = Math.cos(dtheta);

	        pos.push(vec3.fromValues(x, y, z));
	    }

	    this.bottomOffset = pos.length;
	    this.numCapVerts = this.bottomOffset - this.topOffset;

	    pos.push(vec3.fromValues(0.0, 0.0, -1.0));

	    for (var i = 0; i < sectors + 1; i++)
	    {
	        var x = Math.sin(dtheta) * Math.cos(i * dphi);
	        var y = -Math.sin(dtheta) * Math.sin(i * dphi);
	        var z = -Math.cos(dtheta);

	        pos.push(vec3.fromValues(x, y, z));
	    }

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

	genNormals(rings, sectors)
	{
		var dtheta = Math.PI / (rings + 2);
	    var dphi = 2 * Math.PI / sectors;
	    var norms = [];
	    var n;

	    for (var i = 0; i < rings; i++)
	    {
	        var x = Math.sin(dtheta * (i + 1));
	        var y = 0;
	        var z = Math.cos(dtheta * (i + 1));
	        
	        n = vec3.fromValues(x, y, z);
	        vec3.normalize(n, n);
	        norms.push(n);

	        for (var j = 0; j < sectors; j++)
	        {
	            x = Math.sin(dtheta * (i + 2)) * Math.cos(dphi * j);
	            y = Math.sin(dtheta * (i + 2)) * Math.sin(dphi * j);
	            z = Math.cos(dtheta * (i + 2));
	            
	            n = vec3.fromValues(x, y, z);
		        vec3.normalize(n, n);
		        norms.push(n);

	            x = Math.sin(dtheta * (i + 1)) * Math.cos(dphi * (j + 1));
	            y = Math.sin(dtheta * (i + 1)) * Math.sin(dphi * (j + 1));
	            z = Math.cos(dtheta * (i + 1));
	            
	            n = vec3.fromValues(x, y, z);
		        vec3.normalize(n, n);
		        norms.push(n);
	        }

	        x = Math.sin(dtheta * (i + 2));
	        y = 0;
	        z = Math.cos(dtheta * (i + 2));
	        
	        n = vec3.fromValues(x, y, z);
	        vec3.normalize(n, n);
	        norms.push(n);
	    }

	    norms.push(vec3.fromValues(0, 0, 1.0));

	    for (var i = 0; i < sectors + 1; i++)
	    {
	        var x = Math.sin(dtheta) * Math.cos(i * dphi);
	        var y = Math.sin(dtheta) * Math.sin(i * dphi);
	        var z = Math.cos(dtheta);
	        
	        n = vec3.fromValues(x, y, z);
	        vec3.normalize(n, n);
	        norms.push(n);
	    }

	    norms.push(vec3.fromValues(0, 0, -1.0));

	    for (var i = 0; i < sectors + 1; i++)
	    {
	        var x = Math.sin(dtheta) * Math.cos(i * dphi);
	        var y = -Math.sin(dtheta) * Math.sin(i * dphi);
	        var z = -Math.cos(dtheta);
	        
	        n = vec3.fromValues(x, y, z);
	        vec3.normalize(n, n);
	        norms.push(n);
	    }

	    var norms32 = new Float32Array(norms.length * 3);

	    for (var i = 0; i < norms.length; i++)
	    {
	    	var flip = 1.0;
	    	if (this.invert == true)
	    	{
	    		flip = -1.0;
	    	}

	    	norms32[3 * i]     = flip * norms[i][0];
	    	norms32[3 * i + 1] = flip * norms[i][1];
	    	norms32[3 * i + 2] = flip * norms[i][2];
	    }

	    this.normVboID = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normVboID);
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, norms32, this.gl.STATIC_DRAW, 0, norms32.length);

	    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(1);
	}

	genUVs(rings, sectors)
	{
		var du = 1 / sectors;
		var dv = 1 / (rings + 2);
		var uvs = [];

		for (var i = 0; i < rings; i++)
	    {
	        var u = 0;
	        var v = dv * (i + 1);

	        uvs.push(vec2.fromValues(u, v));

	        for (var j = 0; j < sectors; j++)
	        {
	            u = du * j;
	            v = dv * (i + 2);
	            uvs.push(vec2.fromValues(u, v));

	            u = du * (j + 1);
	            v = dv * (i + 1);
	            uvs.push(vec2.fromValues(u, v));
	        }

	        u = 1.0;
	        v = dv * (i + 2);

	        uvs.push(vec2.fromValues(u, v));
	    }

	    uvs.push(vec2.fromValues(0.5, 0.0));

	    for (var i = 0; i < sectors + 1; i++)
	    {
	        var u = i * du;
	        var v = dv;
	        uvs.push(vec2.fromValues(u, v));
	    }

	    uvs.push(vec2.fromValues(0.5, 1.0));

	    for (var i = 0; i < sectors + 1; i++)
	    {
	        var u = i * du;
	        var v = 1 - dv;

	        uvs.push(vec2.fromValues(u, v));
	    }

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

	genTans(rings, sectors)
	{
		var dtheta = Math.PI / (rings + 2);
	    var dphi = 2 * Math.PI / sectors;
	    var tans = [];
	    var n;

	    for (var i = 0; i < rings; i++)
	    {
	        var x = 0;
	        var y = Math.sin(dtheta * (i + 1));
	        var z = 0;
	        
	        n = vec3.fromValues(x, y, z);
	        vec3.normalize(n, n);
	        tans.push(n);

	        for (var j = 0; j < sectors; j++)
	        {
	            x = -Math.sin(dtheta * (i + 2)) * Math.sin(dphi * j);
	            y = Math.sin(dtheta * (i + 2)) * Math.cos(dphi * j);
	            z = 0;
	            
	            n = vec3.fromValues(x, y, z);
		        vec3.normalize(n, n);
		        tans.push(n);

	            x = -Math.sin(dtheta * (i + 1)) * Math.sin(dphi * (j + 1));
	            y = Math.sin(dtheta * (i + 1)) * Math.cos(dphi * (j + 1));
	            z = 0;
	            
	            n = vec3.fromValues(x, y, z);
		        vec3.normalize(n, n);
		        tans.push(n);
	        }

	        x = 0;
	        y = Math.sin(dtheta * (i + 2));
	        z = 0;
	        
	        n = vec3.fromValues(x, y, z);
	        vec3.normalize(n, n);
	        tans.push(n);
	    }

	    tans.push(vec3.fromValues(0.0, 1.0, 0.0));

	    for (var i = 0; i < sectors + 1; i++)
	    {
	        var x = -Math.sin(dtheta) * Math.sin(i * dphi);
	        var y = Math.sin(dtheta) * Math.cos(i * dphi);
	        var z = 0;
	        
	        n = vec3.fromValues(x, y, z);
	        vec3.normalize(n, n);
	        tans.push(n);
	    }

	    tans.push(vec3.fromValues(0.0, 1.0, 0.0));

	    for (var i = 0; i < sectors + 1; i++)
	    {
	        var x = -Math.sin(dtheta) * Math.sin(i * dphi);
	        var y = -Math.sin(dtheta) * Math.cos(i * dphi);
	        var z = 0;
	        
	        n = vec3.fromValues(x, y, z);
	        vec3.normalize(n, n);
	        tans.push(n);
	    }

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
		if (this.invert == true)
		{
			this.gl.cullFace(gl.FRONT);
		}

		this.gl.bindVertexArray(this.vaoID);
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.numSideVerts);
		this.gl.drawArrays(gl.TRIANGLE_FAN, this.topOffset, this.numCapVerts);
	    this.gl.drawArrays(gl.TRIANGLE_FAN, this.bottomOffset, this.numCapVerts);

	    if (this.invert == true)
		{
			this.gl.cullFace(gl.BACK);
		}
	}
}