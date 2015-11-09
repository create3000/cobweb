
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants)
{
"use strict";

	function SplineScalarInterpolator (executionContext)
	{
		X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .SplineScalarInterpolator);
	}

	SplineScalarInterpolator .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
	{
		constructor: SplineScalarInterpolator,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",      new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "closed",            new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "key",               new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",          new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyVelocity",       new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "normalizeVelocity", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed",     new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "SplineScalarInterpolator";
		},
		getComponentName: function ()
		{
			return "Interpolation";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return SplineScalarInterpolator;
});


