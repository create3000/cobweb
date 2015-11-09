
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/SFVec3",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
],
function ($, X3DField, SFVec3, X3DConstants, Matrix4, Vector3, Rotation4)
{
"use strict";

	var
		SFVec3d = SFVec3 .SFVec3d,
		SFVec3f = SFVec3 .SFVec3f;

	function SFMatrix4 (m)
	{
		if (m .length)
		{
			if (m [0] instanceof Matrix4)
				return X3DField .call (this, m [0]);

			return X3DField .call (this, new Matrix4 (+m[ 0], +m[ 1], +m[ 2], +m[ 3],
                                                   +m[ 4], +m[ 5], +m[ 6], +m[ 7],
                                                   +m[ 8], +m[ 9], +m[10], +m[11],
                                                   +m[12], +m[13], +m[14], +m[15]));
		}

		return X3DField .call (this, new Matrix4 ());
	}

	SFMatrix4 .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFMatrix4,
		copy: function ()
		{
			return new (this .constructor) (this .getValue () .copy ());
		},
		equals: function (matrix)
		{
			return this .getValue () .equals (matrix .getValue ());
		},
		set: function (value)
		{
			this .getValue () .assign (value);
		},
		set: function (value)
		{
			this .getValue () .assign (value);
		},
		setTransform: function (translation, rotation, scale, scaleOrientation, center)
		{
			translation      = translation      ? translation      .getValue () : null;
			rotation         = rotation         ? rotation         .getValue () : null;
			scale            = scale            ? scale            .getValue () : null;
			scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : null;
			center           = center           ? center           .getValue () : null;

			this .getValue () .set (translation, rotation, scale, scaleOrientation, center);
		},
		getTransform: function (translation, rotation, scale, scaleOrientation, center)
		{
			translation      = translation      ? translation      .getValue () : null;
			rotation         = rotation         ? rotation         .getValue () : null;
			scale            = scale            ? scale            .getValue () : null;
			scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : null;
			center           = center           ? center           .getValue () : null;

			this .getValue () .get (translation, rotation, scale, scaleOrientation, center);
		},
		transpose: function ()
		{
			return new (this .constructor) (Matrix4 .transpose (this .getValue ()));
		},
		inverse: function ()
		{
			return new (this .constructor) (Matrix4 .inverse (this .getValue ()));
		},
		multLeft: function (matrix)
		{
			return new (this .constructor) (Matrix4 .multLeft (this .getValue (), matrix .getValue ()));
		},
		multRight: function (matrix)
		{
			return new (this .constructor) (Matrix4 .multRight (this .getValue (), matrix .getValue ()));
		},
		multVecMatrix: function (vector)
		{
			return new (this .Vector3) (this .getValue () .multVecMatrix (vector .getValue () .copy ()));
		},
		multMatrixVec: function (vector)
		{
			return new (this .Vector3) (this .getValue () .multMatrixVec (vector .getValue () .copy ()));
		},
		multDirMatrix: function (vector)
		{
			return new (this .Vector3) (this .getValue () .multDirMatrix (vector .getValue () .copy ()));
		},
		multMatrixDir: function (vector)
		{
			return new (this .Vector3) (this .getValue () .multMatrixDir (vector .getValue () .copy ()));
		},
		toString: function ()
		{
			return this .getValue () .toString ();
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

	/*
	 *  SFMatrix4d
	 */

	function SFMatrix4d (m00, m01, m02, m03,
	                     m10, m11, m12, m13,
	                     m20, m21, m22, m23,
	                     m30, m31, m32, m33)
	{
		if (this instanceof SFMatrix4d)
			return SFMatrix4 .call (this, arguments);
		
		return SFMatrix4 .call (Object .create (SFMatrix4d .prototype), arguments);
	}

	SFMatrix4d .prototype = $.extend (Object .create (SFMatrix4 .prototype),
	{
		constructor: SFMatrix4d,
		Vector3: SFVec3d,
		getTypeName: function ()
		{
			return "SFMatrix4d";
		},
		getType: function ()
		{
			return X3DConstants .SFMatrix4d;
		},
	});

	/*
	 *  SFMatrix4f
	 */

	function SFMatrix4f (m00, m01, m02, m03,
	                     m10, m11, m12, m13,
	                     m20, m21, m22, m23,
	                     m30, m31, m32, m33)
	{
		if (this instanceof SFMatrix4f)
			return SFMatrix4 .call (this, arguments);
		
		return SFMatrix4 .call (Object .create (SFMatrix4f .prototype), arguments);
	}

	SFMatrix4f .prototype = $.extend (Object .create (SFMatrix4 .prototype),
	{
		constructor: SFMatrix4f,
		Vector3: SFVec3f,
		getTypeName: function ()
		{
			return "SFMatrix4f";
		},
		getType: function ()
		{
			return X3DConstants .SFMatrix4f;
		},
	});

	/*
	 *  VrmlMatrix
	 */

	function VrmlMatrix (m00, m01, m02, m03,
	                     m10, m11, m12, m13,
	                     m20, m21, m22, m23,
	                     m30, m31, m32, m33)
	{
		if (this instanceof VrmlMatrix)
			SFMatrix4 .call (this, arguments);
		
		return SFMatrix4 .call (Object .create (VrmlMatrix .prototype), arguments);
	}

	VrmlMatrix .prototype = $.extend (Object .create (SFMatrix4 .prototype),
	{
		constructor: VrmlMatrix,
		Vector3: SFVec3f,
		getTypeName: function ()
		{
			return "VrmlMatrix";
		},
		getType: function ()
		{
			return X3DConstants .VrmlMatrix;
		},
	});

	return {
		SFMatrix4d: SFMatrix4d,
		SFMatrix4f: SFMatrix4f,
		VrmlMatrix: VrmlMatrix,
	};
});
