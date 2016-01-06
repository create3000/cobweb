
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Browser/Interpolation/CatmullRomSplineInterpolator3",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          CatmullRomSplineInterpolator3,
          X3DConstants)
{
"use strict";

	function SplinePositionInterpolator (executionContext)
	{
		X3DInterpolatorNode .call (this, executionContext);

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


