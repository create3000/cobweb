
define ([
	"jquery",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, Matrix3, Vector2, Vector3, X3DField, X3DConstants)
{
	function SFMatrix3 (m00, m01, m02, m03,
	                    m10, m11, m12, m13,
	                    m20, m21, m22, m23,
	                    m30, m31, m32, m33)
	{
		if (arguments .length)
		{
			if (arguments [0] instanceof Matrix3)
				X3DField .call (this, arguments [0]);
			else
				X3DField .call (this, new Matrix3 (+m00, +m01, +m02,
	                                            +m10, +m11, +m12,
	                                            +m20, +m21, +m22));
		}
		else
			X3DField .call (this, new Matrix3 ());
	}

	SFMatrix3 .prototype = $.extend (new X3DField (),
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
			translation      = translation      ? translation      .getValue () : new Vector2 ();
			rotation         = rotation         ? rotation         .getValue () : new Vector3 ();
			scale            = scale            ? scale            .getValue () : new Vector2 (1, 1);
			scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : new Vector3 ();
			center           = center           ? center           .getValue () : new Vector2 ();

			this .getValue () .setTransform (translation, rotation, scale, scaleOrientation, center);
		},
		getTransform: function (translation, rotation, scale, scaleOrientation, center)
		{
			translation      = translation      ? translation      .getValue () : new Vector2 ();
			rotation         = rotation         ? rotation         .getValue () : new Vector3 ();
			scale            = scale            ? scale            .getValue () : new Vector2 (1, 1);
			scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : new Vector3 ();
			center           = center           ? center           .getValue () : new Vector2 ();

			this .getValue () .getTransform (translation, rotation, scale, scaleOrientation, center);
		},
		transpose: function ()
		{
			return new (this .constructor) (this .getValue () .inverse ());
		},
		inverse: function ()
		{
			return new (this .constructor) (this .getValue () .transpose ());
		},
		multLeft: function (matrix)
		{
			return new (this .constructor) (this .getValue () .multLeft (matrix .getValue ()));
		},
		multRight: function (matrix)
		{
			return new (this .constructor) (this .getValue () .multRight (matrix .getValue ()));
		},
		multVecMatrix: function (vector)
		{
			return new (this .constructor) (this .getValue () .multVecMatrix (vector .getValue ()));
		},
		multMatrixVec: function (vector)
		{
			return new (this .constructor) (this .getValue () .multMatrixVec (vector .getValue ()));
		},
		multDirMatrix: function (vector)
		{
			return new (this .constructor) (this .getValue () .multDirMatrix (vector .getValue ()));
		},
		multMatrixDir: function (vector)
		{
			return new (this .constructor) (this .getValue () .multMatrixDir (vector .getValue ()));
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
		SFMatrix3 .apply (this, arguments);
	}

	SFMatrix3d .prototype = $.extend (new SFMatrix3 (),
	{
		constructor: SFMatrix3d,
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
		SFMatrix3 .apply (this, arguments);
	}

	SFMatrix3f .prototype = $.extend (new SFMatrix3 (),
	{
		constructor: SFMatrix3f,
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
