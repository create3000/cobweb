
define ([
	"jquery",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, Matrix4, Vector3, Rotation4, X3DField, X3DConstants)
{
	function SFMatrix4 (m00, m01, m02, m03,
	                    m10, m11, m12, m13,
	                    m20, m21, m22, m23,
	                    m30, m31, m32, m33)
	{
		if (arguments .length)
		{
			if (arguments [0] instanceof Matrix4)
				X3DField .call (this, arguments [0]);
			else
				X3DField .call (this, new Matrix4 (+m00, +m01, +m02, +m03,
	                                            +m10, +m11, +m12, +m13,
	                                            +m20, +m21, +m22, +m23,
	                                            +m30, +m31, +m32, +m33));
		}
		else
			X3DField .call (this, new Matrix4 ());
	}

	SFMatrix4 .prototype = $.extend (new X3DField (),
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
		setTransform: function (translation, rotation, scale, scaleOrientation, center)
		{
			translation      = translation      ? translation      .getValue () : null;
			rotation         = rotation         ? rotation         .getValue () : null;
			scale            = scale            ? scale            .getValue () : null;
			scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : null;
			center           = center           ? center           .getValue () : null;

			this .getValue () .setTransform (translation, rotation, scale, scaleOrientation, center);
		},
		getTransform: function (translation, rotation, scale, scaleOrientation, center)
		{
			translation      = translation      ? translation      .getValue () : null;
			rotation         = rotation         ? rotation         .getValue () : null;
			scale            = scale            ? scale            .getValue () : null;
			scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : null;
			center           = center           ? center           .getValue () : null;

			this .getValue () .getTransform (translation, rotation, scale, scaleOrientation, center);
		},
		transpose: function ()
		{
			return new (this .constructor) (this .getValue () .copy () .transpose ());
		},
		inverse: function ()
		{
			return new (this .constructor) (this .getValue () .copy () .inverse ());
		},
		multLeft: function (matrix)
		{
			return new (this .constructor) (this .getValue () .copy () .multLeft (matrix .getValue ()));
		},
		multRight: function (matrix)
		{
			return new (this .constructor) (this .getValue () .copy () .multRight (matrix .getValue ()));
		},
		multVecMatrix: function (vector)
		{
			return new (this .constructor) (this .getValue () .multVecMatrix (vector .getValue () .copy ()));
		},
		multMatrixVec: function (vector)
		{
			return new (this .constructor) (this .getValue () .multMatrixVec (vector .getValue () .copy ()));
		},
		multDirMatrix: function (vector)
		{
			return new (this .constructor) (this .getValue () .multDirMatrix (vector .getValue () .copy ()));
		},
		multMatrixDir: function (vector)
		{
			return new (this .constructor) (this .getValue () .multMatrixDir (vector .getValue () .copy ()));
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
		SFMatrix4 .apply (this, arguments);
	}

	SFMatrix4d .prototype = $.extend (new SFMatrix4 (),
	{
		constructor: SFMatrix4d,
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
		SFMatrix4 .apply (this, arguments);
	}

	SFMatrix4f .prototype = $.extend (new SFMatrix4 (),
	{
		constructor: SFMatrix4f,
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
		SFMatrix4 .apply (this, arguments);
	}

	VrmlMatrix .prototype = $.extend (new SFMatrix4 (),
	{
		constructor: VrmlMatrix,
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
