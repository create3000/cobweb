
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/SFVecPrototypeTemplate",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector4",
],
function ($, X3DField, SFVecPrototypeTemplate, X3DConstants, Vector4)
{
"use strict";

	function SFVec4Template (TypeName, Type)
	{
		function SFVec4 (x, y, z, w)
		{
			if (arguments .length)
			{
				if (arguments [0] instanceof Vector4)
					return X3DField .call (this, arguments [0]);

				return X3DField .call (this, new Vector4 (+x, +y, +z, +w));
			}

			return X3DField .call (this, new Vector4 (0, 0, 0, 0));
		}
	
		SFVec4 .prototype = $.extend (Object .create (X3DField .prototype),
			SFVecPrototypeTemplate (Vector4),
		{
			constructor: SFVec4,
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
	
		var z = {
			get: function ()
			{
				return this .getValue () .z;
			},
			set: function (value)
			{
				this .getValue () .z = value;
				this .addEvent ();
			},
			enumerable: true,
			configurable: false
		};
	
		var w = {
			get: function ()
			{
				return this .getValue () .w;
			},
			set: function (value)
			{
				this .getValue () .w = value;
				this .addEvent ();
			},
			enumerable: true,
			configurable: false
		};
	
		Object .defineProperty (SFVec4 .prototype, "x", x);
		Object .defineProperty (SFVec4 .prototype, "y", y);
		Object .defineProperty (SFVec4 .prototype, "z", z);
		Object .defineProperty (SFVec4 .prototype, "w", w);
	
		x .enumerable = false;
		y .enumerable = false;
		z .enumerable = false;
		w .enumerable = false;
	
		Object .defineProperty (SFVec4 .prototype, "0", x);
		Object .defineProperty (SFVec4 .prototype, "1", y);
		Object .defineProperty (SFVec4 .prototype, "2", z);
		Object .defineProperty (SFVec4 .prototype, "3", w);

		return SFVec4;
	}

	return {
		SFVec4d: SFVec4Template ("SFVec4d", X3DConstants .SFVec4d),
		SFVec4f: SFVec4Template ("SFVec4f", X3DConstants .SFVec4f),
	};
});
