
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
	with (Fields)
	{
		function SplinePositionInterpolator2D (executionContext)
		{
			X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .SplinePositionInterpolator2D);
		}

		SplinePositionInterpolator2D .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
		{
			constructor: SplinePositionInterpolator2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",      new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "closed",            new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "key",               new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",          new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "keyVelocity",       new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "normalizeVelocity", new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed",     new SFVec2f ()),
			]),
			getTypeName: function ()
			{
				return "SplinePositionInterpolator2D";
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

		return SplinePositionInterpolator2D;
	}
});

