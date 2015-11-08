
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Fields/SFVec2",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
],
function ($, X3DField, SFVec2, X3DConstants, Matrix3, Vector2, Vector3)
{
"use strict";

	var
		SFVec2d = SFVec2 .SFVec2d,
		SFVec2f = SFVec2 .SFVec2f;

	function SFMatrix3 (m)
	{
		if (m .length)
		{
			if (m [0] instanceof Matrix3)
				return X3DField .call (this, m [0]);
	
			return X3DField .call (this, new Matrix3 (+m[0], +m[1], +m[2],
                                                   +m[3], +m[4], +m[5],
                                                   +m[6], +m[7], +m[8]));
		}

		return X3DField .call (this, new Matrix3 ());
	}

	SFMatrix3 .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFMatrix3,
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
		setTransform: function (translation, rotation, scale, scaleOrientation, center)
		{
			translation      = translation      ? translation      .getValue () : Vector2 .Zero;
			rotation         = rotation         ? rotation         .getValue () : Vector3 .Zero;
			scale            = scale            ? scale            .getValue () : Vector2 .One;
			scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : Vector3 .Zero;
			center           = center           ? center           .getValue () : Vector2 .Zero;

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
			return new (this .constructor) (Matrix3 .transpose (this .getValue ()));
		},
		inverse: function ()
		{
			return new (this .constructor) (Matrix3 .inverse (this .getValue ()));
		},
		multLeft: function (matrix)
		{
			return new (this .constructor) (Matrix3 .multLeft (this .getValue (), matrix .getValue ()));
		},
		multRight: function (matrix)
		{
			return new (this .constructor) (Matrix3 .multRight (this .getValue (), matrix .getValue ()));
		},
		multVecMatrix: function (vector)
		{
			return new (this .Vector2) (this .getValue () .multVecMatrix (vector .getValue () .copy ()));
		},
		multMatrixVec: function (vector)
		{
			return new (this .Vector2) (this .getValue () .multMatrixVec (vector .getValue () .copy ()));
		},
		multDirMatrix: function (vector)
		{
			return new (this .Vector2) (this .getValue () .multDirMatrix (vector .getValue () .copy ()));
		},
		multMatrixDir: function (vector)
		{
			return new (this .Vector2) (this .getValue () .multMatrixDir (vector .getValue () .copy ()));
		},
		toString: function ()
		{
			return this .getValue () .toString ();
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

	/*
	 *  SFMatrix3d
	 */

	function SFMatrix3d (m00, m01, m02,
	                     m10, m11, m12,
	                     m20, m21, m22)
	{
		if (this instanceof SFMatrix3d)
			return SFMatrix3 .call (this, arguments);
		
		return SFMatrix3 .call (Object .create (SFMatrix3d .prototype), arguments);
	}

	SFMatrix3d .prototype = $.extend (Object .create (SFMatrix3 .prototype),
	{
		constructor: SFMatrix3d,
		Vector2: SFVec2d,
		getTypeName: function ()
		{
			return "SFMatrix3d";
		},
		getType: function ()
		{
			return X3DConstants .SFMatrix3d;
		},
	});

	/*
	 *  SFMatrix3f
	 */

	function SFMatrix3f (m00, m01, m02,
	                     m10, m11, m12,
	                     m20, m21, m22)
	{
		if (this instanceof SFMatrix3f)
			return SFMatrix3 .call (this, arguments);
		
		return SFMatrix3 .call (Object .create (SFMatrix3f .prototype), arguments);
	}

	SFMatrix3f .prototype = $.extend (Object .create (SFMatrix3 .prototype),
	{
		constructor: SFMatrix3f,
		Vector2: SFVec2f,
		getTypeName: function ()
		{
			return "SFMatrix3f";
		},
		getType: function ()
		{
			return X3DConstants .SFMatrix3f;
		},
	});

	return {
		SFMatrix3d: SFMatrix3d,
		SFMatrix3f: SFMatrix3f,
	};
});
