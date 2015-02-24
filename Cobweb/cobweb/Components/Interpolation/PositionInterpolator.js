
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
		function PositionInterpolator (executionContext)
		{
			X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PositionInterpolator);
		}

		PositionInterpolator .prototype = $.extend (new X3DInterpolatorNode (),
		{
			constructor: PositionInterpolator,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new MFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new SFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "PositionInterpolator";
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

		return PositionInterpolator;
	}
});

