
define ([
	"jquery",
	"cobweb/Basic/X3DField",
],
function ($, X3DField)
{
;"use strict";

	return function (Matrix, SFVec)
	{
		return $.extend (Object .create (X3DField .prototype),
		{
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
				return new (this .constructor) (Matrix .transpose (this .getValue ()));
			},
			inverse: function ()
			{
				return new (this .constructor) (Matrix .inverse (this .getValue ()));
			},
			multLeft: function (matrix)
			{
				return new (this .constructor) (Matrix .multLeft (this .getValue (), matrix .getValue ()));
			},
			multRight: function (matrix)
			{
				return new (this .constructor) (Matrix .multRight (this .getValue (), matrix .getValue ()));
			},
			multVecMatrix: function (vector)
			{
				return new SFVec (this .getValue () .multVecMatrix (vector .getValue () .copy ()));
			},
			multMatrixVec: function (vector)
			{
				return new SFVec (this .getValue () .multMatrixVec (vector .getValue () .copy ()));
			},
			multDirMatrix: function (vector)
			{
				return new SFVec (this .getValue () .multDirMatrix (vector .getValue () .copy ()));
			},
			multMatrixDir: function (vector)
			{
				return new SFVec (this .getValue () .multMatrixDir (vector .getValue () .copy ()));
			},
			toString: function ()
			{
				return this .getValue () .toString ();
			},
		});
	};
});
