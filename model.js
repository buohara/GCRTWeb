class Model
{
	constructor(name)
	{
		this.name = name;
	}

	set material(material)
	{
		this._material = material;
	}

	set mesh(mesh)
	{
		this._mesh = mesh;
	}

	setMeshUniforms(prog)
	{
		this._mesh.setMeshUniforms(prog);
	}

	setMaterialUniforms(prog)
	{
		this._material.setMaterialUniforms(prog);
	}

	translate(tx)
	{
		this._mesh.translate(tx);
	}

	scale(scl)
	{	
		this._mesh.scale(scl);
	}

	update(dt)
	{
		this._mesh.update(dt);
	}

	draw()
	{
		this._mesh.draw();
	}
}