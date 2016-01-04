

define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/SFMatrixPrototypeTemplate",
	"cobweb/Fields/SFVec2",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix3",
],
function ($, X3DField, SFMatrixPrototypeTemplate, SFVec2, X3DConstants, Matrix3)
{
;"use strict";

	function SFMatrix3Template (TypeName, Type, SFVec2)
	{
		function SFMatrix3 (m00, m01, m02,
	                       m10, m11, m12,
	                       m20, m21, m22)
		{
			if (arguments .length)
			{
				if (arguments [0] instanceof Matrix3)
					return X3DField .call (this, arguments [0]);
	
				return X3DField .call (this, new Matrix3 (+m00, +m01, +m02,
	                                                   +m10, +m11, +m12,
	                                                   +m20, +m21, +m22));
			}

			return X3DField .call (this, new Matrix3 ());
		}
	
		SFMatrix3 .prototype = $.extend (Object .create (X3DField .prototype),
			SFMatrixPrototypeTemplate (Matrix3, SFVec2),
		{
			constructor: SFMatrix3,
			getTypeName: function ()
			{
				return TypeName;
			},
			getType: function ()
			{
				return Type;
			},
		});
	
		function defineProperty (i)
		{
			Object .defineProperty (SFMatrix3 .prototype, i,
			{
				get: function ()
				{
					return this .getValue () [i];
				},
				set: function (value)
				{
					this .getValue () [i] = value;
					this .addEvent ();
				},
				enumerable: false,
				configurable: false
			});
		}
	
		for (var i = 0; i < Matrix3 .prototype .length; ++ i)
			defineProperty (i);

		return SFMatrix3;
	}

	return {
		SFMatrix3d: SFMatrix3Template ("SFMatrix3d", X3DConstants .SFMatrix3d, SFVec2 .SFVec2d),
		SFMatrix3f: SFMatrix3Template ("SFMatrix3f", X3DConstants .SFMatrix3f, SFVec2 .SFVec2f),
	};
});
