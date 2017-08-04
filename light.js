class PointLight
{
	constructor(posIn, colorIn)
	{
		this.type 	= 'Point';
		this.pos 	= posIn;
		this.color 	= colorIn;
	}

	toJSON()
	{
		var me = 
		{
			type : this.type,
			pos : [this.pos[0], this.pos[1], this.pos[2]],
			color : [this.color[0], this.color[1], this.color[2]]
		};

		return me;
	}

	get Pos()
	{
		return this.pos;
	}

	get Color()
	{
		return this.color;
	}
}