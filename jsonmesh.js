class JSONMesh extends Mesh
{
	constructor(glIn, mesh)
	{
		super(glIn, 'Type');

		this.vaoID 		= this.gl.createVertexArray();
		
		this.gl.bindVertexArray(this.vaoID);
		this.model 		= mat4.create();
		this.kd 		= vec3.fromValues(0.3, 0.1, 0.1);

		this.vertices = [];
		this.normals  = [];
		this.uvs 	  = [];
		this.faces 	  = [];

		this.parseModel(mesh)
		this.uploadGeometry();
	}

	parseModel(mesh)
	{
		function isBitSet( value, position ) 
		{
			return value & ( 1 << position );
		}

		var i;
		var j; 
		var fi;
		var offset;
		var zLength;

		var colorIndex;
		var normalIndex; 
		var uvIndex;
		var materialIndex;
		var type;
		var isQuad;
		var hasMaterial;
		var hasFaceVertexUv;
		var hasFaceNormal;
		var hasFaceVertexNormal;
		var hasFaceColor;
		var hasFaceVertexColor;
		var vertex;
		var face;
		var faceA;
		var faceB;
		var hex;
		var normal;
		var uvLayer;
		var uv; 
		var u; 
		var v;

		var faces 		= mesh.faces;
		var vertices 	= mesh.vertices;
		var normals 	= mesh.normals;
		var colors 		= mesh.colors;
		var scale 		= mesh.scale;

		for (i = 0; i < mesh.metadata.vertices; i++)
		{
			vertex = vec3.create();

			vertex[0] = vertices[3 * i];
			vertex[1] = vertices[3 * i + 1];
			vertex[2] = vertices[3 * i + 2];

			this.vertices.push(vertex);
		}

		var nUvLayers = 0;

		if (mesh.uvs !== undefined) 
		{
			for (i = 0; i < mesh.uvs.length; i++)
			{
				if (json.uvs[i].length) 
				{
					nUvLayers++;
				}
			}

			for (i = 0; i < nUvLayers; i++) 
			{
				this.uvs[i].length = this.vertices.length;
			}
		}

		this.normals.length = this.vertices.length;

		offset = 0;
		zLength = faces.length;

		while (offset < zLength)
		{
			type = faces[offset++];

			isQuad 				= isBitSet(type, 0);
			hasMaterial 		= isBitSet(type, 1);
			hasFaceVertexUv 	= isBitSet(type, 3);
			hasFaceNormal 		= isBitSet(type, 4);
			hasFaceVertexNormal = isBitSet(type, 5);
			hasFaceColor 		= isBitSet(type, 6);
			hasFaceVertexColor 	= isBitSet(type, 7);

			if (isQuad) 
			{
				faceA = vec3.create();
				
				faceA[0] = faces[offset];
				faceA[1] = faces[offset + 1];
				faceA[2] = faces[offset + 3];

				faceB = vec3.create();
				
				faceB[0] = faces[offset + 1];
				faceB[1] = faces[offset + 2];
				faceB[2] = faces[offset + 3];

				offset += 4;

				if (hasMaterial) 
				{
					offset++;
					//materialIndex = faces[offset++];
					//faceA.materialIndex = materialIndex;
					//faceB.materialIndex = materialIndex;
				}

				if (hasFaceVertexUv) 
				{
					for (i = 0; i < nUvLayers; i++) 
					{
						uvLayer = mesh.uvs[i];

						for (j = 0; j < 4; j++)
						{
							uvIndex = faces[offset++];

							u = uvLayer[uvIndex * 2];
							v = uvLayer[uvIndex * 2 + 1];
							uv = vec2.fromValues(u,v);

							if (j == 0) 
							{
								this.uvs[i][faceA[0]] = uv;
							}

							else if (j == 1) 
							{
								this.uvs[i][faceA[1]] = uv;
								this.uvs[i][faceB[0]] = uv;
							}

							else if (j == 2) 
							{
								this.uvs[i][faceB[1]] = uv;
							}

							else 
							{
								this.uvs[i][faceA[2]] = uv;
								this.uvs[i][faceA[2]] = uv;
							}
						}
					}
				}

				if (hasFaceNormal) 
				{
					normalIndex = faces[offset++] * 3;

					var norm = vec3.fromValues(
						normals[normalIndex++],
						normals[normalIndex++],
						normals[normalIndex]
					);

					this.normals[faceA[0]] = norm;
					this.normals[faceA[1]] = norm;
					this.normals[faceA[2]] = norm;
					this.normals[faceB[0]] = norm;
					this.normals[faceB[1]] = norm;
					this.normals[faceB[2]] = norm;
				}

				if (hasFaceVertexNormal) 
				{
					for (i = 0; i < 4; i++)
					{
						normalIndex = faces[offset++] * 3;

						var norm = vec3.fromValues(
							normals[normalIndex++],
							normals[normalIndex++],
							normals[normalIndex]
						);

						if (i == 0) 
						{
							this.normals[faceA[0]] = norm;
						}

						else if (i == 1) 
						{
							this.normals[faceA[1]] = norm;
							this.normals[faceB[0]] = norm;
						}

						else if (i == 2) 
						{
							this.normals[faceB[1]] = norm;
						}

						else 
						{
							this.normals[faceA[2]] = norm;
							this.normals[faceA[2]] = norm;
						}
					}
				}

				if (hasFaceColor) 
				{
					offset++;
					//colorIndex = faces[ offset ++ ];
					//hex = colors[ colorIndex ];

					//faceA.color.setHex(hex);
					//faceB.color.setHex(hex);
				}

				if (hasFaceVertexColor)
				{
					offset += 4;
					/*
					for (i = 0; i < 4; i ++) 
					{
						colorIndex = faces[offset++];
						hex = colors[colorIndex];

						if (i !== 2) 
						{
							faceA.vertexColors.push(new Color(hex));
						}

						if (i !== 0) 
						{
							faceB.vertexColors.push(new Color(hex));
						}
					}
					*/
				}

				this.faces.push(faceA);
				this.faces.push(faceB);
			} 
			else 
			{
				face = vec3.create();
				face[0] = faces[offset++];
				face[1] = faces[offset++];
				face[2] = faces[offset++];

				if (hasMaterial) 
				{
					offset++;
					//materialIndex = faces[offset ++];
					//face.materialIndex = materialIndex;
				}

				if (hasFaceVertexUv) 
				{
					for (i = 0; i < nUvLayers; i++) 
					{
						uvLayer = mesh.uvs[i];

						for (j = 0; j < 3; j++)
						{
							uvIndex = faces[offset++];

							u = uvLayer[uvIndex * 2];
							v = uvLayer[uvIndex * 2 + 1];
							uv = vec2.fromValues(u, v);

							this.uvs[i][face[j]] = uv;
						}
					}	
				}

				if (hasFaceNormal) 
				{
					normalIndex = faces[offset++] * 3;

					var norm = vec3.fromValues(
						normals[normalIndex++],
						normals[normalIndex++],
						normals[normalIndex]
					);

					this.normals[face[0]] = norm;
					this.normals[face[1]] = norm;
					this.normals[face[2]] = norm;
				}

				if (hasFaceVertexNormal) 
				{
					for (i = 0; i < 3; i ++) 
					{
						normalIndex = faces[offset++] * 3;

						var norm = vec3.fromValues(
							normals[normalIndex++],
							normals[normalIndex++],
							normals[normalIndex]
						);

						this.normals[face[i]] = norm;
					}
				}

				if (hasFaceColor) 
				{
					offset++;
					//colorIndex = faces[ offset ++ ];
					//face.color.setHex( colors[ colorIndex ] );

				}

				if (hasFaceVertexColor) 
				{
					offset += 3;
					/*
					for (i = 0; i < 3; i++) 
					{
						colorIndex = faces[offset++];
						face.vertexColors.push(new Color(colors[colorIndex]));
					}
					*/
				}

				this.faces.push(face);
			}
		}
	}

	uploadGeometry()
	{
		// Positions.

		var pos32 = new Float32Array(3 * this.vertices.length);

		for (var i = 0; i < this.vertices.length; i++)
		{
			pos32[3 * i] = this.vertices[i][0];
			pos32[3 * i + 1] = this.vertices[i][1];
			pos32[3 * i + 2] = this.vertices[i][2];
		}

		this.posVboID = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posVboID);
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, pos32, gl.STATIC_DRAW, 0, pos32.length);

	    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(0);

    	// Normals.

    	var norm32 = new Float32Array(3 * this.normals.length);

		for (var i = 0; i < this.normals.length; i++)
		{
			norm32[3 * i] 		= this.normals[i][0];
			norm32[3 * i + 1] 	= this.normals[i][1];
			norm32[3 * i + 2] 	= this.normals[i][2];
		}

    	this.normVboID = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normVboID);
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, norm32, this.gl.STATIC_DRAW, 0, norm32.length);

	    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, gl.FALSE, 0, 0);
    	this.gl.enableVertexAttribArray(1);

    	// Faces.
    	
    	var faces = new Uint32Array(3 * this.faces.length);

		for (var i = 0; i < this.faces.length; i++)
		{
			faces[3 * i] 		= this.faces[i][0];
			faces[3 * i + 1] 	= this.faces[i][1];
			faces[3 * i + 2] 	= this.faces[i][2];
		}

		this.faceVboID = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.faceVboID);
	    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW, 0, faces.length);

    	this.vertices.length = 0;
    	this.vertices.length = 0;
	}

	draw()
	{
		this.gl.bindVertexArray(this.vaoID);
		this.gl.drawElements(this.gl.TRIANGLES, 3 * this.faces.length, gl.UNSIGNED_INT, 0);
	}
}