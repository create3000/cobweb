
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/SFVecPrototypeTemplate",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($, X3DField, SFVecPrototypeTemplate, X3DConstants, Vector3)
{
"use strict";

	function SFVec3Template (TypeName, Type)
	{
		function SFVec3 (x, y, z)
		{
			if (arguments .length)
			{
				if (arguments [0] instanceof Vector3)
					return X3DField .call (this, arguments [0]);

				return X3DField .call (this, new Vector3 (+x, +y, +z));
			}

			return X3DField .call (this, new Vector3 (0, 0, 0));
		}
	
		SFVec3 .prototype = $.extend (Object .create (X3DField .prototype),
			SFVecPrototypeTemplate (Vector3),
		{
			constructor: SFVec3,
			getTypeName: function ()
			{
				return TypeName;
			},
			getType: function ()
			{
				return Type;
			},
			cross: function (vector)
			{
				return new (this .constructor) (Vector3 .cross (this .getValue (), vector .getValue ()));
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
	
		Object .defineProperty (SFVec3 .prototype, "x", x);
		Object .defineProperty (SFVec3 .prototype, "y", y);
		Object .defineProperty (SFVec3 .prototype, "z", z);
	
		x .enumerable = false;
		y .enumerable = false;
		z .enumerable = false;
	
		Object .defineProperty (SFVec3 .prototype, "0", x);
		Object .defineProperty (SFVec3 .prototype, "1", y);
		Object .defineProperty (SFVec3 .prototype, "2", z);

		return SFVec3;
	}

	return {
		SFVec3d: SFVec3Template ("SFVec3d", X3DConstants .SFVec3d),
		SFVec3f: SFVec3Template ("SFVec3f", X3DConstants .SFVec3f),
	};
});
