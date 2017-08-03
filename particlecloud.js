class ParticleCloud extends Mesh
{
	constructor(gl, numParticles)
	{
		super('Particles', gl);

		this.gl = gl;
		this.vaoID = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.vaoID);
		var numSinks = 5;
		this.sinks = [];
		this.sinkMasses = [];

		this.particleMass = 0.02;
		this.particlePos = [];
		this.particleVel = [];

		for (var i = 0; i < numSinks; i++)
		{
			this.sinkMasses[i] = Math.random() * 50.0;

			var x = 6.0 * Math.random() - 3.0;
			var y = 6.0 * Math.random() - 3.0;
			var z = 6.0 * Math.random() - 3.0;

			this.sinks[i] = vec3.fromValues(x, y, z);
		}

		var pos32 = new Float32Array(3 * numParticles);

		for (var i = 0; i < numParticles; i++)
		{
			var x = 3.0 * Math.random() - 6.0;
			var y = 3.0 * Math.random() - 6.0;
			var z = 3.0 * Math.random() - 6.0;

			var vx = 6.0 * Math.random() - 3.0;
			var vy = 6.0 * Math.random() - 3.0;
			var vz = 6.0 * Math.random() - 3.0;

			this.particlePos[i] = vec3.fromValues(x, y, z);
			this.particleVel[i] = vec3.fromValues(vx, vy, vz);

			pos32[3 * i] 		= x;
			pos32[3 * i + 1] 	= y;
			pos32[3 * i + 2] 	= z;
		}

		this.vboID = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vboID);
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, pos32, gl.DYNAMIC_DRAW, 0, pos32.length);

	    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(0);
	}

	update(dt)
	{
		var invMass = 1.0 / this.particleMass;

		for (var i = 0; i < this.particlePos.length; i++)
		{
			var force = vec3.fromValues(0.0, 0.0, 0.0);

			for (var j = 0; j < this.sinks.length; j++)
			{
				var massProduct = this.particleMass * this.sinkMasses[j];

				var curForce = vec3.create();
				vec3.subtract(curForce, this.sinks[j], this.particlePos[i]);
				vec3.normalize(curForce, curForce);
				vec3.scaleAndAdd(force, force, curForce, massProduct);
			}

			vec3.scaleAndAdd(
				this.particlePos[i],
				this.particlePos[i],
				this.particleVel[i],
				dt
			);
			
			vec3.scaleAndAdd(
				this.particleVel[i],
				this.particleVel[i],
				force, 0.01 * dt * invMass
			);
		}

		var pos32 = new Float32Array(3 * this.particlePos.length);

		for (var i = 0; i < this.particlePos.length; i++)
		{
			pos32[3 * i] 		= this.particlePos[i][0];
			pos32[3 * i + 1] 	= this.particlePos[i][1];
			pos32[3 * i + 2] 	= this.particlePos[i][2];
		}

		this.gl.bindVertexArray(this.vaoID);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vboID);
	    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, pos32, 0, pos32.length);
	}

	draw()
	{
		this.gl.bindVertexArray(this.vaoID);
		this.gl.drawArrays(this.gl.POINTS, 0, this.particlePos.length);
	}
}