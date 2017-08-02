class Material
{
	constructor(name, glIn)
	{
		this.gl = glIn;
		this.name = name;
		this._kd = vec3.fromValues(0.3, 0.3, 0.3);
		this._ka = vec3.fromValues(0.1, 0.1, 0.1);
		
		this._di = 0.9;
		this._ai = 0.1;
		this._si = 0.0;
		this.ready = false;

		this._diffuseTex = this.gl.createTexture();
		this._ambientTex = this.gl.createTexture();
		this._normalTex = this.gl.createTexture();

		this.useNormalTex = false;
		this.useDiffuseTex = false;
		this.useAmbientTex = false;
	}

	set kd(kd)
	{
		this._kd = kd;
	}

	set ka(ka)
	{
		this._ka = ka;
	}

	set di(di)
	{
		this._di = di;
	}

	set ai(ai)
	{
		this._ai = ai;
	}

	set si(si)
	{
		this._si = si;
	}

	initTexture(texFile, texture)
	{
		var texImg = new Image();
		texImg.src = texFile;
		var myself = this;
		texImg.onload = function() { myself.handleTexLoad(texImg, texture); };
	}

	handleTexLoad(texImg, texture)
	{
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
		
		this.gl.texImage2D(
			this.gl.TEXTURE_2D, 
			0, 
			this.gl.RGBA, 
			this.gl.RGBA, 
			this.gl.UNSIGNED_BYTE,
			texImg
		);
		
		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_MAG_FILTER,
			this.gl.LINEAR
		);
		
		this.gl.texParameteri(
			this.gl.TEXTURE_2D, 
			this.gl.TEXTURE_MIN_FILTER, 
			this.gl.LINEAR_MIPMAP_NEAREST
		);
		
		this.gl.generateMipmap(this.gl.TEXTURE_2D);	
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		this.ready = true;
	}

	set ambientTex(ambientTexFile)
	{
		this.initTexture(ambientTexFile, this._ambientTex);
		this.useAmbientTex = true;
	}

	set diffuseTex(diffuseTexFile)
	{
		this.initTexture(diffuseTexFile, this._diffuseTex);
		this.useDiffuseTex = true;
	}

	set normalTex(normalTexFile)
	{
		this.initTexture(normalTexFile, this._normalTex);
		this.useNormalTex = true;
	}

	setMaterialUniforms(prog)
	{
		// Ambient light uniforms.

		var aiID = this.gl.getUniformLocation(prog, "ai");
		this.gl.uniform1f(aiID, this._ai);

		if (this.useAmbientTex == true)
		{
			this.gl.activeTexture(gl.TEXTURE0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this._ambientTex);

			var ambientTexID = this.gl.getUniformLocation(prog, "ambientTex");
			this.gl.uniform1i(ambientTexID, 0);

			var useAmbientTexID = this.gl.getUniformLocation(prog, "useAmbientTex");
			this.gl.uniform1i(useAmbientTexID, true);
		}
		else
		{
			var kaID = this.gl.getUniformLocation(prog, "ka");
			this.gl.uniform3fv(kaID, this._ka);

			var useAmbientTexID = this.gl.getUniformLocation(prog, "useAmbientTex");
			this.gl.uniform1i(useAmbientTexID, false);
		}

		// Diffuse light uniforms.

		var diID = this.gl.getUniformLocation(prog, "di");
		this.gl.uniform1f(diID, this._di);

		if (this.useDiffuseTex == true)
		{
			this.gl.activeTexture(gl.TEXTURE1);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this._diffuseTex);
			
			var diffTexID = this.gl.getUniformLocation(prog, "diffuseTex");
			this.gl.uniform1i(diffTexID, 1);

			var useDiffuseTexID = this.gl.getUniformLocation(prog, "useDiffuseTex");
			this.gl.uniform1i(useDiffuseTexID, true);
		}
		else
		{
			var kdID = this.gl.getUniformLocation(prog, "kd");
			this.gl.uniform3fv(kdID, this._kd);

			var useDiffuseTexID = this.gl.getUniformLocation(prog, "useDiffuseTex");
			this.gl.uniform1i(useDiffuseTexID, false);
		}

		// Normal texturing uniforms.

		if (this.useNormalTex == true)
		{
			this.gl.activeTexture(gl.TEXTURE2);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this._normalTex);

			var normTexID = this.gl.getUniformLocation(prog, "normalTex");
			this.gl.uniform1i(normTexID, 2);

			var useNormalTexID = this.gl.getUniformLocation(prog, "useNormalTex");
			this.gl.uniform1i(useNormalTexID, true);
		}
		else
		{
			var useNormalTexID = this.gl.getUniformLocation(prog, "useNormalTex");
			this.gl.uniform1i(useNormalTexID, false);
		}
	}
}