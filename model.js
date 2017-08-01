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

	draw()
	{
		this._mesh.draw();
	}
}