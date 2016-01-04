
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/SFVecPrototypeTemplate",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
],
function ($, X3DField, SFVecPrototypeTemplate, X3DConstants, Vector2)
{
"use strict";

	function SFVec2Template (TypeName, Type)
	{
		function SFVec2 (x, y)
		{
			if (arguments .length)
			{
				if (arguments [0] instanceof Vector2)
					return X3DField .call (this, arguments [0]);

				return X3DField .call (this, new Vector2 (+x, +y));
			}

			return X3DField .call (this, new Vector2 (0, 0));
		}

		SFVec2 .prototype = $.extend (Object .create (X3DField .prototype),
			SFVecPrototypeTemplate (Vector2),
		{
			constructor: SFVec2,
			getTypeName: function ()
			{
				return TypeName;
			},
			getType: function ()
			{
				return Type;
			},
		});
	
		var x = {
			get: function ()
			{
				return this .getValue () .x;
			},
			set: function (value)
			{
				this .getValue () .x = value;
				this .addEvent ();
			},
			enumerable: true,
			configurable: false
		};
	
		var y = {
			get: function ()
			{
				return this .getValue () .y;
			},
			set: function (value)
			{
				this .getValue () .y = value;
				this .addEvent ();
			},
			enumerable: true,
			configurable: false
		};
	
		Object .defineProperty (SFVec2 .prototype, "x", x);
		Object .defineProperty (SFVec2 .prototype, "y", y);
	
		x .enumerable = false;
		y .enumerable = false;
	
		Object .defineProperty (SFVec2 .prototype, "0", x);
		Object .defineProperty (SFVec2 .prototype, "1", y);

		return SFVec2;
	}

	return {
		SFVec2d: SFVec2Template ("SFVec2d", X3DConstants .SFVec2d),
		SFVec2f: SFVec2Template ("SFVec2f", X3DConstants .SFVec2f),
	};
});
