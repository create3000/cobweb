
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants,
          Vector3,
          Vector4,
          Matrix4)
{
"use strict";

	var
		T  = [ ],
		Fp = [ ],
		Fm = [ ],
		S  = new Vector4 (0, 0, 0, 0);
		
	var H = new Matrix4 ( 2, -2,  1,  1,
			               -3,  3, -2, -1,
			                0,  0,  1,  0,
			                1,  0,  0,  0);

	function CatmullRomSplineInterpolator ()
	{
		this .T0 = [ ];
		this .T1 = [ ];
	}

	CatmullRomSplineInterpolator .prototype = {
		constructor: CatmullRomSplineInterpolator,
		generate: function (closed, key, keyValue, keyVelocity, normalizeVelocity)
		{
			var
				T0 = this .T0,
				T1 = this .T1;

			T0 .length = 0;
			T1 .length = 0;

			T  .length = 0;
			Fp .length = 0;
			Fm .length = 0;

			if (key .length > 1)
			{
				// T
		
				if (keyVelocity .length === 0)
				{
					if (closed)
						T .push (this .divide (this .subtract (keyValue [1] .getValue (), keyValue [keyValue .size () - 2] .getValue ()), 2));
		
					else
						T .push (this .create ());
		
					for (var i = 1, length = keyValue .length - 1; i < length; ++ i)
						T .push (this .divide (this .subtract (keyValue [i + 1] .getValue (), keyValue [i - 1] .getValue ()), 2));
		
					T .push (this .copy (T [0]));
				}
				else
				{
					for (var i = 0, length = keyVelocity .length; i < length; ++ i)
						T .push (this .copy (keyVelocity [i] .getValue ()));
		
					if (normalizeVelocity)
					{
						var Dtot = 0;
		
						for (var i = 0, length = keyValue .length - 1; i < length; ++ i)
							Dtot += this .abs (this .subtract (keyValue [i] .getValue (), keyValue [i + 1] .getValue ()));
		
						for (var i = 0, length = T .length - 1; i < length; ++ i)
							T [i] = this .multiply (T [i], Dtot / this .abs (T [i]));
					}
				}

				// Fm, Fp
		
				if (closed)
				{
					var i_1 = key .length - 1;
					var i_2 = key .length - 2;
		
					var d = key [1] .getValue () - key [0] .getValue () + key [i_1] .getValue () - key [i_2] .getValue ();
		
					Fm .push (2 * (key [1]   .getValue () - key [0]   .getValue ()) / d);
					Fp .push (2 * (key [i_1] .getValue () - key [i_2] .getValue ()) / d);

				}
				else
				{
					Fm .push (1);
					Fp .push (1);
				}

				for (var i = 1, length = key .length - 1; i < length; ++ i)
				{
					var d = key [i + 1] .getValue () - key [i - 1] .getValue ();
		
					Fm .push (2 * (key [i + 1] .getValue () - key [i]     .getValue ()) / d);
					Fp .push (2 * (key [i]     .getValue () - key [i - 1] .getValue ()) / d);
				}
		
				Fm .push (Fm [0]);
				Fp .push (Fp [0]);
		
				// T0, T1
		
				for (var i = 0, length = T .length; i < length; ++ i)
				{
					T0 .push (this .multiply (T [i], Fp [i]));
					T1 .push (this .multiply (T [i], Fm [i]));
				}
			}
			else
			{
				T0 .push (this .create ());
				T1 .push (this .create ());
			}
		},
		interpolate: function (index0, index1, weight, keyValue)
		{
			S .set (Math .pow (weight, 3), Math .pow (weight, 2), weight, 1);
		
			// Taking dot product from SH and C;

			return this .dot (H .multVecMatrix (S),
                           keyValue [index0] .getValue (),
                           keyValue [index1] .getValue (),
                           this .T0 [index0],
                           this .T1 [index1]);
		},
	};

	var
		c0 = new Vector3 (0, 0, 0),
		c1 = new Vector3 (0, 0, 0),
		c2 = new Vector3 (0, 0, 0),
		c3 = new Vector3 (0, 0, 0);

	function CatmullRomSplineInterpolator3 ()
	{
		this .T0 = [ ];
		this .T1 = [ ];
	}

	CatmullRomSplineInterpolator3 .prototype = $.extend (Object .create (CatmullRomSplineInterpolator .prototype),
	{
		constructor: CatmullRomSplineInterpolator3,
		create: function ()
		{
			return new Vector3 (0, 0, 0);
		},
		copy: function (value)
		{
			return value .copy ();
		},
		subtract: function (lhs, rhs)
		{
			return Vector3 .subtract (lhs, rhs);
		},
		multiply: function (lhs, rhs)
		{
			return Vector3 .multiply (lhs, rhs);
		},
		divide: function (lhs, rhs)
		{
			return Vector3 .divide (lhs, rhs);
		},
		abs: function (value)
		{
			return value .abs ();
		},
		dot: function (SH, C0, C1, C2, C3)
		{
			c0 .assign (C0) .multiply (SH [0]);
			c1 .assign (C1) .multiply (SH [1]);
			c2 .assign (C2) .multiply (SH [2]);
			c3 .assign (C3) .multiply (SH [3]);

			return c0 .add (c1) .add (c2) .add (c3);
		},
	});

	function SplinePositionInterpolator (executionContext)
	{
		X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .SplinePositionInterpolator);

		this .spline = new CatmullRomSplineInterpolator3 ();
	}

	SplinePositionInterpolator .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
	{
		constructor: SplinePositionInterpolator,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",      new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "closed",            new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "key",               new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",          new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyVelocity",       new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "normalizeVelocity", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed",     new Fields .SFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "SplinePositionInterpolator";
		},
		getComponentName: function ()
		{
			return "Interpolation";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DInterpolatorNode .prototype .initialize .call (this);
		
			this .keyValue_    .addInterest (this, "set_keyValue__");
			this .keyVelocity_ .addInterest (this, "set_keyVelocity__");
		},
		set_keyValue__: function ()
		{
			var
				key      = this .key_,
				keyValue = this .keyValue_;

			if (keyValue .length < key .length)
				keyValue .resize (key .length, keyValue .length ? keyValue [keyValue .length - 1] : new Fields .SFVec3f ());
		
			this .set_keyVelocity__ ();
		},
		set_keyVelocity__: function ()
		{
			if (this .keyVelocity_ .length)
			{
				if (this .keyVelocity_ .length < this .key_ .length)
					this .keyVelocity_ .resize (this .key_ .length, new Fields .SFVec3f ());
			}

			this .spline .generate (this .closed_            .getValue (),
			                        this .key_               .getValue (),
			                        this .keyValue_          .getValue (),
			                        this .keyVelocity_       .getValue (),
			                        this .normalizeVelocity_ .getValue ());
		},
		interpolate: function (index0, index1, weight)
		{
			this .value_changed_ = this .spline .interpolate (index0, index1, weight, this .keyValue_ .getValue ());
		},
	});

	return SplinePositionInterpolator;
});


