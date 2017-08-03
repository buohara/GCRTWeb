class Model
{
	constructor(name)
	{
		this._name = name;
	}

	set material(material)
	{
		this._material = material;
	}

	set mesh(mesh)
	{
		this._mesh = mesh;
	}

	get name()
	{
		return this._name;
	}

	get bbox()
	{
		return this._mesh.bbox;
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

	rotate(axis, angle)
	{
		this._mesh.rotate(axis, angle);
	}

	accel(a)
	{
		this._mesh.accel(a);
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