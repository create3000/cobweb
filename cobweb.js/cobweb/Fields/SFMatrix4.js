
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/SFMatrixPrototypeTemplate",
	"cobweb/Fields/SFVec3",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
],
function ($, X3DField, SFMatrixPrototypeTemplate, SFVec3, X3DConstants, Matrix4)
{
;"use strict";

	function SFMatrix4Template (TypeName, Type, SFVec3)
	{
		function SFMatrix4 (m00, m01, m02, m03,
	                       m10, m11, m12, m13,
	                       m20, m21, m22, m23,
	                       m30, m31, m32, m33)
		{
			if (arguments .length)
			{
				if (arguments [0] instanceof Matrix4)
					return X3DField .call (this, arguments [0]);
	
				return X3DField .call (this, new Matrix4 (+m00, +m01, +m02, +m03,
	                                                   +m10, +m11, +m12, +m13,
	                                                   +m20, +m21, +m22, +m23,
	                                                   +m30, +m31, +m32, +m33));
			}

			return X3DField .call (this, new Matrix4 ());
		}
	
		SFMatrix4 .prototype = $.extend (Object .create (X3DField .prototype),
			SFMatrixPrototypeTemplate (Matrix4, SFVec3),
		{
			constructor: SFMatrix4,
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
			Object .defineProperty (SFMatrix4 .prototype, i,
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
	
		for (var i = 0; i < Matrix4 .prototype .length; ++ i)
			defineProperty (i);

		return SFMatrix4;
	}

	return {
		SFMatrix4d: SFMatrix4Template ("SFMatrix4d", X3DConstants .SFMatrix4d, SFVec3 .SFVec3d),
		SFMatrix4f: SFMatrix4Template ("SFMatrix4f", X3DConstants .SFMatrix4f, SFVec3 .SFVec3f),
		VrmlMatrix: SFMatrix4Template ("VrmlMatrix", X3DConstants .VrmlMatrix, SFVec3 .SFVec3f),
	};
});
