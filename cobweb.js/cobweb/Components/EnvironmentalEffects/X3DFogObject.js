
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
	function X3DFogObject (browser, executionContext)
	{
		this .addType (X3DConstants .X3DFogObject);
	}

	X3DFogObject .prototype =
	{
		constructor: X3DFogObject,
		initialize: function ()
		{
			this .hidden = false;

			this .fogType_ .addInterest (this, "set_fogType__");

			this .set_fogType__ ();
		},
		set_fogType__: function ()
		{
			switch (this .fogType_ .getValue ())
			{
				case "EXPONENTIAL":
					this .fogType = 2;
					break;
				//case "EXPONENTIAL2":
				//	this .fogType = 3;
				//	break;
				default:
					this .fogType = 1;
					break;
			}
		},
		setHidden: function (value)
		{
			this .hidden = value;

			this .getBrowser () .addBrowserEvent ();
		},
		getHidden: function ()
		{
			return this .hidden;
		},
		use: function (gl, shader)
		{
			if (this .hidden)
				gl .uniform1i (shader .fogType, 0); // NO_FOG

			else
			{
				var
					color           = this .color_ .getValue (),
					visibilityRange = Math .max (0, this .visibilityRange_ .getValue ());

				if (visibilityRange === 0)
					visibilityRange = this .getCurrentNavigationInfo () .getFarPlane (this .getCurrentViewpoint ());

				gl .uniform1i (shader .fogType,            this .fogType);
				gl .uniform3f (shader .fogColor,           color .r, color .g, color .b);
				gl .uniform1f (shader .fogVisibilityRange, visibilityRange);
			}
		},
	};

	return X3DFogObject;
});

